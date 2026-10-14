import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { DECOR, FONT, P } from "./theme";

// 白板手绘 UI 原语：签名与 src/styles/contract.ts 严格一致。
// 除 useK/usePulse 外全部是 t/from 的纯函数，可被封面/展示页冻结渲染。

// 绝对拍号 -> 场景内帧
export const useK = (start: number) => {
    const at = useAt();
    return (beat: number) => at(start, beat - start);
};

// 拍点脉冲（0~1），用于与 BGM 对齐的呼吸
export const usePulse = (start: number) => {
    const beat = useBeat();
    const t = useT();
    return beat.beatPulse(beat.bf(start) + t);
};

// 舞台：整屏极轻的手绘抖动 + 呼吸缩放，保证画面永不静止
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div
        style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${Math.sin(t / 7) * 1.2}px, ${Math.cos(t / 9) * 1}px) rotate(${Math.sin(t / 11) * 0.15}deg) scale(${1.004 + 0.002 * Math.sin(t / 120)})`,
        }}
    >
        {children}
    </div>
);

// 字幕：落笔式轻微抖动入场
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div style={{ position: "absolute", bottom: 84, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontSize: 38, fontWeight: 700, color, opacity: s * (1 - out), transform: `translateY(${(1 - s) * 26}px) rotate(${(1 - s) * 1.2}deg)` }}>
            {children}
        </div>
    );
};

// 章节：贴着胶带的便签 + 手写标题 + 手画下划线
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    return (
        <div style={{ position: "absolute", left: 96, top: 52, display: "flex", alignItems: "center", gap: 22, opacity: s, transform: `translateX(${(1 - s) * -36}px) rotate(${-1.2 + Math.sin(t / 40) * 0.4}deg)`, fontFamily: DECOR }}>
            <div style={{ position: "relative", width: 72, height: 72, background: "#FFF6D6", border: `2px solid ${P.ink}`, borderRadius: "6px 9px 7px 5px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: step.length > 1 ? 24 : 30, fontWeight: 900, color: P.ink, boxShadow: "2px 3px 0 #23272E22" }}>
                <div style={{ position: "absolute", top: -12, left: "50%", width: 40, height: 16, transform: "translateX(-50%) rotate(-3deg)", background: "#E9E4CFAA", border: "1px solid #C9C2A5" }} />
                {step}
            </div>
            <div>
                <div style={{ fontSize: 48, fontWeight: 900, color: P.ink, letterSpacing: 3 }}>{title}</div>
                <svg width={Math.max(240, title.length * 52)} height={16} style={{ display: "block", marginTop: 2 }}>
                    <path d="M4,9 Q60,3 120,8 T236,5 T360,9 T480,6" stroke={color} strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.9} />
                </svg>
            </div>
        </div>
    );
};

// 大字：先描边后填色的两段式（马克笔写完再涂色）
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot = -1.5, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 4);
    const fillA = Math.round(prog(t, from + 3, 8) * 255)
        .toString(16)
        .padStart(2, "0");
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * 5}deg) scale(${(1.5 - 0.5 * s) * (1 + h * 0.06)})`,
                opacity: Math.min(1, s * 1.2),
                fontFamily: DECOR,
                fontSize: size,
                fontWeight: 900,
                color: `${color}${fillA}`,
                WebkitTextStroke: `1.6px ${P.ink}`,
                whiteSpace: "nowrap",
            }}
        >
            {children}
        </div>
    );
};

// 纸卡：不规则圆角 + 手绘描边 + 常驻轻浮动（传 t 才浮动，Still 不传即冻结）
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t = 0, x, y, w, h, appear, lit = 0, rot = 0, float = true, children }) => {
    const bob = appear > 0.9 && float ? Math.sin(t / 30 + (x + y) / 90) * 3.5 : 0;
    const tilt = appear > 0.9 ? Math.sin(t / 44 + (x + y) / 130) * 0.5 : 0;
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `2.5px solid ${P.ink}`,
                borderRadius: "10px 16px 9px 14px / 14px 8px 15px 10px",
                boxShadow: `3px 4px 0 ${P.ink}1A${lit > 0.01 ? `, 0 0 34px ${P.accent}44` : ""}`,
                opacity: appear,
                transform: `translateY(${(1 - appear) * 42 + bob}px) rotate(${rot + tilt}deg) scale(${0.94 + 0.06 * appear})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 22,
            }}
        >
            {children}
        </div>
    );
};

// 手绘圆章：双圈手绘感 + 竖排文字
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 112, rot = -6, color = P.seal }) => {
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
                transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (1 + h * 0.12)})`,
                opacity: Math.min(1, s * 1.25),
                borderRadius: "48% 52% 50% 50% / 51% 49% 52% 48%",
                border: `4px solid ${color}`,
                boxShadow: `inset 0 0 0 2px #FBFBF7, inset 0 0 0 3.5px ${color}88`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div style={{ fontFamily: DECOR, fontWeight: 900, color, fontSize: text.length > 2 ? size * 0.26 : size * 0.42, display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.18 }}>
                {text.split("").map((ch, i) => (
                    <span key={i}>{ch}</span>
                ))}
            </div>
        </div>
    );
};

// 标注：马克笔圈（双圈错位）或波浪划线，带"描画"进度与可选小批注
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 220, h = 90, dur = 12, rot = -3, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    const pw = w + 48;
    const ph = h + 48;
    const cx = pw / 2;
    const cy = ph / 2;
    const rx = w / 2;
    return (
        <div style={{ position: "absolute", left: x - pw / 2, top: y - ph / 2, width: pw, height: ph, transform: `rotate(${rot}deg)`, pointerEvents: "none" }}>
            {underline ? (
                <svg width={pw} height={ph} style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d={`M${cx - rx},${cy + 5} Q${cx - rx / 3},${cy - 7} ${cx},${cy + 4} T${cx + rx},${cy - 3}`} stroke={color} strokeWidth={5} strokeLinecap="round" fill="none" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
                    <path d={`M${cx - rx},${cy + 12} Q${cx + rx / 3},${cy} ${cx + rx},${cy + 7}`} stroke={color} strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.4} pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - Math.max(0, Math.min(1, (t - from - 3) / dur)))} />
                </svg>
            ) : (
                <>
                    <div style={{ position: "absolute", inset: 0, border: `5px solid ${color}`, borderRadius: w > 500 ? 120 : "50%", opacity: p }} />
                    <div style={{ position: "absolute", inset: 0, border: `2px solid ${color}`, borderRadius: w > 500 ? 120 : "50%", transform: "translate(3px, 2px)", opacity: p * 0.45 }} />
                </>
            )}
            {note && t >= from + 4 ? (
                <div style={{ position: "absolute", left: pw - 26, top: -20, fontFamily: DECOR, fontSize: 28, fontWeight: 900, color, transform: `rotate(-5deg) scale(${pop(t, from + 4, 10)})`, opacity: Math.min(1, pop(t, from + 4, 10) * 1.3), whiteSpace: "nowrap" }}>
                    {note}
                </div>
            ) : null}
        </div>
    );
};
