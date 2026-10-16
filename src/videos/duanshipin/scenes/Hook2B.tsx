import React from "react";
import { SceneProps, useT } from "../../../shared";
import { Fade, Label, Person, Scene, Slam, Stage, TargetLock, WaveBars, useK, useSec, useToneAt } from "../kit";

// 幕 9 · 判决预备（拍 240-256 / 82.29-87.77s）：数据洪流收束，雷达逐个锁定人形，为全场刷红做铺垫。
export const Hook2B: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const c1 = K(240); // 82.29
    const c2 = K(244); // 83.66
    const c3 = K(248); // 85.03
    const c4 = K(252); // 86.40
    const l2 = sec(78.8); // 「为了流量」仍在唱

    return (
        <Scene start={start}>
            <Stage t={t}>
                <Slam t={t} from={Math.max(0, l2 - 8)} x={960} y={200} size={62}>为了流量 · 没有什么不能做</Slam>

                {/* 被锁定的人形 */}
                {[
                    { x: 420, y: 620, b: c1, label: "TARGET_01" },
                    { x: 760, y: 640, b: c2, label: "TARGET_02" },
                    { x: 1100, y: 620, b: c3, label: "TARGET_03" },
                    { x: 1440, y: 640, b: c4, label: "TARGET_04" },
                ].map((o, i) => (
                    <Fade key={i} t={t} from={o.b}>
                        <Person x={o.x} y={o.y} h={190} />
                        <TargetLock t={t} from={o.b} x={o.x} y={o.y} w={190} h={280} label={o.label} />
                    </Fade>
                ))}

                <WaveBars t={t} x={520} y={880} w={880} h={56} n={40} boost={0.7} />

                <Label t={t} from={K(248) + 10} x={960} y={860} text="SCANNING · 100% · 准备执行" size={28} align="center" color={P.seal} />
                <Label t={t} from={K(252) + 6} x={140} y={150} text="JUDGMENT MODE INCOMING" size={22} color={P.seal} />
            </Stage>
        </Scene>
    );
};
