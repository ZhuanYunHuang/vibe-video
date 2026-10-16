import React from "react";
import { SceneProps, useT } from "../../../shared";
import { DamFlow, Fade, FiveElements, HotSearchList, Label, PasswordLock, Scene, Slam, Stage, useK, useSec, useToneAt } from "../kit";

// 幕 4 · 五行缺火 + 反智热搜 + 流量密码 + 引流大坝（拍 96-128 / 32.91-43.89s）。
export const HotSearch: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const five = 4; // 33.0s 「问问金木水土」
    const hot = sec(35.46); // 「越反智越上热搜」
    const lock = sec(38.2); // 「流量密码 / 抽象的锁」
    const dam = sec(40.95); // 「装傻比大坝和水电站，还更能引流」

    return (
        <Scene start={start}>
            <Stage t={t}>
                {/* 五行格 */}
                <Fade t={t} from={five} to={hot + 8}>
                    <Slam t={t} from={five} x={960} y={300} size={54}>金木水土 · 四位都想火</Slam>
                    <FiveElements t={t} from={five + 6} x={960} y={430} cell={150} />
                    <Label t={t} from={five + 46} x={960} y={740} text="// 五行缺火 · 火格锁定" size={26} align="center" color={P.seal} />
                </Fade>

                {/* 热搜榜：反智条目往上爬 */}
                <Fade t={t} from={hot - 4} to={lock - 6}>
                    <HotSearchList
                        t={t}
                        x={180}
                        y={300}
                        w={620}
                        shiftAt={hot + 26}
                        items={["越反智越上热搜", "比脏 · 谁能脏得过", "装傻引流大赏", "过期电子榨菜", "道德制高点巡礼"]}
                        hot={[412, 388, 340, 296, 233]}
                    />
                    <Slam t={t} from={hot + 40} x={1400} y={420} size={46}>越反智越上热搜</Slam>
                    <Label t={t} from={hot + 70} x={1400} y={500} text="RANK 2 → 1  ▲" size={30} align="center" color={P.seal} />
                </Fade>

                {/* 流量密码 / 抽象的锁 */}
                <Fade t={t} from={lock - 4} to={dam - 16}>
                    <PasswordLock t={t} from={lock} x={960} y={700} w={560} />
                    <Slam t={t} from={lock + 40} x={960} y={300} size={48}>为拿到流量密码 · 给自己上了抽象的锁</Slam>
                </Fade>

                {/* 装傻引流的大坝（对应 40.95s「装傻比大坝和水电站，还更能引流」） */}
                <Fade t={t} from={dam - 14}>
                    <Slam t={t} from={dam} x={960} y={200} size={50}>装傻比大坝和水电站 · 还更能引流</Slam>
                    <DamFlow t={t} from={dam - 10} x={960} y={340} w={640} h={300} flow={0.72} />
                    <Label t={t} from={dam + 50} x={960} y={730} text="傻度 ↑ 引流量 ↑ · 大坝表示不服" size={26} align="center" color={P.gold} />
                </Fade>

                {/* 拍 104 / 112 / 120 的内容跳变角标 */}
                <div style={{ position: "absolute", left: 140, top: 150, fontFamily: '"Consolas",monospace', fontSize: 20, color: `${P.inkSub}`, letterSpacing: 3 }}>
                    {`TRENDING ENGINE // SORT BY ${t >= K(104) ? "STUPIDITY" : "HEAT"}   •   REV ${String(Math.floor(t / 30)).padStart(2, "0")}`}
                </div>
            </Stage>
        </Scene>
    );
};
