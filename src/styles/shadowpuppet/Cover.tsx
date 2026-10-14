import React from "react";
import { FONT, P } from "./theme";

// 封面模板工厂：幕布 + 中央剪影人物 + 朱红方章 + 光斑（静态，无 beat 依赖）
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 44%, #FFF3D8 0%, ${P.bg} 46%, ${P.bgAlt} 80%, #C9AF7E 100%)`, fontFamily: FONT, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(120,95,55,0.05) 0 2px, transparent 2px 9px), repeating-linear-gradient(0deg, rgba(120,95,55,0.04) 0 2px, transparent 2px 11px)" }} />
            {/* 标题 + 金双线 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center" }}>
                <div style={{ fontSize: 120, fontWeight: 900, color: P.ink, letterSpacing: 8, textShadow: `0 4px 0 ${P.line}` }}>{o.title}</div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, marginTop: 24 }}>
                    <div style={{ width: 460, height: 4, background: P.gold }} />
                    <div style={{ width: 330, height: 3, background: P.gold, opacity: 0.7 }} />
                </div>
                {o.subtitle ? <div style={{ fontSize: 46, color: P.inkSub, marginTop: 32, letterSpacing: 4 }}>{o.subtitle}</div> : null}
            </div>
            {/* 中央剪影人物 */}
            <svg width={340} height={430} style={{ position: "absolute", left: 790, top: 520 }}>
                <circle cx={170} cy={128} r={64} fill={P.ink} />
                <path d="M116,70 Q170,26 224,70 L216,86 Q170,52 124,86 Z" fill={P.ink} />
                <path d="M170,198 Q72,246 48,430 L292,430 Q268,246 170,198 Z" fill={P.ink} />
                <line x1={236} y1={252} x2={300} y2={116} stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
                <circle cx={302} cy={108} r={9} fill={P.ink} />
            </svg>
            {/* 朱红方章 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 240, top: 430, width: 152, height: 152, background: P.seal, border: `4px solid ${P.ink}`, borderRadius: 8, transform: "rotate(6deg)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "6px 8px 0 #201A1422" }}>
                    <div style={{ color: "#F9EED6", fontSize: 40, fontWeight: 900, textAlign: "center", lineHeight: 1.3, fontFamily: FONT }}>{o.badge}</div>
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 40, right: 40, bottom: 30, height: 10, background: "#7A5C33", borderRadius: 5, boxShadow: "0 3px 0 #5C451F" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, textAlign: "center", fontFamily: FONT, fontSize: 28, color: P.inkSub, letterSpacing: 6 }}>皮影戏 · SHADOW PUPPET</div>
        </div>
    );
    return Cover;
};
