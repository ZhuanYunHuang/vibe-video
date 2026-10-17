import React from "react";
import { pop, SceneProps, useT } from "../../../shared";
import { Card, FONT, Kicks, MONO, P, Stage, Stamp, VoSub, Vo, useK } from "../kit";

// 第 13 幕 · 收尾信息：2028 / 三版本 / 中国意向金
export const Info: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const items = [
        { x: 600, tag: "2028", sub: "启动量产", at: K(305), color: P.accentLight },
        { x: 960, tag: "三版本", sub: "性能 / 推力 / 火箭", at: K(306.5), color: P.ink },
        { x: 1320, tag: "¥33.2万", sub: "中国意向金 · 仅性能版", at: K(308), color: P.ink },
    ];
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[304]}>
                {items.map((c) => (
                    <Card key={c.tag} x={c.x} y={560} w={400} h={260} appear={pop(t, c.at, 12)}>
                        <div style={{ fontFamily: MONO, fontSize: 52, color: c.color, letterSpacing: 1 }}>{c.tag}</div>
                        <div style={{ fontFamily: FONT, fontSize: 28, color: P.inkSub, marginTop: 16 }}>{c.sub}</div>
                    </Card>
                ))}
                <Stamp t={t} from={K(311)} x={1560} y={360} text="可退" rot={-8} />
            </Kicks>
            <VoSub t={t} from={K(303)} file="vo-20" />
            <Vo from={K(303)} file="vo-20" />
        </Stage>
    );
};
