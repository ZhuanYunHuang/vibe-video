import React from "react";
import { prog, useAt, useBeat, useT } from "../../shared";
import { DECOR, FONT, MONO, P } from "./theme";

// 数学可视化 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：克制淡入 + 逐项浮现 + 极细几何线条，不弹跳、不抖动。

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

// 舞台：近乎静止，仅极轻微呼吸
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1.002 + 0.002 * Math.sin(t / 150)})` }}>{children}</div>
);

// 字幕：译者注式——左侧细竖线 + 文本，淡入上浮
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 10) return null;
    const s = prog(t, from, 12);
    const out = to === Infinity ? 0 : prog(t, to, 10);
    return (
        <div style={{ position: "absolute", bottom: 78, left: 0, right: 0, display: "flex", alignItems: "stretch", justifyContent: "center", gap: 16, opacity: s * (1 - out), transform: `translateY(${(1 - s) * 16}px)` }}>
            <div style={{ width: 3, background: P.accent, opacity: 0.9 }} />
            <div style={{ fontFamily: FONT, fontSize: 34, color, letterSpacing: 1, lineHeight: 1.4 }}>{children}</div>
        </div>
    );
};

// 章节：MONO 小节号 + 衬线标题 + 下划细线生长
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = prog(t, 2, 14);
    const u = prog(t, 8, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 64, display: "flex", alignItems: "baseline", gap: 20, opacity: s, transform: `translateY(${(1 - s) * -12}px)` }}>
            <div style={{ fontFamily: MONO, fontSize: 28, color, letterSpacing: 2 }}>{step}</div>
            <div>
                <div style={{ fontFamily: DECOR, fontSize: 44, color: P.ink, letterSpacing: 2 }}>{title}</div>
                <div style={{ height: 2, width: Math.max(220, title.length * 44) * u, background: P.line, marginTop: 10 }} />
            </div>
        </div>
    );
};

// 大字：公式字逐项浮现 + 底部基准线生长
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot = 0, children }) => {
    if (t < from) return null;
    const line = prog(t, from, 16);
    const chars = typeof children === "string" ? Array.from(children) : null;
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)` }}>
            <div style={{ position: "relative", display: "inline-block", fontFamily: DECOR, fontSize: size, color, letterSpacing: 6, whiteSpace: "nowrap" }}>
                {chars
                    ? chars.map((ch, i) => {
                          const s = prog(t, from + i * 2, 10);
                          return (
                              <span key={i} style={{ display: "inline-block", opacity: s, transform: `translateY(${(1 - s) * 20}px)` }}>
                                  {ch}
                              </span>
                          );
                      })
                    : children}
            </div>
            <div style={{ height: 3, width: `${line * 100}%`, background: P.accent, marginTop: 14, borderRadius: 2 }} />
        </div>
    );
};

// 卡片：引理框——细边 + 左侧青蓝竖条，淡入轻上浮
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t: _t = 0, x, y, w, h, appear, lit = 0, rot = 0, float: _float = true, children }) => {
    if (appear <= 0) return null;
    const s = Math.min(1, appear * 1.2);
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `1px solid ${lit > 0.01 ? P.accent : P.line}`,
                borderRadius: 6,
                boxShadow: lit > 0.01 ? `0 0 34px ${P.accent}2E` : "none",
                opacity: s,
                transform: `translateY(${(1 - appear) * 18}px) scale(${0.97 + 0.03 * s}) rotate(${rot}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: P.accent, borderRadius: "6px 0 0 6px" }} />
            {children}
        </div>
    );
};

// 徽章：结论章——细环 + 中心符号（∴ / QED）
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 124, rot = -4, color = P.accent }) => {
    if (t < from) return null;
    const s = prog(t, from, 14);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${0.9 + 0.1 * s})`, opacity: s }}>
            <div style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", background: `${P.bg}CC` }}>
                <div style={{ fontFamily: DECOR, fontSize: text.length > 2 ? size * 0.18 : size * 0.3, color, textAlign: "center", lineHeight: 1.2, padding: 6 }}>{text.slice(0, 4)}</div>
            </div>
        </div>
    );
};

// 标注：几何括号渐进画出（四角细线）+ MONO 注记；underline 为带端点的尺寸下划线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 64, dur = 14, rot = 0, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    if (underline) {
        return (
            <>
                <div style={{ position: "absolute", left: x - (w / 2) * p, top: y, width: w * p, height: 3, background: color }} />
                <div style={{ position: "absolute", left: x - (w / 2) * p, top: y - 5, width: 3, height: 13, background: color }} />
                <div style={{ position: "absolute", left: x - (w / 2) * p + w * p - 3, top: y - 5, width: 3, height: 13, background: color }} />
                {note && t >= from + 6 ? (
                    <div style={{ position: "absolute", left: x - (w / 2) * p, top: y + 14, fontFamily: MONO, fontSize: 24, color: P.inkSub, opacity: Math.min(1, prog(t, from + 6, 10) * 1.2) }}>{note}</div>
                ) : null}
            </>
        );
    }
    const L = 38 * p;
    const bx = x - w / 2;
    const by = y - h / 2;
    const ex = x + w / 2;
    const ey = y + h / 2;
    const seg: React.CSSProperties = { position: "absolute", background: color, opacity: 0.95 };
    return (
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px`, pointerEvents: "none" }}>
            {/* 左上 */}
            <div style={{ ...seg, left: bx, top: by, width: L, height: 2 }} />
            <div style={{ ...seg, left: bx, top: by, width: 2, height: L }} />
            {/* 右上 */}
            <div style={{ ...seg, left: ex - L, top: by, width: L, height: 2 }} />
            <div style={{ ...seg, left: ex, top: by, width: 2, height: L }} />
            {/* 左下 */}
            <div style={{ ...seg, left: bx, top: ey, width: L, height: 2 }} />
            <div style={{ ...seg, left: bx, top: ey - L, width: 2, height: L }} />
            {/* 右下 */}
            <div style={{ ...seg, left: ex - L, top: ey, width: L, height: 2 }} />
            <div style={{ ...seg, left: ex, top: ey - L, width: 2, height: L }} />
            {note && t >= from + 6 ? (
                <div style={{ position: "absolute", left: ex + 24, top: y - 20, fontFamily: MONO, fontSize: 26, color: P.gold, opacity: Math.min(1, prog(t, from + 6, 10) * 1.2), whiteSpace: "nowrap" }}>{note}</div>
            ) : null}
        </div>
    );
};
