// 本片调色板：前 7 句近黑底，21.18s 进鼓后切到红白体系并保持。
export type ThemeId = "dark" | "red" | "white";

export type Pal = {
    bg: string;
    ink: string;
    accent: string;
    dim: string;
    block: string; // 韵脚色块底色
    blockInk: string; // 色块上的字色
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

// 深色体系的简写，封面仍在用
export const P = {
    bg: PAL.dark.bg,
    bone: PAL.dark.ink,
    dim: PAL.dark.dim,
    blood: PAL.dark.accent,
    bloodDeep: "#5E0913",
    steel: "#8A8580",
};

export const FONT = '"YouShe","Microsoft YaHei","PingFang SC",sans-serif';
export const LATIN = '"YouShe","Bahnschrift","Arial Black",sans-serif';
export const MONO = '"Consolas","Cascadia Mono","Courier New",monospace';

// 估算文本宽度：中文 1em、拉丁 0.56em
export const textWidth = (text: string) => Array.from(text).reduce((n, ch) => n + (/^[\x00-\x7f]$/.test(ch) ? 0.56 : 1), 0);

// 按可用宽度反推字号，保证长句不出画
export const fitSize = (text: string, maxWidth = 1560, cap = 176) => Math.max(56, Math.min(cap, maxWidth / Math.max(0.5, textWidth(text))));
