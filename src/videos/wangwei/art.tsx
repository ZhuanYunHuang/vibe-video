import React from "react";
import type { FxEvent, Pal } from "../../styles/lyricmv";

// 词意图解：按句意出现的简笔插画，全部为 p(0~1) 的纯函数。
const ease = (p: number) => 1 - Math.pow(1 - p, 3);
const env = (p: number, hold = 0.75) => Math.min(1, p * 6) * (1 - Math.max(0, (p - hold) / (1 - hold)));

// 台风：漏斗 + 碎片
export const Tornado: React.FC<{ p: number; color: string }> = ({ p, color }) => {
    const rings = 14;
    const spiral = Array.from({ length: 90 }, (_, k) => {
        const q = k / 89;
        const y = 60 + q * 760;
        const rx = 178 - q * 150;
        const a = q * Math.PI * 6 + p * 10;
        return `${k ? "L" : "M"} ${240 + Math.cos(a) * rx} ${y}`;
    }).join(" ");
    return (
        <div style={{ position: "absolute", right: 110, top: 110, width: 480, height: 820, opacity: 0.62 * env(p) }}>
            <svg viewBox="0 0 480 820" width="100%" height="100%">
                {Array.from({ length: rings }, (_, i) => {
                    const q = i / (rings - 1);
                    return (
                        <ellipse
                            key={i}
                            cx={240}
                            cy={60 + i * 54}
                            rx={178 - q * 150 + Math.sin(p * 12 + i * 0.8) * 9}
                            ry={24 - q * 16}
                            fill="none"
                            stroke={color}
                            strokeWidth={3.4}
                            opacity={0.85 - q * 0.35}
                        />
                    );
                })}
                <path d={spiral} fill="none" stroke={color} strokeWidth={2.4} opacity={0.6} />
                {Array.from({ length: 14 }, (_, i) => (
                    <circle key={`d${i}`} cx={240 + Math.cos(i * 1.7) * (140 + (i % 4) * 26)} cy={760 - ((p * 420 + i * 57) % 750)} r={2 + (i % 3)} fill={color} opacity={0.55} />
                ))}
            </svg>
        </div>
    );
};

// 暴君：披斗篷的死神 + 镰刀
export const Reaper: React.FC<{ p: number }> = ({ p }) => {
    const o = env(p, 0.86);
    return (
        <div style={{ position: "absolute", right: 40, top: 30, width: 600, height: 900, opacity: 0.92 * o, transform: `translateX(${(1 - ease(Math.min(1, p * 3))) * 140}px)` }}>
            <div style={{ position: "absolute", left: 80, top: 110, width: 440, height: 700, background: "radial-gradient(ellipse at center, #8E111144, transparent 70%)" }} />
            <svg viewBox="0 0 680 900" width="100%" height="100%">
                <path d="M280 110 L 370 200 L 350 260 L 430 700 L 130 700 L 210 260 L 190 200 Z" fill="#0A0806" stroke="#F2E8D2" strokeWidth="4" />
                <path d="M280 135 L 330 210 L 320 300 L 240 300 L 230 210 Z" fill="#000" stroke="#F2E8D2" strokeWidth="3" />
                <circle cx="258" cy="225" r="8" fill="#B3161B" />
                <circle cx="302" cy="225" r="8" fill="#B3161B" />
                <path d="M130 700 L 156 750 L 182 708 L 208 752 L 234 710 L 260 754 L 286 712 L 312 756 L 338 714 L 364 748 L 390 708 L 430 700 Z" fill="#0A0806" stroke="#F2E8D2" strokeWidth="3" />
                <line x1="470" y1="800" x2="300" y2="70" stroke="#F2E8D2" strokeWidth="9" strokeLinecap="round" />
                <line x1="470" y1="800" x2="300" y2="70" stroke="#140D04" strokeWidth="3" opacity="0.45" />
                <path d="M300 70 C 420 40, 540 100, 590 220 C 500 155, 400 125, 300 135 Z" fill="#F2E8D2" stroke="#140D04" strokeWidth="4" />
                <circle cx="392" cy="420" r="13" fill="#F2E8D2" opacity="0.9" />
                <circle cx="380" cy="480" r="12" fill="#F2E8D2" opacity="0.8" />
            </svg>
        </div>
    );
};

// 方天画戟：对称双月牙 + 枪尖 + 双横档
export const Halberd: React.FC<{ p: number; color: string }> = ({ p, color }) => {
    const o = Math.min(1, p * 5) * (1 - Math.max(0, (p - 0.8) / 0.2));
    return (
        <div
            style={{
                position: "absolute",
                left: 1210 - (1 - ease(p)) * 300,
                top: 10,
                width: 560,
                height: 1060,
                transform: `rotate(${-12 + Math.sin(p * 3) * 1.6}deg)`,
                opacity: 0.95 * o,
            }}
        >
            <svg viewBox="0 0 600 1100" width="100%" height="100%">
                <rect x="282" y="260" width="36" height="800" fill={color} stroke="#140D04" strokeWidth="4" />
                <rect x="264" y="292" width="72" height="48" fill={color} stroke="#140D04" strokeWidth="4" />
                {[304, 312, 320, 328].map((y) => (
                    <line key={y} x1="266" y1={y} x2="334" y2={y} stroke="#140D04" strokeWidth="2" opacity="0.6" />
                ))}
                <rect x="150" y="430" width="300" height="18" fill={color} stroke="#140D04" strokeWidth="3" />
                <rect x="150" y="560" width="300" height="18" fill={color} stroke="#140D04" strokeWidth="3" />
                <path d="M258 300 C 170 290, 105 350, 95 450 C 88 545, 135 615, 258 620 C 205 570, 185 520, 188 455 C 190 390, 215 330, 258 300 Z" fill={color} stroke="#140D04" strokeWidth="4" />
                <path d="M342 300 C 430 290, 495 350, 505 450 C 512 545, 465 615, 342 620 C 395 570, 415 520, 412 455 C 410 390, 385 330, 342 300 Z" fill={color} stroke="#140D04" strokeWidth="4" />
                <path d="M300 40 L348 210 L300 300 L252 210 Z" fill={color} stroke="#140D04" strokeWidth="4" />
            </svg>
        </div>
    );
};

// 刀光：斜向划过
export const BladeCut: React.FC<{ p: number }> = ({ p }) => {
    const x = -520 + ease(p) * 2960;
    const o = 1 - Math.max(0, (p - 0.6) / 0.4);
    return (
        <div style={{ position: "absolute", inset: 0, opacity: o }}>
            <div style={{ position: "absolute", left: x, top: -300, width: 8, height: 1800, background: "#F2E8D2", transform: "rotate(26deg)", boxShadow: "0 0 26px #F2E8D2" }} />
            <div style={{ position: "absolute", left: x - 36, top: -300, width: 3, height: 1800, background: "#D4A73C", transform: "rotate(26deg)", opacity: 0.8 }} />
        </div>
    );
};

// 奇奇怪怪：横向撕裂条 + 扫描线
export const GlitchBars: React.FC<{ p: number; pal: Pal }> = ({ p, pal }) => {
    const o = env(p, 0.82);
    const bars: [number, number][] = [
        [120, 80],
        [330, 36],
        [510, 120],
        [700, 54],
        [860, 96],
    ];
    return (
        <div style={{ position: "absolute", inset: 0, opacity: 0.55 * o }}>
            {bars.map(([y, h], i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: (i % 2 ? 0 : -40) + Math.sin(p * 40 + i) * 24,
                        top: y,
                        width: 1960,
                        height: h,
                        background: i % 2 ? pal.accent : pal.ink,
                        opacity: 0.12,
                    }}
                />
            ))}
            <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent 0 6px, rgba(0,0,0,0.16) 6px 8px)" }} />
        </div>
    );
};

// 里里外外：层层内收的取景框
export const NestedFrames: React.FC<{ p: number; color: string }> = ({ p, color }) => {
    const o = env(p, 0.82);
    return (
        <div style={{ position: "absolute", inset: 0, opacity: 0.8 * o }}>
            {[0, 1, 2, 3].map((i) => {
                const inset = 190 + i * 95 - ease(p) * (110 + i * 36);
                return <div key={i} style={{ position: "absolute", left: inset, top: inset * 0.62, right: inset, bottom: inset * 0.62, border: `3px solid ${color}`, opacity: 0.85 - i * 0.13 }} />;
            })}
        </div>
    );
};

// 释迦摩尼 / 施加魔力：曼陀罗光环
export const Mandala: React.FC<{ p: number; color: string; scale?: number }> = ({ p, color, scale = 1 }) => {
    const o = env(p, 0.78);
    const s = (0.72 + 0.28 * ease(p)) * scale;
    return (
        <div style={{ position: "absolute", left: 960, top: 520, width: 720, height: 720, marginLeft: -360, marginTop: -360, transform: `scale(${s}) rotate(${p * 42}deg)`, opacity: 0.36 * o }}>
            <svg viewBox="0 0 700 700" width="100%" height="100%">
                {[150, 210, 270].map((r) => (
                    <circle key={r} cx="350" cy="350" r={r} fill="none" stroke={color} strokeWidth="2" />
                ))}
                {Array.from({ length: 16 }, (_, i) => (
                    <ellipse key={i} cx="350" cy="200" rx="22" ry="80" fill="none" stroke={color} strokeWidth="2" transform={`rotate(${i * 22.5} 350 350)`} />
                ))}
                {Array.from({ length: 24 }, (_, i) => {
                    const a = (i * 15 * Math.PI) / 180;
                    return <circle key={i} cx={350 + Math.cos(a) * 315} cy={350 + Math.sin(a) * 315} r="3" fill={color} />;
                })}
            </svg>
        </div>
    );
};

// 修个庙：三重飞檐 + 塔身立柱
export const Temple: React.FC<{ p: number; color: string }> = ({ p, color }) => {
    const o = env(p, 0.82);
    const rise = (1 - ease(Math.min(1, p * 1.5))) * 80;
    return (
        <div style={{ position: "absolute", left: 960, top: 470, width: 900, height: 520, marginLeft: -450, transform: `translateY(${rise}px)`, opacity: 0.62 * o }}>
            <svg viewBox="0 0 900 520" width="100%" height="100%">
                {[
                    { y: 360, w: 760 },
                    { y: 270, w: 560 },
                    { y: 190, w: 360 },
                ].map((r, i) => (
                    <g key={i}>
                        <path d={`M ${450 - r.w / 2} ${r.y} Q 450 ${r.y - 110} ${450 + r.w / 2} ${r.y}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
                        <path d={`M ${450 - r.w / 2} ${r.y} Q ${450 - r.w / 2 - 34} ${r.y - 26} ${450 - r.w / 2 - 14} ${r.y - 62}`} fill="none" stroke={color} strokeWidth="4" opacity="0.8" />
                        <path d={`M ${450 + r.w / 2} ${r.y} Q ${450 + r.w / 2 + 34} ${r.y - 26} ${450 + r.w / 2 + 14} ${r.y - 62}`} fill="none" stroke={color} strokeWidth="4" opacity="0.8" />
                    </g>
                ))}
                <rect x="330" y="360" width="240" height="140" fill="none" stroke={color} strokeWidth="4" opacity="0.7" />
                {[390, 450, 510].map((x) => (
                    <line key={x} x1={x} y1="360" x2={x} y2="500" stroke={color} strokeWidth="3" opacity="0.55" />
                ))}
                <circle cx="450" cy="160" r="10" fill={color} />
            </svg>
        </div>
    );
};

// 贡品：供碗 + 果品 + 三缕烟
export const Offering: React.FC<{ p: number; color: string }> = ({ p, color }) => (
    <div style={{ position: "absolute", left: 110, bottom: 150, width: 480, height: 480, opacity: 0.6 * env(p, 0.84) }}>
        <svg viewBox="0 0 480 480" width="100%" height="100%">
            <path d="M100 300 Q 240 440 380 300 Z" fill="none" stroke={color} strokeWidth="6" />
            <line x1="100" y1="300" x2="380" y2="300" stroke={color} strokeWidth="6" />
            <circle cx="185" cy="286" r="22" fill={color} opacity="0.8" />
            <circle cx="235" cy="276" r="16" fill={color} opacity="0.6" />
            <circle cx="280" cy="288" r="18" fill={color} opacity="0.7" />
            {[0, 1, 2].map((i) => (
                <path
                    key={i}
                    d={`M ${165 + i * 70} 270 C ${110 + i * 70} 200, ${235 + i * 70} 170, ${175 + i * 70} 70`}
                    fill="none"
                    stroke={color}
                    strokeWidth="4"
                    opacity={0.8 - i * 0.12}
                    strokeDasharray="10 14"
                    strokeDashoffset={-p * 140 - i * 20}
                />
            ))}
        </svg>
    </div>
);

// 国王：王冠落下
export const Crown: React.FC<{ p: number; color: string }> = ({ p, color }) => {
    const t = Math.min(1, p * 2.2);
    const y = -260 + ease(t) * 260 - Math.sin(t * Math.PI) * 18;
    return (
        <div style={{ position: "absolute", left: 960, top: 150, width: 420, height: 260, marginLeft: -210, transform: `translateY(${y}px) rotate(${(1 - t) * 8}deg)`, opacity: Math.min(1, p * 6) }}>
            <svg viewBox="0 0 420 260" width="100%" height="100%">
                <path d="M50 190 L50 80 L125 145 L210 40 L295 145 L370 80 L370 190 Z" fill={color} stroke="#140D04" strokeWidth="6" />
                <rect x="50" y="190" width="320" height="46" fill={color} stroke="#140D04" strokeWidth="6" />
                <circle cx="50" cy="72" r="12" fill={color} stroke="#140D04" strokeWidth="4" />
                <circle cx="210" cy="34" r="14" fill={color} stroke="#140D04" strokeWidth="4" />
                <circle cx="370" cy="72" r="12" fill={color} stroke="#140D04" strokeWidth="4" />
            </svg>
        </div>
    );
};

// 事件表：at 为绝对秒
export const ART_EVENTS: FxEvent[] = [
    { at: 2.28, dur: 40, layer: "back", render: (p, pal) => <Tornado p={p} color={pal.accent} /> },
    { at: 7.18, dur: 48, layer: "back", render: (p) => <Reaper p={p} /> },
    { at: 12.42, dur: 34, layer: "front", render: (p, pal) => <Halberd p={p} color={pal.accent} /> },
    { at: 13.62, dur: 22, layer: "front", render: (p) => <BladeCut p={p} /> },
    { at: 16.36, dur: 44, layer: "back", render: (p, pal) => (
        <>
            <GlitchBars p={p} pal={pal} />
            <div style={{ opacity: 0.45 }}>
                <NestedFrames p={p} color={pal.accent} />
            </div>
        </>
    ) },
    { at: 17.56, dur: 44, layer: "back", render: (p, pal) => (
        <>
            <NestedFrames p={p} color={pal.accent} />
            <div style={{ opacity: 0.45 }}>
                <GlitchBars p={p} pal={pal} />
            </div>
        </>
    ) },
    { at: 18.74, dur: 38, layer: "back", render: (p, pal) => <Mandala p={p} color={pal.accent} /> },
    { at: 19.92, dur: 30, layer: "back", render: (p, pal) => <Mandala p={p} color={pal.accent} scale={0.72} /> },
    { at: 21.04, dur: 42, layer: "back", render: (p, pal) => <Temple p={p} color={pal.accent} /> },
    { at: 24.08, dur: 44, layer: "back", render: (p, pal) => <Offering p={p} color={pal.accent} /> },
    { at: 33.6, dur: 46, layer: "back", render: (p, pal) => <Crown p={p} color={pal.ink} /> },
];
