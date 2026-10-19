import type { StyleKit } from "../contract";
import { makeCover } from "./Cover";
import { Backdrop, Hud, Kicks, Particles } from "./fx";
import { P, fonts } from "./theme";
import { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";

// 歌词 MV：第 16 套风格包。近黑街头底 + 机甲标题黑 + 血红韵脚块。
export { P, PAL, FONT, MONO, DECOR, LATIN, fonts, fitSize, textWidth } from "./theme";
export type { Pal, ThemeId } from "./theme";
export type { FxId, Line, LineTheme, Part, Seg } from "./types";
export { Fonts } from "./Fonts";
export { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";
export { Backdrop, Hud, Kicks, Particles } from "./fx";
export { Grain, Scanlines, Vignette, GhostLine, CutFlash, LineSlab, CornerMarks } from "./frame";
export { ChaosText, CrawlText, FocusText, RhymeText, ShakeText, SlamText, SlashText, SplitText, StampText } from "./textfx";
export type { FxProps } from "./textfx";
export { LineBoard, renderFx, rowFont } from "./line";
export { LyricStage } from "./stage";
export type { FxEvent } from "./stage";
export { makeCover } from "./Cover";

export const kit: StyleKit = {
    id: "lyricmv",
    P,
    fonts,
    exitDim: 0.55,
    Backdrop,
    Hud,
    Stage,
    Sub,
    Chapter,
    Slam,
    Card,
    Stamp,
    Mark,
    Kicks,
    Particles,
    useK,
    usePulse,
    makeCover,
};
