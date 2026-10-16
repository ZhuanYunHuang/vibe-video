import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, useBeat } from "../../../shared";
import { FONT, MONO, P } from "../../../styles/pixel";
import { activeLine, LYRICS } from "./lyrics";

// 绝对秒 -> 场景内帧：场景卡点接线（sec(49.6) 即该秒在本场景中的帧号）
export const useSec = (start: number) => {
    const beat = useBeat();
    return (s: number) => Math.round(s * FPS) - beat.bf(start);
};

// 像素歌词 HUD：底部对话框（说话人标签 + 逐句 + punchline/key 强调 + ad-lib 小注记）+ 分段进度条。
// punch 行由场景巨字承担，这里跳过；间奏段显示 ♪。
export const LyricHud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const sec = frame / FPS;
    const line = activeLine(sec);
    const adlibs = LYRICS.filter((l) => l.adlib && sec >= l.s && sec < l.e + 0.25);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 4) : 0), 0);
    const segs = 44;
    const progress = Math.min(1, frame / totalFrames);
    const filled = Math.floor(progress * segs);
    const isKey = line?.kind === "key";
    const isPunchline = line?.kind === "punchline";
    const whoColor = line?.who === "lanlao" ? P.gold : P.accent;
    const whoName = line?.who === "lanlao" ? "揽佬" : "天选之子";
    return (
        <>
            {/* 顶部水印 */}
            <div style={{ position: "absolute", left: 64, top: 44, fontFamily: FONT, fontSize: 24, color: `${P.ink}55`, letterSpacing: 6 }}>专升本 · 来财</div>
            <div style={{ position: "absolute", right: 64, top: 44, fontFamily: MONO, fontSize: 20, color: `${P.inkSub}88`, letterSpacing: 3 }}>{`${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`}</div>
            {/* 歌词框 */}
            {line ? (
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 108, display: "flex", justifyContent: "center" }}>
                    <div
                        style={{
                            position: "relative",
                            background: isKey || isPunchline ? "#2E2A18" : P.card,
                            border: `4px solid ${isKey || isPunchline ? P.gold : P.ink}`,
                            boxShadow: `10px 10px 0 #00000066${isKey || isPunchline ? `, 0 0 44px ${P.gold}55` : ""}`,
                            padding: isKey ? "14px 46px" : "12px 36px",
                            minWidth: 520,
                            maxWidth: 1560,
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                            <span style={{ flexShrink: 0, background: whoColor, color: "#10121C", fontFamily: FONT, fontSize: 22, fontWeight: 700, padding: "4px 12px", transform: "translateY(-2px)" }}>{whoName}</span>
                            <span style={{ fontFamily: FONT, fontSize: isKey ? 52 : 38, fontWeight: 700, color: isKey || isPunchline ? P.gold : P.ink, letterSpacing: 2, whiteSpace: "nowrap" }}>{line.text}</span>
                        </div>
                        {/* ad-lib 小注记 */}
                        {adlibs.length ? (
                            <div style={{ position: "absolute", right: -30, top: -34, display: "flex", gap: 10 }}>
                                {adlibs.map((a, i) => (
                                    <span key={i} style={{ background: P.bg, border: `2px solid ${P.gold}`, color: P.gold, fontFamily: FONT, fontSize: 20, padding: "5px 10px", transform: `rotate(${i % 2 ? 4 : -3}deg)` }}>
                                        （{a.adlib}）
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : (
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", fontFamily: FONT, fontSize: 30, color: `${P.inkSub}88`, letterSpacing: 8 }}>♪ ♪ ♪</div>
            )}
            {/* 分段像素进度条 */}
            <div style={{ position: "absolute", left: 130, bottom: 48, display: "flex", gap: 6 }}>
                {Array.from({ length: segs }, (_, i) => (
                    <div key={i} style={{ width: 30, height: 14, background: i < filled ? P.accent : i === filled ? (Math.floor(frame / 6) % 2 ? P.accentLight : P.line) : P.line, opacity: i < filled ? 1 : 0.7 }} />
                ))}
            </div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.05, pointerEvents: "none" }} />
        </>
    );
};
