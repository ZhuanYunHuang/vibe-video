import React from "react";
import { FONT, P } from "./theme";

// 封面模板工厂：落日 + 透视网格 + 铬字标题（静态，无 beat 依赖）
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, #0C0520 0%, ${P.bg} 45%, ${P.bgAlt} 100%)`, fontFamily: FONT, overflow: "hidden" }}>
            {Array.from({ length: 26 }, (_, i) => (
                <div key={i} style={{ position: "absolute", left: (i * 173) % 1880, top: ((i * 241) % 420) + 30, width: i % 6 === 0 ? 5 : 3, height: i % 6 === 0 ? 5 : 3, borderRadius: "50%", background: i % 5 === 0 ? P.gold : "#FFE9FF", opacity: 0.8 }} />
            ))}
            {/* 落日 */}
            <div style={{ position: "absolute", left: 960 - 250, top: 420, width: 500, height: 500, borderRadius: "50%", overflow: "hidden", background: `linear-gradient(180deg, ${P.seal} 0%, ${P.accent} 48%, ${P.accentDeep} 100%)`, boxShadow: `0 0 110px ${P.accent}66` }}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ position: "absolute", left: 0, right: 0, bottom: 70 + i * 72, height: 18 + i * 12, background: P.bg, opacity: 0.92 }} />
                ))}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 918, height: 3, background: `${P.gold}CC`, boxShadow: `0 0 24px ${P.gold}` }} />
            <div
                style={{
                    position: "absolute",
                    left: -400,
                    right: -400,
                    top: 920,
                    bottom: -80,
                    transform: "perspective(560px) rotateX(63deg)",
                    transformOrigin: "50% 0%",
                    backgroundImage: `repeating-linear-gradient(0deg, ${P.accent}66 0 3px, transparent 3px 92px), repeating-linear-gradient(90deg, ${P.accent}44 0 3px, transparent 3px 92px)`,
                    opacity: 0.75,
                }}
            />
            {/* 铬字标题 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 180, textAlign: "center" }}>
                <div
                    style={{
                        fontSize: 128,
                        fontWeight: 900,
                        letterSpacing: 10,
                        background: `linear-gradient(180deg, #FFFFFF 0%, #FFE9FF 30%, #C86BFF 47%, #5A1FA8 53%, ${P.accentLight} 74%, #FFFFFF 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        filter: `drop-shadow(0 0 22px ${P.accent}88) drop-shadow(0 0 60px ${P.accent}44)`,
                    }}
                >
                    {o.title}
                </div>
                {o.subtitle ? <div style={{ fontSize: 44, fontWeight: 800, color: P.ink, marginTop: 30, letterSpacing: 6, textShadow: `0 0 18px ${P.gold}77` }}>{o.subtitle}</div> : null}
            </div>
            {/* 霓虹章 */}
            {o.badge ? (
                <div style={{ position: "absolute", right: 240, top: 210, width: 168, height: 168, borderRadius: "50%", border: `5px solid ${P.seal}`, boxShadow: `0 0 34px ${P.seal}88, inset 0 0 26px ${P.gold}55`, display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(-6deg)" }}>
                    <div style={{ fontSize: 40, fontWeight: 900, color: P.seal, textAlign: "center", lineHeight: 1.3, textShadow: `0 0 16px ${P.seal}AA` }}>{o.badge}</div>
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 56, textAlign: "center", fontSize: 28, fontWeight: 800, color: P.inkSub, letterSpacing: 8, textShadow: `0 0 12px ${P.accent}55` }}>SYNTHWAVE · 复古霓虹</div>
        </div>
    );
    return Cover;
};
