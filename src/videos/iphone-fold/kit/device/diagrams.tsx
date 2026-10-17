import React from "react";
import { prog } from "../../../../shared";
import { FONT, MONO } from "../../../../styles/explode";
import { P } from "../bright";

// 2D 工程图解：弯折剖面、亮面/哑光、UTG、层间滑移、齿轮、扭矩曲线、磁体。
// 统一用 1920×1080 的绝对 SVG 叠层，坐标即屏幕坐标。

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>{children}</svg>
);

export const BendProfile: React.FC<{ t: number; from: number; x: number; y: number; w: number; h: number; mode: "waterdrop" | "vfold" }> = ({ t, from, x, y, w, h, mode }) => {
    const p = prog(t, from, 18);
    const water = mode === "waterdrop";
    const r = water ? h * 0.42 : h * 0.1;
    const top = y;
    const bottom = y + h;
    const cx = x + w / 2;
    const d = water
        ? `M${x} ${top} L${cx - r} ${top} A${r} ${r} 0 0 0 ${cx - r} ${bottom} L${x} ${bottom}`
        : `M${x} ${top} L${cx - r} ${top + h * 0.12} L${cx} ${bottom - h * 0.08} L${cx + r} ${top + h * 0.12} L${x + w} ${top}`;
    const dMirror = water
        ? `M${x + w} ${top} L${cx + r} ${top} A${r} ${r} 0 0 1 ${cx + r} ${bottom} L${x + w} ${bottom}`
        : "";
    return (
        <Svg>
            <path d={d} fill="none" stroke={P.ink} strokeWidth={3} opacity={0.9} strokeDasharray={water ? undefined : 1400} strokeDashoffset={water ? 0 : 1400 * (1 - p)} />
            {water ? <path d={dMirror} fill="none" stroke={P.ink} strokeWidth={3} opacity={0.9} /> : null}
            <circle cx={cx} cy={y + h / 2} r={water ? r * 0.5 : 6} fill="none" stroke={P.accent} strokeWidth={2} opacity={0.8} />
            <text x={cx} y={y + h + 42} textAnchor="middle" fontFamily={FONT} fontSize={24} fill={water ? P.accentLight : P.seal} letterSpacing={2}>
                {water ? "水滴形 · 大半径" : "V 形 · 死折"}
            </text>
        </Svg>
    );
};

export const MatteVsGloss: React.FC<{ t: number; x: number; y: number; w: number; h: number; sweep: number }> = ({ t, x, y, w, h, sweep }) => {
    const gid = "mg-grad";
    const mid = x + w / 2;
    const totalW = w * 2 + 60;
    const sx = x + totalW * sweep;
    return (
        <Svg>
            <defs>
                <linearGradient id={gid} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#00000000" />
                    <stop offset="0.45" stopColor="#FFFFFF22" />
                    <stop offset="0.5" stopColor="#FFFFFF55" />
                    <stop offset="0.55" stopColor="#FFFFFF22" />
                    <stop offset="1" stopColor="#00000000" />
                </linearGradient>
            </defs>
            {/* 亮面 */}
            <rect x={x} y={y} width={w} height={h} rx={6} fill="#0D121C" stroke={P.line} />
            <line x1={mid} y1={y + 10} x2={mid} y2={y + h - 10} stroke="#FFFFFF" strokeWidth={2} opacity={0.8} />
            <rect x={x} y={y} width={w} height={h} rx={6} fill={`url(#${gid})`} opacity={0.5} />
            <rect x={sx - 40} y={y} width={80} height={h} fill="#FFFFFF" opacity={0.05} />
            {/* 哑光 */}
            <rect x={x + w + 60} y={y} width={w} height={h} rx={6} fill="#12161D" stroke={P.line} />
            <rect x={mid + w + 60 - 26} y={y + 6} width={52} height={h - 12} fill={P.accentLight} opacity={0.1} />
            <line x1={mid + w + 60} y1={y + 10} x2={mid + w + 60} y2={y + h - 10} stroke="#FFFFFF" strokeWidth={1} opacity={0.18} strokeDasharray="6 8" />
            <rect x={x + w + 60} y={y} width={w} height={h} rx={6} fill={`url(#${gid})`} opacity={0.16} />
            <text x={x + w / 2} y={y - 22} textAnchor="middle" fontFamily={FONT} fontSize={26} fill={P.inkSub} letterSpacing={2}>亮面</text>
            <text x={x + w + 60 + w / 2} y={y - 22} textAnchor="middle" fontFamily={FONT} fontSize={26} fill={P.accentLight} letterSpacing={2}>纳米纹理哑光</text>
        </Svg>
    );
};

export const CreaseProfile: React.FC<{ t: number; from: number; x: number; y: number; w: number; h: number; mag: number }> = ({ t, from, x, y, w, h, mag }) => {
    const p = prog(t, from, 20);
    const depth = 8 + mag * h * 0.5;
    const cx = x + w / 2;
    const d = `M${x} ${y + 8} L${cx - w * 0.18} ${y + 8} Q${cx - w * 0.06} ${y + 8 + depth * p} ${cx} ${y + 8 + depth * p} Q${cx + w * 0.06} ${y + 8 + depth * p} ${cx + w * 0.18} ${y + 8} L${x + w} ${y + 8}`;
    return (
        <Svg>
            <path d={d} fill="none" stroke={P.accentLight} strokeWidth={4} strokeLinecap="round" />
            <line x1={x} y1={y + 8} x2={x + w} y2={y + 8} stroke={P.line} strokeDasharray="4 8" />
            <line x1={cx} y1={y - 8} x2={cx} y2={y + 8 + depth * p} stroke={P.seal} strokeWidth={1.5} />
            <text x={cx + 26} y={y + 8 + depth * p + 26} fontFamily={MONO} fontSize={22} fill={P.seal}>
                {mag > 0.15 ? "×20 放大" : "真实比例"}
            </text>
        </Svg>
    );
};

export const UTGProfile: React.FC<{ t: number; from: number; x: number; y: number; w: number; h: number }> = ({ t, from, x, y, w, h }) => {
    const p = prog(t, from, 20);
    const midY = y + h / 2;
    const thin = 8;
    const d = `M${x} ${midY - 20} L${x + w * 0.28} ${midY - 20} L${x + w * 0.28} ${midY - thin} L${x + w * 0.72} ${midY - thin} L${x + w * 0.72} ${midY - 20} L${x + w} ${midY - 20} L${x + w} ${midY + 20} L${x + w * 0.72} ${midY + 20} L${x + w * 0.72} ${midY + thin} L${x + w * 0.28} ${midY + thin} L${x + w * 0.28} ${midY + 20} L${x} ${midY + 20} Z`;
    return (
        <Svg>
            <path d={d} fill="#5C86C4" fillOpacity={0.35} stroke="#8FB6EE" strokeWidth={2} strokeDasharray={900} strokeDashoffset={900 * (1 - p)} />
            <line x1={x + w * 0.28 - 6} y1={midY - 20} x2={x + w * 0.28 - 6} y2={midY + 20} stroke={P.accentLight} strokeWidth={1.5} strokeDasharray="4 6" />
            <line x1={x + w * 0.72 + 6} y1={midY - 20} x2={x + w * 0.72 + 6} y2={midY + 20} stroke={P.accentLight} strokeWidth={1.5} strokeDasharray="4 6" />
            <text x={x + w / 2} y={midY + 64} textAnchor="middle" fontFamily={MONO} fontSize={22} fill={P.inkSub}>中间更薄 · 两侧保强度 · 边缘阶梯倒角</text>
        </Svg>
    );
};

export const SlideArrows: React.FC<{ t: number; from: number; x: number; y: number; w: number; amount: number }> = ({ t, from, x, y, w, amount }) => {
    const p = prog(t, from, 22);
    const rows = 5;
    const gap = 26;
    return (
        <Svg>
            {Array.from({ length: rows }, (_, i) => {
                const yy = y + i * gap;
                const center = (rows - 1) / 2;
                const dist = Math.abs(i - center);
                const len = dist === 0 ? 0 : (amount * (0.6 + dist * 0.35)) * p;
                const isCenter = i === Math.floor(center);
                const dir: number = isCenter ? 0 : i < center ? -1 : 1;
                return (
                    <g key={i}>
                        <line x1={x} y1={yy} x2={x + w} y2={yy} stroke={isCenter ? P.accentLight : "#8FB6EE"} strokeWidth={isCenter ? 3 : 2} opacity={isCenter ? 0.95 : 0.6} />
                        {!isCenter && len > 1 ? (
                            <>
                                <line x1={x + w / 2} y1={yy - 9} x2={x + w / 2 + dir * len} y2={yy - 9} stroke={P.accent} strokeWidth={2} />
                                <path d={`M${x + w / 2 + dir * len} ${yy - 9} l${-dir * 7} -4 l0 8 z`} fill={P.accent} />
                            </>
                        ) : null}
                    </g>
                );
            })}
            <text x={x + w + 16} y={y + Math.floor((rows - 1) / 2) * gap + 6} fontFamily={MONO} fontSize={20} fill={P.accentLight}>中性层 ≈ 不动</text>
        </Svg>
    );
};

export const GearTrain2D: React.FC<{ t: number; x: number; y: number; angle: number; r?: number; teeth?: number }> = ({ x, y, angle, r = 58, teeth = 18 }) => {
    const gear = (cx: number, cy: number, rot: number, key: string) => (
        <g key={key}>
            <circle cx={cx} cy={cy} r={r - 10} fill="none" stroke={P.accentLight} strokeWidth={2} opacity={0.9} />
            <circle cx={cx} cy={cy} r={5} fill={P.accent} />
            {Array.from({ length: teeth }, (_, i) => (
                <rect key={i} x={cx + r - 12} y={cy - 4} width={14} height={8} fill={P.accent} opacity={0.85} transform={`rotate(${rot + (i * 360) / teeth} ${cx} ${cy})`} />
            ))}
            <circle cx={cx} cy={cy} r={r - 24} fill="none" stroke={P.line} strokeDasharray="5 7" />
        </g>
    );
    return (
        <Svg>
            {gear(x, y, angle, "a")}
            {gear(x + r * 2 - 12, y, -angle * 1.08, "b")}
        </Svg>
    );
};

export const TorqueCurve: React.FC<{ t: number; from: number; x: number; y: number; w: number; h: number }> = ({ t, from, x, y, w, h }) => {
    const p = prog(t, from, 26);
    const pts: [number, number][] = [
        [0, 0.82],
        [0.18, 0.2],
        [0.3, 0.32],
        [0.5, 0.26],
        [0.68, 0.3],
        [0.86, 0.24],
        [1, 0.5],
    ];
    const path = pts.map(([u, v], i) => `${i === 0 ? "M" : "L"}${x + u * w} ${y + v * h}`).join(" ");
    const mark = (u: number, label: string, dy = 26, anchor: "start" | "end" = "start") => (
        <g>
            <line x1={x + u * w} y1={y} x2={x + u * w} y2={y + h} stroke={P.line} strokeDasharray="3 6" />
            <text x={x + u * w + (anchor === "start" ? 6 : -6)} y={y + h + dy} textAnchor={anchor} fontFamily={MONO} fontSize={16} fill={P.inkSub}>{label}</text>
        </g>
    );
    return (
        <Svg>
            <line x1={x} y1={y + h} x2={x + w} y2={y + h} stroke={P.line} strokeWidth={2} />
            <line x1={x} y1={y} x2={x} y2={y + h} stroke={P.line} strokeWidth={2} />
            <path d={path} fill="none" stroke={P.accent} strokeWidth={3} strokeDasharray={1400} strokeDashoffset={1400 * (1 - p)} />
            {mark(0.5, "90° SEATED", 24, "end")}
            {mark(0.78, "135° STANDING", 46, "start")}
            <text x={x + w + 14} y={y + h - 8} fontFamily={MONO} fontSize={18} fill={P.inkSub}>开合角</text>
            <text x={x + 12} y={y - 12} fontFamily={MONO} fontSize={18} fill={P.inkSub}>扭矩</text>
        </Svg>
    );
};

export const MagnetArray: React.FC<{ t: number; close: number; x: number; y: number; w: number }> = ({ t, close, x, y, w }) => {
    const gap = 20 + (1 - close) * 90;
    return (
        <Svg>
            {[0, 1].map((row) =>
                Array.from({ length: 6 }, (_, i) => {
                    const cx = x + (i * w) / 5;
                    const cy = y + row * gap;
                    return (
                        <g key={`${row}-${i}`}>
                            <rect x={cx - 12} y={cy - 7} width={24} height={14} rx={3} fill={row === 0 ? P.gold : P.accent} opacity={0.85} />
                            {close > 0.2 ? (
                                <path d={`M${cx} ${cy + 9} q${(i % 2 === 0 ? 1 : -1) * 10} 18 0 30`} fill="none" stroke={P.accentLight} strokeWidth={1.2} strokeDasharray="4 6" opacity={close * 0.7} />
                            ) : null}
                        </g>
                    );
                }),
            )}
            {close > 0.86 ? <text x={x + w / 2} y={y - 26} textAnchor="middle" fontFamily={FONT} fontSize={40} fill={P.accentLight} letterSpacing={4}>啪</text> : null}
        </Svg>
    );
};
