import React from "react";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import { pop, prog } from "../core/anim";

// 路径揭示类动效 4 项（工具箱中唯一依赖 @remotion/paths 的文件）。
// 全部 t/from 纯函数；MaskReveal 用 useId 做 mask id（非 beat hook，Still 安全）。

// 路径描画：沿 SVG path 逐段画出，可带端点圆头
export const DrawPath: React.FC<{
    t: number;
    from: number;
    d: string;
    dur?: number;
    stroke: string;
    width?: number;
    showHead?: boolean;
    style?: React.CSSProperties;
}> = ({ t, from, d, dur = 20, stroke, width = 4, showHead = false, style }) => {
    const p = prog(t, from, dur);
    if (p <= 0) return null;
    const ev = evolvePath(p, d);
    const head = showHead ? getPointAtLength(d, getLength(d) * p) : null;
    return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none", ...style }}>
            <path d={d} fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
            {head ? <circle cx={head.x} cy={head.y} r={width * 1.9} fill={stroke} /> : null}
        </svg>
    );
};

// 飞沿路径：元素沿路径飞行（可选朝向对齐/自旋/残影），走完自动淡出
export const PathFollower: React.FC<{
    t: number;
    from: number;
    d: string;
    dur?: number;
    color?: string;
    size?: number;
    trail?: number;
    spin?: boolean;
    label?: string;
}> = ({ t, from, d, dur = 24, color = "#FF4D6D", size = 18, trail = 3, spin = false, label }) => {
    const p = prog(t, from, dur);
    if (t < from || t > from + dur + 50) return null;
    const len = getLength(d);
    const pos = getPointAtLength(d, len * p) ?? { x: 0, y: 0 };
    const fade = t > from + dur ? Math.max(0, 1 - (t - from - dur) / 24) : 1;
    return (
        <>
            {Array.from({ length: trail }, (_, i) => {
                const pp = Math.max(0, p - (i + 1) * 0.05);
                const tp = getPointAtLength(d, len * pp) ?? { x: 0, y: 0 };
                const s = size * (1 - i * 0.22);
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: tp.x,
                            top: tp.y,
                            width: s,
                            height: s,
                            borderRadius: "50%",
                            background: color,
                            opacity: (0.32 - i * 0.09) * fade,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                );
            })}
            <div
                style={{
                    position: "absolute",
                    left: pos.x,
                    top: pos.y,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    background: color,
                    boxShadow: `0 0 18px ${color}88`,
                    opacity: fade,
                    transform: `translate(-50%, -50%) rotate(${spin ? p * 360 : 0}deg)`,
                }}
            />
            {label ? (
                <div
                    style={{
                        position: "absolute",
                        left: pos.x + 20,
                        top: pos.y - 46,
                        fontFamily: '"Microsoft YaHei",sans-serif',
                        fontSize: 26,
                        fontWeight: 700,
                        color,
                        opacity: fade,
                        whiteSpace: "nowrap",
                    }}
                >
                    {label}
                </div>
            ) : null}
        </>
    );
};

// 遮罩揭示：用一条"被逐段画出"的路径作为遮罩，露出 children（conceal 反向收起）
export const MaskReveal: React.FC<{
    t: number;
    from: number;
    d: string;
    dur?: number;
    mode?: "reveal" | "conceal";
    strokeWidth?: number;
    children: React.ReactNode;
}> = ({ t, from, d, dur = 20, mode = "reveal", strokeWidth = 150, children }) => {
    const id = React.useId();
    const raw = prog(t, from, dur);
    const p = mode === "conceal" ? 1 - raw : raw;
    if (p <= 0) return null;
    const ev = evolvePath(p, d);
    return (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
                <defs>
                    <mask id={id}>
                        <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={ev.strokeDasharray} strokeDashoffset={ev.strokeDashoffset} />
                    </mask>
                </defs>
                <foreignObject width={1920} height={1080} mask={`url(#${id})`}>
                    <div style={{ position: "relative", width: 1920, height: 1080 }}>{children}</div>
                </foreignObject>
            </svg>
        </div>
    );
};

// 引线标注：目标点引出折线到标签（引线描画 + 标签弹出）
export const Callout: React.FC<{
    t: number;
    from: number;
    x: number;
    y: number;
    text: string;
    tx?: number;
    ty?: number;
    side?: "left" | "right";
    color?: string;
    dur?: number;
}> = ({ t, from, x, y, text, tx, ty, side = "right", color = "#FFD23F", dur = 16 }) => {
    if (t < from) return null;
    const ex = tx ?? (side === "right" ? x + 300 : x - 300);
    const ey = ty ?? y - 130;
    const elbowX = side === "right" ? Math.max(x + 90, ex - 70) : Math.min(x - 90, ex + 70);
    const path = `M${x},${y} L${elbowX},${y} L${ex},${ey}`;
    const p = prog(t, from, dur);
    const lp = pop(t, from + dur * 0.65, 12);
    const boxX = side === "right" ? ex : ex - 240;
    return (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <path d={path} fill="none" stroke={color} strokeWidth={3} pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
            <circle cx={x} cy={y} r={8} fill={color} opacity={p} />
            {lp > 0 ? (
                <g opacity={Math.min(1, lp * 1.25)}>
                    <rect x={boxX} y={ey - 28} width={240} height={56} rx={9} fill="#14181FE6" stroke={color} strokeWidth={2} />
                    <text x={boxX + 120} y={ey + 9} textAnchor="middle" fill="#FFFFFF" fontSize={27} fontWeight={700} fontFamily='"Microsoft YaHei",sans-serif'>
                        {text}
                    </text>
                </g>
            ) : null}
        </svg>
    );
};
