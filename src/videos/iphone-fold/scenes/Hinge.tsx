import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Chapter, Grid3D, HingeAssembly, Readout, Scene3D, Stage, Subs, Tag, TorqueCurve, useK, Vo } from "../kit";

// 03 · 铰链：一百多个零件，可变扭矩
export const Hinge: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const explode = prog(t, K(58), 48);
    const angle = 0.35 + prog(t, K(72), 60) * 0.65;
    return (
        <Stage t={t}>
            <Scene3D fov={34} pos={[3.2, 2.2, 4.8]}>
                <Grid3D />
                <group position={[0, 1.42, 0]} rotation={[0, -0.3, 0]}>
                    <HingeAssembly explode={explode} open={angle} />
                </group>
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(56), pos: [3.4, 2.3, 5.2], look: [0, 1.42, 0] },
                        { at: K(68), pos: [2.4, 2.0, 4.6], look: [0, 1.42, 0] },
                        { at: K(80), pos: [-0.4, 2.2, 5.0], look: [0, 1.42, 0] },
                        { at: K(88), pos: [0.6, 2.0, 4.8], look: [0, 1.42, 0] },
                    ]}
                />
            </Scene3D>

            <Chapter t={t} step="02" title="一百多个零件，只为停在任意角度" />
            <Readout t={t} from={K(64)} x={1560} y={330} value="100+" unit="件" label="铰链零件数" size={76} />
            <TorqueCurve t={t} from={K(74)} x={1180} y={600} w={430} h={190} />
            <Tag t={t} from={K(78)} x={1180} y={556} text="可变扭矩 · 90° / 135° 悬停" size={22} color="#EA580C" />
            <Vo from={K(57)} file="vo-05" />
            <Vo from={K(72)} file="vo-06" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
