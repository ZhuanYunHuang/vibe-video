import React from "react";

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
  | "glitch";

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
  bgm: string; // 相对 public 的路径
  bg: string; // 整片底色
  width: number;
  height: number;
  scenes: SceneDef[];
};
