import React from "react";
import { CountUp, PathFollower, pop, SceneProps, useT } from "../../../shared";
import { FONT, Kicks, Mark, MONO, P, Stage, VoSub, SvgLayer, Vo, useK } from "../kit";

// 第 12 幕 · 日常价值：过弯 2g 横向加速度
export const Track: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const d = "M360 800 C620 800 620 640 880 640 C1140 640 1140 480 1400 480";
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[288]}>
                <SvgLayer>
                    <path d={d} fill="none" stroke={P.line} strokeWidth="12" strokeLinecap="round" />
                    <path d={d} fill="none" stroke={P.accentDeep} strokeWidth="3" strokeDasharray="1 26" strokeLinecap="round" />
                </SvgLayer>
                <PathFollower t={t} from={K(288.5)} d={d} dur={100} color={P.accent} size={26} trail={5} />
                <div style={{ position: "absolute", left: 1380, top: 250, width: 340, textAlign: "center", opacity: pop(t, K(291), 12) }}>
                    <CountUp t={t} from={K(291)} value={2} suffix=" g" style={{ fontFamily: MONO, fontSize: 120, color: P.accentLight }} />
                    <div style={{ fontFamily: FONT, fontSize: 28, color: P.inkSub, marginTop: 8 }}>横向加速度上限</div>
                </div>
                <Mark t={t} from={K(293)} x={780} y={632} note="弯中抓地力" />
            </Kicks>
            <VoSub t={t} from={K(288.5)} file="vo-19" />
            <Vo from={K(288.5)} file="vo-19" />
        </Stage>
    );
};
