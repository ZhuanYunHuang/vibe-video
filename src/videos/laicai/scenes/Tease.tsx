import React from "react";
import { pop, SceneProps, Shockwave, StaggerText, useT } from "../../../shared";
import { CoinPile, CoinRain, Kicks, Particles, P, PixelDude, Slam, Stamp, Stage, useSec, useK } from "../kit";

// 第 3 幕 · 来财 来（23.9-31.7s）：需求③「来财 来」重点突出（24.45s 金币雨+逐字大字）→ 本科生第一个字「唉」→ 亲如兄弟。
export const Tease: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const teaseOn = t >= sec(24.35) && t < sec(26.1);
    return (
        <Kicks t={t} K={K} beats={[48, 56]}>
            <Stage t={t}>
                {/* 需求③：来财 来 — 金币雨 + 逐字大字 + 冲击波 */}
                {teaseOn ? (
                    <>
                        <CoinRain t={t - sec(24.35)} n={30} seed={5} />
                        <div style={{ position: "absolute", left: 960, top: 430, transform: "translate(-50%,-50%)" }}>
                            <StaggerText t={t} from={sec(24.45)} text="来财 来" step={7} y={60} style={{ fontSize: 160, fontWeight: 700, color: "#8A6B1A", WebkitTextStroke: `6px ${P.gold}`, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', letterSpacing: 10 }} />
                        </div>
                        <Shockwave t={t} at={sec(24.45) + 2} x={960} y={480} color={P.gold} rings={3} maxRadius={780} dur={34} />
                    </>
                ) : null}
                {/* 本科生围观 → 第一个字「唉」 */}
                <PixelDude x={560} y={990} s={1.45} mood="smug" armL={10} armR={0} shirt="天选之子" />
                <PixelDude x={1240} y={990} s={1.3} mood={t >= sec(27.83) ? "sad" : "cool"} nerd shirt="本科" shirtColor="#3B4A7A" />
                <PixelDude x={1430} y={990} s={1.3} mood={t >= sec(27.83) ? "sad" : "cool"} nerd shirt="本科" shirtColor="#3B4A7A" flip />
                {t >= sec(27.83) ? (
                    <>
                        <Slam t={t} from={sec(27.83)} x={1330} y={420} size={150} color={P.accentLight}>
                            唉
                        </Slam>
                        <Particles t={t} from={sec(27.83) + 2} x={1330} y={430} n={12} spread={200} color="#7FD8FF" />
                    </>
                ) : null}
                {/* 28.1 起亲如兄弟：双人勾肩 + 爱心 + 纸巾品牌 */}
                {t >= sec(28.3) ? (
                    <>
                        <div style={{ position: "absolute", left: 860, top: 560, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 40, color: P.seal, opacity: pop(t, sec(28.3), 12) }}>
                            {Math.sin(t / 12) > 0 ? "♥" : "♡"} 亲的像兄弟
                        </div>
                        <Stamp t={t} from={sec(29.7)} x={1510} y={330} text="心相印" size={104} rot={-8} color={P.seal} />
                        <CoinPile x={960} n={10} seed={7} />
                    </>
                ) : null}
                {/* 24.9 大卡点处的氛围金屑（非 tease 时段） */}
                {!teaseOn && t > sec(28) ? <Particles t={t} from={sec(28.1)} x={960} y={540} n={10} spread={420} color={P.gold} /> : null}
            </Stage>
        </Kicks>
    );
};
