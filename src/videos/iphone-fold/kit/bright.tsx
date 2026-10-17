import React from "react";
import type { StyleKit } from "../../../styles/contract";
import { Card, Kicks, Mark, Particles, Stamp, Stage, useK, usePulse } from "../../../styles/explode";
import { FONT, MONO } from "../../../styles/explode/theme";
import { hit, prog } from "../../../shared";

// 明亮版拆解风格：留白为主 + 琥珀点缀 + 白卡 + 细描边。
// 只在本片内使用，不修改 styles/explode。

export const P = {
    bg: "#F3F6FB",
    bgAlt: "#E9EFF8",
    card: "#FFFFFF",
    ink: "#121722",
    inkSub: "#5A6474",
    line: "#D7DDE8",
    accent: "#F97316",
    accentDeep: "#B45309",
    accentLight: "#FB923C",
    gold: "#2563EB",
    seal: "#DC2626",
    extra: { metal: "#94A3B8", shadow: "#0F172A" },
};

const fonts = { FONT, MONO, DECOR: FONT };

// 背景：白到浅灰的径向 + 细网格 + 顶部暖光 + 柔和接触阴影
export const Backdrop: React.FC = () => (
    <>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% 0%, #FFFFFF 0%, #F1F5FB 52%, #E4EAF4 100%)" }} />
        <div
            style={{
                position: "absolute",
                left: "-20%",
                right: "-20%",
                top: "18%",
                bottom: "-20%",
                backgroundImage: `repeating-linear-gradient(60deg, ${P.line}88 0 1px, transparent 1px 96px), repeating-linear-gradient(-60deg, ${P.line}88 0 1px, transparent 1px 96px)`,
                opacity: 0.5,
                maskImage: "linear-gradient(180deg, transparent 0%, #000 38%, #000 100%)",
                WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 38%, #000 100%)",
            }}
        />
        <div style={{ position: "absolute", left: "50%", top: -220, width: 1300, height: 700, marginLeft: -650, background: "radial-gradient(50% 55% at 50% 42%, #FDBA7436, transparent 70%)" }} />
    </>
);

// 全片不挂进度条：保留签名以满足 StyleKit，渲染空节点
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = () => null;

// 避免在纯函数组件里直接 import remotion 的 hook 造成标题栏干扰

export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 10) return null;
    const s = prog(t, from, 12);
    const out = to === Infinity ? 0 : prog(t, to, 10);
    return (
        <div style={{ position: "absolute", bottom: 76, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s * (1 - out), transform: `translateY(${(1 - s) * 18}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFFFFFF2", border: `1px solid ${P.line}`, borderLeft: `4px solid ${P.accent}`, borderRadius: 8, padding: "10px 26px", boxShadow: "0 10px 26px #0F172A1A" }}>
                <div style={{ fontFamily: FONT, fontSize: 35, fontWeight: 500, color, letterSpacing: 1, lineHeight: 1.25 }}>{children}</div>
            </div>
        </div>
    );
};

export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = prog(t, 2, 12);
    const u = prog(t, 6, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 58, display: "flex", alignItems: "center", gap: 18, opacity: s, transform: `translateX(${(1 - s) * -20}px)` }}>
            <div style={{ width: 64, height: 64, borderRadius: 12, background: "#FFFFFF", border: `1px solid ${P.line}`, boxShadow: "0 8px 20px #0F172A14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: 26, color, letterSpacing: 1 }}>{step}</div>
            </div>
            <div>
                <div style={{ fontFamily: FONT, fontSize: 38, fontWeight: 700, color: P.ink, letterSpacing: 2 }}>{title}</div>
                <div style={{ position: "relative", marginTop: 9, height: 6, width: Math.max(220, title.length * 40) * u }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 2, height: 2, background: P.line }} />
                    <div style={{ position: "absolute", left: 0, top: 0, width: 42, height: 6, background: P.accent }} />
                </div>
            </div>
        </div>
    );
};

export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.accent, rot = 0, children }) => {
    if (t < from) return null;
    const s = hit(t, from, 3) * 0.02 + 1;
    const base: React.CSSProperties = { fontFamily: FONT, fontSize: size, fontWeight: 900, letterSpacing: 3, whiteSpace: "nowrap" };
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})` }}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ ...base, position: "absolute", left: 5, top: 6, color }}>{children}</div>
                <div style={{ ...base, position: "relative", color: P.ink }}>{children}</div>
            </div>
        </div>
    );
};

export const kit: StyleKit = {
    id: "explode-bright",
    P,
    fonts,
    exitDim: 0.18,
    Backdrop,
    Hud,
    Stage,
    Sub,
    Chapter,
    Slam,
    Card,
    Mark,
    Stamp,
    Kicks,
    Particles,
    useK,
    usePulse,
    makeCover: () => () => null,
};
