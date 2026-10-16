import type { StyleFonts, StylePalette } from "../contract";

// 数学可视化主题：近纯黑学术底 + 3b1b 青蓝 + 公式高亮黄
export const P: StylePalette = {
    bg: "#0B0D12",
    bgAlt: "#12151C",
    card: "#141822",
    ink: "#E8ECF4",
    inkSub: "#8C96A8",
    line: "#2A3140",
    accent: "#58C4DD",
    accentDeep: "#2E8EA6",
    accentLight: "#9FE0EF",
    gold: "#FFE066",
    seal: "#FC6255",
    extra: { green: "#83C167", yellowBright: "#FFFF80", blueDeep: "#3B7DD8" },
};

export const FONT = '"Cambria Math","Georgia","Times New Roman","Microsoft YaHei",serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = 'Georgia,"Times New Roman",serif';

export const fonts: StyleFonts = { FONT, MONO, DECOR };
