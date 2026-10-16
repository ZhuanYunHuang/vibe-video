import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { DataStream, Fade, Label, LanlaoVoice, Marquee, Person, Scene, Slam, Stage, WaveBars, useK, useSec, useToneAt } from "../kit";

// 幕 13 · 副歌收束（拍 400-448 / 137.14-153.60s）：红调洪流裹挟所有人形。
export const Hook3: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const l1 = sec(137.15);
    const l2 = sec(147.2);

    // 洪流裹挟的人形：一排轮廓横向被推走
    const crowd = Array.from({ length: 14 }, (_, i) => ({
        x: (((i * 176 - t * 3.2) % 2200) + 2200) % 2200 - 140,
        y: 620 + ((i * 97) % 180),
        h: 150 + ((i * 53) % 90),
    }));

    return (
        <Scene start={start}>
            <Stage t={t}>
                <DataStream t={t} x={0} y={0} w={1920} h={1080} n={50} />
                <DataStream t={t} x={0} y={0} w={1920} h={1080} n={30} reverse />

                {/* 人形洪流 */}
                {crowd.map((c, i) => (
                    <Person key={i} x={c.x} y={c.y} h={c.h} opacity={0.5 + prog(t, i * 3, 30) * 0.4} />
                ))}

                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${P.bg}00 30%, ${P.bg}BB 78%)` }} />

                <Slam t={t} from={l1} x={960} y={300} size={96}>为了短视频</Slam>
                <Slam t={t} from={l1 + 36} x={960} y={440} size={54} color={P.gold}>没有什么不能做</Slam>

                <Fade t={t} from={l2 - 10}>
                    <Slam t={t} from={l2} x={960} y={790} size={70}>为了流量 · 没有什么不能做</Slam>
                </Fade>

                <Marquee t={t} y={930} text="FOR THE SHORT VIDEO · 为了短视频 ·" size={42} speed={6} opacity={0.6} />
                <WaveBars t={t} x={520} y={880} w={880} h={54} n={40} boost={0.7} />

                <Label t={t} from={K(400) + 8} x={140} y={150} text="HOOK FINAL // 无人退出" size={22} color={P.seal} />
                <Label t={t} from={K(432) + 8} x={140} y={186} text="EVERYONE IN THE FEED" size={22} />

                {/* 拍 406（139.2s / 2:19）起：揽佬旁白，与副歌并行——他在说话，但没有歌词 */}
                <LanlaoVoice t={t} from={K(406)} x={1372} y={210} size={430} />
            </Stage>
        </Scene>
    );
};
