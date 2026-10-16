import React from "react";
import { DrawPath, pop, prog, useAt, useBeat, useT } from "../../shared";
import { DECOR, P } from "./theme";

// 绘本科画 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：手绘抖动 + 蜡笔涂色块 + 墨蓝描边字。

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

// 手绘椭圆路径（带轻微抖动，供蜡笔圈注用）
export const wobbleEllipse = (cx: number, cy: number, rx: number, ry: number, n = 26, amp = 5) => {
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2;
        const r = 1 + (Math.sin(i * 3.7) * amp) / 100;
        pts.push(`${i === 0 ? "M" : "L"}${(cx + Math.cos(a) * rx * r).toFixed(1)} ${(cy + Math.sin(a) * ry * r).toFixed(1)}`);
    }
    return pts.join(" ");
};

// 手绘波浪线路径（供蜡笔下划线用）
export const wavyLine = (x1: number, x2: number, y: number, amp = 8, waves = 6) => {
    const pts: string[] = [`M${x1.toFixed(1)} ${y.toFixed(1)}`];
    const step = (x2 - x1) / (waves * 2);
    for (let i = 0; i < waves * 2; i++) {
        const x = x1 + step * (i + 1);
        const yy = y + (i % 2 === 0 ? amp : -amp) * (0.7 + 0.3 * Math.sin(i * 2.3));
        pts.push(`L${x.toFixed(1)} ${yy.toFixed(1)}`);
    }
    return pts.join(" ");
};

// 蜡笔纹理覆盖层（淡笔触条纹）
export const crayonTexture = (bg: string): React.CSSProperties => ({
    backgroundImage: `repeating-linear-gradient(100deg, transparent 0 9px, ${bg}66 9px 12px)`,
});

// 舞台：手持微抖 + 呼吸缩放
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.sin(t / 7) * 1.6}px, ${Math.cos(t / 9) * 1.2}px) rotate(${Math.sin(t / 11) * 0.04}deg) scale(${1 + 0.004 * Math.sin(t / 60)})` }}>{children}</div>
);

// 字幕：手绘气泡条——蜡笔圆点 + 墨蓝手写体
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 10) return null;
    const s = pop(t, from, 12);
    const out = to === Infinity ? 0 : prog(t, to, 10);
    return (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: Math.min(1, s * 1.2) * (1 - out), transform: `translateY(${(1 - s) * 20}px) rotate(-0.6deg)` }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16, background: P.card, border: `3px solid ${P.ink}`, borderRadius: "20px 16px 22px 18px", padding: "12px 30px 12px 22px", boxShadow: `4px 4px 0 ${P.line}` }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "20px 16px 22px 18px", ...crayonTexture(P.bg), opacity: 0.5, pointerEvents: "none" }} />
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: P.gold, border: `3px solid ${P.ink}` }} />
                <div style={{ fontFamily: DECOR, fontSize: 36, fontWeight: 700, color, letterSpacing: 1 }}>{children}</div>
            </div>
        </div>
    );
};

// 章节：页码牌——圆角小卡 + 蜡笔编号 + 标题下蜡笔色条生长
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = pop(t, 2, 12);
    const u = prog(t, 6, 14);
    return (
        <div style={{ position: "absolute", left: 96, top: 60, display: "flex", alignItems: "center", gap: 18, opacity: Math.min(1, s * 1.2), transform: `translateY(${(1 - s) * -16}px) rotate(-0.6deg)` }}>
            <div style={{ position: "relative", width: 68, height: 68, borderRadius: "14px 18px 16px 20px", background: color, border: `3px solid ${P.ink}`, boxShadow: `3px 3px 0 ${P.ink}33`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "14px 18px 16px 20px", ...crayonTexture(P.bg), pointerEvents: "none" }} />
                <div style={{ fontFamily: DECOR, fontSize: 36, fontWeight: 700, color: "#FFFDF6", position: "relative" }}>{step}</div>
            </div>
            <div>
                <div style={{ fontFamily: DECOR, fontSize: 46, fontWeight: 700, color: P.ink }}>{title}</div>
                <div style={{ position: "relative", marginTop: 6, height: 10, width: Math.max(210, title.length * 48) * u, background: color, borderRadius: 6, opacity: 0.9 }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: 6, ...crayonTexture(P.bg), pointerEvents: "none" }} />
                </div>
            </div>
        </div>
    );
};

// 大字：蜡笔色块衬底 + 墨蓝描边纸白字，弹入微旋
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.accent, rot = 0, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 12);
    const blockIn = prog(t, from, 12);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${0.94 + 0.06 * Math.min(1, s * 1.3)})`, opacity: Math.min(1, s * 1.25) }}>
            <div style={{ position: "relative", display: "inline-block", padding: "14px 40px" }}>
                <div style={{ position: "absolute", inset: 0, background: color, borderRadius: "16px 12px 18px 14px", transform: `scaleX(${blockIn})`, transformOrigin: "left center", opacity: 0.92 }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "16px 12px 18px 14px", ...crayonTexture(P.bg), pointerEvents: "none" }} />
                </div>
                <div style={{ position: "relative", fontFamily: DECOR, fontSize: size, fontWeight: 700, color: "#FFFDF6", WebkitTextStroke: `3px ${P.ink}`, letterSpacing: 6, whiteSpace: "nowrap" }}>{children}</div>
            </div>
        </div>
    );
};

// 卡片：手绘相框——不规则圆角 + 墨蓝粗边 + 蜡笔角点
export const Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }> = ({ t: _t = 0, x, y, w, h, appear, lit = 0, rot = 0, float: _float = true, children }) => {
    if (appear <= 0) return null;
    const s = Math.min(1, appear * 1.25);
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `3px solid ${P.ink}`,
                borderRadius: "22px 16px 24px 18px",
                boxShadow: lit > 0.01 ? `7px 7px 0 ${P.accentLight}` : `7px 7px 0 ${P.line}`,
                opacity: s,
                transform: `translateY(${(1 - appear) * 22}px) rotate(${rot}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 26,
            }}
        >
            {[P.accent, P.gold, P.seal].map((c, i) => (
                <div key={i} style={{ position: "absolute", right: 14 + i * 16, top: 12, width: 10, height: 10, borderRadius: "50%", background: c, border: `2px solid ${P.ink}` }} />
            ))}
            {children}
        </div>
    );
};

// 徽章：蜡笔圆章——彩色外圈 + 纸白内圈 + 手写字，弹入微旋
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 124, rot = -7, color = P.accent }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, opacity: Math.min(1, s * 1.2) }}>
            <div style={{ width: size, height: size, borderRadius: "50%", border: `5px solid ${color}`, background: P.card, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `3px 3px 0 ${P.ink}33` }}>
                <div style={{ width: size * 0.74, height: size * 0.74, borderRadius: "50%", border: `3px dashed ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DECOR, fontWeight: 700, color: P.ink, fontSize: text.length > 2 ? size * 0.17 : size * 0.26, textAlign: "center", lineHeight: 1.2, padding: 4 }}>{text.slice(0, 4)}</div>
            </div>
        </div>
    );
};

// 标注：蜡笔双圈（错位手绘椭圆）或手绘波浪下划线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 64, dur = 16, rot = 0, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    if (underline) {
        const p = prog(t, from, dur);
        return (
            <>
                <div style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px`, pointerEvents: "none" }}>
                    <DrawPath t={t} from={from} dur={dur} d={wavyLine(x - (w / 2) * p, x - (w / 2) * p + w * p, y, 7, 7)} stroke={color} width={6} />
                </div>
                {note && t >= from + 6 ? (
                    <div style={{ position: "absolute", left: x - (w / 2) * p, top: y + 18, fontFamily: DECOR, fontSize: 28, color: P.inkSub, opacity: Math.min(1, prog(t, from + 6, 10) * 1.2) }}>{note}</div>
                ) : null}
            </>
        );
    }
    return (
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px`, pointerEvents: "none" }}>
            <DrawPath t={t} from={from} dur={dur} d={wobbleEllipse(x, y, w / 2, h / 2, 26, 5)} stroke={color} width={6} />
            <DrawPath t={t} from={from + 3} dur={dur} d={wobbleEllipse(x + 4, y + 3, w / 2, h / 2, 24, 6)} stroke={color} width={4} style={{ opacity: 0.6 }} />
            {note && t >= from + 8 ? (
                <div style={{ position: "absolute", left: x + w / 2 + 12, top: y - h / 2 - 6, fontFamily: DECOR, fontSize: 34, color, opacity: Math.min(1, pop(t, from + 8, 12) * 1.3) }}>{note}</div>
            ) : null}
        </div>
    );
};
