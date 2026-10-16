import React from "react";
import { FONT, MONO, P } from "./theme";

// 封面模板工厂：蓝图网格 + 斜置刻度尺 + 工程字标题（下方带尺寸线），静态无 beat 依赖
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: P.bg, fontFamily: FONT, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${P.extra?.grid}66 0 1px, transparent 1px 20px), repeating-linear-gradient(90deg, ${P.extra?.grid}66 0 1px, transparent 1px 20px)` }} />
            <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${P.extra?.grid}B3 0 1px, transparent 1px 100px), repeating-linear-gradient(90deg, ${P.extra?.grid}B3 0 1px, transparent 1px 100px)` }} />
            {/* 斜置刻度尺 */}
            <div style={{ position: "absolute", left: -80, top: 170, width: 1520, height: 96, background: "#FFFFFFD9", border: `2px solid ${P.ink}`, transform: "rotate(-10deg)", boxShadow: `10px 10px 0 ${P.accentLight}99` }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 24, backgroundImage: `repeating-linear-gradient(90deg, ${P.ink} 0 1px, transparent 1px 30px)` }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 42, backgroundImage: `repeating-linear-gradient(90deg, ${P.ink} 0 3px, transparent 3px 150px)` }} />
                <div style={{ position: "absolute", right: 26, top: 14, fontFamily: MONO, fontSize: 24, color: P.inkSub, letterSpacing: 4 }}>RULER 1:1</div>
            </div>
            {/* 右上角比例牌 */}
            <div style={{ position: "absolute", right: 60, top: 60, border: `1px solid ${P.line}`, background: "#FFFFFFCC" }}>
                <div style={{ fontFamily: MONO, fontSize: 20, color: P.inkSub, padding: "6px 14px", letterSpacing: 2 }}>SCALE 1:100</div>
            </div>
            {/* 标题 + 尺寸线 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center" }}>
                <div style={{ fontSize: 110, fontWeight: 800, color: P.ink, letterSpacing: 10 }}>{o.title}</div>
                <div style={{ position: "relative", width: 560, height: 16, margin: "30px auto 0" }}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 7, height: 3, background: P.gold }} />
                    <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: 16, background: P.gold }} />
                    <div style={{ position: "absolute", right: 0, top: 0, width: 3, height: 16, background: P.gold }} />
                    <div style={{ position: "absolute", left: 4, top: -2, width: 16, height: 16, background: P.gold, clipPath: "polygon(100% 0, 100% 100%, 0 50%)" }} />
                    <div style={{ position: "absolute", right: 4, top: -2, width: 16, height: 16, background: P.gold, clipPath: "polygon(0 0, 0 100%, 100% 50%)" }} />
                </div>
            </div>
            {o.subtitle ? <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", fontSize: 36, color: P.inkSub, letterSpacing: 4 }}>{o.subtitle}</div> : null}
            {/* 红章 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 190, bottom: 170, width: 150, height: 150, borderRadius: "50%", border: `4px solid ${P.seal}`, background: "#FFFFFFB8", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-8deg)" }}>
                    <div style={{ width: 108, height: 108, borderRadius: "50%", border: `2px solid ${P.seal}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 34, color: P.seal, textAlign: "center", lineHeight: 1.2 }}>{o.badge}</div>
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: MONO, fontSize: 26, color: P.inkSub, letterSpacing: 8 }}>比例尺对比 · SCALE</div>
        </div>
    );
    return Cover;
};
