import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { pop, prog } from "../../core/anim";
import type { MotionItem } from "./items";
import { MOTION_NODES } from "./items";

// 动效演示片：TransitionSeries 组装 19 项 + 4 个分组标题（不使用 Video/SceneShell，无缝隔离）。
// 注意时长算法：总帧数 = Σ 序列帧 − Σ（转场帧 × (序列数 − 1)），Root 注册必须用 MOTION_DEMO_FRAMES。

const ITEM_FRAMES = 72;
const HEAD_FRAMES = 45;
const TRANS_FRAMES = 15;

export const MOTION_DEMO_FRAMES =
    MOTION_NODES.reduce((s, n) => s + (n.kind === "group" ? HEAD_FRAMES : ITEM_FRAMES), 0) -
    (MOTION_NODES.length - 1) * TRANS_FRAMES;

const SANS = '"Microsoft YaHei","PingFang SC",sans-serif';

// 交替使用 5 种官方转场（验证 @remotion/transitions）；逐 case 实例化以保持各自的类型推断
const makeTransition = (i: number, key: string) => {
    const timing = linearTiming({ durationInFrames: TRANS_FRAMES });
    switch (i % 5) {
        case 0:
            return <TransitionSeries.Transition key={key} presentation={fade()} timing={timing} />;
        case 1:
            return <TransitionSeries.Transition key={key} presentation={slide({ direction: "from-right" })} timing={timing} />;
        case 2:
            return <TransitionSeries.Transition key={key} presentation={wipe({ direction: "from-bottom" })} timing={timing} />;
        case 3:
            return <TransitionSeries.Transition key={key} presentation={clockWipe({ width: 1920, height: 1080 })} timing={timing} />;
        default:
            return <TransitionSeries.Transition key={key} presentation={flip({ direction: "from-left" })} timing={timing} />;
    }
};

// 底纹：细点阵网格
const GridBg: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#FFFFFF10 1.2px, transparent 1.2px)", backgroundSize: "28px 28px" }} />
);

// 单项场景：序列内相对帧喂给纯组件，右下角出标签
const ItemScene: React.FC<{ def: MotionItem }> = ({ def }) => {
    const t = useCurrentFrame();
    const s = pop(t, 2, 13);
    return (
        <>
            {def.content(t)}
            <div style={{ position: "absolute", right: 64, bottom: 46, textAlign: "right", opacity: s, transform: `translateY(${(1 - s) * 18}px)` }}>
                <div style={{ fontFamily: SANS, fontSize: 40, fontWeight: 900, color: "#E8F0FF" }}>{def.cn}</div>
                <div style={{ fontFamily: '"Consolas",monospace', fontSize: 22, color: "#6C8BB0", letterSpacing: 2 }}>{def.en}</div>
            </div>
            <div style={{ position: "absolute", left: 64, top: 48, fontFamily: '"Consolas",monospace', fontSize: 20, color: "#39415A" }}>MOTION TOOLBOX</div>
        </>
    );
};

// 分组标题卡
const GroupCard: React.FC<{ title: string; sub: string; index: number }> = ({ title, sub, index }) => {
    const t = useCurrentFrame();
    const s = pop(t, 2, 12);
    const u = prog(t, 8, 18);
    return (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <div style={{ fontFamily: '"Consolas",monospace', fontSize: 30, color: "#4C6FFF", letterSpacing: 8, opacity: s }}>0{index} / 04</div>
            <div style={{ fontFamily: SANS, fontSize: 118, fontWeight: 900, color: "#E8F0FF", letterSpacing: 12, opacity: s, transform: `scale(${0.9 + 0.1 * s})` }}>{title}</div>
            <div style={{ width: 420 * u, height: 6, background: "linear-gradient(90deg,#4C6FFF,#2BD9C2)", borderRadius: 3 }} />
            <div style={{ fontFamily: '"Consolas",monospace', fontSize: 34, color: "#6C8BB0", letterSpacing: 10, opacity: s }}>{sub}</div>
        </div>
    );
};

export const MotionDemo: React.FC = () => {
    // 严格交替 Sequence/Transition（TransitionSeries 的硬性约束），不插入 null
    const children: React.ReactNode[] = [];
    let groupIndex = 0;
    MOTION_NODES.forEach((n, i) => {
        const dur = n.kind === "group" ? HEAD_FRAMES : ITEM_FRAMES;
        children.push(
            <TransitionSeries.Sequence key={`${n.kind}-${i}`} durationInFrames={dur}>
                {n.kind === "group" ? <GroupCard title={n.title} sub={n.sub} index={++groupIndex} /> : <ItemScene def={n.def} />}
            </TransitionSeries.Sequence>
        );
        if (i < MOTION_NODES.length - 1) {
            children.push(makeTransition(i, `trans-${i}`));
        }
    });
    return (
        <AbsoluteFill style={{ background: "#14171F" }}>
            <GridBg />
            <TransitionSeries>{children}</TransitionSeries>
        </AbsoluteFill>
    );
};
