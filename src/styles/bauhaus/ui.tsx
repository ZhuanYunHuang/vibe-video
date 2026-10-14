import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, P } from "./theme";

// Bauhaus UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：构成式入场（几何块/线条生长，沿网格对齐）+ 背景构成缓转。

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

// 舞台：极简（只留呼吸，动态交给构成元素）
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${1.003 + 0.003 * Math.sin(t / 140)}) rotate(${Math.sin(t / 200) * 0.06}deg)` }}>{children}</div>
);

// 字幕：色块引导点 + 文本 + 下划细线
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, opacity: s * (1 - out), transform: `translateY(${(1 - s) * 22}px)` }}>
            <div style={{ width: 18, height: 18, background: P.seal }} />
            <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 800, color, letterSpacing: 2 }}>{children}</div>
            <div style={{ width: 18, height: 18, background: P.accent }} />
        </div>
    );
};

// 章节：圆形编号 + 紧排标题 + 粗黑规则线生长
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 62, display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `translateX(${(1 - s) * -34}px)` }}>
            <div style={{ width: 74, height: 74, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontFamily: FONT, fontSize: step.length > 1 ? 24 : 34, fontWeight: 900 }}>{step}</div>
            <div>
                <div style={{ fontFamily: FONT, fontSize: 50, fontWeight: 900, color: P.ink, letterSpacing: 1 }}>{title}</div>
                <div style={{ height: 12, width: Math.max(200, title.length * 50) * u, background: P.ink, marginTop: 10 }} />
            </div>
        </div>
    );
};

// 大字：色块字（色块从左扫入 + 文字跳出）
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot = 0, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 4);
    const blockIn = prog(t, from, 10);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1 + h * 0.05})`, opacity: Math.min(1, s * 1.2) }}>
            <div style={{ position: "relative", display: "inline-block", padding: "10px 34px" }}>
                <div style={{ position: "absolute", inset: 0, background: color, transform: `scaleX(${blockIn})`, transformOrigin: "left center" }} />
                <div style={{ position: "relative", fontFamily: FONT, fontSize: size, fontWeight: 900, color: P.bg, whiteSpace: "nowrap", letterSpacing: 6 }}>{children}</div>
            </div>
        </div>
    );
};

// 卡片：白卡 + 黑粗边 + 0 圆角 + 角上三原色小方块 + 硬投影
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t: _t = 0, x, y, w, h, appear, lit = 0, rot = 0, float: _float = true, children }) => {
    if (appear <= 0) return null;
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `4px solid ${P.ink}`,
                boxShadow: lit > 0.01 ? `12px 12px 0 ${P.accent}66` : `10px 10px 0 ${P.ink}22`,
                opacity: Math.min(1, appear * 1.3),
                transform: `translateY(${(1 - appear) * 34}px) rotate(${rot}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
            }}
        >
            <div style={{ position: "absolute", right: 12, top: 12, display: "flex", gap: 6 }}>
                <div style={{ width: 14, height: 14, background: P.seal }} />
                <div style={{ width: 14, height: 14, background: P.gold }} />
                <div style={{ width: 14, height: 14, background: P.accent }} />
            </div>
            {children}
        </div>
    );
};

// 徽章：同心圆三色章（外红中黄内蓝）
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 124, rot = -5 }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 5);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (1 + h * 0.12)})`, opacity: Math.min(1, s * 1.2) }}>
            <div style={{ width: size, height: size, borderRadius: "50%", background: P.seal, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: size * 0.78, height: size * 0.78, borderRadius: "50%", background: P.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: size * 0.56, height: size * 0.56, borderRadius: "50%", background: P.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontFamily: FONT, fontWeight: 900, color: "#FFFFFF", fontSize: text.length > 2 ? size * 0.16 : size * 0.22, textAlign: "center", lineHeight: 1.15 }}>{text.slice(0, 3)}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 标注：黄色块高亮（scaleX 扫过）或黑圈描边
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 64, dur = 12, rot = 0, underline = false, note, color = P.gold }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    return (
        <>
            {underline ? (
                <div style={{ position: "absolute", left: x - w / 2, top: y, width: w * p, height: 10, background: P.ink }} />
            ) : (
                <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, background: color, transform: `rotate(${rot}deg) scaleX(${p})`, transformOrigin: "left center", opacity: 0.92 }} />
            )}
            {note && t >= from + 4 ? (
                <div style={{ position: "absolute", left: x + w / 2 + 22, top: y - 26, fontFamily: FONT, fontSize: 30, fontWeight: 900, color: P.seal, opacity: Math.min(1, pop(t, from + 4, 10) * 1.3), whiteSpace: "nowrap" }}>
                    {note}
                </div>
            ) : null}
        </>
    );
};
