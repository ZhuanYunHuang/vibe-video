import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：暖白 + 细点阵网格 + 角落刻度尺 + 图表水印（useCurrentFrame，Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const barH = [86, 132, 64, 158, 104, 190, 74, 140];
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(165deg, #FFFFFF 0%, ${P.bg} 55%, ${P.bgAlt} 100%)` }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${P.line} 1.6px, transparent 1.6px)`, backgroundSize: "34px 34px", opacity: 0.7 }} />
            {/* 左下角柱状水印 */}
            <div style={{ position: "absolute", left: 70, bottom: 60, display: "flex", alignItems: "flex-end", gap: 16, opacity: 0.12 }}>
                {barH.map((h, i) => (
                    <div key={i} style={{ width: 34, height: h + Math.sin(f / 40 + i) * 6, background: P.accent, borderRadius: 4 }} />
                ))}
            </div>
            {/* 右上角刻度尺 */}
            <div style={{ position: "absolute", right: 80, top: 64, display: "flex", alignItems: "flex-end", gap: 7, opacity: 0.28 }}>
                {Array.from({ length: 22 }, (_, i) => (
                    <div key={i} style={{ width: 3, height: i % 5 === 0 ? 22 : 12, background: P.ink }} />
                ))}
            </div>
            <div style={{ position: "absolute", right: 80, top: 94, fontFamily: '"Cascadia Code",monospace', fontSize: 18, color: P.inkSub, opacity: 0.5 }}>INDEX 0—100</div>
        </>
    );
};

// 全片 HUD：刻度尺进度（刻度轴 + 游标 + 等宽读数）
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 130, right: 130, bottom: 52, height: 3, background: P.line }} />
            <div style={{ position: "absolute", left: 130, bottom: 52, width: (1920 - 260) * p, height: 3, background: P.accent }} />
            {Array.from({ length: 41 }, (_, i) => {
                const x = 130 + ((1920 - 260) / 40) * i;
                const on = i / 40 <= p;
                return <div key={i} style={{ position: "absolute", left: x, bottom: on ? 42 : 46, width: 2, height: on ? 14 : 8, background: on ? P.accent : P.line }} />;
            })}
            <div style={{ position: "absolute", left: 130 + (1920 - 260) * p, bottom: 34, width: 22, height: 22, borderRadius: "50%", background: P.accent, border: "4px solid #FFFFFF", boxShadow: `0 4px 12px ${P.accent}66`, transform: `translateX(-50%) scale(${1 + flash * 0.2})` }} />
            <div style={{ position: "absolute", left: 130 + (1920 - 260) * p, bottom: 12, fontFamily: '"Cascadia Code",monospace', fontSize: 20, color: P.inkSub, transform: "translateX(-50%)" }}>{Math.round(p * 100)}%</div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.05, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：基线弹跳式微震 + 蓝色洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translateY(${Math.sin(t * 2.6) * 5 * k}px)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: k * 0.05, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：数据点（圆点 + 短尾迹，蓝/橙）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 16, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 40) return null;
    const p = (t - from) / 40;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 22), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.6;
                const r = ease * spread * (0.4 + ((i * 37) % 50) / 100);
                const c = [color, P.gold][i % 2];
                const px = x + Math.cos(a) * r;
                const py = y + Math.sin(a) * r + p * p * 50;
                return (
                    <React.Fragment key={i}>
                        <div style={{ position: "absolute", left: px, top: py, width: 4, height: 4, borderRadius: "50%", background: c, opacity: (1 - p) * 0.9 }} />
                        <div style={{ position: "absolute", left: px - Math.cos(a) * 18, top: py - Math.sin(a) * 18, width: 14, height: 2, background: c, opacity: (1 - p) * 0.35, transform: `rotate(${(a * 180) / Math.PI}deg)` }} />
                    </React.Fragment>
                );
            })}
        </>
    );
};
