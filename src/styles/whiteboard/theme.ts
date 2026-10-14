import type { StyleFonts, StylePalette } from "../contract";

// 白板手绘主题：白板白底 + 马克黑 + 红/黄马克笔
export const P: StylePalette = {
    bg: "#FBFBF7",
    bgAlt: "#F1F1EA",
    card: "#FFFFFF",
    ink: "#23272E",
    inkSub: "#6B7280",
    line: "#D8DAD6",
    accent: "#E8452B",
    accentDeep: "#B5321F",
    accentLight: "#F4A08E",
    gold: "#F2B705",
    seal: "#E8452B",
    extra: { blue: "#1E6BE8" },
};

export const FONT = '"LXGW WenKai","Kaiti SC","KaiTi","Microsoft YaHei",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
