import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：浅灰渐变 + 若干低透明大几何形缓慢漂移（用 useCurrentFrame，Still 里也安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const shapes = [
        { x: 210, y: 230, r: 150, c: P.accentLight, sp: 190, rot: 0 },
        { x: 1730, y: 190, r: 110, c: P.gold, sp: 240, rot: 40 },
        { x: 1790, y: 870, r: 180, c: P.extra?.mint ?? P.accentLight, sp: 210, rot: 15 },
        { x: 170, y: 890, r: 92, c: P.seal, sp: 260, rot: -30 },
    ];
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, #FFFFFF 0%, ${P.bg} 55%, ${P.bgAlt} 100%)` }} />
            {shapes.map((s, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: s.x - s.r,
                        top: s.y - s.r,
                        width: s.r * 2,
                        height: s.r * 2,
                        borderRadius: i % 2 ? 40 : "50%",
                        background: s.c,
                        opacity: 0.16,
                        transform: `translate(${Math.sin(f / s.sp + i) * 26}px, ${Math.cos(f / (s.sp * 1.3) + i) * 20}px) rotate(${s.rot + f / (s.sp * 2)}deg)`,
                    }}
                />
            ))}
        </>
    );
};

// 全片 HUD：胶囊进度条 + 弹性端点 + 切场淡蓝闪光
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 140, bottom: 44, width: 1640, height: 14, background: "#1F293714", borderRadius: 999 }} />
            <div style={{ position: "absolute", left: 140, bottom: 44, width: 1640 * p, height: 14, background: P.accent, borderRadius: 999 }} />
            <div
                style={{
                    position: "absolute",
                    left: 140 + 1640 * p,
                    bottom: 31,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: P.accent,
                    boxShadow: `0 6px 18px ${P.accent}66`,
                    transform: `translateX(-50%) scale(${1 + flash * 0.25})`,
                }}
            />
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.05, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：整屏快速推近 + 淡蓝洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + k * 0.014})` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: k * 0.07, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：几何彩屑（圆/方/三角混合，放射 + 重力）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 16, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 42) return null;
    const p = (t - from) / 42;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 24), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 4) * 0.5;
                const r = ease * spread * (0.4 + ((i * 41) % 50) / 100);
                const s = 14 * (1 - p * 0.6) * (0.6 + ((i * 17) % 40) / 100);
                const c = [color, P.gold, P.seal][i % 3];
                const shape: React.CSSProperties = i % 3 === 0 ? { borderRadius: "50%" } : i % 3 === 1 ? { borderRadius: 3 } : { clipPath: "polygon(50% 0, 100% 100%, 0 100%)" };
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x + Math.cos(a) * r,
                            top: y + Math.sin(a) * r + p * p * 70,
                            width: s,
                            height: s,
                            background: c,
                            opacity: (1 - p) * 0.9,
                            transform: `rotate(${a * 60 + p * 180}deg)`,
                            ...shape,
                        }}
                    />
                );
            })}
        </>
    );
};
