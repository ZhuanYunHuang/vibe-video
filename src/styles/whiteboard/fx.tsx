import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：白板面 + 淡格线 + 若干马克笔残迹（静态，无 hook）
export const Backdrop: React.FC = () => (
    <>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, #FFFFFF 0%, ${P.bg} 62%, #ECECE3 100%)` }} />
        <div
            style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `repeating-linear-gradient(0deg, ${P.line}55 0 1px, transparent 1px 74px), repeating-linear-gradient(90deg, ${P.line}44 0 1px, transparent 1px 74px)`,
                backgroundPosition: "12px 8px",
            }}
        />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d="M120,930 Q360,900 640,922" stroke={P.accent} strokeWidth={10} strokeLinecap="round" opacity={0.06} fill="none" />
            <path d="M1320,120 Q1500,104 1720,118" stroke={P.ink} strokeWidth={8} strokeLinecap="round" opacity={0.05} fill="none" />
            <circle cx={1780} cy={880} r={90} stroke={P.ink} strokeWidth={6} opacity={0.05} fill="none" />
        </svg>
    </>
);

// 全片 HUD：底部马克笔手绘进度线（笔尖圆头推进）+ 切场红马克洗光
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 120, bottom: 46, width: 1680, height: 10, background: "#23272E14", borderRadius: 5 }} />
            <div style={{ position: "absolute", left: 120, bottom: 46, width: 1680 * p, height: 10, background: P.accent, borderRadius: 5, transform: `rotate(${Math.sin(frame / 9) * 0.3}deg)` }} />
            <div style={{ position: "absolute", left: 120 + 1680 * p, bottom: 38, width: 24, height: 24, borderRadius: "50% 50% 50% 50% / 62% 62% 38% 38%", background: P.ink, transform: "translateX(-50%)" }} />
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.06, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：16 拍边界全场景手抖 + 红马克洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.sin(t * 2.7) * 6 * k}px, ${Math.cos(t * 2.1) * 4 * k}px) rotate(${Math.sin(t * 3.1) * 0.25 * k}deg)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: k * 0.06, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：粉笔屑/马克飞沫
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 14, spread = 220, color = P.accent }) => {
    if (t < from || t > from + 40) return null;
    const p = (t - from) / 40;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 22), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.7;
                const r = ease * spread * (0.4 + ((i * 37) % 50) / 100);
                const s = 10 * (1 - p) * (0.5 + ((i * 13) % 40) / 100);
                const c = [color, P.ink, P.gold][i % 3];
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x + Math.cos(a) * r,
                            top: y + Math.sin(a) * r + p * p * 64,
                            width: s,
                            height: s,
                            borderRadius: "46% 54% 52% 48%",
                            background: c,
                            opacity: (1 - p) * 0.85,
                        }}
                    />
                );
            })}
        </>
    );
};
