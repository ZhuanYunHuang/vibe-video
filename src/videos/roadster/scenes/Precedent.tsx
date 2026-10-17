import React from "react";
import { pop, prog, SceneProps, useT } from "../../../shared";
import { Card, Chapter, FONT, Kicks, MONO, P, Stage, Stamp, VoSub, Vo, useK } from "../kit";

// 第 9 幕 · 为什么静止就有效 + 历史先例（Brabham / Chaparral / Spéirling）
export const Precedent: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const outA = prog(t, K(222), 12);
    const cars = [
        { x: 480, tag: "1970", name: "Chaparral 2J", note: "双风扇 · 开创先例" },
        { x: 960, tag: "1978", name: "Brabham BT46B", note: "夺冠一场即被封禁" },
        { x: 1440, tag: "2020s", name: "McMurtry Spéirling", note: "电动 · 2 吨下压力" },
    ];
    return (
        <Stage t={t}>
            <Chapter t={t} step="05" title="历史先例" />
            <Kicks t={t} K={K} beats={[208, 224]}>
                <Card x={620} y={540} w={640} h={250} appear={pop(t, K(209), 12) * (1 - outA)}>
                    <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: P.inkSub }}>传统尾翼 / 扩散器</div>
                    <div style={{ fontFamily: MONO, fontSize: 30, color: P.seal, marginTop: 14 }}>0 km/h → 下压力 ≈ 0</div>
                    <div style={{ fontFamily: FONT, fontSize: 26, color: P.inkSub, marginTop: 10 }}>依赖车速 · 低速无效</div>
                </Card>
                <Card x={1300} y={540} w={640} h={250} appear={pop(t, K(211), 12) * (1 - outA)} lit={1}>
                    <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: P.ink }}>车底风扇</div>
                    <div style={{ fontFamily: MONO, fontSize: 30, color: P.accentLight, marginTop: 14 }}>0 km/h → 2 × 车重</div>
                    <div style={{ fontFamily: FONT, fontSize: 26, color: P.inkSub, marginTop: 10 }}>静止 / 低速即生效</div>
                </Card>
                {cars.map((c, i) => (
                    <Card key={c.tag} x={c.x} y={620} w={400} h={260} appear={pop(t, K(224 + i * 1.2), 12)}>
                        <div style={{ fontFamily: MONO, fontSize: 40, color: P.accent, letterSpacing: 2 }}>{c.tag}</div>
                        <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, color: P.ink, marginTop: 12 }}>{c.name}</div>
                        <div style={{ fontFamily: FONT, fontSize: 24, color: P.inkSub, marginTop: 10 }}>{c.note}</div>
                    </Card>
                ))}
                <Stamp t={t} from={K(233)} x={1240} y={392} text="遭禁赛" rot={-10} />
            </Kicks>
            <VoSub t={t} from={K(208)} file="vo-14" />
            <VoSub t={t} from={K(224)} file="vo-15" />
            <Vo from={K(208)} file="vo-14" />
            <Vo from={K(224)} file="vo-15" />
        </Stage>
    );
};
