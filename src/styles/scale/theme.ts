import type { StyleFonts, StylePalette } from "../contract";

// 比例尺对比主题：蓝图浅底 + 刻度青 + 目标高亮橙
export const P: StylePalette = {
    bg: "#F2F6FA",
    bgAlt: "#E6EDF5",
    card: "#FFFFFF",
    ink: "#0F2A47",
    inkSub: "#5C7794",
    line: "#C3D3E2",
    accent: "#00A6CE",
    accentDeep: "#007C9B",
    accentLight: "#7FD9EC",
    gold: "#FF8A3D",
    seal: "#E03E3E",
    extra: { grid: "#BFD3E6", inkDeep: "#08203A" },
};

export const FONT = '"Microsoft YaHei","PingFang SC","Helvetica Neue",sans-serif';
export const MONO = 'Consolas,"Cascadia Code",monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
