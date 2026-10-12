import { Easing, interpolate, spring } from "remotion";
import { CL, FPS } from "./timing";

// 弹出动画（带回弹）
export const pop = (t: number, from: number, damping = 11) =>
  spring({ frame: t - from, fps: FPS, config: { damping, stiffness: 200, mass: 0.6 } });

// 平滑进度
export const prog = (t: number, from: number, dur: number) =>
  interpolate(t, [from, from + dur], [0, 1], { ...CL, easing: Easing.bezier(0.65, 0, 0.35, 1) });

// 指定帧之后的打击脉冲
export const hit = (t: number, from: number, decay = 4) => (t < from ? 0 : Math.exp(-(t - from) / decay));
