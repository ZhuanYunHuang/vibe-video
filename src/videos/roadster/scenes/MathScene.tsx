import React from "react";
import { CountUp, pop, prog, SceneProps, useT } from "../../../shared";
import { Card, FONT, Kicks, MONO, P, Stage, Stamp, VoSub, Vo, useK } from "../kit";

// 第 7 幕 · 算一笔账：2t / 4m² / 5000Pa / 2×W / 4700kg
export const MathScene: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const outA = prog(t, K(174), 12);
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[160, 176]}>
                <Card x={700} y={520} w={430} h={220} appear={pop(t, K(161), 12) * (1 - outA)}>
                    <div style={{ fontFamily: MONO, fontSize: 64, color: P.accentLight }}>≈ 2 t</div>
                    <div style={{ fontFamily: FONT, fontSize: 28, color: P.inkSub, marginTop: 10 }}>整车重量（估）</div>
                </Card>
                <div style={{ position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", fontFamily: MONO, fontSize: 64, color: P.accent, opacity: pop(t, K(162.5), 12) * (1 - outA) }}>+</div>
                <Card x={1220} y={520} w={430} h={220} appear={pop(t, K(163), 12) * (1 - outA)}>
                    <div style={{ fontFamily: MONO, fontSize: 64, color: P.accentLight }}>≈ 4 m²</div>
                    <div style={{ fontFamily: FONT, fontSize: 28, color: P.inkSub, marginTop: 10 }}>车底有效面积</div>
                </Card>
                <Card x={960} y={330} w={920} h={110} appear={pop(t, K(176), 12)}>
                    <CountUp t={t} from={K(176)} value={5000} prefix="ΔP ≈ " suffix=" Pa" style={{ fontFamily: MONO, fontSize: 72, color: P.accentLight, letterSpacing: 2 }} />
                </Card>
                <Card x={960} y={480} w={920} h={110} appear={pop(t, K(179), 12)}>
                    <CountUp t={t} from={K(179)} value={2} prefix="吸附力 ≈ " suffix=" × 车重" style={{ fontFamily: MONO, fontSize: 72, color: P.ink, letterSpacing: 2 }} />
                </Card>
                <Card x={960} y={630} w={920} h={110} appear={pop(t, K(182), 12)}>
                    <CountUp t={t} from={K(182)} value={4700} prefix="演示峰值 " suffix=" kg" style={{ fontFamily: MONO, fontSize: 72, color: P.accentLight, letterSpacing: 2 }} />
                </Card>
                <Stamp t={t} from={K(186)} x={1510} y={790} text="已验算" rot={-9} />
            </Kicks>
            <VoSub t={t} from={K(160)} file="vo-11" />
            <VoSub t={t} from={K(176)} file="vo-12" />
            <Vo from={K(160)} file="vo-11" />
            <Vo from={K(176)} file="vo-12" />
        </Stage>
    );
};
