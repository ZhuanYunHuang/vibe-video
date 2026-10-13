import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { HERO_BEAT, P } from "./kit/theme";
import { AmapHud, MapBackdrop } from "./kit/ui";
import { Intro } from "./scenes/Intro";
import { AppUI } from "./scenes/AppUI";
import { MapToGraph } from "./scenes/MapToGraph";
import { Weighted } from "./scenes/Weighted";
import { Exhaustive } from "./scenes/Exhaustive";
import { Dijkstra } from "./scenes/Dijkstra";
import { AStar } from "./scenes/AStar";
import { BackToCS } from "./scenes/BackToCS";
import { Complexity } from "./scenes/Complexity";
import { Outro } from "./scenes/Outro";

// 《导航怎么规划最优路线？》：高德风浅色地图 + 蓝绿主色
// BGM：web-request/bgm.mp3 经 ffmpeg atempo=1.25 提速（112.8 → 141bpm，首拍 0.40s → 0.32s，时长 154.3s / 可用 361 拍）
// 注：npm run beat 会把提速后的曲子识别成半速 70.5bpm（八度误判），这里取 2 倍 = 141
// 招牌转场：第 HERO_BEAT 拍（穷举 → Dijkstra），由 AmapHud 内的 HeroWipe 绘制
export const routePlanning: VideoSpec = {
  id: "RoutePlanning",
  bpm: 141,
  offset: 10, // 首拍出现在 0.32s
  totalBeats: 336, // 336 拍 ≈ 143s，+tailFrames ≈ 2 分 24 秒
  transFrames: 10,
  tailFrames: 30,
  bgm: "route-planning/bgm.mp3",
  bg: P.bg,
  width: 1920,
  height: 1080,
  Backdrop: MapBackdrop,
  Hud: AmapHud,
  exitDim: 0, // 浅色地图底不压暗退场
  Cover,
  // 场景表：BGM 每 16 拍（4 小节）是一个乐句，乐句第一拍是重拍
  // 规则：所有切场都落在 16 的倍数拍上；场景内部跨过的乐句重拍，由场景自己做一次内容跳变
  // 实测重拍：拍 32（13.9s，段落进入）、拍 192（82.0s，间奏后回归）最强
  scenes: [
    { start: 0, end: 16, Comp: Intro, trans: "none", bg: P.bg },
    { start: 16, end: 32, Comp: AppUI, trans: "zoom", bg: P.bg },
    { start: 32, end: 64, Comp: MapToGraph, trans: "slideLeft", bg: P.land }, // 内部跳变：拍 48
    { start: 64, end: 96, Comp: Weighted, trans: "circle", bg: P.bg }, // 内部跳变：拍 80
    { start: 96, end: HERO_BEAT, Comp: Exhaustive, trans: "blinds", bg: P.land }, // 内部跳变：拍 112、128
    // 招牌转场全屏覆盖，底下直接硬切
    { start: HERO_BEAT, end: 192, Comp: Dijkstra, trans: "none", bg: P.bg }, // 内部跳变：拍 160、176
    { start: 192, end: 240, Comp: AStar, trans: "zoom", bg: P.bg }, // 内部跳变：拍 208、224
    { start: 240, end: 272, Comp: BackToCS, trans: "spin", bg: P.land }, // 内部跳变：拍 256
    { start: 272, end: 304, Comp: Complexity, trans: "glitch", bg: P.bg }, // 内部跳变：拍 288
    { start: 304, end: 336, Comp: Outro, trans: "fade", bg: P.bg }, // 内部跳变：拍 320
  ],
};
