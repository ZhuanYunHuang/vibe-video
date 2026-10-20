import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, Fonts, Grain, MONO } from "../../styles/lyricmv";
import { GREY } from "./kit/theme";

// 封面（静态 Still）：灰色主题底 + 纯白粗标题「老子才是 RapStar」
export const Cover: React.FC = () => (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT, background: GREY }}>
        <Fonts />
        <Grain t={0} opacity={0.05} />

        {/* 巨字残影 */}
        <div style={{ position: "absolute", right: 24, top: 34, fontSize: 700, lineHeight: 0.9, color: "transparent", WebkitTextStroke: "3px #FFFFFF", opacity: 0.08, transform: "rotate(-7deg)" }}>嘻</div>
        <div style={{ position: "absolute", left: -46, bottom: -90, fontSize: 700, lineHeight: 0.9, color: "transparent", WebkitTextStroke: "3px #FFFFFF", opacity: 0.05, transform: "rotate(5deg)" }}>魂</div>

        <div style={{ position: "absolute", left: 148, top: 128, fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: "#FFFFFFB0" }}>嘻哈魂 / 杨和苏</div>
        <div style={{ position: "absolute", right: 148, top: 128, fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: "#FFFFFF99" }}>KEYNG · LYRIC MV</div>
        <div style={{ position: "absolute", left: 148, top: 196, width: 240, height: 4, background: "#FFFFFF" }} />
        <div style={{ position: "absolute", right: 148, top: 196, width: 240, height: 4, background: "#FFFFFF" }} />

        {/* 主标题：白色三行（段子 punchline） */}
        <div
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 286,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                color: "#FFFFFF",
                textShadow: "0 0 44px rgba(255,255,255,0.14)",
            }}
        >
            <div style={{ fontSize: 160, lineHeight: 1, letterSpacing: 10, whiteSpace: "nowrap" }}>他们一看到我就紧张</div>
            <div style={{ fontSize: 160, lineHeight: 1, letterSpacing: 10, whiteSpace: "nowrap" }}>就像女孩子</div>
            <div style={{ fontSize: 160, lineHeight: 1, letterSpacing: 10, whiteSpace: "nowrap" }}>看到了新郎官</div>
        </div>

        <div style={{ position: "absolute", left: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: "#FFFFFF", opacity: 0.7 }}>38 LINES · 37.7S</div>
        <div style={{ position: "absolute", right: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: "#FFFFFF", opacity: 0.7 }}>1920 × 1080 / 30FPS</div>
    </AbsoluteFill>
);
