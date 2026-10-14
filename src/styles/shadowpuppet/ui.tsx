import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, P } from "./theme";

// 皮影戏 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：关节式摆动（吊起入场 + 落定后持续小幅钟摆）+ 幕布透光。

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

// 舞台：整屏光晕呼吸 + 极轻摆（幕布下所有剪影的共性运动）
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div
        style={{
            position: "absolute",
            inset: 0,
            transform: `rotate(${Math.sin(t / 44) * 0.2}deg) scale(${1 + 0.004 * Math.sin(t / 95)})`,
            filter: `brightness(${1 + 0.02 * Math.sin(t / 75)})`,
        }}
    >
        {children}
    </div>
);

// 字幕：楷体，落定后随幕布轻摆
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div
            style={{
                position: "absolute",
                bottom: 84,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 38,
                fontWeight: 700,
                color,
                opacity: s * (1 - out),
                transform: `translateY(${(1 - s) * 26}px) rotate(${Math.sin(t / 30) * 0.4}deg)`,
            }}
        >
            {children}
        </div>
    );
};

// 章节：吊环 + 朱红方牌 + 楷体标题 + 掐丝金双线
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const sway = Math.sin(t / 26) * 1.6;
    return (
        <div style={{ position: "absolute", left: 96, top: 62, display: "flex", alignItems: "center", gap: 24, opacity: s, transform: `translateX(${(1 - s) * -30}px)`, fontFamily: FONT }}>
            <div style={{ position: "relative", width: 78, height: 96, transform: `rotate(${sway}deg)`, transformOrigin: "top center" }}>
                <div style={{ position: "absolute", left: "50%", top: 0, width: 20, height: 20, border: `3.5px solid ${P.ink}`, borderRadius: "50%", transform: "translateX(-50%)" }} />
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 20,
                        width: 78,
                        height: 76,
                        background: color,
                        border: `3.5px solid ${P.ink}`,
                        borderRadius: 5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#F9EED6",
                        fontSize: step.length > 1 ? 26 : 36,
                        fontWeight: 900,
                    }}
                >
                    {step}
                </div>
            </div>
            <div>
                <div style={{ fontSize: 50, fontWeight: 900, color: P.ink, letterSpacing: 4 }}>{title}</div>
                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ width: Math.max(220, title.length * 54), height: 3, background: P.gold }} />
                    <div style={{ width: Math.max(220, title.length * 54) * 0.72, height: 2, background: P.gold, opacity: 0.7 }} />
                </div>
            </div>
        </div>
    );
};

// 大字：剪影字从上方垂落 + 落定钟摆（纯黑 + 向下硬投影模拟透光）
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot = -1, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 11);
    const h = hit(t, from, 4);
    const sway = s > 0.98 ? Math.sin(t / 28) * 0.8 : 0;
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) translateY(${(1 - s) * -90}px) rotate(${rot + sway}deg) scale(${1 + h * 0.05})`,
                opacity: Math.min(1, s * 1.2),
                fontFamily: FONT,
                fontSize: size,
                fontWeight: 900,
                color,
                textShadow: `0 3px 0 ${P.line}`,
                whiteSpace: "nowrap",
            }}
        >
            {children}
        </div>
    );
};

// 纸片卡：透光纸 + 深描边 + 四角金铆钉 + 轻摆
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t = 0, x, y, w, h, appear, lit = 0, rot = 0, float = true, children }) => {
    const bob = appear > 0.9 && float ? Math.sin(t / 32 + (x + y) / 110) * 4 : 0;
    const sway = appear > 0.9 ? Math.sin(t / 28 + (x + y) / 90) * 0.7 : 0;
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `2.5px solid ${P.ink}`,
                borderRadius: 6,
                boxShadow: lit > 0.01 ? `5px 7px 0 ${P.ink}22, 0 0 38px ${P.gold}66` : `5px 7px 0 ${P.ink}22`,
                opacity: appear,
                transform: `translateY(${(1 - appear) * 40 + bob}px) rotate(${rot + sway}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 22,
            }}
        >
            {[
                { left: 10, top: 10 },
                { right: 10, top: 10 },
                { left: 10, bottom: 10 },
                { right: 10, bottom: 10 },
            ].map((pos, i) => (
                <div key={i} style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: P.gold, border: `2px solid ${P.ink}`, ...pos }} />
            ))}
            {children}
        </div>
    );
};

// 朱红方章：吊环 + 方印
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 112, rot = -5, color = P.seal }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * -18}deg) scale(${s * (1 + h * 0.12)})`, opacity: Math.min(1, s * 1.25) }}>
            <div style={{ position: "absolute", left: "50%", top: -14, width: 16, height: 16, border: `3px solid ${P.ink}`, borderRadius: "50%", transform: "translateX(-50%)" }} />
            <div
                style={{
                    width: size,
                    height: size,
                    background: color,
                    border: `3.5px solid ${P.ink}`,
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 4,
                }}
            >
                <div style={{ fontFamily: FONT, fontWeight: 900, color: "#F9EED6", fontSize: text.length > 2 ? size * 0.26 : size * 0.4, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.15 }}>
                    {text.split("").map((ch, i) => (
                        <span key={i}>{ch}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 标注：掐丝金双线圈 或 朱红划线下划
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 220, h = 90, dur = 12, rot = -2, underline = false, note, color = P.gold }) => {
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
                    <path d={`M${cx - rx},${cy + 5} Q${cx - rx / 3},${cy - 6} ${cx},${cy + 4} T${cx + rx},${cy - 2}`} stroke={color} strokeWidth={5} strokeLinecap="round" fill="none" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
                    <path d={`M${cx - rx},${cy + 12} Q${cx + rx / 3},${cy} ${cx + rx},${cy + 7}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.45} pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - Math.max(0, Math.min(1, (t - from - 3) / dur)))} />
                </svg>
            ) : (
                <>
                    <div style={{ position: "absolute", inset: 0, border: `5px solid ${color}`, borderRadius: w > 500 ? 120 : "50%", opacity: p }} />
                    <div style={{ position: "absolute", inset: 0, border: `2px solid ${color}`, borderRadius: w > 500 ? 120 : "50%", transform: "translate(3px, 2px)", opacity: p * 0.5 }} />
                </>
            )}
            {note && t >= from + 4 ? (
                <div style={{ position: "absolute", left: pw - 26, top: -20, fontFamily: FONT, fontSize: 30, fontWeight: 900, color: P.accent, transform: `rotate(-4deg) scale(${pop(t, from + 4, 10)})`, opacity: Math.min(1, pop(t, from + 4, 10) * 1.3), whiteSpace: "nowrap" }}>
                    {note}
                </div>
            ) : null}
        </div>
    );
};
