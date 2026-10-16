import React from "react";
import { pop, prog, SceneProps, SpeedLines, useT } from "../../../shared";
import { CoinBurst, Kicks, PixelDude, P, Slam, Stage, useSec, useK } from "../kit";

// 第 2 幕 · 专本之墙（16-23.9s）：中间像素墙「专|本」→ b40「狂」重拍 + 爆金币（需求②）→ 本科生眼神扫射 → 约战。
export const Wall: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const wallUp = prog(t, sec(16.2), 14);
    const stareOn = t >= sec(20.45);
    return (
        <Kicks t={t} K={K} beats={[40]}>
            <Stage t={t}>
                {/* 中间的墙（砖块纹理） */}
                <div style={{ position: "absolute", left: 940, top: 120, width: 40, height: 800 * wallUp, background: "#3A4152", border: `4px solid ${P.ink}`, opacity: wallUp }}>
                    {Array.from({ length: 16 }, (_, i) => (
                        <div key={i} style={{ position: "absolute", left: i % 2 ? 4 : 16, top: i * 50, width: 20, height: 6, background: "#2A3040" }} />
                    ))}
                </div>
                {/* 两侧标牌：专 / 本 */}
                <div style={{ position: "absolute", left: 760, top: 200, background: "#2E351F", border: `4px solid ${P.accent}`, padding: "10px 26px", opacity: pop(t, sec(16.6), 12) }}>
                    <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 44, color: P.accent }}>专</span>
                </div>
                <div style={{ position: "absolute", right: 700, top: 200, background: "#2E2A18", border: `4px solid ${P.gold}`, padding: "10px 26px", opacity: pop(t, sec(16.6), 12) }}>
                    <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 44, color: P.gold }}>本</span>
                </div>
                {/* 左：天选之子；右：两个本科生（眼神扫射） */}
                <PixelDude x={600} y={990} s={1.5} mood={stareOn ? "angry" : "smug"} armL={stareOn ? 30 : 0} armR={0} shirt="天选之子" />
                <PixelDude x={1330} y={990} s={1.3} mood="cool" nerd shirt="本科" shirtColor="#3B4A7A" look={stareOn ? -1 : 0} />
                <PixelDude x={1520} y={990} s={1.25} mood="smug" nerd shirt="本科" shirtColor="#3B4A7A" look={stareOn ? -1 : 0} />
                {/* 眼神射线 */}
                {stareOn
                    ? Array.from({ length: 3 }, (_, i) => (
                          <div key={i} style={{ position: "absolute", left: 1140, top: 520 + i * 18, width: 200 * prog(t, sec(20.45) + i * 6, 10), height: 4, background: `${P.seal}${i === 1 ? "CC" : "66"}` }} />
                      ))
                    : null}
                {/* 需求②：20.03s「狂」重拍 + 爆金币 */}
                {t >= sec(20.03) ? (
                    <>
                        <Slam t={t} from={sec(20.03)} x={960} y={430} size={190} color={P.gold}>
                            狂
                        </Slam>
                        <CoinBurst t={t} at={sec(20.03) + 2} x={960} y={500} n={46} seed={23} />
                        <SpeedLines t={t} at={sec(20.03)} color={P.gold} dur={22} n={20} inner={300} outer={1250} />
                    </>
                ) : null}
                {/* 22.3s 叫阵：天选之子招手 */}
                {t >= sec(22.3) ? <div style={{ position: "absolute", left: 620, top: 560, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 34, color: P.accentLight, opacity: pop(t, sec(22.3), 11), transform: `scale(${pop(t, sec(22.3), 11)})` }}>过来啊 →</div> : null}
            </Stage>
        </Kicks>
    );
};
