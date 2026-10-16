import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：蓝图底 + 两级网格 + 边缘刻度尺 + 游标（Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: P.bg }} />
            {/* 细网格 20px */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${P.extra?.grid}66 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, ${P.extra?.grid}66 0 1px, transparent 1px 20px)` }} />
            {/* 粗网格 100px */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${P.extra?.grid}B3 0 1px, transparent 1px 100px), repeating-linear-gradient(90deg, ${P.extra?.grid}B3 0 1px, transparent 1px 100px)` }} />
            {/* 顶部与左侧刻度尺 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, backgroundImage: `repeating-linear-gradient(90deg, ${P.inkSub} 0 1px, transparent 1px 25px)`, opacity: 0.45 }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 18, backgroundImage: `repeating-linear-gradient(90deg, ${P.ink} 0 2px, transparent 2px 100px)`, opacity: 0.7 }} />
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 10, backgroundImage: `repeating-linear-gradient(0deg, ${P.inkSub} 0 1px, transparent 1px 25px)`, opacity: 0.45 }} />
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 18, backgroundImage: `repeating-linear-gradient(0deg, ${P.ink} 0 2px, transparent 2px 100px)`, opacity: 0.7 }} />
            {/* 缓慢横移的游标线 */}
            <div style={{ position: "absolute", left: `${(f * 0.5) % 1920}px`, top: 0, bottom: 0, width: 1, background: P.accent, opacity: 0.22 }} />
            {/* 角落比例牌 */}
            <div style={{ position: "absolute", right: 36, bottom: 36, border: `1px solid ${P.line}`, background: "#FFFFFFCC" }}>
                <div style={{ fontFamily: 'Consolas,"Cascadia Code",monospace', fontSize: 16, color: P.inkSub, padding: "4px 12px", letterSpacing: 1 }}>SCALE 1:100</div>
            </div>
        </>
    );
};

// 全片 HUD：底部带刻度比例尺 + 缩放比读数
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 96, right: 96, bottom: 44 }}>
                <div style={{ position: "relative", height: 22 }}>
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: P.ink, opacity: 0.85 }} />
                    {Array.from({ length: 21 }, (_, i) => (
                        <div key={i} style={{ position: "absolute", left: `${i * 5}%`, bottom: 0, width: 1, height: i % 2 === 0 ? 13 : 7, background: P.ink, opacity: 0.7 }} />
                    ))}
                    <div style={{ position: "absolute", left: `calc(${p * 100}% - 2px)`, bottom: -2, width: 4, height: 24, background: P.seal }} />
                    <div style={{ position: "absolute", left: `${p * 100}%`, bottom: 26, transform: "translateX(-50%)", fontFamily: 'Consolas,"Cascadia Code",monospace', fontSize: 22, color: P.ink, background: "#FFFFFFD9", border: `1px solid ${P.line}`, padding: "2px 10px", whiteSpace: "nowrap" }}>
                        ×{(1 - 0.16 * p).toFixed(2)}
                    </div>
                </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: P.accentLight, opacity: flash * 0.1, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：刻度尺横向微抖 + 淡蓝闪光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 5) : 0), 0);
    const step = Math.floor(t / 2);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.round(Math.sin(step * 2.7) * 9 * k)}px, 0)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accentLight, opacity: k * 0.16, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：刻度小方块 + 尺寸箭头飞散
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 14, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 46) return null;
    const p = (t - from) / 46;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 26), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 2) * 0.4;
                const r = ease * spread * (0.5 + ((i * 37) % 50) / 100);
                const px = x + Math.cos(a) * r;
                const py = y + Math.sin(a) * r + p * p * 50;
                return i % 2 === 0 ? (
                    <div key={i} style={{ position: "absolute", left: px - 3, top: py - 3, width: 26, height: 6, background: color, clipPath: "polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%)", opacity: (1 - p) * 0.9, transform: `rotate(${a * 57}deg)` }} />
                ) : (
                    <div key={i} style={{ position: "absolute", left: px - 5, top: py - 5, width: 10, height: 10, background: i % 4 === 1 ? P.gold : P.ink, opacity: (1 - p) * 0.85, transform: `rotate(${a * 57 + 45}deg)` }} />
                );
            })}
        </>
    );
};
