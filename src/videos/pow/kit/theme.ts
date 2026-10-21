import type { Pal } from "../../../styles/lyricmv";

// 全片主题取样自《POW》封面：荧光绿 + 炭黑 + 骨白（街头涂鸦 / 粗笔刷质感）。
export const GREEN = "#4AFF00";
export const GREEN_LIGHT = "#7DFF33";
export const GREEN_DEEP = "#2F6F00";
export const WALL = "#2A2A2A";
export const INK_DARK_BG = "#141414";
export const INK_LIGHT = "#F2F2F2";
export const ACID_BG = "#4AFF00";

// A/D/E 场：炭黑底 + 骨白字 + 荧光绿重点词块
export const DARK: Pal = {
    bg: INK_DARK_BG,
    ink: INK_LIGHT,
    accent: GREEN,
    dim: "#6E6E6E",
    block: GREEN,
    blockInk: "#0A0A0A",
    flash: GREEN,
    burst: GREEN,
    scan: 0.16,
    grain: 0.18,
    vig: 0.9,
};

// B 场：比 A 再深一档，换场拉出对比
export const DEEP: Pal = {
    bg: "#0C0C0C",
    ink: "#F7F7F7",
    accent: GREEN,
    dim: "#5E5E5E",
    block: GREEN,
    blockInk: "#0A0A0A",
    flash: GREEN_LIGHT,
    burst: GREEN_LIGHT,
    scan: 0.13,
    grain: 0.16,
    vig: 1,
};

// C 场：荧光绿反色场（绿底黑字），只给 diss 段用
export const ACID: Pal = {
    bg: ACID_BG,
    ink: "#0A0A0A",
    accent: "#0A0A0A",
    dim: GREEN_DEEP,
    block: "#0A0A0A",
    blockInk: ACID_BG,
    flash: "#0A0A0A",
    burst: "#0A0A0A",
    scan: 0.08,
    grain: 0.1,
    vig: 0.35,
};

// F 场：收官，纯黑底 + 纯白字 + 绿点缀
export const FLARE: Pal = {
    bg: "#0A0A0A",
    ink: "#FFFFFF",
    accent: GREEN,
    dim: "#6E6E6E",
    block: "#FFFFFF",
    blockInk: "#0A0A0A",
    flash: GREEN,
    burst: GREEN,
    scan: 0.12,
    grain: 0.14,
    vig: 0.8,
};

export { FONT, MONO, LATIN, textWidth, fitSize } from "../../../styles/lyricmv";
