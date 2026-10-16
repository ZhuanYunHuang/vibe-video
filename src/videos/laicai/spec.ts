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

// 《专升本 来财》像素风 MV：shengben 改编曲（前半段专升本 0-75.3s + 后半段揽佬《八方来财》82.9-144.3s）。
// 节拍：npm run beat → 半速误判修正后 bpm 123，首拍 0.52s（15 帧），可用 295 拍；正片 288 拍 ≈ 141.0s，尾帧吃到 144.6s。
// 视觉：全新像素风（src/styles/pixel）+ 天选之子/揽佬双人物 + 3D 爆金币 + 原神手机屏 + 像素歌词 HUD。
// 歌词与重拍锚点见 kit/lyrics.ts（T 表：专 4.42 / 狂 20.03 / 来财来 24.93 / 唉 27.83 / 原神 49.6 / 交接 75.3）。
export const laicai: VideoSpec = {
    id: "Laicai",
    bpm: 123,
    offset: 15, // 首拍 0.515s
    totalBeats: 288, // 正片 ≈ 141.0s
    transFrames: 10,
    tailFrames: 110, // 收尾至 ≈144.6s（吃掉片尾渐弱段）
    bgm: "laicai/bgm.mp3",
    bg: P.bg,
    width: 1920,
    height: 1080,
    style: kit,
    Hud: LyricHud,
    Cover,
    exitDim: 0.55,
    scenes: [
        { start: 0, end: 32, Comp: Wake, trans: "none", bg: P.bg }, // 苏醒 + b8「专」爆金币 + 删同学
        { start: 32, end: 48, Comp: Wall, trans: "glitch", bg: P.bg }, // 专本之墙 + b40「狂」爆金币
        { start: 48, end: 64, Comp: Tease, trans: "zoom", bg: P.bgAlt }, // 「来财 来」重点时刻（金币雨）
        { start: 64, end: 80, Comp: Brothers, trans: "slideLeft", bg: P.bg }, // 本是同根生 → 亲如兄弟
        { start: 80, end: 96, Comp: Grind, trans: "blinds", bg: P.bgAlt }, // 苦读 + 公式雨 + 字母雨
        { start: 96, end: 112, Comp: Genshin, trans: "circle", bg: P.bg }, // 原神手机屏（punchline）
        { start: 112, end: 144, Comp: NextStop, trans: "slideUp", bg: P.bg }, // 列车/图书馆/证书（双块）
        { start: 144, end: 160, Comp: Handoff, trans: "fade", bg: P.bgAlt }, // 75.3s 递麦交接 → 揽佬接棒
        { start: 160, end: 192, Comp: Verse1, trans: "glitch", bg: P.bg }, // 玉牌/香炉/拜三拜/钱包（双块）
        { start: 192, end: 208, Comp: Hook, trans: "circle", bg: P.bg }, // 「来财 来」chant + 金币雨高潮
        { start: 208, end: 224, Comp: Money, trans: "spin", bg: P.bg }, // 利滚利 + 八方来
        { start: 224, end: 256, Comp: Cards, trans: "slideLeft", bg: P.bgAlt }, // 牌桌三条九 + 加冕（双块）
        { start: 256, end: 272, Comp: Dao, trans: "diag", bg: P.bg }, // 阴阳太极 + 紫气东来
        { start: 272, end: 288, Comp: Finale, trans: "zoom", bg: P.bg }, // 颁奖台 + 八仙桌 + 片名
    ],
};
