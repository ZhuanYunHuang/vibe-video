import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { CodeScan, ExpiredCans, Fade, Label, MoralRuler, RiverRise, Scene, Slam, Stage, useK, useToneAt } from "../kit";

// 幕 5 · 顶流 → 过期电子榨菜 → 道德制高点 → 人变编码（拍 128-160 / 43.89-54.86s）。
// 内容锚点严格对齐每句歌词的起始秒（每 16 拍 = 2 句 = 5.486s，一句一格）。
export const River: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const P = useToneAt(start);
    const river = K(128); // 43.89 ← 「像雅鲁藏布江，大家都想变成"顶流"」
    const cans = K(136); // 46.63 ← 「用过期电子榨菜，制造的是焦点」
    const moral = K(144); // 49.37 ← 「珠穆朗玛都得仰视，那些道德制高点」
    const scan = K(152); // 52.11 ← 「线上再到线下，把人编码，兵不厌诈」

    return (
        <Scene start={start}>
            <Stage t={t}>
                {/* 雅鲁藏布江水位一路涨到「顶流」（起手就给 25% 水量，2.6s 涨满） */}
                <Fade t={t} from={river - 6} to={cans - 4}>
                    <RiverRise t={t} from={river} x={1640} y={190} w={260} h={660} p={0.25 + 0.75 * prog(t, river, 78)} />
                    <Label t={t} from={river - 4} x={1770} y={150} text="雅鲁藏布江" size={26} align="center" color={P.accent} />
                    <Slam t={t} from={river} x={760} y={400} size={54}>像雅鲁藏布江</Slam>
                    <Slam t={t} from={river + 20} x={760} y={500} size={54} color={P.gold}>大家都想变成「顶流」</Slam>
                    <Label t={t} from={river + 70} x={760} y={600} text="水头 ↑ = 热度 ↑" size={26} align="center" color={P.accent} />
                </Fade>

                {/* 过期电子榨菜 */}
                <Fade t={t} from={cans - 6} to={moral - 4}>
                    <Slam t={t} from={cans} x={960} y={200} size={50}>用过期电子榨菜 · 制造的是焦点</Slam>
                    <ExpiredCans t={t} from={cans + 8} x={480} y={380} n={4} />
                    <Label t={t} from={cans + 50} x={1160} y={470} text={`保质期 ${1990 + (t % 7)} → 已过期`} size={30} color={P.seal} />
                </Fade>

                {/* 道德制高点：珠峰也得仰视 */}
                <Fade t={t} from={moral - 6} to={scan - 4}>
                    <Slam t={t} from={moral} x={980} y={182} size={48}>珠穆朗玛都得仰视 · 那些道德制高点</Slam>
                    <MoralRuler t={t} from={moral + 4} x={700} y={300} h={560} />
                </Fade>

                {/* 线上再到线下：把人编码 */}
                <Fade t={t} from={scan - 6}>
                    <Slam t={t} from={scan} x={960} y={182} size={48}>线上再到线下 · 把人编码 · 兵不厌诈</Slam>
                    <CodeScan t={t} from={scan + 4} x={960} y={620} w={400} h={470} />
                    <Label t={t} from={scan + 60} x={960} y={900} text="HUMAN → ID → DATA → PRICE" size={26} align="center" color={P.gold} />
                </Fade>
            </Stage>
        </Scene>
    );
};
