import React from "react";
import { FPS, Shockwave, SpeedLines, prog, rnd, useBeat, useT } from "../../../shared";
import type { Beat } from "../../../shared";
import { FONT, Fonts, Grain, MONO, RhymeText, Scanlines, Vignette, fitSize, rowFont } from "../../../styles/lyricmv";
import type { Pal } from "../../../styles/lyricmv";
import { LABEL, type LyricLine, type Row, type Shot, type Span } from "./lyrics";

const CPF_MAX = 1.15; // 逐字最快每字帧数（行越长越慢）

// ---------------------------------------------------------------- 词组折叠
// 逐字出现 → 按词组出现：chunks 里的范围原子出现（组内所有字同帧）；
// 其余范围分词（Intl.Segmenter，连续单字词合并为一个词组，枪声字独立成组并隔断合并）；
// bounds 为分词边界（词组不跨界，如 L01 雪 / L03 血 的单字段）。折叠后组内所有字共用组首字的帧。
const SEGMENTER = new Intl.Segmenter("zh", { granularity: "word" });
const collapseGroups = (line: LyricLine, flatF: number[]) => {
    const flatText = line.rows.map((r) => r.spans.map((s) => s.t).join("")).join("");
    const n = flatF.length;
    const isShot: boolean[] = [];
    for (const row of line.rows) for (const sp of row.spans) for (let i = 0; i < Array.from(sp.t).length; i++) isShot.push(!!sp.shot);
    const group = new Array(n).fill(-1);
    let g = 0;
    const assignWordGroups = (a: number, b: number) => {
        const words: number[][] = [];
        let off = a;
        for (const w of SEGMENTER.segment(flatText.slice(a, b + 1))) {
            const len = Array.from(w.segment).length;
            if (/\S/.test(w.segment)) words.push(Array.from({ length: len }, (_, i) => off + i));
            off += len;
        }
        let run: number[] | null = null;
        const flush = () => {
            if (run) {
                for (const i of run) group[i] = g;
                g++;
                run = null;
            }
        };
        for (const w of words) {
            if (w.some((i) => isShot[i])) {
                flush();
                for (const i of w) group[i] = g;
                g++;
                continue;
            }
            if (w.length === 1) run = run ? [...run, ...w] : [...w];
            else {
                flush();
                for (const i of w) group[i] = g;
                g++;
            }
        }
        flush();
    };
    const covered = new Array(n).fill(false);
    if (line.chunks) {
        for (const [a, b] of line.chunks) {
            for (let i = a; i <= b; i++) {
                group[i] = g;
                covered[i] = true;
            }
            g++;
        }
        let a = -1;
        for (let i = 0; i <= n; i++) {
            if (i < n && !covered[i]) {
                if (a < 0) a = i;
                continue;
            }
            if (a >= 0) {
                assignWordGroups(a, i - 1);
                a = -1;
            }
        }
    } else if (line.bounds) {
        for (const [a, b] of line.bounds) assignWordGroups(a, b);
    } else {
        assignWordGroups(0, n - 1);
    }
    const lead: (number | undefined)[] = [];
    for (let i = 0; i < n; i++) {
        const gi = group[i];
        if (gi >= 0 && lead[gi] === undefined) lead[gi] = flatF[i];
    }
    let last = -Infinity;
    for (let i = 0; i < n; i++) {
        const gi = group[i];
        let t = gi >= 0 ? lead[gi] ?? flatF[i] : flatF[i];
        if (t < last) t = last;
        flatF[i] = t;
        last = t;
    }
};

const rowText = (r: Row) => r.spans.map((s) => s.t).join("");
const typeChars = (r: Row) => r.spans.reduce((n, s) => n + (s.pop ? 0 : Array.from(s.t).length), 0);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// ---------------------------------------------------------------- 逐字 / 逐词 / 逐字母

// 逐字显示：未到的字保持占位（visibility:hidden），到点从右侧轻微滑入；shot = 枪声卡点字
// charAt（若给）= 该 span 每个字的实测场景帧，直接取代均匀速率 from + i * cpf
const TypeSpan: React.FC<{
    text: string;
    t: number;
    from: number;
    cpf: number;
    size: number;
    color: string;
    accent: string;
    waveAmp: number;
    seed: number;
    outline?: boolean;
    shot?: boolean;
    charAt?: number[];
}> = ({ text, t, from, cpf, size, color, accent, waveAmp, seed, outline, shot, charAt }) => (
    <span
        style={{
            display: "inline-block",
            whiteSpace: "pre",
            fontFamily: rowFont(text),
            fontWeight: 400,
            fontSize: size,
            lineHeight: 1,
            color: outline ? "transparent" : color,
            WebkitTextStroke: outline ? `${Math.max(2, Math.round(size * 0.028))}px ${accent}` : undefined,
        }}
    >
        {Array.from(text).map((ch, i) => {
            const charFrom = charAt && charAt[i] !== undefined ? charAt[i] : from + i * cpf;
            const d = t - charFrom;
            const hidden = d < 0;
            const p = hidden ? 0 : Math.min(1, d / 5);
            const fl = shot && !hidden ? Math.max(0, 1 - d / 8) : 0;
            const dy = waveAmp ? Math.sin(i * 0.8 + seed - t * 0.5) * waveAmp : 0;
            return (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        whiteSpace: "pre",
                        visibility: hidden ? "hidden" : undefined,
                        opacity: hidden ? 0 : p,
                        color: fl > 0 ? accent : undefined,
                        textShadow: fl > 0 ? `0 0 ${Math.round(26 * fl)}px ${accent}` : undefined,
                        transform: `translate(${(1 - p) * 16 + dy * 0.34}px, ${(1 - p) * -5 + dy}px) scale(${1 + 0.34 * fl})`,
                        filter: p < 1 ? `blur(${(1 - p) * 4}px)` : undefined,
                    }}
                >
                    {ch}
                </span>
            );
        })}
    </span>
);

// 整体弹出（重点词）：未到前用隐形占位，避免排版跳动
const PopWord: React.FC<{ text: string; t: number; from: number; size: number; pal: Pal; scale: number }> = ({ text, t, from, size, pal, scale }) =>
    t < from ? (
        <span style={{ display: "inline-block", whiteSpace: "pre", fontFamily: rowFont(text), fontSize: size, lineHeight: 1, visibility: "hidden", padding: "0 12px" }}>{text}</span>
    ) : (
        <span style={{ display: "inline-block", transform: scale !== 1 ? `scale(${scale})` : undefined, transformOrigin: "center" }}>
            <RhymeText t={t} from={from} text={text} size={size} color={pal.ink} accent={pal.accent} block={pal.block} blockInk={pal.blockInk} />
        </span>
    );

// 整行砸入：与普通行字体完全一致，只保留压入 + 去模糊
const SlamPlain: React.FC<{ t: number; from: number; text: string; size: number; color: string }> = ({ t, from, text, size, color }) => {
    if (t < from) return null;
    const p = prog(t, from, 6);
    return (
        <span
            style={{
                display: "inline-block",
                whiteSpace: "pre",
                fontFamily: rowFont(text),
                fontWeight: 400,
                fontSize: size,
                lineHeight: 1,
                color,
                transformOrigin: "center",
                transform: `scale(${1 + 0.28 * (1 - p)})`,
                filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
            }}
        >
            {text}
        </span>
    );
};

// 逐词 / 逐字母：按 span 展开成单元，span.shot 的单元带枪声闪光；off = 该单元首字在整行文本里的序号
type Unit = { text: string; shot: boolean; off: number };
const wordsOf = (spans: Span[]): Unit[] => {
    const out: Unit[] = [];
    let off = 0;
    for (const sp of spans) {
        let local = 0;
        for (const seg of sp.t.split(/(\s+)/)) {
            const n = Array.from(seg).length;
            if (seg.trim().length > 0) out.push({ text: seg, shot: !!sp.shot, off: off + local });
            local += n;
        }
        off += Array.from(sp.t).length;
    }
    return out;
};
const charsOf = (spans: Span[]): Unit[] => {
    const out: Unit[] = [];
    let off = 0;
    for (const sp of spans) for (const ch of Array.from(sp.t)) out.push({ text: ch, shot: !!sp.shot, off: off++ });
    return out;
};

const unitStyle = (fl: number, color: string, accent: string): React.CSSProperties => ({
    color: fl > 0 ? accent : color,
    textShadow: fl > 0 ? `0 0 ${Math.round(24 * fl)}px ${accent}` : undefined,
});

const WordRow: React.FC<{
    spans: Span[];
    t: number;
    from: number;
    span: number;
    size: number;
    color: string;
    accent: string;
    align: "left" | "center";
    frames?: number[];
}> = ({ spans, t, from, span, size, color, accent, align, frames }) => {
    const units = wordsOf(spans);
    const gap = span / (units.length + 0.6);
    return (
        <div style={{ display: "flex", justifyContent: align === "left" ? "flex-start" : "center", alignItems: "baseline", whiteSpace: "pre", gap: Math.round(size * 0.28) }}>
            {units.map((u, i) => {
                const unitFrom = frames && frames[u.off] !== undefined ? frames[u.off] : from + i * gap;
                const d = t - unitFrom;
                const p = d < 0 ? 0 : Math.min(1, d / 5);
                const fl = u.shot && d >= 0 ? Math.max(0, 1 - d / 8) : 0;
                return (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            whiteSpace: "pre",
                            fontFamily: rowFont(u.text),
                            fontWeight: 400,
                            fontSize: size,
                            lineHeight: 1,
                            opacity: p,
                            ...unitStyle(fl, color, accent),
                            transform: `translateY(${(1 - p) * 20}px) scale(${1.16 - 0.16 * p + 0.3 * fl})`,
                        }}
                    >
                        {u.text}
                    </span>
                );
            })}
        </div>
    );
};

const LetterRow: React.FC<{ spans: Span[]; t: number; from: number; span: number; size: number; color: string; accent: string; green?: boolean; frames?: number[] }> = ({
    spans,
    t,
    from,
    span,
    size,
    color,
    accent,
    green,
    frames,
}) => {
    const units = charsOf(spans);
    const gap = span / (units.length + 0.8);
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", whiteSpace: "pre" }}>
            {units.map((u, i) => {
                const charFrom = frames && frames[i] !== undefined ? frames[i] : from + i * gap;
                const d = t - charFrom;
                const p = d < 0 ? 0 : Math.min(1, d / 6);
                const fl = u.shot && d >= 0 ? Math.max(0, 1 - d / 8) : 0;
                return (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            whiteSpace: "pre",
                            fontFamily: rowFont(u.text),
                            fontWeight: 400,
                            fontSize: size,
                            lineHeight: 1,
                            opacity: Math.min(1, p * 1.7),
                            color: green || fl > 0 ? accent : color,
                            textShadow: fl > 0 ? `0 0 ${Math.round(24 * fl)}px ${accent}` : undefined,
                            transform: `scale(${1.9 - 0.9 * p + 0.35 * fl})`,
                        }}
                    >
                        {u.text}
                    </span>
                );
            })}
        </div>
    );
};

// ---------------------------------------------------------------- 行进类特效

// 逐字从左边滑入（frames = 词组折叠后的每字帧，同词组的字一起滑入）
const SlideInRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string; frames?: number[] }> = ({ text, t, from, span, size, color, frames }) => {
    const chars = Array.from(text);
    const gap = span / (chars.length + 0.6);
    return (
        <div style={{ display: "flex", justifyContent: "center", whiteSpace: "pre" }}>
            {chars.map((ch, i) => {
                const d = t - (frames && frames[i] !== undefined ? frames[i] : from + i * gap);
                const p = d < 0 ? 0 : Math.min(1, d / 6);
                return (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            whiteSpace: "pre",
                            fontFamily: rowFont(ch),
                            fontWeight: 400,
                            fontSize: size,
                            lineHeight: 1,
                            color,
                            opacity: p,
                            transform: `translateX(${-(1 - p) * size * 1.7}px)`,
                        }}
                    >
                        {ch}
                    </span>
                );
            })}
        </div>
    );
};

// 向下聚拢退场
const SinkRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const chars = Array.from(text);
    const cx = (chars.length - 1) / 2;
    const inP = clamp01((t - from) / 5);
    const k = clamp01((t - from - span * 0.18) / (span * 0.82));
    return (
        <div style={{ display: "flex", justifyContent: "center", whiteSpace: "pre" }}>
            {chars.map((ch, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        whiteSpace: "pre",
                        fontFamily: rowFont(ch),
                        fontWeight: 400,
                        fontSize: size,
                        lineHeight: 1,
                        color,
                        opacity: inP * (1 - k),
                        transform: `translate(${-(i - cx) * k * size * 0.85}px, ${k * size * 1.7}px) scale(${1 - 0.45 * k})`,
                    }}
                >
                    {ch}
                </span>
            ))}
        </div>
    );
};

// 从下往上扩张进场
const ExpandRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const k = clamp01((t - from) / Math.max(6, span * 0.55));
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", whiteSpace: "pre" }}>
            {Array.from(text).map((ch, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        whiteSpace: "pre",
                        fontFamily: rowFont(ch),
                        fontWeight: 400,
                        fontSize: size,
                        lineHeight: 1,
                        color,
                        opacity: Math.min(1, k * 1.6),
                        transformOrigin: "center bottom",
                        transform: `translateY(${(1 - k) * size * 0.9}px) scale(${0.25 + 0.75 * k})`,
                    }}
                >
                    {ch}
                </span>
            ))}
        </div>
    );
};

// 被穿透分开：左右两半向两侧让开
const SplitRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const chars = Array.from(text);
    const half = chars.length / 2;
    const k = clamp01((t - from - span * 0.6) / 6);
    const e = 1 - Math.pow(1 - k, 3);
    return (
        <div style={{ display: "flex", justifyContent: "center", whiteSpace: "pre" }}>
            {chars.map((ch, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        whiteSpace: "pre",
                        fontFamily: rowFont(ch),
                        fontWeight: 400,
                        fontSize: size,
                        lineHeight: 1,
                        color,
                        transform: `translateX(${(i < half ? -1 : 1) * e * size * 1.9}px)`,
                    }}
                >
                    {ch}
                </span>
            ))}
        </div>
    );
};

// 斜向穿透：从画面左下斜着飞向中上，停在两半让出的通道里
const PierceRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const k = clamp01((t - from) / Math.max(8, span * 0.6));
    const e = 1 - Math.pow(1 - k, 3);
    const x = -size * 4.4 + e * size * 4.7;
    const y = size * 1.7 - e * size * 3.2;
    const rot = -16 + e * 12;
    const blur = (1 - k) * 7;
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                whiteSpace: "pre",
                opacity: Math.min(1, k * 2.4),
                filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
                transform: `translate(${x}px, ${y}px) rotate(${rot}deg)`,
            }}
        >
            {Array.from(text).map((ch, i) => (
                <span key={i} style={{ display: "inline-block", whiteSpace: "pre", fontFamily: rowFont(ch), fontWeight: 400, fontSize: size, lineHeight: 1, color }}>
                    {ch}
                </span>
            ))}
        </div>
    );
};

// 字被打碎：整行每个字抖动后飞散 + 碎片（炮声触发）
const ShatterRow: React.FC<{ text: string; t: number; from: number; size: number; color: string; accent: string }> = ({ text, t, from, size, color, accent }) => {
    const chars = Array.from(text);
    const d0 = t - from;
    if (d0 < 0) return null;
    return (
        <div style={{ position: "relative", display: "flex", justifyContent: "center", whiteSpace: "pre" }}>
            {chars.map((ch, i) => {
                const k = clamp01((d0 - i * 0.35) / 9);
                const e = k * k;
                const ax = (rnd(i, 3) - 0.5) * 900 * e;
                const ay = (rnd(i, 7) - 0.5) * 640 * e + e * 90;
                const rot = (rnd(i, 11) - 0.5) * 260 * e;
                const jit = k < 1 ? Math.sin((d0 + i * 3) * 2.1) * (1 - k) * 9 : 0;
                return (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            whiteSpace: "pre",
                            fontFamily: rowFont(ch),
                            fontWeight: 400,
                            fontSize: size,
                            lineHeight: 1,
                            color: k > 0.45 ? accent : color,
                            opacity: 1 - e,
                            transform: `translate(${ax + jit}px, ${ay}px) rotate(${rot}deg) scale(${1 - 0.62 * e})`,
                        }}
                    >
                        {ch}
                    </span>
                );
            })}
            {/* 碎片 */}
            <div style={{ position: "absolute", inset: -400, pointerEvents: "none" }}>
                {Array.from({ length: 46 }, (_, j) => {
                    const k = clamp01((d0 - rnd(j, 5) * 4) / 14);
                    const a = rnd(j, 13) * Math.PI * 2;
                    const r = (200 + rnd(j, 17) * 900) * k;
                    const w = 6 + rnd(j, 19) * 26;
                    return (
                        <span
                            key={j}
                            style={{
                                position: "absolute",
                                left: 960,
                                top: 540,
                                width: w,
                                height: 4 + rnd(j, 23) * 10,
                                background: j % 3 === 0 ? accent : color,
                                opacity: (1 - k) * 0.85,
                                transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px) rotate(${a * 57}deg)`,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

// ---------------------------------------------------------------- 单行渲染

const RowView: React.FC<{
    row: Row;
    t: number;
    from: number;
    span: number;
    size: number;
    pal: Pal;
    waveAmp: number;
    cpf: number;
    align: "left" | "center";
    popScale: number;
    shatterFrom?: number;
    spanFrames?: number[][];
}> = ({ row, t, from, span, size, pal, waveAmp, cpf, align, popScale, shatterFrom, spanFrames }) => {
    const flat = spanFrames ? spanFrames.reduce<number[]>((acc, s) => acc.concat(s), []) : undefined;
    if (shatterFrom !== undefined && t >= shatterFrom) return <ShatterRow text={rowText(row)} t={t} from={shatterFrom} size={size} color={pal.ink} accent={pal.accent} />;
    if (row.fx === "word") return <WordRow spans={row.spans} t={t} from={from} span={span} size={size} color={pal.ink} accent={pal.accent} align={align} frames={flat} />;
    if (row.fx === "letter") return <LetterRow spans={row.spans} t={t} from={from} span={span} size={size} color={pal.ink} accent={pal.accent} green={row.green === true} frames={flat} />;
    if (row.fx === "slideIn") return <SlideInRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} frames={flat} />;
    if (row.fx === "sink") return <SinkRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "expand") return <ExpandRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "pierce") return <PierceRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.accent} />;
    if (row.fx === "split") return <SplitRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;

    const justify = align === "left" ? "flex-start" : "center";
    const slam = !!row.slam;
    const rowOutline = row.fx === "outline";
    const flatFrames = spanFrames ? spanFrames.reduce<number[]>((acc, s) => acc.concat(s), []) : undefined;
    let chars = 0;
    const nodes = row.spans.map((sp, i) => {
        const at = spanFrames?.[i]?.[0] ?? (slam ? from : from + chars * cpf + (sp.pop ? 2 : 0));
        chars += Array.from(sp.t).length;
        const outline = rowOutline || sp.outline === true;
        if (sp.pop) return <PopWord key={i} text={sp.t} t={t} from={at} size={size} pal={pal} scale={popScale} />;
        return slam ? (
            <SlamPlain key={i} t={t} from={at} text={sp.t} size={size} color={outline ? pal.accent : pal.ink} />
        ) : (
            <TypeSpan
                key={i}
                text={sp.t}
                t={t}
                from={at}
                cpf={cpf}
                size={size}
                color={outline ? pal.accent : pal.ink}
                accent={pal.accent}
                waveAmp={waveAmp}
                seed={i * 1.7}
                outline={outline}
                shot={sp.shot}
                charAt={spanFrames?.[i]}
            />
        );
    });
    void flatFrames;
    return <div style={{ display: "flex", justifyContent: justify, alignItems: "baseline", whiteSpace: "pre" }}>{nodes}</div>;
};

// 分离两段（「法老夸我说」左上 / 「吊的来」右下，中间留大片空档）—— 由舞台以整幅覆盖层渲染
export const DiagLayer: React.FC<{ row: Row; t: number; from: number; size: number; pal: Pal; span: number }> = ({ row, t, from, size, pal, span }) => {
    const a = row.spans[0]?.t ?? "";
    const b = row.spans[1]?.t ?? "";
    const bFrom = from + span * 0.5;
    const pieces: { text: string; at: number; left: number; top: number; rot: number; size: number }[] = [
        { text: a, at: from, left: 118, top: 286, rot: -2, size },
        { text: b, at: bFrom, left: 1010, top: 690, rot: -5, size: size * 1.12 },
    ];
    return (
        <>
            {pieces.map((p, i) =>
                t < p.at ? null : (
                    <div key={i} style={{ position: "absolute", left: p.left, top: p.top, transform: `rotate(${p.rot}deg)`, transformOrigin: "left center" }}>
                        <TypeSpan text={p.text} t={t} from={p.at} cpf={2} size={p.size} color={pal.ink} accent={pal.accent} waveAmp={0} seed={i * 3} />
                    </div>
                ),
            )}
        </>
    );
};

// ---------------------------------------------------------------- 背景 / 母题视觉

// 炭黑磨砂底 + 斜向绿流光（B/D/E/F 场）
const GrungeBackdrop: React.FC<{ pal: Pal; t: number }> = ({ pal, t }) => (
    <>
        <div
            style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.022) 0 3px, transparent 3px 34px)",
            }}
        />
        {[
            { x: -220, y: 140, w: 1500, rot: -17, o: 0.1 },
            { x: 420, y: 700, w: 1200, rot: -9, o: 0.07 },
            { x: -140, y: 940, w: 1100, rot: -22, o: 0.06 },
        ].map((s, i) => (
            <div
                key={i}
                style={{
                    position: "absolute",
                    left: s.x,
                    top: s.y,
                    width: s.w,
                    height: 14 + i * 6,
                    background: `linear-gradient(90deg, transparent, ${pal.accent} 45%, ${pal.accent} 62%, transparent)`,
                    opacity: s.o,
                    transform: `rotate(${s.rot}deg)`,
                    filter: `blur(${0.6 + i * 0.4}px)`,
                }}
            />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 72% 62% at 50% 46%, rgba(255,255,255,0.05), transparent 72%)" }} />
        <Scanlines t={t} opacity={pal.scan} />
        <Grain t={t} opacity={pal.grain} />
        <Vignette strength={pal.vig} />
    </>
);

// 弹孔：黑坑 + 亮边 + 放射裂纹 + 灰尘环 + 绿色枪口闪光（炮击为大破口）
const BulletHole: React.FC<{ t: number; at: number; x: number; y: number; kind: "gun" | "cannon"; pal: Pal }> = ({ t, at, x, y, kind, pal }) => {
    const d = t - at;
    if (d < 0) return null;
    const gun = kind === "gun";
    const r = gun ? 34 : 230;
    const pop = clamp01(d / 6);
    const flash = Math.max(0, 1 - d / 10);
    const dust = clamp01((d - 2) / 30);
    const cracks = gun ? 6 : 11;
    const reach = gun ? 190 : 980;
    const rim = Math.round(r * (0.55 + 0.45 * pop) * 1.45);
    const jag = (scale: number) =>
        Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const rr = r * (0.72 + rnd(i, 15) * 0.5) * scale;
            return `${i === 0 ? "M" : "L"}${Math.cos(a) * rr} ${Math.sin(a) * rr}`;
        }).join(" ") + " Z";
    return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <g transform={`translate(${x} ${y})`}>
                {/* 灰尘环：被打出的粉末，慢慢散开淡出 */}
                {dust > 0 ? <circle r={r * (1.5 + dust * 1.2)} fill="none" stroke="#FFFFFF" strokeWidth={gun ? 4 : 9} opacity={(1 - dust) * 0.34} /> : null}
                {/* 背后透光（炮击穿墙：洞口透出亮光） */}
                {gun ? null : (
                    <>
                        <circle r={r * 2.1} fill="#E8FFD0" opacity={0.3 + 0.24 * pop} />
                        <circle r={r * 1.2} fill="#FFFFFF" opacity={0.34 + 0.3 * pop} />
                    </>
                )}
                {/* 枪口绿光 */}
                {flash > 0 ? <circle r={r * (3.2 + 2.4 * (1 - flash))} fill="none" stroke={pal.accent} strokeWidth={4} opacity={flash * 0.9} /> : null}
                {flash > 0 ? <circle r={r * 2.1} fill={pal.accent} opacity={flash * 0.3} /> : null}
                {/* 放射裂纹（亮灰，暗墙上才看得见） */}
                {Array.from({ length: cracks }, (_, i) => {
                    const a = (i / cracks) * Math.PI * 2 + rnd(i, 5) * 0.7;
                    const rr = r * (1.4 + rnd(i, 9) * (reach / r - 1.4));
                    return (
                        <path
                            key={i}
                            d={`M${Math.cos(a) * r * 0.9} ${Math.sin(a) * r * 0.9} L${Math.cos(a) * rr * 0.5} ${Math.sin(a) * rr * 0.5} L${Math.cos(a + 0.14) * rr} ${Math.sin(a + 0.14) * rr}`}
                            stroke="#9A9A9A"
                            strokeWidth={gun ? 2.5 : 6}
                            fill="none"
                            strokeLinecap="round"
                            opacity={(gun ? 0.6 : 0.75) * pop}
                        />
                    );
                })}
                {/* 破口：不规则多边形，黑坑 + 亮边 */}
                <path d={jag(1)} fill="#000000" opacity={0.95 * pop} />
                <path d={jag(1)} fill="none" stroke="#FFFFFF" strokeWidth={gun ? 4 : 8} opacity={0.5 * pop} />
                <path d={jag(1.12)} fill="none" stroke={pal.accent} strokeWidth={gun ? 3 : 7} opacity={0.6 * pop} />
                {gun ? (
                    <path d={jag(0.45)} fill="#FFFFFF" opacity={0.13 * pop} />
                ) : (
                    <path d={jag(0.4)} fill="#FFFFFF" opacity={0.5 * pop} />
                )}
                {/* 孔缘高光 */}
                <circle r={rim} fill="none" stroke="#D0D0D0" strokeWidth={gun ? 2 : 5} opacity={0.28 * pop} />
            </g>
        </svg>
    );
};

// A 场：一面混凝土墙（板缝 + 污渍 + 刮痕 + 绿流光），弹孔逐发累加
const WallBackdrop: React.FC<{ pal: Pal; t: number; holes: { x: number; y: number; at: number; kind: "gun" | "cannon" }[] }> = ({ pal, t, holes }) => (
    <>
        <div style={{ position: "absolute", inset: 0, background: "#303030" }} />
        {/* 污渍 / 水痕 */}
        {[
            { x: 120, y: 60, w: 760, h: 520, o: 0.16 },
            { x: 1180, y: 520, w: 880, h: 620, o: 0.2 },
            { x: 300, y: 700, w: 900, h: 460, o: 0.14 },
            { x: 760, y: 120, w: 620, h: 380, o: 0.12 },
        ].map((b, i) => (
            <div
                key={i}
                style={{
                    position: "absolute",
                    left: b.x,
                    top: b.y,
                    width: b.w,
                    height: b.h,
                    background: `radial-gradient(ellipse 60% 55% at 45% 45%, rgba(0,0,0,${b.o}), transparent 72%)`,
                    filter: "blur(14px)",
                }}
            />
        ))}
        {/* 板缝：三道横向 + 一道纵向，轻微不平 */}
        {[
            { left: 0, top: 286, w: 1920, h: 5, rot: 0.5 },
            { left: 0, top: 622, w: 1920, h: 6, rot: -0.4 },
            { left: 0, top: 906, w: 1920, h: 5, rot: 0.6 },
        ].map((s, i) => (
            <div key={i} style={{ position: "absolute", left: s.left, top: s.top, width: s.w, height: s.h, background: "rgba(0,0,0,0.55)", transform: `rotate(${s.rot}deg)` }} />
        ))}
        <div style={{ position: "absolute", left: 1246, top: 0, width: 6, height: 1080, background: "rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 452, top: 286, width: 4, height: 640, background: "rgba(0,0,0,0.4)" }} />
        {/* 刮痕 */}
        {[
            { x: 90, y: 160, w: 520, rot: 8, o: 0.1 },
            { x: 1320, y: 760, w: 460, rot: -12, o: 0.09 },
            { x: 640, y: 470, w: 380, rot: 16, o: 0.07 },
        ].map((s, i) => (
            <div key={i} style={{ position: "absolute", left: s.x, top: s.y, width: s.w, height: 2, background: "#FFFFFF", opacity: s.o, transform: `rotate(${s.rot}deg)` }} />
        ))}
        {/* 顶部来光 */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 86% 70% at 50% 30%, rgba(255,255,255,0.12), transparent 68%)" }} />
        {/* 斜向绿流光 */}
        {[
            { x: -300, y: 210, w: 1700, rot: -19, o: 0.14 },
            { x: 500, y: 820, w: 1300, rot: -11, o: 0.1 },
            { x: -180, y: 60, w: 1000, rot: -26, o: 0.07 },
        ].map((s, i) => (
            <div
                key={i}
                style={{
                    position: "absolute",
                    left: s.x,
                    top: s.y,
                    width: s.w,
                    height: 16 + i * 8,
                    background: `linear-gradient(90deg, transparent, ${pal.accent} 45%, ${pal.accent} 60%, transparent)`,
                    opacity: s.o,
                    transform: `rotate(${s.rot}deg)`,
                    filter: "blur(1px)",
                }}
            />
        ))}
        {holes.map((h, i) => (
            <BulletHole key={i} t={t} at={h.at} x={h.x} y={h.y} kind={h.kind} pal={pal} />
        ))}
        <Scanlines t={t} opacity={pal.scan} />
        <Grain t={t} opacity={pal.grain} />
        <Vignette strength={pal.vig} />
    </>
);

// 十字准星（狙击手母题）：入场淡入 → 收缩锁定 → 轻微抖动
const Crosshair: React.FC<{ t: number; at: number; pal: Pal }> = ({ t, at, pal }) => {
    const d = t - at;
    if (d < 0) return null;
    const p = prog(t, at, 10);
    const s = 1.45 - 0.45 * p;
    const jit = d < 40 ? Math.sin(d * 1.7) * (1 - d / 40) * 7 : 0;
    const dim = d > 150 ? 0.34 : 1;
    const R = 200;
    return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: dim }}>
            <g transform={`translate(${960 + jit} ${540 - jit * 0.6}) scale(${s})`}>
                <circle r={R} fill="none" stroke={pal.ink} strokeWidth={2} opacity={(1 - p) * 0.5} />
                <circle r={R * 0.22} fill="none" stroke={pal.accent} strokeWidth={3} opacity={0.9} />
                {[0, 90, 180, 270].map((a) => (
                    <g key={a} transform={`rotate(${a})`}>
                        <line x1={R * 0.36} y1={0} x2={R} y2={0} stroke={pal.ink} strokeWidth={2.5} opacity={0.85} />
                        <line x1={R} y1={-14} x2={R} y2={14} stroke={pal.accent} strokeWidth={4} />
                    </g>
                ))}
                <circle r={5} fill={pal.accent} />
            </g>
        </svg>
    );
};

// 绿笔触横扫（换场 / 肃清 / 掌嘴）
const GreenSweep: React.FC<{ t: number; at: number; color: string; dur?: number }> = ({ t, at, color, dur = 15 }) => {
    const d = t - at;
    if (d < 0 || d > dur) return null;
    const p = d / dur;
    const x = -40 + p * 150;
    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div
                style={{
                    position: "absolute",
                    top: -300,
                    bottom: -300,
                    left: `${x}%`,
                    width: 420,
                    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                    transform: "skewX(-18deg)",
                    opacity: Math.sin(p * Math.PI) * 0.75,
                }}
            />
        </div>
    );
};

// 炮击穿墙：全屏爆闪 + 速度线 + 大冲击波 + 飞散碎块
const BreachBurst: React.FC<{ t: number; at: number; pal: Pal }> = ({ t, at, pal }) => {
    const d = t - at;
    if (d < 0 || d > 40) return null;
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: d < 2 ? 0.55 : Math.max(0, 0.3 - (d - 2) * 0.03), pointerEvents: "none" }} />
            <SpeedLines t={t} at={at} color={`${pal.accent}AA`} dur={22} n={22} cx={960} cy={540} inner={220} outer={1400} />
            <Shockwave t={t} at={at} x={960} y={540} color={pal.accent} rings={4} maxRadius={1500} dur={26} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                {Array.from({ length: 34 }, (_, j) => {
                    const k = clamp01((d - rnd(j, 5) * 5) / 26);
                    const a = rnd(j, 13) * Math.PI * 2;
                    const r = (260 + rnd(j, 17) * 1000) * k;
                    return (
                        <span
                            key={j}
                            style={{
                                position: "absolute",
                                left: 960,
                                top: 540,
                                width: 8 + rnd(j, 19) * 30,
                                height: 6 + rnd(j, 23) * 12,
                                background: j % 4 === 0 ? pal.accent : "#C8C8C8",
                                opacity: (1 - k) * 0.9,
                                transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px) rotate(${a * 63}deg)`,
                            }}
                        />
                    );
                })}
            </div>
        </>
    );
};

// 末帧 POW!! 定格（与封面同款）
const PowStamp: React.FC<{ t: number; at: number; pal: Pal }> = ({ t, at, pal }) => {
    const d = t - at;
    if (d < 0) return null;
    const p = prog(t, at, 8);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `${pal.accent}1A`, pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: -120, top: 250, width: 2200, height: 18, background: pal.accent, opacity: 0.85, transform: "rotate(-9deg)" }} />
            <div style={{ position: "absolute", left: -120, top: 800, width: 2200, height: 12, background: pal.accent, opacity: 0.6, transform: "rotate(-9deg)" }} />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT,
                    fontSize: 560,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: "#FFFFFF",
                    WebkitTextStroke: "3px rgba(255,255,255,0.35)",
                    textShadow: `0 0 60px ${pal.accent}55`,
                    transform: `rotate(-4deg) scale(${1.28 - 0.28 * p})`,
                    opacity: Math.min(1, p * 1.5),
                    filter: p < 1 ? `blur(${(1 - p) * 10}px)` : undefined,
                }}
            >
                POW!!
            </div>
            <Shockwave t={t} at={at} x={960} y={540} color={pal.accent} rings={3} maxRadius={1300} dur={22} />
        </>
    );
};

// ---------------------------------------------------------------- 舞台

export const PowStage: React.FC<{
    start: number; // 场起始拍（帧 = bf(start)）
    lines: LyricLine[];
    pal: Pal;
    tone: "wall" | "grunge" | "acid";
    shakes?: { sec: number; amp: number }[];
    shots?: Shot[];
    crosshairAts?: number[];
    sweepAts?: number[];
    stampAt?: number;
}> = ({ start, lines, pal, tone, shakes = [], shots = [], crosshairAts = [], sweepAts = [], stampAt }) => {
    const beat: Beat = useBeat();
    const raw = useT();
    const s0 = beat.bf(start);
    // 首场（start=0）的入场转场帧被 Sequence 裁掉，场景内时间比 absolute 少 TRANS 帧 → 补回来
    const t = raw + beat.TRANS + Math.max(0, s0 - beat.TRANS) - s0;
    const toT = (sec: number) => Math.round(sec * FPS) - s0;

    let curIdx = 0;
    for (let i = 0; i < lines.length; i += 1) if (t >= toT(lines[i].s)) curIdx = i;
    const cur = lines[curIdx];
    const nextS = curIdx + 1 < lines.length ? lines[curIdx + 1].s : cur.s + cur.rows.length * 1.2;

    // 卡点震动：显式 shakes（句首）+ 枪声/炮声
    let sh = 0;
    const bump = (sec: number, amp: number) => {
        const d = t - toT(sec);
        if (d >= 0 && d < 20) {
            const v = Math.exp(-d / 5.5) * Math.sin(d * 2.2) * amp;
            if (Math.abs(v) > Math.abs(sh)) sh = v;
        }
    };
    for (const s of shakes) bump(s.sec, s.amp);
    for (const s of shots) bump(s.sec, s.kind === "cannon" ? 2.2 : 1.15);

    const impactAt = cur.impact !== undefined ? toT(cur.impact) : -1;
    const id = t - impactAt;
    const impactLive = impactAt >= 0 && id >= 0 && id < 26;
    if (impactLive) {
        const v = Math.exp(-id / 5) * Math.sin(id * 2.4) * 2.2;
        if (Math.abs(v) > Math.abs(sh)) sh = v;
    }
    const shakeStyle: React.CSSProperties = {
        transform: `translate(${sh * 22}px, ${-sh * 13}px) rotate(${sh * 0.6}deg) scale(${1 + 0.035 * Math.abs(sh)})`,
        transformOrigin: "center",
    };

    // 波浪震动
    const wd = t - toT(cur.s);
    const waveAmp = cur.wave && wd >= 0 && wd < 80 ? Math.exp(-wd / 30) * 22 : 0;

    const lineStart = toT(cur.s);
    const rowGap = ((nextS - cur.s) * FPS) / cur.rows.length;
    // 逐字实测帧：整行 chars（按 row/span 顺序拼接）切成 行 → span → 字
    const countChars = (line: LyricLine) => line.rows.reduce((n, r) => n + r.spans.reduce((m, s) => m + Array.from(s.t).length, 0), 0);
    let rowFrames: (number[][] | undefined)[];
    if (cur.chars && cur.chars.length === countChars(cur)) {
        const flatF = cur.chars.map((sec) => toT(sec));
        collapseGroups(cur, flatF);
        let k = 0;
        rowFrames = cur.rows.map((row) => {
            const arr: number[][] = [];
            for (const sp of row.spans) {
                const n = Array.from(sp.t).length;
                arr.push(flatF.slice(k, k + n));
                k += n;
            }
            return arr;
        });
    } else {
        rowFrames = cur.rows.map(() => undefined);
    }
    const rowFrom = (j: number, row: Row) => {
        const f = rowFrames[j];
        if (f && f[0] && f[0].length) return f[0][0];
        return row.at !== undefined ? toT(row.at) : lineStart + j * rowGap;
    };
    const rowSpan = (j: number, row: Row) => {
        const f = rowFrames[j];
        if (f) {
            const last = f[f.length - 1];
            const lastT = last && last.length ? last[last.length - 1] : rowFrom(j, row);
            return Math.max(6, lastT - rowFrom(j, row) + 8);
        }
        if (row.dur !== undefined) return Math.max(6, row.dur * FPS);
        const nextRow = j + 1 < cur.rows.length ? cur.rows[j + 1] : undefined;
        const nextAt = nextRow && nextRow.at !== undefined ? nextRow.at : nextS;
        const startSec = row.at !== undefined ? row.at : cur.s;
        const end = row.at !== undefined ? nextAt : nextS;
        return Math.max(6, (end - startSec) * FPS);
    };

    const verseSize = cur.size ?? Math.min(...cur.rows.map((r) => fitSize(rowText(r), 1340, 156)));
    const align: "left" | "center" = "center";
    const frame = t + s0;

    const rowPopScale = (row: Row) => (row.popZoom !== undefined ? 1 + 16 * prog(t, toT(row.popZoom), 33) : 1);
    const zoomRow = cur.rows.find((r) => r.popZoom !== undefined);
    const zp = zoomRow?.popZoom !== undefined ? prog(t, toT(zoomRow.popZoom), 33) : 0;
    const veil = zp > 0.78 ? Math.min(1, (zp - 0.78) / 0.22) : 0;

    const holes = shots.map((s) => ({ x: s.x * 1920, y: s.y * 1080, at: toT(s.sec), kind: s.kind }));
    const cannon = shots.find((s) => s.kind === "cannon");
    const cannonAt = cannon ? toT(cannon.sec) : -1;
    const crossAt = crosshairAts.filter((a) => toT(a) <= t).pop();

    return (
        <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
            <Fonts />
            {tone === "wall" ? <WallBackdrop pal={pal} t={frame} holes={holes} /> : <GrungeBackdrop pal={pal} t={frame} />}
            {tone === "acid" ? (
                <>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(0,0,0,0.1) 0 3px, transparent 3px 30px)" }} />
                    <Grain t={frame} opacity={pal.grain} />
                    <Vignette strength={pal.vig} />
                </>
            ) : null}

            {crossAt !== undefined ? <Crosshair t={t} at={toT(crossAt)} pal={pal} /> : null}
            {sweepAts.map((a, i) => (
                <GreenSweep key={i} t={t} at={toT(a)} color={tone === "acid" ? "#FFFFFF" : pal.accent} />
            ))}
            {cannonAt >= 0 ? <BreachBurst t={t} at={cannonAt} pal={pal} /> : null}
            {impactLive ? <Shockwave t={t} at={impactAt} x={960} y={540} color={pal.burst} rings={3} maxRadius={1200} dur={22} /> : null}

            <div style={{ position: "absolute", left: 60, top: 116, fontFamily: MONO, fontSize: 19, letterSpacing: 5, color: `${tone === "acid" ? "#0A0A0A" : pal.ink}66` }}>{`L.${String(cur.i).padStart(2, "0")}`}</div>
            <div style={{ position: "absolute", right: 60, top: 120, fontFamily: MONO, fontSize: 17, letterSpacing: 4, color: `${tone === "acid" ? "#0A0A0A" : pal.ink}66` }}>{LABEL}</div>
            <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, height: 2, background: `${tone === "acid" ? "#0A0A0A" : pal.ink}1A` }} />

            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...shakeStyle }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                    {cur.rows.map((row, j) =>
                        row.fx === "diag" ? null : (
                            <RowView
                                key={j}
                                row={row}
                                t={t}
                                from={rowFrom(j, row)}
                                span={rowSpan(j, row)}
                                size={verseSize}
                                pal={pal}
                                waveAmp={waveAmp}
                                cpf={Math.min(CPF_MAX, (rowGap * 0.55) / Math.max(1, typeChars(row)))}
                                align={align}
                                popScale={rowPopScale(row)}
                                shatterFrom={row.shatterAt !== undefined ? toT(row.shatterAt) : undefined}
                                spanFrames={rowFrames[j]}
                            />
                        ),
                    )}
                </div>
                {cur.rows.map((row, j) =>
                    row.fx === "diag" ? <DiagLayer key={`d${j}`} row={row} t={t} from={rowFrom(j, row)} size={verseSize} pal={pal} span={rowSpan(j, row)} /> : null,
                )}
            </div>

            {veil > 0 ? <div style={{ position: "absolute", inset: 0, background: pal.bg, opacity: veil, pointerEvents: "none" }} /> : null}
            {stampAt !== undefined ? <PowStamp t={t} at={toT(stampAt)} pal={pal} /> : null}
        </div>
    );
};
