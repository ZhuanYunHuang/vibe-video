import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { Chapter, CreaseProfile, MatteVsGloss, Stage, Subs, Tag, useK, Vo } from "../kit";

// 07 · 折痕：没有消灭，只是让光不再指出它
export const Crease: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sweep = 0.5 + 0.5 * Math.sin(prog(t, K(164), 60) * Math.PI * 2 - Math.PI / 2);
    const mag = prog(t, K(180), 26);
    return (
        <Stage t={t}>
            <Chapter t={t} step="04" title="折痕没有被消灭，只是被藏起来" />
            <MatteVsGloss t={t} x={280} y={330} w={520} h={300} sweep={sweep} />
            <Tag t={t} from={K(166)} x={280} y={690} text="同一道光带，同时扫过两块屏" size={22} color="#5A6474" />
            <CreaseProfile t={t} from={K(178)} x={560} y={810} w={700} h={70} mag={mag} />
            <Tag t={t} from={K(180)} x={1540} y={340} text="0.1 mm 折痕深度" size={22} color="#B45309" />
            <Tag t={t} from={K(182)} x={1330} y={400} text="真实比例下几乎是一条直线" size={20} color="#5A6474" />
            {t >= K(188) ? (
                <div style={{ position: "absolute", left: 1600, top: 720, transform: "translate(-50%,-50%) rotate(-7deg)", width: 190, height: 190, borderRadius: "50%", border: "3px solid #F97316", background: "#FFFFFFF2", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px #F9731644" }}>
                    <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 44, color: "#F97316", fontWeight: 700, letterSpacing: 2 }}>不承诺</div>
                    <div style={{ fontFamily: '"Cascadia Code",Consolas,monospace', fontSize: 18, color: "#5A6474", marginTop: 8, letterSpacing: 1 }}>ZERO CREASE</div>
                </div>
            ) : null}
            <Vo from={K(161)} file="vo-12" />
            <Vo from={K(175)} file="vo-13" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
