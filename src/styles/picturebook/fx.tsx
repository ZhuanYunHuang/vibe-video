import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：奶油纸纹 + 手绘涂鸦（太阳/云/草地/星星）（Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const drift = Math.sin(f / 90) * 6;
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: P.bg }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${P.line}88 1px, transparent 1.4px)`, backgroundSize: "14px 14px", opacity: 0.32 }} />
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
                {/* 太阳 */}
                <g transform={`translate(1650 195) translate(${drift} 0)`}>
                    <circle cx="0" cy="0" r="62" fill={`${P.gold}55`} stroke={P.ink} strokeWidth="5" />
                    {Array.from({ length: 8 }, (_, i) => {
                        const a = (i / 8) * Math.PI * 2;
                        const r2 = 106 + Math.sin(i * 2.1) * 7;
                        return <line key={i} x1={Math.cos(a) * 80} y1={Math.sin(a) * 80} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={P.ink} strokeWidth="5" strokeLinecap="round" />;
                    })}
                </g>
                {/* 云 */}
                <g transform={`translate(250 175) translate(${-drift * 1.4} 0)`} stroke={P.ink} strokeWidth="5" fill={`${P.seal}1F`}>
                    <ellipse cx="0" cy="0" rx="68" ry="38" />
                    <ellipse cx="66" cy="10" rx="50" ry="30" />
                    <ellipse cx="-62" cy="12" rx="44" ry="27" />
                </g>
                {/* 草地 */}
                <g transform="translate(30 1000)" stroke={P.extra?.green} strokeWidth="6" strokeLinecap="round" fill="none">
                    {Array.from({ length: 12 }, (_, i) => (
                        <path key={i} d={`M${i * 58} 42 q6 -26 14 -34 M${i * 58 + 16} 42 q10 -20 22 -26`} />
                    ))}
                </g>
                {/* 星星 */}
                {[[380, 730], [1500, 790], [880, 140], [1180, 620]].map(([sx, sy], i) => (
                    <g key={i} transform={`translate(${sx} ${sy})`} stroke={P.gold} strokeWidth="5" strokeLinecap="round">
                        <line x1="-13" y1="0" x2="13" y2="0" />
                        <line x1="0" y1="-13" x2="0" y2="13" />
                    </g>
                ))}
            </svg>
        </>
    );
};

// 全片 HUD：底部蜡笔进度线 + 圆点光标
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 7) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 96, right: 96, bottom: 48 }}>
                <div style={{ position: "relative", height: 18 }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 4, height: 6, background: "#FFFDF6", border: `2px solid ${P.line}`, borderRadius: 6 }} />
                    <div style={{ position: "absolute", left: 0, top: 4, height: 6, width: `calc(${p * 100}% - 3px)`, background: P.accent, borderRadius: 6, opacity: 0.9, backgroundImage: `repeating-linear-gradient(100deg, transparent 0 9px, ${P.bg}66 9px 12px)` }} />
                    <div style={{ position: "absolute", left: `calc(${p * 100}% - 9px)`, top: 0, width: 16, height: 16, borderRadius: "50%", background: P.gold, border: `3px solid ${P.ink}` }} />
                </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: P.gold, opacity: flash * 0.1, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：轻弹跳 + 蜡笔色洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 7) : 0), 0);
    const step = Math.floor(t / 2);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.sin(step) * k * 5}px, ${-Math.abs(Math.sin(step * 1.3)) * k * 9}px) rotate(${Math.sin(step * 1.7) * k * 0.35}deg)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.gold, opacity: k * 0.1, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：蜡笔屑（彩色小方块/圆点旋转飘落）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 14, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 60) return null;
    const p = (t - from) / 60;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 24), 3);
    const colors = [color, P.gold, P.seal, P.extra?.green ?? P.gold];
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3);
                const r = ease * spread * (0.35 + ((i * 29) % 60) / 100);
                const px = x + Math.cos(a) * r;
                const py = y + Math.sin(a) * r * 0.6 - p * 40 + p * p * 90;
                const w = 10 + ((i * 13) % 9);
                return <div key={i} style={{ position: "absolute", left: px, top: py, width: w, height: w * 0.72, background: colors[i % colors.length], opacity: (1 - p) * 0.9, transform: `rotate(${a * 57 + p * 220}deg)`, borderRadius: i % 3 === 0 ? "50%" : 3 }} />;
            })}
        </>
    );
};
