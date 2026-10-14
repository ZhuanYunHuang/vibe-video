import React from "react";
import { elastic, prog, sway } from "../core/anim";
import { rnd } from "./util";

// 环境持续类动效 4 项：给画面"永远在动"的底噪（治 PPT 感的关键）。
// 全部 t/from 纯函数（禁 beat hook，Still 可冻结）。

// 环境粒子场：尘埃/星点/飘雪（rise 时改为上升气泡），纵向循环 + 横向摆动
export const ParticleField: React.FC<{
    t: number;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    n?: number;
    color?: string;
    speed?: number;
    size?: number;
    drift?: number;
    rise?: boolean;
    seed?: number;
}> = ({ t, x = 0, y = 0, w = 1920, h = 1080, n = 24, color = "#FFD23F", speed = 1, size = 5, drift = 20, rise = false, seed = 1 }) => (
    <>
        {Array.from({ length: n }, (_, i) => {
            const r1 = rnd(i, seed);
            const r2 = rnd(i, seed + 7);
            const r3 = rnd(i, seed + 13);
            const cycle = h + 80;
            const travel = ((t * speed * (0.5 + r2) + r3 * cycle) % cycle) / cycle;
            const py = rise ? y + h + 40 - travel * cycle : y - 40 + travel * cycle;
            const px = x + r1 * w + Math.sin(t / (26 + r2 * 24) + i) * drift;
            const s = size * (0.5 + r1);
            return <div key={i} style={{ position: "absolute", left: px, top: py, width: s, height: s, borderRadius: "50%", background: color, opacity: 0.2 + r2 * 0.55 }} />;
        })}
    </>
);

// 摆动落定：先弹性摆动定下来，之后持续微摆（钟摆/吊牌感）
export const Sway: React.FC<{
    t: number;
    from: number;
    x?: number;
    y?: number;
    dur?: number;
    amp?: number;
    period?: number;
    children: React.ReactNode;
}> = ({ t, from, x = 960, y = 540, dur = 40, amp = 1.2, period = 24, children }) => {
    const settling = t < from + dur;
    const ang = settling ? elastic(t, from, dur) * amp * 3 : sway(t, period, amp);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${ang}deg)`, transformOrigin: "top center" }}>{children}</div>
    );
};

// 视差层：各层按 depth 以不同幅度漂浮（前景动得多、远景动得少）
export const ParallaxLayers: React.FC<{
    t: number;
    layers: { content: React.ReactNode; depth: number }[];
    dx?: number;
    dy?: number;
    cx?: number;
    cy?: number;
}> = ({ t, layers, dx = 26, dy = 18, cx = 960, cy = 540 }) => (
    <>
        {layers.map((l, i) => (
            <div
                key={i}
                style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translate(${Math.sin(t / 260) * dx * l.depth}px, ${Math.cos(t / 240) * dy * l.depth}px) scale(${1 + 0.012 * l.depth})`,
                    transformOrigin: `${cx}px ${cy}px`,
                }}
            >
                {l.content}
            </div>
        ))}
    </>
);

// 聚焦推拉：模拟镜头推近聚焦（缩放 + 由虚到实）
export const FocusZoom: React.FC<{
    t: number;
    from: number;
    dur?: number;
    fromScale?: number;
    toScale?: number;
    x?: number;
    y?: number;
    blur?: number;
    children: React.ReactNode;
}> = ({ t, from, dur = 24, fromScale = 1.15, toScale = 1, x = 960, y = 540, blur = 10, children }) => {
    const p = prog(t, from, dur);
    const s = fromScale + (toScale - fromScale) * p;
    return (
        <div style={{ position: "absolute", inset: 0, transform: `scale(${s})`, transformOrigin: `${x}px ${y}px`, filter: blur > 0 ? `blur(${(1 - p) * blur}px)` : undefined }}>
            {children}
        </div>
    );
};
