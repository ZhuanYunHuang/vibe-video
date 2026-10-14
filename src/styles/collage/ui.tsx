import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { DECOR, FONT, P } from "./theme";

// 拼贴 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：错位各自摆动（纸片被风吹）+ 入场"啪"贴上（快 pop + 微旋 settle）。

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

// 舞台：整屏极轻呼吸
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1.004 + 0.003 * Math.sin(t / 110)}) rotate(${Math.sin(t / 90) * 0.12}deg)` }}>{children}</div>
);

// 字幕：纸条（白条 + 硬投影 + 两端胶带小角）
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    const sway = Math.sin(t / 34) * 0.5;
    return (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: s * (1 - out), transform: `translateY(${(1 - s) * 22}px)` }}>
            <span style={{ position: "relative", display: "inline-block", background: P.card, padding: "13px 46px", fontFamily: FONT, fontSize: 36, fontWeight: 800, color, transform: `rotate(${-0.8 + sway}deg)`, boxShadow: "6px 7px 0 #2A262026" }}>
                <span style={{ position: "absolute", left: -16, top: -10, width: 46, height: 20, background: "#D9CBA699", border: "1px solid #B8A87E", transform: "rotate(-8deg)" }} />
                <span style={{ position: "absolute", right: -16, top: -10, width: 46, height: 20, background: "#D9CBA699", border: "1px solid #B8A87E", transform: "rotate(7deg)" }} />
                {children}
            </span>
        </div>
    );
};

// 章节：黑底剪报横条 + 圈号 + 红笔下划
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 16);
    const sway = Math.sin(t / 38) * 0.6;
    return (
        <div style={{ position: "absolute", left: 96, top: 58, display: "flex", alignItems: "center", gap: 20, opacity: s, transform: `translateX(${(1 - s) * -30}px) rotate(${sway}deg)` }}>
            <div style={{ width: 74, height: 74, border: `4px solid ${P.ink}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: P.card, fontFamily: FONT, fontSize: step.length > 1 ? 24 : 34, fontWeight: 900, color: P.ink, transform: "rotate(-6deg)" }}>
                {step}
            </div>
            <div style={{ background: P.ink, padding: "10px 26px", transform: "rotate(-0.6deg)", boxShadow: "5px 6px 0 #2A262026" }}>
                <div style={{ fontFamily: FONT, fontSize: 46, fontWeight: 900, color: P.card, letterSpacing: 3 }}>{title}</div>
            </div>
            <div style={{ width: Math.max(120, title.length * 30) * u, height: 8, background: color, marginLeft: -14, marginTop: 66, transform: `rotate(-1.4deg)`, opacity: 0.9 }} />
        </div>
    );
};

// 大字：剪报纸条（底衬错位色条 + 白条黑字 + 啪贴入 + 落定摆动）
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot = -1.5, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 9);
    const h = hit(t, from, 4);
    const sway = s > 0.98 ? Math.sin(t / 30) * 0.7 : 0;
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot + sway + (1 - s) * 7}deg) scale(${(1.4 - 0.4 * s) * (1 + h * 0.05)})`, opacity: Math.min(1, s * 1.25) }}>
            <div style={{ position: "absolute", left: 12, top: 10, right: -12, bottom: -10, background: P.gold, transform: "rotate(1.2deg)" }} />
            <div style={{ position: "relative", background: P.card, padding: "10px 34px", boxShadow: "6px 7px 0 #2A262026" }}>
                <div style={{ fontFamily: FONT, fontSize: size, fontWeight: 900, color, whiteSpace: "nowrap", letterSpacing: 2 }}>{children}</div>
            </div>
        </div>
    );
};

// 卡片：撕边纸片（clip-path 撕边 + 硬投影 + 错位摆动）
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t = 0, x, y, w, h, appear, lit = 0, rot = 0, float = true, children }) => {
    const bob = appear > 0.9 && float ? Math.sin(t / 30 + (x + y) / 100) * 4 : 0;
    const sway = appear > 0.9 ? Math.sin(t / 26 + (x + y) / 80) * 0.8 : 0;
    const tear = "polygon(0 6px, 3% 2px, 8% 7px, 15% 1px, 22% 6px, 30% 2px, 38% 8px, 47% 2px, 55% 7px, 63% 1px, 71% 6px, 79% 2px, 86% 7px, 93% 3px, 100% 6px, 100% calc(100% - 6px), 96% calc(100% - 2px), 90% calc(100% - 7px), 82% calc(100% - 1px), 74% calc(100% - 6px), 66% calc(100% - 2px), 57% calc(100% - 8px), 48% calc(100% - 2px), 40% calc(100% - 6px), 32% calc(100% - 2px), 24% calc(100% - 7px), 16% calc(100% - 2px), 8% calc(100% - 6px), 3% calc(100% - 3px), 0 calc(100% - 6px))";
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                clipPath: tear,
                filter: lit > 0.01 ? `drop-shadow(0 0 26px ${P.gold}88)` : undefined,
                boxShadow: "7px 9px 0 #2A262024",
                opacity: appear,
                transform: `translateY(${(1 - appear) * 36 + bob}px) rotate(${rot + sway}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 26,
            }}
        >
            {children}
        </div>
    );
};

// 徽章：拍立得照片框（白框宽底边 + 图面文字）
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 130, rot = -7, color = P.ink }) => {
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
                height: size * 1.12,
                transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * -14}deg) scale(${s * (1 + h * 0.1)})`,
                opacity: Math.min(1, s * 1.2),
                background: "#FFFFFF",
                padding: "12px 12px 30px",
                boxShadow: "8px 10px 0 #2A262026",
            }}
        >
            <div style={{ width: "100%", height: "100%", background: P.bgAlt, border: `2px solid ${P.ink}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: DECOR, fontWeight: 900, color, fontSize: text.length > 2 ? size * 0.24 : size * 0.36, textAlign: "center", lineHeight: 1.25, padding: 6 }}>{text}</div>
            </div>
        </div>
    );
};

// 标注：红马克圈 / 划线（手绘感）
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 220, h = 90, dur = 12, rot = -3, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    const pw = w + 48;
    const ph = h + 48;
    const cx = pw / 2;
    const cy = ph / 2;
    const rx = w / 2;
    return (
        <div style={{ position: "absolute", left: x - pw / 2, top: y - ph / 2, width: pw, height: ph, transform: `rotate(${rot}deg)`, pointerEvents: "none" }}>
            {underline ? (
                <svg width={pw} height={ph} style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d={`M${cx - rx},${cy + 5} Q${cx - rx / 3},${cy - 7} ${cx},${cy + 4} T${cx + rx},${cy - 2}`} stroke={color} strokeWidth={5} strokeLinecap="round" fill="none" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
                    <path d={`M${cx - rx},${cy + 12} Q${cx + rx / 3},${cy} ${cx + rx},${cy + 7}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.45} pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - Math.max(0, Math.min(1, (t - from - 3) / dur)))} />
                </svg>
            ) : (
                <div style={{ position: "absolute", inset: 0, border: `5px solid ${color}`, borderRadius: w > 500 ? 120 : "50%", opacity: p, transform: "rotate(-2deg)" }} />
            )}
            {note && t >= from + 4 ? (
                <div style={{ position: "absolute", left: pw - 26, top: -22, fontFamily: DECOR, fontSize: 30, fontWeight: 900, color, transform: `rotate(4deg) scale(${pop(t, from + 4, 10)})`, opacity: Math.min(1, pop(t, from + 4, 10) * 1.3), whiteSpace: "nowrap" }}>
                    {note}
                </div>
            ) : null}
        </div>
    );
};
