import React from "react";
import { FONT, hit, pop, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { InkCard, RedPen, Slam, Stage, Sub } from "../kit/ui";
import { Kicks, Spark } from "../kit/mech";
import { MechHead } from "../kit/mech";

// 拍 240~256 机制①确认偏误（blinds 入场）：
//   240★页眉 / 242 算命卡「你会破财」/ 245 事件卡「手机摔了」/ 247★「准！」砸入
//   249 灰色「没中的」被划掉 / 252 金句字幕
export const Bias: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const strike = prog(t, K(250), 14);
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[240]}>
            <MechHead t={t} i={1} name="确认偏误" en="CONFIRMATION BIAS" />
            {/* 他说 + 应验 */}
            <InkCard x={520} y={580} w={520} h={180} appear={t >= K(242) ? pop(t, K(242), 12) : 0}>
                <div style={{ fontFamily: KAI, fontSize: 38, fontWeight: 900, color: P.ink }}>「你今年，会破财」</div>
            </InkCard>
            <div style={{ position: "absolute", left: 850, top: 580, transform: "translate(-50%, -50%)", fontFamily: FONT, fontSize: 54, fontWeight: 900, color: P.inkLight, opacity: prog(t, K(244), 8) }}>→</div>
            <InkCard x={1140} y={580} w={460} h={180} appear={t >= K(245) ? pop(t, K(245), 12) : 0}>
                <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 800, color: P.ink }}>啪——手机摔了</div>
            </InkCard>
            <Slam t={t} from={K(247)} x={1140} y={710} size={60} color={P.cinnabar} rot={-4}>
                太准了！
            </Slam>
            {/* 没中的：被划掉 */}
            <div style={{ position: "absolute", left: 960, top: 830, transform: "translateX(-50%)", opacity: prog(t, K(249), 12) }}>
                <div style={{ background: P.card, border: `1px solid ${P.fiber}`, borderRadius: 10, padding: "14px 40px", fontFamily: FONT, fontSize: 30, fontWeight: 700, color: P.inkLight }}>
                    「你可能会遇到一点小挫折」
                </div>
            </div>
            <RedPen t={t} from={K(250)} x={960} y={830} w={430} h={30} underline />
            <div style={{ position: "absolute", left: 1260, top: 830, transform: "translateY(-50%)", fontFamily: FONT, fontSize: 28, fontWeight: 700, color: P.inkLight, opacity: strike > 0.6 ? 1 : 0 }}>← 早忘了</div>
            <Sub t={t} from={K(243)} to={K(252)}>
                说中的，记一辈子
            </Sub>
            <Sub t={t} from={K(252)} to={K(258)}>
                你的记忆，只给「说中」的留位置
            </Sub>
            <Spark t={t} from={K(247)} x={1140} y={700} spread={240} />
            <div style={{ position: "absolute", inset: 0, background: P.cinnabar, opacity: hit(t, K(247), 4) * 0.04, pointerEvents: "none" }} />
            </Kicks>
        </Stage>
    );
};
