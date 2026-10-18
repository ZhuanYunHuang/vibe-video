import type { StyleFonts, StylePalette } from "../contract";

// 歌词 MV 风：近黑街头底 + 骨白硬字 + 血红韵脚块；红/白两套配色留给进鼓后的段落。
export type ThemeId = "dark" | "red" | "white";

export type Pal = {
    bg: string;
    ink: string;
    accent: string;
    dim: string;
    block: string;
    blockInk: string;
    flash: string;
    scan: number;
    grain: number;
    vig: number;
};

export const PAL: Record<ThemeId, Pal> = {
    dark: { bg: "#050505", ink: "#EFE9DA", accent: "#C8102E", dim: "#6E675C", block: "#C8102E", blockInk: "#EFE9DA", flash: "#EFE9DA", scan: 0.14, grain: 0.13, vig: 1 },
    red: { bg: "#C8102E", ink: "#F8F2E4", accent: "#0A0A0A", dim: "#F8F2E4", block: "#F8F2E4", blockInk: "#C8102E", flash: "#F8F2E4", scan: 0.1, grain: 0.07, vig: 0.55 },
    white: { bg: "#F2EDE3", ink: "#0A0A0A", accent: "#C8102E", dim: "#8A8580", block: "#C8102E", blockInk: "#F2EDE3", flash: "#0A0A0A", scan: 0.07, grain: 0.05, vig: 0.3 },
};

export const P: StylePalette = {
    bg: PAL.dark.bg,
    bgAlt: "#0A0A0A",
    card: "#0C0C0C",
    ink: PAL.dark.ink,
    inkSub: "#8A8580",
    line: "#26231D",
    accent: PAL.dark.accent,
    accentDeep: "#5E0913",
    accentLight: "#E8556A",
    gold: "#D8CBAE",
    seal: PAL.dark.accent,
    extra: { red: "#C8102E", paper: "#F2EDE3", bone: "#EFE9DA", bloodDeep: "#5E0913", dim: "#6E675C" },
};

export const FONT = '"YouShe","Bahnschrift","Arial Black","Microsoft YaHei","PingFang SC",sans-serif';
export const LATIN = '"YouShe","Bahnschrift","Arial Black",sans-serif';
export const MONO = '"Consolas","Cascadia Mono","Courier New",monospace';
export const DECOR = FONT;

export const fonts: StyleFonts = { FONT, MONO, DECOR };

// 估算文本宽度：中文 1em、拉丁 0.56em
export const textWidth = (text: string) => Array.from(text).reduce((n, ch) => n + (/^[\x00-\x7f]$/.test(ch) ? 0.56 : 1), 0);

// 按可用宽度反推字号，最低 56
export const fitSize = (text: string, maxWidth = 1560, cap = 176) => Math.max(56, Math.min(cap, maxWidth / Math.max(0.5, textWidth(text))));
