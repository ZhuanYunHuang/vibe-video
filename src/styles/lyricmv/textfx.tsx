import React from "react";
import { hit, pop, prog, rnd } from "../../shared";
import { FONT, LATIN, MONO, textWidth } from "./theme";

// 单行文字特效：全部 t/from 纯函数，字号与颜色由调用方传入。
export type FxProps = { t: number; from: number; text: string; size: number; color: string; accent: string };

// 纯拉丁短句用 Impact，中英混排回落到黑体
const fontOf = (text: string) => (/[\u4e00-\u9fff]/.test(text) ? FONT : LATIN);

const base = (size: number, color: string, text: string): React.CSSProperties => ({
    fontFamily: fontOf(text),
    fontWeight: 400,
    fontSize: size,
    lineHeight: 1,
    color,
    whiteSpace: "pre",
    display: "inline-block",
});

// 砸入：1.3 倍压到 1，配血色硬投影与水平抖动
export const SlamText: React.FC<FxProps> = ({ t, from, text, size, color, accent }) => {
    if (t < from) return null;
    const p = prog(t, from, 6);
    const sh = hit(t, from, 4) * 9;
    return (
        <span
            style={{
                ...base(size, color, text),
                transform: `scale(${1 + 0.3 * (1 - p)}) translate(${Math.sin(t * 8.3) * sh}px, 0)`,
                filter: `blur(${(1 - p) * 10}px)`,
                textShadow: `${Math.round(size * 0.035)}px ${Math.round(size * 0.035)}px 0 ${accent}`,
            }}
        >
            {text}
        </span>
    );
};

// 色散：血红与骨白两层朝相反方向错位，5 帧内归位
export const SplitText: React.FC<FxProps> = ({ t, from, text, size, color, accent }) => {
    if (t < from) return null;
    const d = hit(t, from, 5) * 15;
    return (
        <span style={{ ...base(size, color, text), position: "relative" }}>
            <span style={{ position: "absolute", left: 0, top: 0, color: accent, mixBlendMode: "screen", transform: `translateX(${d}px)` }}>{text}</span>
            <span style={{ position: "absolute", left: 0, top: 0, color: "#FFFFFF", mixBlendMode: "screen", opacity: 0.5, transform: `translateX(${-d * 0.6}px)` }}>{text}</span>
            <span style={{ position: "relative", color }}>{text}</span>
        </span>
    );
};

// 爬出：逐字打字，每个字从右侧 12px 滑入
export const CrawlText: React.FC<FxProps> = ({ t, from, text, size, color }) => {
    if (t < from) return null;
    const shown = Math.max(0, Math.floor((t - from) / 1.5));
    return (
        <span style={base(size, color, text)}>
            {Array.from(text).map((ch, i) =>
                i < shown ? (
                    <span
                        key={i}
                        style={{
                            display: "inline-block",
                            whiteSpace: "pre",
                            opacity: Math.min(1, (shown - i) / 2),
                            transform: `translateX(${(1 - Math.min(1, (t - from - i * 1.5) / 8)) * 12}px)`,
                        }}
                    >
                        {ch}
                    </span>
                ) : null,
            )}
        </span>
    );
};

// 收拢：字符从四周散位归位，带旋转与模糊
export const ChaosText: React.FC<FxProps> = ({ t, from, text, size, color }) => {
    if (t < from) return null;
    const p = Math.min(1, Math.max(0, t - from) / 9);
    const q = 1 - p;
    return (
        <span style={base(size, color, text)}>
            {Array.from(text).map((ch, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        whiteSpace: "pre",
                        opacity: 0.25 + 0.75 * p,
                        transform: `translate(${(rnd(i, 3) - 0.5) * 260 * q}px, ${(rnd(i, 7) - 0.5) * 180 * q}px) rotate(${(rnd(i, 11) - 0.5) * 50 * q}deg)`,
                        filter: q > 0.12 ? `blur(${q * 3}px)` : undefined,
                    }}
                >
                    {ch}
                </span>
            ))}
        </span>
    );
};

// 盖戳：旋转方框 + 实心字 + SEALED 小标
export const StampText: React.FC<FxProps> = ({ t, from, text, size, color, accent }) => {
    if (t < from) return null;
    const p = pop(t, from, 13);
    return (
        <span
            style={{
                ...base(size, color, text),
                position: "relative",
                border: `5px solid ${accent}`,
                padding: "14px 30px 26px",
                transform: `rotate(-6deg) scale(${0.88 + 0.12 * Math.min(1, p)})`,
                opacity: Math.min(1, p * 1.6),
                boxShadow: `0 0 0 2px ${accent}22`,
            }}
        >
            {text}
            <span style={{ position: "absolute", right: 14, bottom: 8, fontFamily: MONO, fontSize: 18, letterSpacing: 3, color: accent, fontWeight: 400 }}>
                SEALED
            </span>
        </span>
    );
};

// 抖动：逐字错频摆动，振幅随时间衰减
export const ShakeText: React.FC<FxProps> = ({ t, from, text, size, color, accent }) => {
    if (t < from) return null;
    const amp = 3 + 5 * Math.exp(-Math.max(0, t - from) / 16);
    return (
        <span style={{ ...base(size, color, text), textShadow: `0 0 18px ${accent}88` }}>
            {Array.from(text).map((ch, i) => (
                <span
                    key={i}
                    style={{
                        display: "inline-block",
                        whiteSpace: "pre",
                        transform: `translate(${Math.sin((t + i * 3) * 1.7) * amp}px, ${Math.cos((t + i * 5) * 1.3) * amp * 0.7}px)`,
                    }}
                >
                    {ch}
                </span>
            ))}
        </span>
    );
};

// 斜切：文字分成三条横向色带错位，压两道血条
export const SlashText: React.FC<FxProps> = ({ t, from, text, size, color, accent }) => {
    if (t < from) return null;
    const d = hit(t, from, 6) * 22;
    const bands: [number, number, number][] = [
        [0, 34, -1],
        [34, 61, 1],
        [61, 100, -0.6],
    ];
    return (
        <span
            style={{
                display: "inline-block",
                position: "relative",
                width: Math.round(textWidth(text) * size) + 4,
                height: Math.round(size * 1.06),
                fontFamily: fontOf(text),
                fontWeight: 400,
                fontSize: size,
                lineHeight: 1,
                color,
                whiteSpace: "pre",
            }}
        >
            {bands.map(([a, b, s], i) => (
                <span
                    key={i}
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        color: i === 1 ? accent : color,
                        clipPath: `inset(${a}% 0 ${100 - b}% 0)`,
                        transform: `translateX(${d * s}px)`,
                    }}
                >
                    {text}
                </span>
            ))}
            <span style={{ position: "absolute", left: "-8%", top: "31%", width: "116%", height: 5, background: accent, transform: "rotate(-7deg)", opacity: 0.65 }} />
            <span style={{ position: "absolute", left: "-8%", top: "68%", width: "116%", height: 3, background: accent, transform: "rotate(-7deg)", opacity: 0.45 }} />
        </span>
    );
};

// 聚焦：由虚到实、由近到远，全片最安静的一句
export const FocusText: React.FC<FxProps> = ({ t, from, text, size, color }) => {
    if (t < from) return null;
    const p = prog(t, from, 10);
    return (
        <span
            style={{
                ...base(size, color, text),
                opacity: p,
                transform: `scale(${1.06 - 0.06 * p})`,
                filter: `blur(${(1 - p) * 18}px)`,
            }}
        >
            {text}
        </span>
    );
};

// 韵脚：反色小色块整体弹出，色块与字同步出现，不会出现红字压红底
export const RhymeText: React.FC<FxProps & { block: string; blockInk: string }> = ({ t, from, text, size, block, blockInk }) => {
    if (t < from) return null;
    const p = Math.min(1, pop(t, from, 12));
    return (
        <span
            style={{
                position: "relative",
                display: "inline-block",
                fontFamily: fontOf(text),
                fontWeight: 400,
                fontSize: size,
                lineHeight: 1,
                whiteSpace: "pre",
                marginLeft: 12,
                transform: `scale(${1.22 - 0.22 * p})`,
                transformOrigin: "left center",
            }}
        >
            <span
                style={{
                    position: "absolute",
                    left: -2,
                    right: -12,
                    top: -4,
                    bottom: -8,
                    background: block,
                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)",
                }}
            />
            <span style={{ position: "relative", color: blockInk }}>{text}</span>
        </span>
    );
};
