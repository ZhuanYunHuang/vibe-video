import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { useBeat } from "../runtime/beat-context";
import { CL } from "../core/timing";
import { TransType } from "../core/types";

const ease = Easing.bezier(0.7, 0, 0.2, 1);

// 竖向百叶窗 clip-path
const blindsPath = (p: number, w: number, h: number) => {
  const n = 8;
  const bw = w / n;
  let d = "";
  for (let i = 0; i < n; i++) {
    // 每条错开一点，形成波浪
    const q = interpolate(p, [i * 0.05, 0.65 + i * 0.05], [0, 1], CL);
    const x = i * bw + (bw * (1 - q)) / 2;
    d += `M${x},0 L${x + bw * q},0 L${x + bw * q},${h} L${x},${h} Z `;
  }
  return `path('${d}')`;
};

// 场景外壳：前 TRANS 帧为入场转场（第 TRANS 帧 = 节拍），最后 TRANS 帧轻微退场
export const SceneShell: React.FC<{
  type: TransType;
  total: number;
  bg: string;
  children: React.ReactNode;
}> = ({ type, total, bg, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { TRANS } = useBeat();
  const p = type === "none" ? 1 : ease(interpolate(frame, [0, TRANS], [0, 1], CL));
  const exit = interpolate(frame, [total - TRANS, total], [0, 1], CL);

  let style: React.CSSProperties = {};
  switch (type) {
    case "zoom":
      style = { transform: `scale(${0.2 + 0.8 * p}) rotate(${(1 - p) * -12}deg)`, opacity: p, filter: `blur(${(1 - p) * 20}px)` };
      break;
    case "slideLeft":
      style = { transform: `translateX(${(1 - p) * 100}%)` };
      break;
    case "slideUp":
      style = { transform: `translateY(${(1 - p) * 100}%)` };
      break;
    case "circle":
      style = { clipPath: `circle(${p * 120}% at 50% 50%)` };
      break;
    case "blinds":
      style = { clipPath: p >= 1 ? undefined : blindsPath(p, width, height) };
      break;
    case "diag": {
      const k = p * 2;
      style = { clipPath: `polygon(0 0, ${k * 100}% 0, ${(k - 1) * 100}% 100%, 0 100%)` };
      break;
    }
    case "spin":
      style = { transform: `rotate(${(1 - p) * 90}deg) scale(${p})`, opacity: p, transformOrigin: "0% 100%" };
      break;
    case "glitch": {
      const j = (1 - p) * 60;
      style = {
        transform: `translate(${Math.sin(frame * 7.3) * j}px, ${Math.cos(frame * 5.1) * j * 0.3}px) skewX(${(1 - p) * 20}deg)`,
        opacity: p > 0 ? 0.4 + 0.6 * p : 0,
        clipPath: `inset(${(1 - p) * 40}% 0 ${(1 - p) * 40}% 0)`,
      };
      break;
    }
    default:
      break;
  }

  return (
    <AbsoluteFill style={style}>
      <AbsoluteFill
        style={{
          background: bg,
          transform: `scale(${1 - exit * 0.08})`,
          filter: exit > 0 ? `brightness(${1 - exit * 0.5})` : undefined,
          overflow: "hidden",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
