import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：牛皮纸 + 撕边报纸碎片 + 半调网点 + 胶带痕（useCurrentFrame，Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const sway = Math.sin(f / 60) * 3;
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 46% 40%, #F1E6D0 0%, ${P.bg} 55%, ${P.bgAlt} 100%)` }} />
            {/* 半调网点 */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(#2A262022 1.4px, transparent 1.4px)`, backgroundSize: "22px 22px", opacity: 0.55 }} />
            {/* 撕边纸片 */}
            <div style={{ position: "absolute", left: 60, top: 90, width: 300, height: 210, background: "#F4EEDF", transform: `rotate(-4deg) translateY(${sway}px)`, boxShadow: "5px 6px 0 #2A262015", clipPath: "polygon(0 8px, 6% 2px, 16% 9px, 28% 2px, 42% 8px, 56% 1px, 70% 9px, 84% 3px, 100% 8px, 100% calc(100% - 8px), 88% calc(100% - 2px), 74% calc(100% - 9px), 60% calc(100% - 3px), 46% calc(100% - 8px), 32% calc(100% - 2px), 18% calc(100% - 9px), 6% calc(100% - 3px), 0 calc(100% - 8px))" }}>
                {/* 报纸铅字线 */}
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} style={{ position: "absolute", left: 22, right: 22, top: 26 + i * 28, height: 7, background: "#2A262018", borderRadius: 2 }} />
                ))}
            </div>
            <div style={{ position: "absolute", right: 70, bottom: 120, width: 260, height: 190, background: "#EFE6D2", transform: `rotate(5deg) translateY(${-sway}px)`, boxShadow: "5px 6px 0 #2A262015", clipPath: "polygon(0 6px, 9% 2px, 22% 8px, 36% 1px, 52% 8px, 66% 2px, 80% 9px, 92% 3px, 100% 7px, 100% calc(100% - 7px), 90% calc(100% - 2px), 76% calc(100% - 8px), 62% calc(100% - 3px), 48% calc(100% - 9px), 34% calc(100% - 2px), 20% calc(100% - 8px), 8% calc(100% - 3px), 0 calc(100% - 7px))" }}>
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 24 + i * 30, height: 6, background: "#2A262018", borderRadius: 2 }} />
                ))}
            </div>
            {/* 胶带痕 */}
            <div style={{ position: "absolute", left: 420, top: 150, width: 120, height: 34, background: "#D9CBA670", border: "1px solid #B8A87E88", transform: "rotate(-14deg)" }} />
            <div style={{ position: "absolute", right: 380, top: 560, width: 110, height: 32, background: "#D9CBA670", border: "1px solid #B8A87E88", transform: "rotate(9deg)" }} />
        </>
    );
};

// 全片 HUD：和纸胶带进度条（马克笔划进度）+ 切场油墨洗光
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 120, bottom: 46, width: 1680, height: 26, background: "#D9CBA699", border: "1px solid #B8A87E", transform: "rotate(-0.3deg)" }} />
            <div style={{ position: "absolute", left: 120, bottom: 46, width: 1680 * p, height: 26, background: `${P.accent}CC`, transform: "rotate(-0.3deg)", borderRadius: 3 }} />
            <div style={{ position: "absolute", left: 120 + 1680 * p, bottom: 38, width: 30, height: 30, background: P.ink, borderRadius: "46% 54% 50% 50%", transform: "translateX(-50%)" }} />
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.06, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：纸片被"拍"了一下（错位抖动）
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.sin(t * 2.9) * 5 * k}px, ${Math.cos(t * 2.3) * 4 * k}px) rotate(${Math.sin(t * 3.3) * 0.3 * k}deg)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: k * 0.07, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：碎纸屑（不规则小纸片，旋转飘散）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 16, spread = 230, color = P.accent }) => {
    if (t < from || t > from + 46) return null;
    const p = (t - from) / 46;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 24), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.7;
                const r = ease * spread * (0.4 + ((i * 37) % 50) / 100);
                const w = 10 + (i % 3) * 5;
                const c = [color, P.gold, P.card][i % 3];
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x + Math.cos(a) * r,
                            top: y + Math.sin(a) * r + p * p * 76,
                            width: w,
                            height: w * 0.72,
                            background: c,
                            border: i % 2 ? `1.5px solid ${P.ink}33` : undefined,
                            opacity: (1 - p) * 0.9,
                            transform: `rotate(${a * 70 + p * 260}deg)`,
                        }}
                    />
                );
            })}
        </>
    );
};
