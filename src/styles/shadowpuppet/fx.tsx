import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 背景层：幕布透光（径向光斑呼吸 + 布纹 + 暗角）+ 底部横杆与帘绳
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    const glow = 1 + 0.03 * Math.sin(f / 80);
    return (
        <>
            <div
                style={{
                    position: "absolute",
                    inset: -60,
                    background: `radial-gradient(ellipse at 50% 42%, #FFF3D8 0%, ${P.bg} 45%, ${P.bgAlt} 78%, #C9AF7E 100%)`,
                    transform: `scale(${glow})`,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "repeating-linear-gradient(90deg, rgba(120,95,55,0.05) 0 2px, transparent 2px 9px), repeating-linear-gradient(0deg, rgba(120,95,55,0.04) 0 2px, transparent 2px 11px)",
                }}
            />
            <div style={{ position: "absolute", left: 56, right: 56, bottom: 30, height: 10, background: "#7A5C33", borderRadius: 5, boxShadow: "0 3px 0 #5C451F" }} />
            <div style={{ position: "absolute", left: 48, top: 0, bottom: 26, width: 3, background: "#8A6A3E88" }} />
            <div style={{ position: "absolute", right: 48, top: 0, bottom: 26, width: 3, background: "#8A6A3E88" }} />
        </>
    );
};

// 全片 HUD：底部横杆上一个小剪影随进度走 + 切场暖光洗
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    const x = 90 + (1920 - 180) * p;
    const swing = Math.sin(frame / 22) * 3;
    return (
        <>
            <div style={{ position: "absolute", left: x, bottom: 40, transform: `translateX(-50%) rotate(${swing}deg)`, transformOrigin: "top center" }}>
                <svg width={54} height={62}>
                    <line x1={27} y1={0} x2={27} y2={16} stroke={P.ink} strokeWidth={2.5} />
                    <circle cx={27} cy={24} r={11} fill={P.ink} />
                    <path d="M27,36 Q8,44 6,62 L48,62 Q46,44 27,36 Z" fill={P.ink} />
                </svg>
            </div>
            <div style={{ position: "absolute", left: 90, bottom: 32, width: (1920 - 180) * p, height: 6, background: P.accent, borderRadius: 3, opacity: 0.85 }} />
            <div style={{ position: "absolute", inset: 0, background: "#FFE9B8", opacity: flash * 0.1, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：幕布吊摆震动
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `rotate(${Math.sin(t * 2.4) * 0.5 * k}deg) translateY(${Math.cos(t * 2.1) * 4 * k}px)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: "#FFE9B8", opacity: k * 0.12, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：透光浮尘（柔和圆点，缓升摆动）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 14, spread = 220, color = P.gold }) => {
    if (t < from || t > from + 46) return null;
    const p = (t - from) / 46;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 26), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.8;
                const r = ease * spread * (0.4 + ((i * 37) % 50) / 100);
                const s = 9 * (1 - p * 0.5) * (0.5 + ((i * 13) % 40) / 100);
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x + Math.cos(a) * r + Math.sin(t / 20 + i) * 6,
                            top: y + Math.sin(a) * r - p * 40,
                            width: s,
                            height: s,
                            borderRadius: "50%",
                            background: i % 2 ? P.gold : "#FFEDC2",
                            opacity: (1 - p) * 0.75,
                        }}
                    />
                );
            })}
        </>
    );
};
