import React from "react";
import { PixelFontLoader } from "./Fonts";
import { FONT, P } from "./theme";

// 封面模板工厂：深空像素风（扫描线 + 星点 + RGB 分离标题 + 像素边框），静态无 beat 依赖
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${P.bg} 0%, ${P.bgAlt} 100%)`, fontFamily: FONT, overflow: "hidden" }}>
            <PixelFontLoader />
            <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 6px)" }} />
            {/* 星点 */}
            {Array.from({ length: 30 }, (_, i) => (
                <div key={i} style={{ position: "absolute", left: (i * 173) % 1880, top: ((i * 233) % 900) + 30, width: i % 7 === 0 ? 6 : 4, height: i % 7 === 0 ? 6 : 4, background: i % 5 === 0 ? P.gold : "#E8F0FF", opacity: 0.75 }} />
            ))}
            {/* 像素边框 */}
            <div style={{ position: "absolute", inset: 30, border: `4px solid ${P.line}` }} />
            {[
                [30, 30],
                [1876, 30],
                [30, 1036],
                [1876, 1036],
            ].map(([cx, cy], i) => (
                <div key={i} style={{ position: "absolute", left: cx - 12, top: cy - 12, width: 24, height: 24, background: P.accent }} />
            ))}
            {/* 标题（RGB 分离 + 像素投影） */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 320, textAlign: "center" }}>
                <div style={{ fontSize: 120, fontWeight: 700, color: P.ink, letterSpacing: 10, textShadow: `4px 0 0 #FF005544, -4px 0 0 #00E5FF44, 8px 8px 0 #00000088` }}>{o.title}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 30 }}>
                    {Array.from({ length: 24 }, (_, i) => (
                        <div key={i} style={{ width: 22, height: 12, background: i % 2 === 0 ? P.accent : P.gold }} />
                    ))}
                </div>
                {o.subtitle ? <div style={{ fontSize: 44, color: P.inkSub, marginTop: 40, letterSpacing: 4 }}>{o.subtitle}</div> : null}
            </div>
            {/* 徽章方章 */}
            {o.badge ? (
                <div
                    style={{
                        position: "absolute",
                        right: 230,
                        top: 150,
                        minWidth: 150,
                        minHeight: 150,
                        padding: "0 20px",
                        background: P.card,
                        border: `4px solid ${P.seal}`,
                        boxShadow: `10px 10px 0 #00000066`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: P.seal,
                        fontSize: 38,
                        fontWeight: 700,
                        textAlign: "center",
                        lineHeight: 1.3,
                    }}
                >
                    {o.badge}
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontSize: 28, color: P.inkSub, letterSpacing: 8 }}>像素风 · PIXEL ART</div>
        </div>
    );
    return Cover;
};
