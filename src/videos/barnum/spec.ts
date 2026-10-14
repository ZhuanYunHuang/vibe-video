import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { P } from "./kit/theme";
import { BarnumHud, PaperBackdrop } from "./kit/ui";
import { Zodiac } from "./scenes/Zodiac";
import { Tarot } from "./scenes/Tarot";
import { Fortune } from "./scenes/Fortune";
import { Ask } from "./scenes/Ask";
import { Reveal } from "./scenes/Reveal";
import { Concept } from "./scenes/Concept";
import { Experiment } from "./scenes/Experiment";
import { Overview } from "./scenes/Overview";
import { Bias } from "./scenes/Bias";
import { ColdRead } from "./scenes/ColdRead";
import { SelfFulfill } from "./scenes/SelfFulfill";
import { Control } from "./scenes/Control";
import { Survivor } from "./scenes/Survivor";
import { Placebo } from "./scenes/Placebo";
import { Outro } from "./scenes/Outro";

// 《算命，为什么这么准？》：「宣纸朱砂·古籍批注风」——宣纸底 + 墨色 + 朱砂印章/红笔批注
// 叙事隐喻：纸 = 旧玄学，红笔 = 新理性；母题弧线：准 → 准 → 准 → 巴纳姆 → 六个帮手 → 懂了
// BGM：源自 flow-state/bgm.mp3（112.8bpm / offset 12），已接片——原曲尾部 167s 起自然渐弱，
//   而视频要到 188.6s 才结束，故在 164.233s（第 308 拍）交叉淡化（2.128s = 4 拍）接回 138.69s 处的
//   强乐句（与交叉点相差整 3 小节、拍相位一致），末尾 2s 收尾渐弱。节拍网格与 offset 12 不变。
//   复现命令见 .trae 记录或本文件历史；如需重接片用 node 逐采样混音（ffmpeg 精简版无 acrossfade）。
//
// 大卡点落点表（每 16 拍，15.96 帧/拍 ≈ 0.532s）：
//     0 ★   16 ★   32 ★   48 △   64 △   80 △   96 △  112 △  128 △  144 △
//   160 △  176 ★  192 ★  208 △  224 ★  240 △  256 ★  272 △  288 ★  304 △
//   320 △  336 ★  352 △
// 逐 16 拍边界安排：
//   16★太准了+印「准」/ 32★掀页入塔罗 / 64△卷帘开摊 / 96△拍案提问 / 110★印「巴纳姆」
//   112△墨晕揭题「巴纳姆效应」/ 176★掀页入福勒实验（4.26/5）/ 192★数字爆点 /
//   208△六帮手总览 / 240△…336★ 六机制各 16 拍（页码圆点推进）/ 336★拍案收尾
export const barnum: VideoSpec = {
    id: "Barnum",
    bpm: 112.8,
    offset: 12, // 首拍出现在 0.40s
    totalBeats: 352, // 352 拍 ≈ 187.6s + tailFrames ≈ 3 分 08 秒（BGM 可用 361 拍）
    transFrames: 12,
    tailFrames: 30,
    bgm: "barnum/bgm.mp3",
    bg: P.xuan,
    width: 1920,
    height: 1080,
    Backdrop: PaperBackdrop,
    Hud: BarnumHud,
    exitDim: 0, // 浅色纸面退场不压暗（同 binary-search）
    Cover,
    scenes: [
        { start: 0, end: 32, Comp: Zodiac, trans: "fade", bg: P.xuan }, // 墨色渐显冷开场
        { start: 32, end: 64, Comp: Tarot, trans: "diag", bg: P.chen }, // ★32 掀页
        { start: 64, end: 96, Comp: Fortune, trans: "blinds", bg: P.xuan }, // △64 卷帘开摊
        { start: 96, end: 112, Comp: Ask, trans: "zoom", bg: P.chen }, // △96 拍案提问
        { start: 112, end: 144, Comp: Reveal, trans: "circle", bg: P.xuan }, // △112 墨晕揭题
        { start: 144, end: 176, Comp: Concept, trans: "fade", bg: P.chen }, // △144 三副面孔
        { start: 176, end: 208, Comp: Experiment, trans: "diag", bg: P.xuan }, // ★176 掀页入实验
        { start: 208, end: 240, Comp: Overview, trans: "fade", bg: P.chen }, // △208 六个帮手
        { start: 240, end: 256, Comp: Bias, trans: "blinds", bg: P.xuan }, // △240 机制①
        { start: 256, end: 272, Comp: ColdRead, trans: "fade", bg: P.chen }, // ★256 机制②
        { start: 272, end: 288, Comp: SelfFulfill, trans: "diag", bg: P.xuan }, // △272 机制③
        { start: 288, end: 304, Comp: Control, trans: "fade", bg: P.chen }, // ★288 机制④
        { start: 304, end: 320, Comp: Survivor, trans: "blinds", bg: P.xuan }, // △304 机制⑤
        { start: 320, end: 336, Comp: Placebo, trans: "fade", bg: P.chen }, // △320 机制⑥
        { start: 336, end: 352, Comp: Outro, trans: "zoom", bg: P.xuan }, // ★336 拍案收尾
    ],
};
