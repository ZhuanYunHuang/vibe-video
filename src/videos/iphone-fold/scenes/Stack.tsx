import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Chapter, Grid3D, LayerStack3D, Scene3D, SlideArrows, Stage, Subs, Tag, UTGProfile, useK, Vo } from "../kit";

const NAMES = [
    "纳米纹理盖层",
    "UTG 超薄玻璃",
    "OCA 光学胶",
    "触控层",
    "OLED 发光层",
    "基板",
    "OCA 光学胶",
    "碳纤维支撑板",
    "铰链托平",
    "钛金属中框",
];

// 06 · 堆叠：十层材料，各自滑动的余量
export const Stack: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const explode = prog(t, K(122), 46);
    const orbit = -0.4 + prog(t, K(124), 90) * 0.5;
    const lit = Math.floor(prog(t, K(126), 56) * 10.99);
    const active = t >= K(126) ? Math.min(9, lit - 1) : -1;
    return (
        <Stage t={t}>
            <Scene3D fov={36} pos={[3.4, 2.7, 5.3]}>
                <Grid3D />
                <group position={[0, 1.5, 0]}>
                    <LayerStack3D explode={explode} orbit={orbit} active={active} />
                </group>
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(120), pos: [3.6, 2.8, 5.6], look: [0, 1.5, 0] },
                        { at: K(134), pos: [2.9, 2.4, 5.0], look: [0, 1.5, 0] },
                        { at: K(168), pos: [3.2, 2.6, 5.2], look: [0, 1.5, 0] },
                    ]}
                />
            </Scene3D>

            <Chapter t={t} step="03" title="十层，各自滑动" />

            <div style={{ position: "absolute", left: 1330, top: 250 }}>
                {NAMES.map((n, i) => {
                    const on = i <= active;
                    return (
                        <div key={n + i} style={{ display: "flex", alignItems: "center", gap: 12, height: 40, opacity: on ? 1 : 0.62, transform: `translateX(${on ? 0 : -10}px)` }}>
                            <div style={{ width: 26, fontFamily: '"Cascadia Code",Consolas,monospace', fontSize: 16, color: i === active ? "#EA580C" : "#5F6B80" }}>{String(i + 1).padStart(2, "0")}</div>
                            <div style={{ width: i === active ? 18 : 10, height: 2, background: i === active ? "#F97316" : "#3A4152" }} />
                            <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: i === active ? 25 : 22, fontWeight: 600, color: i === active ? "#121722" : "#5A6474", letterSpacing: 1 }}>{n}</div>
                        </div>
                    );
                })}
            </div>

            {t >= K(134) && t < K(156) ? <UTGProfile t={t} from={K(134)} x={300} y={770} w={700} h={110} /> : null}
            {t >= K(154) ? <SlideArrows t={t} from={K(154)} x={330} y={700} w={720} amount={38} /> : null}

            <Tag t={t} from={K(154)} x={330} y={648} text="中性层几乎不动，越外侧错得越多" size={20} color="#EA580C" />
            <Vo from={K(121)} file="vo-09" />
            <Vo from={K(137)} file="vo-10" />
            <Vo from={K(150)} file="vo-11" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
