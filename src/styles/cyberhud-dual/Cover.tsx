import React from "react";
import { FONT, P } from "./theme";

// 封面模板工厂：深底 + 霓虹大标题 + HUD 框线 + 扫描带（静态，无 beat 依赖，固定走阶段 A 冷色）
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${P.bgAlt} 0%, ${P.bg} 62%)`, fontFamily: FONT, overflow: "hidden" }}>
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(0deg, ${P.line} 0 1px, transparent 1px 92px), repeating-linear-gradient(90deg, ${P.line} 0 1px, transparent 1px 92px)`,
                    opacity: 0.35,
                }}
            />
            {Array.from({ length: 12 }, (_, i) => (
                <div key={i} style={{ position: "absolute", left: (i * 189) % 1780 + 60, top: ((i * 257) % 820) + 100, width: 40 + (i % 4) * 26, height: 5, background: i % 3 === 0 ? P.gold : P.accent, opacity: i % 2 ? 0.45 : 0.2 }} />
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: 500, height: 120, background: `linear-gradient(180deg, transparent, ${P.accent}12, transparent)` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center" }}>
                <div style={{ fontSize: 118, fontWeight: 700, color: P.ink, letterSpacing: 14, textShadow: `0 0 26px ${P.accent}66, 0 0 70px ${P.accent}33` }}>{o.title}</div>
                <div style={{ fontFamily: '"Consolas",monospace', fontSize: 30, color: P.accent, letterSpacing: 10, marginTop: 26 }}>[ SYSTEM ONLINE ]</div>
                {o.subtitle ? <div style={{ fontSize: 42, color: P.inkSub, marginTop: 34, letterSpacing: 6 }}>{o.subtitle}</div> : null}
            </div>
            {o.badge ? (
                <div style={{ position: "absolute", right: 240, top: 170 }}>
                    <div
                        style={{
                            width: 170,
                            height: 170,
                            clipPath: "polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)",
                            background: `${P.seal}22`,
                            boxShadow: `inset 0 0 0 4px ${P.seal}, 0 0 34px ${P.seal}66`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: P.seal,
                            fontSize: 40,
                            fontWeight: 700,
                            textAlign: "center",
                            lineHeight: 1.3,
                            textShadow: `0 0 14px ${P.seal}88`,
                        }}
                    >
                        {o.badge}
                    </div>
                </div>
            ) : null}
            {[
                { left: 40, top: 40, br: true, bb: true },
                { right: 40, top: 40, bl: true, bb: true },
                { left: 40, bottom: 40, br: true, bt: true },
                { right: 40, bottom: 40, bl: true, bt: true },
            ].map((c, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: c.left,
                        right: c.right,
                        top: c.top,
                        bottom: c.bottom,
                        width: 86,
                        height: 86,
                        borderLeft: c.bl ? `3px solid ${P.accent}AA` : undefined,
                        borderRight: c.br ? `3px solid ${P.accent}AA` : undefined,
                        borderTop: c.bt ? `3px solid ${P.accent}AA` : undefined,
                        borderBottom: c.bb ? `3px solid ${P.accent}AA` : undefined,
                    }}
                />
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 62, textAlign: "center", fontFamily: '"Consolas",monospace', fontSize: 26, color: P.inkSub, letterSpacing: 8 }}>赛博 HUD · CYBER HUD DUAL</div>
        </div>
    );
    return Cover;
};
