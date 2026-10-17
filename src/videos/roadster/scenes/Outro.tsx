import React from "react";
import { pop, SceneProps, useT } from "../../../shared";
import { Kicks, MONO, P, Particles, Slam, Stage, VoSub, Vo, useK } from "../kit";

// 第 14 幕 · Outro：互动问句 + 关注引导
export const Outro: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[320]}>
                <Particles t={t} from={K(321)} x={960} y={620} n={20} spread={380} />
                <Slam t={t} from={K(320.5)} x={960} y={420} size={108}>2028，能如期吗？</Slam>
                <div style={{ position: "absolute", left: 0, right: 0, top: 800, textAlign: "center", fontFamily: MONO, fontSize: 26, color: P.inkSub, letterSpacing: 6, opacity: pop(t, K(324), 14) }}>
                    — 吸顶之谜 · 完 —
                </div>
            </Kicks>
            <VoSub t={t} from={K(321)} file="vo-21" />
            <Vo from={K(321)} file="vo-21" />
        </Stage>
    );
};
