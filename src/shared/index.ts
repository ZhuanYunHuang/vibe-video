// 共用代码入口：业务侧（src/videos/**）只从这里 import
export { Video, videoDuration } from "./Video";
export { BeatProvider, useAt, useBeat, useT } from "./runtime/beat-context";
export { hit, pop, prog } from "./core/anim";
export { CL, FPS, makeBeat } from "./core/timing";
export { C, FONT, MONO } from "./core/theme";
export type { Beat, HudProps, SceneDef, SceneProps, TransType, VideoSpec } from "./core/types";
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
