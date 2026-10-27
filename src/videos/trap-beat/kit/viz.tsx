import React from "react";
import { useCurrentFrame } from "remotion";
import { rnd, prog } from "../../../shared";
import { FONT, GhostLine, Grain, MONO, Scanlines, Vignette } from "../../../styles/lyricmv";
import { T } from "./theme";

// 暗黑电子 studio 背景：近黑底 + 冰青光晕 + 节拍网格；不填底色，场景自己决定
export const BeatBackdrop: React.FC = () => {
    const f = useCurrentFrame();
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 62% 52% at 50% -8%, ${T.accent}26, transparent 72%)` }} />
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 48% 40% at 50% 108%, ${T.warm}14, transparent 70%)` }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 128px)" }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 64px)" }} />
            <GhostLine t={f} text="808" size={560} x={1120} y={360} rot={-6} opacity={0.035} color={T.accent} />
            <Scanlines t={f} opacity={0.08} />
            <Grain t={f} opacity={0.1} />
            <Vignette strength={1} />
        </>
    );
};

// 波形条
export const Waveform: React.FC<{ t: number; seed?: number; cols?: number; width?: number; height?: number; color?: string; pulse?: number }> = ({
    t,
    seed = 7,
    cols = 96,
    width = 1320,
    height = 96,
    color = T.ink,
    pulse = 0,
}) => {
    const step = width / cols;
    return (
        <div style={{ position: "relative", width, height, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {Array.from({ length: cols }, (_, i) => {
                const n = rnd(i, seed);
                const wave = 0.42 + 0.34 * Math.sin(i * 0.37 + t * 0.21 + seed);
                const amp = Math.min(1, Math.abs(n * 0.55 + wave * 0.75));
                const h = Math.max(3, Math.min(1, (0.16 + amp * 0.84) * (1 + pulse * 0.18)) * height);
                return (
                    <div key={i} style={{ width: Math.max(2, step * 0.48), height: h, background: color, opacity: 0.3 + Math.min(1, amp) * 0.62, borderRadius: 1 }} />
                );
            })}
        </div>
    );
};

export type GridRow = { label: string; steps: number[]; color: string; on?: boolean };

// 16 步音序器
export const StepGrid: React.FC<{ beat: number; rows: GridRow[]; left: number; top: number; cell?: number; labelW?: number }> = ({
    beat,
    rows,
    left,
    top,
    cell = 44,
    labelW = 132,
}) => {
    const step = ((Math.floor(beat * 4) % 16) + 16) % 16;
    const gap = 6;
    return (
        <div style={{ position: "absolute", left, top }}>
            <div style={{ display: "flex", marginLeft: labelW, marginBottom: 8, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: `${T.ink}55` }}>
                {[1, 2, 3, 4].map((b) => (
                    <div key={b} style={{ width: (cell + gap) * 4 }}>{`BEAT ${b}`}</div>
                ))}
            </div>
            {rows.map((row) => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", height: cell, marginBottom: 8, opacity: row.on === false ? 0.14 : 1 }}>
                    <div style={{ width: labelW, fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: row.color }}>{row.label}</div>
                    {Array.from({ length: 16 }, (_, i) => {
                        const lit = row.steps.includes(i);
                        const now = i === step;
                        return (
                            <div
                                key={i}
                                style={{
                                    width: cell - 4,
                                    height: cell - 12,
                                    marginRight: gap,
                                    background: lit ? row.color : "rgba(255,255,255,0.045)",
                                    opacity: lit ? (now ? 1 : 0.7) : 1,
                                    transform: now ? "translateY(-2px)" : undefined,
                                    border: now ? `1px solid ${T.ink}55` : "1px solid transparent",
                                    boxShadow: lit && now ? `0 0 20px ${row.color}` : undefined,
                                }}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

// 小节尺
export const BarRuler: React.FC<{ activeBar: number; bars?: number; left: number; top: number; width?: number; color?: string }> = ({
    activeBar,
    bars = 16,
    left,
    top,
    width = 1700,
    color = T.accent,
}) => {
    const bw = width / bars;
    const cur = ((activeBar % bars) + bars) % bars;
    return (
        <div style={{ position: "absolute", left, top, width, height: 56 }}>
            {Array.from({ length: bars }, (_, i) => {
                const done = i < cur;
                const now = i === cur;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: i * bw,
                            width: bw - 6,
                            height: 56,
                            background: now ? color : done ? `${color}44` : "rgba(255,255,255,0.05)",
                            borderTop: `2px solid ${now ? T.ink : color}`,
                            opacity: now ? 1 : 0.8,
                            transform: now ? "translateY(-4px)" : undefined,
                        }}
                    />
                );
            })}
            <div style={{ position: "absolute", top: 66, left: 0, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: `${T.ink}55` }}>BAR 01</div>
            <div style={{ position: "absolute", top: 66, right: 0, fontFamily: MONO, fontSize: 13, letterSpacing: 3, color: `${T.ink}55` }}>{`BAR ${String(bars).padStart(2, "0")}`}</div>
        </div>
    );
};

export const Chip: React.FC<{ children: React.ReactNode; color?: string; bg?: string }> = ({ children, color = T.bg, bg = T.accent }) => (
    <span style={{ display: "inline-block", padding: "8px 18px", background: bg, color, fontFamily: MONO, fontSize: 18, letterSpacing: 4 }}>{children}</span>
);

export const Tag: React.FC<{ text: string; left: number; top: number; color?: string }> = ({ text, left, top, color = T.accent }) => (
    <div style={{ position: "absolute", left, top, display: "flex", alignItems: "center", gap: 12, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color }}>
        <span style={{ width: 5, height: 22, background: color }} />
        {text}
    </div>
);

export const Stat: React.FC<{ label: string; value: string; color?: string; align?: "left" | "center" }> = ({ label, value, color = T.ink, align = "left" }) => (
    <div style={{ textAlign: align, fontFamily: FONT }}>
        <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: 4, color: `${T.ink}66`, marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 44, letterSpacing: 2, color }}>{value}</div>
    </div>
);

// 场景左上角编号标题
export const SceneLabel: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = T.ink }) => {
    const p = prog(t, 0, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 58, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, color }}>
            <span style={{ width: 5, height: 34, background: T.accent }} />
            <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: T.accent }}>{step}</span>
            <span style={{ fontSize: 30, letterSpacing: 3 }}>{title}</span>
            <span style={{ width: 120 * p, height: 2, background: `${T.ink}33` }} />
        </div>
    );
};

// 大标题（带硬阴影 + 冰青辉光）
export const BigTitle: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; children: React.ReactNode }> = ({
    t,
    from,
    x = 960,
    y = 520,
    size = 180,
    color = T.ink,
    children,
}) => {
    if (t < from) return null;
    const p = prog(t, from, 6);
    const hard = Math.max(2, Math.round(size * 0.03));
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) scale(${1 + 0.18 * (1 - p)})`,
                opacity: Math.min(1, p * 2),
                filter: `blur(${(1 - p) * 8}px)`,
                fontFamily: FONT,
                fontSize: size,
                lineHeight: 1,
                color,
                whiteSpace: "nowrap",
                letterSpacing: "-0.01em",
                textShadow: `${hard}px ${hard}px 0 ${T.deep}, 0 0 42px ${T.accent}33`,
            }}
        >
            {children}
        </div>
    );
};

// 拨弦动机条：按 16 分步排版，音高越高越靠上
export const MelodyBars: React.FC<{
    steps: { step: number; idx: number; len: number }[];
    active: number;
    left: number;
    top: number;
    width: number;
    height?: number;
    color?: string;
}> = ({ steps, active, left, top, width, height = 170, color = T.accent }) => (
    <div style={{ position: "absolute", left, top, width, height }}>
        {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i / 3) * (height - 30) + 8, height: 1, background: `${T.ink}14` }} />
        ))}
        {steps.map((s, i) => {
            const on = active >= s.step && active < s.step + s.len;
            const h = 24 + s.idx * 22;
            return (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: (s.step / 16) * width,
                        top: height - h,
                        width: Math.max(24, (s.len / 16) * width - 8),
                        height: h,
                        background: on ? color : `${color}2E`,
                        border: `1px solid ${on ? T.ink : `${color}77`}`,
                        boxShadow: on ? `0 0 22px ${color}66` : undefined,
                    }}
                />
            );
        })}
    </div>
);
