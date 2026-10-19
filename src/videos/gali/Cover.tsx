import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, Fonts, Grain, MONO } from "../../styles/lyricmv";

// 封面（静态 Still）：纯黑底 + 白色粗标题「白色的瓶子在角落里面堆一堆」
export const Cover: React.FC = () => (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT, background: "#050505" }}>
        <Fonts />
        <Grain t={0} opacity={0.04} />

        {/* 巨字残影 */}
        <div style={{ position: "absolute", right: 24, top: 34, fontSize: 700, lineHeight: 0.9, color: "transparent", WebkitTextStroke: "3px #FFFFFF", opacity: 0.07, transform: "rotate(-7deg)" }}>白</div>
        <div style={{ position: "absolute", left: -46, bottom: -90, fontSize: 700, lineHeight: 0.9, color: "transparent", WebkitTextStroke: "3px #FFFFFF", opacity: 0.05, transform: "rotate(5deg)" }}>落</div>

        <div style={{ position: "absolute", left: 148, top: 128, fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: "#FFFFFFB0" }}>我的 / GALI</div>
        <div style={{ position: "absolute", right: 148, top: 128, fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: "#FFFFFF99" }}>THAT&apos;S MY · LYRIC MV</div>
        <div style={{ position: "absolute", left: 148, top: 196, width: 240, height: 4, background: "#FFFFFF" }} />
        <div style={{ position: "absolute", right: 148, top: 196, width: 240, height: 4, background: "#FFFFFF" }} />

        {/* 主标题：白色，两行 */}
        <div
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 330,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                color: "#FFFFFF",
                textShadow: "0 0 44px rgba(255,255,255,0.14)",
            }}
        >
            <div style={{ fontSize: 228, lineHeight: 1, letterSpacing: 12, whiteSpace: "nowrap" }}>白色的瓶子</div>
            <div style={{ fontSize: 176, lineHeight: 1, letterSpacing: 12, whiteSpace: "nowrap" }}>在角落里面堆一堆</div>
        </div>

        <div style={{ position: "absolute", left: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: "#FFFFFF", opacity: 0.7 }}>29 LINES · 40.6S</div>
        <div style={{ position: "absolute", right: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: "#FFFFFF", opacity: 0.7 }}>1920 × 1080 / 30FPS</div>
    </AbsoluteFill>
);
