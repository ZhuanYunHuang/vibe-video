import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useBeat } from "../runtime/beat-context";
import { C } from "../core/theme";

// 全局背景：网格随节拍呼吸
export const BeatGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { BEAT, OFFSET, beatPulse } = useBeat();
  const p = beatPulse(frame);
  const bar = Math.floor(Math.max(0, frame - OFFSET) / BEAT) % 4 === 0;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${C.line}55 2px, transparent 2px), linear-gradient(90deg, ${C.line}55 2px, transparent 2px)`,
        backgroundSize: "80px 80px",
        backgroundPosition: `0 ${(frame * 0.6) % 80}px`,
        opacity: 0.35 + p * (bar ? 0.5 : 0.25),
        mixBlendMode: "screen",
        pointerEvents: "none",
      }}
    />
  );
};
