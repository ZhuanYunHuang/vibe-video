import React from "react";
import { pop, prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Chapter, Grid3D, Mark, MONO, P, RoadsterModel, Scene3D, Sfx, Slam, Stage, VoSub, Vo, useK } from "../kit";

// 第 6 幕 · 拆解③大气压差（真 3D）：车底低压区 + 外界大气压下落箭头 → F = ΔP × A
export const Pressure: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const dim = prog(t, K(143), 10);
    return (
        <Stage t={t}>
            <Chapter t={t} step="04" title="大气压差" />
            <div style={{ position: "absolute", inset: 0, opacity: 1 - 0.8 * dim }}>
                <Scene3D fov={40} pos={[8.8, 2.6, 9.8]}>
                    <Grid3D />
                    <RoadsterModel glow={0.55} lights={0.4} />
                    {/* 车底低压区 */}
                    <mesh position={[0, 0.3, 0]}>
                        <boxGeometry args={[3.5, 0.34, 1.95]} />
                        <meshStandardMaterial color="#0C447C" transparent opacity={0.42} emissive="#378ADD" emissiveIntensity={0.45} />
                    </mesh>
                    {/* 低压区上吸小箭头 */}
                    {[-0.95, 0, 0.95].map((ax, i) => (
                        <mesh key={ax} position={[ax, 0.62, i === 1 ? 0.5 : -0.5]}>
                            <coneGeometry args={[0.08, 0.26, 10]} />
                            <meshStandardMaterial color="#85B7EB" emissive="#85B7EB" emissiveIntensity={0.6} />
                        </mesh>
                    ))}
                    {/* 外界大气压（下落箭头） */}
                    {[-1.35, 0, 1.35].map((ax, i) => (
                        <group key={ax} position={[ax, 3.42 + Math.sin(t / 9 + i * 2) * 0.12, i === 1 ? 0.35 : -0.35]}>
                            <mesh position={[0, 0.85, 0]}>
                                <cylinderGeometry args={[0.055, 0.055, 1.7, 8]} />
                                <meshStandardMaterial color="#8A93A6" metalness={0.7} roughness={0.35} />
                            </mesh>
                            <mesh position={[0, -0.2, 0]} rotation={[0, 0, Math.PI]}>
                                <coneGeometry args={[0.18, 0.5, 12]} />
                                <meshStandardMaterial color="#AEB6C6" metalness={0.7} roughness={0.3} />
                            </mesh>
                        </group>
                    ))}
                    <CameraRig
                        t={t}
                        keys={[
                            { at: K(128), pos: [8.8, 2.6, 9.8], look: [0, 1.0, 0] },
                            { at: K(144), pos: [7.6, 2.9, 9.0], look: [0, 1.1, 0] },
                            { at: K(160), pos: [6.9, 3.1, 8.6], look: [0, 1.2, 0] },
                        ]}
                    />
                </Scene3D>
                <Mark t={t} from={K(134)} x={1150} y={222} note="外界大气压" />
            </div>
            <div style={{ opacity: dim }}>
                <Slam t={t} from={K(144)} x={960} y={392} size={140}>F = ΔP × A</Slam>
                <div style={{ position: "absolute", left: 0, right: 0, top: 540, display: "flex", justifyContent: "center", gap: 64 }}>
                    {[
                        { k: "F", txt: "吸附力", at: K(146), color: P.accentLight },
                        { k: "ΔP", txt: "压差", at: K(147), color: P.ink },
                        { k: "A", txt: "车底面积", at: K(148), color: P.ink },
                    ].map((it) => (
                        <div key={it.k} style={{ opacity: pop(t, it.at, 12), fontFamily: MONO, fontSize: 30, color: it.color, letterSpacing: 2 }}>
                            {it.k} · {it.txt}
                        </div>
                    ))}
                </div>
            </div>
            <VoSub t={t} from={K(128)} file="vo-09" />
            <VoSub t={t} from={K(144)} file="vo-10" />
            <Sfx from={K(144)} file="whoosh" volume={0.6} />
            <Vo from={K(128)} file="vo-09" />
            <Vo from={K(144)} file="vo-10" />
        </Stage>
    );
};
