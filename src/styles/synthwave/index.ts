import type { StyleKit } from "../contract";
import { makeCover } from "./Cover";
import { Backdrop, Hud, Kicks, Particles } from "./fx";
import { P, fonts } from "./theme";
import { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";

// Synthwave 风格包：80s 复古霓虹 + 透视网格 + 落日 + 铬字。含契约全套组件与 makeCover 封面模板。
export { P, FONT, MONO, DECOR, fonts } from "./theme";
export { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";
export { Backdrop, Hud, Kicks, Particles } from "./fx";
export { makeCover } from "./Cover";

export const kit: StyleKit = {
    id: "synthwave",
    P,
    fonts,
    exitDim: 0.6,
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
