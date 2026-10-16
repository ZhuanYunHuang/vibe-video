import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { kit, LyricHud, P } from "./kit";
import { Brothers } from "./scenes/Brothers";
import { Cards } from "./scenes/Cards";
import { Dao } from "./scenes/Dao";
import { Finale } from "./scenes/Finale";
import { Genshin } from "./scenes/Genshin";
import { Grind } from "./scenes/Grind";
import { Handoff } from "./scenes/Handoff";
import { Hook } from "./scenes/Hook";
import { Money } from "./scenes/Money";
import { NextStop } from "./scenes/NextStop";
import { Tease } from "./scenes/Tease";
import { Verse1 } from "./scenes/Verse1";
import { Wake } from "./scenes/Wake";
import { Wall } from "./scenes/Wall";

// 《专升本 来财》赛博 HUD 版 MV：与像素版（src/videos/laicai）同一首歌、同一套分镜与歌词时间轴，
// 风格整体切换为 cyberhud（深蓝黑 + 霓虹青/品红 + 扫描框/数据流），人物保持像素造型 + 霓虹辉光。
export const laicaiCyber: VideoSpec = {
    id: "LaicaiCyber",
    bpm: 123,
    offset: 15, // 首拍 0.515s
    totalBeats: 288,
    transFrames: 10,
    tailFrames: 110,
    bgm: "laicai/bgm.mp3", // 与像素版共用同一音频
    bg: P.bg,
    width: 1920,
    height: 1080,
    style: kit,
    Hud: LyricHud,
    Cover,
    exitDim: 0.6,
    scenes: [
        { start: 0, end: 32, Comp: Wake, trans: "none", bg: P.bg },
        { start: 32, end: 48, Comp: Wall, trans: "glitch", bg: P.bg },
        { start: 48, end: 64, Comp: Tease, trans: "zoom", bg: P.bgAlt },
        { start: 64, end: 80, Comp: Brothers, trans: "slideLeft", bg: P.bg },
        { start: 80, end: 96, Comp: Grind, trans: "blinds", bg: P.bgAlt },
        { start: 96, end: 112, Comp: Genshin, trans: "circle", bg: P.bg },
        { start: 112, end: 144, Comp: NextStop, trans: "slideUp", bg: P.bg },
        { start: 144, end: 160, Comp: Handoff, trans: "fade", bg: P.bgAlt },
        { start: 160, end: 192, Comp: Verse1, trans: "glitch", bg: P.bg },
        { start: 192, end: 208, Comp: Hook, trans: "circle", bg: P.bg },
        { start: 208, end: 224, Comp: Money, trans: "spin", bg: P.bg },
        { start: 224, end: 256, Comp: Cards, trans: "slideLeft", bg: P.bgAlt },
        { start: 256, end: 272, Comp: Dao, trans: "diag", bg: P.bg },
        { start: 272, end: 288, Comp: Finale, trans: "zoom", bg: P.bg },
    ],
};
