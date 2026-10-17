import React from "react";
import { CountUp, pop, prog, RgbSplitText, SceneProps, useT } from "../../../shared";
import { Card, Chapter, FONT, Kicks, MONO, P, Stage, VoSub, Vo, useK } from "../kit";

// 第 10 幕 · 两套系统分工：风扇=吸（全系标配）；A71=飞（选装）
export const Systems: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const outA = prog(t, K(254), 12);
    return (
        <Stage t={t}>
            <Chapter t={t} step="06" title="系统分工" />
            <Kicks t={t} K={K} beats={[240, 256]}>
                <Card x={960} y={540} w={900} h={330} appear={pop(t, K(241), 12) * (1 - outA)} lit={1}>
                    <div style={{ fontFamily: FONT, fontSize: 54, fontWeight: 800, color: P.accentLight }}>风扇 = 「吸」·「贴」</div>
                    <div style={{ fontFamily: FONT, fontSize: 30, color: P.ink, marginTop: 20 }}>负压吸附 · 全系标配</div>
                    <div style={{ fontFamily: FONT, fontSize: 30, color: P.inkSub, marginTop: 10 }}>把轮胎压向地面 · 提升抓地力</div>
                </Card>
                <div style={{ position: "absolute", left: 0, right: 0, top: 310, textAlign: "center" }}>
                    <RgbSplitText t={t} from={K(256.5)} text="A71 冷气推进器 = 「推」·「飞」" color={P.ink} style={{ fontSize: 54, fontWeight: 800, letterSpacing: 2 }} />
                </div>
                {[
                    { x: 700, v: 600, suffix: " L", label: "压缩空气", at: K(258) },
                    { x: 960, v: 10, suffix: " 个", label: "冷气喷嘴", at: K(259) },
                    { x: 1220, v: 80, suffix: " kN+", label: "峰值推力", at: K(260) },
                ].map((c) => (
                    <div key={c.label} style={{ position: "absolute", left: c.x - 170, top: 540, width: 340, textAlign: "center", opacity: pop(t, c.at, 12) }}>
                        <CountUp t={t} from={c.at} value={c.v} suffix={c.suffix} style={{ fontFamily: MONO, fontSize: 84, color: P.accentLight }} />
                        <div style={{ fontFamily: FONT, fontSize: 28, color: P.inkSub, marginTop: 10 }}>{c.label}</div>
                    </div>
                ))}
                <div style={{ position: "absolute", left: 0, right: 0, top: 780, textAlign: "center", opacity: pop(t, K(262), 12), fontFamily: MONO, fontSize: 30, color: P.gold, letterSpacing: 3 }}>
                    仅推力版 / 火箭版搭载
                </div>
            </Kicks>
            <VoSub t={t} from={K(240)} file="vo-16" />
            <VoSub t={t} from={K(256)} file="vo-17" />
            <Vo from={K(240)} file="vo-16" />
            <Vo from={K(254)} file="vo-17" />
        </Stage>
    );
};
