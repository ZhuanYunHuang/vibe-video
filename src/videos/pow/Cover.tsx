import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, Fonts, Grain, MONO } from "../../styles/lyricmv";
import { INK_DARK_BG } from "./kit/theme";

// 封面（静态 Still）：与上传的《POW》封面同款语言 —— 炭黑磨砂底 + 荧光绿斜杠 + 白 brush「POW!!」
export const Cover: React.FC = () => (
    <AbsoluteFill style={{ overflow: "hidden", fontFamily: FONT, background: INK_DARK_BG }}>
        <Fonts />

        {/* 炭黑磨砂 + 斜纹 */}
        <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0 3px, transparent 3px 34px)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 74% 62% at 50% 46%, rgba(255,255,255,0.07), transparent 72%)" }} />

        {/* 斜向绿斜杠（封面主视觉） */}
        {[
            { left: -260, top: 120, w: 1700, h: 22, rot: -19, o: 0.95 },
            { left: 560, top: 380, w: 1500, h: 14, rot: -12, o: 0.75 },
            { left: -180, top: 700, w: 1400, h: 26, rot: -24, o: 0.9 },
            { left: 620, top: 900, w: 1500, h: 16, rot: -8, o: 0.6 },
        ].map((s, i) => (
            <div
                key={i}
                style={{
                    position: "absolute",
                    left: s.left,
                    top: s.top,
                    width: s.w,
                    height: s.h,
                    background: "linear-gradient(90deg, transparent, #4AFF00 30%, #4AFF00 72%, transparent)",
                    opacity: s.o,
                    transform: `rotate(${s.rot}deg)`,
                    filter: "blur(0.5px)",
                }}
            />
        ))}

        {/* 顶部白条：三位艺人 */}
        <div style={{ position: "absolute", left: 430, top: 96, width: 1060, height: 74, background: "#FFFFFF", transform: "skewX(-8deg)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center", fontSize: 40, letterSpacing: 6, color: "#0A0A0A" }}>黄旭 | 杨和苏 KeyNG | VaVa 毛衍七</div>

        {/* 主标题 POW!!（白 brush + 磨边） */}
        <div
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 250,
                textAlign: "center",
                fontSize: 520,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#FFFFFF",
                WebkitTextStroke: "4px rgba(255,255,255,0.4)",
                textShadow: "0 0 70px rgba(74,255,0,0.22)",
                transform: "rotate(-4deg)",
            }}
        >
            POW!!
        </div>

        {/* 边角小字（加暗底，避免被绿斜杠压住看不清） */}
        <div style={{ position: "absolute", left: 148, top: 200, padding: "6px 14px", background: "rgba(10,10,10,0.62)", fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: "#F2F2F2" }}>POW / LYRIC MV</div>
        <div style={{ position: "absolute", right: 148, top: 200, padding: "6px 14px", background: "rgba(10,10,10,0.62)", fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: "#F2F2F2" }}>SNIPER · WALL · SHOT</div>
        <div style={{ position: "absolute", left: 148, top: 268, width: 240, height: 4, background: "#4AFF00" }} />
        <div style={{ position: "absolute", right: 148, top: 268, width: 240, height: 4, background: "#4AFF00" }} />

        <div style={{ position: "absolute", left: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: "#F2F2F2", opacity: 0.7 }}>42 LINES · 71.7S</div>
        <div style={{ position: "absolute", right: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: "#F2F2F2", opacity: 0.7 }}>1920 × 1080 / 30FPS</div>

        <Grain t={0} opacity={0.14} />
    </AbsoluteFill>
);
