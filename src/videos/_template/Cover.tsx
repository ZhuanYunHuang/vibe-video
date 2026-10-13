import React from "react";
import { AbsoluteFill } from "remotion";
import { C, FONT } from "../../shared";

// 视频封面（静态图）。在 spec.ts 里通过 Cover 字段绑到本业务，
// 会自动注册成 id 为 "<视频id>Cover" 的 Still，用 npm run still 导出 PNG。
//
// 注意：封面是静态帧，不要使用依赖节拍 context 的组件（BeatGrid / ProgressHud / useT / useAt）。
// 要"跟视频息息相关"，就复用本视频的配色 / 字体 / 标志性视觉元素：
//   - 默认风格视频：用 shared 的 C 调色板
//   - 自定义风格视频：用业务 kit 里的专属调色板（如 binary-search 的 P）与背景/角色
export const Cover: React.FC = () => (
  <AbsoluteFill
    style={{
      background: C.bg,
      fontFamily: FONT,
      color: "#fff",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 104, fontWeight: 900, letterSpacing: 4 }}>你的标题</div>
    <div style={{ fontSize: 40, opacity: 0.7, marginTop: 28 }}>一句勾起好奇心的副标题</div>
  </AbsoluteFill>
);
