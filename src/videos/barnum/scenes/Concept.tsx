import React from "react";
import { FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { KAI, P, useK } from "../kit/theme";
import { Chapter, InkCard, Seal, Stage, Sub } from "../kit/ui";

// 拍 144~176 拆解（fade 入场）：三张「面孔」卡 —— 模糊 / 普遍 / 正反都能解释，各配一句前面出现过的原话
//   144△Chapter / 148·152·157★ 三卡依次 pop / 162★·163.5·165★ 三句例句逐行亮
//   168-170 小注 / 173★ 总结条 + 印「万能」/ 176 收
export const Concept: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const cards = [
        { x: 480, title: "模糊", b: 148, line: "你会遇到一个改变计划的人，注意人际关系。", note: "没说跟谁、什么事、什么时候", lb: 162, nb: 168 },
        { x: 960, title: "普遍", b: 152, line: "你希望被他人喜欢。", note: "谁不希望呢？", lb: 163.5, nb: 169 },
        { x: 1440, title: "正反都能解释", b: 157, line: "身边有小人，但贵人也在附近。", note: "好话坏话，总有一句中", lb: 165, nb: 170 },
    ];

    return (
        <Stage t={t}>
            <Chapter t={t} step="解" title="它为什么像在说你" />
            {cards.map((c) => {
                const appear = t >= K(c.b) ? pop(t, K(c.b), 12) : 0;
                return (
                    <InkCard key={c.x} x={c.x} y={560} w={420} h={440} appear={appear}>
                        <div style={{ fontFamily: KAI, fontSize: 52, fontWeight: 900, color: P.cinnabar }}>{c.title}</div>
                        <div style={{ width: 120, height: 3, background: P.ink, opacity: 0.6, margin: "16px 0 22px" }} />
                        <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 700, lineHeight: 1.7, color: P.ink, minHeight: 150, opacity: prog(t, K(c.lb), 12) }}>
                            「{c.line}」
                        </div>
                        <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: P.inkLight, marginTop: 14, opacity: prog(t, K(c.nb), 12) }}>{c.note}</div>
                    </InkCard>
                );
            })}
            {t >= K(173) ? (
                <div style={{ position: "absolute", left: 960, top: 872, transform: "translateX(-50%)", fontFamily: KAI, fontSize: 46, fontWeight: 900, color: P.ink, opacity: prog(t, K(173), 10), whiteSpace: "nowrap" }}>
                    三招合一 → <span style={{ color: P.cinnabar }}>万能答案</span>
                </div>
            ) : null}
            <Seal t={t} from={K(174)} x={1660} y={872} text="万能" size={104} rot={6} />
            <Sub t={t} from={K(146)} to={K(162)}>
                拆开看，它只有三招
            </Sub>
            <Sub t={t} from={K(170)} to={K(178)}>
                三招合一，像一件「均码的衣服」——谁穿都合身
            </Sub>
        </Stage>
    );
};
