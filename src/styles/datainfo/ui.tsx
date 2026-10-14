import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, MONO, P } from "./theme";

// 数据信息图 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：数字滚动计数 + 图表生长 + 基线刻度。

// 绝对拍号 -> 场景内帧
export const useK = (start: number) => {
    const at = useAt();
    return (beat: number) => at(start, beat - start);
};

// 拍点脉冲（0~1）
export const usePulse = (start: number) => {
    const beat = useBeat();
    const t = useT();
    return beat.beatPulse(beat.bf(start) + t);
};

// 数字滚动计数器（本风格私有）：从 0 滚到 value
export const Counter: React.FC<{ t: number; from: number; dur?: number; value: number; decimals?: number; color?: string; size?: number }> = ({ t, from, dur = 40, value, decimals = 0, color = P.accent, size = 96 }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    const shown = (value * p).toFixed(decimals);
    return (
        <span style={{ fontFamily: MONO, fontSize: size, fontWeight: 700, color, letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>{shown}</span>
    );
};

// 舞台：轻视差 + 聚焦呼吸
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div
        style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${1.006 + 0.006 * Math.sin(t / 150)}) translate(${Math.sin(t / 260) * 5}px, ${Math.cos(t / 240) * 4}px)`,
        }}
    >
        {children}
    </div>
);

// 字幕：正文 + 居中细刻度线
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: s * (1 - out), transform: `translateY(${(1 - s) * 24}px)` }}>
            <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color }}>{children}</div>
            <div style={{ width: 220, height: 3, background: P.accent, margin: "12px auto 0", opacity: 0.7 }} />
        </div>
    );
};

// 章节：编号块 + 标题 + 刻度尺下划线（逐格点亮）
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 16);
    const segs = 24;
    return (
        <div style={{ position: "absolute", left: 96, top: 58, display: "flex", alignItems: "center", gap: 20, opacity: s, transform: `translateX(${(1 - s) * -30}px)` }}>
            <div style={{ minWidth: 72, height: 72, padding: "0 14px", background: color, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontFamily: MONO, fontSize: step.length > 1 ? 24 : 34, fontWeight: 700, boxShadow: `0 8px 20px ${color}44` }}>
                {step}
            </div>
            <div>
                <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 900, color: P.ink, letterSpacing: 2 }}>{title}</div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginTop: 10 }}>
                    {Array.from({ length: segs }, (_, i) => (
                        <div key={i} style={{ width: 4, height: i / segs < u ? (i % 4 === 0 ? 16 : 9) : 5, background: i / segs < u ? color : P.line }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 大字：粗体 + 基线色条生长 + 落点微弹
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot = 0, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    const u = prog(t, from + 3, 12);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * 2}deg) scale(${(1.3 - 0.3 * s) * (1 + h * 0.04)})`, opacity: Math.min(1, s * 1.2), fontFamily: FONT, fontSize: size, fontWeight: 900, color, whiteSpace: "nowrap", letterSpacing: 3 }}>
            {children}
            <div style={{ height: 8, background: P.accent, marginTop: 10, transform: `scaleX(${u})`, transformOrigin: "left center", borderRadius: 2 }} />
        </div>
    );
};

// 卡片：白卡 + 细边 + 顶部色带 + 图表角标
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t = 0, x, y, w, h, appear, lit = 0, rot = 0, float = true, children }) => {
    const bob = appear > 0.9 && float ? Math.sin(t / 30 + (x + y) / 100) * 3 : 0;
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `1px solid ${P.line}`,
                borderRadius: 10,
                boxShadow: lit > 0.01 ? `0 12px 34px #1A223314, 0 0 40px ${P.accent}33` : "0 12px 34px #1A223314",
                opacity: appear,
                transform: `translateY(${(1 - appear) * 40 + bob}px) rotate(${rot}deg) scale(${0.94 + 0.06 * appear})`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${P.accent}, ${P.accentLight})` }} />
            {children}
        </div>
    );
};

// 徽章：圆形读数章（白底 + 粗描边 + 等宽读数）
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 112, rot = -6, color = P.accent }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: size,
                height: size,
                transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * -16}deg) scale(${s * (1 + h * 0.12)})`,
                opacity: Math.min(1, s * 1.2),
                background: P.card,
                border: `5px solid ${color}`,
                borderRadius: "50%",
                boxShadow: `0 10px 26px ${color}44, inset 0 0 0 3px ${color}22`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ fontFamily: MONO, fontWeight: 700, color, fontSize: text.length > 3 ? size * 0.26 : size * 0.3, textAlign: "center", lineHeight: 1.15, padding: 4 }}>{text}</div>
        </div>
    );
};

// 标注：数据括号标注（四角折线括起）或蓝色下划线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 240, h = 90, dur = 12, rot = 0, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    const bracket = Math.min(1, p * 1.6) * 16;
    return (
        <>
            {underline ? (
                <div style={{ position: "absolute", left: x - w / 2, top: y, width: w * p, height: 6, background: color, borderRadius: 3, opacity: 0.85 }} />
            ) : (
                <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <g stroke={color} strokeWidth={4} fill="none" opacity={p}>
                        {/* 左上折线 */}
                        <path d={`M${x - w / 2},${y - h / 2 + bracket} L${x - w / 2},${y - h / 2} L${x - w / 2 + bracket},${y - h / 2}`} />
                        <path d={`M${x + w / 2 - bracket},${y - h / 2} L${x + w / 2},${y - h / 2} L${x + w / 2},${y - h / 2 + bracket}`} />
                        <path d={`M${x - w / 2},${y + h / 2 - bracket} L${x - w / 2},${y + h / 2} L${x - w / 2 + bracket},${y + h / 2}`} />
                        <path d={`M${x + w / 2 - bracket},${y + h / 2} L${x + w / 2},${y + h / 2} L${x + w / 2},${y + h / 2 - bracket}`} />
                    </g>
                    {p > 0.6 ? <line x1={x + w / 2 + 10} y1={y - h / 2} x2={x + w / 2 + 64} y2={y - h / 2 - 44} stroke={P.gold} strokeWidth={3} opacity={prog(t, from + 6, 8)} /> : null}
                </svg>
            )}
            {note && t >= from + 4 ? (
                <div style={{ position: "absolute", left: x + w / 2 + 72, top: y - h / 2 - 66, fontFamily: MONO, fontSize: 30, fontWeight: 700, color: P.gold, opacity: Math.min(1, pop(t, from + 4, 10) * 1.3), whiteSpace: "nowrap" }}>
                    {note}
                </div>
            ) : null}
        </>
    );
};
