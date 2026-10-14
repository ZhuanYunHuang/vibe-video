import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, P } from "./theme";

// Synthwave UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：透视网格向地平线滚动（在 Backdrop）+ 铬字 + 霓虹发光 + 光斑扫过。

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

// 舞台：轻水平扫描偏移 + 呼吸
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${Math.sin(t / 90) * 6}px) scale(${1.004 + 0.004 * Math.sin(t / 130)})` }}>{children}</div>
);

// 字幕：霓虹发光文本 + 渐变下划线
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, textAlign: "center", opacity: s * (1 - out), transform: `translateY(${(1 - s) * 24}px)` }}>
            <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 800, color, letterSpacing: 2, textShadow: `0 0 16px ${P.gold}66` }}>{children}</div>
            <div style={{ width: 260, height: 4, margin: "12px auto 0", background: `linear-gradient(90deg, ${P.accent}, ${P.gold})`, borderRadius: 2, boxShadow: `0 0 14px ${P.accent}88` }} />
        </div>
    );
};

// 章节：品红发光描边牌 + 渐变标题 + 渐变规则线
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 58, display: "flex", alignItems: "center", gap: 20, opacity: s, transform: `translateX(${(1 - s) * -34}px)` }}>
            <div
                style={{
                    minWidth: 72,
                    height: 70,
                    padding: "0 14px",
                    border: `3px solid ${color}`,
                    boxShadow: `0 0 18px ${color}88, inset 0 0 16px ${color}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontFamily: FONT,
                    fontSize: step.length > 1 ? 24 : 32,
                    fontWeight: 900,
                    textShadow: `0 0 12px ${color}AA`,
                }}
            >
                {step}
            </div>
            <div>
                <div
                    style={{
                        fontFamily: FONT,
                        fontSize: 50,
                        fontWeight: 900,
                        letterSpacing: 3,
                        background: `linear-gradient(90deg, ${P.ink}, ${P.accentLight} 55%, ${P.gold})`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        filter: `drop-shadow(0 0 10px ${P.accent}55)`,
                    }}
                >
                    {title}
                </div>
                <div style={{ width: Math.max(220, title.length * 54) * u, height: 5, marginTop: 10, background: `linear-gradient(90deg, ${P.accent}, ${P.gold})`, borderRadius: 3, boxShadow: `0 0 12px ${P.accent}77` }} />
            </div>
        </div>
    );
};

// 大字：铬字（金属渐变 + 发光）+ 缩放入场 + 光斑扫过
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color: _color = P.ink, rot = -1, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 4);
    const sweep = prog(t, from + 4, 14);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${(1.4 - 0.4 * s) * (1 + h * 0.05)})`, opacity: Math.min(1, s * 1.2) }}>
            <div
                style={{
                    fontFamily: FONT,
                    fontSize: size,
                    fontWeight: 900,
                    whiteSpace: "nowrap",
                    letterSpacing: 4,
                    background: `linear-gradient(180deg, #FFFFFF 0%, #FFE9FF 30%, #C86BFF 47%, #5A1FA8 53%, ${P.accentLight} 74%, #FFFFFF 100%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    filter: `drop-shadow(0 0 16px ${P.accent}88) drop-shadow(0 0 40px ${P.accent}44)`,
                }}
            >
                {children}
            </div>
            {/* 光斑扫过 */}
            {sweep < 1 ? (
                <div
                    style={{
                        position: "absolute",
                        top: -size * 0.2,
                        bottom: -size * 0.2,
                        left: `${-30 + sweep * 130}%`,
                        width: 90,
                        background: "linear-gradient(90deg, transparent, #FFFFFF66, transparent)",
                        transform: "skewX(-18deg)",
                        opacity: Math.sin(sweep * Math.PI) * 0.9,
                        pointerEvents: "none",
                    }}
                />
            ) : null}
        </div>
    );
};

// 卡片：深卡 + 霓虹描边发光 + 顶部渐变条
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t = 0, x, y, w, h, appear, lit = 0, rot = 0, float = true, children }) => {
    const bob = appear > 0.9 && float ? Math.sin(t / 30 + (x + y) / 100) * 4 : 0;
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `2px solid ${P.accent}AA`,
                borderRadius: 14,
                boxShadow: lit > 0.01 ? `0 0 0 1px ${P.gold}66, 0 0 46px ${P.accent}66, 0 14px 40px #00000066` : `0 0 30px ${P.accent}44, 0 14px 40px #00000066`,
                opacity: appear,
                transform: `translateY(${(1 - appear) * 40 + bob}px) rotate(${rot}deg) scale(${0.9 + 0.1 * appear})`,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 26,
            }}
        >
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 7, background: `linear-gradient(90deg, ${P.accent}, ${P.gold})` }} />
            {children}
        </div>
    );
};

// 徽章：双环霓虹章（发光）
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 118, rot = -6, color = P.accent }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (1 + h * 0.12)})`, opacity: Math.min(1, s * 1.2) }}>
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: `4px solid ${color}`,
                    boxShadow: `0 0 22px ${color}88, inset 0 0 18px ${P.gold}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div style={{ width: size * 0.76, height: size * 0.76, borderRadius: "50%", border: `2px solid ${P.gold}AA`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ fontFamily: FONT, fontWeight: 900, color: P.ink, fontSize: text.length > 2 ? size * 0.2 : size * 0.3, textAlign: "center", lineHeight: 1.2, textShadow: `0 0 12px ${P.gold}88` }}>{text}</div>
                </div>
            </div>
        </div>
    );
};

// 标注：霓虹四角括号 或 渐变发光下划线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 240, h = 90, dur = 12, rot = 0, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    const b = Math.min(1, p * 1.5) * 20;
    return (
        <>
            {underline ? (
                <div style={{ position: "absolute", left: x - w / 2, top: y, width: w * p, height: 5, background: `linear-gradient(90deg, ${color}, ${P.gold})`, borderRadius: 3, boxShadow: `0 0 14px ${color}88` }} />
            ) : (
                <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                    <g stroke={color} strokeWidth={4} fill="none" opacity={p} style={{ filter: `drop-shadow(0 0 8px ${color}AA)` }}>
                        <path d={`M${x - w / 2},${y - h / 2 + b} L${x - w / 2},${y - h / 2} L${x - w / 2 + b},${y - h / 2}`} />
                        <path d={`M${x + w / 2 - b},${y - h / 2} L${x + w / 2},${y - h / 2} L${x + w / 2},${y - h / 2 + b}`} />
                        <path d={`M${x - w / 2},${y + h / 2 - b} L${x - w / 2},${y + h / 2} L${x - w / 2 + b},${y + h / 2}`} />
                        <path d={`M${x + w / 2 - b},${y + h / 2} L${x + w / 2},${y + h / 2} L${x + w / 2},${y + h / 2 - b}`} />
                    </g>
                </svg>
            )}
            {note && t >= from + 4 ? (
                <div style={{ position: "absolute", left: x + w / 2 + 26, top: y - 26, fontFamily: FONT, fontSize: 30, fontWeight: 900, color: P.gold, opacity: Math.min(1, pop(t, from + 4, 10) * 1.3), whiteSpace: "nowrap", textShadow: `0 0 12px ${P.gold}88` }}>
                    {note}
                </div>
            ) : null}
        </>
    );
};
