import React from "react";
import { FONT, pop } from "../../../shared";
import { KAI, P } from "./theme";

// 六机制场景共用页眉：进度圆点（当前项高亮拉长）+ 编号 + 机制名 + 英文
export const MechHead: React.FC<{ t: number; i: number; name: string; en: string }> = ({ t, i, name, en }) => {
    const s = t >= 2 ? pop(t, 2, 10) : 0;
    return (
        <>
            <div style={{ position: "absolute", left: 100, top: 150, display: "flex", gap: 14, opacity: s }}>
                {Array.from({ length: 6 }, (_, k) => (
                    <div key={k} style={{ width: k === i - 1 ? 36 : 14, height: 14, borderRadius: 7, background: k === i - 1 ? P.cinnabar : P.fiber }} />
                ))}
            </div>
            <div style={{ position: "absolute", left: 100, top: 196, opacity: s, transform: `translateX(${(1 - s) * -40}px)`, fontFamily: KAI }}>
                <div style={{ fontSize: 76, fontWeight: 900, color: P.ink, letterSpacing: 6 }}>
                    <span style={{ color: P.cinnabar, marginRight: 20, fontSize: 60 }}>{i}/6</span>
                    {name}
                </div>
                <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: P.inkLight, letterSpacing: 6, marginTop: 8 }}>{en}</div>
            </div>
        </>
    );
};

// 重拍卡点：16 拍（4 小节）边界给全场景一记强拍——纸面微震 + 轻微推近 + 朱砂洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.sin(t * 2.7) * 6 * k}px, ${Math.cos(t * 2.1) * 4 * k}px) scale(${1 + k * 0.008})` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.cinnabar, opacity: k * 0.08, pointerEvents: "none" }} />
        </>
    );
};

// 小爆点：从 (x, y) 迸出一圈朱砂/泥金纸屑（强拍用）
export const Spark: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number }> = ({ t, from, x, y, n = 14, spread = 220 }) => {
    if (t < from || t > from + 40) return null;
    const p = (t - from) / 40;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 22), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 3) * 0.6;
                const r = ease * spread * (0.5 + ((i * 37) % 40) / 100);
                const s = 14 * (1 - p) * (0.6 + ((i * 13) % 30) / 100);
                const c = [P.cinnabar, P.gold, P.ink][i % 3];
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x + Math.cos(a) * r,
                            top: y + Math.sin(a) * r - p * 30,
                            width: s,
                            height: s,
                            border: `2px solid ${c}`,
                            borderRadius: i % 2 ? "50%" : 2,
                            opacity: (1 - p) * 0.9,
                            transform: `rotate(${a * 57}deg)`,
                        }}
                    />
                );
            })}
        </>
    );
};

// 持续浮动：给元素一点呼吸（t 来自场景帧，seed 用坐标即可）
export const floatY = (t: number, seed: number, amp = 3.5) => Math.sin(t / 30 + seed / 70) * amp;

// 机制场景通用小票（纸条小卡）：纸底 + 细边 + 淡投影 + 轻浮动
export const Slip: React.FC<{ t: number; x: number; y: number; rot?: number; appear: number; children: React.ReactNode }> = ({ t, x, y, rot = 0, appear, children }) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            transform: `translate(-50%, -50%) rotate(${rot + (appear > 0.9 ? Math.sin(t / 34 + x / 60) * 1.2 : 0)}deg) translateY(${appear > 0.9 ? floatY(t, x) : 0}px) scale(${0.7 + 0.3 * appear})`,
            opacity: appear,
            background: P.card,
            border: `1px solid ${P.fiber}`,
            borderRadius: 8,
            padding: "10px 22px",
            fontFamily: FONT,
            fontSize: 28,
            fontWeight: 700,
            color: P.ink,
            boxShadow: "0 3px 10px #2E2A2422",
            whiteSpace: "nowrap",
        }}
    >
        {children}
    </div>
);
