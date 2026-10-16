import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { BoltCityWalk, EmotionMeter, Fade, Label, Scene, Slam, Stage, useK, useSec, useToneAt } from "../kit";

// 幕 6 · 情绪是货币 + 博尔特 city walk vs 算法（拍 160-176 / 54.86-60.34s）。
export const Currency: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const emo = sec(54.66); // 「情绪是种货币，挑拨对立，像个电闸」
    const bolt = sec(57.4); // 「博尔特最多是 city walk，可算法 run the world」
    const on = prog(t, emo + 70, 20); // 电闸拉下

    return (
        <Scene start={start}>
            <Stage t={t}>
                {/* 情绪 → 货币 + 对立电闸 */}
                <Fade t={t} from={emo - 6} to={bolt + 16}>
                    <Slam t={t} from={emo} x={960} y={180} size={48}>情绪是种货币 · 挑拨对立 · 像个电闸</Slam>
                    <EmotionMeter t={t} from={emo + 6} x={760} y={300} w={620} on={on} />
                </Fade>

                {/* 博尔特在 city walk，算法 run the world */}
                <Fade t={t} from={bolt - 4}>
                    <Slam t={t} from={bolt} x={960} y={196} size={46}>博尔特最多是 city walk · 可算法 run the world</Slam>
                    <BoltCityWalk t={t} from={bolt + 4} x={300} y={280} w={1320} h={580} />
                </Fade>

                <Label t={t} from={K(160) + 8} x={140} y={150} text={`EMOTION EXCHANGE // SPREAD ${(prog(t, K(160), 150) * 340).toFixed(0)}%`} size={20} />
                <Label t={t} from={K(168) + 8} x={140} y={186} text="ALGORITHM: RUNNING THE WORLD" size={20} color={P.accent} />
            </Stage>
        </Scene>
    );
};
