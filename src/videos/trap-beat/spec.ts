import { VideoSpec } from "../../shared";
import { kit } from "../../styles/lyricmv";
import { Cover } from "./Cover";
import { BPM, OFFSET, TAIL_FRAMES, TOTAL_BEATS, TRANS_FRAMES } from "./kit/timeline";
import { BeatBackdrop } from "./kit/viz";
import { T } from "./kit/theme";
import { TRAP_SCENES } from "./scenes";

// 《暗黑电子 TRAP》2:52：808 + 鼓组 + FM 拨弦 + 失真 riff + 低通 pad，全部为电子音色。
// 音频由 scripts/make-beat.mjs 纯代码合成：90 BPM / F minor / 64 小节。
// 分场：intro 8 / build 8 / verse1 16 / hook 8 / verse2 16 / outro 8（小节）。
export const trapBeat: VideoSpec = {
    id: "TrapBeat",
    bpm: BPM,
    offset: OFFSET,
    totalBeats: TOTAL_BEATS,
    transFrames: TRANS_FRAMES,
    tailFrames: TAIL_FRAMES,
    bgm: "trap-beat/bgm.mp3",
    bg: T.bg,
    width: 1920,
    height: 1080,
    style: kit,
    // 自带 studio 背景；不挂进度条 / HUD
    Backdrop: BeatBackdrop,
    Hud: () => null,
    exitDim: 0,
    Cover,
    scenes: TRAP_SCENES,
};
