import React from "react";
import { FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { InkCard, Seal, Stage, Sub } from "../kit/ui";
import { Kicks, MechHead, Spark, floatY } from "../kit/mech";

// 拍 288~304 机制④控制感（fade 入场，重拍卡点 288）：
//   288★页眉 / 290★ 两张小票「焦虑」「不确定」（落定后轻浮动）+ 中间摇晃的「？」
//   292-294 两句铺垫 / 296★ 卡片「我知道，接下来会怎样」+ 印「确定」+ 爆点（？定住）
//   300 金句
export const Control: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const chips = [
        { text: "焦虑", x: 820, rot: -3 },
        { text: "不确定", x: 1100, rot: 3 },
    ];
    // 296 拍「确定」落下前，问号一直在晃
    const settle = prog(t, K(296), 12);
    const wobble = Math.sin(t / 3.4) * 14 * (1 - settle);
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[288]}>
                <MechHead t={t} i={4} name="控制感" en="NEED FOR CONTROL" />
                {chips.map((c) => (
                    <div
                        key={c.text}
                        style={{
                            position: "absolute",
                            left: c.x,
                            top: 440 + (t >= K(290) && pop(t, K(290), 12) > 0.9 ? floatY(t, c.x) : 0),
                            transform: `translate(-50%, -50%) rotate(${c.rot}deg) scale(${t >= K(290) ? pop(t, K(290), 12) : 0.6})`,
                            opacity: t >= K(290) ? 1 : 0,
                            background: P.cinnabar,
                            borderRadius: 12,
                            padding: "12px 40px",
                            fontFamily: KAI,
                            fontSize: 42,
                            fontWeight: 900,
                            color: P.card,
                        }}
                    >
                        {c.text}
                    </div>
                ))}
                {/* 中间摇晃的「？」：296 拍被「确定」定住 */}
                {t >= K(290) ? (
                    <div
                        style={{
                            position: "absolute",
                            left: 960,
                            top: 430,
                            transform: `translate(-50%, -50%) rotate(${wobble}deg) scale(${1 + (1 - settle) * 0.06 * Math.sin(t / 5)})`,
                            opacity: prog(t, K(290), 10),
                            fontFamily: KAI,
                            fontSize: 96,
                            fontWeight: 900,
                            color: P.inkLight,
                        }}
                    >
                        ？
                    </div>
                ) : null}
                <div style={{ position: "absolute", left: 960, top: 560, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 36, fontWeight: 800, color: P.ink, opacity: prog(t, K(292), 10), whiteSpace: "nowrap" }}>
                    因为「不知道」，太难受了
                </div>
                <div style={{ position: "absolute", left: 960, top: 640, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 34, fontWeight: 700, color: P.inkLight, opacity: prog(t, K(294), 10), whiteSpace: "nowrap" }}>
                    于是算命递来一句——
                </div>
                <InkCard x={960} y={750} w={920} h={140} appear={t >= K(296) ? pop(t, K(296), 12) : 0}>
                    <div style={{ fontFamily: KAI, fontSize: 44, fontWeight: 900, color: P.ink }}>「我知道，接下来会怎样」</div>
                </InkCard>
                <Seal t={t} from={K(298)} x={1560} y={750} text="确定" size={110} rot={-5} />
                <Spark t={t} from={K(296)} x={960} y={750} spread={280} />
                <div style={{ position: "absolute", left: 960, top: 868, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 32, fontWeight: 700, color: P.inkLight, opacity: prog(t, K(300), 12), whiteSpace: "nowrap" }}>
                    未必是真的，但焦虑先松了一口气
                </div>
                <Sub t={t} from={K(289)} to={K(299)}>
                    你买的不是预言，是安心
                </Sub>
            </Kicks>
        </Stage>
    );
};
