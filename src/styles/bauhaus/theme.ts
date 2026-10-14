import type { StyleFonts, StylePalette } from "../contract";

// Bauhaus 主题：米白 + 三原色（红黄蓝）+ 黑
export const P: StylePalette = {
    bg: "#F4F1EA",
    bgAlt: "#EBE6DB",
    card: "#FFFFFF",
    ink: "#111111",
    inkSub: "#555555",
    line: "#11111133",
    accent: "#2456D6",
    accentDeep: "#1A3F9E",
    accentLight: "#7FA0E8",
    gold: "#F5C518",
    seal: "#E63B2E",
};

export const FONT = '"Microsoft YaHei","PingFang SC","Helvetica Neue",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
