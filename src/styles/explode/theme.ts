import type { StyleFonts, StylePalette } from "../contract";

// 3D 拆解主题：石墨中性底 + 琥珀主光 + 冷蓝补光
export const P: StylePalette = {
    bg: "#14161B",
    bgAlt: "#1C1F27",
    card: "#242833",
    ink: "#EEF1F7",
    inkSub: "#8A93A6",
    line: "#363C4B",
    accent: "#FF9E2C",
    accentDeep: "#C66A0E",
    accentLight: "#FFC670",
    gold: "#6FA8FF",
    seal: "#FF4D4D",
    extra: { metal: "#AEB6C6", shadow: "#000000" },
};

export const FONT = '"Microsoft YaHei","PingFang SC","Helvetica Neue",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
