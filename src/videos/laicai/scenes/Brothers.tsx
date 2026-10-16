import React from "react";
import { pop, prog, SceneProps, SpeedLines, useT } from "../../../shared";
import { Kicks, Particles, P, PixelDude, Slam, Stage, useSec, useK } from "../kit";

// 第 4 幕 · 本是同根生（31.7-39.5s）：一树两枝同根 → 「滚开！」→ 又亲如兄弟 → 好的本科不比专科差（双基石）。
export const Brothers: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const kick = t >= sec(34.1) && t < sec(35.9);
    return (
        <Kicks t={t} K={K} beats={[64]}>
            <Stage t={t}>
                {/* 一树两枝（同根生） */}
                <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                    <g stroke={P.gold} strokeWidth={12} fill="none" opacity={prog(t, sec(32.4), 24)}>
                        <path d="M960,900 L960,700" />
                        <path d="M960,700 Q830,620 700,560" stroke={P.accent} />
                        <path d="M960,700 Q1090,620 1220,560" stroke={P.gold} />
                    </g>
                    <circle cx={960} cy={910} r={26} fill={P.gold} opacity={prog(t, sec(32.4), 20)} />
                </svg>
                {/* 两个角色：兄弟态 ↔ 踹开 */}
                <PixelDude x={700} y={990} s={1.45} mood={kick ? "angry" : "happy"} armL={kick ? 120 : 80} armR={kick ? 40 : 80} tilt={kick ? -6 : 0} shirt="天选之子" />
                <PixelDude x={1220} y={990} s={1.3} mood={kick ? "shock" : "laugh"} armL={kick ? 140 : 80} armR={kick ? 140 : 80} nerd shirt="本科" shirtColor="#3B4A7A" jump={kick ? 70 : 0} flip />
                {kick ? (
                    <>
                        <Slam t={t} from={sec(34.1)} x={960} y={420} size={150} color={P.seal}>
                            滚开!
                        </Slam>
                        <SpeedLines t={t} at={sec(34.1)} color={P.seal} dur={20} n={18} />
                    </>
                ) : null}
                {/* 35.9 没关系啊：勾肩再和好 + 爱心 */}
                {t >= sec(35.9) ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 520, textAlign: "center", opacity: pop(t, sec(35.9), 12) }}>
                        <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 36, color: P.accentLight }}>其实呢没关系啊 ~ ♥</span>
                    </div>
                ) : null}
                {/* 37.5 双基石：好的本科不会比专科生差 */}
                {t >= sec(37.5) ? (
                    <>
                        <div style={{ position: "absolute", left: 420, bottom: 80, width: 300, height: 60 * prog(t, sec(37.5), 12), background: "#2E351F", border: `4px solid ${P.accent}`, opacity: 0.9 }} />
                        <div style={{ position: "absolute", left: 1200, bottom: 80, width: 300, height: 60 * prog(t, sec(37.5), 12), background: "#2E2A18", border: `4px solid ${P.gold}`, opacity: 0.9 }} />
                        <div style={{ position: "absolute", left: 0, right: 0, bottom: 168, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 38, color: P.ink, opacity: pop(t, sec(37.8), 12) }}>
                            好的本科 <span style={{ color: P.inkSub }}>不会比</span> 专科生差
                        </div>
                        <Particles t={t} from={sec(37.8)} x={960} y={620} n={12} spread={360} color={P.gold} />
                    </>
                ) : null}
            </Stage>
        </Kicks>
    );
};
