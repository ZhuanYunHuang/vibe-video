import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { P, kit } from "./kit";
import { Hook } from "./scenes/Hook";
import { Highlights } from "./scenes/Highlights";
import { Question } from "./scenes/Question";
import { Fan } from "./scenes/Fan";
import { Skirt } from "./scenes/Skirt";
import { Pressure } from "./scenes/Pressure";
import { MathScene } from "./scenes/MathScene";
import { Forces } from "./scenes/Forces";
import { Precedent } from "./scenes/Precedent";
import { Systems } from "./scenes/Systems";
import { Limits } from "./scenes/Limits";
import { Track } from "./scenes/Track";
import { Info } from "./scenes/Info";
import { Outro } from "./scenes/Outro";

// 《吸顶之谜》：特斯拉 Roadster 负压吸附科普 · explode「3D 拆解」风格首发业务片
// BGM 复用 web-request/bgm.mp3（bpm 112.8 / offset 12 / 可用 361 拍），已预降 -6dB 给旁白让位
// 大卡点落点（npm run beat）：0★ 16★ 32★，其后边界偏弱（△）→ 靠幕内内容跳变带节奏
export const roadster: VideoSpec = {
  id: "Roadster",
  bpm: 112.8,
  offset: 12,
  totalBeats: 336, // 336 拍 ≈ 178.7s，+ tail ≈ 3 分钟
  transFrames: 12,
  tailFrames: 30,
  bgm: "roadster/bgm.mp3",
  bg: P.bg,
  width: 1920,
  height: 1080,
  style: kit,
  Cover,
  scenes: [
    { start: 0, end: 16, Comp: Hook, trans: "none", bg: P.bg },
    { start: 16, end: 48, Comp: Highlights, trans: "zoom", bg: P.bg },
    { start: 48, end: 64, Comp: Question, trans: "slideLeft", bg: P.bg },
    { start: 64, end: 96, Comp: Fan, trans: "circle", bg: P.bg },
    { start: 96, end: 128, Comp: Skirt, trans: "fade", bg: P.bg },
    { start: 128, end: 160, Comp: Pressure, trans: "circle", bg: P.bg },
    { start: 160, end: 192, Comp: MathScene, trans: "slideUp", bg: P.bg },
    { start: 192, end: 208, Comp: Forces, trans: "fade", bg: P.bg },
    { start: 208, end: 240, Comp: Precedent, trans: "slideLeft", bg: P.bg },
    { start: 240, end: 272, Comp: Systems, trans: "glitch", bg: P.bg },
    { start: 272, end: 288, Comp: Limits, trans: "blinds", bg: P.bg },
    { start: 288, end: 304, Comp: Track, trans: "circle", bg: P.bg },
    { start: 304, end: 320, Comp: Info, trans: "slideUp", bg: P.bg },
    { start: 320, end: 336, Comp: Outro, trans: "circle", bg: P.bg },
  ],
};
