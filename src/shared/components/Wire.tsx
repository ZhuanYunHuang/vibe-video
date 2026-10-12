import React from "react";

// 连接线（虚线流动）
export const Wire: React.FC<{ from: [number, number]; to: [number, number]; color: string; p: number; t: number }> = ({ from, to, color, p, t }) => {
  return (
    <svg style={{ position: "absolute", inset: 0 }} width={1920} height={1080}>
      <line
        x1={from[0]}
        y1={from[1]}
        x2={from[0] + (to[0] - from[0]) * p}
        y2={from[1] + (to[1] - from[1]) * p}
        stroke={color}
        strokeOpacity={0.6}
        strokeWidth={4}
        strokeDasharray="14 12"
        strokeDashoffset={-t * 2}
      />
    </svg>
  );
};
