import React from "react";
import { hit, pop, prog } from "../../../shared";
import { FONT, MONO, useTone } from "../../../styles/cyberhud-dual";

// 通用 HUD 基元：等宽标签 / 数据条 / 刻度尺 / 扫描框 / 声波条 / 滚动 banner / 雷达锁定 / 关机序列。
// 全部 t/from 纯函数，取色走 useTone()，因此自动跟随冷青→警报红。

// 等宽小标签
export const Label: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; color?: string; align?: "left" | "center" | "right"; dim?: number }> = ({ t, from, x, y, text, size = 24, color, align = "left", dim = 1 }) => {
    const P = useTone();
    if (t < from) return null;
    const s = pop(t, from, 14);
    const dx = align === "center" ? "-50%" : align === "right" ? "-100%" : "0";
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(${dx}, ${(1 - s) * 12}px)`, opacity: s * dim, fontFamily: MONO, fontSize: size, color: color ?? P.inkSub, letterSpacing: 2, whiteSpace: "nowrap" }}>
            {text}
        </div>
    );
};

// 数据条：轨道（斜纹）+ 填充（发光）+ 数值。dir 决定生长方向
export const Bar: React.FC<{ t: number; x: number; y: number; w: number; h?: number; p: number; label?: string; value?: string; color?: string; dir?: "r" | "l" | "up"; thick?: boolean }> = ({ t, x, y, w, h = 22, p, label, value, color, dir = "r", thick = false }) => {
    const P = useTone();
    const c = color ?? P.accent;
    const k = Math.max(0, Math.min(1, p));
    const vertical = dir === "up";
    const barH = vertical ? h : h;
    const barW = vertical ? h : w;
    const size = vertical ? { width: barH, height: barW * k } : { width: barW * k, height: barH };
    return (
        <div style={{ position: "absolute", left: x, top: y }}>
            {label ? <div style={{ fontFamily: MONO, fontSize: thick ? 26 : 20, color: P.inkSub, letterSpacing: 2, marginBottom: 6 }}>{label}</div> : null}
            <div
                style={{
                    position: "relative",
                    width: vertical ? barH : w,
                    height: vertical ? h : barH,
                    background: `${P.line}66`,
                    boxShadow: `inset 0 0 0 1.5px ${P.line}`,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: dir === "l" ? "flex-end" : "flex-start",
                    flexDirection: dir === "up" ? "column" : "row",
                }}
            >
                <div
                    style={{
                        ...size,
                        background: c,
                        boxShadow: `0 0 14px ${c}88`,
                        backgroundImage: `repeating-linear-gradient(${vertical || dir === "r" ? "115deg" : "-115deg"}, #0000 0 4px, ${P.bg}44 4px 8px)`,
                    }}
                />
            </div>
            {value ? (
                <div style={{ position: "absolute", right: 0, top: label ? 28 : 0, transform: "translateY(-100%)", fontFamily: MONO, fontSize: thick ? 30 : 22, fontWeight: 700, color: c, letterSpacing: 1, textShadow: `0 0 10px ${c}66`, whiteSpace: "nowrap" }}>{value}</div>
            ) : null}
        </div>
    );
};

// 刻度尺：底部一排长短刻度
export const Ticks: React.FC<{ x: number; y: number; w: number; n?: number; step?: number; h?: number; color?: string }> = ({ x, y, w, n = 24, step = 5, h = 12, color }) => {
    const P = useTone();
    const c = color ?? P.accent;
    return (
        <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "flex-end", gap: w / n - 4 }}>
            {Array.from({ length: n }, (_, i) => (
                <div key={i} style={{ width: 3, height: i % step === 0 ? h : h * 0.5, background: c, opacity: i % step === 0 ? 0.95 : 0.4 }} />
            ))}
        </div>
    );
};

// 扫描框：四角 + 往复扫描线 + 等宽批注
export const ScanBox: React.FC<{ t: number; from: number; x: number; y: number; w: number; h: number; color?: string; note?: string; noteSide?: "r" | "l" }> = ({ t, from, x, y, w, h, color, note, noteSide = "r" }) => {
    const P = useTone();
    const c = color ?? P.accent;
    if (t < from) return null;
    const p = prog(t, from, 12);
    const scan = ((t - from) * 7) % h;
    return (
        <>
            <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: p, boxShadow: `inset 0 0 0 1px ${c}33` }}>
                {[
                    { left: -2, top: -2, br: true, bb: true },
                    { right: -2, top: -2, bl: true, bb: true },
                    { left: -2, bottom: -2, br: true, bt: true },
                    { right: -2, bottom: -2, bl: true, bt: true },
                ].map((k, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: k.left,
                            right: k.right,
                            top: k.top,
                            bottom: k.bottom,
                            width: 26,
                            height: 26,
                            borderLeft: k.bl ? `3px solid ${c}` : undefined,
                            borderRight: k.br ? `3px solid ${c}` : undefined,
                            borderTop: k.bt ? `3px solid ${c}` : undefined,
                            borderBottom: k.bb ? `3px solid ${c}` : undefined,
                        }}
                    />
                ))}
                <div style={{ position: "absolute", left: 4, right: 4, top: scan, height: 2, background: `${c}AA`, boxShadow: `0 0 12px ${c}` }} />
            </div>
            {note ? (
                <div style={{ position: "absolute", left: noteSide === "r" ? x + w + 18 : undefined, right: noteSide === "l" ? 1920 - x + 18 : undefined, top: y - 6, fontFamily: MONO, fontSize: 24, fontWeight: 700, color: c, letterSpacing: 2, opacity: p, whiteSpace: "nowrap" }}>
                    {note}
                </div>
            ) : null}
        </>
    );
};

// 声波条（「噢 ~ 噢~ 噢」）
export const WaveBars: React.FC<{ t: number; x: number; y: number; w: number; h?: number; n?: number; color?: string; boost?: number }> = ({ t, x, y, w, h = 90, n = 44, color, boost = 1 }) => {
    const P = useTone();
    const c = color ?? P.accent;
    const bw = w / n - 4;
    return (
        <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 4, height: h }}>
            {Array.from({ length: n }, (_, i) => {
                const a = Math.abs(Math.sin(t / 7 + i * 0.42)) * Math.abs(Math.sin(t / 23 + i * 0.11));
                const bh = Math.max(4, a * h * boost);
                return <div key={i} style={{ width: bw, height: bh, background: c, opacity: 0.35 + a * 0.65, boxShadow: `0 0 8px ${c}55` }} />;
            })}
        </div>
    );
};

// 横向滚动 banner（重复铺满两遍，无缝）
export const Marquee: React.FC<{ t: number; y: number; text: string; size?: number; speed?: number; color?: string; opacity?: number; reverse?: boolean }> = ({ t, y, text, size = 64, speed = 6, color, opacity = 1, reverse = false }) => {
    const P = useTone();
    const c = color ?? P.ink;
    const unit = text.length * size * 0.9 + 160;
    const off = ((t * speed) % unit) * (reverse ? 1 : -1);
    const items = Array.from({ length: 10 }, (_, i) => i);
    return (
        <div style={{ position: "absolute", left: 0, right: 0, top: y, height: size * 1.5, overflow: "hidden", opacity, display: "flex", alignItems: "center", whiteSpace: "nowrap", transform: `translateX(${off}px)` }}>
            {items.map((i) => (
                <span key={i} style={{ fontFamily: FONT, fontSize: size, fontWeight: 700, letterSpacing: 8, color: c, padding: "0 80px" }}>
                    {text}
                </span>
            ))}
        </div>
    );
};

// 雷达锁定框：四角内收 + 中心十字 + 目标标签
export const TargetLock: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; label?: string; color?: string }> = ({ t, from, x, y, w = 220, h = 300, label, color }) => {
    const P = useTone();
    const c = color ?? P.accent;
    if (t < from) return null;
    const p = prog(t, from, 10);
    const lock = 0.4 + 0.6 * p;
    const pulse = hit(t, from, 20);
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `translate(-50%, -50%)`, opacity: p }}>
            {[
                { left: 0, top: 0, br: true, bb: true },
                { right: 0, top: 0, bl: true, bb: true },
                { left: 0, bottom: 0, br: true, bt: true },
                { right: 0, bottom: 0, bl: true, bt: true },
            ].map((k, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: k.left,
                        right: k.right,
                        top: k.top,
                        bottom: k.bottom,
                        width: w * 0.28 * lock,
                        height: h * 0.2 * lock,
                        borderLeft: k.bl ? `3px solid ${c}` : undefined,
                        borderRight: k.br ? `3px solid ${c}` : undefined,
                        borderTop: k.bt ? `3px solid ${c}` : undefined,
                        borderBottom: k.bb ? `3px solid ${c}` : undefined,
                        boxShadow: `0 0 16px ${c}${pulse > 0.2 ? "AA" : "33"}`,
                    }}
                />
            ))}
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 1, height: 26, background: c, transform: "translate(-50%,-50%)" }} />
            <div style={{ position: "absolute", left: "50%", top: "50%", width: 26, height: 1, background: c, transform: "translate(-50%,-50%)" }} />
            {label ? (
                <div style={{ position: "absolute", left: 0, top: -34, fontFamily: MONO, fontSize: 22, fontWeight: 700, color: c, letterSpacing: 2, whiteSpace: "nowrap", textShadow: `0 0 10px ${c}77` }}>{label}</div>
            ) : null}
        </div>
    );
};

// 时间窗：在 [from, to] 内显示，两端各 12 帧淡入淡出（一幕内多层内容轮换用）
export const Fade: React.FC<{ t: number; from: number; to?: number; children: React.ReactNode }> = ({ t, from, to = Infinity, children }) => {
    if (t < from - 1 || t > to + 12) return null;
    const inn = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 12);
    return <div style={{ position: "absolute", inset: 0, opacity: inn * (1 - out) }}>{children}</div>;
};

// 关机/故障序列：逐行打出状态文字，最后打上结果
export const Shutdown: React.FC<{ t: number; from: number; x: number; y: number; lines: string[]; color?: string; lineH?: number; size?: number }> = ({ t, from, x, y, lines, color, lineH = 40, size = 26 }) => {
    const P = useTone();
    const c = color ?? P.inkSub;
    return (
        <div style={{ position: "absolute", left: x, top: y, fontFamily: MONO, fontSize: size, color: c, letterSpacing: 2, lineHeight: `${lineH}px` }}>
            {lines.map((l, i) => {
                const on = t >= from + i * 6;
                if (!on) return null;
                return (
                    <div key={i} style={{ opacity: pop(t, from + i * 6, 14) }}>
                        <span style={{ color: P.accent }}>&gt; </span>
                        {l}
                    </div>
                );
            })}
        </div>
    );
};
