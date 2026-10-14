import React from "react";
import { FONT, hit, pop, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Chapter, InkCard, RedPen, Slam, Stage, Sub, usePulse } from "../kit/ui";
import { Kicks, Spark } from "../kit/mech";

// 拍 176~208 福勒实验（diag 掀页入场，重拍卡点 176/192）：
//   176★Chapter + 字幕 / 180 分析卡 / 186★红笔圈「同一份」+ 揭穿
//   189-192★ 打分从 0.00 滚到 4.26 + 落定爆点 / 196 「非常准」/ 198·200·202 三句例句逐行亮
export const Experiment: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const pulse = usePulse(start);
    const quotes = [
        { text: "你希望被他人喜欢，但对自己有批判。", b: 198 },
        { text: "你有很大潜能尚未发挥。", b: 200 },
        { text: "你有时外向，有时内向。", b: 202 },
    ];
    const scoreHit = hit(t, K(192), 5);
    const cnt = prog(t, K(189), 48); // 189→192 打分数值滚动

    return (
        <Stage t={t}>
            <Kicks t={t} K={K} beats={[176, 192]}>
                <Chapter t={t} step="验" title="1948 · 福勒实验" />
                {/* 左：人格分析卡 + 红笔揭穿 */}
                <InkCard x={560} y={460} w={620} h={400} appear={t >= K(180) ? pop(t, K(180), 12) : 0}>
                    <div style={{ fontFamily: KAI, fontSize: 56, fontWeight: 900, color: P.ink }}>个性化人格分析</div>
                    <div style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: P.inkLight, marginTop: 24, opacity: prog(t, K(184), 12) }}>
                        致每一位同学（专属定制）
                    </div>
                </InkCard>
                <RedPen t={t} from={K(186)} x={560} y={460} w={660} h={440} note="同一份" />
                <Slam t={t} from={K(188)} x={560} y={710} size={54} color={P.cinnabar} rot={-2}>
                    其实——全班一模一样
                </Slam>
                {/* 右：打分（0.00 → 4.26 滚动 + 落定爆点） */}
                {t >= K(189) ? (
                    <div
                        style={{
                            position: "absolute",
                            left: 1360,
                            top: 430,
                            transform: `translate(-50%, -50%) scale(${(0.7 + 0.3 * Math.min(1, (t - K(189)) / 12)) * (1 + scoreHit * 0.16 + pulse * 0.012)})`,
                            opacity: Math.min(1, (t - K(189)) / 8),
                            whiteSpace: "nowrap",
                        }}
                    >
                        <span style={{ fontFamily: KAI, fontSize: 130, fontWeight: 900, color: P.gold }}>{(4.26 * cnt).toFixed(2)}</span>
                        <span style={{ fontFamily: KAI, fontSize: 70, fontWeight: 900, color: P.inkLight }}> / 5</span>
                    </div>
                ) : null}
                <Spark t={t} from={K(192)} x={1360} y={430} spread={260} />
                <div style={{ position: "absolute", left: 1360, top: 520, transform: "translateX(-50%)", fontFamily: FONT, fontSize: 32, fontWeight: 800, color: P.ink, opacity: prog(t, K(193), 10), whiteSpace: "nowrap" }}>
                    全班学生平均打分
                </div>
                {t >= K(196) ? (
                    <div style={{ position: "absolute", left: 1360, top: 600, transform: "translateX(-50%)", fontFamily: KAI, fontSize: 44, fontWeight: 900, color: P.ink, opacity: prog(t, K(196), 10), whiteSpace: "nowrap" }}>
                        「非常准」
                    </div>
                ) : null}
                {/* 底部：三句例话 */}
                <InkCard x={960} y={810} w={1360} h={200} appear={t >= K(197) ? 1 : 0}>
                    <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, lineHeight: 1.9, color: P.ink }}>
                        {quotes.map((q) => (
                            <div key={q.text} style={{ opacity: prog(t, K(q.b), 10) }}>
                                「{q.text}」
                            </div>
                        ))}
                    </div>
                </InkCard>
                <Sub t={t} from={K(176)} to={K(186)}>
                    1948 年，心理学家福勒做了个实验
                </Sub>
                <Sub t={t} from={K(205)} to={K(210)}>
                    这些话，几乎对所有人都成立
                </Sub>
            </Kicks>
        </Stage>
    );
};
