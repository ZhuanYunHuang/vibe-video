import React from "react";
import { DECOR, FONT, P } from "./theme";

// 封面模板工厂：奶油纸 + 涂鸦（太阳/云/草地）+ 蜡笔色块标题 + 蜡笔章，静态无 beat 依赖
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: P.bg, fontFamily: FONT, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${P.line}88 1px, transparent 1.4px)`, backgroundSize: "14px 14px", opacity: 0.32 }} />
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
                {/* 太阳 */}
                <g transform="translate(460 210)">
                    <circle cx="0" cy="0" r="66" fill={`${P.gold}66`} stroke={P.ink} strokeWidth="5" />
                    {Array.from({ length: 8 }, (_, i) => {
                        const a = (i / 8) * Math.PI * 2;
                        const r2 = 112 + Math.sin(i * 2.1) * 7;
                        return <line key={i} x1={Math.cos(a) * 84} y1={Math.sin(a) * 84} x2={Math.cos(a) * r2} y2={Math.sin(a) * r2} stroke={P.ink} strokeWidth="5" strokeLinecap="round" />;
                    })}
                </g>
                {/* 云 */}
                <g transform="translate(1430 200)" stroke={P.ink} strokeWidth="5" fill={`${P.seal}1F`}>
                    <ellipse cx="0" cy="0" rx="72" ry="40" />
                    <ellipse cx="70" cy="10" rx="52" ry="31" />
                    <ellipse cx="-66" cy="12" rx="46" ry="28" />
                </g>
                {/* 草地 */}
                <g transform="translate(60 950)" stroke={P.extra?.green} strokeWidth="7" strokeLinecap="round" fill="none">
                    {Array.from({ length: 26 }, (_, i) => (
                        <path key={i} d={`M${i * 72} 50 q7 -30 16 -38 M${i * 72 + 18} 50 q11 -23 25 -30`} />
                    ))}
                </g>
                {/* 星星 */}
                {[[1620, 620], [300, 660], [1720, 380]].map(([sx, sy], i) => (
                    <g key={i} transform={`translate(${sx} ${sy})`} stroke={P.gold} strokeWidth="6" strokeLinecap="round">
                        <line x1="-15" y1="0" x2="15" y2="0" />
                        <line x1="0" y1="-15" x2="0" y2="15" />
                    </g>
                ))}
            </svg>
            {/* 标题：蜡笔色块 + 描边字 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center" }}>
                <span style={{ position: "relative", display: "inline-block", padding: "18px 52px", transform: "rotate(-1.2deg)" }}>
                    <span style={{ position: "absolute", inset: 0, background: P.accent, borderRadius: "22px 16px 24px 18px", opacity: 0.92 }} />
                    <span style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(100deg, transparent 0 10px, ${P.bg}55 10px 13px)`, borderRadius: "22px 16px 24px 18px" }} />
                    <span style={{ position: "relative", fontFamily: DECOR, fontSize: 116, fontWeight: 700, color: "#FFFDF6", WebkitTextStroke: `4px ${P.ink}`, letterSpacing: 8 }}>{o.title}</span>
                </span>
            </div>
            {o.subtitle ? <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", fontFamily: DECOR, fontSize: 40, fontWeight: 700, color: P.ink, letterSpacing: 2 }}>{o.subtitle}</div> : null}
            {/* 蜡笔章 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 210, top: 620, width: 158, height: 158, borderRadius: "50%", border: `6px solid ${P.seal}`, background: P.card, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-7deg)", boxShadow: `4px 4px 0 ${P.ink}33` }}>
                    <div style={{ width: 112, height: 112, borderRadius: "50%", border: `3px dashed ${P.seal}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DECOR, fontWeight: 700, fontSize: 36, color: P.ink, textAlign: "center", lineHeight: 1.2 }}>{o.badge}</div>
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 58, textAlign: "center", fontFamily: DECOR, fontSize: 28, fontWeight: 700, color: P.inkSub, letterSpacing: 8 }}>绘本科画 · PICTURE BOOK</div>
        </div>
    );
    return Cover;
};
