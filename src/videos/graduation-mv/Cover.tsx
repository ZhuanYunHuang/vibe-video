import React from "react";
import { AbsoluteFill } from "remotion";
import { Fonts } from "./kit/Fonts";
import { Grain, Scanlines, Vignette } from "./kit/frame";
import { FONT, MONO, P } from "./kit/theme";

// 封面静态帧：近黑底 + 「逐渐变成了 / 万人敌」，万人敌走血红切角色块强调
export const Cover: React.FC = () => (
    <AbsoluteFill style={{ background: P.bg, overflow: "hidden" }}>
        <Fonts />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 58% 50% at 50% 46%, ${P.bloodDeep}77, transparent 72%)` }} />

        {/* 背景残影：只做纹理 */}
        <div
            style={{
                position: "absolute",
                left: -90,
                top: 610,
                fontFamily: FONT,
                fontSize: 470,
                lineHeight: 1,
                whiteSpace: "nowrap",
                color: "transparent",
                WebkitTextStroke: `2px ${P.bone}`,
                opacity: 0.045,
                transform: "rotate(-3deg)",
            }}
        >
            万人敌
        </div>

        {/* 顶部两段红色刻度 */}
        <div style={{ position: "absolute", left: 148, top: 196, width: 210, height: 3, background: P.blood }} />
        <div style={{ position: "absolute", right: 148, top: 196, width: 210, height: 3, background: P.blood }} />

        <div style={{ position: "absolute", left: 148, top: 128, fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: `${P.bone}88` }}>毕业 / GRADUATION</div>
        <div style={{ position: "absolute", right: 148, top: 128, fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: P.blood }}>PG ONE · VERSE</div>

        {/* 逐渐变成了 */}
        <div
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 300,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 100,
                lineHeight: 1,
                letterSpacing: 16,
                color: `${P.bone}E6`,
                textShadow: `5px 5px 0 ${P.bloodDeep}`,
            }}
        >
            逐渐变成了
        </div>

        {/* 万人敌：血红切角色块 */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 436, display: "flex", justifyContent: "center" }}>
            <div
                style={{
                    position: "relative",
                    padding: "8px 46px 34px",
                    background: P.blood,
                    transform: "rotate(-2deg)",
                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 38px), calc(100% - 38px) 100%, 0 100%)",
                    boxShadow: `0 0 70px ${P.blood}55`,
                }}
            >
                <span style={{ fontFamily: FONT, fontSize: 292, lineHeight: 1, letterSpacing: 6, color: P.bone }}>万人敌</span>
            </div>
        </div>

        {/* 副句 + 元信息 */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 812, display: "flex", justifyContent: "center" }}>
            <div style={{ width: 640, height: 2, background: P.blood }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 842, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 12, color: `${P.bone}88` }}>
            能力越大越讨人嫌
        </div>

        <div style={{ position: "absolute", left: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: `${P.bone}55` }}>14 LINES · 43.9S</div>
        <div style={{ position: "absolute", right: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: `${P.bone}55` }}>1920 × 1080 / 30FPS</div>

        <Scanlines t={0} opacity={0.2} />
        <Grain t={0} opacity={0.16} />
        <Vignette />
    </AbsoluteFill>
);
