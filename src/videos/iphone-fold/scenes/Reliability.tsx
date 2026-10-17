import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Chapter, DustBrush, Grid3D, PhoneModel, Scene3D, Stage, Subs, Tag, ThermalPlate, WaterBeads, useK, Vo } from "../kit";

// 09 · 可靠性：二十万次开合，IP68 防尘防水
export const Reliability: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const open = 0.5 + 0.5 * Math.sin((t - K(226)) / 5.2);
    const raw = prog(t, K(228), 92);
    const count = Math.round(raw * 200000);
    return (
        <Stage t={t}>
            <Scene3D fov={36} pos={[5.4, 2.6, 6.2]}>
                <Grid3D />
                <group position={[-0.4, 1.24, 0]} rotation={[0, -0.3, 0]}>
                    <PhoneModel open={t < K(226) ? 1 : open} />
                </group>
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(224), pos: [5.6, 2.7, 6.4], look: [-0.4, 1.24, 0] },
                        { at: K(240), pos: [4.6, 2.4, 5.6], look: [-0.4, 1.24, 0] },
                        { at: K(256), pos: [5.0, 2.5, 6.0], look: [-0.4, 1.24, 0] },
                    ]}
                />
            </Scene3D>

            <Chapter t={t} step="05" title="能撑多久，谁说了算" />

            <div style={{ position: "absolute", left: 1290, top: 220, width: 500 }}>
                <div style={{ fontFamily: '"Cascadia Code",Consolas,monospace', fontSize: 84, color: "#F97316", letterSpacing: 2, lineHeight: 1 }}>
                    {count.toLocaleString("en-US")}
                </div>
                <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 23, fontWeight: 600, color: "#5A6474", marginTop: 10, letterSpacing: 3 }}>次弯折 · 耐久测试</div>
            </div>

            <DustBrush t={t} from={K(238)} x={1300} y={400} w={440} h={150} />
            <WaterBeads t={t} x={1300} y={600} w={440} h={110} />
            <Tag t={t} from={K(244)} x={1300} y={720} text="IP68 · 防尘防水" size={26} color="#2563EB" />
            <ThermalPlate t={t} from={K(248)} x={1290} y={780} w={470} h={120} heat={prog(t, K(248), 30)} />

            <Tag t={t} from={K(252)} x={1470} y={352} text="20 万次弯折测试" size={22} color="#EA580C" />
            <Vo from={K(227)} file="vo-17" />
            <Vo from={K(240)} file="vo-18" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
