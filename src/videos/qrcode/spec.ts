import { C, VideoSpec } from "../../shared";
import { Intro } from "./scenes/Intro";
import { Binary } from "./scenes/Binary";
import { Structure } from "./scenes/Structure";
import { Version } from "./scenes/Version";
import { Capacity } from "./scenes/Capacity";
import { Count } from "./scenes/Count";
import { Consume } from "./scenes/Consume";
import { MathScene } from "./scenes/Math";
import { Outro } from "./scenes/Outro";

// 《二维码会被用完吗？》
// BGM 复用 web-request/bgm.mp3（bpm 112.8 / offset 12），实测时长 192.9s 足够覆盖全片
// 卡点：所有场景切换与动画触发都落在拍号上（见 docs/video-factory.md 与场景内 useAt 用法）
export const qrcode: VideoSpec = {
  id: "Qrcode",
  bpm: 112.8,
  offset: 12, // 首拍出现在 0.40s
  totalBeats: 280, // 280 拍 ≈ 149s 正片，+tailFrames ≈ 2分31秒
  transFrames: 12,
  tailFrames: 45, // 结尾多留 1.5 秒收尾
  bgm: "qrcode/bgm.mp3",
  bg: C.bg,
  width: 1920,
  height: 1080,
  // 场景表：start/end 为拍号，切换点都落在强拍上
  scenes: [
    { start: 0, end: 12, Comp: Intro, trans: "none", bg: C.bg },
    { start: 12, end: 36, Comp: Binary, trans: "zoom", bg: "#0d1430" },
    { start: 36, end: 64, Comp: Structure, trans: "slideLeft", bg: "#120f2e" },
    { start: 64, end: 92, Comp: Version, trans: "circle", bg: "#0a1a2a" },
    { start: 92, end: 124, Comp: Capacity, trans: "blinds", bg: "#0b1f1a" },
    { start: 124, end: 164, Comp: Count, trans: "diag", bg: "#1f1a0b" },
    { start: 164, end: 196, Comp: Consume, trans: "slideUp", bg: "#1f0b1a" },
    { start: 196, end: 240, Comp: MathScene, trans: "spin", bg: "#1f140b" },
    { start: 240, end: 280, Comp: Outro, trans: "glitch", bg: C.bg },
  ],
};
