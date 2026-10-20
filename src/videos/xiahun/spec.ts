import { VideoSpec } from "../../shared";
import { kit } from "../../styles/lyricmv";
import { Cover } from "./Cover";
import { BPM, INK_DARK, OFFSET, TAIL_FRAMES, TOTAL_BEATS, TRANS_FRAMES } from "./kit";
import { XIAHUN_SCENES } from "./scenes";

// 《嘻哈魂》杨和苏 verse：37.7s 歌词 MV，灰阶三段（深灰 → 中灰 → 浅灰白场）。
// 实测 82 BPM，首拍 0.05s；spec 用 offset=0，故帧 = 秒 × 30、拍号 = 秒 × 1.3667。
// 大卡点落点（16 拍）：0△ / 16△ / 32△ / 48△（本曲 4 小节边界抬升仅 0.52，不做重卡换场）；
// 场景切换点按实测句首：20 拍 = 14.63s（L14 深→中）、34.58 拍 = 25.30s（L27 中→浅）。
export const xiahun: VideoSpec = {
    id: "Xiahun",
    bpm: BPM,
    offset: OFFSET,
    totalBeats: TOTAL_BEATS,
    transFrames: TRANS_FRAMES,
    tailFrames: TAIL_FRAMES,
    bgm: "xiahun/bgm.mp3",
    bg: INK_DARK,
    width: 1920,
    height: 1080,
    style: kit,
    // 无顶部 HUD／进度条；灰阶底纹由各场景自己画
    Backdrop: () => null,
    Hud: () => null,
    exitDim: 0,
    Cover,
    scenes: XIAHUN_SCENES,
};
