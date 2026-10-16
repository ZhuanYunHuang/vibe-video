import type { StyleFonts, StylePalette } from "../contract";

// 绘本科画主题：奶油纸 + 钢笔墨蓝 + 蜡笔多彩
export const P: StylePalette = {
    bg: "#FBF3E0",
    bgAlt: "#F5EAD2",
    card: "#FFFDF6",
    ink: "#2C3E63",
    inkSub: "#7C8BA8",
    line: "#DCCCA8",
    accent: "#E8564B",
    accentDeep: "#B93A31",
    accentLight: "#F5A79E",
    gold: "#F2B33D",
    seal: "#4A90D9",
    extra: { green: "#6FA84A", brown: "#9C6B3F" },
};

export const FONT = '"Microsoft YaHei","PingFang SC","Helvetica Neue",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = '"YouYuan","KaiTi","STKaiti","Microsoft YaHei",sans-serif';

export const fonts: StyleFonts = { FONT, MONO, DECOR };
