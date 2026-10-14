import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：深紫渐变 + 落日圆盘 + 透视网格向地平线滚动 + 星点（useCurrentFrame，Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const stars = Array.from({ length: 22 }, (_, i) => ({
        x: (i * 173) % 1880,
        y: ((i * 241) % 500) + 30,
        s: i % 6 === 0 ? 5 : 3,
        o: ((Math.floor(f / 8) + i * 5) % 22) < 14 ? 0.9 : 0.3,
    }));
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #0C0520 0%, ${P.bg} 45%, ${P.bgAlt} 100%)` }} />
            {stars.map((st, i) => (
                <div key={i} style={{ position: "absolute", left: st.x, top: st.y, width: st.s, height: st.s, borderRadius: "50%", background: i % 5 === 0 ? P.gold : "#FFE9FF", opacity: st.o * 0.85 }} />
            ))}
            {/* 落日（渐变圆盘 + 水平条纹切割） */}
            <div style={{ position: "absolute", left: 960 - 210, top: 300, width: 420, height: 420, borderRadius: "50%", overflow: "hidden", background: `linear-gradient(180deg, ${P.seal} 0%, ${P.accent} 48%, ${P.accentDeep} 100%)`, boxShadow: `0 0 80px ${P.accent}55` }}>
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: 60 + i * 62, height: 16 + i * 10, background: P.bg, opacity: 0.92 }} />
                ))}
            </div>
            {/* 地平线光带 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 716, height: 3, background: `${P.gold}CC`, boxShadow: `0 0 24px ${P.gold}` }} />
            {/* 透视网格：向地平线滚动 */}
            <div
                style={{
                    position: "absolute",
                    left: -400,
                    right: -400,
                    top: 718,
                    bottom: -120,
                    transform: "perspective(560px) rotateX(63deg)",
                    transformOrigin: "50% 0%",
                    backgroundImage: `repeating-linear-gradient(0deg, ${P.accent}66 0 3px, transparent 3px 92px), repeating-linear-gradient(90deg, ${P.accent}44 0 3px, transparent 3px 92px)`,
                    backgroundPositionY: `${(f * 2.4) % 92}px`,
                    opacity: 0.75,
                }}
            />
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 719, background: `linear-gradient(180deg, transparent 70%, ${P.bgAlt}CC 100%)` }} />
        </>
    );
};

// 全片 HUD：霓虹进度条 + 发光端点
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 130, bottom: 48, width: 1660, height: 10, background: "#FFFFFF14", borderRadius: 5 }} />
            <div style={{ position: "absolute", left: 130, bottom: 48, width: 1660 * p, height: 10, background: `linear-gradient(90deg, ${P.accent}, ${P.gold})`, borderRadius: 5, boxShadow: `0 0 18px ${P.accent}88` }} />
            <div style={{ position: "absolute", left: 130 + 1660 * p, bottom: 39, width: 28, height: 28, borderRadius: "50%", background: P.gold, boxShadow: `0 0 22px ${P.gold}`, transform: `translateX(-50%) scale(${1 + flash * 0.25})` }} />
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.07, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：左右错位（轻微色散感）+ 霓虹洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${Math.sin(t * 2.5) * 7 * k}px)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: k * 0.1, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：星尘（发光圆点 + 飞线）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 18, spread = 260, color = P.gold }) => {
    if (t < from || t > from + 42) return null;
    const p = (t - from) / 42;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 22), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.6;
                const r = ease * spread * (0.4 + ((i * 41) % 50) / 100);
                const c = [color, P.accent, P.ink][i % 3];
                const px = x + Math.cos(a) * r;
                const py = y + Math.sin(a) * r;
                return (
                    <React.Fragment key={i}>
                        <div style={{ position: "absolute", left: px, top: py, width: 6, height: 6, borderRadius: "50%", background: c, opacity: (1 - p) * 0.95, boxShadow: `0 0 12px ${c}` }} />
                        <div style={{ position: "absolute", left: px - Math.cos(a) * 26, top: py - Math.sin(a) * 26, width: 24, height: 2.5, background: c, opacity: (1 - p) * 0.45, transform: `rotate(${(a * 180) / Math.PI}deg)`, boxShadow: `0 0 8px ${c}88` }} />
                    </React.Fragment>
                );
            })}
        </>
    );
};
