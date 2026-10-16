import React from "react";
import { FONT, MONO, P } from "./theme";

// 封面模板工厂：石墨影棚底 + 等距分层爆炸堆 + 金属字标题，静态无 beat 依赖
const plate = (cx: number, cy: number, a: number, b: number, t: number) => ({
    top: `M${cx} ${cy - b} L${cx + a} ${cy} L${cx} ${cy + b} L${cx - a} ${cy} Z`,
    left: `M${cx - a} ${cy} L${cx} ${cy + b} L${cx} ${cy + b + t} L${cx - a} ${cy + t} Z`,
    right: `M${cx + a} ${cy} L${cx} ${cy + b} L${cx} ${cy + b + t} L${cx + a} ${cy + t} Z`,
    rim: `M${cx + a} ${cy} L${cx} ${cy + b}`,
});

export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const p1 = plate(960, 648, 232, 136, 24);
    const p2 = plate(960, 512, 216, 127, 22);
    const p3 = plate(960, 382, 200, 118, 20);
    return () => (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(95% 75% at 50% 0%, #262B36 0%, ${P.bg} 58%, #0B0D11 100%)`, fontFamily: FONT, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: "50%", top: -260, width: 1320, height: 800, marginLeft: -660, background: `radial-gradient(50% 55% at 50% 42%, ${P.accentLight}30, transparent 70%)` }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(60deg, ${P.line}44 0 1px, transparent 1px 90px), repeating-linear-gradient(-60deg, ${P.line}44 0 1px, transparent 1px 90px)`, opacity: 0.35 }} />
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
                <ellipse cx="960" cy="762" rx="380" ry="50" fill={P.extra?.shadow} opacity="0.5" />
                <ellipse cx="960" cy="762" rx="220" ry="26" fill={P.extra?.shadow} opacity="0.55" />
                {[p1, p2, p3].map((pl, i) => (
                    <g key={i}>
                        <path d={pl.left} fill="#2E3440" stroke="#00000066" strokeWidth="1" />
                        <path d={pl.right} fill="#232833" stroke="#00000066" strokeWidth="1" />
                        <path d={pl.top} fill="#454C5C" stroke="#00000088" strokeWidth="1" />
                        <path d={pl.rim} fill="none" stroke={P.accent} strokeWidth="3" opacity="0.85" />
                    </g>
                ))}
                {/* 悬浮零件 */}
                <path d="M600 430 L640 448 L600 466 L560 448 Z" fill="#3A404E" stroke="#00000066" />
                <path d="M1330 540 L1362 554 L1330 568 L1298 554 Z" fill="#3A404E" stroke="#00000066" />
                <path d="M1420 330 L1444 340 L1420 350 L1396 340 Z" fill="#313744" stroke="#00000066" />
            </svg>
            {/* 金属字标题 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center" }}>
                <span style={{ position: "relative", display: "inline-block" }}>
                    <span style={{ position: "absolute", left: 0, top: 10, fontSize: 104, fontWeight: 900, color: "#07090D", letterSpacing: 12, whiteSpace: "nowrap" }}>{o.title}</span>
                    <span style={{ position: "absolute", left: 0, top: 5, fontSize: 104, fontWeight: 900, color: P.accentDeep, letterSpacing: 12, whiteSpace: "nowrap" }}>{o.title}</span>
                    <span style={{ position: "relative", fontSize: 104, fontWeight: 900, letterSpacing: 12, whiteSpace: "nowrap", backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, #D7DEE9 42%, ${P.extra?.metal} 72%, #7E8798 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{o.title}</span>
                </span>
            </div>
            {o.subtitle ? <div style={{ position: "absolute", left: 0, right: 0, top: 930, textAlign: "center", fontSize: 34, color: P.inkSub, letterSpacing: 4 }}>{o.subtitle}</div> : null}
            {o.badge ? (
                <div style={{ position: "absolute", right: 170, top: 300, border: `2px solid ${P.accent}`, borderRadius: 8, background: `${P.bg}D9`, padding: "12px 20px", textAlign: "center", boxShadow: `0 0 26px ${P.accent}44` }}>
                    <div style={{ fontFamily: MONO, fontSize: 30, color: P.ink, letterSpacing: 2 }}>{o.badge}</div>
                    <div style={{ fontFamily: MONO, fontSize: 16, color: P.accent, letterSpacing: 2, marginTop: 4 }}>QC PASS</div>
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: MONO, fontSize: 24, color: P.inkSub, letterSpacing: 10 }}>3D 拆解 · EXPLODE</div>
        </div>
    );
};
