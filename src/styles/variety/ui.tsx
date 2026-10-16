import React from "react";
import { pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, P } from "./theme";

// 综艺花字 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：逐字弹跳 + 粗描边 + 硬投影 + 常驻微抖倾斜。

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

// 逐字弹跳渲染：每字独立 pop + 落地压扁 + 微旋转归位
export const bounceChars = (t: number, from: number, children: React.ReactNode, step = 3) => {
    if (typeof children !== "string") return children;
    return Array.from(children).map((ch, i) => {
        const at = from + i * step;
        const s = t < at ? 0 : pop(t, at, 12);
        return (
            <span key={i} style={{ display: "inline-block", opacity: Math.min(1, s * 1.5), transform: `translateY(${(1 - s) * 36}px) scale(${0.6 + 0.4 * Math.min(1, s)}, ${1.25 - 0.25 * Math.min(1, s)}) rotate(${(1 - s) * (i % 2 === 0 ? -7 : 7)}deg)` }}>
                {ch}
            </span>
        );
    });
};

// 舞台：高能喧闹——持续弹跳 + 微旋
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${Math.sin(t / 9) * 2.6 + Math.sin(t / 5.3) * 0.9}px) rotate(${Math.sin(t / 13) * 0.07}deg) scale(${1.003 + 0.003 * Math.sin(t / 7)})` }}>{children}</div>
);

// 字幕：花字字幕条——金色光晕 + 白粗字深描边 + 逐字弹跳 + 底部色条
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const out = to === Infinity ? 0 : prog(t, to, 8);
    const bounce = Math.sin(t / 4) * 1.6;
    const textStyle: React.CSSProperties = { fontFamily: FONT, fontSize: 42, fontWeight: 900, letterSpacing: 2, whiteSpace: "nowrap" };
    return (
        <div style={{ position: "absolute", bottom: 76, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: 1 - out, transform: `translateY(${bounce}px) rotate(-1.6deg)` }}>
            <div style={{ position: "relative", padding: "8px 28px 14px" }}>
                <div style={{ position: "absolute", left: 10, right: 10, bottom: 0, height: 18, background: P.gold, borderRadius: 4, transform: "rotate(-0.6deg)" }} />
                <div style={{ position: "absolute", left: 10, right: 10, bottom: 0, height: 18, background: P.accent, borderRadius: 4, transform: "rotate(0.8deg)", opacity: 0.55 }} />
                <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, ...textStyle, color: "transparent", WebkitTextStroke: `6px ${P.gold}` }}>{bounceChars(t, from, children, 2)}</div>
                    <div style={{ position: "relative", ...textStyle, color, WebkitTextStroke: `2px ${P.bg}`, textShadow: `0 4px 0 ${P.bg}77` }}>{bounceChars(t, from, children, 2)}</div>
                </div>
            </div>
        </div>
    );
};

// 章节：节目环节牌——斜切色块编号 + 标题 + 彩点串生长
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 14);
    const dots = [P.accent, P.gold, P.seal, P.extra?.blue ?? P.accent, P.extra?.green ?? P.accent, P.accent, P.gold, P.seal];
    return (
        <div style={{ position: "absolute", left: 96, top: 58, display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, s * 1.3), transform: `translateX(${(1 - s) * -28}px) rotate(-2deg)` }}>
            <div style={{ transform: "skewX(-10deg)", background: color, border: `3px solid ${P.bg}`, boxShadow: `4px 4px 0 ${P.bg}88`, padding: "4px 22px" }}>
                <div style={{ transform: "skewX(10deg)", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: P.bg }}>{step}</div>
            </div>
            <div>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: P.ink, textShadow: `3px 3px 0 ${P.seal}AA`, letterSpacing: 2 }}>{title}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    {dots.map((c, i) => (
                        <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: c, transform: `scale(${i / dots.length <= u ? 1 : 0.4})`, opacity: i / dots.length <= u ? 1 : 0.2 }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 大字：超大花字——金色光晕 + 白字深描边 + 硬投影 + 逐字弹跳 + 偶发抖动
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot = 0, children }) => {
    if (t < from) return null;
    const jitter = Math.sin(t / 3.1) * 2.4;
    const thick = Math.max(6, Math.round(size * 0.15));
    const mid = Math.max(3, Math.round(size * 0.06));
    const textStyle: React.CSSProperties = { fontFamily: FONT, fontSize: size, fontWeight: 900, letterSpacing: 4, whiteSpace: "nowrap" };
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)` }}>
            <div style={{ position: "relative", display: "inline-block", transform: `translateX(${jitter}px)` }}>
                <div style={{ position: "absolute", inset: 0, ...textStyle, color: "transparent", WebkitTextStroke: `${thick}px ${P.gold}` }}>{bounceChars(t, from, children, 3)}</div>
                <div style={{ position: "relative", ...textStyle, color, WebkitTextStroke: `${mid}px ${P.bg}`, textShadow: `0 ${Math.round(size * 0.08)}px 0 ${P.bg}88` }}>{bounceChars(t, from, children, 3)}</div>
            </div>
        </div>
    );
};

// 卡片：贴纸卡——深卡面 + 白粗边 + 硬投影 + 弹入
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t: _t = 0, x, y, w, h, appear, lit = 0, rot = 0, float: _float = true, children }) => {
    if (appear <= 0) return null;
    const s = Math.min(1, appear * 1.3);
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `5px solid ${lit > 0.01 ? P.accent : "#FFFFFF"}`,
                borderRadius: 18,
                boxShadow: lit > 0.01 ? `10px 10px 0 ${P.bg}CC, 0 0 42px ${P.accent}55` : `10px 10px 0 ${P.bg}CC`,
                opacity: s,
                transform: `translateY(${(1 - appear) * 30}px) scale(${0.86 + 0.14 * s}) rotate(${rot + (1 - s) * 3}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 26,
            }}
        >
            <div style={{ position: "absolute", left: 16, top: -2, width: 56, height: 12, background: P.bg, borderRadius: 3, transform: "rotate(-2deg)" }} />
            <div style={{ position: "absolute", right: 20, top: -2, width: 34, height: 12, background: P.bg, borderRadius: 3, transform: "rotate(1.5deg)" }} />
            {children}
        </div>
    );
};

// 徽章：星形贴纸章——金色爆星衬底 + 圆形贴纸 + 弹入旋转
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 124, rot = -8, color = P.seal }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const spin = (1 - Math.min(1, s)) * 40;
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, s * 1.3) }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: size * 1.5, height: size * 1.5, transform: `translate(-16.7%, -16.7%) rotate(${12 + spin}deg)`, background: P.gold, clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
            <div style={{ position: "relative", width: size, height: size, borderRadius: "50%", background: color, border: `5px solid #FFFFFF`, boxShadow: `0 6px 0 ${P.bg}AA`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, color: "#FFFFFF", fontSize: text.length > 2 ? size * 0.2 : size * 0.28, textAlign: "center", lineHeight: 1.15, padding: 4 }}>{text.slice(0, 3)}</div>
            </div>
        </div>
    );
};

// 标注：高饱和彩条高亮（scaleX 扫过）或双色波浪划线；note 为斜贴纸
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 64, dur = 12, rot = -1.5, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    if (underline) {
        return (
            <>
                <div style={{ position: "absolute", left: x - (w / 2) * p, top: y, width: w * p, height: 10, background: P.seal, borderRadius: 6, transform: "rotate(-0.8deg)" }} />
                <div style={{ position: "absolute", left: x - (w / 2) * p, top: y + 5, width: w * p, height: 8, background: color, borderRadius: 6, transform: "rotate(0.8deg)", opacity: 0.9 }} />
                {note && t >= from + 5 ? (
                    <div style={{ position: "absolute", left: x - (w / 2) * p, top: y + 22, fontFamily: FONT, fontWeight: 900, fontSize: 26, color: P.accentLight, opacity: Math.min(1, pop(t, from + 5, 12) * 1.3) }}>{note}</div>
                ) : null}
            </>
        );
    }
    return (
        <>
            <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, background: color, borderRadius: 10, transform: `rotate(${rot}deg) scaleX(${p})`, transformOrigin: "left center", opacity: 0.9 }} />
            {note && t >= from + 5 ? (
                <div style={{ position: "absolute", left: x + w / 2 + 26, top: y - 30, transform: `rotate(5deg) scale(${Math.min(1, pop(t, from + 5, 11) * 1.2)})`, opacity: Math.min(1, pop(t, from + 5, 11) * 1.3) }}>
                    <div style={{ position: "relative", background: P.seal, border: `3px solid #FFFFFF`, borderRadius: 12, boxShadow: `4px 4px 0 ${P.bg}AA`, padding: "4px 16px", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#FFFFFF", whiteSpace: "nowrap" }}>{note}</div>
                </div>
            ) : null}
        </>
    );
};
