import React from "react";
import { hit, prog, SceneProps, useT } from "../../../shared";
import { Bar, EraDial, Fade, FoxSpirit, Label, ReviveCoin, Scene, Slam, Stage, useK, useSec, useToneAt } from "../kit";

// 幕 11 · 反向狂奔（拍 320-352 / 109.71-120.69s）：狐狸成精 → 会硬警报 → 复活币 → 社会倒退三叠纪。
export const Rewind: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const fox = sec(110.2); // 狐狸成精
    const hard = sec(112.94); // 每次刷到条囹会硬
    const coin = sec(115.68); // 寻找复活币
    const era = sec(118.43); // 社会倒退三叠纪

    // 「会硬」→ 警报条弹起（HUD 化写法，不做任何具象）
    const hardP = prog(t, hard, 12);
    const alarm = hit(t, hard, 30);

    return (
        <Scene start={start}>
            <Stage t={t}>
                {/* 狐狸成精 */}
                <Fade t={t} from={fox - 6} to={hard + 6}>
                    <FoxSpirit t={t} from={fox} x={660} y={330} size={340} />
                    <Slam t={t} from={fox} x={1400} y={480} size={46}>为了短视频 · 狐狸成精</Slam>
                    <Label t={t} from={fox + 40} x={1400} y={560} text="ALGORITHM TRAINED · 已成精" size={24} align="center" color={P.gold} />
                </Fade>

                {/* 会硬：警报条弹起 */}
                <Fade t={t} from={hard - 4} to={coin + 4}>
                    <Slam t={t} from={hard} x={960} y={200} size={50}>每次刷到条囹会硬</Slam>
                    <div style={{ position: "absolute", left: 560, top: 330, width: 800 }}>
                        <Bar t={t} x={0} y={0} w={800} h={64} p={hardP} label="ALERT LEVEL" value={hardP >= 0.99 ? "MAX" : `${(hardP * 100).toFixed(0)}%`} thick />
                    </div>
                    <div style={{ position: "absolute", inset: 0, background: P.seal, opacity: alarm * 0.16, pointerEvents: "none" }} />
                    <Label t={t} from={hard + 20} x={960} y={470} text="// 生理反应已纳入推荐算法权重" size={26} align="center" color={P.seal} />
                </Fade>

                {/* 复活币 */}
                <Fade t={t} from={coin - 6} to={era - 4}>
                    <Slam t={t} from={coin} x={960} y={196} size={50}>为了短视频 · 寻找复活币</Slam>
                    <ReviveCoin t={t} from={coin + 6} x={960} y={330} />
                </Fade>

                {/* 地质年代表盘 */}
                <Fade t={t} from={era - 6}>
                    <Slam t={t} from={era} x={560} y={210} size={48}>为了短视频 · 社会倒退三叠纪</Slam>
                    <EraDial t={t} from={era} x={1300} y={580} r={280} />
                    <Label t={t} from={K(344) + 6} x={140} y={150} text="ERA REWIND // 2026 → 三叠纪" size={22} color={P.seal} />
                </Fade>
            </Stage>
        </Scene>
    );
};
