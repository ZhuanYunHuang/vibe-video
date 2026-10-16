import React from "react";
import { CountUp, pop, prog, SceneProps, useT } from "../../../shared";
import { Kicks, Lanlao, Particles, P, PokerCard, Slam, Stage, useSec, useK } from "../kit";

// 第 9 幕 · 憋佬仔主歌（78.56-94.17s，双块）：玉牌挂脖 → 香炉供台 → 白黄牌 → 虔诚拜三拜 → 钱包多几百（CountUp）→ 六合彩/等河牌。
export const Verse1: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const jade = t >= sec(83.6);
    const censer = t >= sec(86.4) && t < sec(90.4);
    const bow = t >= sec(90.7) && t < sec(92.6);
    const wallet = t >= sec(92.7) && t < sec(94.6);
    const cards = t >= sec(94.6);
    return (
        <Kicks t={t} K={K} beats={[160, 176, 184]}>
            <Stage t={t}>
                {/* 香炉 + 青烟 */}
                {censer ? (
                    <>
                        <div style={{ position: "absolute", left: 660, bottom: 90, width: 220, height: 150, background: "#3A4152", border: `5px solid ${P.ink}`, borderRadius: "50% 50% 12% 12%", opacity: pop(t, sec(86.4), 12) }} />
                        <div style={{ position: "absolute", left: 700, bottom: 236, width: 140, height: 14, background: "#5A6478", opacity: pop(t, sec(86.4), 12) }} />
                        {[0, 1, 2].map((i) => (
                            <div key={i} style={{ position: "absolute", left: 745 + i * 18, bottom: 250 + ((t - sec(86.4)) * 2 + i * 40) % 360, width: 10, height: 60, background: `linear-gradient(180deg, transparent, ${P.inkSub}88)`, opacity: 0.5, transform: `translateX(${Math.sin(t / 20 + i) * 16}px)` }} />
                        ))}
                        <div style={{ position: "absolute", left: 350, top: 260, background: "#2E2A18", border: `4px solid ${P.gold}`, padding: "10px 22px", opacity: pop(t, sec(86.8), 12) }}>
                            <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 32, color: P.gold }}>香炉供台上摆</span>
                        </div>
                    </>
                ) : null}
                {/* 玉牌（84.4 挂玉牌放大展示） */}
                {jade ? (
                    <div style={{ position: "absolute", left: 290, top: 300, opacity: pop(t, sec(84.4), 12), transform: `rotate(-6deg) scale(${pop(t, sec(84.4), 12)})` }}>
                        <div style={{ width: 150, height: 190, background: "#1F6B4A", border: `6px solid ${P.gold}`, boxShadow: `0 0 34px #2FA95E66`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 84, fontWeight: 700, color: "#C9F5DC" }}>牌</span>
                        </div>
                        <div style={{ position: "absolute", left: 62, top: -70, width: 26, height: 74, background: P.gold }} />
                    </div>
                ) : null}
                {/* 白黄牌 */}
                {t >= sec(88.3) && t < sec(90.6) ? (
                    <>
                        <div style={{ position: "absolute", left: 1060, top: 290, width: 190, height: 120, background: "#E8ECF4", border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: pop(t, sec(88.3), 12), transform: "rotate(-4deg)" }}>
                            <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 48, color: P.ink }}>白牌</span>
                        </div>
                        <div style={{ position: "absolute", left: 1280, top: 330, width: 190, height: 120, background: P.gold, border: `5px solid ${P.ink}`, display: "flex", alignItems: "center", justifyContent: "center", opacity: pop(t, sec(88.6), 12), transform: "rotate(3deg)" }}>
                            <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 48, color: "#3A2A00" }}>黄牌</span>
                        </div>
                    </>
                ) : null}
                {/* 揽佬：说唱 / 拜三拜 / 数钱 */}
                <Lanlao x={960} y={990} s={1.5} mood={bow ? "pray" : wallet ? "money" : "cool"} armL={bow ? 52 : wallet ? 55 : 12} armR={bow ? 52 : wallet ? 78 : 8} tilt={bow ? Math.sin((t - sec(90.7)) / 7) * 7 : 0} shades={!wallet} />
                {bow ? <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 44, color: P.gold, opacity: pop(t, sec(90.7), 10) }}>虔诚拜三拜 ×3</div> : null}
                {/* 钱包：CountUp +300 */}
                {wallet ? (
                    <div style={{ position: "absolute", left: 900, top: 300, background: "#2E2A18", border: `5px solid ${P.gold}`, padding: "16px 30px", opacity: pop(t, sec(92.7), 11), transform: "rotate(-3deg)", boxShadow: "10px 10px 0 #00000066" }}>
                        <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 30, color: P.inkSub }}>钱包里多</div>
                        <CountUp t={t} from={sec(92.8)} value={300} dur={34} prefix="+¥" style={{ fontSize: 78, fontWeight: 700, color: P.gold }} />
                    </div>
                ) : null}
                {/* 六合彩 / 等河牌（94.6 起，跨到下一幕） */}
                {cards ? (
                    <>
                        <PokerCard x={620} y={560} rot={-8} label="6" red />
                        <PokerCard x={760} y={580} rot={4} label="合" red />
                        <PokerCard x={1180} y={560} rot={-3} label="9" faceDown={t < sec(98.5)} flip={t < sec(96.8) ? -1 : 1} />
                        <PokerCard x={1320} y={585} rot={6} label="9" />
                        <PokerCard x={1460} y={565} rot={-5} label="9" />
                        <div style={{ position: "absolute", left: 0, right: 0, top: 270, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 40, color: P.accentLight, opacity: prog(t, sec(96.6), 12) }}>易的是六合彩 · 难的是等河牌</div>
                        <Particles t={t} from={sec(98)} x={1040} y={560} n={10} spread={260} color={P.gold} />
                    </>
                ) : null}
                {jade ? <Slam t={t} from={sec(84.4)} x={960} y={250} size={60} color={P.accent}>脖上喜欢挂玉牌</Slam> : null}
            </Stage>
        </Kicks>
    );
};
