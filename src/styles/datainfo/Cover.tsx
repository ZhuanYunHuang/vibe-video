import React from "react";
import { FONT, P } from "./theme";

// 封面模板工厂：暖白数据感（点阵底 + 柱群/环形图装饰 + 大字标题 + 刻度），静态无 beat 依赖
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => {
        const barH = [120, 190, 96, 236, 150, 282, 110, 210, 160, 250];
        return (
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(165deg, #FFFFFF 0%, ${P.bg} 55%, ${P.bgAlt} 100%)`, fontFamily: FONT, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${P.line} 1.6px, transparent 1.6px)`, backgroundSize: "34px 34px", opacity: 0.8 }} />
                {/* 底部柱群 */}
                <div style={{ position: "absolute", left: 90, bottom: 110, display: "flex", alignItems: "flex-end", gap: 22, opacity: 0.55 }}>
                    {barH.map((h, i) => (
                        <div key={i} style={{ width: 46, height: h, background: i % 3 === 2 ? P.gold : P.accent, borderRadius: 6, opacity: i % 2 ? 0.85 : 1 }} />
                    ))}
                </div>
                {/* 右上环形图 */}
                <svg width={300} height={300} style={{ position: "absolute", right: 150, top: 120, opacity: 0.85 }}>
                    <circle cx={150} cy={150} r={110} stroke={P.line} strokeWidth={26} fill="none" />
                    <circle cx={150} cy={150} r={110} stroke={P.accent} strokeWidth={26} fill="none" strokeDasharray={`${2 * Math.PI * 110 * 0.72} ${2 * Math.PI * 110}`} transform="rotate(-90 150 150)" strokeLinecap="round" />
                    <circle cx={150} cy={150} r={110} stroke={P.gold} strokeWidth={26} fill="none" strokeDasharray={`${2 * Math.PI * 110 * 0.16} ${2 * Math.PI * 110}`} strokeDashoffset={-2 * Math.PI * 110 * 0.74} transform="rotate(-90 150 150)" />
                    <text x={150} y={166} textAnchor="middle" fontFamily='"Cascadia Code",monospace' fontSize={52} fontWeight={700} fill={P.ink}>72%</text>
                </svg>
                {/* 标题 */}
                <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
                    <div style={{ fontSize: 122, fontWeight: 900, color: P.ink, letterSpacing: 8 }}>{o.title}</div>
                    <div style={{ width: 420, height: 10, background: P.accent, borderRadius: 5, margin: "26px auto 0" }} />
                    {o.subtitle ? <div style={{ fontSize: 44, fontWeight: 700, color: P.inkSub, marginTop: 34, letterSpacing: 4 }}>{o.subtitle}</div> : null}
                </div>
                {/* 读数徽章 */}
                {o.badge ? (
                    <div style={{ position: "absolute", right: 236, top: 470, width: 160, height: 160, background: P.card, border: `6px solid ${P.seal}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 12px 30px ${P.seal}44`, transform: "rotate(-6deg)" }}>
                        <div style={{ fontFamily: '"Cascadia Code",monospace', color: P.seal, fontSize: 42, fontWeight: 700, textAlign: "center", lineHeight: 1.2 }}>{o.badge}</div>
                    </div>
                ) : null}
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontSize: 28, fontWeight: 700, color: P.inkSub, letterSpacing: 6 }}>数据信息图 · DATA STORY</div>
            </div>
        );
    };
    return Cover;
};
