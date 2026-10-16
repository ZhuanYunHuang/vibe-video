import React from "react";
import { FONT, P } from "./theme";

// 封面模板工厂：宝蓝舞台 + 放射光 + 多层叠印花字标题 + 彩纸屑，静态无 beat 依赖
const CONFETTI: Array<[number, number, number, number]> = [
    [140, 150, 18, -18],
    [340, 90, 14, 22],
    [560, 210, 22, -8],
    [760, 120, 16, 34],
    [1180, 140, 20, -24],
    [1390, 90, 14, 12],
    [1600, 180, 24, -30],
    [1800, 260, 16, 18],
    [90, 520, 14, 40],
    [230, 760, 22, -14],
    [420, 900, 16, 26],
    [640, 820, 18, -36],
    [1300, 860, 20, 14],
    [1520, 780, 14, -22],
    [1720, 640, 22, 30],
    [1840, 480, 16, -12],
    [980, 90, 12, 8],
    [1040, 950, 20, -28],
];

export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 50% 8%, #1E3A78 0%, ${P.bg} 55%, #081226 100%)`, fontFamily: FONT, overflow: "hidden" }}>
            {/* 放射光束 */}
            <div style={{ position: "absolute", left: "50%", top: 1080, width: 2600, height: 2600, marginLeft: -1300, marginTop: -260, transform: "rotate(8deg)", opacity: 0.2, background: `repeating-conic-gradient(from 0deg at 50% 50%, ${P.accentLight} 0 9deg, transparent 9deg 26deg)`, borderRadius: "50%" }} />
            {/* 爆星 */}
            <div style={{ position: "absolute", left: "50%", top: 330, width: 900, height: 900, marginLeft: -450, transform: "rotate(10deg)", background: `${P.gold}22`, clipPath: "polygon(50% 0%, 58% 32%, 85% 15%, 68% 42%, 100% 50%, 68% 58%, 85% 85%, 58% 68%, 50% 100%, 42% 68%, 15% 85%, 32% 58%, 0% 50%, 32% 42%, 15% 15%, 42% 32%)" }} />
            {/* 彩纸屑 */}
            {CONFETTI.map(([cx, cy, s, r], i) => (
                <div key={i} style={{ position: "absolute", left: cx, top: cy, width: s, height: s * 0.6, background: [P.accent, P.gold, P.seal, P.extra?.blue ?? P.accent, P.extra?.green ?? P.accent][i % 5], transform: `rotate(${r}deg)`, borderRadius: i % 4 === 0 ? "50%" : 2, opacity: 0.95 }} />
            ))}
            {/* 多层叠印花字标题 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}>
                <span style={{ position: "relative", display: "inline-block", transform: "rotate(-2deg)" }}>
                    <span style={{ position: "absolute", left: 10, top: 10, fontSize: 128, fontWeight: 900, color: P.seal, letterSpacing: 10, whiteSpace: "nowrap" }}>{o.title}</span>
                    <span style={{ position: "absolute", left: 5, top: 5, fontSize: 128, fontWeight: 900, color: P.gold, letterSpacing: 10, whiteSpace: "nowrap" }}>{o.title}</span>
                    <span style={{ position: "relative", fontSize: 128, fontWeight: 900, color: "#FFFFFF", WebkitTextStroke: `5px ${P.bg}`, letterSpacing: 10, whiteSpace: "nowrap" }}>{o.title}</span>
                </span>
            </div>
            {o.subtitle ? (
                <div style={{ position: "absolute", left: 0, right: 0, top: 620, textAlign: "center" }}>
                    <span style={{ display: "inline-block", background: P.accent, color: P.bg, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "8px 30px", borderRadius: 12, transform: "rotate(-1deg)", border: `4px solid #FFFFFF`, boxShadow: `6px 6px 0 ${P.bg}AA`, letterSpacing: 3 }}>{o.subtitle}</span>
                </div>
            ) : null}
            {/* 星形贴纸章 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 220, top: 700, transform: "rotate(-10deg)" }}>
                    <div style={{ position: "absolute", left: -42, top: -42, width: 250, height: 250, background: P.gold, clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)" }} />
                    <div style={{ position: "relative", width: 164, height: 164, borderRadius: "50%", background: P.seal, border: `6px solid #FFFFFF`, boxShadow: `0 8px 0 ${P.bg}AA`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#FFFFFF", textAlign: "center", lineHeight: 1.15 }}>{o.badge}</div>
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 28, color: P.inkSub, letterSpacing: 8 }}>综艺花字 · VARIETY</div>
        </div>
    );
    return Cover;
};
