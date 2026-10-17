import React from "react";
import { pop, SceneProps, useT } from "../../../shared";
import { Card, DropLine, FONT, Kicks, MONO, P, Slam, Stage, VoSub, SvgLayer, Vo, useK } from "../kit";

// 第 3 幕 · 抛出核心问题：吸住和飞，是两套独立系统
export const Question: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[48, 52]}>
                <Slam t={t} from={K(48.5)} x={960} y={280} size={116}>怎么「吸」住的？</Slam>
                <SvgLayer>
                    <DropLine x={960} y1={368} y2={588} />
                    <polygon points="944,588 976,588 960,612" fill={P.line} />
                </SvgLayer>
                <Card x={620} y={720} w={560} h={260} appear={pop(t, K(50), 12)}>
                    <div style={{ fontFamily: FONT, fontSize: 56, fontWeight: 800, color: P.accentLight }}>吸 · 贴</div>
                    <div style={{ fontFamily: FONT, fontSize: 28, color: P.inkSub, marginTop: 12 }}>负压吸附系统</div>
                    <div style={{ fontFamily: MONO, fontSize: 22, color: P.accent, marginTop: 10, letterSpacing: 2 }}>全版本标配</div>
                </Card>
                <Card x={1300} y={720} w={560} h={260} appear={pop(t, K(52), 12)} lit={0.5}>
                    <div style={{ fontFamily: FONT, fontSize: 56, fontWeight: 800, color: P.gold }}>飞 · 推</div>
                    <div style={{ fontFamily: FONT, fontSize: 28, color: P.inkSub, marginTop: 12 }}>SpaceX A71 冷气推进</div>
                    <div style={{ fontFamily: MONO, fontSize: 22, color: P.gold, marginTop: 10, letterSpacing: 2 }}>推力版 / 火箭版</div>
                </Card>
            </Kicks>
            <VoSub t={t} from={K(48)} file="vo-04" />
            <Vo from={K(48)} file="vo-04" />
        </Stage>
    );
};
