import React from "react";
import { SceneProps, useT } from "../../../shared";
import { Fade, Label, ScanBox, Scene, Slam, Stage, Ticks, VerdictList, useK, useSec, useToneAt } from "../kit";

// 幕 10 · 审判（拍 256-320 / 87.77-109.71s）：全场刷红，判决清单逐条盖章。
// 全是 HUD 符号：不出现血、尸体、真实伤害画面；每条判决只盖一枚「已执行」印。
export const Verdict: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);

    const items = [
        { label: "造谣", verdict: "枪毙", at: sec(91.0) },
        { label: "煽动", verdict: "鞭刑", at: sec(93.74) },
        { label: "诱导", verdict: "赔米", at: sec(96.48) },
        { label: "营销号", verdict: "活埋", at: sec(99.23) },
        { label: "矩阵号", verdict: "加税", at: sec(101.97) },
        { label: "狗仔队", verdict: "追尾", at: sec(104.71) },
        { label: "水军", verdict: "包杨威", at: sec(107.45) },
    ];

    return (
        <Scene start={start}>
            <Stage t={t}>
                <Slam t={t} from={4} x={960} y={130} size={58}>审判清单</Slam>
                <Label t={t} from={20} x={960} y={196} text="VERDICT LIST // 全部 HUD 符号化执行，不出现真实伤害画面" size={20} align="center" />

                <VerdictList t={t} x={420} y={260} w={1080} items={items} />

                <Ticks x={420} y={980} w={1080} n={36} h={16} />

                {/* 87.77-91.0s：审判模式启动（首条判决前把画面顶住，不留空档） */}
                <Fade t={t} from={2} to={items[0].at - 6}>
                    <ScanBox t={t} from={4} x={340} y={280} w={1240} h={520} />
                    <Slam t={t} from={10} x={960} y={500} size={96}>审判模式</Slam>
                    <Label t={t} from={30} x={960} y={632} text="JUDGMENT MODE // 载入判决清单" size={32} align="center" color={P.seal} />
                    <Label t={t} from={62} x={960} y={700} text="全部执行方式均为画面符号 · 不见血" size={24} align="center" color={P.inkSub} />
                </Fade>

                <Label t={t} from={K(304) + 6} x={140} y={150} text={`EXECUTED ${items.filter((i) => t >= i.at + 18).length} / ${items.length}`} size={22} color={P.seal} />
                <Label t={t} from={K(312) + 6} x={140} y={186} text="流程完成 · 明天照旧" size={22} color={P.gold} />
            </Stage>
        </Scene>
    );
};
