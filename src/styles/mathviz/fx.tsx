import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：近黑学术底 + 淡点阵网格 + 基准几何 + 稀有星光（Still 安全）
const STARS: Array<[number, number]> = [
    [0.12, 0.18],
    [0.24, 0.62],
    [0.38, 0.12],
    [0.55, 0.82],
    [0.68, 0.24],
    [0.79, 0.58],
    [0.9, 0.14],
    [0.06, 0.86],
];

export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: P.bg }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${P.line} 1.5px, transparent 1.5px)`, backgroundSize: "96px 96px", opacity: 0.5 }} />
            {/* 右侧基准圆与十字轴（SVG，大圆规避圆角坑） */}
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
                <circle cx="1430" cy="430" r="290" fill="none" stroke={P.line} strokeWidth="1.5" opacity="0.55" />
                <line x1="1430" y1="70" x2="1430" y2="790" stroke={P.line} strokeWidth="1" opacity="0.4" />
                <line x1="1070" y1="430" x2="1790" y2="430" stroke={P.line} strokeWidth="1" opacity="0.4" />
            </svg>
            {/* 顶部/底部渐隐 */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${P.bg}D9 0%, transparent 20%, transparent 80%, ${P.bg}D9 100%)` }} />
            {/* 星光 */}
            {STARS.map((s, i) => (
                <div key={i} style={{ position: "absolute", left: `${s[0] * 100}%`, top: `${s[1] * 100}%`, width: 3, height: 3, borderRadius: "50%", background: P.accentLight, opacity: 0.12 + 0.22 * Math.max(0, Math.sin(f / 44 + i * 1.7)) }} />
            ))}
        </>
    );
};

// 全片 HUD：底部极细进度线 + 时间读数，切场柔暗脉冲
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const fade = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 8) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 96, right: 96, bottom: 46 }}>
                <div style={{ position: "relative", height: 2, background: P.line }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: P.accent, opacity: 0.95 - fade * 0.55 }} />
                    <div style={{ position: "absolute", left: `calc(${p * 100}% - 5px)`, top: -4, width: 10, height: 10, transform: "rotate(45deg)", background: P.accent }} />
                </div>
            </div>
            <div style={{ position: "absolute", right: 96, bottom: 40, fontFamily: '"Cascadia Code",Consolas,monospace', fontSize: 20, color: P.inkSub, letterSpacing: 1 }}>
                {(frame / 30).toFixed(1)}s / {(totalFrames / 30).toFixed(1)}s
            </div>
        </>
    );
};

// 重拍卡点：极克制——仅整层轻微推近 + 一道细高亮线脉冲
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 10) : 0), 0);
    return (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + k * 0.006})` }}>
            {children}
            <div style={{ position: "absolute", left: 0, right: 0, top: "50%", height: 1, background: P.accent, opacity: k * 0.3, pointerEvents: "none" }} />
        </div>
    );
};

// 粒子：采样点沿水平正弦线依次浮现
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 15, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 110) return null;
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const at = from + i * 4;
                if (t < at) return null;
                const px = x + (i / Math.max(1, n - 1) - 0.5) * spread * 2;
                const py = y + Math.sin(i * 0.9) * 46 + Math.sin(t / 22 + i) * 4;
                const s = Math.min(1, (t - at) / 8);
                return <div key={i} style={{ position: "absolute", left: px - 4, top: py - 4, width: 8, height: 8, borderRadius: "50%", background: i % 3 === 0 ? P.gold : color, opacity: s * 0.95 }} />;
            })}
        </>
    );
};
