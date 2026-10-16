import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, useBeat } from "../../../shared";
import { FONT, MONO, useToneNow } from "../../../styles/cyberhud-dual";
import { activeLine, LyricLine, LYRICS } from "./lyrics";

// 绝对秒 -> 场景内帧：场景卡点接线（sec(91) 即该秒在本场景中的帧号）
export const useSec = (start: number) => {
    const beat = useBeat();
    return (s: number) => Math.round(s * FPS) - beat.bf(start);
};

const PART_LABEL: Record<LyricLine["part"], string> = { h1: "HOOK", h2: "HOOK", h3: "HOOK", v1: "VERSE 1", v2: "VERSE 2" };

// 分词：中文逐字、英文单词/数字成组，让卡拉OK高亮扫得自然
const tokens = (s: string) => s.match(/[A-Za-z0-9]+|[^A-Za-z0-9]/g) ?? [];

// 歌词 HUD：整句卡拉OK（逐字高亮）+ 段落标签 + 模式标签 + 分段进度条。
// 顶层组件（不在 Sequence 内），useCurrentFrame 即绝对帧。
export const LyricHud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const P = useToneNow();
    const sec = frame / FPS;
    const line = activeLine(sec);
    const judge = sec >= 87.77;
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 4) : 0), 0);
    const progress = Math.min(1, frame / totalFrames);
    const segs = 30;
    const filled = Math.floor(progress * segs);

    // 整句逐字高亮：钩子句拖得很长，走整句脉动；短句走横扫
    const toks = line ? tokens(line.text) : [];
    const long = line ? line.e - line.s > 4.5 : false;
    const k = line && !long ? Math.min(1, (sec - line.s) / (line.e - line.s)) : 1;

    return (
        <>
            {/* 顶部：曲名 + 段落 + 模式 + 计时 */}
            <div style={{ position: "absolute", left: 64, top: 104, display: "flex", alignItems: "center", gap: 18, fontFamily: FONT }}>
                <span style={{ fontSize: 26, color: `${P.ink}88`, letterSpacing: 6 }}>为了短视频</span>
                {line ? (
                    <span style={{ fontSize: 20, fontWeight: 700, color: P.bg, background: P.accent, padding: "3px 12px", letterSpacing: 3 }}>{PART_LABEL[line.part]}</span>
                ) : null}
            </div>
            <div style={{ position: "absolute", left: 960, top: 104, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 12, fontFamily: MONO }}>
                <span style={{ width: 10, height: 10, background: judge ? P.accent : P.accent, boxShadow: `0 0 12px ${P.accent}`, opacity: Math.floor(frame / 8) % 2 ? 1 : 0.35 }} />
                <span style={{ fontSize: 22, letterSpacing: 4, color: P.accent }}>{judge ? "MODE // JUDGE" : "MODE // OBSERVE"}</span>
            </div>
            <div style={{ position: "absolute", right: 64, top: 104, fontFamily: MONO, fontSize: 20, color: `${P.inkSub}AA`, letterSpacing: 3 }}>
                {`${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`}
            </div>

            {/* 底部：整句歌词 */}
            {line ? (
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 116, display: "flex", justifyContent: "center" }}>
                    <div
                        style={{
                            position: "relative",
                            maxWidth: 1660,
                            padding: "16px 40px",
                            background: `${P.bg}E6`,
                            clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                            boxShadow: `inset 0 0 0 2px ${P.accent}77, 0 0 40px ${P.accent}22`,
                            backdropFilter: "blur(2px)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                            <span style={{ fontFamily: FONT, fontSize: 40, color: P.accent, fontWeight: 700 }}>[</span>
                            {toks.map((tk, i) => {
                                const lit = long ? true : k * toks.length > i;
                                const cur = !long && lit && k * toks.length < i + 1;
                                return (
                                    <span
                                        key={i}
                                        style={{
                                            fontFamily: FONT,
                                            fontSize: 40,
                                            fontWeight: 700,
                                            letterSpacing: 1,
                                            whiteSpace: "pre",
                                            color: lit ? P.ink : `${P.ink}8C`,
                                            textShadow: lit ? `0 0 14px ${P.accent}${cur ? "CC" : "44"}` : `0 0 6px ${P.bg}CC`,
                                            transform: cur ? "translateY(-3px)" : undefined,
                                            display: "inline-block",
                                            transition: "none",
                                        }}
                                    >
                                        {tk}
                                    </span>
                                );
                            })}
                            <span style={{ fontFamily: FONT, fontSize: 40, color: P.accent, fontWeight: 700 }}>]</span>
                        </div>
                        {/* 本句进度条 */}
                        <div style={{ position: "absolute", left: 40, right: 40, bottom: 8, height: 3, background: `${P.line}` }}>
                            <div style={{ width: `${(long ? Math.min(1, (sec - line.s) / (line.e - line.s)) : k) * 100}%`, height: "100%", background: P.accent, boxShadow: `0 0 10px ${P.accent}` }} />
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 130, textAlign: "center", fontFamily: MONO, fontSize: 26, color: `${P.inkSub}77`, letterSpacing: 10 }}>[ NO SIGNAL ]</div>
            )}

            {/* 底部：分段进度条 */}
            <div style={{ position: "absolute", left: 130, bottom: 44, display: "flex", alignItems: "center", gap: 12, fontFamily: MONO }}>
                <span style={{ color: P.accent, fontSize: 28 }}>[</span>
                {Array.from({ length: segs }, (_, i) => (
                    <div
                        key={i}
                        style={{
                            width: 30,
                            height: 11,
                            background: i < filled ? P.accent : i === filled ? (Math.floor(frame / 5) % 2 ? P.accentLight : P.line) : P.line,
                            opacity: i < filled ? 1 : 0.6,
                            boxShadow: i < filled ? `0 0 8px ${P.accent}66` : undefined,
                        }}
                    />
                ))}
                <span style={{ color: P.accent, fontSize: 28 }}>]</span>
                <span style={{ color: P.ink, fontSize: 24 }}>{Math.round(progress * 100)}%</span>
            </div>

            {/* 全片行数刻度（右下） */}
            <div style={{ position: "absolute", right: 64, bottom: 48, fontFamily: MONO, fontSize: 20, color: `${P.inkSub}99`, letterSpacing: 2 }}>
                {`LINE ${String(LYRICS.indexOf(line as LyricLine) + 1).padStart(2, "0")} / ${String(LYRICS.length).padStart(2, "0")}   •   ${judge ? "ALERT" : "TRACK"}`}
            </div>

            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.05, pointerEvents: "none" }} />
        </>
    );
};
