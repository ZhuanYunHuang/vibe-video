import { Beat } from "./types";

// 项目级帧率。已知技术债：若将来要做 60fps，需把 FPS 也改为经 Context 下发，
// 否则 anim.ts 里的动画函数无法感知帧率变化。
export const FPS = 30;

// interpolate 的 clamp 选项，避免重复书写
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 按一支视频的节拍参数生成节拍工具，取代原先的模块级单例常量
export const makeBeat = (bpm: number, offset: number, trans: number): Beat => {
  // 每拍帧数
  const BEAT = (60 / bpm) * FPS;
  // 第 b 拍对应的绝对帧（b 可为小数，如 1.5 表示半拍）
  const bf = (b: number) => Math.round(offset + b * BEAT);
  // 节拍脉冲：每拍瞬间为 1，随后指数衰减
  const beatPulse = (frame: number) => {
    const t = frame - offset;
    if (t < 0) return 0;
    return Math.exp(-(t % BEAT) / 3.5);
  };
  return { BEAT, OFFSET: offset, TRANS: trans, bf, beatPulse };
};
