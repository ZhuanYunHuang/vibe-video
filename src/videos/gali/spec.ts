import { VideoSpec } from "../../shared";
import { kit } from "../../styles/lyricmv";
import { Cover } from "./Cover";
import { BLACK, BPM, OFFSET, TAIL_FRAMES, TOTAL_BEATS, TRANS_FRAMES } from "./kit";
import { GALI_SCENES } from "./scenes";

// 《我的》GALI 片段：40.6s 歌词 MV，黄（Hook）→ 黑（主歌）→ 黄（收尾）。
// 实测 142.1 BPM（analyze-beat 提示半速误判，按双倍值填），首拍 0.78s。
// 大卡点落点：0△ / 16△ / 32△（黄→黑硬切）/ 48★（进鼓「把我的名字」）/ 64△ / 80★（收尾回归）。
export const gali: VideoSpec = {
    id: "Gali",
    bpm: BPM,
    offset: OFFSET,
    totalBeats: TOTAL_BEATS,
    transFrames: TRANS_FRAMES,
    tailFrames: TAIL_FRAMES,
    bgm: "gali/bgm.mp3",
    bg: BLACK,
    width: 1920,
    height: 1080,
    style: kit,
    // 无顶部 HUD／进度条；背景与底纹由各场景自己画（黄场 / 黑场两套）
    Backdrop: () => null,
    Hud: () => null,
    exitDim: 0,
    Cover,
    scenes: GALI_SCENES,
};
