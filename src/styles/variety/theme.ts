import type { StyleFonts, StylePalette } from "../contract";

// 综艺花字主题：宝蓝舞台 + 亮黄花字 + 桃红/亮橙点缀
export const P: StylePalette = {
    bg: "#102046",
    bgAlt: "#0B1836",
    card: "#1A2A52",
    ink: "#FFFFFF",
    inkSub: "#A9BCE0",
    line: "#2B3D6B",
    accent: "#FFD51E",
    accentDeep: "#D9A800",
    accentLight: "#FFE97A",
    gold: "#FF7A00",
    seal: "#FF4E9B",
    extra: { blue: "#2BB0FF", green: "#39D98A" },
};

export const FONT = '"Microsoft YaHei","PingFang SC","Helvetica Neue",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = '"YouYuan","Microsoft YaHei",sans-serif';

export const fonts: StyleFonts = { FONT, MONO, DECOR };
