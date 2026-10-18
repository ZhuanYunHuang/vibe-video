import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, MONO, P } from "./theme";

// 歌词 MV UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：机甲标题黑 + 血红硬投影 + 切角韵脚块 + 底部细规歌词行。

// 绝对拍号 -> 场景内帧
export const useK = (start: number) => {
    const at = useAt();
    return (beat: number) => at(start, beat - start);
};

// 拍点脉冲（0~1）
export const usePulse = (start: number) => {
    const beat = useBeat();
    const t = useT();
    return beat.beatPulse(beat.bf(start) + t);
};

// 舞台：只做 1px 级慢漂移，保持镜头静止感
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.sin(t / 140) * 1.1}px, ${Math.cos(t / 190) * 0.7}px)` }}>{children}</div>
);

// 字幕：底部歌词行，左侧血红短规 + 右侧 LYRIC 小标
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div
            style={{
                position: "absolute",
                bottom: 88,
                left: 0,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 18,
                fontFamily: FONT,
                fontSize: 38,
                letterSpacing: 2,
                color,
                opacity: s * (1 - out),
                transform: `translateY(${(1 - s) * 24}px)`,
            }}
        >
            <span style={{ width: 56, height: 3, background: P.accent, transform: `scaleX(${s})`, transformOrigin: "left center" }} />
            <span style={{ whiteSpace: "nowrap" }}>{children}</span>
            <span style={{ fontFamily: MONO, fontSize: 14, letterSpacing: 4, color: P.inkSub }}>LYRIC</span>
        </div>
    );
};

// 章节：血红竖 tick + 编号 + 标题 + 生长细线
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.ink }) => {
    const p = prog(t, 0, 16);
    const label = /^\d+$/.test(step) ? `L.${step.padStart(2, "0")}` : step;
    return (
        <div style={{ position: "absolute", left: 96, top: 58, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, color }}>
            <span style={{ width: 5, height: 34, background: P.accent }} />
            <span style={{ fontFamily: MONO, fontSize: 22, letterSpacing: 6, color: P.accent }}>{label}</span>
            <span style={{ fontSize: 30, letterSpacing: 3 }}>{title}</span>
            <span style={{ width: 120 * p, height: 2, background: `${P.ink}44` }} />
        </div>
    );
};

// 大字：1.28 压到 1 + 模糊归零 + 血红硬投影
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({
    t,
    from,
    x = 960,
    y = 540,
    size = 72,
    color = P.ink,
    rot = 0,
    children,
}) => {
    if (t < from) return null;
    const p = prog(t, from, 6);
    const j = hit(t, from, 4) * 8;
    const hard = Math.max(2, Math.round(size * 0.035));
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1 + 0.28 * (1 - p)}) translateX(${Math.sin(t * 8.3) * j}px)`,
                opacity: Math.min(1, p * 2),
                filter: `blur(${(1 - p) * 10}px)`,
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: size,
                lineHeight: 1,
                color,
                whiteSpace: "nowrap",
                letterSpacing: size * 0.02,
                textShadow: `${hard}px ${hard}px 0 ${P.accentDeep}`,
            }}
        >
            {children}
        </div>
    );
};

// 卡片：切角面板 + 2px 血红细边（内外双层实现，clip-path 下 border 不可靠）
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({
    x,
    y,
    w,
    h,
    appear,
    lit = 0,
    rot = 0,
    children,
}) => {
    const a = Math.min(1, Math.max(0, appear));
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                opacity: a,
                transform: `translateY(${(1 - a) * 26}px) rotate(${rot}deg)`,
                clipPath: "polygon(26px 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%, 0 26px)",
                background: P.accent,
                filter: lit > 0 ? `drop-shadow(0 0 ${Math.round(8 + lit * 30)}px ${P.accent}66)` : undefined,
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: 2,
                    clipPath: "polygon(25px 0, 100% 0, 100% calc(100% - 25px), calc(100% - 25px) 100%, 0 100%, 0 25px)",
                    background: P.card,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                    textAlign: "center",
                }}
            >
                {children}
            </div>
        </div>
    );
};

// 韵脚块（签名）：血红切角方块整体弹出，内嵌骨白字
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({
    t,
    from,
    x,
    y,
    text,
    size = 108,
    rot = 0,
    color = P.ink,
}) => {
    if (t < from) return null;
    const s = Math.min(1, pop(t, from, 10));
    const fs = Math.round(size * (Array.from(text).length > 2 ? 0.4 : 0.58));
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1.18 - 0.18 * s})`,
                opacity: Math.min(1, s * 1.4),
            }}
        >
            <div
                style={{
                    background: P.accent,
                    padding: "10px 32px 16px",
                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)",
                    boxShadow: `0 0 34px ${P.accent}55`,
                }}
            >
                <span style={{ display: "block", fontFamily: FONT, fontWeight: 400, fontSize: fs, lineHeight: 1, color, whiteSpace: "nowrap" }}>{text}</span>
            </div>
        </div>
    );
};

// 标注：细红括号 / 下划线横扫，note 用等宽小字
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({
    t,
    from,
    x,
    y,
    w = 320,
    h = 100,
    dur = 16,
    rot = 0,
    underline = false,
    note,
    color = P.accent,
}) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    if (underline) {
        return (
            <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: 2, background: color, transform: `scaleX(${p})`, transformOrigin: "left center", opacity: 0.9 }} />
        );
    }
    const L = 18;
    const corners: React.CSSProperties[] = [
        { left: 0, top: 0, borderLeftWidth: 2, borderTopWidth: 2 },
        { right: 0, top: 0, borderRightWidth: 2, borderTopWidth: 2 },
        { left: 0, bottom: 0, borderLeftWidth: 2, borderBottomWidth: 2 },
        { right: 0, bottom: 0, borderRightWidth: 2, borderBottomWidth: 2 },
    ];
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scale(${0.85 + 0.15 * p})`, opacity: p }}>
            {corners.map((c, i) => (
                <div key={i} style={{ position: "absolute", width: L, height: L, borderStyle: "solid", borderWidth: 0, borderColor: color, ...c }} />
            ))}
            {note ? (
                <div style={{ position: "absolute", left: 0, top: h + 10, fontFamily: MONO, fontSize: 16, letterSpacing: 2, color: P.inkSub, whiteSpace: "nowrap" }}>{note}</div>
            ) : null}
        </div>
    );
};
