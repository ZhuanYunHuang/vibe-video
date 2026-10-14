import React from "react";
import { DECOR, FONT, P } from "./theme";

// 封面模板工厂：拼贴墙（牛皮纸 + 标题纸条 + 拍立得 + 胶带 + 半调），静态无 beat 依赖
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 46% 40%, #F1E6D0 0%, ${P.bg} 55%, ${P.bgAlt} 100%)`, fontFamily: FONT, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(#2A262022 1.4px, transparent 1.4px)`, backgroundSize: "22px 22px", opacity: 0.55 }} />
            {/* 标题纸条 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center" }}>
                <div style={{ position: "relative", display: "inline-block", background: P.card, padding: "22px 64px", transform: "rotate(-1.6deg)", boxShadow: "10px 12px 0 #2A262026" }}>
                    <div style={{ position: "absolute", left: 30, top: -18, width: 90, height: 32, background: "#D9CBA699", border: "1px solid #B8A87E", transform: "rotate(-6deg)" }} />
                    <div style={{ position: "absolute", right: 30, bottom: -18, width: 90, height: 32, background: "#D9CBA699", border: "1px solid #B8A87E", transform: "rotate(7deg)" }} />
                    <div style={{ fontSize: 118, fontWeight: 900, color: P.ink, letterSpacing: 6 }}>{o.title}</div>
                </div>
            </div>
            {/* 副标题红笔划条 */}
            {o.subtitle ? (
                <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center" }}>
                    <span style={{ position: "relative", fontFamily: DECOR, fontSize: 48, color: P.ink, fontWeight: 900 }}>
                        <span style={{ position: "absolute", left: -14, right: -14, top: 12, bottom: 6, background: `${P.accent}44`, transform: "rotate(-1deg)" }} />
                        <span style={{ position: "relative" }}>{o.subtitle}</span>
                    </span>
                </div>
            ) : null}
            {/* 拍立得 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 250, top: 560, width: 200, height: 225, background: "#FFFFFF", padding: "14px 14px 44px", transform: "rotate(7deg)", boxShadow: "10px 12px 0 #2A262026" }}>
                    <div style={{ width: "100%", height: "100%", background: P.bgAlt, border: `2px solid ${P.ink}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontFamily: DECOR, fontSize: 42, fontWeight: 900, color: P.ink, textAlign: "center", lineHeight: 1.25 }}>{o.badge}</div>
                    </div>
                </div>
            ) : null}
            {/* 剪报碎片 + 手写批注 */}
            <div style={{ position: "absolute", left: 150, top: 560, width: 320, height: 240, background: "#F4EEDF", transform: "rotate(-5deg)", boxShadow: "6px 7px 0 #2A262015", clipPath: "polygon(0 8px, 7% 2px, 18% 9px, 30% 2px, 44% 8px, 58% 1px, 72% 9px, 85% 3px, 100% 8px, 100% calc(100% - 8px), 86% calc(100% - 2px), 72% calc(100% - 9px), 58% calc(100% - 3px), 44% calc(100% - 8px), 30% calc(100% - 2px), 16% calc(100% - 9px), 6% calc(100% - 3px), 0 calc(100% - 8px))" }}>
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} style={{ position: "absolute", left: 24, right: 24, top: 30 + i * 30, height: 8, background: "#2A262018", borderRadius: 2 }} />
                ))}
            </div>
            <div style={{ position: "absolute", left: 520, top: 610, fontFamily: DECOR, fontSize: 44, fontWeight: 900, color: P.accent, transform: "rotate(-8deg)" }}>真相是——</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: FONT, fontSize: 28, fontWeight: 700, color: P.inkSub, letterSpacing: 6 }}>拼贴 · COLLAGE</div>
        </div>
    );
    return Cover;
};
