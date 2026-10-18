import React from "react";
import { P, FONT, MONO } from "./theme";

// 画面层：颗粒 / 扫描线 / 暗角 / 整屏底色 / 闪白 / 残影 / 四角标记。
// 全部为 t 的纯函数，封面与场景都能直接复用。

// 180px 噪声瓦片，靠 background-position 位移，避免每帧重建滤镜
const NOISE =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const Grain: React.FC<{ t: number; opacity?: number }> = ({ t, opacity = 0.13 }) => (
    <div
        style={{
            position: "absolute",
            inset: 0,
            backgroundImage: NOISE,
            backgroundRepeat: "repeat",
            backgroundPosition: `${(t * 53) % 180}px ${(t * 97) % 180}px`,
            opacity,
            mixBlendMode: "overlay",
            pointerEvents: "none",
        }}
    />
);

// 扫描线 + 一条缓慢下移的亮带
export const Scanlines: React.FC<{ t: number; opacity?: number }> = ({ t, opacity = 0.16 }) => (
    <>
        <div
            style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 1px, transparent 3px)",
                opacity,
                pointerEvents: "none",
            }}
        />
        <div
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: ((t * 4) % 1320) - 120,
                height: 120,
                background: "linear-gradient(180deg, transparent, rgba(239,233,218,0.055), transparent)",
                pointerEvents: "none",
            }}
        />
    </>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
    <div
        style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse 72% 62% at 50% 50%, transparent 38%, rgba(0,0,0,${0.55 * strength}) 78%, rgba(0,0,0,${0.92 * strength}) 100%)`,
            pointerEvents: "none",
        }}
    />
);

// 到点铺满整屏的底色 = 一次零过渡的硬切
export const LineSlab: React.FC<{ t: number; at: number; color: string }> = ({ t, at, color }) =>
    t < at ? null : <div style={{ position: "absolute", inset: 0, background: color }} />;

// 切句闪白：第一帧 0.85、第二帧 0.32
export const CutFlash: React.FC<{ t: number; at: number; color?: string; frames?: number }> = ({ t, at, color = P.bone, frames = 2 }) => {
    const d = t - at;
    if (d < 0 || d >= frames) return null;
    return <div style={{ position: "absolute", inset: 0, background: color, opacity: d === 0 ? 0.5 : 0.14, pointerEvents: "none" }} />;
};

// 背景巨字残影：只做纹理，不参与阅读
export const GhostLine: React.FC<{
    t: number;
    text: string;
    size?: number;
    x?: number;
    y?: number;
    rot?: number;
    opacity?: number;
    color?: string;
}> = ({ t, text, size = 380, x = -80, y = 700, rot = -5, opacity = 0.05, color = P.bone }) => (
    <div
        style={{
            position: "absolute",
            left: x + Math.sin(t / 90) * 12,
            top: y + Math.cos(t / 110) * 8,
            fontFamily: FONT,
            fontWeight: 400,
            fontSize: size,
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            whiteSpace: "nowrap",
            color: "transparent",
            WebkitTextStroke: `1px ${color}`,
            opacity,
            transform: `rotate(${rot}deg)`,
            pointerEvents: "none",
        }}
    >
        {text}
    </div>
);

const cornerStyle = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: 58,
    height: 58,
    borderColor: `${P.bone}44`,
    borderStyle: "solid",
    borderWidth: 0,
    ...pos,
});

// 四角 L 形标记 + 句号标签，不做进度条
export const CornerMarks: React.FC<{ label: string; sub?: string }> = ({ label, sub }) => (
    <>
        <div style={cornerStyle({ left: 54, top: 46, borderLeftWidth: 2, borderTopWidth: 2 })} />
        <div style={cornerStyle({ right: 54, top: 46, borderRightWidth: 2, borderTopWidth: 2 })} />
        <div style={cornerStyle({ left: 54, bottom: 46, borderLeftWidth: 2, borderBottomWidth: 2 })} />
        <div style={cornerStyle({ right: 54, bottom: 46, borderRightWidth: 2, borderBottomWidth: 2 })} />
        <div style={{ position: "absolute", left: 58, top: 114, fontFamily: MONO, fontSize: 19, letterSpacing: 4, color: `${P.bone}77` }}>{label}</div>
        {sub ? <div style={{ position: "absolute", right: 58, top: 118, fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: `${P.bone}55` }}>{sub}</div> : null}
    </>
);
