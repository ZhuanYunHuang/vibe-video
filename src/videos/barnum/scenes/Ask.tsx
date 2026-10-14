import React from "react";
import { pop, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Chapter, RedPen, Seal, Slam, Stage, Sub } from "../kit/ui";

// 拍 96~112 提问（zoom 拍案转折，全片最强转场只此一次）：
//   96△Chapter + Q1 同帧砸入 / 100★圈「知道」+「？？」/ 103★Q2 砸入 / 105 划「你的大脑」
//   106-108 三场景 mini 图标错帧滑入 / 109★大红笔椭圆绕双问 / 110★印「巴纳姆」收悬念
export const Ask: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    // 三场景 mini 线描图标：星盘 / 塔罗牌 / 签筒
    const icons = [
        {
            x: 700,
            svg: (
                <svg width={110} height={110}>
                    <circle cx={55} cy={55} r={48} stroke={P.huaqing} strokeWidth={2.5} fill="none" />
                    <circle cx={55} cy={55} r={34} stroke={P.huaqing} strokeWidth={1.5} fill="none" opacity={0.7} />
                    {Array.from({ length: 12 }, (_, i) => {
                        const a = (i / 12) * Math.PI * 2;
                        return <line key={i} x1={55 + Math.cos(a) * 40} y1={55 + Math.sin(a) * 40} x2={55 + Math.cos(a) * 48} y2={55 + Math.sin(a) * 48} stroke={P.huaqing} strokeWidth={1.5} opacity={0.7} />;
                    })}
                </svg>
            ),
        },
        {
            x: 960,
            svg: (
                <svg width={70} height={110}>
                    <rect x={8} y={8} width={54} height={94} rx={8} fill={P.card} stroke={P.ink} strokeWidth={2.5} />
                    <circle cx={35} cy={40} r={14} stroke={P.huaqing} strokeWidth={2} fill="none" />
                    <path d="M35,26 A14,14 0 0 0 35,54 A10,10 0 0 1 35,26 Z" fill={P.huaqing} />
                </svg>
            ),
        },
        {
            x: 1220,
            svg: (
                <svg width={70} height={110}>
                    <line x1={18} y1={40} x2={18} y2={14} stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
                    <line x1={35} y1={40} x2={35} y2={6} stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
                    <line x1={52} y1={40} x2={52} y2={20} stroke={P.ink} strokeWidth={4} strokeLinecap="round" />
                    <path d="M10,40 L14,98 Q14,104 20,104 L50,104 Q56,104 56,98 L60,40 Z" fill={P.card} stroke={P.ink} strokeWidth={2.5} />
                </svg>
            ),
        },
    ];

    return (
        <Stage t={t}>
            <Chapter t={t} step="？" title="且慢" />
            {/* 双问句 */}
            <Slam t={t} from={K(96)} x={960} y={360} size={92} rot={-2}>
                他们真的知道吗？
            </Slam>
            <Slam t={t} from={K(103)} x={960} y={570} size={66} color={P.cinnabar}>
                还是——你的大脑，在帮他们补全？
            </Slam>
            {/* 红笔批注 */}
            <RedPen t={t} from={K(100)} x={1052} y={360} w={240} h={100} note="？？" />
            <RedPen t={t} from={K(105)} x={828} y={628} w={300} h={36} underline />
            <RedPen t={t} from={K(109)} x={960} y={465} w={1150} h={330} dur={14} />
            {/* 三场景 mini 图标 */}
            {icons.map((ic, i) => {
                const s = t >= K(106) + i * 2 ? pop(t, K(106) + i * 2, 10) : 0;
                return (
                    <div key={ic.x} style={{ position: "absolute", left: ic.x, top: 900, transform: `translate(-50%, -50%) translateY(${(1 - s) * 90}px)`, opacity: Math.min(1, s * 1.2) }}>
                        {ic.svg}
                    </div>
                );
            })}
            {/* 收悬念：印「巴纳姆」 */}
            <Seal t={t} from={K(110)} x={1520} y={800} text="巴纳姆" size={120} rot={5} />
            {t >= K(110) ? (
                <div style={{ position: "absolute", left: 1520, top: 890, transform: "translate(-50%, -50%)", fontFamily: KAI, fontSize: 30, color: P.inkLight, opacity: pop(t, K(110) + 6, 10) }}>一种心理学效应</div>
            ) : null}
            <Sub t={t} from={K(96)} to={K(103)}>
                先别急着惊叹
            </Sub>
            <Sub t={t} from={K(103)} to={K(112)}>
                答案，藏在心理学里
            </Sub>
        </Stage>
    );
};
