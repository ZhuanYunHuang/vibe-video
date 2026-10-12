import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useBeat } from "../runtime/beat-context";
import { CL } from "../core/timing";
import { C } from "../core/theme";

// 切场闪白 + 底部节拍进度条
export const ProgressHud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
  const frame = useCurrentFrame();
  const { beatPulse } = useBeat();
  const flash = cutFrames.reduce((m, f) => (frame >= f ? Math.max(m, Math.exp(-(frame - f) / 3)) : m), 0);
  const p = interpolate(frame, [0, totalFrames], [0, 1], CL);
  const pulse = beatPulse(frame);
  return (
    <>
      <AbsoluteFill style={{ background: "#fff", opacity: flash * 0.35, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${p * 100}%`, background: `linear-gradient(90deg, ${C.cyan}, ${C.pink}, ${C.yellow})` }} />
      <div
        style={{
          position: "absolute",
          left: `calc(${p * 100}% - ${10 + pulse * 8}px)`,
          bottom: -6 - pulse * 8,
          width: 20 + pulse * 16,
          height: 20 + pulse * 16,
          borderRadius: "50%",
          background: C.yellow,
          boxShadow: `0 0 ${10 + pulse * 30}px ${C.yellow}`,
        }}
      />
    </>
  );
};
