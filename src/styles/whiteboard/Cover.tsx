import React from "react";
import { DECOR, FONT, P } from "./theme";

// 封面模板工厂：白板底 + 马克标题 + 手画涂鸦 + 便签角标（静态，无 beat 依赖）
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: P.bg, fontFamily: DECOR, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 38%, #FFFFFF 0%, ${P.bg} 60%, #E9E9DF 100%)` }} />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(0deg, ${P.line}55 0 1px, transparent 1px 74px), repeating-linear-gradient(90deg, ${P.line}44 0 1px, transparent 1px 74px)`,
                    backgroundPosition: "12px 8px",
                }}
            />
            {/* 标题 + 红马克下划线 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
                <div style={{ fontSize: 132, fontWeight: 900, color: P.ink, letterSpacing: 8 }}>{o.title}</div>
                <svg width={620} height={30} style={{ display: "block", margin: "12px auto 0" }}>
                    <path d="M10,16 Q160,4 320,14 T610,10" stroke={P.accent} strokeWidth={9} strokeLinecap="round" fill="none" />
                    <path d="M14,24 Q170,12 330,21 T606,18" stroke={P.accent} strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.5} />
                </svg>
                {o.subtitle ? <div style={{ fontFamily: FONT, fontSize: 44, color: P.inkSub, marginTop: 36, letterSpacing: 4 }}>{o.subtitle}</div> : null}
            </div>
            {/* 便签角标 */}
            {o.badge ? (
                <div
                    style={{
                        position: "absolute",
                        right: 220,
                        top: 136,
                        width: 190,
                        minHeight: 150,
                        background: "#FFF6D6",
                        border: `3px solid ${P.ink}`,
                        borderRadius: "8px 12px 9px 11px",
                        transform: "rotate(7deg)",
                        boxShadow: "4px 5px 0 #23272E1A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        fontSize: 36,
                        fontWeight: 900,
                        color: P.ink,
                        fontFamily: DECOR,
                        padding: 16,
                        lineHeight: 1.4,
                    }}
                >
                    <div style={{ position: "absolute", top: -15, left: "50%", width: 66, height: 20, transform: "translateX(-50%) rotate(-4deg)", background: "#E9E4CFAA", border: "1px solid #C9C2A5" }} />
                    {o.badge}
                </div>
            ) : null}
            {/* 手画涂鸦：星星 / 箭头 / 圈圈 */}
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                <path d="M210,180 l14,34 36,4 -26,26 8,36 -32,-18 -32,18 8,-36 -26,-26 36,-4 Z" stroke={P.gold} strokeWidth={6} fill="none" strokeLinejoin="round" />
                <path d="M160,880 Q300,836 420,856" stroke={P.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
                <path d="M392,838 L424,856 L396,874" stroke={P.ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx={1680} cy={860} rx={110} ry={64} stroke={P.accent} strokeWidth={7} fill="none" opacity={0.85} transform="rotate(-6 1680 860)" />
                <ellipse cx={1688} cy={868} rx={110} ry={64} stroke={P.accent} strokeWidth={2.5} fill="none" opacity={0.4} transform="rotate(-6 1680 860)" />
                <path d="M1560,240 Q1660,222 1760,238" stroke={P.ink} strokeWidth={5} opacity={0.5} fill="none" strokeLinecap="round" />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, textAlign: "center", fontFamily: FONT, fontSize: 28, color: P.inkSub, letterSpacing: 6 }}>白板手绘 · WHITEBOARD</div>
        </div>
    );
    return Cover;
};
