import React from "react";
import { pop, SceneProps, Shockwave, useT } from "../../../shared";
import { CameraRig, Chapter, Grid3D, Mark, P, RoadsterModel, Scene3D, Stage, VoSub, Vo, useK } from "../kit";

// 第 5 幕 · 拆解②密封裙边（真 3D）：裙边框架合拢封住车底，密封成立
export const Skirt: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sealed = pop(t, K(112), 12);
    const frameY = 0.72 + (1.9 - 0.72) * sealed;
    return (
        <Stage t={t}>
            <Chapter t={t} step="03" title="密封裙边" />
            <Scene3D fov={42} pos={[5.8, 3.2, 8.6]}>
                <Grid3D />
                <group position={[0, 2.02, 0]} rotation={[0, Math.sin(t / 44) * 0.06, 0]}>
                    <RoadsterModel glow={0.25 + 0.65 * Math.min(1, sealed)} lights={0.5} />
                </group>
                {/* 裙边框架（可升降） */}
                <group position={[0, frameY, 0]}>
                    <mesh position={[0, 0, 0.97]}>
                        <boxGeometry args={[4.36, 0.46, 0.12]} />
                        <meshStandardMaterial color="#C66A0E" metalness={0.6} roughness={0.35} emissive="#FF9E2C" emissiveIntensity={0.3} />
                    </mesh>
                    <mesh position={[0, 0, -0.97]}>
                        <boxGeometry args={[4.36, 0.46, 0.12]} />
                        <meshStandardMaterial color="#C66A0E" metalness={0.6} roughness={0.35} emissive="#FF9E2C" emissiveIntensity={0.3} />
                    </mesh>
                    <mesh position={[2.18, 0, 0]}>
                        <boxGeometry args={[0.12, 0.46, 2.06]} />
                        <meshStandardMaterial color="#C66A0E" metalness={0.6} roughness={0.35} emissive="#FF9E2C" emissiveIntensity={0.3} />
                    </mesh>
                    <mesh position={[-2.18, 0, 0]}>
                        <boxGeometry args={[0.12, 0.46, 2.06]} />
                        <meshStandardMaterial color="#C66A0E" metalness={0.6} roughness={0.35} emissive="#FF9E2C" emissiveIntensity={0.3} />
                    </mesh>
                </group>
                {/* 落位目标虚线框（合拢后隐去） */}
                <mesh position={[0, 1.9, 0]}>
                    <boxGeometry args={[4.5, 0.52, 2.14]} />
                    <meshBasicMaterial color="#8A93A6" wireframe transparent opacity={0.35 * (1 - sealed)} />
                </mesh>
                <pointLight position={[0, 1.9, 0]} intensity={sealed * 34} color="#FF9E2C" distance={6} />
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(96), pos: [5.6, 2.2, 8.8], look: [0, 1.6, 0] },
                        { at: K(106), pos: [5.0, 1.9, 8.5], look: [0, 1.55, 0] },
                        { at: K(112), pos: [4.6, 1.7, 8.2], look: [0, 1.5, 0] },
                        { at: K(120), pos: [4.8, 1.9, 8.4], look: [0, 1.6, 0] },
                        { at: K(128), pos: [5.0, 2.1, 8.6], look: [0, 1.7, 0] },
                    ]}
                />
            </Scene3D>
            <div style={{ opacity: Math.max(0, 1 - sealed) }}>
                <Mark t={t} from={K(102)} x={640} y={760} note="可升降密封裙边" />
            </div>
            <Shockwave t={t} at={K(112.5)} x={960} y={540} color={P.accentLight} maxRadius={430} rings={3} />
            <VoSub t={t} from={K(96)} file="vo-07" />
            <VoSub t={t} from={K(112)} file="vo-08" />
            <Vo from={K(96)} file="vo-07" />
            <Vo from={K(112)} file="vo-08" />
        </Stage>
    );
};
