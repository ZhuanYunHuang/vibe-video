import React from "react";
import { FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { InkCard, RedPen, Stage, Sub } from "../kit/ui";
import { Kicks, MechHead, Slip, Spark } from "../kit/mech";

// 拍 304~320 机制⑤幸存者偏差（blinds 入场，重拍卡点 304）：
//   304△页眉 / 305-310★ 满屏报喜小票（落定后各自轻浮动）/ 310★ 爆点
//   312「没说中的人呢？」/ 314 沉默灰条 / 317★ 金句 + 红笔划
export const Survivor: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const slips = [
        { text: "太神了！", x: 560, y: 420, rot: -4, b: 305 },
        { text: "绝了", x: 880, y: 390, rot: 3, b: 306 },
        { text: "我信了", x: 1220, y: 420, rot: -2, b: 307 },
        { text: "真的准", x: 660, y: 545, rot: 5, b: 308 },
        { text: "这也能算到？", x: 1030, y: 560, rot: -3, b: 309 },
        { text: "发帖 +1", x: 1390, y: 520, rot: 2, b: 310 },
    ];
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[304]}>
                <MechHead t={t} i={5} name="幸存者偏差" en="SURVIVORSHIP BIAS" />
                {slips.map((s) => (
                    <Slip key={s.text} t={t} x={s.x} y={s.y} rot={s.rot} appear={t >= K(s.b) ? pop(t, K(s.b), 10) : 0}>
                        {s.text}
                    </Slip>
                ))}
                <Spark t={t} from={K(310)} x={960} y={620} spread={340} />
                <div style={{ position: "absolute", left: 960, top: 700, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 44, fontWeight: 900, color: P.ink, opacity: prog(t, K(312), 10) }}>
                    那，没说中的人呢？
                </div>
                <InkCard x={960} y={818} w={1040} h={110} appear={t >= K(314) ? pop(t, K(314), 12) : 0}>
                    <div style={{ fontFamily: KAI, fontSize: 38, fontWeight: 900, color: P.inkLight }}>……（他们选择沉默）</div>
                </InkCard>
                <RedPen t={t} from={K(317)} x={960} y={822} w={440} h={26} underline />
                <Sub t={t} from={K(316)} to={K(322)}>
                    你看到的，是被筛选过的「幸存者」
                </Sub>
            </Kicks>
        </Stage>
    );
};
