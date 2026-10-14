import React from "react";
import { FONT, P } from "./theme";

// 封面模板工厂：浅灰底 + 大几何装饰 + 粗体标题（静态，无 beat 依赖）
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, #FFFFFF 0%, ${P.bg} 55%, ${P.bgAlt} 100%)`, fontFamily: FONT, overflow: "hidden" }}>
            {/* 大几何装饰 */}
            <div style={{ position: "absolute", left: -140, top: -120, width: 480, height: 480, borderRadius: "50%", background: P.accentLight, opacity: 0.32 }} />
            <div style={{ position: "absolute", right: -90, top: 120, width: 320, height: 320, borderRadius: 64, background: P.gold, opacity: 0.35, transform: "rotate(18deg)" }} />
            <div style={{ position: "absolute", left: 120, bottom: -160, width: 380, height: 380, borderRadius: "50%", background: P.extra?.mint ?? P.accentLight, opacity: 0.3 }} />
            <div style={{ position: "absolute", right: 180, bottom: -90, width: 240, height: 240, background: P.seal, opacity: 0.28, clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
            {/* 标题 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center" }}>
                <div style={{ fontSize: 124, fontWeight: 900, color: P.ink, letterSpacing: 8 }}>{o.title}</div>
                <div style={{ width: 360, height: 16, background: P.accent, borderRadius: 8, margin: "26px auto 0" }} />
                {o.subtitle ? <div style={{ fontSize: 44, fontWeight: 700, color: P.inkSub, marginTop: 36, letterSpacing: 4 }}>{o.subtitle}</div> : null}
            </div>
            {/* 徽章贴纸 */}
            {o.badge ? (
                <div
                    style={{
                        position: "absolute",
                        right: 240,
                        top: 150,
                        minWidth: 150,
                        minHeight: 150,
                        padding: "0 22px",
                        background: P.seal,
                        borderRadius: "50%",
                        transform: "rotate(-10deg)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontSize: 36,
                        fontWeight: 900,
                        boxShadow: `0 16px 40px ${P.seal}55`,
                        textAlign: "center",
                        lineHeight: 1.35,
                    }}
                >
                    {o.badge}
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, textAlign: "center", fontSize: 28, fontWeight: 700, color: P.inkSub, letterSpacing: 6 }}>扁平 MG · FLAT MOTION</div>
        </div>
    );
    return Cover;
};
