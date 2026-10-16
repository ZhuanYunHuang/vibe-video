import React from "react";
import { useCurrentFrame } from "remotion";
import { elastic } from "../../shared";
import { P } from "./theme";

// 背景层：石墨径向底 + 等距网格 + 顶部主光 + 地面接触阴影（Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const drift = Math.sin(f / 150) * 8;
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(95% 75% at 50% 0%, #262B36 0%, ${P.bg} 58%, #0B0D11 100%)` }} />
            {/* 等距网格地面 */}
            <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <div
                    style={{
                        position: "absolute",
                        left: "-30%",
                        right: "-30%",
                        top: "26%",
                        bottom: "-26%",
                        backgroundImage: `repeating-linear-gradient(60deg, ${P.line}55 0 1px, transparent 1px 90px), repeating-linear-gradient(-60deg, ${P.line}55 0 1px, transparent 1px 90px)`,
                        transform: `translateY(${drift}px)`,
                        opacity: 0.45,
                    }}
                />
            </div>
            {/* 顶部主光 */}
            <div style={{ position: "absolute", left: "50%", top: -260, width: 1320, height: 780, marginLeft: -660, background: `radial-gradient(50% 55% at 50% 42%, ${P.accentLight}30, transparent 70%)` }} />
            {/* 地面接触阴影 */}
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0 }}>
                <ellipse cx="960" cy="905" rx="420" ry="58" fill={P.extra?.shadow} opacity="0.5" />
                <ellipse cx="960" cy="905" rx="240" ry="30" fill={P.extra?.shadow} opacity="0.55" />
            </svg>
            {/* 四角与顶底渐隐 */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${P.bg}00 62%, ${P.bg}D9 100%)` }} />
        </>
    );
};

// 全片 HUD：底部装配进度轨 + 菱形滑块 + 百分比读数
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 130, right: 130, bottom: 52 }}>
                <div style={{ position: "relative", height: 14 }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 5, height: 4, background: P.line, borderRadius: 2 }} />
                    <div style={{ position: "absolute", left: 0, top: 5, height: 4, width: `calc(${p * 100}% - 2px)`, background: `linear-gradient(90deg, ${P.accentDeep}, ${P.accent})`, borderRadius: 2, boxShadow: `0 0 14px ${P.accent}66` }} />
                    <div style={{ position: "absolute", left: `calc(${p * 100}% - 7px)`, top: 0, width: 14, height: 14, background: P.accent, borderRadius: 3, transform: `rotate(45deg) scale(${0.85 + 0.15 * Math.cos((frame / 8) * Math.PI)})` }} />
                    <div style={{ position: "absolute", right: 0, top: -28, fontFamily: '"Cascadia Code",Consolas,monospace', fontSize: 20, color: P.inkSub, letterSpacing: 2 }}>{Math.round(p * 100)}% ASSEMBLY</div>
                </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: flash * 0.05, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：部件"咔"弹开（弹性位移）+ 琥珀曝光闪
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? elastic(t, K(b), 26, 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${k * 10}px, ${-k * 8}px)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accentLight, opacity: Math.abs(k) * 0.12, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：金属碎屑（细亮条 + 小方块，重力下坠 + 旋转）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 16, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 56) return null;
    const p = (t - from) / 56;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 22), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.7;
                const r = ease * spread * (0.35 + ((i * 37) % 60) / 100);
                const px = x + Math.cos(a) * r;
                const py = y + Math.sin(a) * r * 0.6 + p * p * 130;
                const c = [color, P.gold, P.extra?.metal ?? "#AEB6C6"][i % 3];
                return i % 2 === 0 ? (
                    <div key={i} style={{ position: "absolute", left: px, top: py, width: 18, height: 4, background: c, opacity: (1 - p) * 0.95, transform: `rotate(${a * 57 + p * 240}deg)`, borderRadius: 2 }} />
                ) : (
                    <div key={i} style={{ position: "absolute", left: px - 4, top: py - 4, width: 9, height: 9, background: c, opacity: (1 - p) * 0.9, transform: `rotate(${a * 57 + p * 200}deg)`, borderRadius: 2 }} />
                );
            })}
        </>
    );
};
