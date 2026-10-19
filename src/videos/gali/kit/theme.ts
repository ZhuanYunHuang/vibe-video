import type { Pal } from "../../../styles/lyricmv";

// 全片统一主题色 = 开场的黄；不再使用任何红色。
export const YELLOW = "#FFE300";
export const BLACK = "#050505";
export const INK_ON_YELLOW = "#0B0B0B";
export const INK_ON_BLACK = "#EFE9DA";
export const ACCENT = YELLOW; // 原来的红色强调统一改成主题黄

// 黄场：亮黄底 + 近黑硬字；重点词块用「黑底黄字」反色
export const YELLOW_PAL: Pal = {
    bg: YELLOW,
    ink: INK_ON_YELLOW,
    accent: INK_ON_YELLOW,
    dim: "#6E675C",
    block: INK_ON_YELLOW,
    blockInk: YELLOW,
    flash: INK_ON_YELLOW,
    burst: INK_ON_YELLOW,
    scan: 0.05,
    grain: 0.05,
    vig: 0.12,
};

// 黑场：近黑底 + 骨白硬字；重点词块用「黄底黑字」，与开场同主题色
export const BLACK_PAL: Pal = {
    bg: BLACK,
    ink: INK_ON_BLACK,
    accent: YELLOW,
    dim: "#6E675C",
    block: YELLOW,
    blockInk: INK_ON_YELLOW,
    flash: YELLOW,
    burst: YELLOW,
    scan: 0.14,
    grain: 0.13,
    vig: 1,
};

export { FONT, MONO } from "../../../styles/lyricmv";
