import type { StyleFonts, StylePalette } from "../contract";

// Synthwave 主题：深紫底 + 品红/霓虹青 + 落日黄
export const P: StylePalette = {
    bg: "#14082B",
    bgAlt: "#1F0B45",
    card: "#241056",
    ink: "#FFE9FF",
    inkSub: "#B08ED8",
    line: "#442A85",
    accent: "#FF3EA5",
    accentDeep: "#C2187E",
    accentLight: "#FF9AD2",
    gold: "#3DE8FF",
    seal: "#FFD23F",
};

export const FONT = '"Microsoft YaHei","PingFang SC","Helvetica Neue",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
