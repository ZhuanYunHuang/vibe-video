import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, P } from "./theme";

// 扁平 MG UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。

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

// 舞台：持续视差漂移 + 呼吸缩放（活镜头）
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div
        style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${1.02 + 0.015 * Math.sin(t / 240)}) translate(${Math.sin(t / 320) * 8}px, ${Math.cos(t / 300) * 6}px)`,
        }}
    >
        {children}
    </div>
);

// 字幕：白色胶囊 + 柔和长投影，弹性入场
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div style={{ position: "absolute", bottom: 78, left: 0, right: 0, textAlign: "center", opacity: s * (1 - out), transform: `translateY(${(1 - s) * 30}px)` }}>
            <span style={{ display: "inline-block", background: P.card, borderRadius: 999, padding: "12px 44px", fontFamily: FONT, fontSize: 36, fontWeight: 800, color, boxShadow: "0 12px 34px #1F293726" }}>{children}</span>
        </div>
    );
};

// 章节：实色圆角编号胶囊 + 粗体标题 + 弹性展开的下划线
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 56, display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `translateX(${(1 - s) * -40}px)` }}>
            <div
                style={{
                    minWidth: 76,
                    height: 76,
                    padding: "0 16px",
                    background: color,
                    borderRadius: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                    fontSize: step.length > 1 ? 26 : 34,
                    fontWeight: 900,
                    fontFamily: FONT,
                    boxShadow: `0 10px 26px ${color}55`,
                }}
            >
                {step}
            </div>
            <div>
                <div style={{ fontFamily: FONT, fontSize: 50, fontWeight: 900, color: P.ink, letterSpacing: 2 }}>{title}</div>
                <div style={{ marginTop: 8, height: 10, width: Math.max(220, title.length * 54) * u, background: color, borderRadius: 6, opacity: 0.85 }} />
            </div>
        </div>
    );
};

// 大字：粗体弹性砸入 + 落地压扁（squash & stretch）
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 76, color = P.ink, rot = 0, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 9);
    const h = hit(t, from, 5);
    const k = 1.6 - 0.6 * s;
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${k * (1 + h * 0.09)}, ${k * (1 - h * 0.12)})`,
                opacity: Math.min(1, s * 1.2),
                fontFamily: FONT,
                fontSize: size,
                fontWeight: 900,
                color,
                whiteSpace: "nowrap",
                letterSpacing: 2,
            }}
        >
            {children}
        </div>
    );
};

// 卡片：大圆角 + 柔和长投影 + 弹性 pop + 常驻浮动（传 t 才浮动）
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t = 0, x, y, w, h, appear, lit = 0, rot = 0, float = true, children }) => {
    const bob = appear > 0.9 && float ? Math.sin(t / 30 + (x + y) / 90) * 4 : 0;
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                borderRadius: 28,
                boxShadow: lit > 0.01 ? `0 18px 46px #1F29371F, 0 0 44px ${P.accent}40` : "0 18px 46px #1F29371F",
                opacity: appear,
                transform: `translateY(${(1 - appear) * 48 + bob}px) rotate(${rot}deg) scale(${0.88 + 0.12 * appear})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 26,
            }}
        >
            {children}
        </div>
    );
};

// 徽章：实色圆形贴纸，旋转小角度砸入
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 104, rot = -8, color = P.seal }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: size,
                height: size,
                transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * -22}deg) scale(${s * (1 + h * 0.15)})`,
                opacity: Math.min(1, s * 1.2),
                background: color,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 12px 30px ${color}66`,
            }}
        >
            <div style={{ fontFamily: FONT, fontWeight: 900, color: "#FFFFFF", fontSize: text.length > 2 ? size * 0.24 : size * 0.4, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 }}>
                {text.split("").map((ch, i) => (
                    <span key={i}>{ch}</span>
                ))}
            </div>
        </div>
    );
};

// 标注：荧光笔高亮块（scaleX 扫过、正片叠底）或圆角下划线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 64, dur = 12, rot = -1, underline = false, note, color = P.accentLight }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    return (
        <>
            {underline ? (
                <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: 14, background: P.accent, borderRadius: 7, transform: `rotate(${rot}deg) scaleX(${p})`, transformOrigin: "left center", opacity: 0.9 }} />
            ) : (
                <div
                    style={{
                        position: "absolute",
                        left: x - w / 2,
                        top: y - h / 2,
                        width: w,
                        height: h,
                        background: color,
                        borderRadius: 14,
                        transform: `rotate(${rot}deg) scaleX(${p})`,
                        transformOrigin: "left center",
                        mixBlendMode: "multiply",
                        opacity: 0.75,
                    }}
                />
            )}
            {note && t >= from + 4 ? (
                <div
                    style={{
                        position: "absolute",
                        left: x + w / 2 + 18,
                        top: y - 24,
                        fontFamily: FONT,
                        fontSize: 30,
                        fontWeight: 900,
                        color: P.accent,
                        transform: `rotate(-3deg) scale(${pop(t, from + 4, 10)})`,
                        opacity: Math.min(1, pop(t, from + 4, 10) * 1.3),
                        whiteSpace: "nowrap",
                    }}
                >
                    {note}
                </div>
            ) : null}
        </>
    );
};
