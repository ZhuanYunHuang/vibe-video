import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { DataStream, Fade, Label, Marquee, Scene, Slam, Stage, WaveBars, useK, useSec, useToneAt } from "../kit";

// 幕 8 · 副歌再现 / 数据深海（拍 208-240 / 71.31-82.29s）：舞台灯退场，钩子升格为主视觉。
export const Hook2A: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const l1 = sec(71.32); // 为了短视频
    const l2 = sec(78.8); // 为了流量

    return (
        <Scene start={start}>
            <Stage t={t}>
                <DataStream t={t} x={0} y={0} w={1920} h={1080} n={40} />
                <DataStream t={t} x={0} y={0} w={1920} h={1080} n={22} reverse />

                {/* 深潜：横向扫描带收紧 */}
                <div style={{ position: "absolute", left: 0, right: 0, top: 540 - 8, height: 16, background: `${P.accent}22`, boxShadow: `0 0 40px ${P.accent}55`, transform: `scaleY(${1 + prog(t, 0, 60) * 0.6})` }} />

                <Slam t={t} from={l1} x={960} y={336} size={104}>为了短视频</Slam>
                <Slam t={t} from={l1 + 40} x={960} y={486} size={60} color={P.gold}>没有什么不能做</Slam>

                <Marquee t={t} y={610} text="FOR THE SHORT VIDEO · 为了短视频 ·" size={44} speed={6} opacity={0.7} />
                <Fade t={t} from={l2 - 10}>
                    <Slam t={t} from={l2} x={960} y={760} size={72}>为了流量 · 没有什么不能做</Slam>
                </Fade>

                <WaveBars t={t} x={360} y={900} w={1200} h={70} n={52} boost={0.8} />

                <Label t={t} from={K(208) + 6} x={140} y={150} text="DEPTH 1024m // 数据深海" size={20} />
                <Label t={t} from={K(224) + 6} x={140} y={186} text="HOOK REPEAT × 2" size={20} color={P.gold} />
                <Label t={t} from={K(232) + 6} x={140} y={222} text="NO EXIT" size={20} color={P.seal} />
            </Stage>
        </Scene>
    );
};
