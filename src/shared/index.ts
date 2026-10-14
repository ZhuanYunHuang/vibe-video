// 共用代码入口：业务侧（src/videos/**）只从这里 import
export { Video, videoDuration } from "./Video";
export { BeatProvider, useAt, useBeat, useT } from "./runtime/beat-context";
export { elastic, hit, pop, prog, sway } from "./core/anim";
export { CL, FPS, makeBeat } from "./core/timing";
export { C, FONT, MONO } from "./core/theme";
export type { Beat, HudProps, SceneDef, SceneProps, TransType, VideoSpec } from "./core/types";
export type { StyleFonts, StyleKit, StylePalette } from "../styles/contract";
// 通用动效工具箱（19 项，t/from 纯函数；详见 src/shared/motion/README.md）
export * from "./motion";
export {
  BeatGrid,
  Caption,
  Center,
  NodeBox,
  Packet,
  ProgressHud,
  SceneShell,
  SceneTitle,
  Wire,
} from "./components";
