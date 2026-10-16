import React from "react";
import { hit, pop, prog, useAt, useBeat, useT } from "../../shared";
import { FONT, MONO, P } from "./theme";

// 比例尺对比 UI 原语：签名与 src/styles/contract.ts 严格一致；除 useK/usePulse 外均为 t/from 纯函数。
// 招牌：镜头拉远 + 工程图纸框 + 刻度与尺寸标注线。

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

// 舞台：镜头连续拉远（缓入缓出），模拟摄影机后退
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => {
    const p = Math.min(1, t / 260);
    const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    return <div style={{ position: "absolute", inset: 0, transform: `scale(${1.02 - 0.16 * e})` }}>{children}</div>;
};

// 字幕：图注条——左侧 FIG 标签 + 墨蓝文本，滑入
export const Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }> = ({ t, from, to = Infinity, color = P.ink, children }) => {
    if (t < from || t > to + 10) return null;
    const s = prog(t, from, 12);
    const out = to === Infinity ? 0 : prog(t, to, 10);
    return (
        <div style={{ position: "absolute", bottom: 112, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: s * (1 - out), transform: `translateY(${(1 - s) * 18}px)` }}>
            <div style={{ display: "flex", alignItems: "stretch", background: "#FFFFFFE8", border: `1px solid ${P.line}`, borderLeft: `4px solid ${P.accent}` }}>
                <div style={{ display: "flex", alignItems: "center", padding: "0 14px", fontFamily: MONO, fontSize: 20, letterSpacing: 2, color: P.accentDeep, background: P.bgAlt }}>FIG</div>
                <div style={{ padding: "10px 26px", fontFamily: FONT, fontSize: 32, color, letterSpacing: 1 }}>{children}</div>
            </div>
        </div>
    );
};

// 章节：工程图标题栏（编号格 + 标题格）+ 下方尺寸线生长
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.accent }) => {
    const s = prog(t, 2, 12);
    const u = prog(t, 6, 14);
    return (
        <div style={{ position: "absolute", left: 96, top: 60, opacity: s, transform: `translateY(${(1 - s) * -14}px)` }}>
            <div style={{ display: "flex", border: `2px solid ${P.ink}`, background: "#FFFFFF" }}>
                <div style={{ width: 64, height: 64, background: color, color: "#FFFFFF", fontFamily: MONO, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{step}</div>
                <div style={{ display: "flex", alignItems: "center", padding: "0 22px", fontFamily: FONT, fontSize: 38, fontWeight: 700, color: P.ink, letterSpacing: 1 }}>{title}</div>
            </div>
            <div style={{ position: "relative", height: 12, marginTop: 5, width: (Math.max(200, title.length * 44) + 64) * u }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 5, height: 2, background: P.ink }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: 2, height: 12, background: P.ink }} />
                <div style={{ position: "absolute", right: 0, top: 0, width: 2, height: 12, background: P.ink }} />
            </div>
        </div>
    );
};

// 大字：等宽数字主角 + 下方带箭头尺寸线生长
export const Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }> = ({ t, from, x = 960, y = 540, size = 72, color = P.ink, rot = 0, children }) => {
    if (t < from) return null;
    const s = pop(t, from, 12);
    const dim = prog(t, from + 4, 18);
    const w = (typeof children === "string" ? Math.max(320, Array.from(children).length * size * 0.66) : 420) * dim;
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg)`, opacity: Math.min(1, s * 1.25) }}>
            <div style={{ fontFamily: MONO, fontSize: size, fontWeight: 700, color, letterSpacing: 4, whiteSpace: "nowrap", textAlign: "center" }}>{children}</div>
            <div style={{ position: "relative", height: 12, marginTop: 18, width: w, marginLeft: "auto", marginRight: "auto" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 5, height: 3, background: P.gold }} />
                <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: 12, background: P.gold }} />
                <div style={{ position: "absolute", right: 0, top: 0, width: 3, height: 12, background: P.gold }} />
                <div style={{ position: "absolute", left: 2, top: -4, width: 14, height: 14, background: P.gold, clipPath: "polygon(100% 0, 100% 100%, 0 50%)" }} />
                <div style={{ position: "absolute", right: 2, top: -4, width: 14, height: 14, background: P.gold, clipPath: "polygon(0 0, 0 100%, 100% 50%)" }} />
            </div>
        </div>
    );
};

// 卡片：图纸框——细墨边 + 四角十字定位标
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
                border: `2px solid ${P.ink}`,
                boxShadow: lit > 0.01 ? `10px 10px 0 ${P.accentLight}` : `10px 10px 0 ${P.line}`,
                opacity: s,
                transform: `translateY(${(1 - appear) * 20}px) rotate(${rot}deg)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 26,
            }}
        >
            {[[14, 14], [w - 14, 14], [14, h - 14], [w - 14, h - 14]].map(([cx, cy], i) => (
                <React.Fragment key={i}>
                    <div style={{ position: "absolute", left: cx - 8, top: cy - 1, width: 16, height: 2, background: P.accentDeep, opacity: 0.8 }} />
                    <div style={{ position: "absolute", left: cx - 1, top: cy - 8, width: 2, height: 16, background: P.accentDeep, opacity: 0.8 }} />
                </React.Fragment>
            ))}
            {children}
        </div>
    );
};

// 徽章：红章（双环 + MONO 文本），砸入微旋
export const Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }> = ({ t, from, x, y, text, size = 124, rot = -8, color = P.seal }) => {
    if (t < from) return null;
    const s = pop(t, from, 9);
    const h = hit(t, from, 5);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s * (1 + h * 0.1)})`, opacity: Math.min(1, s * 1.2) }}>
            <div style={{ width: size, height: size, borderRadius: "50%", border: `4px solid ${color}`, background: "#FFFFFFB8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: size * 0.72, height: size * 0.72, borderRadius: "50%", border: `2px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, color, fontSize: text.length > 2 ? size * 0.16 : size * 0.24, textAlign: "center", lineHeight: 1.2, padding: 4 }}>{text.slice(0, 4)}</div>
            </div>
        </div>
    );
};

// 标注：四角定位标 + 顶部尺寸线（note 为标注值）；underline 为刻度下划线
export const Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }> = ({ t, from, x, y, w = 260, h = 64, dur = 14, rot = 0, underline = false, note, color = P.gold }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    if (underline) {
        return (
            <>
                <div style={{ position: "absolute", left: x - (w / 2) * p, top: y, width: w * p, height: 3, background: color }} />
                {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} style={{ position: "absolute", left: x - (w / 2) * p + (w * p * i) / 8, top: y + 3, width: 2, height: i % 2 === 0 ? 12 : 7, background: color, opacity: 0.9 }} />
                ))}
                {note && t >= from + 6 ? (
                    <div style={{ position: "absolute", left: x - (w / 2) * p, top: y + 20, fontFamily: MONO, fontSize: 24, color: P.inkSub, opacity: Math.min(1, prog(t, from + 6, 10) * 1.2) }}>{note}</div>
                ) : null}
            </>
        );
    }
    const L = 30 * p;
    const bx = x - w / 2;
    const by = y - h / 2;
    const ex = x + w / 2;
    const ey = y + h / 2;
    const seg: React.CSSProperties = { position: "absolute", background: P.accentDeep, opacity: 0.9 };
    return (
        <div style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)`, transformOrigin: `${x}px ${y}px`, pointerEvents: "none" }}>
            {/* 四角定位标 */}
            <div style={{ ...seg, left: bx - 2, top: by, width: L, height: 2 }} />
            <div style={{ ...seg, left: bx, top: by - 2, width: 2, height: L }} />
            <div style={{ ...seg, left: ex - L + 2, top: by, width: L, height: 2 }} />
            <div style={{ ...seg, left: ex, top: by - 2, width: 2, height: L }} />
            <div style={{ ...seg, left: bx - 2, top: ey, width: L, height: 2 }} />
            <div style={{ ...seg, left: bx, top: ey - L + 2, width: 2, height: L }} />
            <div style={{ ...seg, left: ex - L + 2, top: ey, width: L, height: 2 }} />
            <div style={{ ...seg, left: ex, top: ey - L + 2, width: 2, height: L }} />
            {/* 顶部尺寸线 */}
            <div style={{ position: "absolute", left: x - (w / 2) * p, top: by - 26, width: w * p, height: 2, background: color }} />
            <div style={{ position: "absolute", left: x - (w / 2) * p, top: by - 32, width: 2, height: 14, background: color }} />
            <div style={{ position: "absolute", left: x + (w / 2) * p - 2, top: by - 32, width: 2, height: 14, background: color }} />
            {note && t >= from + 6 ? (
                <div style={{ position: "absolute", left: x - 70, top: by - 74, width: 140, textAlign: "center", fontFamily: MONO, fontSize: 26, color: P.ink, background: "#FFFFFFE0", border: `1px solid ${P.line}`, opacity: Math.min(1, prog(t, from + 6, 10) * 1.2) }}>{note}</div>
            ) : null}
        </div>
    );
};
