import type { StyleKit } from "../contract";
import { makeCover } from "./Cover";
import { Backdrop, Hud, Kicks, Particles } from "./fx";
import { P, fonts } from "./theme";
import { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";

// Bauhaus 风格包：三原色几何构成 + 强网格排版。含契约全套组件与 makeCover 封面模板。
export { P, FONT, MONO, DECOR, fonts } from "./theme";
export { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";
export { Backdrop, Hud, Kicks, Particles } from "./fx";
export { makeCover } from "./Cover";

export const kit: StyleKit = {
    id: "bauhaus",
    P,
    fonts,
    exitDim: 0.4,
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
