import React from "react";
import { pop, SceneProps, useT } from "../../../shared";
import { Card, FONT, Kicks, MONO, P, Stage, Stamp, VoSub, Vo, useK } from "../kit";

// 第 11 幕 · 现实边界：密封失效场景 + 法规未定
export const Limits: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const items = [
        { x: 480, title: "路面接缝", at: K(273) },
        { x: 960, title: "坑洼", at: K(274) },
        { x: 1440, title: "积水", at: K(275) },
    ];
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[272]}>
                {items.map((c) => (
                    <Card key={c.title} x={c.x} y={520} w={380} h={230} appear={pop(t, c.at, 12)}>
                        <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, color: P.ink }}>{c.title}</div>
                        <div style={{ fontFamily: MONO, fontSize: 28, color: P.seal, marginTop: 16 }}>✕ 密封失效</div>
                        <div style={{ fontFamily: FONT, fontSize: 24, color: P.inkSub, marginTop: 10 }}>压差维持不住</div>
                    </Card>
                ))}
                <Stamp t={t} from={K(280)} x={1520} y={712} text="会失效" rot={-8} />
            </Kicks>
            <VoSub t={t} from={K(272)} file="vo-18" />
            <Vo from={K(272)} file="vo-18" />
        </Stage>
    );
};
