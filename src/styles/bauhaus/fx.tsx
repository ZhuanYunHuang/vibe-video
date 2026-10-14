import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：米白 + 网格 + 页边距框 + 角落构成（圆/三角/矩形，缓慢旋转）（Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: P.bg }} />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(0deg, ${P.line} 0 1px, transparent 1px 120px), repeating-linear-gradient(90deg, ${P.line} 0 1px, transparent 1px 120px)`,
                    opacity: 0.5,
                }}
            />
            <div style={{ position: "absolute", inset: 44, border: `2px solid ${P.ink}22` }} />
            {/* 右上：红色半圆缓转 */}
            <div style={{ position: "absolute", right: -60, top: -70, width: 260, height: 260, borderRadius: "50%", background: P.seal, opacity: 0.9, clipPath: "inset(0 0 50% 0)", transform: `rotate(${f / 6}deg)` }} />
            {/* 左下：蓝色三角 */}
            <div style={{ position: "absolute", left: -40, bottom: -40, width: 260, height: 240, background: P.accent, clipPath: "polygon(50% 0, 100% 100%, 0 100%)", opacity: 0.85, transform: `translateY(${Math.sin(f / 70) * 8}px)` }} />
            {/* 右下：黄色矩形 */}
            <div style={{ position: "absolute", right: 150, bottom: 90, width: 120, height: 120, background: P.gold, opacity: 0.9, transform: `rotate(${45 + Math.sin(f / 90) * 6}deg)` }} />
        </>
    );
};

// 全片 HUD：三原色分段进度（红→黄→蓝）+ 黑游标
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const segs = 36;
    const filled = p * segs;
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            {Array.from({ length: segs }, (_, i) => {
                const c = i < segs / 3 ? P.seal : i < (segs * 2) / 3 ? P.gold : P.accent;
                const on = i < filled;
                return <div key={i} style={{ position: "absolute", left: 130 + i * 46, bottom: 50, width: 40, height: 16, background: on ? c : "#11111114" }} />;
            })}
            <div style={{ position: "absolute", left: 130 + filled * 46 - 3, bottom: 40, width: 6, height: 36, background: P.ink, transform: `scaleY(${1 + flash * 0.3})` }} />
            <div style={{ position: "absolute", inset: 0, background: P.ink, opacity: flash * 0.04, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：构成块瞬切位移
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    const step = Math.floor(t / 2);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.round(Math.sin(step * 2.2) * 7 * k)}px, ${Math.round(Math.cos(step * 1.8) * 5 * k)}px)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.gold, opacity: k * 0.1, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：三原色几何粒（圆/方/三角）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 15, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 40) return null;
    const p = (t - from) / 40;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 22), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.5;
                const r = ease * spread * (0.4 + ((i * 41) % 50) / 100);
                const s = 16 * (1 - p * 0.5);
                const c = [color, P.seal, P.gold][i % 3];
                const shape: React.CSSProperties = i % 3 === 0 ? { borderRadius: "50%" } : i % 3 === 1 ? {} : { clipPath: "polygon(50% 0, 100% 100%, 0 100%)" };
                return (
                    <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * r, top: y + Math.sin(a) * r + p * p * 60, width: s, height: s, background: c, opacity: (1 - p) * 0.9, transform: `rotate(${a * 57}deg)`, ...shape }} />
                );
            })}
        </>
    );
};
