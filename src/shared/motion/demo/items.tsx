import React from "react";
import { Callout, ChromeText, CountUp, DrawPath, FlipCard, FocusZoom, MaskReveal, ParallaxLayers, ParticleField, PathFollower, RgbSplitText, Shockwave, ShakeWrapper, SpeedLines, StaggerText, StrokeFillText, Sway, TransitionSweep, Typewriter } from "../index";

// MotionDemo 的 19 个演示项 + 4 个分组标题定义。
// 每项 content(t) 接收该序列内的相对帧，返回 1920×1080 坐标系下的演示视觉（不含标签）。

export type MotionItem = {
    id: string;
    cn: string;
    en: string;
    best: number; // 展示页冻结帧（选在动效最可读的瞬间）
    content: (t: number) => React.ReactNode;
};

export type MotionNode = { kind: "group"; title: string; sub: string } | { kind: "item"; def: MotionItem };

const SANS = '"Microsoft YaHei","PingFang SC",sans-serif';
const WAVE = "M280,640 Q480,360 720,560 T1160,520 T1680,480";
const SNAKE = "M120,880 C400,880 420,300 780,300 C1140,300 1140,760 1500,760 C1700,760 1790,560 1810,440";

const center: React.CSSProperties = { position: "absolute", left: 960, top: 520, transform: "translate(-50%,-50%)", textAlign: "center" };

export const MOTION_ITEMS: MotionItem[] = [
    // ---- 文字类 ----
    {
        id: "typewriter",
        cn: "打字机",
        en: "Typewriter",
        best: 52,
        content: (t) => (
            <div style={{ ...center, width: 1200 }}>
                <Typewriter t={t} from={8} text="命运拐点的三个信号，其实都写在你自己身上……" speed={2.4} style={{ fontSize: 56, fontWeight: 700, color: "#E8F0FF", lineHeight: 1.5 }} />
            </div>
        ),
    },
    {
        id: "countup",
        cn: "数字滚动",
        en: "CountUp",
        best: 50,
        content: (t) => (
            <div style={center}>
                <CountUp t={t} from={6} value={12856} dur={44} style={{ fontSize: 130, fontWeight: 900, color: "#7FD8FF", letterSpacing: 2 }} />
                <div style={{ marginTop: 18, fontFamily: SANS, fontSize: 30, color: "#8FA0C8" }}>从 0 滚到目标值</div>
            </div>
        ),
    },
    {
        id: "stagger",
        cn: "逐字浮现",
        en: "StaggerText",
        best: 46,
        content: (t) => (
            <div style={center}>
                <StaggerText t={t} from={8} text="每个字依次弹出来" step={3} style={{ fontSize: 92, fontWeight: 900, color: "#FFE9FF", letterSpacing: 4 }} />
            </div>
        ),
    },
    {
        id: "stroke-fill",
        cn: "描边后填色",
        en: "StrokeFillText",
        best: 34,
        content: (t) => (
            <div style={center}>
                <StrokeFillText t={t} from={8} text="先描边 · 再填色" strokeColor="#D8F4FF" fillColor="#FFD23F" strokeWidth={3} fillDelay={14} fillDur={16} style={{ fontSize: 96, fontWeight: 900, letterSpacing: 6 }} />
            </div>
        ),
    },
    {
        id: "rgb-split",
        cn: "RGB 分离",
        en: "RgbSplitText",
        best: 14,
        content: (t) => (
            <div style={center}>
                <RgbSplitText t={t} from={8} text="RGB 分离故障" split={10} decay={7} style={{ fontSize: 100, fontWeight: 900, letterSpacing: 4 }} />
            </div>
        ),
    },
    {
        id: "chrome",
        cn: "铬字扫光",
        en: "ChromeText",
        best: 40,
        content: (t) => (
            <div style={center}>
                <ChromeText t={t} from={8} text="CHROME 铬字" animate glow="#FF3EA5" style={{ fontSize: 110, fontWeight: 900, letterSpacing: 8 }} />
            </div>
        ),
    },
    // ---- 路径揭示类 ----
    {
        id: "draw-path",
        cn: "路径描画",
        en: "DrawPath",
        best: 38,
        content: (t) => <DrawPath t={t} from={6} d={WAVE} dur={46} stroke="#4CC2FF" width={9} showHead />,
    },
    {
        id: "path-follower",
        cn: "飞沿路径",
        en: "PathFollower",
        best: 42,
        content: (t) => (
            <>
                <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
                    <path d={WAVE} fill="none" stroke="#39415A" strokeWidth={5} strokeDasharray="10 12" />
                </svg>
                <PathFollower t={t} from={6} d={WAVE} dur={48} color="#FF4D6D" size={22} trail={4} label="沿着路径飞" />
            </>
        ),
    },
    {
        id: "mask-reveal",
        cn: "遮罩揭示",
        en: "MaskReveal",
        best: 46,
        content: (t) => (
            <MaskReveal t={t} from={6} d="M220,540 L1700,540" dur={44} strokeWidth={340}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 420, textAlign: "center" }}>
                    <div style={{ fontFamily: SANS, fontSize: 108, fontWeight: 900, color: "#57E389", letterSpacing: 10 }}>遮罩揭示 REVEAL</div>
                    <div style={{ margin: "26px auto 0", width: 660, height: 88, background: "linear-gradient(90deg,#4C6FFF,#2BD9C2)", borderRadius: 10 }} />
                </div>
            </MaskReveal>
        ),
    },
    {
        id: "callout",
        cn: "引线标注",
        en: "Callout",
        best: 54,
        content: (t) => (
            <>
                <div style={{ position: "absolute", left: 660, top: 560, width: 240, height: 120, background: "#1E2C48", border: "2px solid #34406A", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 30, color: "#D8F4FF" }}>目标元素</div>
                <Callout t={t} from={8} x={900} y={620} text="引线标注 Callout" side="right" color="#FFD23F" />
            </>
        ),
    },
    // ---- 环境持续类 ----
    {
        id: "particle-field",
        cn: "环境粒子场",
        en: "ParticleField",
        best: 120,
        content: (t) => (
            <>
                <ParticleField t={t} n={46} color="#FFD23F" size={6} speed={1.4} drift={26} seed={3} />
                <div style={{ ...center, fontFamily: SANS, fontSize: 44, color: "#8FA0C8" }}>常驻漂浮的粒子，画面永不静止</div>
            </>
        ),
    },
    {
        id: "sway",
        cn: "摆动落定",
        en: "Sway",
        best: 44,
        content: (t) => (
            <Sway t={t} from={6} x={960} y={330} dur={40} amp={2.2} period={26}>
                <div style={{ position: "absolute", left: "50%", top: -120, width: 3, height: 120, background: "#442A85", transform: "translateX(-50%)" }} />
                <div style={{ width: 320, height: 150, background: "#241056", border: "3px solid #FF9AD2", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 44, fontWeight: 800, color: "#FFE9FF", boxShadow: "0 0 30px #FF3EA544" }}>吊牌摆动</div>
            </Sway>
        ),
    },
    {
        id: "parallax",
        cn: "视差层",
        en: "ParallaxLayers",
        best: 130,
        content: (t) => (
            <ParallaxLayers
                t={t}
                dx={70}
                dy={44}
                layers={[
                    { depth: 0.3, content: <div style={{ position: "absolute", left: 640, top: 300, width: 640, height: 440, background: "#1B1F33", borderRadius: 24 }} /> },
                    { depth: 0.9, content: <div style={{ position: "absolute", left: 760, top: 380, width: 400, height: 280, background: "#232840", borderRadius: 20, border: "2px solid #34406A" }} /> },
                    { depth: 1.8, content: <div style={{ position: "absolute", left: 860, top: 460, fontFamily: SANS, fontSize: 58, fontWeight: 900, color: "#9BF5B8" }}>视差视差</div> },
                ]}
            />
        ),
    },
    {
        id: "focus-zoom",
        cn: "聚焦推拉",
        en: "FocusZoom",
        best: 46,
        content: (t) => (
            <FocusZoom t={t} from={6} dur={46} fromScale={1.5} toScale={1} blur={16}>
                <div style={{ ...center }}>
                    <div style={{ width: 720, height: 300, background: "#241056", border: "3px solid #FF9AD2", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 52, fontWeight: 900, color: "#FFE9FF" }}>由虚到实的推镜</div>
                </div>
            </FocusZoom>
        ),
    },
    // ---- 冲击转场类 ----
    {
        id: "shockwave",
        cn: "冲击波",
        en: "Shockwave",
        best: 44,
        content: (t) => (
            <>
                <div style={{ ...center, fontFamily: SANS, fontSize: 64, fontWeight: 900, color: "#FFE9FF" }}>冲击波扩散</div>
                <Shockwave t={t} at={26} x={960} y={540} color="#FF3EA5" rings={3} maxRadius={720} dur={34} />
            </>
        ),
    },
    {
        id: "speed-lines",
        cn: "速度线",
        en: "SpeedLines",
        best: 38,
        content: (t) => (
            <>
                <div style={{ ...center, fontFamily: SANS, fontSize: 76, fontWeight: 900, color: "#FFFFFF" }}>速度线 SPEED</div>
                <SpeedLines t={t} at={24} color="#7FF3FF" dur={26} n={22} inner={360} outer={1280} />
            </>
        ),
    },
    {
        id: "shake",
        cn: "震屏",
        en: "ShakeWrapper",
        best: 34,
        content: (t) => (
            <ShakeWrapper t={t} ats={[26, 46]} amp={10}>
                <div style={{ ...center }}>
                    <div style={{ padding: "26px 64px", background: "#101628", border: "3px solid #00E5FF", borderRadius: 14, fontFamily: SANS, fontSize: 60, fontWeight: 900, color: "#D8F4FF", boxShadow: "0 0 30px #00E5FF44" }}>内容级震屏</div>
                </div>
            </ShakeWrapper>
        ),
    },
    {
        id: "flip-card",
        cn: "翻牌",
        en: "FlipCard",
        best: 42,
        content: (t) => (
            <FlipCard
                t={t}
                from={6}
                flipAt={30}
                x={960}
                y={540}
                w={300}
                h={420}
                rot={-4}
                front={
                    <div style={{ width: "100%", height: "100%", background: "#241056", border: "3px solid #FF9AD2", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 88, fontWeight: 900, color: "#FFE9FF" }}>正</div>
                }
                back={
                    <div style={{ width: "100%", height: "100%", background: "#3DE8FF", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontSize: 88, fontWeight: 900, color: "#14082B" }}>反</div>
                }
            />
        ),
    },
    {
        id: "transition-sweep",
        cn: "转场扫屏",
        en: "TransitionSweep",
        best: 40,
        content: (t) => (
            <>
                <div style={{ ...center, fontFamily: SANS, fontSize: 52, fontWeight: 800, color: "#8FA0C8" }}>route 模式：蛇形扫屏</div>
                <TransitionSweep t={t} from={4} dur={56} mode="route" color="#FF3EA5" d={SNAKE} />
            </>
        ),
    },
];

// 演示顺序：4 个分组标题穿插在 19 项之间
export const MOTION_NODES: MotionNode[] = [
    { kind: "group", title: "文字动效", sub: "TEXT" },
    ...MOTION_ITEMS.slice(0, 6).map((def) => ({ kind: "item" as const, def })),
    { kind: "group", title: "路径与揭示", sub: "PATH" },
    ...MOTION_ITEMS.slice(6, 10).map((def) => ({ kind: "item" as const, def })),
    { kind: "group", title: "环境持续", sub: "AMBIENT" },
    ...MOTION_ITEMS.slice(10, 14).map((def) => ({ kind: "item" as const, def })),
    { kind: "group", title: "冲击与转场", sub: "IMPACT" },
    ...MOTION_ITEMS.slice(14).map((def) => ({ kind: "item" as const, def })),
];
