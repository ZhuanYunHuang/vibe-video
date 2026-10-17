import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { Chapter, LedgerRow, Readout, Stage, Subs, Tag, useK, Vo } from "../kit";

// 10 · 账单：砍掉三样，换来三样
export const Cost: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const head = prog(t, K(258), 16);
    return (
        <Stage t={t}>
            <Chapter t={t} step="06" title="账单" />

            <div style={{ position: "absolute", left: 200, top: 250, opacity: head, fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 30, color: "#FF4D4D", letterSpacing: 6 }}>砍掉</div>
            <div style={{ position: "absolute", left: 1100, top: 250, opacity: head, fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 30, color: "#F97316", letterSpacing: 6 }}>换来</div>

            <LedgerRow t={t} from={K(258)} x={200} y={310} w={620} label="Face ID" value="侧边指纹" side="cut" strike />
            <LedgerRow t={t} from={K(263)} x={200} y={400} w={620} label="长焦镜头" value="双摄" side="cut" strike />
            <LedgerRow t={t} from={K(268)} x={200} y={490} w={620} label="实体 SIM 卡槽" value="仅 eSIM" side="cut" strike />

            <LedgerRow t={t} from={K(259)} x={1100} y={310} w={620} label="展开厚度" value="5.2 mm" side="keep" />
            <LedgerRow t={t} from={K(264)} x={1100} y={400} w={620} label="双电池 + VC" value="分置两侧" side="keep" />
            <LedgerRow t={t} from={K(269)} x={1100} y={490} w={620} label="防护" value="IP68" side="keep" />

            <Readout t={t} from={K(272)} x={960} y={740} value="15,999" unit="元起" label="256GB · 顶配 26,499" size={96} />
            <Tag t={t} from={K(275)} x={700} y={850} text="价格换来的不是「能折」，是「折完还像一块屏」" size={20} color="#5A6474" />
            <Vo from={K(257)} file="vo-19" />
            <Vo from={K(270)} file="vo-20" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
