import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, P } from "./theme";

// 像素风 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：低分辨率帧步进（每 2 帧才更新一次位移）+ 硬边 + 实心像素投影 + RGB 分离。

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

// 舞台：离散步进位移，制造 8-bit 卡帧感（避免平滑运镜）
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
    const tt = Math.floor(t / 2) * 2;
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                transform: `translate(${Math.round(Math.sin(tt / 26) * 3)}px, ${Math.round(Math.cos(tt / 22) * 2)}px)`,
            }}
        >
            {children}
        </div>
    );
};

// 字幕：像素对话框（硬边 + 实心投影）
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div style={{ position: "absolute", bottom: 76, left: 0, right: 0, textAlign: "center", opacity: s * (1 - out), transform: `translateY(${Math.round((1 - s) * 26)}px)` }}>
            <span style={{ display: "inline-block", background: P.card, border: `4px solid ${P.ink}`, padding: "12px 40px", fontFamily: FONT, fontSize: 36, color, boxShadow: `8px 8px 0 #00000066` }}>{children}</span>
        </div>
    );
};

// 章节：像素徽章块 + 标题 + 分段方块下划线（逐段点亮）
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 16);
    const segs = 14;
    const filled = Math.round(u * segs);
    return (
        <div style={{ position: "absolute", left: 96, top: 60, display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `translateX(${Math.round((1 - s) * -40)}px)` }}>
            <div
                style={{
                    minWidth: 72,
                    height: 72,
                    padding: "0 14px",
                    background: P.card,
                    border: `4px solid ${color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontSize: step.length > 1 ? 24 : 36,
                    fontWeight: 700,
                    fontFamily: FONT,
                    boxShadow: `6px 6px 0 #00000066`,
                }}
            >
                {step}
            </div>
            <div>
                <div style={{ fontFamily: FONT, fontSize: 48, fontWeight: 700, color: P.ink, letterSpacing: 3 }}>{title}</div>
                <div style={{ display: "flex", gap: 5, marginTop: 10 }}>
                    {Array.from({ length: segs }, (_, i) => (
                        <div key={i} style={{ width: 18, height: 10, background: i < filled ? color : P.line }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 大字：像素弹入（卡帧放大）+ RGB 分离抖动
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot: _rot = 0, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    const scale = Math.round((3.2 - 2.2 * s) * (1 + h * 0.1) * 100) / 100;
    const split = Math.round(h * 6);
    return (
        <div
            style={{
                position: "absolute",
                left: Math.round(x),
                top: Math.round(y),
                transform: `translate(-50%, -50%) scale(${scale})`,
                fontFamily: FONT,
                fontSize: size,
                fontWeight: 700,
                color,
                whiteSpace: "nowrap",
                letterSpacing: 2,
                textShadow: split > 0 ? `${split}px 0 0 #FF005599, ${-split}px 0 0 #00E5FF99` : "4px 4px 0 #00000088",
                opacity: Math.min(1, s * 1.2),
            }}
        >
            {children}
        </div>
    );
};

// 卡片：硬边面板 + 实心像素投影 + 上扫逐行填充入场 + 离散步进浮动
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t = 0, x, y, w, h, appear, lit = 0, rot: _rot = 0, float = true, children }) => {
    if (appear <= 0) return null;
    const tt = Math.floor(t / 2) * 2;
    const bob = appear > 0.9 && float ? Math.round(Math.sin(tt / 24 + (x + y) / 80) * 3) : 0;
    const reveal = Math.min(1, appear * 1.2);
    return (
        <div
            style={{
                position: "absolute",
                left: Math.round(x - w / 2),
                top: Math.round(y - h / 2),
                width: w,
                height: h,
                transform: `translateY(${Math.round((1 - appear) * 30 + bob)}px)`,
                clipPath: `inset(0 0 ${Math.round((1 - reveal) * 100)}% 0)`,
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: P.card,
                    border: `4px solid ${P.ink}`,
                    boxShadow: lit > 0.01 ? `10px 10px 0 #00000066, 0 0 34px ${P.accent}66` : "10px 10px 0 #00000066",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 24,
                }}
            >
                {children}
            </div>
        </div>
    );
};

// 徽章：方形像素章（双描边）
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 112, rot = -4, color = P.seal }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    const scale = Math.round(s * (1 + h * 0.15) * 100) / 100;
    return (
        <div
            style={{
                position: "absolute",
                left: Math.round(x),
                top: Math.round(y),
                width: size,
                height: size,
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`,
                opacity: Math.min(1, s * 1.25),
                background: color,
                border: `4px solid ${P.bg}`,
                outline: `4px solid ${color}`,
                boxShadow: "8px 8px 0 #00000066",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ fontFamily: FONT, fontWeight: 700, color: "#FFFFFF", fontSize: text.length > 2 ? size * 0.24 : size * 0.4, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.15 }}>
                {text.split("").map((ch, i) => (
                    <span key={i}>{ch}</span>
                ))}
            </div>
        </div>
    );
};

// 标注：闪烁虚线选中框（画完后闪烁）或分段方块下划线，可带像素箭头批注
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 90, dur = 12, rot = 0, underline = false, note, color = P.gold }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    const blinkOn = Math.floor(t / 8) % 2 === 0;
    const blink = t >= from + dur + 2 ? blinkOn : true;
    const blocks = Math.max(4, Math.round(w / 20));
    return (
        <>
            {underline ? (
                <div style={{ position: "absolute", left: Math.round(x - w / 2), top: Math.round(y), display: "flex", gap: 6, transform: `rotate(${rot}deg)` }}>
                    {Array.from({ length: blocks }, (_, i) => (
                        <div key={i} style={{ width: 14, height: 12, background: color, opacity: i / blocks < p ? (blink ? 1 : 0.35) : 0 }} />
                    ))}
                </div>
            ) : (
                <div
                    style={{
                        position: "absolute",
                        left: Math.round(x - w / 2),
                        top: Math.round(y - h / 2),
                        width: w,
                        height: h,
                        border: `4px dashed ${color}`,
                        opacity: p * (blink ? 1 : 0.35),
                    }}
                />
            )}
            {note && t >= from + 4 ? (
                <div style={{ position: "absolute", left: Math.round(x + w / 2 + 26), top: Math.round(y - 30), fontFamily: FONT, fontSize: 30, fontWeight: 700, color: P.accentLight, opacity: Math.min(1, pop(t, from + 4, 10) * 1.3), whiteSpace: "nowrap" }}>
                    {note}
                </div>
            ) : null}
        </>
    );
};
