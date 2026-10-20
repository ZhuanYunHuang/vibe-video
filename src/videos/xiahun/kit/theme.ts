import type { Pal } from "../../../styles/lyricmv";

// 全片灰色主题（取样自参考图 #313138），只用灰阶做结构：深灰 → 中灰 → 浅灰白场。
export const GREY = "#313138"; // 参考图取样色（中灰场底色）
export const INK_LIGHT = "#EDEDF2";
export const INK_DARK = "#1F1F24";

// A 深灰场（L1–L13）：深底浅字，重点词块用浅灰块反色
export const DEEP_PAL: Pal = {
    bg: "#1F1F24",
    ink: INK_LIGHT,
    accent: "#C9C9D2",
    dim: "#6E6E78",
    block: "#E6E6EC",
    blockInk: INK_DARK,
    flash: "#E6E6EC",
    burst: "#E6E6EC",
    scan: 0.12,
    grain: 0.12,
    vig: 0.85,
};

// B 中灰场（L14–L26）：参考图色，白块 + 深字
export const MID_PAL: Pal = {
    bg: GREY,
    ink: "#F2F2F6",
    accent: "#FFFFFF",
    dim: "#8A8A96",
    block: "#FAFAFC",
    blockInk: "#232329",
    flash: "#FAFAFC",
    burst: "#FAFAFC",
    scan: 0.11,
    grain: 0.11,
    vig: 0.7,
};

// C 浅灰场（L27–L38）：比中灰更浅一档的灰底（不是白底），浅字 + 深灰块；不加暗角
export const LIGHT_PAL: Pal = {
    bg: "#585864",
    ink: "#F4F4F8",
    accent: "#FFFFFF",
    dim: "#A8A8B4",
    block: "#1F1F24",
    blockInk: "#F4F4F8",
    flash: "#F4F4F8",
    burst: "#F4F4F8",
    scan: 0.09,
    grain: 0.08,
    vig: 0,
};

export { FONT, MONO } from "../../../styles/lyricmv";
