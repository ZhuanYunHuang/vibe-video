import type { StyleKit } from "../contract";
import { makeCover } from "./Cover";
import { Backdrop, Hud, Kicks, Particles } from "./fx";
import { P, fonts } from "./theme";
import { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";

// 数据信息图风格包：暖白底 + 数据蓝/橙 + 等宽大数字。含契约全套组件与 makeCover 封面模板。
export { P, FONT, MONO, DECOR, fonts } from "./theme";
export { Card, Chapter, Counter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";
export { Backdrop, Hud, Kicks, Particles } from "./fx";
export { makeCover } from "./Cover";

export const kit: StyleKit = {
    id: "datainfo",
    P,
    fonts,
    exitDim: 0.35,
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
