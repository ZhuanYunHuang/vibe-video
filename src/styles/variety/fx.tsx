import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：宝蓝舞台 + 放射光束 + 顶部聚光 + 彩色星光 + 舞台灯带（Still 安全）
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 50% 8%, #1E3A78 0%, ${P.bg} 55%, #081226 100%)` }} />
            {/* 放射光束（自底部中心） */}
            <div style={{ position: "absolute", left: "50%", top: 1080, width: 2600, height: 2600, marginLeft: -1300, marginTop: -260, transform: `rotate(${f / 14}deg)`, opacity: 0.13, background: `repeating-conic-gradient(from 0deg at 50% 50%, ${P.accentLight} 0 9deg, transparent 9deg 26deg)`, borderRadius: "50%" }} />
            {/* 顶部两束聚光 */}
            {[-1, 1].map((s, i) => (
                <div key={i} style={{ position: "absolute", left: 960 + s * 430 - 160, top: -60, width: 320, height: 860, background: `linear-gradient(180deg, ${P.accentLight}59, transparent 88%)`, transform: `skewX(${s * -13}deg)`, opacity: 0.5 }} />
            ))}
            {/* 彩色星光 */}
            {[[0.14, 0.24], [0.3, 0.68], [0.46, 0.14], [0.62, 0.5], [0.78, 0.2], [0.88, 0.62], [0.08, 0.46], [0.94, 0.34]].map(([sx, sy], i) => (
                <div key={i} style={{ position: "absolute", left: `${sx * 100}%`, top: `${sy * 100}%`, width: 10, height: 10, clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)", background: [P.accent, P.seal, P.extra?.blue ?? P.accent][i % 3], opacity: 0.35 + 0.55 * Math.abs(Math.sin(f / 16 + i * 1.4)), transform: `rotate(${f / 6 + i * 40}deg)` }} />
            ))}
            {/* 舞台底边灯带 */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 60, background: "linear-gradient(180deg, transparent, #060D1E 62%)" }} />
            {Array.from({ length: 24 }, (_, i) => (
                <div key={i} style={{ position: "absolute", bottom: 18, left: 44 + i * 78, width: 9, height: 9, borderRadius: "50%", background: [P.accent, P.seal, P.gold][i % 3], opacity: 0.45 + 0.55 * Math.abs(Math.sin(f / 18 + i * 0.9)) }} />
            ))}
        </>
    );
};

// 全片 HUD：底部彩色分段粗条 + 跳动圆头游标
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const segs = 24;
    const filled = p * segs;
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    const colors = [P.accent, P.gold, P.seal, P.extra?.blue ?? P.accent];
    return (
        <>
            <div style={{ position: "absolute", left: 130, right: 130, bottom: 52 }}>
                <div style={{ position: "relative", height: 18 }}>
                    {Array.from({ length: segs }, (_, i) => (
                        <div key={i} style={{ position: "absolute", left: `${(i / segs) * 100}%`, width: `calc(${100 / segs}% - 6px)`, height: 14, background: i < filled ? colors[i % colors.length] : `${P.line}`, borderRadius: 4, opacity: i < filled ? 1 : 0.5 }} />
                    ))}
                    <div style={{ position: "absolute", left: `calc(${p * 100}% - 12px)`, top: -6, width: 22, height: 22, borderRadius: "50%", background: "#FFFFFF", border: `4px solid ${P.seal}`, transform: `translateY(${Math.sin(frame / 4) * 3}px)` }} />
                </div>
            </div>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, ${P.accentLight}, ${P.seal})`, opacity: flash * 0.12, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：全屏弹跳 + 彩色洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    const step = Math.floor(t / 2);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.round(Math.sin(step * 2.3) * 9 * k)}px, ${-Math.abs(Math.sin(step * 1.2)) * k * 14}px) rotate(${Math.sin(step * 1.6) * k * 0.5}deg) scale(${1 + k * 0.014})` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${P.accent}, ${P.seal})`, opacity: k * 0.13, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：彩纸屑/星（彩色碎片旋转抛洒 + 重力下坠）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 18, spread = 240, color = P.accent }) => {
    if (t < from || t > from + 56) return null;
    const p = (t - from) / 56;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 22), 3);
    const colors = [color, P.gold, P.seal, P.extra?.blue ?? P.accent, P.extra?.green ?? P.accent];
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 4) * 0.5;
                const r = ease * spread * (0.4 + ((i * 31) % 60) / 100);
                const px = x + Math.cos(a) * r;
                const py = y + Math.sin(a) * r * 0.7 + p * p * 130;
                const w = 12 + ((i * 17) % 10);
                return (
                    <div key={i} style={{ position: "absolute", left: px, top: py, width: w, height: w * 0.62, background: colors[i % colors.length], opacity: (1 - p) * 0.95, transform: `rotate(${a * 57 + p * 320}deg)`, borderRadius: i % 5 === 0 ? "50%" : 2 }} />
                );
            })}
        </>
    );
};
