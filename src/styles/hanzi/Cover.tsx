import React from "react";
import { DECOR, P } from "./theme";

// 封面模板工厂：深炭底 + 火塘光晕 + 巨型铸刻首字 + 象形线稿 + 火星，静态无 beat 依赖
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const first = Array.from(o.title)[0] ?? "字";
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: P.bg, fontFamily: DECOR, overflow: "hidden" }}>
            {/* 火塘光晕 */}
            <div style={{ position: "absolute", left: "50%", bottom: -260, width: 1500, height: 780, marginLeft: -750, background: `radial-gradient(50% 60% at 50% 80%, ${P.accent}66, transparent 70%)`, opacity: 0.7 }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(45deg, ${P.line}44 0 2px, transparent 2px 46px)`, opacity: 0.45 }} />
            {/* 象形线稿（日 · 山） */}
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
                <g stroke={P.gold} strokeWidth="5" fill="none" opacity="0.55">
                    <circle cx="320" cy="380" r="88" />
                    <circle cx="320" cy="380" r="12" fill={P.gold} stroke="none" />
                    <path d="M1380 540 L1466 400 L1524 478 L1600 350 L1700 540 Z" strokeLinejoin="round" />
                </g>
            </svg>
            {/* 巨型铸刻首字 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center" }}>
                <span
                    style={{
                        fontSize: 300,
                        lineHeight: 1,
                        backgroundImage: `linear-gradient(180deg, ${P.extra?.ember} 0%, ${P.accent} 55%, ${P.accentDeep} 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextStroke: `3px ${P.accentDeep}88`,
                        filter: `drop-shadow(0 0 40px ${P.accent}CC)`,
                    }}
                >
                    {first}
                </span>
            </div>
            {/* 标题与火线 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 600, textAlign: "center" }}>
                <span style={{ fontSize: 96, color: P.ink, letterSpacing: 10, textShadow: `0 0 26px ${P.accent}88` }}>{o.title}</span>
                <div style={{ height: 3, width: 520, background: `linear-gradient(90deg, transparent, ${P.accent}, transparent)`, margin: "26px auto 0", boxShadow: `0 0 14px ${P.accent}` }} />
            </div>
            {o.subtitle ? <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontSize: 40, color: P.inkSub, letterSpacing: 4 }}>{o.subtitle}</div> : null}
            {/* 火星 */}
            {[[240, 720], [520, 440], [980, 200], [1310, 640], [1680, 480], [1120, 880], [420, 900]].map(([sx, sy], i) => (
                <div key={i} style={{ position: "absolute", left: sx, top: sy, width: 6 + (i % 3) * 2, height: 6 + (i % 3) * 2, borderRadius: "50%", background: i % 3 === 0 ? P.extra?.ember : P.accent, boxShadow: `0 0 14px ${P.accent}`, opacity: 0.85 }} />
            ))}
            {/* 朱砂方章 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 210, top: 660, width: 156, height: 156, borderRadius: 22, background: P.seal, border: `4px solid #8E2418`, boxShadow: `0 0 36px ${P.seal}88`, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-6deg)" }}>
                    <div style={{ width: 118, height: 118, borderRadius: 14, border: `2px solid #F7E7CE55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, color: "#F7E7CE", textAlign: "center", lineHeight: 1.15 }}>{o.badge}</div>
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontSize: 28, color: P.inkSub, letterSpacing: 8 }}>汉字演变 · HANZI</div>
        </div>
    );
    return Cover;
};
