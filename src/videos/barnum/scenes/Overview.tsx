import React from "react";
import { FONT, pop, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Chapter, InkCard, Stage, Sub } from "../kit/ui";
import { Kicks, Spark } from "../kit/mech";

// 拍 208~240 六机制总览（fade 入场）：2×3 面板依次 pop，每个编号 + 名称 + 一句话
//   208△Chapter + 字幕 / 212·216·220·224★·228·232 六个面板依次砸入 / 236 收字幕
export const Overview: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const items = [
        { x: 480, y: 420, no: "01", name: "确认偏误", brief: "说中的记住，没说的忘掉", b: 212 },
        { x: 960, y: 420, no: "02", name: "冷读术", brief: "先观察，再拿模糊话试探", b: 216 },
        { x: 1440, y: 420, no: "03", name: "自我实现预言", brief: "你按他的「剧本」演下去", b: 220 },
        { x: 480, y: 660, no: "04", name: "控制感", brief: "焦虑时，太想要一个确定", b: 224 },
        { x: 960, y: 660, no: "05", name: "幸存者偏差", brief: "你只看得到「说中的人」", b: 228 },
        { x: 1440, y: 660, no: "06", name: "安慰剂效应", brief: "信了，放松了，就好了点", b: 232 },
    ];

    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[208, 224]}>
                <Chapter t={t} step="备" title="它的六个帮手" />
            {items.map((it, i) => (
                <InkCard key={it.no} x={it.x} y={it.y} w={420} h={180} appear={t >= K(it.b) ? pop(t, K(it.b), 12) : 0} rot={i % 2 === 0 ? -1 : 1}>
                    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                        <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 900, color: P.cinnabar }}>{it.no}</div>
                        <div style={{ fontFamily: KAI, fontSize: 40, fontWeight: 900, color: P.ink }}>{it.name}</div>
                    </div>
                    <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: P.inkLight, marginTop: 14 }}>{it.brief}</div>
                </InkCard>
            ))}
            <Sub t={t} from={K(209)} to={K(220)}>
                算命摊上，不只「巴纳姆效应」一个
            </Sub>
            <Sub t={t} from={K(236)} to={K(242)}>
                六种效应常常一起上阵，下面一个一个看
            </Sub>
            <Spark t={t} from={K(224)} x={960} y={540} spread={320} />
            </Kicks>
        </Stage>
    );
};
