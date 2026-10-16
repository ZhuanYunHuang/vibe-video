import React from "react";
import { pop, prog, SceneProps, Shockwave, SpeedLines, useT } from "../../../shared";
import { Kicks, P, PhoneGenshin, PixelDude, Stage, useSec, useK } from "../kit";

// 第 6 幕 · 原神秘密（47.3-55.1s）：凑近说秘密 → 49.6s punchline「学英语我用的原神的英文版」手机亮原神 logo（需求⑥）→ 专升本上岸招牌。
export const Genshin: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const phoneOn = t >= sec(49.55) && t < sec(52.6);
    const ray = t >= sec(49.55) && t < sec(51.5);
    return (
        <Kicks t={t} K={K} beats={[96, 104]}>
            <Stage t={t}>
                {ray ? <div style={{ position: "absolute", inset: 0, background: "#FFF3C4", opacity: Math.max(0, 0.3 * Math.exp(-(t - sec(49.55)) / 6)) }} /> : null}
                {/* 主角 */}
                <PixelDude x={400} y={990} s={1.45} mood={t >= sec(49.6) ? "laugh" : "smug"} armL={t >= sec(49.55) && t < sec(52.6) ? 90 : 0} armR={0} tilt={t < sec(49.6) ? -4 : 0} shirt="天选之子" />
                {/* 48.2 告诉你个秘密：耳语气泡 */}
                {t >= sec(48.2) && t < sec(49.6) ? (
                    <div style={{ position: "absolute", left: 700, top: 400, background: P.card, border: `4px solid ${P.ink}`, padding: "12px 24px", opacity: pop(t, sec(48.2), 11), transform: `scale(${pop(t, sec(48.2), 11)})`, boxShadow: "8px 8px 0 #00000066" }}>
                        <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 32, color: P.ink }}>告诉你个秘密……</span>
                    </div>
                ) : null}
                {/* 需求⑥：49.6s 手机横屏亮原神 logo + 光芒 */}
                {phoneOn ? (
                    <>
                        <PhoneGenshin t={t} from={sec(49.55)} x={960} y={560} s={1.15} rot={0} landscape />
                        <Shockwave t={t} at={sec(49.55) + 3} x={960} y={560} color={P.gold} rings={3} maxRadius={700} dur={32} />
                        <SpeedLines t={t} at={sec(49.55) + 3} color="#FFF3C4" dur={20} n={12} cx={960} cy={560} inner={360} outer={1300} />
                    </>
                ) : null}
                {/* 51.25 专升本上岸：像素招牌 */}
                {t >= sec(51.25) ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", opacity: t > sec(52.6) ? Math.min(1, pop(t, sec(51.25), 12)) : Math.min(1, pop(t, sec(51.25), 12)) }}>
                        <div style={{ display: "inline-block", background: "#0E1420", border: `6px solid ${P.accent}`, padding: "14px 54px", boxShadow: `0 0 40px ${P.accent}55, 10px 10px 0 #00000066`, transform: `rotate(-2deg) scale(${0.85 + 0.15 * pop(t, sec(51.25), 12)})` }}>
                            <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 64, fontWeight: 700, color: P.accent, textShadow: `0 0 18px ${P.accent}88` }}>专升本上岸</span>
                        </div>
                    </div>
                ) : null}
                {/* 53s 下一站：指示牌 */}
                {t >= sec(53.06) ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: prog(t, sec(53.06), 12), transform: `translateX(${(1 - prog(t, sec(53.06), 16)) * -140}px)` }}>
                        <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 46, color: P.gold, borderBottom: `4px solid ${P.gold}`, paddingBottom: 6 }}>下一站：本科图书馆 →</span>
                    </div>
                ) : null}
            </Stage>
        </Kicks>
    );
};
