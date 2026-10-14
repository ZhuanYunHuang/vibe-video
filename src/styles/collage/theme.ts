import type { StyleFonts, StylePalette } from "../contract";

// 拼贴主题：牛皮纸 + 油墨红 + 半调网点
export const P: StylePalette = {
    bg: "#E8DCC8",
    bgAlt: "#DED0B8",
    card: "#FBF7EE",
    ink: "#2A2620",
    inkSub: "#6E6553",
    line: "#C9BCA0",
    accent: "#D94F2B",
    accentDeep: "#A33A20",
    accentLight: "#EDA088",
    gold: "#E3A92C",
    seal: "#D94F2B",
    extra: { inkBlue: "#3B5BA5" },
};

export const FONT = '"Microsoft YaHei","PingFang SC",sans-serif'; // 剪报标题感
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = '"Kaiti SC","KaiTi","STKaiti","Microsoft YaHei",sans-serif'; // 手写批注

export const fonts: StyleFonts = { FONT, MONO, DECOR };
