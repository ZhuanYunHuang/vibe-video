import React from "react";
import { useCurrentFrame } from "remotion";
import { PixelFontLoader } from "./Fonts";
import { P } from "./theme";

// 背景层：深空底 + 扫描线滚动 + 像素星点 + 像素地平线（useCurrentFrame，Still 里也安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const step = Math.floor(f / 2);
    const stars = Array.from({ length: 26 }, (_, i) => ({
        x: (i * 137) % 1880,
        y: ((i * 251) % 640) + 30,
        s: i % 7 === 0 ? 6 : 4,
        o: (step + i * 7) % 20 < 12 ? 0.85 : 0.3,
    }));
    return (
        <>
            <PixelFontLoader />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${P.bg} 0%, ${P.bgAlt} 100%)` }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 6px)", transform: `translateY(${f % 6}px)` }} />
            {stars.map((st, i) => (
                <div key={i} style={{ position: "absolute", left: st.x, top: st.y, width: st.s, height: st.s, background: i % 5 === 0 ? P.gold : "#E8F0FF", opacity: st.o * 0.8 }} />
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, height: 6, backgroundImage: `repeating-linear-gradient(90deg, ${P.accent} 0 26px, transparent 26px 52px)`, opacity: 0.5, transform: `translateX(${-(f % 52)}px)` }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, background: P.line, opacity: 0.5 }} />
        </>
    );
};

// 全片 HUD：分段像素血条（逐格点亮，前沿一格闪烁）+ 切场淡绿洗光
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const segs = 42;
    const filled = Math.floor(p * segs);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 130, bottom: 48, display: "flex", gap: 6 }}>
                {Array.from({ length: segs }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 30,
                            height: 14,
                            background: i < filled ? P.accent : i === filled ? (Math.floor(frame / 6) % 2 ? P.accentLight : P.line) : P.line,
                            opacity: i < filled ? 1 : 0.7,
                        }}
                    />
                ))}
            </div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.05, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：卡帧式硬抖动 + 像素洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    const step = Math.floor(t / 2);
    const kk = k > 0.25 ? 1 : 0;
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.round(Math.sin(step * 2.3) * 8 * kk)}px, ${Math.round(Math.cos(step * 1.9) * 6 * kk)}px)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: k * 0.1, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：纯色像素方块迸射（无圆角无发光）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 16, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 40) return null;
    const p = (t - from) / 40;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 22), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.7;
                const r = ease * spread * (0.4 + ((i * 37) % 50) / 100);
                const s = Math.max(4, Math.round(12 * (1 - p * 0.7)));
                const c = [color, P.gold, P.seal][i % 3];
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: Math.round(x + Math.cos(a) * r),
                            top: Math.round(y + Math.sin(a) * r + p * p * 60),
                            width: s,
                            height: s,
                            background: c,
                            opacity: (1 - p) * 0.9,
                        }}
                    />
                );
            })}
        </>
    );
};
