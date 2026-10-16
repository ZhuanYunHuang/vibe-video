import React from "react";
import { pop, prog, SceneProps, useT } from "../../../shared";
import { Kicks, P, PixelDude, Slam, Stage, useSec, useK } from "../kit";

// 第 5 幕 · 苦读（39.5-47.3s）：像素书桌 + 台灯 → 数理化公式雨 → 26 个字母砸满屏。
export const Grind: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const formulas = ["E=mc²", "sin(α+β)", "∫x dx", "a²+b²=c²", "mol", "H₂O", "πr²", "F=ma"];
    return (
        <Kicks t={t} K={K} beats={[80, 88]}>
            <Stage t={t}>
                {/* 像素书桌 + 台灯 + 书堆 */}
                <div style={{ position: "absolute", left: 560, bottom: 60, width: 800, height: 44, background: "#3A2C1E", border: `4px solid ${P.ink}` }} />
                <div style={{ position: "absolute", left: 620, bottom: 104, width: 90, height: 130, background: "#2E351F", border: `3px solid ${P.line}` }} />
                <div style={{ position: "absolute", left: 660, bottom: 234, width: 90, height: 40, background: "#3B4A7A", border: `3px solid ${P.line}` }} />
                <div style={{ position: "absolute", right: 560, bottom: 104, width: 26, height: 180, background: "#3A4152" }} />
                <div style={{ position: "absolute", right: 500, bottom: 280, width: 160, height: 24, background: "#3A4152", transform: "rotate(-14deg)" }} />
                <div style={{ position: "absolute", right: 432, bottom: 268, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `34px solid ${P.gold}`, transform: "rotate(28deg)" }} />
                {/* 台灯光锥 */}
                <div style={{ position: "absolute", right: 300, bottom: 90, width: 420, height: 480, background: `linear-gradient(200deg, ${P.gold}22, transparent 70%)`, clipPath: "polygon(60% 0, 100% 100%, 8% 100%)" }} />
                {/* 主角伏案学习 */}
                <PixelDude x={960} y={430} s={1.15} mood="sleep" squat={0.9} tilt={-16} shirt="天选之子" />
                {/* 41.4 数理化：公式雨 */}
                {t >= sec(41.4) ? (
                    <>
                        {formulas.map((f, i) => {
                            const d = t - sec(41.4) - i * 7;
                            if (d < 0) return null;
                            return (
                                <div key={i} style={{ position: "absolute", left: 380 + ((i * 211) % 1160), top: 140 + ((d * 5.4) % 620), fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 30 + (i % 3) * 8, color: i % 2 ? P.accentLight : P.ink, opacity: 0.85, transform: `rotate(${(i % 5) * 4 - 8}deg)`, whiteSpace: "nowrap" }}>{f}</div>
                            );
                        })}
                    </>
                ) : null}
                {/* 44.8 26 个字母砸满屏 */}
                {t >= sec(44.8) ? (
                    <>
                        {letters.map((ch, i) => {
                            const d = t - sec(44.8) - i * 2.2;
                            if (d < 0) return null;
                            const s = pop(t, sec(44.8) + i * 2.2, 10);
                            return (
                                <div key={ch} style={{ position: "absolute", left: 120 + ((i * 173) % 1680), top: 150 + ((i * 97) % 620), fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 46, fontWeight: 700, color: i % 3 === 0 ? P.gold : i % 3 === 1 ? P.accent : P.ink, opacity: Math.min(1, s * 1.3), transform: `scale(${s}) rotate(${(i % 7) * 5 - 15}deg)` }}>{ch}</div>
                            );
                        })}
                        <Slam t={t} from={sec(46.2)} x={960} y={880} size={64} color={P.accentLight}>
                            A — Z 现在学也不晚
                        </Slam>
                    </>
                ) : null}
                {/* 42.7 走天下 */}
                {t >= sec(42.7) && t < sec(44.8) ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", opacity: pop(t, sec(42.7), 12) }}>
                        <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 52, color: P.ink }}>学好了数理化 · 走天下都不怕</span>
                    </div>
                ) : null}
                {/* 41s 前：其实呢没关系 */}
                {t < sec(41.0) ? <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 40, color: `${P.inkSub}`, opacity: prog(t, sec(39.8), 12) }}>其实呢没关系啊，学就完了</div> : null}
            </Stage>
        </Kicks>
    );
};
