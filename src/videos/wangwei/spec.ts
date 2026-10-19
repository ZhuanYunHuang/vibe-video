import { VideoSpec } from "../../shared";
import { kit } from "../../styles/lyricmv";
import { Cover } from "./Cover";
import { BPM, TOTAL_BEATS } from "./kit/lyrics";
import { WANGWEI_SCENES } from "./scenes";

// 《王位》PG ONE：24 句纯文字 MV，130 BPM；28.96s「Say what」起唱即翻金黄。
export const wangwei: VideoSpec = {
    id: "Wangwei",
    bpm: BPM,
    offset: 0,
    totalBeats: TOTAL_BEATS,
    transFrames: 1,
    tailFrames: 16,
    bgm: "wangwei/bgm.mp3",
    bg: "#050505",
    width: 1920,
    height: 1080,
    style: kit,
    Backdrop: () => null,
    Hud: () => null,
    exitDim: 0,
    Cover,
    scenes: WANGWEI_SCENES,
};
