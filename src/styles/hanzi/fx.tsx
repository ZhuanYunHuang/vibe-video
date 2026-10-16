import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：深炭底 + 火塘光晕脉动 + 陶纹 + 四角回纹 + 上升火星（Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const pulse = 0.5 + 0.5 * Math.sin(f / 26);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: P.bg }} />
            {/* 火塘光晕 */}
            <div style={{ position: "absolute", left: "50%", bottom: -280, width: 1560, height: 780, marginLeft: -780, background: `radial-gradient(50% 60% at 50% 80%, ${P.accent}59, transparent 70%)`, opacity: 0.45 + 0.3 * pulse }} />
            {/* 陶纹斜纹 */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(45deg, ${P.line}44 0 2px, transparent 2px 46px)`, opacity: 0.5 }} />
            {/* 四角回纹 */}
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
                {[
                    "translate(24 24)",
                    "translate(1896 24) scale(-1 1)",
                    "translate(24 1056) scale(1 -1)",
                    "translate(1896 1056) scale(-1 -1)",
                ].map((tf, i) => (
                    <g key={i} transform={tf} stroke={P.gold} strokeWidth="2.5" fill="none" opacity="0.5">
                        <path d="M0 76 L0 0 L76 0" />
                        <path d="M16 76 L16 16 L76 16" />
                        <path d="M32 76 L32 32 L76 32" opacity="0.6" />
                    </g>
                ))}
            </svg>
            {/* 上升火星 */}
            {Array.from({ length: 14 }, (_, i) => {
                const sp = 0.55 + (i % 5) * 0.16;
                const yy = 1120 - (((f * sp + i * 97) % 1260) | 0);
                const xx = 120 + i * 126 + Math.sin(f / 30 + i * 1.8) * 22;
                const near = Math.min(1, (1120 - yy) / 140) * Math.min(1, Math.max(0, (yy - 60) / 200));
                return <div key={i} style={{ position: "absolute", left: xx, top: yy, width: 5 + (i % 3), height: 5 + (i % 3), borderRadius: "50%", background: i % 3 === 0 ? P.extra?.ember : P.accent, opacity: 0.75 * near * (0.6 + 0.4 * Math.sin(f / 9 + i * 2.2)), boxShadow: `0 0 10px ${P.accent}` }} />;
            })}
            {/* 顶部与底部渐隐 */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${P.bg}CC 0%, transparent 16%, transparent 82%, ${P.bg}CC 100%)` }} />
        </>
    );
};

// 全片 HUD：底部刻痕进度 + 发光火星游标
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 96, right: 96, bottom: 48 }}>
                <div style={{ position: "relative", height: 14 }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 6, height: 2, background: P.line }} />
                    {Array.from({ length: 27 }, (_, i) => (
                        <div key={i} style={{ position: "absolute", left: `${(i * 100) / 26}%`, top: 3, width: 2, height: 8, background: P.line }} />
                    ))}
                    <div style={{ position: "absolute", left: 0, top: 6, height: 2, width: `${p * 100}%`, background: P.accent, boxShadow: `0 0 10px ${P.accent}` }} />
                    <div style={{ position: "absolute", left: `calc(${p * 100}% - 5px)`, top: 2, width: 10, height: 10, borderRadius: "50%", background: P.extra?.ember, boxShadow: `0 0 16px ${P.accent}` }} />
                </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.09, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：火星迸发 + 光晕脉冲 + 轻震
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 8) : 0), 0);
    const step = Math.floor(t / 2);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.sin(step * 2.1) * k * 6}px, ${Math.cos(step * 1.6) * k * 5}px)`, filter: `brightness(${1 + k * 0.35})` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(60% 60% at 50% 60%, ${P.accent}44, transparent 70%)`, opacity: k * 0.5, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：上升火星（上飘 + 摇曳 + 渐隐）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 16, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 80) return null;
    const p = (t - from) / 80;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 26), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.6;
                const r = ease * spread * (0.3 + ((i * 23) % 60) / 100);
                const px = x + Math.cos(a) * r + Math.sin(t / 16 + i) * 8;
                const py = y + Math.sin(a) * r * 0.5 - p * 120 * (0.5 + ((i * 13) % 40) / 100);
                const s = 5 + ((i * 7) % 6);
                return <div key={i} style={{ position: "absolute", left: px, top: py, width: s, height: s, borderRadius: "50%", background: i % 3 === 0 ? P.extra?.ember : i % 3 === 1 ? color : P.gold, opacity: (1 - p) * (0.7 + 0.3 * Math.sin(t / 6 + i * 2)), boxShadow: `0 0 12px ${color}` }} />;
            })}
        </>
    );
};
