import React from "react";
import { FONT, MONO, P } from "../../../styles/explode";

// —— Roadster 本片私有可视化小件（全部 t/from 纯函数或纯静态，Still 安全）——

// 全屏 SVG 层：场景内自绘件统一画在 1920×1080 坐标里
export const SvgLayer: React.FC<{ children: React.ReactNode; opacity?: number }> = ({ children, opacity = 1 }) => (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, overflow: "visible", opacity }}>
        {children}
    </svg>
);

// 车侧影（爆炸图风格）：局部坐标 640×230，车轮底 y=214；invert=true 为倒挂（车底朝上）
export const CarSilhouette: React.FC<{ x: number; y: number; invert?: boolean; glow?: number; opacity?: number }> = ({ x, y, invert = false, glow = 0, opacity = 1 }) => (
    <g transform={`translate(${x} ${y})${invert ? " translate(0 230) scale(1 -1)" : ""}`} opacity={opacity}>
        <path d="M6 150 L6 116 Q16 98 66 88 L172 62 Q226 28 308 24 L430 30 Q546 44 620 92 L640 116 L640 150 Z" fill="#2E3440" stroke="#00000066" strokeWidth="2" />
        <path d="M186 78 L470 44" stroke="#454C5C" strokeWidth="3" fill="none" />
        <path d="M244 60 L332 32 L412 36 L268 66 Z" fill="#1C2027" opacity="0.85" />
        {[150, 505].map((wx) => (
            <g key={wx}>
                <circle cx={wx} cy={168} r={46} fill="#14161B" stroke="#5F5E5A" strokeWidth="6" />
                <circle cx={wx} cy={168} r={16} fill="none" stroke={P.accent} strokeWidth="4" opacity="0.55" />
                <line x1={wx - 30} y1={168} x2={wx + 30} y2={168} stroke="#3A404E" strokeWidth="5" />
                <line x1={wx} y1={138} x2={wx} y2={198} stroke="#3A404E" strokeWidth="5" />
            </g>
        ))}
        <line x1="36" y1="152" x2="604" y2="152" stroke={P.accent} strokeWidth="4" strokeLinecap="round" opacity={0.9 * glow} />
    </g>
);

// 涵道风扇：外环 + 5 扇叶 + 轮毂（spin 为旋转角，可用 t 驱动）
export const FanUnit: React.FC<{ x: number; y: number; r?: number; spin?: number; lit?: boolean }> = ({ x, y, r = 44, spin = 0, lit = false }) => (
    <g>
        <circle cx={x} cy={y} r={r + 8} fill="#1C2027" stroke={P.line} strokeWidth="2" />
        <g transform={`rotate(${spin} ${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => {
                const rad = (a * Math.PI) / 180;
                return (
                    <line
                        key={a}
                        x1={x}
                        y1={y}
                        x2={x + (r - 4) * Math.cos(rad)}
                        y2={y + (r - 4) * Math.sin(rad)}
                        stroke={lit ? P.accentLight : P.extra?.metal ?? "#AEB6C6"}
                        strokeWidth="9"
                        strokeLinecap="round"
                    />
                );
            })}
            <circle cx={x} cy={y} r={r * 0.2} fill="#0B0D11" stroke={P.line} strokeWidth="2" />
        </g>
    </g>
);

// 竖直力箭头：y 为尾端；dir=up 时箭头朝上
export const VArrow: React.FC<{ x: number; y: number; len: number; dir?: "up" | "down"; color?: string; width?: number; opacity?: number }> = ({ x, y, len, dir = "down", color = P.accent, width = 8, opacity = 1 }) => {
    const s = dir === "down" ? 1 : -1;
    const head = Math.max(16, width * 2.2);
    const ty = y + s * (len - head);
    return (
        <g opacity={opacity}>
            <line x1={x} y1={y} x2={x} y2={ty} stroke={color} strokeWidth={width} strokeLinecap="round" />
            <polygon points={`${x - head * 0.72},${ty} ${x + head * 0.72},${ty} ${x},${y + s * len}`} fill={color} />
        </g>
    );
};

// 吸附光圈：多层琥珀椭圆（k 控制强度/呼吸）
export const SuctionGlow: React.FC<{ x: number; y: number; rx?: number; ry?: number; k?: number; color?: string }> = ({ x, y, rx = 300, ry = 26, k = 1, color = P.accent }) => (
    <g opacity={k}>
        <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={color} opacity="0.10" />
        <ellipse cx={x} cy={y} rx={rx * 0.72} ry={ry * 0.72} fill={color} opacity="0.17" />
        <ellipse cx={x} cy={y} rx={rx * 0.44} ry={ry * 0.44} fill={color} opacity="0.28" />
    </g>
);

// 爆炸图部件之间的落位引导虚线
export const DropLine: React.FC<{ x: number; y1: number; y2: number; color?: string }> = ({ x, y1, y2, color = "#5F5E5A" }) => (
    <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth="2" strokeDasharray="7 9" />
);

// 标签章（如「磁铁 ✕」）：appear 控制弹出
export const Chip: React.FC<{ x: number; y: number; label: string; strike?: boolean; appear?: number; w?: number; color?: string }> = ({ x, y, label, strike = false, appear = 1, w = 250, color = P.ink }) => {
    if (appear <= 0) return null;
    const s = Math.min(1, appear * 1.2);
    return (
        <g opacity={s} transform={`translate(${x} ${y}) scale(${0.9 + 0.1 * s})`}>
            <rect x={-w / 2} y={-38} width={w} height={76} rx={12} fill={`${P.card}E6`} stroke={P.line} strokeWidth="2" />
            <text x={strike ? -20 : 0} y={0} textAnchor="middle" dominantBaseline="central" fill={color} fontFamily={FONT} fontSize="32">
                {label}
            </text>
            {strike ? (
                <g transform="translate(78 0) rotate(45)">
                    <line x1="-15" y1="0" x2="15" y2="0" stroke={P.seal} strokeWidth="7" strokeLinecap="round" />
                    <line x1="0" y1="-15" x2="0" y2="15" stroke={P.seal} strokeWidth="7" strokeLinecap="round" />
                </g>
            ) : null}
        </g>
    );
};

// 小字注释（场景内常用，带 mono 灰字）
export const NoteText: React.FC<{ x: number; y: number; size?: number; color?: string; children: React.ReactNode }> = ({ x, y, size = 26, color = P.inkSub, children }) => (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", fontFamily: MONO, fontSize: size, color, letterSpacing: 2, whiteSpace: "nowrap" }}>
        {children}
    </div>
);
