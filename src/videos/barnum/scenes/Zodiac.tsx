import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, hit, pop, prog, SceneProps, useT } from "../../../shared";
import { P, useK } from "../kit/theme";
import { Chapter, InkCard, PhoneMockup, RedPen, Seal, Slam, Stage, Sub } from "../kit/ui";

// 拍 0~32 星座（冷开场，墨色渐显定调）：
//   0 Chapter / 1 手机 / 2 App 标题+星线 / 5★运势卡三行引文 / 7 「改变计划的人」泥金 / 8 星标双闪
//   11★同事换班消息 / 13★气泡落定手机微震 / 14★红笔圈「改变计划的人」+ 批注「应验」
//   16★「太准了！」+ 印「准」+ 纸面微震 / 21★换班小卡 / 24 红笔划「注意人际关系」/ 28 卡 lit 上浮
export const Zodiac: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    // 16 拍纸面微震 + 28 拍起整体上浮
    const shake = hit(t, K(16), 3.5);
    const shakeX = Math.sin(t * 1.9) * 4 * shake;
    const lift = prog(t, K(28), 20) * -8;
    const titleIn = prog(t, K(2), 14);
    const goldIn = prog(t, K(7), 12);
    const bubbleIn = t >= K(11) ? pop(t, K(11), 12) : 0;
    const cardLit = hit(t, K(21), 10) * 0.8 + (t >= K(28) ? 0.35 : 0);
    const sparkle = t >= K(8) && t < K(8) + 24 ? hit(t, K(8), 3) + hit(t, K(8) + 10, 3) : 0;
    // 13 拍手机微震（气泡落定）
    const bump = Math.sin(t * 2.3) * 2 * hit(t, K(13), 3);

    return (
        <Stage t={t}>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${shakeX + bump}px, ${lift}px)` }}>
                <Chapter t={t} step="其一" title="星座运势" />
                {/* 手机：屏内 App 标题 + 星线 + 运势卡 + 换班消息 */}
                <PhoneMockup t={t} from={K(1)} x={750} y={525} w={400} h={820}>
                    <div style={{ position: "absolute", left: 0, right: 0, top: 52, textAlign: "center", fontFamily: FONT, fontSize: 40, fontWeight: 900, color: P.ink, opacity: titleIn }}>
                        本周星座运势
                    </div>
                    <svg width={300} height={44} style={{ position: "absolute", left: 38, top: 116, opacity: titleIn }}>
                        <polyline points="10,30 60,12 110,26 170,8 230,22 290,14" stroke={P.huaqing} strokeWidth={2} fill="none" />
                        {[
                            [10, 30, 4],
                            [60, 12, 3],
                            [110, 26, 5],
                            [170, 8, 3],
                            [230, 22, 4],
                            [290, 14, 3],
                        ].map(([cx, cy, r], i) => (
                            <circle key={i} cx={cx} cy={cy} r={r} fill={P.gold} opacity={0.9} />
                        ))}
                    </svg>
                    <InkCard x={188} y={330} w={330} h={360} appear={t >= K(5) ? pop(t, K(5), 12) : 0} lit={cardLit} float={false}>
                        <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 700, lineHeight: 2.0, color: P.ink }}>
                            <div>你会遇到一个</div>
                            <div style={{ color: goldIn > 0.5 ? P.gold : P.ink, opacity: goldIn }}>改变计划的人，</div>
                            <div>注意人际关系。</div>
                        </div>
                    </InkCard>
                    {/* 换班消息气泡 */}
                    <div
                        style={{
                            position: "absolute",
                            left: 66,
                            bottom: 40,
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            opacity: bubbleIn,
                            transform: `translateX(${(1 - bubbleIn) * -60}px)`,
                        }}
                    >
                        <div style={{ width: 56, height: 56, borderRadius: "50%", background: P.fiber, border: `2px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontFamily: FONT, color: P.ink }}>凯</div>
                        <div style={{ background: P.xuan, border: `2px solid ${P.ink}`, borderRadius: "14px 14px 14px 4px", padding: "12px 18px", fontSize: 25, fontFamily: FONT, color: P.ink, maxWidth: 250, lineHeight: 1.4 }}>
                            在吗？今晚能不能帮我顶个班？
                        </div>
                    </div>
                </PhoneMockup>
                {/* 星标双闪 */}
                {sparkle > 0 ? <div style={{ position: "absolute", left: 872, top: 277, fontSize: 34, color: P.gold, opacity: sparkle, transform: `scale(${1 + sparkle * 0.5})` }}>✦</div> : null}
                {/* 红笔圈注（母题首现） */}
                <RedPen t={t} from={K(14)} x={750} y={468} w={280} h={64} note="应验" />
                <RedPen t={t} from={K(24)} x={750} y={562} w={280} h={40} underline />
                {/* 右列：太准了 + 印章 + 换班小卡 */}
                <Slam t={t} from={K(16)} x={1420} y={480} size={88} color={P.cinnabar} rot={-4}>
                    太准了！
                </Slam>
                <Seal t={t} from={K(16)} x={1420} y={300} text="准" size={110} rot={6} />
                <InkCard x={1420} y={720} w={340} h={170} appear={t >= K(21) ? pop(t, K(21), 12) : 0} lit={hit(t, K(21), 10)}>
                    <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.5 }}>
                        今晚 20:00
                        <br />
                        帮阿凯顶班 <span style={{ color: P.cinnabar }}>✓</span>
                    </div>
                </InkCard>
            </div>
            <Sub t={t} from={K(5)} to={K(16)}>
                你刷到一条本周运势
            </Sub>
            <Sub t={t} from={K(16)} to={K(32)}>
                结果，它真的应验了
            </Sub>
            <AbsoluteFill style={{ background: P.cinnabar, opacity: shake * 0.04, pointerEvents: "none" }} />
        </Stage>
    );
};
