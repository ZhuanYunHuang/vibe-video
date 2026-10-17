import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { Chapter, Slam, Stage, Subs, Tag, useK, Vo } from "../kit";

const Col: React.FC<{ t: number; from: number; x: number; title: string; gain: string; cost: string; color: string }> = ({ t, from, x, title, gain, cost, color }) => {
    const s = prog(t, from, 18);
    return (
        <div style={{ position: "absolute", left: x, top: 210, width: 500, height: 300, background: "#FFFFFF", border: "1px solid #D7DDE8", borderRadius: 16, padding: "26px 30px", boxShadow: "0 18px 46px #0F172A10", opacity: s, transform: `translateY(${(1 - s) * 16}px)` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 10, height: 10, background: color, borderRadius: 2, transform: "rotate(45deg)" }} />
                <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 34, color: "#121722", letterSpacing: 2 }}>{title}</div>
            </div>
            <div style={{ height: 1, background: "#E6EBF3", margin: "20px 0 18px" }} />
            <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 20, fontWeight: 600, color: "#8A94A6", letterSpacing: 2 }}>得到</div>
            <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 24, color: "#121722", marginTop: 8, lineHeight: 1.4 }}>{gain}</div>
            <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 20, fontWeight: 600, color: "#8A94A6", letterSpacing: 2, marginTop: 20 }}>付出</div>
            <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 24, color: "#B45309", marginTop: 8, lineHeight: 1.4 }}>{cost}</div>
        </div>
    );
};

// 11 · 结算：形态 / 机械 / 材料，各算各的账
export const Verdict: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    return (
        <Stage t={t}>
            <Chapter t={t} step="06" title="三笔账" />

            <Col t={t} from={K(282)} x={120} title="形态" gain="合上 5.4 寸，展开 7.6 寸" cost="厚 11.3 mm，重 254 g" color="#2563EB" />
            <Col t={t} from={K(284)} x={660} title="机械" gain="任意角度停住，展开托平" cost="铰链一百多个零件" color="#F97316" />
            <Col t={t} from={K(286)} x={1200} title="材料" gain="折完，屏幕还是平的" cost="一条消不掉的折痕" color="#0F766E" />

            <Slam t={t} from={K(297)} x={960} y={640} size={66}>折完，还像一块屏</Slam>

            <Tag t={t} from={K(303)} x={330} y={780} text="6 mm ＝ 两截机身叠起来 ＋ 一条留给弯折的缝" size={24} color="#5A6474" />
            <Tag t={t} from={K(306)} x={330} y={832} text="十层材料，各自滑动，才让这条缝不裂" size={19} color="#8A94A6" />

            <Vo from={K(282)} file="vo-21" />
            <Vo from={K(295)} file="vo-22" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
