import React from "react";
import { pop, prog, SceneProps, ShakeWrapper, useT } from "../../../shared";
import { CoinBurst, CoinPile, Kicks, Lanlao, Particles, P, PixelDude, PokerCard, Slam, Stage, useSec, useK } from "../kit";

// 第 12 幕 · 牌桌封神（109.78-125.39s，双块）：散了才能聚 → 说聊斋 → 牌桌 all-in → 三条九 → 回馈社会 → 加冕皇冠。
export const Cards: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const table = t >= sec(114.4);
    const win = t >= sec(120.2);
    const give = t >= sec(122.2) && t < sec(124.0);
    const crown = t >= sec(124.2);
    return (
        <Kicks t={t} K={K} beats={[224, 232, 248]}>
            <ShakeWrapper t={t} ats={[sec(110.2), sec(116.3), sec(122.3)]} amp={13} decay={10}>
            <Stage t={t}>
                {/* 散了才能聚：爆散 → 聚成堆 */}
                {t >= sec(110.2) ? <CoinBurst t={t} at={sec(110.2) + 2} x={960} y={430} n={34} seed={37} floor={1040} /> : null}
                {t >= sec(112.4) ? <CoinPile x={960} n={18} seed={41} /> : null}
                {/* 说聊斋：摊手（空手） */}
                {t >= sec(111.6) && t < sec(114.4) ? (
                    <>
                        <PixelDude x={960} y={990} s={1.5} mood="smug" armL={95} armR={95} shirt="天选之子" />
                        <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 46, color: P.inkSub, opacity: pop(t, sec(111.7), 11) }}>你不出手 · 说聊斋</div>
                    </>
                ) : null}
                {/* 牌桌 */}
                {table ? (
                    <>
                        <div style={{ position: "absolute", left: 560, top: 700, width: 800, height: 60, background: "#1F6B4A", border: `5px solid ${P.ink}`, opacity: pop(t, sec(114.4), 12) }} />
                        <div style={{ position: "absolute", left: 620, top: 760, width: 40, height: 200, background: "#3A2C1E" }} />
                        <div style={{ position: "absolute", left: 1260, top: 760, width: 40, height: 200, background: "#3A2C1E" }} />
                        <Lanlao x={760} y={890} s={1.35} mood={win ? "laugh" : "cool"} armL={win ? 120 : 45} armR={win ? 120 : 35} />
                        <PixelDude x={1180} y={890} s={1.25} mood={win ? "shock" : "happy"} armL={60} armR={60} shirt="天选之子" />
                        {/* 三条九：三张 9 翻牌亮相 */}
                        {win ? (
                            <>
                                <PokerCard x={830} y={640} rot={-10} label="9" flip={prog(t, sec(120.2), 12) > 0.5 ? 1 : -1} />
                                <PokerCard x={960} y={628} rot={2} label="9" flip={prog(t, sec(120.5), 12) > 0.5 ? 1 : -1} />
                                <PokerCard x={1090} y={640} rot={11} label="9" flip={prog(t, sec(120.8), 12) > 0.5 ? 1 : -1} />
                                <Slam t={t} from={sec(120.2)} x={960} y={300} size={96} color={P.gold}>
                                    揽佬小盲 三条九
                                </Slam>
                                <Particles t={t} from={sec(120.4)} x={960} y={620} n={18} spread={400} color={P.gold} />
                            </>
                        ) : (
                            <>
                                <PokerCard x={830} y={640} rot={-10} label="9" faceDown />
                                <PokerCard x={960} y={628} rot={2} label="9" faceDown />
                                <PokerCard x={1090} y={640} rot={11} label="9" faceDown />
                            </>
                        )}
                    </>
                ) : null}
                {/* 花钱交朋友：撒币 */}
                {t >= sec(116.3) && t < sec(118.3) ? <CoinBurst t={t} at={sec(116.3) + 2} x={960} y={520} n={20} seed={43} /> : null}
                {/* 艺高人胆大 */}
                {t >= sec(118.3) && t < sec(120.2) ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 48, color: P.accentLight, opacity: pop(t, sec(118.3), 11) }}>艺高人胆大</div>
                ) : null}
                {/* 回馈一下社会：向人群撒钱 */}
                {give ? (
                    <>
                        <CoinBurst t={t} at={sec(122.3) + 2} x={760} y={480} n={26} seed={47} />
                        {[0, 1, 2].map((i) => (
                            <PixelDude key={i} x={460 + i * 110} y={1050} s={0.85} mood="happy" armL={130} armR={130} shirt={`粉丝${i + 1}`} shirtColor={["#3B4A7A", "#2E351F", "#5A2E4F"][i]} />
                        ))}
                    </>
                ) : null}
                {/* 皇冠加冕 */}
                {crown ? (
                    <>
                        <Lanlao x={960} y={990} s={1.6} mood="money" armL={100} armR={100} shades={false} crown />
                        <Slam t={t} from={sec(124.2)} x={960} y={300} size={88} color={P.gold}>
                            摸到那顶皇冠后
                        </Slam>
                        <Particles t={t} from={sec(124.4)} x={960} y={420} n={16} spread={360} color={P.gold} />
                    </>
                ) : null}
            </Stage>
            </ShakeWrapper>
        </Kicks>
    );
};
