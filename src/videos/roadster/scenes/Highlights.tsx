import React from "react";
import { CountUp, pop, prog, SceneProps, useT } from "../../../shared";
import { Card, Chapter, FONT, Kicks, MONO, P, Sfx, Stage, Stamp, VoSub, Vo, useK } from "../kit";

// 第 2 幕 · 名场面回放 + 彩蛋（全场作证·非 AI）
export const Highlights: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const outA = prog(t, K(30), 12);
    const cards = [
        { x: 430, tag: "DEMO 01", title: "倒挂悬停", at: K(17) },
        { x: 960, tag: "DEMO 02", title: "空中翻滚", at: K(19) },
        { x: 1490, tag: "DEMO 03", title: "飞越车队", at: K(21) },
    ];
    return (
        <Stage t={t}>
            <Chapter t={t} step="01" title="现场回放" />
            <Kicks t={t} K={K} beats={[16, 32]}>
                {cards.map((c) => (
                    <Card key={c.tag} x={c.x} y={520} w={400} h={240} appear={pop(t, c.at, 12) * (1 - outA)}>
                        <div style={{ fontFamily: MONO, fontSize: 24, color: P.accent, letterSpacing: 3 }}>{c.tag}</div>
                        <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 700, color: P.ink, marginTop: 14 }}>{c.title}</div>
                    </Card>
                ))}
                <div style={{ position: "absolute", left: 0, right: 0, top: 740, textAlign: "center", opacity: 1 - outA }}>
                    <CountUp t={t} from={K(24)} value={0.81} decimals={2} suffix=" s" style={{ fontFamily: MONO, fontSize: 112, color: P.accentLight, letterSpacing: 4 }} />
                    <div style={{ fontFamily: FONT, fontSize: 28, color: P.inkSub, marginTop: 6 }}>0–60 mph 实测 · 初代承诺还是 1.9 秒</div>
                </div>
                <Card x={960} y={540} w={1000} h={260} appear={pop(t, K(32), 12)} lit={1}>
                    <div style={{ fontFamily: FONT, fontSize: 40, color: P.ink, lineHeight: 1.5, textAlign: "center" }}>
                        「请大家作证——<br />这不是 AI 生成的。」
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 24, color: P.inkSub, marginTop: 16 }}>— 发布会开场 · ELON MUSK</div>
                </Card>
                <Stamp t={t} from={K(37)} x={1560} y={340} text="已作证" rot={-10} />
            </Kicks>
            <VoSub t={t} from={K(16)} file="vo-02" />
            <VoSub t={t} from={K(30)} file="vo-03" />
            <Sfx from={K(32)} file="whoosh" volume={0.6} />
            <Vo from={K(16)} file="vo-02" />
            <Vo from={K(30)} file="vo-03" />
        </Stage>
    );
};
