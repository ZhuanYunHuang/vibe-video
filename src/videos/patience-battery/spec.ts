import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { P } from "./kit/theme";
import { Outside } from "./scenes/Outside";
import { ArriveHome } from "./scenes/ArriveHome";
import { DinnerTable } from "./scenes/DinnerTable";
import { WhyTitle } from "./scenes/WhyTitle";
import { ReasonOne } from "./scenes/ReasonOne";
import { ReasonTwo } from "./scenes/ReasonTwo";
import { ReasonThree } from "./scenes/ReasonThree";
import { ReasonFour } from "./scenes/ReasonFour";
import { MomsNight } from "./scenes/MomsNight";
import { ThirtyYears } from "./scenes/ThirtyYears";
import { MethodOne } from "./scenes/MethodOne";
import { MethodTwo } from "./scenes/MethodTwo";
import { MethodThree } from "./scenes/MethodThree";
import { Outro } from "./scenes/Outro";

// 《耐心电量》(PatienceBattery) —— 情绪短片 · 单一视觉语言（冷：夜城/门外 · 暖：家/门内）
// 已按需求删掉「耐心电量」冷开场幕：第 0 拍直接进正题（在外面）。全部拍号整体前移 16 拍。
// 母题：电量条贯穿全片；四因"演出来"，三法用「重来一次」重演同一晚
// BGM 复用默认曲 web-request/bgm.mp3（npm run beat 实测：112.8bpm / 首拍 0.40s(offset 12) / 可用 361 拍）
// 大卡点落点表（每 16 拍）：0★ 16★ 32★ 48△ 64△ 80△ 96△ 112△ 128△ 144△ 160△ 176★ 192★ 208△ 224★ 240△ 256△ 272△ 288(收)
// —— 强拍 0/16/32/176/192/224 全部落在「切场」或「幕内强跳变」上
// 14 幕 · 288 拍 ≈ 153.2s + tail 30 帧 ≈ 2:34
// 电量主线（贯穿全片）：92 →78 →62 →44 →30 →12 →4 →(回充) 26 →50 →62 →74 →100
export const patienceBattery: VideoSpec = {
  id: "PatienceBattery",
  bpm: 112.8,
  offset: 12,
  totalBeats: 288,
  transFrames: 12,
  tailFrames: 30,
  bgm: "patience-battery/bgm.mp3",
  bg: P.night,
  width: 1920,
  height: 1080,
  Backdrop: () => null, // 每幕自画底（夜城/客厅/门口），不用默认网格
  Hud: () => null, // 铁律：不挂进度条
  exitDim: 0.55,
  Cover,
  scenes: [
    { start: 0, end: 32, Comp: Outside, trans: "none", bg: P.night }, // 幕内 k16（16★）第二次扣电的强跳变
    { start: 32, end: 48, Comp: ArriveHome, trans: "circle", bg: P.night }, // 冷街 → 暖光门口，电量 30→12
    { start: 48, end: 64, Comp: DinnerTable, trans: "zoom", bg: P.home }, // 全片最大卡点：摔门「砰」+ 电量砸 4%
    { start: 64, end: 80, Comp: WhyTitle, trans: "glitch", bg: P.night }, // 幕内 k8（72）门外冷 / 门内暖对切
    { start: 80, end: 112, Comp: ReasonOne, trans: "zoom", bg: P.night }, // 幕内 k16（96）标题硬切换 + 扣电日志 92→4
    { start: 112, end: 144, Comp: ReasonTwo, trans: "slideLeft", bg: P.night }, // 幕内 k16（128）橡皮筋拉断
    { start: 144, end: 176, Comp: ReasonThree, trans: "diag", bg: P.night }, // 幕内 k16（160）情绪公式砸入
    { start: 176, end: 192, Comp: ReasonFour, trans: "blinds", bg: P.night }, // 幕内 k8 摘面具 + 标签剥落
    { start: 192, end: 208, Comp: MomsNight, trans: "fade", bg: P.home }, // 碗盖/全家福/留灯 + 电量悄悄回充 4→26
    { start: 208, end: 224, Comp: ThirtyYears, trans: "none", bg: "#F7F4EC" }, // 幕内 k8 起点阵"点亮"反转
    { start: 224, end: 240, Comp: MethodOne, trans: "circle", bg: P.night }, // 重来一次① 门口 10 秒 + 回充 26→50
    { start: 240, end: 256, Comp: MethodTwo, trans: "slideUp", bg: P.home }, // 重来一次② 语气反转 + 回充 50→62
    { start: 256, end: 272, Comp: MethodThree, trans: "fade", bg: P.home }, // 重来一次③ 冷暖分屏 → 同桌暖光 62→74
    { start: 272, end: 288, Comp: Outro, trans: "none", bg: P.night }, // 金句 + 片名 + 电量回满 100% 定格
  ],
};
