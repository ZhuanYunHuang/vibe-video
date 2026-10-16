import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { kit, LyricHud, P, PR } from "./kit";
import { Boot } from "./scenes/Boot";
import { Currency } from "./scenes/Currency";
import { Format } from "./scenes/Format";
import { Hook2A } from "./scenes/Hook2A";
import { Hook2B } from "./scenes/Hook2B";
import { Hook3 } from "./scenes/Hook3";
import { HotSearch } from "./scenes/HotSearch";
import { LikeFarm } from "./scenes/LikeFarm";
import { Pangu } from "./scenes/Pangu";
import { Rewind } from "./scenes/Rewind";
import { River } from "./scenes/River";
import { Verdict } from "./scenes/Verdict";
import { Wonton } from "./scenes/Wonton";
import { Zero } from "./scenes/Zero";

// 《为了短视频》赛博 HUD 风 MV（揽佬 & AR刘夫阳）。
// 节拍：175 BPM / 首拍 0 帧 → 每拍 0.3429s、16 拍 = 4 小节 = 5.486s 一个切场单位。
// 歌词：每句 8 拍 = 2.7429s；主歌 1 基准 19.00s、主歌 2 基准 91.00s（详见 kit/lyrics.ts）。
// 换色：拍 256 = 87.77s（鼓组回归那一拍）冷监控青 → 警报红，由风格包按秒自动过渡。
export const duanshipin: VideoSpec = {
    id: "Duanshipin",
    bpm: 175,
    offset: 0,
    totalBeats: 480, // 480 拍 = 164.57s
    transFrames: 12,
    tailFrames: 130, // 成片 ≈ 168.9s
    bgm: "duanshipin/bgm.mp3",
    bg: P.bg,
    width: 1920,
    height: 1080,
    style: kit,
    // 背景层由每个场景内的 <Scene> 自绘（要按场景所在秒取调色板，装配器注入的 Backdrop 拿不到场景起始拍）
    Backdrop: () => null,
    Hud: LyricHud,
    Cover,
    exitDim: 0.6,
    scenes: [
        { start: 0, end: 32, Comp: Boot, trans: "none", bg: P.bg },
        // Format 延伸到拍 80：把「线下假得像个蓝车牌的特斯拉」(21.74-24.49s) 整句包在本幕内（拍 64 = 21.94 只是那句的中间）
        { start: 32, end: 80, Comp: Format, trans: "fade", bg: P.bg },
        { start: 80, end: 96, Comp: LikeFarm, trans: "slideLeft", bg: P.bgAlt },
        { start: 96, end: 128, Comp: HotSearch, trans: "glitch", bg: P.bg },
        { start: 128, end: 160, Comp: River, trans: "blinds", bg: P.bg },
        { start: 160, end: 176, Comp: Currency, trans: "circle", bg: P.bgAlt },
        { start: 176, end: 208, Comp: Wonton, trans: "diag", bg: P.bg },
        { start: 208, end: 240, Comp: Hook2A, trans: "fade", bg: P.bg },
        { start: 240, end: 256, Comp: Hook2B, trans: "zoom", bg: P.bg },
        { start: 256, end: 320, Comp: Verdict, trans: "glitch", bg: PR.bg },
        { start: 320, end: 352, Comp: Rewind, trans: "spin", bg: PR.bg },
        { start: 352, end: 400, Comp: Pangu, trans: "slideUp", bg: PR.bgAlt },
        { start: 400, end: 448, Comp: Hook3, trans: "fade", bg: PR.bg },
        { start: 448, end: 480, Comp: Zero, trans: "fade", bg: "#000000" },
    ],
};
