import React from "react";
import { FONT, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Seal, Slam, Stage, Sub, usePulse } from "../kit/ui";
import { Kicks, Spark } from "../kit/mech";

// 拍 336~352 收尾（zoom 拍案入场，重拍卡点 336）：
//   336★ 铺垫 / 338「他们真的不知道」/ 340★「只是你替他们补全了答案」+ 爆点
//   343 标题复现 + 副题 / 347 印「准」/ 348 收尾字幕
export const Outro: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const pulse = usePulse(start);
    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[336, 352]}>
                <Slam t={t} from={K(338)} x={960} y={400} size={64}>
                    他们真的不知道
                </Slam>
                <Slam t={t} from={K(340)} x={960} y={520} size={64} color={P.cinnabar}>
                    只是你，替他们补全了答案
                </Slam>
                <Spark t={t} from={K(340)} x={960} y={520} spread={340} />
                <div style={{ position: "absolute", left: 0, right: 0, top: 660, textAlign: "center", fontFamily: KAI, opacity: prog(t, K(343), 14) }}>
                    <div style={{ fontSize: 96, fontWeight: 900, color: P.ink, letterSpacing: 6, transform: `scale(${1 + pulse * 0.008})` }}>算命，为什么这么准？</div>
                    <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: P.inkLight, marginTop: 26, letterSpacing: 4 }}>现在，你知道答案了</div>
                </div>
                <Seal t={t} from={K(347)} x={1580} y={850} text="准" size={120} rot={-6} />
                <Sub t={t} from={K(336)} to={K(342)}>
                    所以，说到底——
                </Sub>
                <Sub t={t} from={K(348)}>
                    下次再听到「你最近压力很大」，笑着点点头就好
                </Sub>
            </Kicks>
        </Stage>
    );
};
