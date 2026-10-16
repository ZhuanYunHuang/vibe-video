import React from "react";
import { prog, SceneProps, Shockwave, useT } from "../../../shared";
import { CoinRain, Kicks, Lanlao, Mic, P, PixelDude, Slam, Stage, Stamp, useSec, useK } from "../kit";

// 第 8 幕 · 递麦交接（70.76-78.56s）：shengben 段收尾 → 75.3s 天选之子递麦给揽佬 → 进入来财世界（金光扫过）。
export const Handoff: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const handoff = t >= sec(75.3);
    const gold = t >= sec(75.3) && t < sec(77.5);
    return (
        <Kicks t={t} K={K} beats={[152, 156]}>
            <Stage t={t}>
                {/* 交接瞬间：金色世界时切换 */}
                {gold ? <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 60%, ${P.gold}26 0%, transparent 60%)` }} /> : null}
                {handoff ? <CoinRain t={t - sec(75.3)} n={22} seed={17} speed={0.8} /> : null}
                {/* 主角（左）递出麦克风 */}
                <PixelDude x={640} y={990} s={1.5} mood="happy" armL={0} armR={handoff ? 95 : 20} flip={false} shirt="天选之子" />
                {/* 揽佬（右）接过麦克风，双手摊开致意（需求④同款姿势） */}
                {handoff ? (
                    <>
                        <Lanlao x={1330} y={990} s={1.5} mood="laugh" armL={t < sec(76.6) ? -20 : 100} armR={t < sec(76.6) ? 70 : 100} shades tilt={2} />
                        <Mic x={t < sec(76.4) ? 760 + (t - sec(75.3)) * 6 : 1210} y={t < sec(76.4) ? 520 - (t - sec(75.3)) * 2 : 560} rot={t < sec(76.4) ? 90 : 20} glow={8} />
                    </>
                ) : (
                    <Lanlao x={1680} y={990} s={1.45} mood="cool" armL={95} armR={95} shades opacity={Math.max(0, 1 - (t - sec(72)) / 20)} />
                )}
                {handoff ? (
                    <>
                        <Slam t={t} from={sec(75.6)} x={960} y={340} size={110} color={P.gold}>
                            揽佬 接棒
                        </Slam>
                        <Shockwave t={t} at={sec(75.6) + 2} x={960} y={500} color={P.gold} rings={3} maxRadius={760} dur={34} />
                        <Stamp t={t} from={sec(76.6)} x={1660} y={260} text="八方来财" size={130} rot={7} color={P.seal} />
                    </>
                ) : (
                    <Slam t={t} from={sec(71.7)} x={960} y={400} size={68} color={P.inkSub}>
                        专升本的故事 · 未完待续
                    </Slam>
                )}
                {/* 交接进度提示 */}
                {handoff ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 220, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 30, color: `${P.gold}CC`, opacity: prog(t, sec(76), 14) }}>—— 进入 揽佬 · 八方来财 时间 ——</div> : null}
            </Stage>
        </Kicks>
    );
};
