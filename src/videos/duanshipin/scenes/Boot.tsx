import React from "react";
import { SceneProps, useT } from "../../../shared";
import { DataStream, Fade, Marquee, Scene, Shutdown, Slam, Stage, WaveBars, useK, useSec } from "../kit";

// 幕 1 · 冷开场（拍 0-32 / 0-10.97s）：HUD 开机自检 → 标题 glitch 砸入 → 滚动 banner → 「噢」声波。
export const Boot: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    return (
        <Scene start={start}>
            <Stage t={t}>
                <DataStream t={t} x={0} y={0} w={1920} h={1080} n={20} />

                {/* 0 ~ 2.2s：开机自检 */}
                <Fade t={t} from={2} to={sec(2.4)}>
                    <Shutdown t={t} from={4} x={150} y={700} lines={["BIOS // SHORT-VIDEO LINE", "LOADING FEED ......", "SIGNAL LOCKED"]} lineH={38} size={24} />
                </Fade>

                {/* 2.2s：主标题 */}
                <Slam t={t} from={sec(2.2)} x={960} y={452} size={122}>为了短视频</Slam>
                <Slam t={t} from={sec(5.0)} x={960} y={614} size={52}>没有什么不能做</Slam>

                {/* 5.5s 起：上下滚动 banner */}
                <Fade t={t} from={sec(5.5)}>
                    <Marquee t={t} y={182} text="FOR THE SHORT VIDEO · 为了短视频 ·" size={50} speed={7} />
                    <Marquee t={t} y={862} text="为了流量 · FOR THE TRAFFIC ·" size={44} speed={4.4} opacity={0.45} reverse />
                </Fade>

                {/* 8.8s 起：「噢 ~ 噢~ 噢」声波 */}
                <Fade t={t} from={sec(8.6)}>
                    <WaveBars t={t} x={520} y={710} w={880} h={96} n={44} />
                </Fade>
                <Slam t={t} from={sec(9.2)} x={960} y={792} size={58}>噢 ~ 噢~ 噢</Slam>

                {/* 拍 24 的内容跳变：HUD 角标刷新 */}
                <div style={{ position: "absolute", left: 140, top: 150, fontFamily: '"Consolas",monospace', fontSize: 20, color: "#5C7A99", letterSpacing: 3, opacity: t >= K(24) ? 1 : 0.35 }}>
                    {t >= K(24) ? "STREAM: LIVE   •   VIEWERS 8,204,113" : "STREAM: CONNECTING ..."}
                </div>
            </Stage>
        </Scene>
    );
};
