import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Grid3D, PhoneModel, Scene3D, Slam, Stage, Subs, Tag, useK, Vo } from "../kit";

// 05 · 战场转移：铰链只给半径，屏幕才是要活着穿过半径的东西
export const Turn: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const stress = prog(t, K(108), 40);
    const dark = prog(t, K(104), 20);
    return (
        <Stage t={t}>
            <Scene3D fov={32} pos={[2.2, 1.9, 4.4]} bg="#E9EFF8">
                <Grid3D />
                <group position={[0, 1.24, 0]} rotation={[0, -0.28, 0]}>
                    <PhoneModel open={1} stress={stress} hinge={false} />
                </group>
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(104), pos: [3.4, 2.4, 6.2], look: [0, 1.24, 0] },
                        { at: K(110), pos: [2.4, 1.9, 4.4], look: [0, 1.24, 0] },
                        { at: K(116), pos: [1.3, 1.55, 3.0], look: [0, 1.24, 0] },
                        { at: K(120), pos: [1.2, 1.52, 2.9], look: [0, 1.24, 0] },
                    ]}
                />
            </Scene3D>

            <div style={{ position: "absolute", inset: 0, background: "#08090C", opacity: dark * 0.42, pointerEvents: "none" }} />
            <Tag t={t} from={K(108)} x={1290} y={300} text="折线应力集中" size={26} color="#FF4D4D" />
            <Tag t={t} from={K(111)} x={1290} y={346} text="表面起皱 · 层间被拉扯" size={20} color="#5A6474" />
            <Slam t={t} from={K(114)} x={960} y={880} size={72} color="#DC2626">铰链只是上半场</Slam>
            <Vo from={K(105)} file="vo-08" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
