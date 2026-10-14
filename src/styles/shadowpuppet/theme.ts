import type { StyleFonts, StylePalette } from "../contract";

// 皮影戏主题：米黄幕布透光 + 纯黑剪影 + 皮影朱红/掐丝金
export const P: StylePalette = {
    bg: "#F3E3C3",
    bgAlt: "#EAD6AE",
    card: "#F9EED6",
    ink: "#201A14",
    inkSub: "#6E5F49",
    line: "#D9C69C",
    accent: "#B5402C",
    accentDeep: "#8C2E1F",
    accentLight: "#E0A08A",
    gold: "#C99A3F",
    seal: "#B5402C",
};

export const FONT = '"Kaiti SC","KaiTi","STKaiti","Microsoft YaHei",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
