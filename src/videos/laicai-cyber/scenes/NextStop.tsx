import React from "react";
import { pop, prog, SceneProps, useT } from "../../../shared";
import { Kicks, Particles, P, PixelDude, Slam, Stage, Stamp, useSec, useK } from "../kit";

// 第 7 幕 · 下一站（55.1-70.8s，双块）：列车 → 图书馆 → 朋友圈炫耀 → 整个 vs 半个 → 撒西不理达纳 → 汽修二班 → 上岸了呢。
export const NextStop: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const train = t >= sec(55.6) && t < sec(58.5);
    const lib = t >= sec(58.5) && t < sec(63.0);
    const certs = t >= sec(63.2) && t < sec(67.5);
    const gag = t >= sec(67.9) && t < sec(69.5);
    const garage = t >= sec(69.7) && t < sec(71.5);
    const poses = t >= sec(71.7);
    return (
        <Kicks t={t} K={K} beats={[112, 128, 136]}>
            <Stage t={t}>
                {/* 列车进站 */}
                {train ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 360, transform: `translateX(${(1 - prog(t, sec(55.6), 18)) * 1400}px)` }}>
                        <div style={{ margin: "0 auto", width: 980, height: 240, background: "#2E3552", border: `6px solid ${P.line}`, borderRadius: 12, position: "relative" }}>
                            <div style={{ position: "absolute", left: 0, right: 0, top: 24, height: 90, background: "#0E1420", margin: "0 30px", display: "flex", gap: 18, padding: 12 }}>
                                {Array.from({ length: 6 }, (_, i) => (
                                    <div key={i} style={{ flex: 1, background: "#1B2740", border: `3px solid ${P.line}` }} />
                                ))}
                            </div>
                            <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 34, color: P.accentLight }}>专升本号 → 本科站</div>
                        </div>
                    </div>
                ) : null}
                {/* 图书馆：书架 + 主角瞭望 */}
                {lib ? (
                    <>
                        {[0, 1, 2].map((c) => (
                            <div key={c} style={{ position: "absolute", left: 180 + c * 560, top: 200, width: 470, height: 560, background: "#2A3040", border: `5px solid ${P.line}`, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 14 }}>
                                {[0, 1, 2, 3].map((r) => (
                                    <div key={r} style={{ display: "flex", gap: 8, height: 92 }}>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <div key={i} style={{ flex: 1, background: [P.accent, P.gold, "#3B4A7A", P.seal][(r + i + c) % 4], opacity: 0.75 }} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                        <PixelDude x={960} y={1050} s={1.1} mood="happy" armL={70} armR={70} shirt="天选之子" />
                        <div style={{ position: "absolute", left: 0, right: 0, top: 130, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 44, color: P.ink, opacity: pop(t, sec(58.5), 12) }}>本科图书馆 · 到处的看一看</div>
                    </>
                ) : null}
                {/* 朋友圈炫耀（59.8） */}
                {t >= sec(59.8) && t < sec(63.0) ? (
                    <div style={{ position: "absolute", left: 960 - 260, top: 480, width: 520, background: P.card, border: `4px solid ${P.ink}`, boxShadow: "10px 10px 0 #00000066", opacity: pop(t, sec(59.8), 11), transform: `rotate(-2deg) scale(${0.85 + 0.15 * pop(t, sec(59.8), 11)})`, padding: 20 }}>
                        <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 28, color: P.inkSub }}>朋友圈 · 刚刚</div>
                        <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 36, color: P.ink, margin: "12px 0" }}>我专升本上岸了！🎉</div>
                        <div style={{ display: "flex", gap: 14, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 26, color: P.seal }}>
                            <span>♥ 整届点赞</span>
                            <span style={{ color: P.inkSub }}>大专的同学 看见了</span>
                        </div>
                    </div>
                ) : null}
                {/* 整个 vs 半个（证书 + 进度条） */}
                {certs ? (
                    <>
                        {[
                            { x: 620, pct: 100, label: "专升本 · 整个", color: P.accent },
                            { x: 1300, pct: 50, label: "专升本 · 半个", color: P.inkSub },
                        ].map((c) => (
                            <div key={c.label} style={{ position: "absolute", left: c.x - 240, top: 420, width: 480, background: P.card, border: `4px solid ${P.ink}`, boxShadow: "8px 8px 0 #00000055", padding: 22, opacity: pop(t, sec(63.2), 12), transform: `scale(${0.9 + 0.1 * pop(t, sec(63.2), 12)})` }}>
                                <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 34, color: P.ink, marginBottom: 14 }}>{c.label}</div>
                                <div style={{ height: 34, background: P.line }}>
                                    <div style={{ width: `${c.pct * prog(t, sec(63.4), 14)}%`, height: "100%", background: c.color }} />
                                </div>
                                <div style={{ marginTop: 8, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 24, color: c.color }}>{Math.round(c.pct * prog(t, sec(63.4), 14))}%</div>
                            </div>
                        ))}
                    </>
                ) : null}
                {/* 撒西不理达纳（日语梗） */}
                {gag ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", opacity: pop(t, sec(67.9), 12) }}>
                        <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 60, color: P.accentLight }}>さしすせそ · 撒西不理达纳</span>
                    </div>
                ) : null}
                {gag ? <PixelDude x={960} y={990} s={1.5} mood="happy" armL={140} armR={140} tilt={8} shirt="天选之子" /> : null}
                {/* 汽修二班（车间） */}
                {garage ? (
                    <>
                        <Stamp t={t} from={sec(69.7)} x={960} y={380} text="汽修二班" size={150} rot={-5} color={P.seal} />
                        <div style={{ position: "absolute", left: 640, bottom: 90, width: 170, height: 170, border: `14px solid ${P.ink}`, borderRadius: "50%", background: "#2A3040", opacity: pop(t, sec(69.8), 12) }} />
                        <div style={{ position: "absolute", left: 700, bottom: 150, width: 50, height: 220, background: "#8A93A5", transform: "rotate(34deg)", opacity: pop(t, sec(70.0), 12) }} />
                    </>
                ) : null}
                {/* 我现在可是上岸了呢（得意） */}
                {poses ? (
                    <>
                        <PixelDude x={960} y={990} s={1.5} mood="smug" armL={30} armR={0} tilt={-4} shirt="天选之子" />
                        <Slam t={t} from={sec(71.7)} x={960} y={380} size={72} color={P.gold}>
                            我现在可是上岸了呢
                        </Slam>
                        <Particles t={t} from={sec(72)} x={960} y={500} n={14} spread={420} color={P.gold} />
                    </>
                ) : null}
            </Stage>
        </Kicks>
    );
};
