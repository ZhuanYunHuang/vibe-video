import type { StyleFonts, StylePalette } from "../contract";

// 扁平 MG 主题：浅灰底 + 几何主蓝 + 橙/薄荷点缀
export const P: StylePalette = {
    bg: "#F7F8FA",
    bgAlt: "#EEF1F6",
    card: "#FFFFFF",
    ink: "#1F2937",
    inkSub: "#6B7280",
    line: "#E5E7EB",
    accent: "#4C6FFF",
    accentDeep: "#3A56D4",
    accentLight: "#9DB2FF",
    gold: "#FFC93C",
    seal: "#FF6B35",
    extra: { orange: "#FF6B35", mint: "#2BD9C2" },
};

export const FONT = '"Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif';
export const MONO = '"Cascadia Code",Consolas,monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };
