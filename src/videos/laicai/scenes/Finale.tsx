import React from "react";
import { pop, prog, SceneProps, useT } from "../../../shared";
import { CoinRain, Kicks, Lanlao, P, PixelDude, Slam, Stage, useSec, useK } from "../kit";

// 第 14 幕 · 颁奖台与八仙桌（133.2-144.6s，含片尾）：明码标价 → 非黑即白 → 颁奖台 → 张灯结彩 → 八仙桌收尾（蕹菜）→ 片名。
export const Finale: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const tags = t >= sec(133.7) && t < sec(135.5);
    const bw = t >= sec(135.5) && t < sec(137.6);
    const podium = t >= sec(137.6) && t < sec(141.4);
    const table = t >= sec(141.4);
    const title = t >= sec(142.6);
    const lights = t >= sec(139.5);
    return (
        <Kicks t={t} K={K} beats={[280, 288]}>
            <Stage t={t}>
                {/* 明码标价：价签弹出 */}
                {tags ? (
                    <>
                        {["¥9.9", "¥99", "¥299", "¥520", "¥1314"].map((v, i) => (
                            <div key={v} style={{ position: "absolute", left: 320 + i * 290, top: 380 + (i % 2) * 120, background: P.card, border: `4px solid ${P.ink}`, padding: "10px 18px", opacity: pop(t, sec(133.7) + i * 4, 10), transform: `rotate(${(i % 3) * 6 - 6}deg)`, boxShadow: "6px 6px 0 #00000055" }}>
                                <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 34, color: P.seal }}>{v}</span>
                            </div>
                        ))}
                    </>
                ) : null}
                {/* 非黑即白：画面左右对半 */}
                {bw ? (
                    <>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 960 * prog(t, sec(135.5), 14), background: "#0B0D18", opacity: 0.92 }} />
                        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 960 * prog(t, sec(135.5), 14), background: "#E8ECF4", opacity: 0.94 }} />
                        <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 56, fontWeight: 700, color: P.gold, opacity: pop(t, sec(135.6), 12) }}>非黑即白</div>
                    </>
                ) : null}
                {/* 颁奖台 */}
                {podium ? (
                    <>
                        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${P.gold}22 0%, transparent 55%)` }} />
                        <div style={{ position: "absolute", left: 760, top: 760, width: 400, height: 260, background: "#2E2A18", border: `5px solid ${P.gold}` }} />
                        <div style={{ position: "absolute", left: 560, top: 880, width: 220, height: 140, background: "#3A4152", border: `4px solid ${P.ink}` }} />
                        <div style={{ position: "absolute", left: 1140, top: 880, width: 220, height: 140, background: "#3A4152", border: `4px solid ${P.ink}` }} />
                        <Lanlao x={960} y={770} s={1.5} mood="money" armL={130} armR={130} shades={false} crown />
                        <PixelDude x={670} y={890} s={1.1} mood="happy" armL={130} armR={130} shirt="天选之子" />
                        <Slam t={t} from={sec(137.7)} x={960} y={280} size={78} color={P.gold}>
                            若上颁奖台 切莫
                        </Slam>
                        {t >= sec(139.6) ? <Slam t={t} from={sec(139.6)} x={960} y={440} size={62} color={P.accentLight}>张灯结彩（低调）</Slam> : null}
                    </>
                ) : null}
                {/* 张灯结彩：顶部彩灯跑马 */}
                {lights ? (
                    <div style={{ position: "absolute", left: 100, right: 100, top: 60, display: "flex", justifyContent: "space-between" }}>
                        {Array.from({ length: 18 }, (_, i) => (
                            <div key={i} style={{ width: 30, height: 30, background: [P.seal, P.gold, P.accent, "#8A5CFF"][(i + Math.floor(t / 6)) % 4], boxShadow: `0 0 16px currentColor`, opacity: 0.95 }} />
                        ))}
                    </div>
                ) : null}
                {/* 八仙桌收尾：大圆桌 + 一桌菜 + 蕹菜 */}
                {table ? (
                    <>
                        <div style={{ position: "absolute", left: 960 - 420, top: 620, width: 840, height: 330, background: "#3A2C1E", border: `6px solid ${P.ink}`, borderRadius: 24, opacity: pop(t, sec(141.4), 12) }} />
                        {[
                            { x: 660, label: "鱼" },
                            { x: 830, label: "鸡" },
                            { x: 1000, label: "肉" },
                            { x: 1170, label: "汤" },
                        ].map((d) => (
                            <div key={d.label} style={{ position: "absolute", left: d.x, top: 640, width: 120, height: 120, background: P.card, border: `4px solid ${P.ink}`, borderRadius: "50% 50% 45% 45%", display: "flex", alignItems: "center", justifyContent: "center", opacity: pop(t, sec(141.5), 12) }}>
                                <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 38, color: P.ink }}>{d.label}</span>
                            </div>
                        ))}
                        {/* 蕹菜（空心菜）：主角菜 */}
                        <div style={{ position: "absolute", left: 1020, top: 850, background: "#1F6B4A", border: `4px solid ${P.gold}`, padding: "10px 20px", opacity: pop(t, sec(142.9), 12), transform: "rotate(-3deg)", boxShadow: `0 0 26px #2FA95E66` }}>
                            <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 34, color: "#C9F5DC" }}>蕹菜（空心菜）</span>
                        </div>
                        <Lanlao x={620} y={700} s={1.2} mood="laugh" armL={70} armR={70} shades={false} crown />
                        <PixelDude x={1300} y={700} s={1.15} mood="laugh" armL={70} armR={70} shirt="天选之子" />
                        <CoinRain t={t - sec(141.4)} n={16} seed={53} speed={0.7} />
                    </>
                ) : null}
                {/* 片名定格 */}
                {title ? (
                    <div style={{ position: "absolute", inset: 0, background: "#0B0D18E6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: prog(t, sec(142.6), 18) }}>
                        <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 110, fontWeight: 700, color: P.gold, letterSpacing: 16, textShadow: `0 0 40px ${P.gold}66`, transform: `scale(${0.9 + 0.1 * pop(t, sec(142.6), 12)})` }}>专升本 · 来财</div>
                        <div style={{ marginTop: 30, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 32, color: P.accentLight, letterSpacing: 8, opacity: prog(t, sec(143.2), 14) }}>天选之子 × 揽佬 —— 八方来财</div>
                        <div style={{ marginTop: 60, display: "flex", gap: 14 }}>{["来", "财", "来"].map((c, i) => <span key={i} style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 40, color: P.gold, opacity: 0.6 + 0.4 * Math.abs(Math.sin(t / 8 + i)) }}>{c}</span>)}</div>
                    </div>
                ) : null}
            </Stage>
        </Kicks>
    );
};
