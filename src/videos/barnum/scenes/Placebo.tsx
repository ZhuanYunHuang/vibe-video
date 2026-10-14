import React from "react";
import { FONT, pop, prog, SceneProps, useBeat, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Slam, Stage, Sub } from "../kit/ui";
import { Kicks, MechHead, Spark } from "../kit/mech";

// 拍 320~336 机制⑥安慰剂效应（fade 入场，重拍卡点 320）：
//   320△页眉 / 322★-328 四步链条：相信 → 放松 → 行为改变 → 好转（箭头逐拍脉冲传导）
//   332「起作用的不一定是命」/ 334★ 金句 + 爆点
export const Placebo: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const beat = useBeat();
    // 沿链条传导的拍脉冲：每个元素比前一个晚 4 帧
    const wave = (i: number) => beat.beatPulse(beat.bf(start) + t - i * 4);
    const steps = [
        { text: "相信", x: 480, b: 322 },
        { text: "放松", x: 800, b: 324 },
        { text: "行为改变", x: 1140, b: 326 },
        { text: "好转", x: 1480, b: 328 },
    ];
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[320]}>
                <MechHead t={t} i={6} name="安慰剂效应" en="PLACEBO EFFECT" />
                {steps.map((s, i) => (
                    <React.Fragment key={s.text}>
                        <div
                            style={{
                                position: "absolute",
                                left: s.x,
                                top: 560,
                                transform: `translate(-50%, -50%) scale(${(t >= K(s.b) ? pop(t, K(s.b), 12) : 0.6) * (1 + wave(i) * 0.05)})`,
                                opacity: t >= K(s.b) ? 1 : 0,
                                background: i === 3 ? P.cinnabar : P.card,
                                border: `2px solid ${i === 3 ? P.cinnabar : P.ink}`,
                                borderRadius: 44,
                                padding: "14px 38px",
                                fontFamily: KAI,
                                fontSize: 36,
                                fontWeight: 900,
                                color: i === 3 ? P.card : P.ink,
                                whiteSpace: "nowrap",
                            }}
                        >
                            {s.text}
                        </div>
                        {i < 3 ? (
                            <div style={{ position: "absolute", left: (s.x + steps[i + 1].x) / 2, top: 560, transform: "translate(-50%, -50%)", fontFamily: FONT, fontSize: 44, fontWeight: 900, color: P.inkLight, opacity: prog(t, K(s.b + 1), 8) * (0.5 + 0.5 * wave(i)) }}>
                                →
                            </div>
                        ) : null}
                    </React.Fragment>
                ))}
                <div style={{ position: "absolute", left: 960, top: 720, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 40, fontWeight: 800, color: P.ink, opacity: prog(t, K(332), 10) }}>
                    起作用的不一定是命——
                </div>
                <Slam t={t} from={K(334)} x={960} y={830} size={52} color={P.cinnabar} rot={-1}>
                    是你的信念，和行为
                </Slam>
                <Spark t={t} from={K(334)} x={960} y={830} spread={300} />
                <Sub t={t} from={K(323)} to={K(333)}>
                    信了之后，连身体都会配合
                </Sub>
            </Kicks>
        </Stage>
    );
};
