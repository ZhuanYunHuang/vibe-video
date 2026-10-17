import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Chapter, Grid3D, HingeAssembly, Scene3D, Stage, Subs, Tag, useK, Vo } from "../kit";

// 04 · 材料：三种结构材料 + 四组机械件
export const HingeMat: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const explode = 0.92 + prog(t, K(88), 40) * 0.16;
    return (
        <Stage t={t}>
            <Scene3D fov={34} pos={[3.2, 2.2, 6.0]}>
                <Grid3D />
                <group position={[0, 1.42, 0]} rotation={[0, -0.2 + prog(t, K(88), 90) * 0.4, 0]}>
                    <HingeAssembly explode={explode} open={0.6} />
                </group>
                <CameraRig t={t} keys={[{ at: 0, pos: [3.2, 2.2, 6.0], look: [0, 1.42, 0] }]} />
            </Scene3D>

            <Chapter t={t} step="02" title="三种材料，各管一件事" />

            <Tag t={t} from={K(91)} x={250} y={300} text="5 级钛中框" size={22} color="#2563EB" />
            <Tag t={t} from={K(93)} x={250} y={356} text="碳纤维支撑板" size={22} color="#2563EB" />
            <Tag t={t} from={K(95)} x={250} y={412} text="陶瓷纤维嵌件" size={22} color="#2563EB" />

            <Tag t={t} from={K(96)} x={1470} y={300} text="液态金属转轴" size={22} color="#EA580C" />
            <Tag t={t} from={K(98)} x={1470} y={356} text="双轨齿轮同步" size={22} color="#EA580C" />
            <Tag t={t} from={K(99)} x={1470} y={412} text="微刷排尘" size={22} color="#EA580C" />
            <Tag t={t} from={K(100)} x={1470} y={468} text="3D 打印钛护壳" size={22} color="#EA580C" />

            <Vo from={K(89)} file="vo-07" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
