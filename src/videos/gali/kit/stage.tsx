import React from "react";
import { FPS, pop, prog, useBeat, useT } from "../../../shared";
import type { Beat } from "../../../shared";
import { FONT, Fonts, Grain, MONO, RhymeText, Scanlines, SlamText, Vignette, fitSize, rowFont } from "../../../styles/lyricmv";
import type { Pal } from "../../../styles/lyricmv";
import { LABEL, type LyricLine, type Row } from "./lyrics";

const CPF_MAX = 1.15; // 逐字最快每字帧数（行越长越慢）

// 彩虹色（「填上不一样的油彩」逐字上色）
const RAINBOW = ["#FF4D4D", "#FF9F43", "#FFE300", "#5BE36B", "#42C7FF", "#7A6BFF", "#FF5FD2", "#FF7BA9"];

// 稳定伪随机（同一个字每帧一致）
const rnd = (n: number, salt: number) => {
    const s = Math.sin(n * 127.1 + salt * 311.7) * 43758.5453;
    return s - Math.floor(s);
};

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
    colors?: string[];
    outline?: boolean;
}> = ({ text, t, from, cpf, size, color, waveAmp, seed, colors, outline }) => (
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
                        color: outline ? "transparent" : colors ? colors[i % colors.length] : undefined,
                        WebkitTextStroke: outline ? `${Math.max(2, Math.round(size * 0.028))}px ${colors ? colors[i % colors.length] : color}` : undefined,
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

// 整体弹出（重点词 / 韵脚）：未到前用隐形占位，避免排版跳动
const PopWord: React.FC<{ text: string; t: number; from: number; size: number; pal: Pal; scale: number }> = ({ text, t, from, size, pal, scale }) =>
    t < from ? (
        <span style={{ display: "inline-block", whiteSpace: "pre", fontFamily: rowFont(text), fontSize: size, lineHeight: 1, visibility: "hidden", padding: "0 12px" }}>{text}</span>
    ) : (
        <span style={{ display: "inline-block", transform: scale !== 1 ? `scale(${scale})` : undefined, transformOrigin: "center" }}>
            <RhymeText t={t} from={from} text={text} size={size} color={pal.ink} accent={pal.accent} block={pal.block} blockInk={pal.blockInk} />
        </span>
    );

// 「We stack it up」：从下往上堆叠（首词在最下），每个单词从画面右侧弹入
const StackRow: React.FC<{ row: Row; t: number; from: number; span: number; size: number; pal: Pal }> = ({ row, t, from, span, size, pal }) => {
    const words = rowText(row).split(/\s+/).filter(Boolean);
    const cap = Math.min(size, 104);
    const lineH = Math.round(cap * 1.18);
    const gap = span / (words.length + 0.5);
    return (
        <div style={{ position: "relative", height: lineH * words.length, display: "flex", flexDirection: "column-reverse", alignItems: "flex-start" }}>
            {words.map((w, i) => {
                const p = pop(t, from + i * gap, 14);
                return (
                    <span
                        key={i}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: lineH,
                            fontFamily: rowFont(w),
                            fontWeight: 400,
                            fontSize: cap,
                            lineHeight: 1,
                            color: pal.ink,
                            whiteSpace: "pre",
                            opacity: Math.min(1, p * 1.5),
                            transform: `translateX(${(1 - p) * 1900}px)`,
                        }}
                    >
                        {w}
                    </span>
                );
            })}
        </div>
    );
};

// 单行渲染：slam 整行砸入 / stack 逐词堆起 / 否则 span 依次逐字（重点词整体弹出）
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
    if (row.fx === "stack") return <StackRow row={row} t={t} from={from} span={span} size={size} pal={pal} />;

    const justify = align === "left" ? "flex-start" : "center";
    const slam = !!row.slam;
    const rainbow = row.fx === "rainbow";
    const outline = row.fx === "outline";
    let chars = 0;
    const nodes = row.spans.map((sp, i) => {
        const at = slam ? from : from + chars * cpf + (sp.pop ? 2 : 0);
        chars += Array.from(sp.t).length;
        if (sp.pop) return <PopWord key={i} text={sp.t} t={t} from={at} size={size} pal={pal} scale={popScale} />;
        return slam ? (
            <SlamText key={i} t={t} from={at} text={sp.t} size={size} color={pal.ink} accent={pal.accent} />
        ) : (
            <TypeSpan
                key={i}
                text={sp.t}
                t={t}
                from={at}
                cpf={cpf}
                size={size}
                color={outline ? pal.accent : pal.ink}
                waveAmp={waveAmp}
                seed={i * 1.7}
                colors={rainbow ? RAINBOW : undefined}
                outline={outline}
            />
        );
    });
    return <div style={{ display: "flex", justifyContent: justify, alignItems: "baseline", whiteSpace: "pre" }}>{nodes}</div>;
};

// 保龄球幕：三行球瓶从上到下排成三角，「保龄球」从下往上冲上来把三行打散
const BowlingLine: React.FC<{ line: LyricLine; t: number; toT: (sec: number) => number; pal: Pal }> = ({ line, t, toT, pal }) => {
    const pins = line.rows.slice(0, -1);
    const ball = line.rows[line.rows.length - 1];
    const ballAt = ball.at ?? line.s;
    const scatterAt = line.bowling?.scatterAt ?? ballAt;
    const rise = prog(t, toT(ballAt), 12);
    const sc = Math.max(0, t - toT(scatterAt));
    const k = Math.min(1, sc / 20);
    const ballText = rowText(ball);
    const pinSize = Math.min(...pins.map((r) => fitSize(rowText(r), 1100, 168)));

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            {/* 球瓶三角（上→下 4/3/2 字，形似球瓶阵） */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 214, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                {pins.map((row, ri) => {
                    const at = toT(row.at ?? line.s);
                    const p = prog(t, at, 6);
                    return (
                        <div key={ri} style={{ display: "flex", justifyContent: "center", whiteSpace: "pre", opacity: Math.min(1, p * 2) }}>
                            {Array.from(rowText(row)).map((ch, ci) => {
                                const seed = ri * 10 + ci;
                                const dx = (rnd(seed, 1) - 0.5) * 900 * k;
                                const dy = (rnd(seed, 2) - 0.5) * 560 * k + k * 300;
                                const rot = (rnd(seed, 3) - 0.5) * 150 * k;
                                return (
                                    <span
                                        key={ci}
                                        style={{
                                            display: "inline-block",
                                            whiteSpace: "pre",
                                            fontFamily: rowFont(ch),
                                            fontWeight: 400,
                                            fontSize: pinSize,
                                            lineHeight: 1,
                                            color: pal.ink,
                                            opacity: (1 - k) * Math.min(1, p * 2),
                                            transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`,
                                        }}
                                    >
                                        {ch}
                                    </span>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* 保龄球：从画面下方升上来，命中即打散 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 690, display: "flex", justifyContent: "center", transform: `translateY(${(1 - rise) * 620}px)` }}>
                <div
                    style={{
                        background: pal.block,
                        padding: "14px 54px 22px",
                        clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)",
                        boxShadow: k > 0 ? `0 0 ${Math.round(40 * k)}px ${pal.block}66` : undefined,
                    }}
                >
                    <span style={{ display: "block", fontFamily: FONT, fontWeight: 400, fontSize: 150, lineHeight: 1, color: pal.blockInk, whiteSpace: "pre" }}>{ballText}</span>
                </div>
            </div>
        </div>
    );
};

const YellowBackdrop: React.FC = () => (
    <>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(11,11,11,0.045) 0 3px, transparent 3px 30px)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 68% 58% at 50% 44%, rgba(255,255,255,0.30), transparent 74%)" }} />
    </>
);

const BlackBackdrop: React.FC = () => (
    <>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 58% at 50% 44%, #FFE30012, transparent 72%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, #FFE30010, transparent 42%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.018) 0 1px, transparent 1px 4px)" }} />
        <Vignette strength={1} />
    </>
);

export const MvStage: React.FC<{
    start: number; // 场起始拍（帧 = bf(start)）
    lines: LyricLine[];
    pal: Pal;
    theme: "yellow" | "black";
    shakes?: { sec: number; amp: number }[];
}> = ({ start, lines, pal, theme, shakes = [] }) => {
    const beat: Beat = useBeat();
    const t = useT();
    const s0 = beat.bf(start);
    // 绝对秒 -> 场景内帧（t = 绝对帧 - bf(start)）
    const toT = (sec: number) => Math.round(sec * FPS) - s0;

    // 当前句 = 起唱秒已到的最后一句
    let curIdx = 0;
    for (let i = 0; i < lines.length; i += 1) if (t >= toT(lines[i].s)) curIdx = i;
    const cur = lines[curIdx];
    const nextS = curIdx + 1 < lines.length ? lines[curIdx + 1].s : cur.s + cur.rows.length * 0.9;

    const isHook = cur.hookKey !== undefined && cur.hookKey !== "That's my";

    // 重拍卡点震动：只作用于内容层
    let sh = 0;
    for (const s of shakes) {
        const d = t - toT(s.sec);
        if (d >= 0 && d < 20) {
            const v = Math.exp(-d / 5.5) * Math.sin(d * 2.2) * s.amp;
            if (Math.abs(v) > Math.abs(sh)) sh = v;
        }
    }
    const shakeStyle: React.CSSProperties = {
        transform: `translate(${sh * 22}px, ${-sh * 13}px) rotate(${sh * 0.6}deg) scale(${1 + 0.035 * Math.abs(sh)})`,
        transformOrigin: "center",
    };

    // 进鼓波浪震动：约 1.2s 衰减
    const wd = t - toT(cur.s);
    const waveAmp = cur.wave && wd >= 0 && wd < 80 ? Math.exp(-wd / 30) * 22 : 0;

    const lineStart = toT(cur.s);
    const rowGap = ((nextS - cur.s) * FPS) / cur.rows.length;
    const rowFrom = (j: number, row: Row) => (row.at !== undefined ? toT(row.at) : lineStart + j * rowGap);
    const rowSpan = (j: number, row: Row) => {
        const next = row.at !== undefined && j + 1 < cur.rows.length ? (cur.rows[j + 1].at ?? nextS) : nextS;
        return ((row.at !== undefined ? next : nextS) - (row.at ?? cur.s)) * FPS;
    };

    // 字号：Hook 两段式（小字 That's my + 大字关键词）/ 收尾大字 / 黑场按最长行反推
    const verseSize = Math.min(...cur.rows.map((r) => fitSize(rowText(r), 1340, 156)));
    const rowSize = (j: number, row: Row) => {
        if (isHook) return j === 0 ? 62 : fitSize(rowText(row), 1500, 232);
        if (cur.hookKey === "That's my") return fitSize(rowText(row), 1500, 210);
        if (cur.bowling) return fitSize(rowText(row), 1100, 168);
        return verseSize;
    };

    // 黑场逐字行左对齐（打字从左向右生长的原点稳定），黄场 Hook / 收尾居中
    const align: "left" | "center" = theme === "black" ? "left" : "center";
    const frame = t + s0;
    // 转场放大：整行留在画面里，只把该行的重点词原地放大到铺满画面（黄底接管）→ 硬切黄场
    const rowPopScale = (row: Row) => (row.popZoom !== undefined ? 1 + 16 * prog(t, toT(row.popZoom), 33) : 1);
    const zoomRow = cur.rows.find((r) => r.popZoom !== undefined);
    const zp = zoomRow?.popZoom !== undefined ? prog(t, toT(zoomRow.popZoom), 33) : 0;
    // 末尾把放大的字盖进纯黄底，保证切到黄场零跳变
    const veil = zp > 0.78 ? Math.min(1, (zp - 0.78) / 0.22) : 0;

    return (
        <div style={{ position: "absolute", inset: 0, fontFamily: FONT }}>
            <Fonts />
            {theme === "yellow" ? <YellowBackdrop /> : <BlackBackdrop />}
            <Scanlines t={frame} opacity={theme === "yellow" ? 0.05 : 0.14} />
            <Grain t={frame} opacity={theme === "yellow" ? 0.05 : 0.13} />

            <div style={{ position: "absolute", left: 60, top: 116, fontFamily: MONO, fontSize: 19, letterSpacing: 5, color: `${pal.ink}66` }}>{`L.${String(cur.i).padStart(2, "0")}`}</div>
            {theme === "black" ? (
                <>
                    <div style={{ position: "absolute", right: 60, top: 120, fontFamily: MONO, fontSize: 17, letterSpacing: 4, color: `${pal.ink}66` }}>{LABEL}</div>
                    <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, height: 2, background: `${pal.ink}1A` }} />
                </>
            ) : null}

            {cur.bowling ? <BowlingLine line={cur} t={t} toT={toT} pal={pal} /> : (
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
                                size={rowSize(j, row)}
                                pal={pal}
                                waveAmp={waveAmp}
                                cpf={Math.min(CPF_MAX, (rowGap * 0.55) / Math.max(1, typeChars(row)))}
                                align={align}
                                popScale={rowPopScale(row)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {veil > 0 ? <div style={{ position: "absolute", inset: 0, background: pal.block, opacity: veil, pointerEvents: "none" }} /> : null}
        </div>
    );
};
