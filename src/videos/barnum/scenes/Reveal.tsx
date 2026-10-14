import React from "react";
import { FONT, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Chapter, InkCard, RedPen, Slam, Stage, Sub } from "../kit/ui";

// 拍 112~144 揭题（circle 墨晕进场）：
//   112△Chapter + 铺垫字幕 / 118 大脑补全 + 「起了个名字」 / 120★「巴纳姆效应」大字砸入 + 英文
//   124 也叫福勒效应（红笔划）/ 128 定义卡 / 136★ 三关键词逐个亮朱砂 / 142 收字幕
export const Reveal: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const leadIn = prog(t, K(118), 12);
    const enIn = prog(t, K(122), 14);
    const cardIn = t >= K(128) ? 1 : 0;
    // 关键词点亮：模糊 → 普遍 → 正反都能解释
    const lit = (b: number, fallback: string) => (t >= K(b) ? P.cinnabar : fallback);

    return (
        <Stage t={t}>
            <Chapter t={t} step="答" title="心理学怎么看" />
            {/* 铺垫 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 250, textAlign: "center", opacity: leadIn, fontFamily: FONT }}>
                <div style={{ fontSize: 46, fontWeight: 800, color: P.inkLight }}>你的大脑，在帮他们补全答案</div>
                <div style={{ fontSize: 34, fontWeight: 700, color: P.inkLight, marginTop: 22, opacity: prog(t, K(119), 10) }}>心理学给它起了个名字——</div>
            </div>
            {/* 大字揭题 */}
            <Slam t={t} from={K(120)} x={960} y={470} size={150}>
                巴纳姆效应
            </Slam>
            <div style={{ position: "absolute", left: 0, right: 0, top: 580, textAlign: "center", opacity: enIn, fontFamily: FONT, fontSize: 26, fontWeight: 700, color: P.inkLight, letterSpacing: 8 }}>
                THE BARNUM EFFECT
            </div>
            {/* 又名福勒效应（红笔划重点） */}
            {t >= K(124) ? (
                <div style={{ position: "absolute", left: 960, top: 660, transform: "translateX(-50%)", background: P.card, border: `1px solid ${P.fiber}`, borderRadius: 40, padding: "8px 30px", fontFamily: KAI, fontSize: 32, fontWeight: 900, color: P.ink, opacity: prog(t, K(124), 12) }}>
                    也叫「<span style={{ color: P.cinnabar }}>福勒效应</span>」
                </div>
            ) : null}
            <RedPen t={t} from={K(126)} x={960} y={712} w={340} h={24} underline />
            {/* 定义卡 */}
            <InkCard x={960} y={830} w={1320} h={200} appear={cardIn}>
                <div style={{ fontFamily: FONT, fontSize: 40, fontWeight: 700, lineHeight: 1.8, color: P.ink }}>
                    <div>
                        人们容易相信那些
                        <span style={{ color: lit(136, P.ink), fontWeight: 900 }}>模糊</span>、
                        <span style={{ color: lit(137.5, P.ink), fontWeight: 900 }}>普遍</span>、
                        <span style={{ color: lit(139, P.ink), fontWeight: 900 }}>正反都能解释</span>
                        的描述，
                    </div>
                    <div style={{ opacity: t >= K(141) ? 1 : 0.25 }}>觉得那是在说自己。</div>
                </div>
            </InkCard>
            <Sub t={t} from={K(113)} to={K(120)}>
                这种「准」，一百年前就被研究透了
            </Sub>
            <Sub t={t} from={K(142)} to={K(148)}>
                它为什么总能「说中」？先看它长什么样
            </Sub>
        </Stage>
    );
};
