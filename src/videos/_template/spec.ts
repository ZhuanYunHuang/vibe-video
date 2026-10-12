import { C, VideoSpec } from "../../shared";
import { Intro } from "./scenes/Intro";
import { Outro } from "./scenes/Outro";

// 新建视频骨架。复制整个 _template 目录作为起点：
//   1. 把 _template 复制成 src/videos/<你的视频名>/
//   2. BGM 放到 public/<你的视频名>/bgm.mp3（资源目录与视频目录共用同一 id）
//   3. 跑 npm run beat -- public/<你的视频名>/bgm.mp3，把给出的参数填进下面
//   4. 改造 scenes/ 下的场景，调整 scenes 表的拍号
//   5. 在 src/videos/index.ts 里 import 并加入 VIDEOS
//   完整约定见 docs/video-factory.md
//
// 注意：_template 目录本身不注册为 Composition，它只是复制用的样板。
export const template: VideoSpec = {
  id: "MyVideo", // Composition id，需全局唯一
  bpm: 120, // 由 npm run beat 分析得出
  offset: 0, // 首拍所在帧，由 npm run beat 给出
  totalBeats: 16,
  transFrames: 12, // 转场帧数，转场结束正好落在拍上
  tailFrames: 45, // 结尾留白帧数
  bgm: "my-video/bgm.mp3", // 相对 public 的路径，须为 public/<视频id>/bgm.mp3
  bg: C.bg,
  width: 1920,
  height: 1080,
  // 场景表：start/end 均为拍号，切换点应落在强拍上
  scenes: [
    { start: 0, end: 8, Comp: Intro, trans: "none", bg: C.bg },
    { start: 8, end: 16, Comp: Outro, trans: "zoom", bg: C.bg },
  ],
};
