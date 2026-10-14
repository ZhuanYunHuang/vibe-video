import type { StyleFonts, StylePalette } from "../contract";

// 赛博 HUD 主题：深蓝黑底 + 霓虹青/品红
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

// HUD 风：数字优先走等宽，中文回退黑体
export const FONT = '"Consolas","Microsoft YaHei",monospace';
export const MONO = '"Consolas","Cascadia Code",monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
