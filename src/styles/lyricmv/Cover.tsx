import React from "react";
import { Fonts } from "./Fonts";
import { GhostLine, Grain, Scanlines, Vignette } from "./frame";
import { FONT, MONO, P, fitSize } from "./theme";

// 封面工厂：近黑底 + 血红切角标题带 + 编号徽章；静态帧，无 beat hook。
export const makeCover = (o: { title: string; subtitle?: string; badge?: string }): React.FC => {
    const Cover: React.FC = () => {
        const size = fitSize(o.title, 1350, 230);
        const paper = P.extra?.paper ?? "#F2EDE3";
        return (
            <div style={{ position: "absolute", inset: 0, background: P.bg, overflow: "hidden", fontFamily: FONT }}>
                <Fonts />
                <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 58% 50% at 50% 46%, ${P.accentDeep}77, transparent 72%)` }} />
                <GhostLine t={0} text={o.title} size={430} x={-90} y={620} rot={-4} opacity={0.05} />

                <div style={{ position: "absolute", left: 148, top: 128, fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: `${P.ink}88` }}>歌词 MV / LYRIC MV</div>
                <div style={{ position: "absolute", right: 148, top: 128, fontFamily: MONO, fontSize: 20, letterSpacing: 6, color: P.accent }}>STYLE KIT</div>
                <div style={{ position: "absolute", left: 148, top: 196, width: 210, height: 3, background: P.accent }} />
                <div style={{ position: "absolute", right: 148, top: 196, width: 210, height: 3, background: P.accent }} />

                <div style={{ position: "absolute", left: 0, right: 0, top: 372, display: "flex", justifyContent: "center" }}>
                    <div
                        style={{
                            background: P.accent,
                            padding: "18px 64px 42px",
                            transform: "rotate(-2deg)",
                            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 36px), calc(100% - 36px) 100%, 0 100%)",
                            filter: `drop-shadow(0 0 55px ${P.accent}55)`,
                        }}
                    >
                        <span style={{ display: "block", fontSize: size, lineHeight: 1, letterSpacing: 6, color: P.ink, whiteSpace: "nowrap" }}>{o.title}</span>
                    </div>
                </div>

                {o.subtitle ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: 8, color: P.inkSub }}>{o.subtitle}</div>
                ) : null}

                {o.badge ? (
                    <div
                        style={{
                            position: "absolute",
                            right: 148,
                            top: 236,
                            width: 150,
                            height: 150,
                            background: paper,
                            transform: "rotate(4deg)",
                            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: MONO,
                            fontSize: 54,
                            letterSpacing: 4,
                            color: P.accent,
                        }}
                    >
                        {o.badge}
                    </div>
                ) : null}

                <div style={{ position: "absolute", left: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: `${P.ink}55` }}>歌词 MV · LYRIC MV</div>
                <div style={{ position: "absolute", right: 148, bottom: 118, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: `${P.ink}55` }}>1920 × 1080 / 30FPS</div>

                <Scanlines t={0} opacity={0.2} />
                <Grain t={0} opacity={0.16} />
                <Vignette />
            </div>
        );
    };
    Cover.displayName = "LyricMvCover";
    return Cover;
};
