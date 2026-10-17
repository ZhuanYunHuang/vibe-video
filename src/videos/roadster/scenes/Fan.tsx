import React from "react";
import { Callout, pop, prog, SceneProps, SpeedLines, useT } from "../../../shared";
import { CameraRig, Chapter, Fan3D, Grid3D, Mark, P, Particles, RoadsterModel, Scene3D, Stage, VoSub, Vo, useK } from "../kit";

// 第 4 幕 · 拆解①负压风扇（真 3D）：车体悬浮爆炸 + 车底风扇托板 → 镜头环绕到车尾特写
export const Fan: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const outA = prog(t, K(79), 12);
    const inB = pop(t, K(80), 12);
    const spin = t * 5;
    return (
        <Stage t={t}>
            <Chapter t={t} step="02" title="负压风扇" />
            <Scene3D fov={42} pos={[6.4, 3.6, 8.2]}>
                <Grid3D />
                {/* 车体（爆炸上层） */}
                <group position={[0, 2.02, 0]} rotation={[0, Math.sin(t / 40) * 0.06, 0]}>
                    <RoadsterModel glow={0.35} lights={0.5} />
                </group>
                {/* 风扇托板（爆炸下层） */}
                <group position={[0, 0.62, 0]}>
                    <mesh>
                        <boxGeometry args={[3.6, 0.2, 1.9]} />
                        <meshStandardMaterial color="#242833" metalness={0.4} roughness={0.6} />
                    </mesh>
                    {[[-1.05, -0.45], [1.05, -0.45], [0, 0.52]].map(([fx, fz], i) => (
                        <group key={i} position={[fx, 0.13, fz]}>
                            <Fan3D spin={spin + i * 2} lit={1} />
                        </group>
                    ))}
                </group>
                {/* 爆炸落位引导线 */}
                {[-1.6, 0, 1.6].map((gx) => (
                    <mesh key={gx} position={[gx, 1.5, 0]}>
                        <cylinderGeometry args={[0.012, 0.012, 1.2, 6]} />
                        <meshBasicMaterial color="#FF9E2C" transparent opacity={0.4} />
                    </mesh>
                ))}
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(64), pos: [6.4, 3.6, 8.2], look: [0, 1.5, 0] },
                        { at: K(72), pos: [5.2, 2.8, 8.8], look: [0, 1.5, 0] },
                        { at: K(77), pos: [1.2, 2.6, 9.6], look: [-0.4, 1.3, 0] },
                        { at: K(80), pos: [-5.6, 2.2, 6.6], look: [-1.0, 1.2, 0] },
                        { at: K(88), pos: [-6.2, 2.4, 6.0], look: [-1.0, 1.35, 0] },
                        { at: K(96), pos: [-6.0, 2.6, 6.4], look: [-1.0, 1.4, 0] },
                    ]}
                />
            </Scene3D>
            <div style={{ opacity: 1 - outA }}>
                <Mark t={t} from={K(70)} x={1060} y={640} note="电动涵道风扇" />
            </div>
            <div style={{ opacity: inB }}>
                <Callout t={t} from={K(82)} x={620} y={700} text="集中在车尾" tx={360} ty={770} side="left" color={P.accent} />
            </div>
            <SpeedLines t={t} at={K(80)} cx={880} cy={560} inner={140} outer={460} n={14} color={P.accentLight} />
            <Particles t={t} from={K(64)} x={960} y={560} n={14} spread={260} />
            <VoSub t={t} from={K(64)} file="vo-05" />
            <VoSub t={t} from={K(80)} file="vo-06" />
            <Vo from={K(64)} file="vo-05" />
            <Vo from={K(80)} file="vo-06" />
        </Stage>
    );
};
