import React from "react";
import { pop, prog, SceneProps, ShakeWrapper, SpeedLines, useT } from "../../../shared";
import { CoinBurst, Kicks, Lanlao, PixelDude, P, Slam, Stage, useSec, useK } from "../kit";

// 第 1 幕 · 苏醒（0.4-16s）：宿舍像素房间苏醒 → 2s「揽佬」tag 弹出揽佬 → b8「专」重拍+爆金币 → 掏手机删同学。
export const Wake: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const awake = t >= sec(2.4);
    const phoneIn = t >= sec(9.2) && t < sec(13.2);
    const deleted = Math.max(0, Math.min(4, Math.floor((t - sec(9.6)) / 62)));
    return (
        <Kicks t={t} K={K} beats={[8]}>
            <ShakeWrapper t={t} ats={[sec(4.42)]} amp={13} decay={10}>
            <Stage t={t}>
                {/* 像素宿舍：床 + 窗 + 桌子 */}
                <div style={{ position: "absolute", left: 180, bottom: 0, width: 460, height: 250, background: "#1B1F33", border: `4px solid ${P.line}` }} />
                <div style={{ position: "absolute", left: 200, bottom: 40, width: 420, height: 90, background: "#232840", border: `4px solid ${P.line}` }} />
                <div style={{ position: "absolute", left: 210, bottom: 140, width: 120, height: 60, background: "#2E3552" }} />
                <div style={{ position: "absolute", left: 1150, top: 160, width: 300, height: 220, background: "#0B0D18", border: `6px solid ${P.line}` }}>
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} style={{ position: "absolute", left: 30 + (i * 47) % 240, top: 24 + (i * 71) % 170, width: 6, height: 6, background: P.ink, opacity: 0.7 }} />
                    ))}
                    <div style={{ position: "absolute", left: 60, top: 90, width: 40, height: 40, borderRadius: "50%", background: "#E8ECF4", opacity: 0.85 }} />
                </div>
                <div style={{ position: "absolute", right: 160, bottom: 0, width: 380, height: 200, background: "#1B1F33", border: `4px solid ${P.line}` }} />
                {/* 主角：睡着 → 2.4s 醒来（跳起） */}
                <PixelDude x={880} y={980} s={1.5} mood={awake ? "happy" : "sleep"} armL={awake ? 140 : 10} armR={awake ? 0 : 10} jump={awake && t < sec(3.4) ? 60 * Math.max(0, 1 - (t - sec(2.4)) / 30) : 0} shirt="天选之子" />
                {/* 大字：我考上了大专 语境 → 通知书卡 */}
                <div style={{ position: "absolute", left: 480, top: 220, background: P.card, border: `4px solid ${P.ink}`, padding: "18px 34px", boxShadow: "10px 10px 0 #00000066", opacity: pop(t, sec(0.6), 12), transform: `rotate(-2deg) scale(${0.8 + 0.2 * pop(t, sec(0.6), 12)})` }}>
                    <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 36, color: P.ink }}>大专录取通知书</div>
                </div>
                {/* 需求④：2s 停顿「揽佬」tag → 揽佬弹出（墨镜 + 双手摊开） */}
                {t >= sec(2.05) ? (
                    <>
                        <div style={{ position: "absolute", left: 480, top: 470, opacity: prog(t, sec(2.05), 10) * (t > sec(4.6) ? Math.max(0, 1 - (t - sec(4.6)) / 20) : 1), transform: `scale(${pop(t, sec(2.05), 11)})` }}>
                            <div style={{ background: P.gold, border: `4px solid ${P.ink}`, padding: "10px 28px", boxShadow: "8px 8px 0 #00000066" }}>
                                <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 46, fontWeight: 700, color: "#3A2A00" }}>揽佬</span>
                            </div>
                        </div>
                        <div style={{ opacity: t > sec(4.6) ? Math.max(0, 1 - (t - sec(4.6)) / 20) : Math.min(1, pop(t, sec(2.05), 11) * 1.2) }}>
                            <Lanlao x={1450} y={970} s={1.45} mood="laugh" armL={100} armR={100} tilt={3} shades />
                        </div>
                    </>
                ) : null}
                {/* 需求①：4.42s「专」重拍 + 3D 爆金币 */}
                {t >= sec(4.42) ? (
                    <>
                        <Slam t={t} from={sec(4.42)} x={960} y={430} size={190} color={P.gold}>
                            专
                        </Slam>
                        <CoinBurst t={t} at={sec(4.42) + 2} x={960} y={500} n={46} seed={11} />
                        <SpeedLines t={t} at={sec(4.42)} color={P.gold} dur={22} n={20} inner={300} outer={1250} />
                    </>
                ) : null}
                {/* 专升本上岸：6.2s 起通知书换本科 */}
                {t >= sec(6.4) ? (
                    <div style={{ position: "absolute", left: 480, top: 220, background: "#2E2A18", border: `4px solid ${P.gold}`, padding: "18px 34px", boxShadow: "10px 10px 0 #00000066", opacity: pop(t, sec(6.4), 12), transform: "rotate(2deg)" }}>
                        <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 36, color: P.gold }}>本科录取通知书</div>
                    </div>
                ) : null}
                {/* 9.6s 删同学：像素通讯录逐个删除 */}
                {phoneIn ? (
                    <div style={{ position: "absolute", right: 240, top: 420, width: 340, background: P.card, border: `4px solid ${P.ink}`, boxShadow: "10px 10px 0 #00000066", opacity: pop(t, sec(9.2), 11), transform: `rotate(-3deg) scale(${0.85 + 0.15 * pop(t, sec(9.2), 11)})`, padding: 16 }}>
                        <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 26, color: P.inkSub, marginBottom: 10 }}>大专同学 (4)</div>
                        {["同桌小王", "汽修阿强", "舍长", "二班老李"].map((n, i) => (
                            <div key={n} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 6px", borderTop: `2px solid ${P.line}` }}>
                                <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 24, color: P.ink, textDecoration: i < deleted ? "line-through" : "none", opacity: i < deleted ? 0.35 : 1 }}>{n}</span>
                                <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 22, color: P.seal, opacity: i < deleted ? 0.4 : 1 }}>{i < deleted ? "已删" : "删除"}</span>
                            </div>
                        ))}
                    </div>
                ) : null}
            </Stage>
            </ShakeWrapper>
        </Kicks>
    );
};
