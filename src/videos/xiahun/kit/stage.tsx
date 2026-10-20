import React from "react";
import { FPS, Shockwave, prog, useBeat, useT } from "../../../shared";
import type { Beat } from "../../../shared";
import { FONT, Fonts, Grain, MONO, RhymeText, Scanlines, Vignette, fitSize, rowFont } from "../../../styles/lyricmv";
import type { Pal } from "../../../styles/lyricmv";
import { LABEL, type LyricLine, type Row } from "./lyrics";

const CPF_MAX = 1.15; // 逐字最快每字帧数（行越长越慢）

const rowText = (r: Row) => r.spans.map((s) => s.t).join("");
const typeChars = (r: Row) => r.spans.reduce((n, s) => n + (s.pop ? 0 : Array.from(s.t).length), 0);

// 逐字显示：未到的字保持占位（visibility:hidden），到点从右侧轻微滑入
const TypeSpan: React.FC<{
    text: string;
    t: number;
    from: number;
    cpf: number;
    size: number;
    color: string;
    waveAmp: number;
    seed: number;
    outline?: boolean;
}> = ({ text, t, from, cpf, size, color, waveAmp, seed, outline }) => (
    <span
        style={{
            display: "inline-block",
            whiteSpace: "pre",
            fontFamily: rowFont(text),
            fontWeight: 400,
            fontSize: size,
            lineHeight: 1,
            color: outline ? "transparent" : color,
            WebkitTextStroke: outline ? `${Math.max(2, Math.round(size * 0.028))}px ${color}` : undefined,
        }}
    >
        {Array.from(text).map((ch, i) => {
            const d = t - (from + i * cpf);
            const hidden = d < 0;
            const p = hidden ? 0 : Math.min(1, d / 5);
            const dy = waveAmp ? Math.sin(i * 0.8 + seed - t * 0.5) * waveAmp : 0;
            return (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        whiteSpace: "pre",
                        visibility: hidden ? "hidden" : undefined,
                        opacity: hidden ? 0 : p,
                        transform: `translate(${(1 - p) * 16 + dy * 0.34}px, ${(1 - p) * -5 + dy}px)`,
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

// 整行砸入：与普通行的字体完全一致（rowFont、无偏移投影），只保留压入 + 去模糊的入场
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

// 逐词出现：整行按词逐个弹出（不逐字）
const WordRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string; align: "left" | "center" }> = ({
    text,
    t,
    from,
    span,
    size,
    color,
    align,
}) => {
    const words = text.split(/\s+/).filter(Boolean);
    const gap = span / (words.length + 0.6);
    return (
        <div style={{ display: "flex", justifyContent: align === "left" ? "flex-start" : "center", alignItems: "baseline", whiteSpace: "pre", gap: Math.round(size * 0.28) }}>
            {words.map((w, i) => {
                const d = t - (from + i * gap);
                const p = d < 0 ? 0 : Math.min(1, d / 5);
                return (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            whiteSpace: "pre",
                            fontFamily: rowFont(w),
                            fontWeight: 400,
                            fontSize: size,
                            lineHeight: 1,
                            color,
                            opacity: p,
                            transform: `translateY(${(1 - p) * 20}px) scale(${1.16 - 0.16 * p})`,
                        }}
                    >
                        {w}
                    </span>
                );
            })}
        </div>
    );
};

// 逐字母出现：每个字母带冲击缩放单独砸出（K / e / y / N / G）
const LetterRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const chars = Array.from(text);
    const gap = span / (chars.length + 0.8);
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", whiteSpace: "pre" }}>
            {chars.map((ch, i) => {
                const d = t - (from + i * gap);
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
                            opacity: Math.min(1, p * 1.7),
                            transform: `scale(${1.9 - 0.9 * p})`,
                        }}
                    >
                        {ch}
                    </span>
                );
            })}
        </div>
    );
};

// 皇冠（爬楼梯顶部装饰）
const Crown: React.FC<{ size: number; color: string }> = ({ size, color }) => (
    <svg width={size} height={size * 0.72} viewBox="0 0 120 86" fill={color}>
        <path d="M10 74 L4 22 L34 46 L60 8 L86 46 L116 22 L110 74 Z" />
        <rect x="10" y="74" width="100" height="12" />
        <circle cx="4" cy="20" r="8" />
        <circle cx="60" cy="7" r="9" />
        <circle cx="116" cy="20" r="8" />
    </svg>
);

// 爬楼梯：从左下往右上逐字升起；末尾 pair 起同组同时出场并持平，随后头顶落皇冠
const StairsRow: React.FC<{
    text: string;
    t: number;
    from: number;
    span: number;
    size: number;
    color: string;
    crownColor: string;
    pair?: number;
}> = ({ text, t, from, span, size, color, crownColor, pair }) => {
    const chars = Array.from(text);
    const groupOf = (i: number) => (pair !== undefined && i > pair ? pair : i);
    const groups = pair !== undefined ? pair + 1 : chars.length;
    const gap = span / (groups + 2.4); // 留出末尾「宝座 + 皇冠」的停留时间
    const stepY = size * 0.26;
    const topY = groupOf(chars.length - 1);
    return (
        <div
            style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                whiteSpace: "pre",
                transform: `translateY(${Math.round(topY * stepY * 0.45)}px)`,
            }}
        >
            {chars.map((ch, i) => {
                const g = groupOf(i);
                const d = t - (from + g * gap);
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
                            transform: `translate(${g * size * 0.05}px, ${-g * stepY + (1 - p) * 34}px)`,
                        }}
                    >
                        {ch}
                    </span>
                );
            })}
            {/* 皇冠：最后一组（宝座）落位后出现在它正上方 */}
            <div
                style={{
                    position: "absolute",
                    right: size * 0.3,
                    top: -Math.round(topY * stepY + size * 1.28),
                    opacity: Math.min(1, Math.max(0, (t - (from + groups * gap)) / 6)),
                }}
            >
                <Crown size={size * 1.5} color={crownColor} />
            </div>
        </div>
    );
};

// 分隔：先出前段，再出后段，随后后段向外飞走（表示「差得太远」）
const ApartRow: React.FC<{ a: string; b: string; t: number; from: number; span: number; size: number; color: string }> = ({ a, b, t, from, span, size, color }) => {
    const bAt = from + span * 0.3;
    const outAt = from + span * 0.58;
    const ap = Math.min(1, Math.max(0, (t - from) / 6));
    const bp = Math.min(1, Math.max(0, (t - bAt) / 6));
    const out = Math.min(1, Math.max(0, (t - outAt) / 18));
    const base: React.CSSProperties = { display: "inline-block", whiteSpace: "pre", fontFamily: FONT, fontWeight: 400, fontSize: size, lineHeight: 1, color };
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", whiteSpace: "pre" }}>
            <span style={{ ...base, opacity: ap }}>{a}</span>
            <span style={{ ...base, opacity: bp * (1 - out), transform: `translate(${out * size * 5}px, ${-out * size * 0.7}px) rotate(${out * 8}deg)` }}>{b}</span>
        </div>
    );
};

// 逐字从左边滑入（错峰卡点）
const SlideInRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const chars = Array.from(text);
    const gap = span / (chars.length + 0.6);
    return (
        <div style={{ display: "flex", justifyContent: "center", whiteSpace: "pre" }}>
            {chars.map((ch, i) => {
                const d = t - (from + i * gap);
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

// 整行同时出现，随后逐字向左边滑出（与 slideIn 左右相反）
const SlideOutRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const chars = Array.from(text);
    const gap = span / (chars.length + 1);
    const appear = Math.min(1, Math.max(0, (t - from) / 4));
    return (
        <div style={{ display: "flex", justifyContent: "center", whiteSpace: "pre" }}>
            {chars.map((ch, i) => {
                const e = Math.min(1, Math.max(0, (t - (from + (i + 1) * gap)) / 6));
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
                            opacity: appear * (1 - e),
                            transform: `translateX(${-e * size * 1.7}px)`,
                        }}
                    >
                        {ch}
                    </span>
                );
            })}
        </div>
    );
};

// 向下聚拢退场：整行向中下收拢、缩小、淡出
const SinkRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const chars = Array.from(text);
    const cx = (chars.length - 1) / 2;
    const inP = Math.min(1, Math.max(0, (t - from) / 5));
    const k = Math.min(1, Math.max(0, (t - from - span * 0.18) / (span * 0.82)));
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

// 从下往上扩张进场：整行从基线向上长出来（与 sink 上下相反）
const ExpandRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const k = Math.min(1, Math.max(0, (t - from) / Math.max(6, span * 0.55)));
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

// 被穿透分开：左右两半在穿透词到的瞬间向两侧让开，中间留出一条通道
const SplitRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const chars = Array.from(text);
    const half = chars.length / 2;
    const k = Math.min(1, Math.max(0, (t - from - span * 0.6) / 6));
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

// 斜向穿透：从画面左下斜着飞向中上，穿过上一行后停在左右两半让出的通道里
const PierceRow: React.FC<{ text: string; t: number; from: number; span: number; size: number; color: string }> = ({ text, t, from, span, size, color }) => {
    const k = Math.min(1, Math.max(0, (t - from) / Math.max(8, span * 0.6)));
    const e = 1 - Math.pow(1 - k, 3);
    const x = -size * 4.4 + e * size * 4.7; // 终点落在两半之间（不压字）
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

// 单行渲染：word/letter/stairs/apart 专用动画 / slam 整行砸入 / 否则 span 依次逐字（重点词整体弹出）
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
}> = ({ row, t, from, span, size, pal, waveAmp, cpf, align, popScale }) => {
    if (row.fx === "word") return <WordRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} align={align} />;
    if (row.fx === "letter") return <LetterRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "stairs")
        return <StairsRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} crownColor={pal.accent} pair={row.pair} />;
    if (row.fx === "apart")
        return <ApartRow a={row.spans[0].t} b={row.spans[1]?.t ?? ""} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "slideIn") return <SlideInRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "slideOut") return <SlideOutRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "sink") return <SinkRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "expand") return <ExpandRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "pierce") return <PierceRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;
    if (row.fx === "split") return <SplitRow text={rowText(row)} t={t} from={from} span={span} size={size} color={pal.ink} />;

    const justify = align === "left" ? "flex-start" : "center";
    const slam = !!row.slam;
    const outline = row.fx === "outline";
    let chars = 0;
    const nodes = row.spans.map((sp, i) => {
        const at = slam ? from : from + chars * cpf + (sp.pop ? 2 : 0);
        chars += Array.from(sp.t).length;
        if (sp.pop) return <PopWord key={i} text={sp.t} t={t} from={at} size={size} pal={pal} scale={popScale} />;
        return slam ? (
            <SlamPlain key={i} t={t} from={at} text={sp.t} size={size} color={pal.ink} />
        ) : (
            <TypeSpan key={i} text={sp.t} t={t} from={at} cpf={cpf} size={size} color={outline ? pal.accent : pal.ink} waveAmp={waveAmp} seed={i * 1.7} outline={outline} />
        );
    });
    return <div style={{ display: "flex", justifyContent: justify, alignItems: "baseline", whiteSpace: "pre" }}>{nodes}</div>;
};

// 灰阶底纹：深/中灰场用浅纹理 + 暗角，浅灰白场改成深纹理、不加暗角
const ToneBackdrop: React.FC<{ tone: "deep" | "mid" | "light" }> = ({ tone }) => {
    const light = tone === "light";
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: light
                        ? "repeating-linear-gradient(45deg, rgba(31,31,36,0.05) 0 3px, transparent 3px 30px)"
                        : "repeating-linear-gradient(45deg, rgba(255,255,255,0.028) 0 3px, transparent 3px 34px)",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: light
                        ? "radial-gradient(ellipse 70% 58% at 50% 44%, rgba(255,255,255,0.14), transparent 74%)"
                        : "radial-gradient(ellipse 70% 58% at 50% 44%, rgba(255,255,255,0.07), transparent 72%)",
                }}
            />
            {light ? null : <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.016) 0 1px, transparent 1px 4px)" }} />}
            {light ? null : <Vignette strength={tone === "deep" ? 0.85 : 0.7} />}
        </>
    );
};

export const XhStage: React.FC<{
    start: number; // 场起始拍（帧 = bf(start)）
    lines: LyricLine[];
    pal: Pal;
    tone: "deep" | "mid" | "light";
    shakes?: { sec: number; amp: number }[];
}> = ({ start, lines, pal, tone, shakes = [] }) => {
    const beat: Beat = useBeat();
    const t = useT();
    const s0 = beat.bf(start);
    // 绝对秒 -> 场景内帧（t = 绝对帧 - bf(start)）
    const toT = (sec: number) => Math.round(sec * FPS) - s0;

    // 当前句 = 起唱秒已到的最后一句
    let curIdx = 0;
    for (let i = 0; i < lines.length; i += 1) if (t >= toT(lines[i].s)) curIdx = i;
    const cur = lines[curIdx];
    const nextS = curIdx + 1 < lines.length ? lines[curIdx + 1].s : cur.s + cur.rows.length * 1.1;

    // 重拍卡点震动：只作用于内容层
    let sh = 0;
    for (const s of shakes) {
        const d = t - toT(s.sec);
        if (d >= 0 && d < 20) {
            const v = Math.exp(-d / 5.5) * Math.sin(d * 2.2) * s.amp;
            if (Math.abs(v) > Math.abs(sh)) sh = v;
        }
    }
    // 强烈卡点（impact）：冲击波 + 更大幅度的震动
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

    // 波浪震动：约 1.2s 衰减
    const wd = t - toT(cur.s);
    const waveAmp = cur.wave && wd >= 0 && wd < 80 ? Math.exp(-wd / 30) * 22 : 0;

    const lineStart = toT(cur.s);
    const rowGap = ((nextS - cur.s) * FPS) / cur.rows.length;
    const rowFrom = (j: number, row: Row) => (row.at !== undefined ? toT(row.at) : lineStart + j * rowGap);
    // 该行可用的帧长（逐词 / 逐字母按它分配出场间隔）；row.dur 可显式指定
    const rowSpan = (j: number, row: Row) => {
        if (row.dur !== undefined) return Math.max(6, row.dur * FPS);
        const nextRow = j + 1 < cur.rows.length ? cur.rows[j + 1] : undefined;
        const nextAt = nextRow && nextRow.at !== undefined ? nextRow.at : nextS;
        const start = row.at !== undefined ? row.at : cur.s;
        const end = row.at !== undefined ? nextAt : nextS;
        return Math.max(6, (end - start) * FPS);
    };

    // 字号：按最长行反推，上限 156；行可显式覆盖（独立一幕的大字）
    const verseSize = cur.size ?? Math.min(...cur.rows.map((r) => fitSize(rowText(r), 1340, 156)));

    // 排版：深灰（开场陈述）居中，中灰（diss 快嘴）左对齐，浅灰白场（收官）居中
    const align: "left" | "center" = tone === "mid" ? "left" : "center";
    const frame = t + s0;
    // 收官放大：整行留在画面里，只把重点词原地放大到铺满画面，末尾化入底色定格
    const rowPopScale = (row: Row) => (row.popZoom !== undefined ? 1 + 16 * prog(t, toT(row.popZoom), 33) : 1);
    const zoomRow = cur.rows.find((r) => r.popZoom !== undefined);
    const zp = zoomRow?.popZoom !== undefined ? prog(t, toT(zoomRow.popZoom), 33) : 0;
    const veil = zp > 0.78 ? Math.min(1, (zp - 0.78) / 0.22) : 0;

    return (
        <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
            <Fonts />
            <ToneBackdrop tone={tone} />
            <Scanlines t={frame} opacity={tone === "light" ? 0.09 : 0.12} />
            <Grain t={frame} opacity={tone === "light" ? 0.08 : 0.12} />
            {impactLive ? <Shockwave t={t} at={impactAt} x={960} y={540} color={pal.burst} rings={3} maxRadius={1200} dur={22} /> : null}

            <div style={{ position: "absolute", left: 60, top: 116, fontFamily: MONO, fontSize: 19, letterSpacing: 5, color: `${pal.ink}66` }}>{`L.${String(cur.i).padStart(2, "0")}`}</div>
            <div style={{ position: "absolute", right: 60, top: 120, fontFamily: MONO, fontSize: 17, letterSpacing: 4, color: `${pal.ink}66` }}>{LABEL}</div>
            <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, height: 2, background: `${pal.ink}1A` }} />

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: align === "left" ? "flex-start" : "center",
                    padding: align === "left" ? "0 220px" : 0,
                    ...shakeStyle,
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: align === "left" ? "flex-start" : "center", gap: 14, width: align === "left" ? "100%" : undefined }}>
                    {cur.rows.map((row, j) => (
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
                        />
                    ))}
                </div>
            </div>

            {veil > 0 ? <div style={{ position: "absolute", inset: 0, background: pal.block, opacity: veil, pointerEvents: "none" }} /> : null}
        </div>
    );
};
