import React from "react";
import { prog, pop } from "../../../../shared";
import { FONT, MONO } from "../../../../styles/explode";
import { P } from "../bright";

// 2D 叠加层：尺寸线、读数卡、口径标签、账单行、对照行。
// 全部是 t/from 纯函数，文字永远屏幕正向。

export const Dimension: React.FC<{
    t: number;
    from: number;
    x: number;
    y1: number;
    y2: number;
    label: string;
    note?: string;
    color?: string;
    side?: "left" | "right";
    dur?: number;
}> = ({ t, from, x, y1, y2, label, note, color = P.accent, side = "right", dur = 14 }) => {
    const p = prog(t, from, dur);
    if (p <= 0) return null;
    const mid = (y1 + y2) / 2;
    const cy = y1 + (y2 - y1) * p;
    const w = 90;
    const bx = side === "right" ? x + 16 : x - 16 - w;
    return (
        <>
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                <line x1={x} y1={y1} x2={x} y2={cy} stroke={color} strokeWidth={2} opacity={0.9} />
                <line x1={x - 12} y1={y1} x2={x + 12} y2={y1} stroke={color} strokeWidth={2} />
                <line x1={x - 12} y1={y2} x2={x + 12} y2={y2} stroke={color} strokeWidth={2} opacity={p} />
            </svg>
            {p > 0.35 ? (
                <div style={{ position: "absolute", left: bx, top: mid - 30, width: w, opacity: Math.min(1, (p - 0.35) * 3) }}>
                    <div style={{ fontFamily: MONO, fontSize: 40, color, letterSpacing: 1, lineHeight: 1 }}>{label}</div>
                    {note ? <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: P.inkSub, marginTop: 6 }}>{note}</div> : null}
                </div>
            ) : null}
        </>
    );
};

export const Readout: React.FC<{ t: number; from: number; x: number; y: number; value: string; unit?: string; label: string; color?: string; size?: number }> = ({
    t,
    from,
    x,
    y,
    value,
    unit = "mm",
    label,
    color = P.accent,
    size = 96,
}) => {
    if (t < from) return null;
    const s = pop(t, from, 12);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.94 + 0.06 * s})`, opacity: Math.min(1, s * 1.2), textAlign: "center" }}>
            <div style={{ fontFamily: MONO, fontSize: size, color, lineHeight: 0.95, textShadow: "0 6px 26px #000000AA" }}>
                {value}
                <span style={{ fontSize: size * 0.34, marginLeft: 8, color: P.inkSub }}>{unit}</span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 600, color: P.inkSub, letterSpacing: 4, marginTop: 10 }}>{label}</div>
        </div>
    );
};

export const ClaimTag: React.FC<{ t: number; from: number; x: number; y: number; level: "official" | "chain"; text: string }> = ({ t, from, x, y, level, text }) => {
    if (t < from) return null;
    const s = pop(t, from, 13);
    const c = level === "official" ? P.gold : P.accent;
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.92 + 0.08 * s})`, opacity: Math.min(1, s * 1.25) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: `${P.card}E6`, border: `1px solid ${c}77`, borderLeft: `3px solid ${c}`, borderRadius: 4, padding: "5px 12px", whiteSpace: "nowrap", boxShadow: "0 10px 22px #00000088" }}>
                <div style={{ width: 6, height: 6, background: c, borderRadius: 1, transform: "rotate(45deg)" }} />
                <div style={{ fontFamily: FONT, fontSize: 19, color: P.ink, letterSpacing: 1 }}>{text}</div>
            </div>
        </div>
    );
};

export const ClaimBar: React.FC<{ t: number; from: number; level: "official" | "chain"; text: string }> = ({ t, from, level, text }) => {
    if (t < from) return null;
    const s = prog(t, from, 12);
    const c = level === "official" ? P.gold : P.accent;
    return (
        <div style={{ position: "absolute", right: 92, top: 84, display: "flex", alignItems: "center", gap: 10, opacity: s, transform: `translateX(${(1 - s) * 24}px)`, border: `1px solid ${P.line}`, borderRadius: 6, padding: "8px 16px", background: `${P.card}CC` }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 10px ${c}` }} />
            <div style={{ fontFamily: FONT, fontSize: 20, color: P.inkSub, letterSpacing: 1 }}>{text}</div>
        </div>
    );
};

export const LedgerRow: React.FC<{
    t: number;
    from: number;
    x: number;
    y: number;
    w: number;
    label: string;
    value?: string;
    side: "cut" | "keep";
    strike?: boolean;
}> = ({ t, from, x, y, w, label, value, side, strike = false }) => {
    if (t < from) return null;
    const s = prog(t, from, 14);
    const k = strike ? prog(t, from + 8, 12) : 0;
    const c = side === "cut" ? P.seal : P.accent;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, opacity: s, transform: `translateX(${(1 - s) * -18}px)` }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 18 }}>
                <div style={{ position: "relative", fontFamily: FONT, fontSize: 34, color: side === "cut" ? P.ink : P.ink, letterSpacing: 1 }}>
                    {label}
                    {strike ? <div style={{ position: "absolute", left: -4, top: "52%", height: 3, width: `calc(${k * 100}% + 8px)`, background: P.seal, transformOrigin: "left" }} /> : null}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 30, color: c, whiteSpace: "nowrap" }}>
                    {side === "cut" ? "—" : "✓"} {value ?? ""}
                </div>
            </div>
            <div style={{ height: 1, background: P.line, marginTop: 10 }} />
        </div>
    );
};

export const Tag: React.FC<{ t: number; from: number; x: number; y: number; text: string; color?: string; size?: number }> = ({ t, from, x, y, text, color = P.inkSub, size = 20 }) => {
    if (t < from) return null;
    const s = prog(t, from, 12);
    return (
        <div style={{ position: "absolute", left: x, top: y, opacity: s, fontFamily: MONO, fontSize: Math.max(size, 22), fontWeight: 600, color, letterSpacing: 1.5, whiteSpace: "nowrap" }}>{text}</div>
    );
};
