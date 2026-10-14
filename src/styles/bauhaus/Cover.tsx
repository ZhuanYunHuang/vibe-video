import React from "react";
import { FONT, P } from "./theme";

// 封面模板工厂：Bauhaus 大构成（圆/三角/色带 + 紧排大字），静态无 beat 依赖
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: P.bg, fontFamily: FONT, overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(0deg, ${P.line} 0 1px, transparent 1px 120px), repeating-linear-gradient(90deg, ${P.line} 0 1px, transparent 1px 120px)`,
                    opacity: 0.45,
                }}
            />
            <div style={{ position: "absolute", inset: 44, border: `2px solid ${P.ink}22` }} />
            {/* 大构成 */}
            <div style={{ position: "absolute", left: -90, top: -110, width: 380, height: 380, borderRadius: "50%", background: P.seal, clipPath: "inset(0 0 50% 0)", transform: "rotate(24deg)" }} />
            <div style={{ position: "absolute", right: 130, top: 120, width: 230, height: 230, borderRadius: "50%", border: `26px solid ${P.accent}` }} />
            <div style={{ position: "absolute", right: -50, bottom: -60, width: 360, height: 330, background: P.gold, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
            <div style={{ position: "absolute", left: 120, bottom: 130, width: 220, height: 26, background: P.ink }} />
            {/* 标题 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center" }}>
                <span style={{ position: "relative", display: "inline-block", padding: "12px 40px" }}>
                    <span style={{ position: "absolute", inset: 0, background: P.ink }} />
                    <span style={{ position: "relative", fontSize: 118, fontWeight: 900, color: P.bg, letterSpacing: 10 }}>{o.title}</span>
                </span>
                {o.subtitle ? (
                    <div style={{ marginTop: 34 }}>
                        <span style={{ background: P.gold, padding: "8px 26px", fontSize: 42, fontWeight: 800, color: P.ink, letterSpacing: 4 }}>{o.subtitle}</span>
                    </div>
                ) : null}
            </div>
            {/* 圆形徽章 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 260, top: 560, width: 168, height: 168, borderRadius: "50%", background: P.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 130, height: 130, borderRadius: "50%", background: P.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 40, fontWeight: 900, color: P.ink, textAlign: "center", lineHeight: 1.25 }}>{o.badge}</div>
                    </div>
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontSize: 28, fontWeight: 800, color: P.inkSub, letterSpacing: 8 }}>BAUHAUS · 包豪斯</div>
        </div>
    );
    return Cover;
};
