import type React from "react";

// 风格包统一契约：本文件必须自包含（只依赖 react 类型），避免与 shared 形成循环依赖。
// 约定：所有原语组件都是 t/from 的纯函数（内部禁用 beat hook），保证封面/展示页等 Still 能冻结渲染。
// t 与 from 一律为「场景内相对帧」：场景用 kit 的 useK(start) 把绝对拍号换算成场景帧。

// 语义调色板：所有风格包使用同一批键名，场景文案因此可以跨风格复用
export type StylePalette = {
  bg: string; // 整片/默认场景底色
  bgAlt: string; // 备选场景底色（章节轮换用）
  card: string; // 卡片/面板面
  ink: string; // 主文字 / 主线描边
  inkSub: string; // 次要文字 / 副标题
  line: string; // 分隔线 / 浅描边
  accent: string; // 主强调色
  accentDeep: string; // 主强调色深档
  accentLight: string; // 主强调色浅档
  gold: string; // 第二强调 / 点缀
  seal: string; // 印章 / 落款色
  extra?: Record<string, string>; // 风格私有扩展色
};

export type StyleFonts = {
  FONT: string; // 正文 / 字幕
  MONO: string; // 数字 / 代码
  DECOR: string; // 装饰（标题 / 印章）
};

export interface StyleKit {
  id: string;
  P: StylePalette;
  fonts: StyleFonts;
  exitDim?: number; // 该风格推荐的退场压暗
  Backdrop: React.FC; // 每个场景内的背景层
  Hud: React.FC<{ cutFrames: number[]; totalFrames: number }>; // 全片顶层 HUD
  Stage: React.FC<{ t: number; children: React.ReactNode }>;
  Sub: React.FC<{ t: number; from: number; to?: number; color?: string; children: React.ReactNode }>;
  Chapter: React.FC<{ t: number; step: string; title: string; color?: string }>;
  Slam: React.FC<{ t: number; from: number; x?: number; y?: number; size?: number; color?: string; rot?: number; children: React.ReactNode }>;
  Card: React.FC<{ t?: number; x: number; y: number; w: number; h: number; appear: number; lit?: number; rot?: number; float?: boolean; children: React.ReactNode }>;
  Stamp: React.FC<{ t: number; from: number; x: number; y: number; text: string; size?: number; rot?: number; color?: string }>;
  Mark: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; dur?: number; rot?: number; underline?: boolean; note?: string; color?: string }>;
  Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }>;
  Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }>;
  useK: (start: number) => (beat: number) => number; // 绝对拍号 -> 场景内帧
  usePulse: (start: number) => number; // 拍点脉冲 0~1
  makeCover: (o: { title: string; subtitle?: string; badge?: string }) => React.FC; // 封面模板工厂（静态）
}
