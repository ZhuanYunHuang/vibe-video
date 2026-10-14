import React from "react";
import { FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { P, useK } from "../kit/theme";
import { InkCard, RedPen, Stage, Sub } from "../kit/ui";
import { Kicks, MechHead, Spark, floatY } from "../kit/mech";

// 拍 256~272 机制②冷读术（fade 入场，重拍卡点 256）：
//   256★页眉 / 258·259·261★ 三个观察小票 / 263 试探气泡（打字机逐字出现）
//   266「现代人压力都大」/ 268 红笔圈「压力」/ 269 金句字幕
export const ColdRead: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const chips = [
        { text: "看穿着", x: 640, b: 258 },
        { text: "看表情", x: 960, b: 259 },
        { text: "听语气", x: 1280, b: 261 },
    ];
    const bubble = "「你最近，是不是压力很大？」";
    const typed = Math.max(0, Math.min(bubble.length, Math.floor((t - K(263)) / 2.6))); // 263 起逐字打出
    const typing = typed > 0 && typed < bubble.length;
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[256]}>
                <MechHead t={t} i={2} name="冷读术" en="COLD READING" />
                {/* 观察三小票（落定后轻浮动） */}
                {chips.map((c) => (
                    <div
                        key={c.text}
                        style={{
                            position: "absolute",
                            left: c.x,
                            top: 440 + (t >= K(c.b) && pop(t, K(c.b), 12) > 0.9 ? floatY(t, c.x) : 0),
                            transform: `translate(-50%, -50%) scale(${t >= K(c.b) ? pop(t, K(c.b), 12) : 0.6})`,
                            opacity: t >= K(c.b) ? 1 : 0,
                            background: P.card,
                            border: `2px solid ${P.ink}`,
                            borderRadius: 40,
                            padding: "12px 34px",
                            fontFamily: FONT,
                            fontSize: 32,
                            fontWeight: 800,
                            color: P.ink,
                        }}
                    >
                        {c.text}
                    </div>
                ))}
                <div style={{ position: "absolute", left: 960, top: 530, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 28, fontWeight: 700, color: P.inkLight, opacity: prog(t, K(262), 10) }}>
                    然后，抛出一句「谁都适用」的话——
                </div>
                {/* 试探气泡（打字机） */}
                <InkCard x={960} y={650} w={780} h={170} appear={t >= K(263) ? pop(t, K(263), 12) : 0}>
                    <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 900, color: P.ink }}>
                        {bubble.slice(0, typed)}
                        {typing ? <span style={{ opacity: t % 16 < 9 ? 1 : 0, color: P.cinnabar }}>▍</span> : null}
                    </div>
                </InkCard>
                <Spark t={t} from={K(263)} x={960} y={650} spread={220} />
                <RedPen t={t} from={K(268)} x={1052} y={650} w={330} h={100} note="谁不是呢" />
                <div style={{ position: "absolute", left: 960, top: 790, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 32, fontWeight: 700, color: P.inkLight, opacity: prog(t, K(266), 12) }}>
                    现代人，压力本来就都大
                </div>
                <Sub t={t} from={K(264)} to={K(268)}>
                    你一点头，他就顺着往下说
                </Sub>
                <Sub t={t} from={K(269)} to={K(274)}>
                    他念的是「所有人的日常」，你听成了「自己的心事」
                </Sub>
            </Kicks>
        </Stage>
    );
};
