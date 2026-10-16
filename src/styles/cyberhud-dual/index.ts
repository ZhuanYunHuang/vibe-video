import type { StyleKit } from "../contract";
import { makeCover } from "./Cover";
import { Backdrop, Hud, Kicks, Particles } from "./fx";
import { P, fonts } from "./theme";
import { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";

// 双段赛博 HUD 风格包：cyberhud 的换色扩展版。
// 阶段 A（前半）冷监控青，阶段 B（SWITCH_SEC / 拍 256 起）警报红；场景用 <Scene start> 包装后自动跟随。
export { FONT, MONO, DECOR, fonts, P, paletteAt, PR, SWITCH_SEC, FADE_SEC, useToneNow } from "./theme";
export { useTone } from "./tone";
export { Scene, useToneAt } from "./scene";
export { Card, Chapter, Mark, Slam, Stamp, Stage, Sub, useK, usePulse } from "./ui";
export { Backdrop, Hud, Kicks, Particles } from "./fx";
export { makeCover } from "./Cover";

export const kit: StyleKit = {
    id: "cyberhud-dual",
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
