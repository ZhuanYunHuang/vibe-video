import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CL, FONT, FPS, HudProps, pop, useBeat } from "../../../shared";
import { LYRICS } from "./lyrics";
import { glow, P } from "./theme";

// 背景：深夜底 + 透视霓虹地平线网格 + 顶部舞台光晕
export const NeonBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { beatPulse } = useBeat();
  const pulse = beatPulse(frame);
  const scroll = (frame * 2) % 80;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${P.bg2} 0%, ${P.bg} 55%, ${P.night} 100%)` }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.32 + pulse * 0.12 }}>
        {Array.from({ length: 21 }).map((_, i) => {
          const x = -1000 + i * 196;
          return <line key={`v${i}`} x1={960} y1={640} x2={x * 2.2 + 960 - 960 * 1.2} y2={1080} stroke={P.magenta} strokeWidth={2} />;
        })}
        {Array.from({ length: 9 }).map((_, i) => {
          const d = ((i * 80 + scroll) / 720) ** 2;
          const y = 640 + d * 440;
          return <line key={`h${i}`} x1={0} y1={y} x2={1920} y2={y} stroke={P.cyan} strokeWidth={2} opacity={Math.min(1, d * 3)} />;
        })}
      </svg>
      <AbsoluteFill style={{ background: "linear-gradient(transparent 55%, #000a 100%)" }} />
    </AbsoluteFill>
  );
};

// 本片 HUD：全片歌词条（按原曲绝对时间显隐）+ 底部霓虹进度条
export const RapHud: React.FC<HudProps> = ({ totalFrames }) => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const line = LYRICS.find((l) => sec >= l.s && sec < l.e);
  const p = interpolate(frame, [0, totalFrames], [0, 1], CL);

  let lyric: React.ReactNode = null;
  // 重拍炸裂字由场景内巨字承担，这里不重复显示
  if (line && line.kind !== "punch") {
    const from = Math.round(line.s * FPS);
    const s = pop(frame, from, 13);
    const out = interpolate(frame, [Math.round(line.e * FPS) - 4, Math.round(line.e * FPS)], [1, 0], CL);
    const isPunchline = line.kind === "punchline";
    lyric = (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: isPunchline ? 110 : 70,
          textAlign: "center",
          opacity: Math.min(s, out),
          transform: `translateY(${(1 - s) * 30}px) scale(${isPunchline ? 1 + (1 - s) * 0.3 : 1})`,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: isPunchline ? 84 : 54,
            letterSpacing: 2,
            color: isPunchline ? "#111" : "#fff",
            padding: isPunchline ? "10px 40px" : "6px 26px",
            borderRadius: 16,
            background: isPunchline ? P.yellow : "#05081acc",
            border: isPunchline ? "6px solid #111" : `2px solid ${P.line}`,
            textShadow: isPunchline ? "none" : glow(P.cyan, 0.4),
            boxShadow: isPunchline ? `0 0 60px ${P.yellow}` : "none",
          }}
        >
          {line.text}
        </span>
      </div>
    );
  }

  return (
    <>
      {lyric}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: "#ffffff14" }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 6,
          width: p * 1920,
          background: `linear-gradient(90deg, ${P.cyan}, ${P.magenta})`,
          boxShadow: `0 0 14px ${P.magenta}`,
        }}
      />
    </>
  );
};

// 霓虹招牌文字
export const Neon: React.FC<{
  text: string;
  x: number;
  y: number;
  size?: number;
  color?: string;
  on?: number; // 0~1 亮度
  rotate?: number;
}> = ({ text, x, y, size = 80, color = P.cyan, on = 1, rotate = 0 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: size,
      whiteSpace: "nowrap",
      color: on > 0.5 ? "#fff" : `${color}55`,
      WebkitTextStroke: `${Math.max(2, size / 28)}px ${color}`,
      textShadow: on > 0.05 ? glow(color, on) : "none",
      opacity: 0.35 + on * 0.65,
    }}
  >
    {text}
  </div>
);

// 对话气泡
export const Bubble: React.FC<{ t: number; from: number; x: number; y: number; text: string; color?: string; until?: number }> = ({
  t,
  from,
  x,
  y,
  text,
  color = "#fff",
  until = Infinity,
}) => {
  const s = pop(t, from, 12);
  const end = Number.isFinite(until) ? until : from + 1e6;
  const o = interpolate(t, [end, end + 6], [1, 0], CL);
  if (t < from) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${s})`,
        transformOrigin: "50% 100%",
        opacity: o,
        padding: "14px 28px",
        borderRadius: 22,
        background: color,
        color: "#111",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 40,
        whiteSpace: "nowrap",
        border: "5px solid #111",
      }}
    >
      {text}
    </div>
  );
};

// 霓虹门牌：校门 / 班牌
export const Sign: React.FC<{ x: number; y: number; text: string; color?: string; w?: number; on?: number }> = ({
  x,
  y,
  text,
  color = P.cyan,
  w = 520,
  on = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y,
      width: w,
      padding: "18px 0",
      textAlign: "center",
      borderRadius: 14,
      border: `6px solid ${color}`,
      boxShadow: on > 0.05 ? `0 0 30px ${color}, inset 0 0 24px ${color}66` : "none",
      background: "#05081a",
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: 54,
      color: "#fff",
      textShadow: on > 0.05 ? glow(color, on * 0.7) : "none",
      opacity: 0.4 + on * 0.6,
    }}
  >
    {text}
  </div>
);
