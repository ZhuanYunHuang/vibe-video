import type { StyleFonts, StylePalette } from "../contract";

// 汉字演变主题：暗夜火光 + 青铜金 + 朱砂
export const P: StylePalette = {
    bg: "#170D08",
    bgAlt: "#22130C",
    card: "#2B1A11",
    ink: "#F7E7CE",
    inkSub: "#B98F63",
    line: "#4C2E1C",
    accent: "#FF7A18",
    accentDeep: "#C24A08",
    accentLight: "#FFB86B",
    gold: "#E8B04B",
    seal: "#C0392B",
    extra: { ember: "#FFD08A", bone: "#EADFC8" },
};

export const FONT = '"KaiTi","Kaiti SC","STKaiti","Songti SC","SimSun","Microsoft YaHei",serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = '"STKaiti","KaiTi","Songti SC","SimSun",serif';

export const fonts: StyleFonts = { FONT, MONO, DECOR };
