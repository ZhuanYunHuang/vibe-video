import type { StyleFonts, StylePalette } from "../contract";

// 像素风主题：深空底 + 像素绿主色 + 粉红/天空蓝点缀
export const P: StylePalette = {
    bg: "#10121C",
    bgAlt: "#1B1F33",
    card: "#232840",
    ink: "#E8F0FF",
    inkSub: "#8FA0C8",
    line: "#34406A",
    accent: "#57E389",
    accentDeep: "#2FA95E",
    accentLight: "#9BF5B8",
    gold: "#FFD23F",
    seal: "#FF4D6D",
    extra: { sky: "#4CC2FF", rose: "#FF7A9E" },
};

// FusionPixel 为 12px 位图字体：字号建议取 12 的整数倍保证像素锐利
export const FONT = '"FusionPixel","Microsoft YaHei",sans-serif';
export const MONO = '"FusionPixel",Consolas,monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
