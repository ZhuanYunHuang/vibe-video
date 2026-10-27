import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, Fonts, Grain, MONO, Scanlines, Vignette } from "../../styles/lyricmv";
import { T } from "./kit/theme";

// 封面：近黑底 + 冰青光晕 + 巨字 TRAP + 808 柱状
export const Cover: React.FC = () => (
    <AbsoluteFill style={{ overflow: "hidden", background: T.bg, fontFamily: FONT }}>
        <Fonts />

        <AbsoluteFill style={{ background: `radial-gradient(ellipse 62% 54% at 50% 8%, ${T.accent}2A, transparent 72%)` }} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse 46% 38% at 50% 106%, ${T.warm}18, transparent 70%)` }} />
        <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 128px)" }} />
        <AbsoluteFill style={{ backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 64px)" }} />

        {/* 808 柱状 */}
        {[
            { left: 118, h: 300, o: 0.75 },
            { left: 182, h: 440, o: 0.95 },
            { left: 246, h: 210, o: 0.6 },
            { left: 1656, h: 380, o: 0.9 },
            { left: 1720, h: 240, o: 0.65 },
        ].map((b, i) => (
            <div key={i} style={{ position: "absolute", left: b.left, bottom: 96, width: 44, height: b.h, background: T.accent, opacity: b.o }} />
        ))}

        <div style={{ position: "absolute", left: 118, top: 108, fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: T.accent }}>DARK ELECTRONIC / TRAP</div>
        <div style={{ position: "absolute", left: 116, top: 152, fontFamily: FONT, fontSize: 54, letterSpacing: 8, color: T.ink }}>暗黑电子</div>

        <div
            style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 330,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 480,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: T.ink,
                textShadow: `10px 10px 0 ${T.deep}, 0 0 60px ${T.accent}33`,
            }}
        >
            TRAP
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", fontFamily: MONO, fontSize: 22, letterSpacing: 7, color: `${T.ink}99` }}>
            808 · FM PLUCK · SIDECHAIN PAD · 全曲代码合成
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 882, display: "flex", justifyContent: "center", gap: 86, fontFamily: MONO, fontSize: 20, letterSpacing: 4, color: T.ink }}>
            <span>90 BPM</span>
            <span style={{ color: T.accent }}>F MINOR</span>
            <span>64 BARS</span>
            <span>2:52</span>
        </div>

        <div style={{ position: "absolute", left: 120, bottom: 58, fontFamily: MONO, fontSize: 17, letterSpacing: 4, color: `${T.ink}55` }}>1920 × 1080 / 30FPS</div>
        <div style={{ position: "absolute", right: 120, bottom: 58, fontFamily: MONO, fontSize: 17, letterSpacing: 4, color: `${T.ink}55` }}>DARK TRAP / INSTRUMENTAL</div>

        <Scanlines t={0} opacity={0.08} />
        <Grain t={0} opacity={0.1} />
        <Vignette strength={1} />
    </AbsoluteFill>
);
