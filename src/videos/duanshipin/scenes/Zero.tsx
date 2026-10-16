import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { Label, LanlaoVoice, Scene, Shutdown, Stage, Ticks, useK, useSec, useToneAt } from "../kit";

// 幕 14 · 归零（拍 448-480 / 153.60-164.57s）：HUD 逐条关闭 → 进度条走满 → SIGNAL LOST → 只剩一个光标。
export const Zero: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const off = sec(155.2); // 逐条关闭
    const lost = sec(161.6); // 信号丢失（歌词结束后）
    const dark = prog(t, lost, 30);
    const segs = 34;
    const filled = Math.round(prog(t, off - 10, 96) * segs);

    return (
        <Scene start={start}>
            <Stage t={t}>
                <Ticks x={300} y={240} w={1320} n={44} h={18} />

                <Shutdown
                    t={t}
                    from={off}
                    x={520}
                    y={360}
                    lineH={44}
                    size={28}
                    lines={["HUD: CLOSING LYRIC LAYER", "HUD: CLOSING METRICS LAYER", "HUD: CLOSING JUDGMENT LAYER", "SYSTEM: NO EXIT FOUND"]}
                />

                {/* 进度条走满 */}
                <div style={{ position: "absolute", left: 520, top: 640, display: "flex", gap: 6 }}>
                    {Array.from({ length: segs }, (_, i) => (
                        <div key={i} style={{ width: 22, height: 12, background: i < filled ? P.accent : P.line, opacity: i < filled ? 1 : 0.6, boxShadow: i < filled ? `0 0 8px ${P.accent}66` : undefined }} />
                    ))}
                </div>
                <Label t={t} from={off + 30} x={520} y={686} text={`FORMATTING COMPLETE · ${Math.round(prog(t, off - 10, 96) * 100)}%`} size={22} color={P.gold} />

                {/* 信号丢失后全黑 + 光标 */}
                <div style={{ position: "absolute", inset: 0, background: "#000000", opacity: dark * 0.96 }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, opacity: prog(t, lost + 8, 16), paddingRight: 460 }}>
                    <div style={{ fontFamily: '"Consolas",monospace', fontSize: 78, fontWeight: 700, color: P.seal, letterSpacing: 12, textShadow: `0 0 34px ${P.seal}88` }}>SIGNAL LOST</div>
                    <div style={{ fontFamily: '"Consolas",monospace', fontSize: 24, color: `${P.inkSub}` , letterSpacing: 6 }}>为了短视频 · 没有什么不能做</div>
                    <div style={{ width: 22, height: 34, background: P.ink, opacity: Math.floor(t / 8) % 2 ? 1 : 0.05, marginTop: 10 }} />
                </div>

                {/* 揽佬旁白：黑屏之上继续说话——机器停了，人还在说（从 Hook3 幕延续，from 取负值保证无闪断） */}
                <LanlaoVoice t={t} from={-40} x={1410} y={230} size={400} />

                <Label t={t} from={K(448) + 4} x={140} y={150} text="SHUTDOWN SEQUENCE" size={20} />
                <Label t={t} from={lost + 40} x={140} y={700} text="// 画面已归零 · 旁白仍在继续" size={22} color={P.gold} />
            </Stage>
        </Scene>
    );
};
