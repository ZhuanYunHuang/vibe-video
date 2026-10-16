import React from "react";
import { DECOR, FONT, MONO, P } from "./theme";

// 封面模板工厂：近黑底 + 点阵 + 圆与切线几何 + 衬线标题，静态无 beat 依赖
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: P.bg, fontFamily: FONT, overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${P.line} 1.5px, transparent 1.5px)`, backgroundSize: "110px 110px", opacity: 0.5 }} />
            <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
                {/* 十字轴 */}
                <line x1="960" y1="80" x2="960" y2="660" stroke={P.line} strokeWidth="2" />
                <line x1="560" y1="370" x2="1360" y2="370" stroke={P.line} strokeWidth="2" />
                {/* 主圆（大圆用 SVG） */}
                <circle cx="960" cy="370" r="240" fill="none" stroke={P.accent} strokeWidth="5" />
                {/* 半径与切线 */}
                <line x1="960" y1="370" x2="776" y2="524" stroke={P.inkSub} strokeWidth="3" />
                <line x1="670" y1="398" x2="882" y2="651" stroke={P.gold} strokeWidth="4" />
                <circle cx="776" cy="524" r="10" fill={P.gold} />
                <circle cx="960" cy="370" r="6" fill={P.accent} />
            </svg>
            {/* 标题 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center" }}>
                <div style={{ fontFamily: DECOR, fontSize: 112, color: P.ink, letterSpacing: 8 }}>{o.title}</div>
                <div style={{ height: 4, width: 440, background: P.accent, margin: "24px auto 0", borderRadius: 2 }} />
            </div>
            {o.subtitle ? <div style={{ position: "absolute", left: 0, right: 0, top: 878, textAlign: "center", fontSize: 36, color: P.inkSub, letterSpacing: 4 }}>{o.subtitle}</div> : null}
            {/* 结论章 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 200, top: 190, width: 132, height: 132, borderRadius: "50%", border: `2px solid ${P.gold}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DECOR, fontSize: 46, color: P.gold }}>{o.badge}</div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontFamily: MONO, fontSize: 26, color: P.inkSub, letterSpacing: 8 }}>数学可视化 · MATH VIZ</div>
        </div>
    );
    return Cover;
};
