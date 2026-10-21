import { VideoSpec } from "../../shared";
import { kit } from "../../styles/lyricmv";
import { Cover } from "./Cover";
import { BPM, INK_DARK_BG, OFFSET, TAIL_FRAMES, TOTAL_BEATS, TRANS_FRAMES } from "./kit";
import { POW_SCENES } from "./scenes";

// 《POW》歌词 MV：71.7s，主题取自封面（荧光绿 #4AFF00 / 炭黑 #141414 / 骨白 #F2F2F2）。
// 节拍：`npm run beat` 报 61.6 BPM，但 Top5 候选得分几乎持平（弱周期误报）；
//   用底鼓包络自相关复测（22050Hz / hop=128 ⇒ 172.27 帧/秒），0–71.7s 与 15–55s 两窗一致在 lag=101 帧出尖峰
//   ⇒ 实际 BPM ≈ 102.3（0.5865s/拍），首拍相位 ≈ 0.227s。
// 16 拍大卡点（= 4 小节，9.38s 一个）：0.23 / 9.61 / 19.0 / 28.4 / 37.7 / 47.1 / 56.5 / 65.9s。
// spec 用 offset=0（同 xiahun）：帧 = 秒 × 30、拍号 = 秒 × 1.705，全部时间数据用秒表达。
// 音效卡点（枪 11 发 + 炮 1 发）实测秒数见 kit/lyrics.ts 的 SHOTS。
export const pow: VideoSpec = {
    id: "Pow",
    bpm: BPM,
    offset: OFFSET,
    totalBeats: TOTAL_BEATS,
    transFrames: TRANS_FRAMES,
    tailFrames: TAIL_FRAMES,
    bgm: "pow/bgm.mp3",
    bg: INK_DARK_BG,
    width: 1920,
    height: 1080,
    style: kit,
    // 无顶部 HUD／进度条；底纹（墙 / 炭黑磨砂）由各场景自己画
    Backdrop: () => null,
    Hud: () => null,
    exitDim: 0,
    Cover,
    scenes: POW_SCENES,
};
