import React from "react";
import { hit, pop, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Chapter, InkCard, RedPen, Seal, Slam, Stage, Sub } from "../kit/ui";

// 先生剪影：冠帽 + 圆脸 + 三缕长须 + 袍（墨线描）；nod 为头部点头角度
const Master: React.FC<{ t: number; from: number; nod: number; beardLift: number }> = ({ t, from, nod, beardLift }) => {
    const s = t >= from ? pop(t, from, 12) : 0;
    const float = Math.sin(t / 40) * 3;
    return (
        <div
            style={{
                position: "absolute",
                left: 410,
                top: 290,
                width: 300,
                height: 380,
                opacity: Math.min(1, s * 1.2),
                transform: `translateY(${(1 - s) * 50 + float}px) scale(${0.85 + 0.15 * s})`,
            }}
        >
            <svg width={300} height={380}>
                {/* 袍 */}
                <path d="M150,190 Q90,220 70,360 L230,360 Q210,220 150,190 Z" fill={P.card} stroke={P.ink} strokeWidth={3} />
                <path d="M150,190 L150,360" stroke={P.ink} strokeWidth={2} opacity={0.5} />
                {/* 头部（点头绕颈椎 150,185 旋转） */}
                <g transform={`rotate(${nod} 150 185)`}>
                    <circle cx={150} cy={120} r={55} fill={P.card} stroke={P.ink} strokeWidth={3} />
                    {/* 冠帽 */}
                    <path d="M98,72 Q150,18 202,72 L202,84 L98,84 Z" fill={P.card} stroke={P.ink} strokeWidth={3} />
                    <rect x={122} y={30} width={56} height={26} rx={4} fill={P.card} stroke={P.ink} strokeWidth={3} />
                    {/* 眉眼 */}
                    <path d="M120,108 Q132,102 144,108" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
                    <path d="M156,108 Q168,102 180,108" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
                    {/* 三缕长须 */}
                    <g transform={`translate(0, ${beardLift}px)`}>
                        <path d="M138,168 Q128,205 116,235" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
                        <path d="M150,170 Q150,210 150,245" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
                        <path d="M162,168 Q172,205 184,235" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
                    </g>
                </g>
            </svg>
        </div>
    );
};

// 拍 64~96 算命先生（blinds 卷帘开摊）：
//   64△Chapter / 66 幡 / 67 桌 / 68 先生 / 70 签筒（逐拍 pop）
//   72★台词卡四句台词 / 76 圈「小人」/ 78 圈「贵人」/ 80△你的剪影
//   84★连连点头 ×3 + 印「准」/ 88「他怎么知道？！」/ 90 胡须上翘+天机小字 / 92 幡布飘动
export const Fortune: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    // 84~86.5 拍连连点头 ×3（下-上-下）
    const nod = t >= K(84) && t < K(87) ? Math.sin(prog(t, K(84), 24) * Math.PI * 3) * 6 : 0;
    const shake = Math.sin(t * 2.1) * 3 * hit(t, K(84), 3);
    const beardLift = prog(t, K(90), 14) * -8;
    const sway = Math.sin(t / 8) * 2 * prog(t, K(92), 30);
    // 四句台词：卡 72 拍弹入带第一句，其余逐拍补
    const lines = [
        { text: "你早年辛苦，", b: 72 },
        { text: "中年转运，", b: 74 },
        { text: "身边有小人，", b: 76 },
        { text: "但贵人也在附近。", b: 78 },
    ];

    return (
        <Stage t={t}>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${shake}px)` }}>
                <Chapter t={t} step="其三" title="算命先生" />
                {/* 竖幡 + 横杆 */}
                <div style={{ position: "absolute", left: 155, top: 210, width: 230, height: 12, background: P.ink, borderRadius: 6, opacity: t >= K(66) ? pop(t, K(66), 12) : 0, transform: `skewX(${sway}deg)` }} />
                <div
                    style={{
                        position: "absolute",
                        left: 195,
                        top: 222,
                        width: 150,
                        height: 420,
                        background: P.card,
                        border: `3px solid ${P.ink}`,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: t >= K(66) ? pop(t, K(66), 12) : 0,
                        transform: `skewX(${sway}deg)`,
                    }}
                >
                    <div style={{ writingMode: "vertical-rl", fontFamily: KAI, fontSize: 44, fontWeight: 900, color: P.huaqing, letterSpacing: 10 }}>神机妙算</div>
                </div>
                {/* 墨线桌 */}
                <div style={{ position: "absolute", left: 380, top: 709, width: 480, height: 22, background: P.card, border: `3px solid ${P.ink}`, borderRadius: 4, opacity: t >= K(67) ? pop(t, K(67), 12) : 0 }} />
                <div style={{ position: "absolute", left: 432, top: 731, width: 14, height: 110, background: P.ink, opacity: t >= K(67) ? pop(t, K(67), 12) : 0 }} />
                <div style={{ position: "absolute", left: 794, top: 731, width: 14, height: 110, background: P.ink, opacity: t >= K(67) ? pop(t, K(67), 12) : 0 }} />
                <Master t={t} from={K(68)} nod={nod} beardLift={beardLift} />
                {/* 签筒 */}
                <div style={{ position: "absolute", left: 745, top: 560, width: 90, height: 160, opacity: t >= K(70) ? pop(t, K(70), 12) : 0, transform: `translateY(${(1 - (t >= K(70) ? pop(t, K(70), 12) : 0)) * 30}px)` }}>
                    <svg width={90} height={160}>
                        <line x1={28} y1={54} x2={28} y2={18} stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
                        <line x1={45} y1={54} x2={45} y2={6} stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
                        <line x1={62} y1={54} x2={62} y2={24} stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
                        <path d="M20,54 L24,148 Q24,156 32,156 L58,156 Q66,156 66,148 L70,54 Z" fill={P.card} stroke={P.ink} strokeWidth={3} />
                        <line x1={21} y1={92} x2={69} y2={92} stroke={P.ink} strokeWidth={2} opacity={0.6} />
                    </svg>
                </div>
                {/* 天机小字 */}
                {t >= K(90) ? (
                    <div style={{ position: "absolute", left: 560, top: 700, transform: "translate(-50%, -50%)", fontFamily: KAI, fontSize: 26, color: P.inkLight, opacity: pop(t, K(90), 10) }}>天机 · 不可泄露</div>
                ) : null}
                {/* 台词卡 + 红笔圈注 */}
                <InkCard x={1240} y={400} w={460} h={540} appear={t >= K(72) ? pop(t, K(72), 12) : 0}>
                    <div style={{ fontFamily: KAI, fontSize: 36, fontWeight: 900, lineHeight: 2.2 }}>
                        {lines.map((l) => (
                            <div key={l.text} style={{ opacity: prog(t, K(l.b), 8) }}>{l.text}</div>
                        ))}
                    </div>
                </InkCard>
                <RedPen t={t} from={K(76)} x={1240} y={441} w={220} h={60} />
                <RedPen t={t} from={K(78)} x={1240} y={520} w={300} h={60} />
                {/* 你的剪影（连连点头） */}
                <div style={{ position: "absolute", left: 1520, top: 660, width: 200, height: 240, opacity: t >= K(80) ? pop(t, K(80), 12) : 0, transform: `translateY(${(1 - (t >= K(80) ? pop(t, K(80), 12) : 0)) * 40}px)` }}>
                    <svg width={200} height={240}>
                        <path d="M30,240 Q40,150 100,150 Q160,150 170,240" fill={P.card} stroke={P.ink} strokeWidth={3} />
                        <g transform={`rotate(${nod} 100 150)`}>
                            <circle cx={100} cy={80} r={45} fill={P.card} stroke={P.ink} strokeWidth={3} />
                            <path d="M86,74 Q94,68 102,74" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
                            <path d="M112,74 Q120,68 128,74" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
                        </g>
                    </svg>
                </div>
                <Seal t={t} from={K(84)} x={1630} y={300} text="准" size={100} rot={-6} />
                <Slam t={t} from={K(88)} x={1240} y={800} size={72} color={P.cinnabar} rot={-3}>
                    他怎么知道？！
                </Slam>
            </div>
            <Sub t={t} from={K(72)} to={K(84)}>
                四句话，句句都像在说你
            </Sub>
            <Sub t={t} from={K(88)} to={K(96)}>
                只是忽然一想：他好像，什么都没说
            </Sub>
        </Stage>
    );
};
