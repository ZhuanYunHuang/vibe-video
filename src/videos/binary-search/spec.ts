import { VideoSpec } from "../../shared";
import { P } from "./kit/theme";
import { ClawdHud, PaperBackdrop } from "./kit/ui";
import { Intro } from "./scenes/Intro";
import { QueueScene } from "./scenes/Queue";
import { Linear } from "./scenes/Linear";
import { Idea } from "./scenes/Idea";
import { Halving } from "./scenes/Halving";
import { Compare } from "./scenes/Compare";
import { ArrayScene } from "./scenes/ArrayScene";
import { Code } from "./scenes/Code";
import { Outro } from "./scenes/Outro";

// 《二分查找》：Claude 像素小人 + 排队比喻
// BGM 复用 web-request/bgm.mp3（bpm 112.8 / offset 12），实测 192.9s 覆盖全片
// 排队的 4 个场景共用同一队形，用 fade 交叉淡入，画面连续不跳
export const binarySearch: VideoSpec = {
  id: "BinarySearch",
  bpm: 112.8,
  offset: 12,
  totalBeats: 336, // 336 拍 ≈ 178.7s，+tailFrames ≈ 3 分钟
  transFrames: 12,
  tailFrames: 30,
  bgm: "binary-search/bgm.mp3",
  bg: P.bg,
  width: 1920,
  height: 1080,
  Backdrop: PaperBackdrop,
  Hud: ClawdHud,
  exitDim: 0, // 暖色纸面风格不压暗退场
  scenes: [
    { start: 0, end: 16, Comp: Intro, trans: "none", bg: P.bg },
    { start: 16, end: 48, Comp: QueueScene, trans: "circle", bg: P.bg },
    { start: 48, end: 80, Comp: Linear, trans: "fade", bg: P.bg },
    { start: 80, end: 112, Comp: Idea, trans: "fade", bg: P.bg },
    { start: 112, end: 152, Comp: Halving, trans: "fade", bg: P.bg },
    { start: 152, end: 188, Comp: Compare, trans: "slideUp", bg: P.sand },
    { start: 188, end: 236, Comp: ArrayScene, trans: "circle", bg: P.bg },
    { start: 236, end: 292, Comp: Code, trans: "slideLeft", bg: P.sand },
    { start: 292, end: 336, Comp: Outro, trans: "circle", bg: P.bg },
  ],
};
