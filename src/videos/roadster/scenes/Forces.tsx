import React from "react";
import { pop, SceneProps, useT } from "../../../shared";
import { CameraRig, Chip, Grid3D, MONO, RoadsterModel, Scene3D, Slam, Stage, VoSub, SvgLayer, Vo, useK } from "../kit";

// 第 8 幕 · 受力验证（真 3D）：天花板下倒挂的车，压差力向上 vs 重力向下
export const Forces: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const upS = Math.max(0.001, pop(t, K(193), 12));
    const downS = Math.max(0.001, pop(t, K(194), 12));
    return (
        <Stage t={t}>
            <Scene3D fov={42} pos={[6.8, 4.2, 8.8]}>
                <Grid3D />
                {/* 天花板 */}
                <mesh position={[0, 5.6, 0]}>
                    <boxGeometry args={[7.4, 0.36, 3.6]} />
                    <meshStandardMaterial color="#2A2F3B" metalness={0.4} roughness={0.6} />
                </mesh>
                {/* 倒挂的车（贴合天花板底面） */}
                <group position={[0, 5.42, 0]} rotation={[Math.PI, 0, 0]}>
                    <RoadsterModel glow={0.7} lights={0.5} />
                </group>
                {/* 压差力（向上·冷蓝） */}
                <group position={[-1.9, 1.45, 0]} scale={[1, upS, 1]}>
                    <mesh position={[0, 0.95, 0]}>
                        <cylinderGeometry args={[0.07, 0.07, 1.9, 10]} />
                        <meshStandardMaterial color="#6FA8FF" emissive="#6FA8FF" emissiveIntensity={0.35} metalness={0.5} roughness={0.4} />
                    </mesh>
                    <mesh position={[0, 2.2, 0]}>
                        <coneGeometry args={[0.24, 0.6, 14]} />
                        <meshStandardMaterial color="#6FA8FF" emissive="#6FA8FF" emissiveIntensity={0.35} metalness={0.5} roughness={0.4} />
                    </mesh>
                </group>
                {/* 重力（向下·红） */}
                <group position={[1.9, 4.95, 0]} scale={[1, downS, 1]}>
                    <mesh position={[0, -0.95, 0]}>
                        <cylinderGeometry args={[0.07, 0.07, 1.9, 10]} />
                        <meshStandardMaterial color="#FF4D4D" emissive="#FF4D4D" emissiveIntensity={0.35} metalness={0.5} roughness={0.4} />
                    </mesh>
                    <mesh position={[0, -2.2, 0]} rotation={[0, 0, Math.PI]}>
                        <coneGeometry args={[0.24, 0.6, 14]} />
                        <meshStandardMaterial color="#FF4D4D" emissive="#FF4D4D" emissiveIntensity={0.35} metalness={0.5} roughness={0.4} />
                    </mesh>
                </group>
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(192), pos: [6.8, 4.2, 8.8], look: [0, 4.2, 0] },
                        { at: K(200), pos: [5.6, 3.9, 7.6], look: [0, 4.0, 0] },
                        { at: K(208), pos: [5.0, 3.7, 7.2], look: [0, 3.9, 0] },
                    ]}
                />
            </Scene3D>
            <div style={{ position: "absolute", left: 415, top: 596, opacity: pop(t, K(193.5), 12), fontFamily: MONO, fontSize: 34, color: "#85B7EB", letterSpacing: 1 }}>压差力 ≈ 2 × W</div>
            <div style={{ position: "absolute", left: 1300, top: 596, opacity: pop(t, K(194.5), 12), fontFamily: MONO, fontSize: 34, color: "#FF8F8F", letterSpacing: 1 }}>重力 = 1 × W</div>
            <SvgLayer>
                <Chip x={1560} y={286} label="W = 车重" appear={pop(t, K(196), 12)} />
            </SvgLayer>
            <Slam t={t} from={K(200)} x={960} y={858} size={104}>净剩 ≈ 1 × W</Slam>
            <VoSub t={t} from={K(192)} file="vo-13" />
            <Vo from={K(192)} file="vo-13" />
        </Stage>
    );
};
