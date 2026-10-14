import React from "react";
import { hit, pop, prog } from "../core/anim";

// 文字类动效 6 项：全部 t/from 纯函数（禁 beat hook，Still 可冻结）。
// 字号/字体由调用方通过 style 传入；默认字体栈为系统黑体。

const UI_FONT = '"Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif';

// 打字机：逐字显现 + 闪烁光标
export const Typewriter: React.FC<{
    t: number;
    from: number;
    text: string;
    speed?: number; // 每字帧数
    cursor?: boolean;
    blink?: number;
    caretColor?: string;
    style?: React.CSSProperties;
}> = ({ t, from, text, speed = 2.6, cursor = true, blink = 16, caretColor = "#FFD23F", style }) => {
    if (t < from) return null;
    const shown = Math.floor(Math.max(0, t - from) / speed);
    const done = shown >= text.length;
    const caretOn = t % blink < blink * 0.55;
    return (
        <span style={{ fontFamily: UI_FONT, ...style }}>
            {text.slice(0, shown)}
            {cursor && !done && caretOn ? <span style={{ color: caretColor, marginLeft: 2 }}>▍</span> : null}
        </span>
    );
};

// 数字滚动计数：从 0 滚到 value（等宽数字防跳动）
export const CountUp: React.FC<{
    t: number;
    from: number;
    value: number;
    dur?: number;
    decimals?: number;
    prefix?: string;
    suffix?: string;
    style?: React.CSSProperties;
}> = ({ t, from, value, dur = 40, decimals = 0, prefix = "", suffix = "", style }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    return (
        <span style={{ fontFamily: UI_FONT, fontVariantNumeric: "tabular-nums", ...style }}>
            {prefix}
            {(value * p).toFixed(decimals)}
            {suffix}
        </span>
    );
};

// 逐字浮现：每个字依次弹出（中文按字拆）
export const StaggerText: React.FC<{
    t: number;
    from: number;
    text: string;
    step?: number; // 每字间隔帧
    y?: number;
    style?: React.CSSProperties;
}> = ({ t, from, text, step = 2, y = 24, style }) => (
    <span style={{ fontFamily: UI_FONT, display: "inline-flex", ...style }}>
        {Array.from(text).map((ch, i) => {
            const s = pop(t, from + i * step, 13);
            return (
                <span key={i} style={{ display: "inline-block", opacity: Math.min(1, s * 1.3), transform: `translateY(${(1 - s) * y}px)` }}>
                    {ch}
                </span>
            );
        })}
    </span>
);

// 描边后填色：先出现空心描边字，再把颜色填进去
export const StrokeFillText: React.FC<{
    t: number;
    from: number;
    text: string;
    strokeColor: string;
    fillColor: string;
    strokeWidth?: number;
    fillDelay?: number;
    fillDur?: number;
    style?: React.CSSProperties;
}> = ({ t, from, text, strokeColor, fillColor, strokeWidth = 2, fillDelay = 3, fillDur = 8, style }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const fillA = Math.round(prog(t, from + fillDelay, fillDur) * 255)
        .toString(16)
        .padStart(2, "0");
    return (
        <span
            style={{
                fontFamily: UI_FONT,
                WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
                color: `${fillColor}${fillA}`,
                opacity: Math.min(1, s * 1.2),
                ...style,
            }}
        >
            {text}
        </span>
    );
};

// RGB 分离：红/青错位抖动后归位（glitch 感）
export const RgbSplitText: React.FC<{
    t: number;
    from: number;
    text: string;
    split?: number;
    decay?: number;
    color?: string;
    style?: React.CSSProperties;
}> = ({ t, from, text, split = 6, decay = 5, color = "#FFFFFF", style }) => {
    if (t < from) return null;
    const k = hit(t, from, decay) * split;
    return (
        <span style={{ position: "relative", display: "inline-block", fontFamily: UI_FONT, ...style }}>
            <span style={{ position: "absolute", left: 0, top: 0, color: "#00E5FF", mixBlendMode: "screen", transform: `translateX(${-k}px)` }}>{text}</span>
            <span style={{ position: "absolute", left: 0, top: 0, color: "#FF0055", mixBlendMode: "screen", transform: `translateX(${k}px)` }}>{text}</span>
            <span style={{ position: "relative", color }}>{text}</span>
        </span>
    );
};

// 铬字/渐变字：金属渐变填充，animate 时渐变位置扫动
export const ChromeText: React.FC<{
    t: number;
    from: number;
    text: string;
    gradient?: string;
    animate?: boolean;
    glow?: string;
    style?: React.CSSProperties;
}> = ({ t, from, text, gradient, animate = false, glow, style }) => {
    if (t < from) return null;
    const grad =
        gradient ??
        "linear-gradient(180deg, #FFFFFF 0%, #E8F0FF 30%, #9AA7D8 47%, #47527E 53%, #C9D6FF 74%, #FFFFFF 100%)";
    const sweep = animate ? prog(t, from, 40) : 0;
    return (
        <span
            style={{
                fontFamily: UI_FONT,
                background: grad,
                backgroundSize: "100% 100%",
                backgroundPosition: animate ? `${sweep * 200 - 100}% 0` : "0 0",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: glow ? `drop-shadow(0 0 14px ${glow})` : undefined,
                ...style,
            }}
        >
            {text}
        </span>
    );
};
