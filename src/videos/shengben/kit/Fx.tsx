import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, pop } from "../../../shared";
import { glow, P } from "./theme";

// 全屏闪光：at 帧瞬间满亮，随后衰减
export const Flash: React.FC<{ t: number; at: number; color?: string; decay?: number; max?: number }> = ({
  t,
  at,
  color = "#fff",
  decay = 5,
  max = 0.95,
}) => {
  const o = hit(t, at, decay) * max;
  if (o < 0.01) return null;
  // 外扩一圈：放在震屏容器里时边缘不露底
  return <div style={{ position: "absolute", inset: -200, background: color, opacity: o, pointerEvents: "none" }} />;
};

// 冲击波环
export const Shockwave: React.FC<{ t: number; at: number; x?: number; y?: number; color?: string; rings?: number }> = ({
  t,
  at,
  x = 960,
  y = 540,
  color = P.cyan,
  rings = 3,
}) => {
  if (t < at) return null;
  return (
    <>
      {Array.from({ length: rings }).map((_, i) => {
        const d = t - at - i * 4;
        if (d < 0) return null;
        const r = interpolate(d, [0, 26], [40, 1300], { ...CL, easing: (v) => 1 - (1 - v) ** 3 });
        const o = interpolate(d, [0, 26], [1, 0], CL);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - r,
              top: y - r,
              width: r * 2,
              height: r * 2,
              borderRadius: "50%",
              border: `${18 - i * 5}px solid ${color}`,
              boxShadow: `0 0 40px ${color}`,
              opacity: o,
            }}
          />
        );
      })}
    </>
  );
};

// 漫画速度线（放射状）
export const SpeedLines: React.FC<{ t: number; at: number; color?: string; dur?: number; n?: number }> = ({
  t,
  at,
  color = "#fff",
  dur = 22,
  n = 40,
}) => {
  const d = t - at;
  if (d < 0 || d > dur) return null;
  const o = interpolate(d, [0, 3, dur], [0, 0.85, 0], CL);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + i * 0.37;
        const r0 = 330 + ((i * 97) % 160) - d * 4;
        const r1 = 1300;
        return (
          <polygon
            key={i}
            points={`${960 + Math.cos(a - 0.012) * r0},${540 + Math.sin(a - 0.012) * r0} ${960 + Math.cos(a) * r1},${540 + Math.sin(a) * r1} ${960 + Math.cos(a + 0.03) * r1},${540 + Math.sin(a + 0.03) * r1}`}
            fill={color}
          />
        );
      })}
    </svg>
  );
};

// 火花粒子迸射
export const Sparks: React.FC<{ t: number; at: number; x?: number; y?: number; n?: number; colors?: string[]; power?: number }> = ({
  t,
  at,
  x = 960,
  y = 540,
  n = 36,
  colors = [P.yellow, P.magenta, P.cyan, "#fff"],
  power = 1,
}) => {
  const d = t - at;
  if (d < 0 || d > 60) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + (i % 3) * 0.4;
        const v = (14 + ((i * 53) % 17)) * power;
        const px = x + Math.cos(a) * v * d * (1 - d / 140);
        const py = y + Math.sin(a) * v * d * (1 - d / 140) + d * d * 0.12;
        const sz = 6 + (i % 4) * 4;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: sz,
              height: sz,
              borderRadius: i % 2 ? 2 : "50%",
              background: colors[i % colors.length],
              boxShadow: `0 0 12px ${colors[i % colors.length]}`,
              opacity: interpolate(d, [30, 60], [1, 0], CL),
            }}
          />
        );
      })}
    </>
  );
};

// 巨字砸入：从 3 倍放大砸到 1，带 RGB 分离抖动；until 之后淡出
export const SlamWord: React.FC<{
  t: number;
  at: number;
  text: string;
  color?: string;
  size?: number;
  x?: number;
  y?: number;
  until?: number;
  rotate?: number;
}> = ({ t, at, text, color = P.magenta, size = 420, x = 960, y = 500, until = Infinity, rotate = -6 }) => {
  if (t < at - 2) return null;
  const d = t - at;
  const sc = interpolate(d, [-2, 0, 3, 7], [3.2, 1.15, 0.94, 1], CL);
  const jit = hit(t, at, 6) * 26;
  const end = Number.isFinite(until) ? until : at + 1e6;
  const o = interpolate(t, [at - 2, at, end, end + 8], [0, 1, 1, 0], CL);
  const base: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    fontFamily: FONT,
    fontSize: size,
    fontWeight: 900,
    lineHeight: 1,
    whiteSpace: "nowrap",
    transform: `translate(-50%, -50%) scale(${sc}) rotate(${rotate}deg)`,
  };
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <div style={{ ...base, color: P.cyan, marginLeft: -jit, opacity: 0.8, mixBlendMode: "screen" }}>{text}</div>
      <div style={{ ...base, color: P.red, marginLeft: jit, opacity: 0.8, mixBlendMode: "screen" }}>{text}</div>
      <div style={{ ...base, color: "#fff", WebkitTextStroke: `10px ${color}`, textShadow: glow(color, 2.2) }}>{text}</div>
    </div>
  );
};

// 内容级震屏：只在给定的炸裂帧附近抖动（不做每拍抖动）
export const shake = (t: number, ats: number[], amp = 34) => {
  let k = 0;
  for (const a of ats) k = Math.max(k, hit(t, a, 5));
  if (k < 0.02) return "none";
  return `translate(${Math.sin(t * 9.1) * amp * k}px, ${Math.cos(t * 7.7) * amp * k * 0.7}px) rotate(${Math.sin(t * 5.3) * k * 1.5}deg)`;
};

// Punchline 专属：画面推近 + 徽章 + 游戏图标
export const PunchlineBadge: React.FC<{ t: number; at: number; until: number }> = ({ t, at, until }) => {
  const s = pop(t, at, 9);
  const o = interpolate(t, [at, at + 2, until, until + 8], [0, 1, 1, 0], CL);
  if (o <= 0) return null;
  const wob = Math.sin((t - at) / 3) * 3;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 120,
          transform: `translateX(-50%) scale(${s}) rotate(${-4 + wob}deg)`,
          padding: "14px 46px",
          borderRadius: 18,
          background: P.yellow,
          color: "#111",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 64,
          letterSpacing: 8,
          boxShadow: `0 0 0 8px #111, 0 0 50px ${P.yellow}`,
        }}
      >
        ★ PUNCHLINE ★
      </div>
    </div>
  );
};
