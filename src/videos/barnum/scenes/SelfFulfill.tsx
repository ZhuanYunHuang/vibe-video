import React from "react";
import { FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { P, useK } from "../kit/theme";
import { InkCard, Slam, Stage, Sub } from "../kit/ui";
import { Kicks, MechHead, Spark, floatY } from "../kit/mech";

// 拍 272~288 机制③自我实现预言（diag 入场，重拍卡点 272）：
//   272△页眉 / 274 台词卡 / 276★·278·280 三个动作小票（落定后轻浮动）/ 283「真的分了」
//   286★ 金句「不是他算得准，是你按着剧本演了」+ 爆点
export const SelfFulfill: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const acts = [
        { text: "开始多疑", x: 660, b: 276 },
        { text: "翻聊天记录", x: 960, b: 278 },
        { text: "为小事吵架", x: 1260, b: 280 },
    ];
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[272]}>
                <MechHead t={t} i={3} name="自我实现预言" en="SELF-FULFILLING PROPHECY" />
                <InkCard x={960} y={430} w={880} h={150} appear={t >= K(274) ? pop(t, K(274), 12) : 0}>
                    <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, color: P.ink }}>「你们这段感情，会出问题。」</div>
                </InkCard>
                {acts.map((a, i) => (
                    <div
                        key={a.text}
                        style={{
                            position: "absolute",
                            left: a.x,
                            top: 600 + (t >= K(a.b) && pop(t, K(a.b), 12) > 0.9 ? floatY(t, a.x) : 0),
                            transform: `translate(-50%, -50%) rotate(${i % 2 === 0 ? -2 : 2}deg) scale(${t >= K(a.b) ? pop(t, K(a.b), 12) : 0.6})`,
                            opacity: t >= K(a.b) ? 1 : 0,
                            background: P.card,
                            border: `2px solid ${P.ink}`,
                            borderRadius: 12,
                            padding: "14px 36px",
                            fontFamily: FONT,
                            fontSize: 32,
                            fontWeight: 800,
                            color: P.ink,
                        }}
                    >
                        {a.text}
                    </div>
                ))}
                <div style={{ position: "absolute", left: 960, top: 710, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 40, fontWeight: 800, color: P.ink, opacity: prog(t, K(283), 10) }}>
                    最后——真的分了
                </div>
                <Slam t={t} from={K(286)} x={960} y={830} size={46} rot={-2}>
                    不是他算得准，是<span style={{ color: P.cinnabar }}>你按着剧本演了</span>
                </Slam>
                <Spark t={t} from={K(286)} x={960} y={830} spread={300} />
                <Sub t={t} from={K(275)} to={K(284)}>
                    从那天起，你开始「盯」着这段感情
                </Sub>
            </Kicks>
        </Stage>
    );
};
