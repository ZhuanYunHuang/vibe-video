import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, MONO, P } from "./theme";

// 赛博 HUD UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：扫描光带持续移动 + 入场数字故障（glitch 瞬切）+ 括号化 HUD 装饰。

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

// 舞台：电子跳变（每 3 帧 ±1px）+ 偶发 1 帧水平错位
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
    const j = Math.floor(t / 3) % 2 ? 1 : -1;
    const glitch = Math.floor(t / 3) % 40 === 0 ? 3 : 0;
    return (
        <div style={{ position: "absolute", inset: 0, transform: `translate(${j + glitch}px, ${-j}px)` }}>{children}</div>
    );
};

// 字幕：括号化等宽文本
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div style={{ position: "absolute", bottom: 82, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 36, letterSpacing: 2, color, opacity: s * (1 - out), transform: `translateY(${(1 - s) * 24}px)` }}>
            <span style={{ color: P.accent }}>[ </span>
            {children}
            <span style={{ color: P.accent }}> ]</span>
        </div>
    );
};

// 章节：等宽标签块 + 括号标题 + 刻度下划线
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 58, display: "flex", alignItems: "center", gap: 20, opacity: s, fontFamily: FONT }}>
            <div
                style={{
                    minWidth: 70,
                    height: 66,
                    padding: "0 14px",
                    border: `2px solid ${color}`,
                    boxShadow: `0 0 16px ${color}55, inset 0 0 14px ${color}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontSize: step.length > 1 ? 24 : 32,
                    fontWeight: 700,
                }}
            >
                {step}
            </div>
            <div>
                <div style={{ fontSize: 48, fontWeight: 700, color: P.ink, letterSpacing: 4, textShadow: `0 0 14px ${P.ink}33` }}>[ {title} ]</div>
                <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                    {Array.from({ length: 28 }, (_, i) => (
                        <div key={i} style={{ width: 3, height: i / 28 < u ? (i % 5 === 0 ? 14 : 8) : 4, background: color, opacity: i / 28 < u ? 0.95 : 0.3 }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 大字：霓虹发光 + 上下括号 + glitch 入场
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot: _rot = 0, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    const jitter = t - from < 4 ? (t % 2 ? 7 : -7) : 0;
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) translateX(${jitter}px) scale(${(1.35 - 0.35 * s) * (1 + h * 0.05)})`,
                opacity: Math.min(1, s * 1.2),
                fontFamily: FONT,
                fontSize: size,
                fontWeight: 700,
                color,
                whiteSpace: "nowrap",
                letterSpacing: 6,
                textShadow: `0 0 18px ${P.accent}88, 0 0 46px ${P.accent}44`,
            }}
        >
            <span style={{ color: P.accent, fontSize: size * 0.7 }}>⟨ </span>
            {children}
            <span style={{ color: P.accent, fontSize: size * 0.7 }}> ⟩</span>
        </div>
    );
};

// 面板：深色卡 + 霓虹描边 + 切角 + 四角刻度框
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t: _t = 0, x, y, w, h, appear, lit = 0, rot: _rot = 0, float: _float = true, children }) => {
    if (appear <= 0) return null;
    const cut = 18;
    const clip = `polygon(${cut}px 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, ${cut}px 100%, 0 calc(100% - ${cut}px), 0 ${cut}px)`;
    const u = prog(appear, 0, 1);
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                clipPath: clip,
                background: P.card,
                boxShadow: lit > 0.01 ? `inset 0 0 0 2px ${P.accent}, 0 0 34px ${P.accent}55` : `inset 0 0 0 2px ${P.line}`,
                opacity: Math.min(1, appear * 1.4),
                transform: `translateY(${(1 - appear) * 26}px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            {/* 四角刻度 */}
            {[
                { left: 8, top: 8, bt: true, bl: true },
                { right: 8, top: 8, bt: true, br: true },
                { left: 8, bottom: 8, bb: true, bl: true },
                { right: 8, bottom: 8, bb: true, br: true },
            ].map((c, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: c.left,
                        right: c.right,
                        top: c.top,
                        bottom: c.bottom,
                        width: 14 + u * 6,
                        height: 14 + u * 6,
                        borderLeft: c.bl ? `2px solid ${P.accent}` : undefined,
                        borderRight: c.br ? `2px solid ${P.accent}` : undefined,
                        borderTop: c.bt ? `2px solid ${P.accent}` : undefined,
                        borderBottom: c.bb ? `2px solid ${P.accent}` : undefined,
                        opacity: 0.9,
                    }}
                />
            ))}
            {children}
        </div>
    );
};

// 徽章：霓虹六边形（描边不填充）
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 116, rot = -4, color = P.seal }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (1 + h * 0.12)})`, opacity: Math.min(1, s * 1.25) }}>
            <div
                style={{
                    width: size,
                    height: size,
                    clipPath: "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)",
                    background: `${color}22`,
                    boxShadow: `inset 0 0 0 3px ${color}, 0 0 26px ${color}66`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div style={{ fontFamily: FONT, fontWeight: 700, color, fontSize: text.length > 2 ? size * 0.2 : size * 0.32, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2, textShadow: `0 0 12px ${color}88` }}>
                    {text.split("").map((ch, i) => (
                        <span key={i}>{ch}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 标注：四角扫描括号（画完后扫描线来回动）+ 等宽小字批注；下划线为发光横线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 240, h = 90, dur = 12, rot = 0, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    const scanY = ((t * 6) % h) * (h / 100) + (h * 0.2);
    return (
        <>
            {underline ? (
                <div style={{ position: "absolute", left: x - w / 2, top: y, width: w * p, height: 4, background: color, boxShadow: `0 0 16px ${color}` }} />
            ) : (
                <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, opacity: p }}>
                    {[
                        { left: 0, top: 0, br: true, bb: true },
                        { right: 0, top: 0, bl: true, bb: true },
                        { left: 0, bottom: 0, br: true, bt: true },
                        { right: 0, bottom: 0, bl: true, bt: true },
                    ].map((c, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: c.left,
                                right: c.right,
                                top: c.top,
                                bottom: c.bottom,
                                width: 22,
                                height: 22,
                                borderLeft: c.bl ? `3px solid ${color}` : undefined,
                                borderRight: c.br ? `3px solid ${color}` : undefined,
                                borderTop: c.bt ? `3px solid ${color}` : undefined,
                                borderBottom: c.bb ? `3px solid ${color}` : undefined,
                            }}
                        />
                    ))}
                    {p > 0.9 ? <div style={{ position: "absolute", left: 6, right: 6, top: `${(scanY / h) * 100}%`, height: 2, background: `${color}88` }} /> : null}
                </div>
            )}
            {note && t >= from + 4 ? (
                <div style={{ position: "absolute", left: x + w / 2 + 26, top: y - 24, fontFamily: MONO, fontSize: 26, fontWeight: 700, color: P.gold, opacity: Math.min(1, pop(t, from + 4, 10) * 1.3), whiteSpace: "nowrap", letterSpacing: 1 }}>
                    {note}
                </div>
            ) : null}
        </>
    );
};
