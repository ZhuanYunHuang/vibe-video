import React from "react";
import { DrawPath, elastic, pop, prog, useAt, useBeat, useT } from "../../shared";
import { DECOR, P } from "./theme";

// 汉字演变 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：火光呼吸 + 铸刻字（先暗后点火）+ 发光描边 + 火星。

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

// 舞台：火光呼吸——亮度与色温脉动 + 极轻摇曳
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div style={{ position: "absolute", inset: 0, transform: `translate(${Math.sin(t / 13) * 1.3}px, 0) scale(${1.004 + 0.003 * Math.sin(t / 17)})`, filter: `brightness(${0.95 + 0.05 * Math.sin(t / 19)})` }}>{children}</div>
);

// 字幕：铭文条——暖色半透明底 + 回纹角饰 + 楷体字
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 10) return null;
    const s = prog(t, from, 12);
    const out = to === Infinity ? 0 : prog(t, to, 10);
    const corner: React.CSSProperties = { position: "absolute", width: 14, height: 14, borderColor: P.gold, borderStyle: "solid", opacity: 0.8 };
    return (
        <div style={{ position: "absolute", bottom: 80, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s * (1 - out), transform: `translateY(${(1 - s) * 18}px)` }}>
            <div style={{ position: "relative", background: `${P.card}E6`, border: `1px solid ${P.line}`, borderRadius: 4, padding: "10px 40px", boxShadow: `0 0 26px ${P.accent}22` }}>
                <div style={{ ...corner, left: 6, top: 6, borderWidth: "2px 0 0 2px" }} />
                <div style={{ ...corner, right: 6, top: 6, borderWidth: "2px 2px 0 0" }} />
                <div style={{ ...corner, left: 6, bottom: 6, borderWidth: "0 0 2px 2px" }} />
                <div style={{ ...corner, right: 6, bottom: 6, borderWidth: "0 2px 2px 0" }} />
                <div style={{ fontFamily: DECOR, fontSize: 38, color, letterSpacing: 2 }}>{children}</div>
            </div>
        </div>
    );
};

// 章节：器物牌——青铜圆角牌 + 编号 + 标题 + 发光火线生长
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = prog(t, 2, 14);
    const u = prog(t, 6, 16);
    return (
        <div style={{ position: "absolute", left: 96, top: 62, display: "flex", alignItems: "center", gap: 20, opacity: s, transform: `translateY(${(1 - s) * -14}px)` }}>
            <div style={{ position: "relative", width: 74, height: 74, borderRadius: "12px 16px 12px 16px", background: `linear-gradient(160deg, ${P.accentDeep}, #7A2E06)`, border: `2px solid ${P.gold}`, boxShadow: `0 0 24px ${P.accent}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontFamily: DECOR, fontSize: 36, color: P.ink }}>{step}</div>
            </div>
            <div>
                <div style={{ fontFamily: DECOR, fontSize: 48, color: P.ink, letterSpacing: 2, textShadow: `0 0 18px ${P.accent}66` }}>{title}</div>
                <div style={{ height: 2, width: Math.max(220, title.length * 48), background: `linear-gradient(90deg, ${color}, transparent)`, boxShadow: `0 0 10px ${color}`, marginTop: 10, transform: `scaleX(${u})`, transformOrigin: "left center" }} />
            </div>
        </div>
    );
};

// 大字：铸刻字——暖色渐变字面 + 外发光，先暗后点火
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.accent, rot = 0, children }) => {
    if (t < from) return null;
    const lit = prog(t, from, 16);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)`, opacity: 0.2 + 0.8 * lit }}>
            <div
                style={{
                    fontFamily: DECOR,
                    fontSize: size,
                    fontWeight: 700,
                    letterSpacing: 6,
                    whiteSpace: "nowrap",
                    backgroundImage: `linear-gradient(180deg, ${P.extra?.ember} 0%, ${color} 55%, ${P.accentDeep} 100%)`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${P.accentDeep}88`,
                    filter: `brightness(${0.6 + 0.4 * lit}) drop-shadow(0 0 ${Math.round(20 * lit)}px ${P.accent}BB)`,
                }}
            >
                {children}
            </div>
        </div>
    );
};

// 卡片：竹简/木牍——暖棕底 + 编绳横线，自上而下展开
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
                background: `linear-gradient(180deg, #3A2415, ${P.card})`,
                border: `2px solid ${lit > 0.01 ? P.gold : P.line}`,
                borderRadius: 8,
                boxShadow: lit > 0.01 ? `0 0 38px ${P.accent}33, 0 16px 36px #00000077` : "0 16px 36px #00000077",
                clipPath: `inset(0 0 ${(1 - s) * 100}% 0)`,
                transform: `rotate(${rot}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 26,
            }}
        >
            <div style={{ position: "absolute", left: 12, right: 12, top: 22, height: 6, background: "#1E1006", borderRadius: 3, opacity: 0.85 }} />
            <div style={{ position: "absolute", left: 12, right: 12, bottom: 22, height: 6, background: "#1E1006", borderRadius: 3, opacity: 0.85 }} />
            {children}
        </div>
    );
};

// 徽章：朱砂印——圆角方章 + 内框 + 篆体白字，砸入微抖落定
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 124, rot = -5, color = P.seal }) => {
    if (t < from) return null;
    const s = pop(t, from, 9);
    const wob = elastic(t, from + 6, 34, 5) * 5;
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot + wob}deg) scale(${s * 1.02})`, opacity: Math.min(1, s * 1.25) }}>
            <div style={{ width: size, height: size, borderRadius: size * 0.14, background: color, border: `3px solid #8E2418`, boxShadow: `0 0 32px ${color}77`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: size * 0.78, height: size * 0.78, borderRadius: size * 0.09, border: `2px solid #F7E7CE44`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DECOR, fontSize: text.length > 2 ? size * 0.17 : size * 0.28, color: "#F7E7CE", textAlign: "center", lineHeight: 1.15, padding: 4 }}>{text.slice(0, 4)}</div>
            </div>
        </div>
    );
};

// 标注：火舌圈注——双圈发光描画（底衬更亮），或火线下划线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 64, dur = 16, rot = 0, underline = false, note, color = P.accent }) => {
    if (t < from) return null;
    const fire = (d: string, delay: number, width: number, opacity = 1) => (
        <DrawPath t={t} from={from + delay} dur={dur} d={d} stroke={color} width={width} style={{ opacity, filter: `drop-shadow(0 0 10px ${P.accent})` }} />
    );
    const ell = (dx: number, dy: number, amp: number) => {
        const pts: string[] = [];
        for (let i = 0; i <= 26; i++) {
            const a = (i / 26) * Math.PI * 2 - Math.PI / 2;
            const r = 1 + (Math.sin(i * 3.3) * amp) / 100;
            pts.push(`${i === 0 ? "M" : "L"}${(x + dx + Math.cos(a) * (w / 2) * r).toFixed(1)} ${(y + dy + Math.sin(a) * (h / 2) * r).toFixed(1)}`);
        }
        return pts.join(" ");
    };
    return (
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px`, pointerEvents: "none" }}>
            {underline ? fire(`M${x - w / 2} ${y} L${x + w / 2} ${y}`, 0, 6) : <>{fire(ell(0, 0, 4), 0, 6)}{fire(ell(5, 4, 7), 3, 3.5, 0.6)}</>}
            {note && t >= from + 8 ? (
                <div style={{ position: "absolute", left: x + w / 2 + 14, top: y - h / 2 - 8, fontFamily: DECOR, fontSize: 34, color: P.gold, textShadow: `0 0 14px ${P.accent}AA`, opacity: Math.min(1, pop(t, from + 8, 12) * 1.3) }}>{note}</div>
            ) : null}
        </div>
    );
};
