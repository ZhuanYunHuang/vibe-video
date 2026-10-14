import React from "react";
import { evolvePath, getLength } from "@remotion/paths";
import { hit, pop, prog } from "../core/anim";
import { clamp01, rnd } from "./util";

// 冲击转场类动效 5 项：全部 t/from 纯函数（禁 beat hook）。
// 注意：环形一律用 SVG <circle>，严禁大元素 border-radius:50%（>500px 会被 Chrome 裁半）。

// 冲击波：多层圆环从中心扩散衰减
export const Shockwave: React.FC<{
    t: number;
    at: number;
    x?: number;
    y?: number;
    color?: string;
    rings?: number;
    maxRadius?: number;
    dur?: number;
}> = ({ t, at, x = 960, y = 540, color = "#FF3EA5", rings = 3, maxRadius = 640, dur = 30 }) => {
    const d = t - at;
    if (d < 0 || d > dur + rings * 5) return null;
    return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {Array.from({ length: rings }, (_, i) => {
                const p = clamp01(Math.max(0, d - i * 5) / dur);
                const r = 40 + (maxRadius - 40) * (1 - Math.pow(1 - p, 3));
                return <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={color} strokeWidth={8 - i * 2} opacity={(1 - p) * (0.9 - i * 0.22)} />;
            })}
        </svg>
    );
};

// 速度线：从中心向外放射的细长多边形，一闪而过
export const SpeedLines: React.FC<{
    t: number;
    at: number;
    color?: string;
    dur?: number;
    n?: number;
    cx?: number;
    cy?: number;
    inner?: number;
    outer?: number;
}> = ({ t, at, color = "#FFE9FF", dur = 24, n = 18, cx = 960, cy = 540, inner = 320, outer = 1250 }) => {
    const d = t - at;
    if (d < 0 || d > dur) return null;
    const p = d / dur;
    const op = Math.sin(p * Math.PI) * 0.85;
    return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + rnd(i, 3) * 0.4;
                const r0 = Math.max(60, inner + rnd(i, 5) * 160 - p * 140);
                const x1 = cx + Math.cos(a) * r0;
                const y1 = cy + Math.sin(a) * r0;
                const x2 = cx + Math.cos(a) * outer;
                const y2 = cy + Math.sin(a) * outer;
                const w = 6 + rnd(i, 9) * 14;
                const nx = Math.cos(a + Math.PI / 2) * w;
                const ny = Math.sin(a + Math.PI / 2) * w;
                return (
                    <polygon
                        key={i}
                        points={`${x1 - nx * 0.4},${y1 - ny * 0.4} ${x1 + nx * 0.4},${y1 + ny * 0.4} ${x2 + nx * 2.5},${y2 + ny * 2.5} ${x2 - nx * 2.5},${y2 - ny * 2.5}`}
                        fill={color}
                        opacity={op}
                    />
                );
            })}
        </svg>
    );
};

// 震屏纯函数：多个触发点取最大包络，驱动内容级抖动（勿用于整幅背景的每拍抖动）
export const shake = (t: number, ats: number[], amp = 8, decay = 4): string => {
    const k = ats.reduce((m, a) => Math.max(m, hit(t, a, decay)), 0);
    if (k < 0.02) return "none";
    return `translate(${Math.sin(t * 9.1) * amp * k}px, ${Math.cos(t * 7.7) * amp * k * 0.7}px) rotate(${Math.sin(t * 5.3) * k * 1.4}deg)`;
};

// 震屏容器：把 children 按触发帧阵列表抖动
export const ShakeWrapper: React.FC<{ t: number; ats: number[]; amp?: number; decay?: number; children: React.ReactNode }> = ({ t, ats, amp = 8, decay = 4, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: shake(t, ats, amp, decay) }}>{children}</div>
);

// 翻牌：3D rotateY 翻开（front 转出、back 转入）
export const FlipCard: React.FC<{
    t: number;
    from: number;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    rot?: number;
    flipAt?: number;
    front: React.ReactNode;
    back: React.ReactNode;
}> = ({ t, from, x = 960, y = 540, w = 240, h = 360, rot = 0, flipAt, front, back }) => {
    const s = pop(t, from, 12);
    const start = flipAt ?? from + 10;
    const ang = prog(t, start, 14) * 180;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 1.3), perspective: 1400 }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${ang}deg)` }}>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}>{front}</div>
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>{back}</div>
            </div>
        </div>
    );
};

// 转场扫屏：wipe（斜向光带）/ clock（扇形擦除）/ route（沿路径蛇形铺开再收走）
export const TransitionSweep: React.FC<{
    t: number;
    from: number;
    dur?: number;
    mode?: "wipe" | "route" | "clock";
    color?: string;
    d?: string;
}> = ({ t, from, dur = 24, mode = "wipe", color = "#FF3EA5", d }) => {
    const p = prog(t, from, dur);
    if (mode === "wipe") {
        const x = -30 + p * 160;
        return (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -240, bottom: -240, left: `${x}%`, width: 380, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, transform: "skewX(-16deg)", opacity: Math.sin(p * Math.PI) }} />
            </div>
        );
    }
    if (mode === "clock") {
        return <div style={{ position: "absolute", inset: 0, background: `conic-gradient(${color} ${p * 360}deg, transparent 0)`, opacity: Math.sin(p * Math.PI) * 0.9, pointerEvents: "none" }} />;
    }
    if (!d) return null;
    const len = getLength(d);
    const cover = clamp01(p * 2);
    const uncover = clamp01((p - 0.5) * 2);
    const ev = evolvePath(cover, d);
    const gone = evolvePath(1, d);
    return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <path
                d={d}
                fill="none"
                stroke={color}
                strokeWidth={90}
                strokeLinecap="round"
                strokeDasharray={uncover > 0 ? gone.strokeDasharray : ev.strokeDasharray}
                strokeDashoffset={uncover > 0 ? Number(gone.strokeDashoffset) - uncover * len : ev.strokeDashoffset}
            />
        </svg>
    );
};
