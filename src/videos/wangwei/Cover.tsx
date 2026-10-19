import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, Fonts, Grain, MONO, Scanlines, Vignette } from "../../styles/lyricmv";
import { GOLD, INK, THRONE } from "./kit/throne";

// 封面：黑金王座，王位放在金色切角块里
export const Cover: React.FC = () => (
    <AbsoluteFill style={{ background: THRONE.dark.bg, overflow: "hidden", fontFamily: FONT }}>
        <Fonts />
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 58% 50% at 50% 46%, ${GOLD}22, transparent 72%)` }} />

        <div
            style={{
                position: "absolute",
                right: -80,
                top: 120,
                fontFamily: FONT,
                fontSize: 760,
                lineHeight: 0.9,
                color: "transparent",
                WebkitTextStroke: `2px ${GOLD}`,
                opacity: 0.1,
                transform: "rotate(-8deg)",
            }}
        >
            顶
        </div>

        <div style={{ position: "absolute", left: 148, top: 128, fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: `${THRONE.dark.ink}88` }}>王位 / THRONE</div>
        <div style={{ position: "absolute", right: 148, top: 128, fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: GOLD }}>杨和苏KeyNG · VERSE</div>
        <div style={{ position: "absolute", left: 148, top: 196, width: 210, height: 3, background: GOLD }} />
        <div style={{ position: "absolute", right: 148, top: 196, width: 210, height: 3, background: GOLD }} />

        <div style={{ position: "absolute", left: 0, right: 0, top: 372, display: "flex", justifyContent: "center" }}>
            <div
                style={{
                    background: GOLD,
                    padding: "16px 64px 46px",
                    transform: "rotate(-2deg)",
                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 40px), calc(100% - 40px) 100%, 0 100%)",
                    filter: `drop-shadow(0 0 60px ${GOLD}55)`,
                }}
            >
                <span style={{ display: "block", fontSize: 228, lineHeight: 1, letterSpacing: 10, color: INK, whiteSpace: "nowrap" }}>老子在楼顶</span>
            </div>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: MONO, fontSize: 26, letterSpacing: 12, color: `${THRONE.dark.ink}88` }}>
            王位 · 杨和苏KeyNG
        </div>

        <div style={{ position: "absolute", left: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: `${THRONE.dark.ink}55` }}>24 LINES · 46.7S</div>
        <div style={{ position: "absolute", right: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: `${THRONE.dark.ink}55` }}>1920 × 1080 / 30FPS</div>

        <Scanlines t={0} opacity={0.2} />
        <Grain t={0} opacity={0.16} />
        <Vignette />
    </AbsoluteFill>
);
