import type { Pal, ThemeId } from "../../../styles/lyricmv";

// 王座：黑金 + 象牙白。red 槽位在这里是「金场」，white 槽位是「象牙场」。
export const THRONE: Record<ThemeId, Pal> = {
    dark: { bg: "#070604", ink: "#F2E8D2", accent: "#D4A73C", dim: "#6B5C3E", block: "#D4A73C", blockInk: "#140D04", flash: "#F2E8D2", burst: "#F2E8D2", scan: 0.12, grain: 0.14, vig: 1 },
    red: { bg: "#D9AE22", ink: "#140D04", accent: "#F2E8D2", dim: "#140D04", block: "#140D04", blockInk: "#C9A227", flash: "#F7EFD9", burst: "#F7EFD9", scan: 0.06, grain: 0.04, vig: 0.25 },
    white: { bg: "#F2E8D2", ink: "#140D04", accent: "#A87B1F", dim: "#8A7A5A", block: "#140D04", blockInk: "#F2E8D2", flash: "#140D04", burst: "#A87B1F", scan: 0.05, grain: 0.04, vig: 0.25 },
};

export const GOLD = "#D4A73C";
export const GOLD_DEEP = "#8A6616";
export const INK = "#140D04";
