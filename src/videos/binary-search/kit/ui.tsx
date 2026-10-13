import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CL, FONT, HudProps, MONO, pop, useBeat, useT } from "../../../shared";
import { Clawd } from "./Clawd";
import { P } from "./theme";

// 当前场景内的节拍脉冲（按绝对帧对齐 BGM）
export const usePulse = (start: number) => {
  const beat = useBeat();
  const t = useT();
  return beat.beatPulse(beat.bf(start) + t);
};

const smooth = Easing.bezier(0.45, 0, 0.25, 1);

// 卡点弹跳：[from, to) 内每拍起跳一次，下一拍正好落地并压扁
export const useBounce = () => {
  const { BEAT } = useBeat();
  return (t: number, from: number, to: number, h: number) => {
    if (t < from) return { jump: 0, squash: 0 };
    if (t >= to) return { jump: 0, squash: t < to + 12 ? Math.exp(-(t - to) / 3) * 0.6 : 0 };
    const since = (t - from) % BEAT;
    const ph = since / BEAT;
    const land = t - from >= BEAT ? Math.exp(-since / 2.5) * 0.6 : 0;
    return { jump: Math.sin(ph * Math.PI) * h, squash: land - Math.sin(ph * Math.PI) * 0.15 };
  };
};

// 右上角：目标卡 + 提问计数
export const Goal: React.FC<{ t: number; from?: number; count: number; lastAsk: number; label?: string }> = ({
  t,
  from = 0,
  count,
  lastAsk,
  label = "已问",
}) => {
  const s = pop(t, from, 14);
  const bump = t >= lastAsk ? Math.exp(-(t - lastAsk) / 5) : 0;
  return (
    <div style={{ position: "absolute", right: 70, top: 50, display: "flex", gap: 16, opacity: s, fontFamily: FONT }}>
      <div style={{ padding: "10px 22px", borderRadius: 16, background: P.paper, border: `3px solid ${P.ink}`, fontSize: 32, fontWeight: 800, color: P.ink }}>
        目标 <span style={{ fontFamily: MONO, color: P.clay }}>81</span> 号
      </div>
      <div
        style={{
          padding: "10px 22px",
          borderRadius: 16,
          background: P.ink,
          color: P.paper,
          fontSize: 32,
          fontWeight: 800,
          transform: `scale(${1 + bump * 0.18})`,
        }}
      >
        {label} <span style={{ fontFamily: MONO, color: P.clayLight }}>{count}</span> 次
      </div>
    </div>
  );
};

// 按关键帧移动并自动生成步伐：frames 必须递增
export const walkPath = (t: number, frames: number[], xs: number[], u: number) => {
  const x = interpolate(t, frames, xs, { ...CL, easing: smooth });
  const dx = Math.abs(interpolate(t + 1, frames, xs, { ...CL, easing: smooth }) - x);
  return { x, walk: x / (u * 2.4), stride: Math.min(1, dx / 3) };
};

// 号码牌
export const Tag: React.FC<{ n: number | string; color?: string; scale?: number; bg?: string }> = ({
  n,
  color = P.ink,
  scale = 1,
  bg = P.paper,
}) => (
  <div
    style={{
      marginBottom: 10,
      minWidth: 62,
      padding: "4px 10px",
      borderRadius: 12,
      background: bg,
      border: `3px solid ${color}`,
      color,
      fontFamily: MONO,
      fontWeight: 800,
      fontSize: 30,
      textAlign: "center",
      transform: `scale(${scale})`,
      transformOrigin: "50% 100%",
      boxShadow: "0 4px 0 #0000001a",
    }}
  >
    {n}
  </div>
);

// 对话气泡：(x, y) 为尖角位置
export const Bubble: React.FC<{
  t: number;
  from: number;
  to?: number;
  x: number;
  y: number;
  text: React.ReactNode;
  size?: number;
  color?: string;
  side?: "up" | "down";
}> = ({ t, from, to = 1e9, x, y, text, size = 36, color = P.ink, side = "down" }) => {
  if (t < from || t > to + 8) return null;
  const s = pop(t, from, 12) * (t > to ? interpolate(t, [to, to + 8], [1, 0], CL) : 1);
  const down = side === "down";
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, ${down ? "-100%" : "0"}) scale(${s})`,
        transformOrigin: down ? "50% 100%" : "50% 0%",
        opacity: Math.min(1, s * 1.5),
      }}
    >
      <div
        style={{
          position: "relative",
          margin: down ? "0 0 18px" : "18px 0 0",
          padding: "14px 28px",
          borderRadius: 26,
          background: P.paper,
          border: `4px solid ${P.ink}`,
          color,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          whiteSpace: "nowrap",
          boxShadow: "0 8px 0 #1F1E1D22",
        }}
      >
        {text}
        <div
          style={{
            position: "absolute",
            left: "50%",
            ...(down ? { bottom: -16 } : { top: -16 }),
            width: 26,
            height: 26,
            background: P.paper,
            borderRight: `4px solid ${P.ink}`,
            borderBottom: `4px solid ${P.ink}`,
            transform: `translateX(-50%) rotate(${down ? 45 : 225}deg)`,
          }}
        />
      </div>
    </div>
  );
};

// 底部字幕：from 拍入、to 拍出
export const Sub: React.FC<{ t: number; from: number; to?: number; children: React.ReactNode }> = ({ t, from, to = 1e9, children }) => {
  if (t < from || t > to + 8) return null;
  const inP = pop(t, from, 14);
  const outP = t > to ? interpolate(t, [to, to + 8], [1, 0], CL) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 48,
        display: "flex",
        justifyContent: "center",
        opacity: Math.min(inP, outP),
        transform: `translateY(${(1 - inP) * 24 + (1 - outP) * -10}px)`,
      }}
    >
      <div
        style={{
          padding: "12px 34px",
          borderRadius: 999,
          background: P.ink,
          color: P.paper,
          fontFamily: FONT,
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// 左上角章节标签
export const Chapter: React.FC<{ t: number; no: string; title: string }> = ({ t, no, title }) => {
  const s = pop(t, 0, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 56,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: s,
        transform: `translateX(${(1 - s) * -40}px)`,
        fontFamily: FONT,
      }}
    >
      <div style={{ padding: "6px 16px", borderRadius: 12, background: P.clay, color: P.paper, fontFamily: MONO, fontWeight: 800, fontSize: 28 }}>
        {no}
      </div>
      <div style={{ fontSize: 40, fontWeight: 900, color: P.ink }}>{title}</div>
    </div>
  );
};

// 庆祝彩纸：from 帧起从顶部洒落
const CONFETTI_COLORS = [P.clay, P.gold, P.sky, P.sage, P.rose];
export const Confetti: React.FC<{ t: number; from: number; n?: number }> = ({ t, from, n = 46 }) => {
  if (t < from) return null;
  const d = t - from;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const r1 = (Math.sin(i * 12.9898) * 43758.5453) % 1;
        const r2 = (Math.sin(i * 78.233) * 12345.678) % 1;
        const x = Math.abs(r1) * 1920;
        const vy = 7 + Math.abs(r2) * 7;
        const y = -40 + d * vy - Math.abs(r1) * 200;
        const size = 14 + Math.abs(r2) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.sin(d / 9 + i) * 30,
              top: y,
              width: size,
              height: size,
              background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
              transform: `rotate(${d * (4 + (i % 5)) + i * 20}deg)`,
              opacity: interpolate(d, [70, 110], [1, 0], CL),
            }}
          />
        );
      })}
    </>
  );
};

// 本片背景：暖白纸面 + 浅点阵
export const PaperBackdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(${P.line} 2.2px, transparent 2.4px)`,
      backgroundSize: "44px 44px",
      opacity: 0.7,
      pointerEvents: "none",
    }}
  />
);

// 本片 HUD：底部细进度条 + 一只随节拍小跳的迷你小人
export const ClawdHud: React.FC<HudProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const { beatPulse } = useBeat();
  const p = interpolate(frame, [0, totalFrames], [0, 1], CL);
  const pulse = beatPulse(frame);
  const W = 1920;
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: `${P.line}aa` }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 6, width: p * W, background: P.clay }} />
      <Clawd x={Math.max(22, p * W)} y={1074} u={3} walk={frame / 2.2} stride={p < 1 ? 1 : 0} jump={pulse * 6} opacity={p < 1 ? 0.9 : 0} />
    </>
  );
};
