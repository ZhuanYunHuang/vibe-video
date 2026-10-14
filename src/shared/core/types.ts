import React from "react";
import type { StyleKit } from "../../styles/contract";

// 场景组件统一入参：start 为该场景的起始拍号
export type SceneProps = { start: number };

// 场景进场转场类型
export type TransType =
  | "none"
  | "zoom"
  | "slideLeft"
  | "slideUp"
  | "circle"
  | "blinds"
  | "diag"
  | "spin"
  | "glitch"
  | "fade";

// 底部 HUD 入参：切场帧（用于闪光）与正片总帧数
export type HudProps = { cutFrames: number[]; totalFrames: number };

// 场景定义：start/end 均为拍号，切换点落在强拍上
export type SceneDef = {
  start: number;
  end: number;
  Comp: React.FC<SceneProps>;
  trans: TransType;
  bg: string;
};

// 由 makeBeat() 产出、经 Context 下发的节拍工具
export type Beat = {
  BEAT: number; // 每拍帧数
  OFFSET: number; // 首拍所在绝对帧
  TRANS: number; // 转场帧数
  bf: (b: number) => number; // 拍号 -> 绝对帧
  beatPulse: (frame: number) => number; // 节拍脉冲
};

// 一支视频的全部配置：共用装配器只认这个结构
export type VideoSpec = {
  id: string; // Composition id
  bpm: number;
  offset: number; // 首拍所在帧
  totalBeats: number;
  transFrames: number; // 转场帧数
  tailFrames: number; // 结尾留白帧数
  bgm?: string; // 相对 public 的路径；演示片等无音频可不填（节拍仍由 bpm/offset 驱动）
  bg?: string; // 整片底色；缺省时回退 style.P.bg，再回退默认 C.bg
  width: number;
  height: number;
  scenes: SceneDef[];
  // 风格来源（优先级）：style 整套风格包 < Backdrop/Hud 显式覆盖；都没有则用默认霓虹网格风格
  style?: StyleKit;
  Backdrop?: React.FC; // 每个场景内的背景层
  Hud?: React.FC<HudProps>; // 全片顶层 HUD（进度条/切场闪光）
  exitDim?: number; // 场景退场时的压暗程度，默认 0.5
  Cover?: React.FC; // 可选：视频封面（静态图，注册为 <Still>，用 npm run still 导出 PNG）
};
