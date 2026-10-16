import React from "react";
import { pop, SceneProps, useT } from "../../../shared";
import { AvatarMatrix, Fade, Label, PhoneFeed, Scene, Slam, Stage, count, useK, useTone, useToneAt } from "../kit";

// 四个动作按钮（二创 / 模仿 / 分享 / 收藏）
const ActionChips: React.FC<{ t: number; from: number; x: number; y: number; beats: number[] }> = ({ t, from, x, y, beats }) => {
    const P = useTone();
    const items = ["二创", "模仿", "分享", "收藏"];
    return (
        <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 18 }}>
            {items.map((it, i) => {
                const s = t >= from + i * 10 ? pop(t, from + i * 10, 12) : 0;
                const press = beats.includes(i);
                return (
                    <div key={i} style={{ width: 150, height: 92, transform: `scale(${s * (press ? 0.94 : 1)})`, opacity: s, background: `${P.card}`, boxShadow: `inset 0 0 0 2.5px ${P.accent}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)" }}>
                        <span style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 30, fontWeight: 700, color: P.ink, letterSpacing: 2 }}>{it}</span>
                        <span style={{ fontFamily: '"Consolas",monospace', fontSize: 16, color: P.accent, letterSpacing: 1 }}>PRESS</span>
                    </div>
                );
            })}
        </div>
    );
};

// 幕 3 · 点赞工厂（拍 80-96 / 27.43-32.91s）：为了赞为了评论 → 四计数器狂跳 → 二创/模仿/分享/收藏 + 分身矩阵。
export const LikeFarm: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const P = useToneAt(start);
    const hot = 4; // 27.45s 「为了赞，为了评论」
    const copy = K(88); // 29.97s 「请你二创吧，模仿我，分享我吧，收藏我」

    return (
        <Scene start={start}>
            <Stage t={t}>
                <PhoneFeed
                    t={t}
                    from={4}
                    x={640}
                    y={540}
                    likes={count(t, 6, 1284000, 120)}
                    comments={count(t, 10, 32000, 150)}
                    shares={count(t, 14, 91000, 170)}
                    saves={count(t, copy, 27000, 60)}
                    hitAt={80}
                />

                {/* 右侧：分身矩阵（对应「模仿我」） */}
                <Fade t={t} from={copy - 10}>
                    <AvatarMatrix t={t} from={copy} x={1420} y={520} cols={4} rows={5} cell={84} gap={14} />
                    <Label t={t} from={copy + 20} x={1420} y={800} text="// 模仿我 · 复制我 · 成为我" size={24} align="center" color={P.gold} />
                </Fade>

                {/* 底部：四个动作按钮（对应「二创 / 分享 / 收藏」） */}
                <ActionChips t={t} from={copy} x={430} y={880} beats={[0, 1]} />

                {/* 顶部读数：随拍点刷新 */}
                <div style={{ position: "absolute", right: 120, top: 150, textAlign: "right", fontFamily: '"Consolas",monospace', letterSpacing: 3 }}>
                    <div style={{ fontSize: 20, color: `${P.inkSub}`, marginBottom: 10 }}>ENGAGEMENT RATE</div>
                    <div style={{ fontSize: 64, fontWeight: 700, color: P.accent, textShadow: `0 0 24px ${P.accent}66` }}>
                        {t < hot ? "12.4%" : t < copy ? "71.2%" : "99.6%"}
                    </div>
                </div>

                <Slam t={t} from={hot} x={430} y={250} size={44}>为了赞 · 为了评论</Slam>
                <Slam t={t} from={hot + 26} x={1420} y={250} size={44}>还有什么不能说</Slam>
                <Slam t={t} from={copy + 30} x={960} y={196} size={42}>请你二创吧 · 模仿我 · 分享我 · 收藏我</Slam>
            </Stage>
        </Scene>
    );
};
