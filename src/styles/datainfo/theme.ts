import type { StyleFonts, StylePalette } from "../contract";

// 数据信息图主题：暖白底 + 数据蓝/橙 + 警示红
export const P: StylePalette = {
    bg: "#F7F5F0",
    bgAlt: "#EFEBE2",
    card: "#FFFFFF",
    ink: "#1A2233",
    inkSub: "#6B7280",
    line: "#E2DED4",
    accent: "#2E6BFF",
    accentDeep: "#1E4FD0",
    accentLight: "#A8C4FF",
    gold: "#FF9F1C",
    seal: "#E5484D",
};

export const FONT = '"Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
