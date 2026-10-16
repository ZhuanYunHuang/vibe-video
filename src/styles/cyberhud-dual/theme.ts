import { useCurrentFrame } from "remotion";
import { FPS } from "../../shared";
import type { StyleFonts, StylePalette } from "../contract";

// 双段赛博 HUD 主题：前半「冷监控青」，自 SWITCH_SEC 起切「警报红」。
// 阶段 A 沿用 cyberhud 原配色；阶段 B 是同一套键名的红调，换色只发生在这里一处。
export const P: StylePalette = {
    bg: "#0A0E1A",
    bgAlt: "#101628",
    card: "#121A30",
    ink: "#D8F4FF",
    inkSub: "#6C8BB0",
    line: "#1E2C48",
    accent: "#00E5FF",
    accentDeep: "#00A8C0",
    accentLight: "#7FF3FF",
    gold: "#FFD23F",
    seal: "#FF2E88",
};

export const PR: StylePalette = {
    bg: "#0C0507",
    bgAlt: "#170A0D",
    card: "#1E0E12",
    ink: "#FFE9E9",
    inkSub: "#A07676",
    line: "#4A1D20",
    accent: "#FF2B2B",
    accentDeep: "#B81212",
    accentLight: "#FF9090",
    gold: "#FFB020",
    seal: "#00E5FF",
};

// 换色时刻（秒）= 拍 256 = 87.77s，正是鼓组回归那一拍
export const SWITCH_SEC = 87.77;
// 换色过渡时长（秒）
export const FADE_SEC = 0.35;

const KEYS = ["bg", "bgAlt", "card", "ink", "inkSub", "line", "accent", "accentDeep", "accentLight", "gold", "seal"] as const;

const toRgb = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];

const mixHex = (a: string, b: string, k: number) => {
    const A = toRgb(a);
    const B = toRgb(b);
    return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, "0")).join("");
};

// 按绝对秒取当前调色板：SWITCH_SEC 前为冷青，之后 0.35s 内过渡到警报红
export const paletteAt = (sec: number): StylePalette => {
    const k = Math.min(1, Math.max(0, (sec - SWITCH_SEC) / FADE_SEC));
    if (k <= 0) return P;
    if (k >= 1) return PR;
    const out = { ...P };
    for (const key of KEYS) out[key] = mixHex(P[key], PR[key], k);
    return out;
};

// 顶层组件（全片 HUD 等，不在 <Sequence> 内）用：按绝对帧取色
export const useToneNow = (): StylePalette => paletteAt(useCurrentFrame() / FPS);

// HUD 风：数字优先走等宽，中文回退黑体
export const FONT = '"Consolas","Microsoft YaHei",monospace';
export const MONO = '"Consolas","Cascadia Code",monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
