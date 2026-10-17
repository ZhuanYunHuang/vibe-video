import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Chapter, Grid3D, PhoneModel, Readout, Scene3D, Stage, Stamp, Subs, Tag, useK, Vo } from "../kit";

// 02 · 形态：一块 7.6 寸的屏，对折成 5.4 寸
export const Form: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const open = t < K(30) ? 0 : t < K(36) ? prog(t, K(30), 40) * 0.55 : 0.55 + prog(t, K(36), 44) * 0.45;
    return (
        <Stage t={t}>
            <Scene3D fov={36} pos={[6.8, 2.6, 1.6]}>
                <Grid3D />
                <group position={[0, 1.24, 0]} rotation={[0, -0.3, 0]}>
                    <PhoneModel open={open} />
                </group>
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(24), pos: [6.9, 2.7, 1.5], look: [0, 1.24, 0] },
                        { at: K(34), pos: [6.1, 2.6, 3.6], look: [0, 1.24, 0] },
                        { at: K(44), pos: [4.8, 2.6, 6.4], look: [0, 1.24, 0] },
                        { at: K(56), pos: [4.3, 2.6, 7.4], look: [0, 1.24, 0] },
                    ]}
                />
            </Scene3D>

            <Chapter t={t} step="01" title="一本书的两种尺寸" />
            <Tag t={t} from={K(32)} x={1370} y={330} text={'7.6" 内屏'} size={30} color="#121722" />
            <Tag t={t} from={K(36)} x={1370} y={392} text={'5.4" 外屏'} size={30} color="#121722" />
            <Tag t={t} from={K(39)} x={1370} y={454} text="内外同比例 · 内容不跳" size={22} color="#5A6474" />
            <Readout t={t} from={K(44)} x={330} y={380} value="254" unit="g" label="整机重量 · 链条数据" size={80} />
            <Stamp t={t} from={K(48)} x={330} y={690} text="IP68" size={132} color="#2563EB" />
            <Vo from={K(25)} file="vo-03" />
            <Vo from={K(40)} file="vo-04" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
