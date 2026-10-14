import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { P } from "./kit/theme";
import { NeonBackdrop, RapHud } from "./kit/ui";
import { Intro } from "./scenes/Intro";
import { Sneer } from "./scenes/Sneer";
import { Brothers } from "./scenes/Brothers";
import { Grind } from "./scenes/Grind";
import { Chorus } from "./scenes/Chorus";
import { Flex } from "./scenes/Flex";
import { Crack } from "./scenes/Crack";
import { Truth } from "./scenes/Truth";
import { Rise } from "./scenes/Rise";
import { Outro } from "./scenes/Outro";

// 《升本后醒来》动画 MV：霓虹嘻哈风 + Q 版"天选之子"
// BGM：原 live 视频音轨（147.25s），npm run beat：61.5bpm 半速误判 → 123bpm，首拍 0.42s（13 帧），可用 ~301 拍
// 大卡点（每 16 拍）：0★ 16△ 32★ 48★ 64★ 80△ 96★ 112△ 128★ 144△ 160★ 176△ 192★ 208△ 224★ 240△ 256△ 272★
// 切场只落在 ★；△ 处由场景内容跳变顶住
// 四个重拍炸裂（幕内）：b8「专」4.3s / b40「狂」19.9s / b56「唉」27.7s / b104 punchline「原神英文版」51.2s
// 歌词时间轴见 kit/lyrics.ts（由原视频字幕条逐帧检测校准），HUD 按绝对秒显示
export const shengben: VideoSpec = {
  id: "Shengben",
  bpm: 123,
  offset: 13,
  totalBeats: 288, // 正片 ≈ 140.9s
  transFrames: 10,
  tailFrames: 180, // 收尾吃满原曲（≈ 146.9s）
  bgm: "shengben/bgm.mp3",
  bg: P.bg,
  width: 1920,
  height: 1080,
  Backdrop: NeonBackdrop,
  Hud: RapHud,
  exitDim: 0.5,
  Cover,
  scenes: [
    { start: 0, end: 32, Comp: Intro, trans: "none", bg: P.bg }, // 内部：b8 重拍①、△16
    { start: 32, end: 48, Comp: Sneer, trans: "glitch", bg: P.bg }, // 内部：b40 重拍②
    { start: 48, end: 64, Comp: Brothers, trans: "zoom", bg: P.bg }, // 内部：b56 重拍③
    { start: 64, end: 96, Comp: Grind, trans: "slideLeft", bg: P.bg }, // 内部：△80 公式雨
    { start: 96, end: 128, Comp: Chorus, trans: "circle", bg: P.bg }, // 内部：b104 punchline、△112
    { start: 128, end: 160, Comp: Flex, trans: "spin", bg: P.bg }, // 内部：△144 撒西不理达纳
    { start: 160, end: 192, Comp: Crack, trans: "glitch", bg: P.bg }, // 内部：△176 惊醒
    { start: 192, end: 224, Comp: Truth, trans: "blinds", bg: P.night }, // 内部：△208 夜路
    { start: 224, end: 272, Comp: Rise, trans: "zoom", bg: P.bg }, // 内部：△240 光束炸开、△256 终副歌
    { start: 272, end: 288, Comp: Outro, trans: "fade", bg: P.bg },
  ],
};
