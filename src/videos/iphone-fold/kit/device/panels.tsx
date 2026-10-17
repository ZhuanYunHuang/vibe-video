import React from "react";
import { prog } from "../../../../shared";
import { FONT, MONO } from "../../../../styles/explode";
import { P } from "../bright";

const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>{children}</svg>
);

// 铰链排尘：两端小刷沿缝隙扫，灰尘被推开
export const DustBrush: React.FC<{ t: number; from: number; x: number; y: number; w: number; h: number }> = ({ t, from, x, y, w, h }) => {
    const p = prog(t, from, 26);
    const sweep = Math.sin(Math.min(1, p) * Math.PI) * 0.5;
    const bx = x + w * (0.2 + sweep * 0.6);
    return (
        <Svg>
            <rect x={x} y={y} width={w} height={h} rx={6} fill="#0C1018" stroke={P.line} />
            <rect x={x + w * 0.42} y={y + 6} width={w * 0.16} height={h - 12} fill="#1B2130" stroke={P.line} />
            {[0, 1, 2, 3, 4, 5].map((i) => {
                const dx = x + 24 + ((i * 97) % (w - 60));
                const dy = y + 18 + ((i * 53) % (h - 40));
                const pushed = Math.max(0, 1 - Math.abs(dx - bx) / 90) * 26;
                return <circle key={i} cx={dx} cy={dy - pushed} r={3} fill={P.inkSub} opacity={0.6} />;
            })}
            <g transform={`translate(${bx} ${y + h / 2})`}>
                <rect x={-5} y={-h * 0.3} width={10} height={h * 0.6} rx={4} fill={P.accent} opacity={0.9} />
                {Array.from({ length: 7 }, (_, i) => (
                    <line key={i} x1={5} y1={-h * 0.26 + (i * h * 0.52) / 6} x2={16} y2={-h * 0.26 + (i * h * 0.52) / 6} stroke={P.accentLight} strokeWidth={2} />
                ))}
            </g>
            <text x={x + w / 2} y={y + h + 34} textAnchor="middle" fontFamily={FONT} fontSize={22} fill={P.inkSub} letterSpacing={2}>铰链两端微刷 · 开合时把灰扫出</text>
        </Svg>
    );
};

// 水珠：IP68 示意
export const WaterBeads: React.FC<{ t: number; x: number; y: number; w: number; h: number }> = ({ t, x, y, w, h }) => {
    const beads = [
        [0.18, 0.22, 16],
        [0.42, 0.12, 11],
        [0.66, 0.3, 19],
        [0.82, 0.16, 13],
        [0.3, 0.62, 9],
        [0.74, 0.66, 14],
    ];
    return (
        <Svg>
            <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} rx={14} fill="#DCE3EE" stroke={P.line} opacity={0.9} />
            {beads.map(([u, v, r], i) => {
                const cx = x + u * w;
                const cy = y + v * h + Math.sin(t / 18 + i) * 4;
                return (
                    <g key={i}>
                        <circle cx={cx} cy={cy} r={r} fill="#8FB6EE" opacity={0.28} stroke="#BBD6FF" strokeOpacity={0.5} />
                        <circle cx={cx - r * 0.3} cy={cy - r * 0.35} r={r * 0.26} fill="#FFFFFF" opacity={0.55} />
                    </g>
                );
            })}
        </Svg>
    );
};

// 双电池 + VC 均热板：热区从中心扩散
export const ThermalPlate: React.FC<{ t: number; from: number; x: number; y: number; w: number; h: number; heat: number }> = ({ t, from, x, y, w, h, heat }) => {
    const p = prog(t, from, 24);
    const r = 30 + heat * 90;
    return (
        <Svg>
            <rect x={x} y={y} width={w} height={h} rx={10} fill="#0E1218" stroke={P.line} />
            <rect x={x + 14} y={y + 14} width={w * 0.34} height={h - 28} rx={6} fill="#243044" stroke={P.line} />
            <rect x={x + w * 0.52} y={y + 14} width={w * 0.34} height={h - 28} rx={6} fill="#243044" stroke={P.line} />
            <text x={x + 14 + w * 0.17} y={y + h / 2 + 6} textAnchor="middle" fontFamily={MONO} fontSize={18} fill={P.inkSub}>BATTERY</text>
            <text x={x + w * 0.52 + w * 0.17} y={y + h / 2 + 6} textAnchor="middle" fontFamily={MONO} fontSize={18} fill={P.inkSub}>BATTERY</text>
            <defs>
                <radialGradient id="heat-g">
                    <stop offset="0" stopColor={P.seal} stopOpacity={0.9 * p} />
                    <stop offset="0.5" stopColor={P.accent} stopOpacity={0.5 * p} />
                    <stop offset="1" stopColor={P.accent} stopOpacity={0} />
                </radialGradient>
            </defs>
            <circle cx={x + w / 2} cy={y + h / 2} r={r} fill="url(#heat-g)" />
            <rect x={x + w * 0.44} y={y + 10} width={w * 0.12} height={h - 20} rx={4} fill="#4A5568" opacity={0.8} />
            <text x={x + w / 2} y={y + h + 32} textAnchor="middle" fontFamily={FONT} fontSize={22} fill={P.accentLight} letterSpacing={2}>VC 均热板 · 双电池分置两侧</text>
        </Svg>
    );
};
