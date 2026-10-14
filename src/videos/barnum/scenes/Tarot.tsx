import React from "react";
import { FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Chapter, InkCard, RedPen, Seal, Slam, Stage, Sub, TarotCard } from "../kit/ui";

// 拍 32~64 塔罗（diag 掀页入场）：
//   32★Chapter / 33 牌背 pop / 37★问题条「最近，过得怎么样？」/ 41 两侧小牌背
//   45★翻牌（14 帧）/ 46-48 牌面三行渐显 / 50★红笔圈「心里很累」+ 面具线稿
//   53 面具裂纹① / 56 裂纹②+红笔划「不想让别人担心」/ 61★「你差点以为，」/ 62★「牌在偷看你。」+印「准」
export const Tarot: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    // 牌面三行引文逐行渐显
    const lines = [
        { text: "你最近表面没事，", b: 46 },
        { text: "其实心里很累，", b: 47 },
        { text: "只是不想让别人担心。", b: 48 },
    ];
    const crack1 = prog(t, K(53), 10);
    const crack2 = prog(t, K(56), 10);
    const maskOp = 1 - crack2 * 0.3;

    return (
        <Stage t={t}>
            <Chapter t={t} step="其二" title="塔罗牌" />
            <InkCard x={960} y={190} w={460} h={110} appear={t >= K(37) ? pop(t, K(37), 12) : 0}>
                <div style={{ fontFamily: KAI, fontSize: 38, fontWeight: 900 }}>最近，过得怎么样？</div>
            </InkCard>
            {/* 主牌：45 拍翻牌 */}
            <TarotCard t={t} from={K(33)} x={960} y={520} flipAt={K(45)} front={
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", fontFamily: FONT }}>
                    <svg width={140} height={140} style={{ marginTop: 26 }}>
                        <circle cx={70} cy={70} r={52} stroke={P.huaqing} strokeWidth={3} fill="none" />
                        <path d="M70,18 A52,52 0 0 0 70,122 A38,38 0 0 1 70,18 Z" fill={P.huaqing} opacity={0.85} />
                        {Array.from({ length: 8 }, (_, i) => {
                            const a = (i / 8) * Math.PI * 2;
                            return <line key={i} x1={70 + Math.cos(a) * 60} y1={70 + Math.sin(a) * 60} x2={70 + Math.cos(a) * 70} y2={70 + Math.sin(a) * 70} stroke={P.huaqing} strokeWidth={1.5} opacity={0.6} />;
                        })}
                    </svg>
                    <div style={{ fontFamily: KAI, fontSize: 40, fontWeight: 900, color: P.ink, marginTop: 10 }}>月亮</div>
                    <div style={{ fontFamily: FONT, fontSize: 18, color: P.inkLight, letterSpacing: 3, marginTop: 2 }}>THE MOON</div>
                    <div style={{ marginTop: 26, fontSize: 26, fontWeight: 700, color: P.ink, lineHeight: 2.0, textAlign: "center" }}>
                        {lines.map((l) => (
                            <div key={l.text} style={{ opacity: prog(t, K(l.b), 10) }}>{l.text}</div>
                        ))}
                    </div>
                </div>
            } />
            {/* 两侧小牌背（不翻） */}
            <TarotCard t={t} from={K(41)} x={600} y={640} w={120} h={190} rot={7} front={null} />
            <TarotCard t={t} from={K(41)} x={1300} y={660} w={120} h={190} rot={-6} front={null} />
            {/* 红笔圈注 */}
            <RedPen t={t} from={K(50)} x={960} y={633} w={260} h={60} note="被说中了" />
            <RedPen t={t} from={K(56)} x={960} y={715} w={300} h={36} underline />
            <RedPen t={t} from={K(62)} x={1440} y={502} w={220} h={96} />
            {/* 面具线稿：53/56 拍渐裂 */}
            <svg width={220} height={220} style={{ position: "absolute", left: 1370, top: 700, opacity: maskOp }}>
                <circle cx={110} cy={110} r={88} stroke={P.ink} strokeWidth={3} fill={P.card} />
                <ellipse cx={80} cy={95} rx={12} ry={16} stroke={P.ink} strokeWidth={3} fill="none" />
                <ellipse cx={140} cy={95} rx={12} ry={16} stroke={P.ink} strokeWidth={3} fill="none" />
                <path d="M75,150 Q110,172 145,150" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
                {crack1 > 0 ? (
                    <path d="M68,92 L52,118 L66,138 L54,158" stroke={P.cinnabar} strokeWidth={3} fill="none" strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - crack1)} />
                ) : null}
                {crack2 > 0 ? (
                    <path d="M148,94 L164,120 L150,142 L162,164" stroke={P.cinnabar} strokeWidth={3} fill="none" strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - crack2)} />
                ) : null}
            </svg>
            {/* 右列砸字 + 印章 */}
            <Slam t={t} from={K(61)} x={1380} y={400} size={64}>
                你差点以为，
            </Slam>
            <Slam t={t} from={K(62)} x={1380} y={500} size={84} color={P.cinnabar}>
                牌在偷看你。
            </Slam>
            <Seal t={t} from={K(62)} x={520} y={260} text="准" size={100} rot={-8} />
            <Sub t={t} from={K(37)} to={K(46)}>
                你心里那个问题
            </Sub>
            <Sub t={t} from={K(46)} to={K(61)}>
                每一句，都像在说你
            </Sub>
        </Stage>
    );
};
