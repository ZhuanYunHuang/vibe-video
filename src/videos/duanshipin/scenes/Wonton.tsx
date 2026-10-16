import React from "react";
import { SceneProps, useT } from "../../../shared";
import { Fade, GiftRain, Label, Scene, Slam, Stage, TowerGut, WontonBowl, useK, useSec, useToneAt } from "../kit";

// 幕 7 · 礼物雨 → 辣馄饨 → 通天塔与胃（拍 176-208 / 60.34-71.31s）。
export const Wonton: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const gift = sec(60.14); // 礼物别刷得抠，我的家人们
    const bowl = sec(62.89); // 流量不是普通蛋糕，它是碗辣馄饨
    const tower = sec(65.63); // 想吃这口饭，确保你胃比通天塔更深

    return (
        <Scene start={start}>
            <Stage t={t}>
                {/* 直播礼物雨：跑车 / 嘉年华 / 火箭 / 小心心 / 礼盒 */}
                <Fade t={t} from={gift - 8} to={bowl + 10}>
                    <GiftRain t={t} from={gift} x={0} y={0} w={1920} h={880} />
                    <Slam t={t} from={gift} x={960} y={220} size={50}>礼物别刷得抠 · 我的家人们</Slam>
                    <Label t={t} from={gift + 40} x={440} y={700} text={`GMV ¥ ${(128000 + K(184) * 96).toLocaleString()}   •   家人们 12,904`} size={28} align="center" color={P.gold} />
                </Fade>

                {/* 辣馄饨 */}
                <Fade t={t} from={bowl - 6} to={tower + 6}>
                    <Slam t={t} from={bowl} x={960} y={210} size={50}>流量不是普通蛋糕 · 它是碗辣馄饨</Slam>
                    <WontonBowl t={t} from={bowl + 8} x={960} y={600} r={230} />
                </Fade>

                {/* 通天塔 vs 胃 */}
                <Fade t={t} from={tower - 6}>
                    <Slam t={t} from={tower} x={960} y={182} size={50}>想吃这口饭 · 确保你胃比通天塔更深</Slam>
                    <TowerGut t={t} from={tower + 6} x={580} y={300} h={620} />
                </Fade>
            </Stage>
        </Scene>
    );
};
