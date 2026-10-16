import React from "react";
import { SceneProps, useT } from "../../../shared";
import { ByteMark, CommentBox, DataLeak, Fade, Label, MoneyRain, OfferPopup, PanguSplit, Scene, SinaMark, Slam, Stage, useK, useSec, useTone, useToneAt } from "../kit";

// 新浪草原（HUD 化：草簇条 + 流动的浪线）
const Grassland: React.FC<{ t: number; from: number; x: number; y: number; w?: number }> = ({ t, from, x, y, w = 900 }) => {
    const P = useTone();
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w }}>
            <div style={{ position: "relative", height: 130, background: `${P.accent}12`, boxShadow: `inset 0 0 0 2px ${P.line}`, overflow: "hidden" }}>
                {Array.from({ length: 46 }, (_, i) => {
                    const h = 26 + ((i * 37) % 60);
                    const sw = Math.sin(t / 14 + i * 0.6) * 5;
                    return <div key={i} style={{ position: "absolute", left: (i / 46) * w, bottom: 0, width: 3, height: h, background: P.accent, opacity: 0.7, transform: `translateX(${sw}px) skewX(${sw}deg)` }} />;
                })}
                <div style={{ position: "absolute", left: 0, right: 0, top: 34 + ((t * 1.4) % 60), height: 3, background: P.accentLight, boxShadow: `0 0 16px ${P.accent}` }} />
            </div>
            <div style={{ marginTop: 10, fontFamily: '"Consolas",monospace', fontSize: 22, color: P.accent, letterSpacing: 3 }}>新浪 · 一片草原（GRASSLAND v1.0）</div>
        </div>
    );
};

// 幕 12 · 盘古与平台（拍 352-400 / 120.69-137.14s）：开天辟地被 CANCELLED → 数据污染 → 平台 offer → 钱雨 → 草原 → 发言。
export const Pangu: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const P = useToneAt(start);
    const pangu = sec(121.17); // 那盘古要知道都懒得开天地
    const cancel = sec(123.91); // 开出一帮在网上拉稀
    const offer = sec(126.66); // 你要感谢字节创造的就业机会
    const money = sec(129.4); // 让你赚到不属于你的钱
    const grass = sec(132.14); // 还有新浪给你创造了一片草原
    const speak = sec(134.89); // 发言

    return (
        <Scene start={start}>
            <Stage t={t}>
                {/* 盘古开天地 → 取消 */}
                <Fade t={t} from={pangu - 8} to={cancel + 24}>
                    <Slam t={t} from={pangu} x={960} y={150} size={46}>那盘古要知道 · 都懒得开天地</Slam>
                    <PanguSplit t={t} from={pangu + 8} x={400} y={280} w={1120} h={520} cancelAt={cancel} />
                </Fade>

                {/* 数据污染泄漏 */}
                <Fade t={t} from={cancel} to={offer - 4}>
                    <DataLeak t={t} from={cancel} x={760} y={240} w={420} h={480} />
                    <Slam t={t} from={cancel + 10} x={760} y={880} size={42}>开出一帮在网上拉稀</Slam>
                </Fade>

                {/* 字节（示意标识）：就业机会 */}
                <Fade t={t} from={offer - 4} to={money + 30}>
                    <ByteMark t={t} from={offer} x={360} y={158} size={92} />
                    <OfferPopup t={t} from={offer} x={760} y={296} title="就业机会 × 1" lines={["岗位：内容生产者（编外）", "薪资：流量分成", "KPI：日更 · 越反智越好"]} />
                </Fade>

                {/* 不属于你的钱 */}
                <Fade t={t} from={money - 4} to={grass + 20}>
                    <MoneyRain t={t} from={money} x={760} y={560} w={1160} h={420} n={24} />
                    <Slam t={t} from={money} x={1340} y={340} size={46} color={P.gold}>让你赚到不属于你的钱</Slam>
                </Fade>

                {/* 新浪（示意标识）草原 */}
                <Fade t={t} from={grass - 4} to={speak + 8}>
                    <Slam t={t} from={grass} x={800} y={210} size={46}>还有新浪给你创造了一片草原</Slam>
                    <SinaMark t={t} from={grass} x={1290} y={162} size={92} />
                    <Grassland t={t} from={grass} x={520} y={320} w={900} />
                </Fade>

                {/* 发言 */}
                <Fade t={t} from={speak - 4}>
                    <Slam t={t} from={speak} x={960} y={520} size={56}>发言</Slam>
                    <CommentBox t={t} from={speak + 8} x={960} y={620} w={780} />
                </Fade>

                <Label t={t} from={K(392) + 4} x={140} y={150} text="PLATFORM ECONOMY // 已完成" size={22} color={P.gold} />
            </Stage>
        </Scene>
    );
};
