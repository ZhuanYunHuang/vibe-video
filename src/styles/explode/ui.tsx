import React from "react";
import { DrawPath, elastic, hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, MONO, P } from "./theme";

// 3D 拆解 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：平滑环绕运镜 + 纵深落定 + 引线标注 + 金属字。

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

// 舞台：平滑环绕运镜（缓慢平移 + 轻微俯仰感缩放）
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `translateX(${Math.sin(t / 220) * 12}px) scale(${1.0 + 0.022 * (0.5 + 0.5 * Math.sin(t / 190 + 1))}) rotate(${Math.sin(t / 260) * 0.12}deg)` }}>{children}</div>
);

// 字幕：玻璃字幕条——半透明卡 + 亮边 + 播放标，上滑轻微模糊消散
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 10) return null;
    const s = prog(t, from, 12);
    const out = to === Infinity ? 0 : prog(t, to, 10);
    return (
        <div style={{ position: "absolute", bottom: 84, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s * (1 - out), transform: `translateY(${(1 - s) * 22}px)`, filter: `blur(${(1 - s) * 3}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, background: `${P.card}E6`, border: `1px solid ${P.line}`, borderLeft: `3px solid ${P.accent}`, borderRadius: 6, padding: "10px 28px", boxShadow: "0 14px 30px #00000066" }}>
                <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: `14px solid ${P.accent}` }} />
                <div style={{ fontFamily: FONT, fontSize: 34, color, letterSpacing: 1 }}>{children}</div>
            </div>
        </div>
    );
};

// 章节：零件编号牌——金属方块 MONO 编号 + 标题 + 两端刻度的标尺线生长
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = prog(t, 2, 12);
    const u = prog(t, 6, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 62, display: "flex", alignItems: "center", gap: 20, opacity: s, transform: `translateX(${(1 - s) * -22}px)` }}>
            <div style={{ width: 68, height: 68, borderRadius: 10, background: "linear-gradient(160deg, #3A404E, #1C2027)", border: `1px solid ${P.line}`, boxShadow: "inset 0 1px 0 #FFFFFF22, 0 8px 18px #00000066", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: MONO, fontSize: 28, color: color, letterSpacing: 1 }}>{step}</div>
            </div>
            <div>
                <div style={{ fontFamily: FONT, fontSize: 42, fontWeight: 700, color: P.ink, letterSpacing: 2 }}>{title}</div>
                <div style={{ position: "relative", marginTop: 10, height: 8, width: Math.max(220, title.length * 44) * u }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 3, height: 2, background: P.line }} />
                    <div style={{ position: "absolute", left: -1, top: 0, width: 2, height: 8, background: P.accentLight }} />
                    <div style={{ position: "absolute", right: -1, top: 0, width: 2, height: 8, background: P.accentLight }} />
                </div>
            </div>
        </div>
    );
};

// 大字：金属字——深层硬影 + 色底衬 + 银色渐变面，抬升落定
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.accentDeep, rot = 0, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 11);
    const base: React.CSSProperties = { fontFamily: FONT, fontSize: size, fontWeight: 900, letterSpacing: 4, whiteSpace: "nowrap" };
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${0.9 + 0.1 * Math.min(1, s * 1.2)})`, opacity: Math.min(1, s * 1.3) }}>
            <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ ...base, position: "absolute", left: 0, top: 9, color: "#07090D" }}>{children}</div>
                <div style={{ ...base, position: "absolute", left: 0, top: 4, color }}>{children}</div>
                <div style={{ ...base, position: "relative", backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, #D7DEE9 42%, ${P.extra?.metal} 72%, #7E8798 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{children}</div>
            </div>
        </div>
    );
};

// 卡片：规格面板——深卡 + 亮边 + 指示灯，纵深落定
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
                background: `linear-gradient(180deg, #2A2F3B, ${P.card})`,
                border: `1px solid ${lit > 0.01 ? P.accentLight : P.line}`,
                borderRadius: 18,
                boxShadow: lit > 0.01 ? `0 24px 50px #000000AA, 0 0 34px ${P.accent}33` : "0 24px 50px #000000AA",
                opacity: s,
                transform: `perspective(1400px) rotateX(${(1 - appear) * 14}deg) scale(${0.94 + 0.06 * s}) rotate(${rot}deg)`,
                transformOrigin: "center bottom",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 26,
            }}
        >
            <div style={{ position: "absolute", left: 16, top: 14, display: "flex", gap: 7 }}>
                {[P.seal, P.gold, P.accent].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}AA` }} />
                ))}
            </div>
            <div style={{ position: "absolute", left: 18, right: 18, top: 8, height: 1, background: "linear-gradient(90deg, transparent, #FFFFFF33, transparent)" }} />
            {children}
        </div>
    );
};

// 徽章：质检章——圆环 + 虚线内圈 + QC PASS，砸入震荡落定
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 124, rot = -8, color = P.accent }) => {
    if (t < from) return null;
    const s = pop(t, from, 9);
    const h = hit(t, from, 6);
    const wob = elastic(t, from + 5, 30, 5) * 4;
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot + wob}deg) scale(${s * (1 + h * 0.08)})`, opacity: Math.min(1, s * 1.25) }}>
            <div style={{ width: size, height: size, borderRadius: "50%", border: `3px solid ${color}`, background: `${P.bg}D9`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 26px ${color}44, inset 0 0 18px ${color}22` }}>
                <div style={{ width: size * 0.74, height: size * 0.74, borderRadius: "50%", border: `1px dashed ${color}AA`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: MONO, color, fontSize: text.length > 2 ? size * 0.16 : size * 0.2, textAlign: "center", lineHeight: 1.25, letterSpacing: 1 }}>
                    <div>{text.slice(0, 3)}</div>
                    <div style={{ fontSize: size * 0.09, opacity: 0.7, marginTop: 3 }}>QC PASS</div>
                </div>
            </div>
        </div>
    );
};

// 标注：引线标注——折线描画 + 端点圆 + 标签框；underline 为两端刻度下划线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 64, dur = 14, rot = 0, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    if (underline) {
        return (
            <>
                <div style={{ position: "absolute", left: x - (w / 2) * p, top: y, width: w * p, height: 2, background: color }} />
                <div style={{ position: "absolute", left: x - (w / 2) * p, top: y - 5, width: 2, height: 12, background: color }} />
                <div style={{ position: "absolute", left: x - (w / 2) * p + w * p - 2, top: y - 5, width: 2, height: 12, background: color }} />
                {note && t >= from + 6 ? (
                    <div style={{ position: "absolute", left: x - (w / 2) * p, top: y + 12, fontFamily: MONO, fontSize: 24, color: P.inkSub, opacity: Math.min(1, prog(t, from + 6, 10) * 1.2) }}>{note}</div>
                ) : null}
            </>
        );
    }
    const sx = x + w / 2 - 30;
    const sy = y - h / 2 + 40;
    const ex = sx + 90;
    const ey = sy - 96;
    return (
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px`, pointerEvents: "none" }}>
            <DrawPath t={t} from={from} dur={dur} d={`M${sx} ${sy} L${ex} ${sy} L${ex} ${ey}`} stroke={color} width={3} />
            {p > 0.1 ? <div style={{ position: "absolute", left: sx - 7, top: sy - 7, width: 14, height: 14, borderRadius: "50%", border: `3px solid ${color}`, background: `${P.bg}99` }} /> : null}
            {note && t >= from + dur - 4 ? (
                <div style={{ position: "absolute", left: ex + 14, top: ey - 20, opacity: Math.min(1, prog(t, from + dur - 4, 8) * 1.3) }}>
                    <div style={{ fontFamily: MONO, fontSize: 26, color: P.ink, background: `${P.card}E6`, border: `1px solid ${P.line}`, borderLeft: `3px solid ${color}`, borderRadius: 4, padding: "6px 14px", whiteSpace: "nowrap", boxShadow: "0 10px 24px #00000088" }}>{note}</div>
                </div>
            ) : null}
        </div>
    );
};
