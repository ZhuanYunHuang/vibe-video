import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { Bar, Fade, Label, Marquee, Scene, Slam, Stage, TeslaFake, useK, useSec, useToneAt } from "../kit";

// 幕 2 · 格式化三观（拍 32-64 / 10.97-21.94s）：鼓在 16.46s 砸入，三观被拖进 FORMAT 框归零，接蓝牌特斯拉（带判假）。
export const Format: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const drop = K(48); // 16.46s 鼓组进入
    const fmt = sec(19.0); // 「线上真得把人三观都给格式化」
    const car = sec(21.74); // 「线下假得像个蓝车牌的特斯拉」
    const hook = sec(24.49); // 「为了短视频，没有什么不能做」

    // 格式化进度：19.0s 起 1.4s 走满，随后输出 FORMAT OK
    const fp = prog(t, fmt, 42);
    const ok = t >= fmt + 46;

    return (
        <Scene start={start}>
            <Stage t={t}>
                {/* 10.97-16.46s：流量计数器狂涨 */}
                <Fade t={t} from={2} to={drop}>
                    <Slam t={t} from={6} x={960} y={380} size={76}>为了流量</Slam>
                    <div style={{ position: "absolute", left: 660, top: 470, width: 600 }}>
                        <Bar t={t} x={0} y={0} w={600} h={30} p={prog(t, 10, 150)} label="TRAFFIC" value={`${Math.round(prog(t, 10, 150) * 9999999).toLocaleString()}`} />
                    </div>
                    <Label t={t} from={20} x={960} y={610} text="没有什么不能做 · NOTHING CANNOT BE DONE" size={26} align="center" />
                </Fade>

                {/* 16.46s 鼓组进入：全屏 HUD 刷亮 + FORMAT 框 */}
                <Fade t={t} from={drop} to={car - 6}>
                    <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 420, background: `${P.card}EE`, boxShadow: `inset 0 0 0 3px ${P.accent}, 0 0 50px ${P.accent}33`, clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%)" }}>
                        <div style={{ position: "absolute", left: 28, top: 22, fontFamily: '"Consolas",monospace', fontSize: 26, color: P.accent, letterSpacing: 4 }}>FORMAT // 三观</div>
                        <div style={{ position: "absolute", left: 28, right: 28, top: 78, height: 4, background: P.line }} />
                        {/* 三观字符被逐个吸走 */}
                        <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", gap: 40 }}>
                            {["三", "观"].map((c, i) => {
                                const gone = fp > (i + 1) / 2.4;
                                return <span key={i} style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 96, fontWeight: 700, color: gone ? `${P.inkSub}33` : P.ink, textShadow: gone ? undefined : `0 0 24px ${P.accent}77`, transform: `scale(${gone ? 0.82 : 1})` }}>{gone ? "░" : c}</span>;
                            })}
                        </div>
                        {/* 进度条 */}
                        <div style={{ position: "absolute", left: 28, right: 28, bottom: 74, height: 34, background: `${P.bg}`, boxShadow: `inset 0 0 0 2px ${P.line}` }}>
                            <div style={{ width: `${fp * 100}%`, height: "100%", background: P.accent, boxShadow: `0 0 18px ${P.accent}` }} />
                        </div>
                        <div style={{ position: "absolute", left: 28, bottom: 26, fontFamily: '"Consolas",monospace', fontSize: 22, color: ok ? P.seal : P.inkSub, letterSpacing: 3 }}>
                            {ok ? "// 格式化完成 · 三观 已归零" : `// 格式化中 ${(fp * 100).toFixed(0)}%`}
                        </div>
                        <div style={{ position: "absolute", right: 28, bottom: 26, fontFamily: '"Consolas",monospace', fontSize: 22, color: P.gold, letterSpacing: 2 }}>{ok ? "0 / 3" : "3 / 3"}</div>
                    </div>
                </Fade>

                {/* 21.74-24.49s：蓝牌特斯拉（判假：蓝牌＝燃油车牌照，与新能源车型不符） */}
                <Fade t={t} from={car} to={hook + 4}>
                    <TeslaFake t={t} from={car} x={960} y={460} judgeAt={car + 34} />
                    <Slam t={t} from={car + 8} x={960} y={852} size={44}>线下 · 假得像个蓝车牌的特斯拉</Slam>
                </Fade>

                {/* 24.49s：钩子回环「为了短视频，没有什么不能做」 */}
                <Fade t={t} from={hook - 4}>
                    <Slam t={t} from={hook} x={960} y={430} size={88}>为了短视频</Slam>
                    <Slam t={t} from={hook + 26} x={960} y={572} size={48} color={P.gold}>没有什么不能做</Slam>
                    <Marquee t={t} y={760} text="EVERY SHORT VIDEO · EVERY LIKE ·" size={38} speed={5} opacity={0.55} />
                </Fade>
            </Stage>
        </Scene>
    );
};
