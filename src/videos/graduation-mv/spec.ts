import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { BPM, TOTAL_BEATS } from "./kit/lyrics";
import { P } from "./kit/theme";
import { VERSE_SCENES } from "./scenes";

// 《毕业》PG ONE 片段：纯文字 MV，7 场 × 2 句，场景切点对齐真实句点。
// 节拍 87.9 BPM（offset 0 即帧 0 起算）；14 句由 kit/lyrics.ts 按秒驱动。
export const graduationMv: VideoSpec = {
    id: "GraduationMv",
    bpm: BPM,
    offset: 0,
    totalBeats: TOTAL_BEATS,
    transFrames: 1,
    tailFrames: 6,
    bgm: "graduation-mv/bgm.mp3",
    bg: P.bg,
    width: 1920,
    height: 1080,
    Backdrop: () => null,
    Hud: () => null,
    exitDim: 0,
    Cover,
    scenes: VERSE_SCENES,
};
