import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CL, FONT, HudProps, hit, pop, prog, useBeat, useT } from "../../../shared";
import { glow, P } from "./theme";

// 当前场景内的节拍脉冲（按绝对帧对齐 BGM）
export const usePulse = (start: number) => {
  const beat = useBeat();
  const t = useT();
  return beat.beatPulse(beat.bf(start) + t);
};

// 全场景慢速运镜：呼吸式缩放 + 轻微平移（非逐拍抖动，给画面"活"的镜头感）
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transform: `scale(${1.04 + 0.022 * Math.sin(t / 260)}) translate(${Math.sin(t / 340) * 9}px, ${Math.cos(t / 296) * 7}px)`,
    }}
  >
    {children}
  </div>
);

// 本片背景：深水径向光 + 呼吸涟漪环 + 摇摆光柱 + 上升气泡 + 底部水波
export const DiveBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { beatPulse } = useBeat();
  const pulse = beatPulse(frame);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 18%, ${P.bg2}cc 0%, transparent 62%)` }} />
      {/* 呼吸涟漪环 */}
      {[260, 470, 700, 960].map((r, i) => (
        <div
          key={r}
          style={{
            position: "absolute",
            left: 960 - r,
            top: 540 - r,
            width: r * 2,
            height: r * 2,
            borderRadius: "50%",
            border: `2px solid ${P.line}`,
            opacity: (0.35 - i * 0.06) * (1 + pulse * 0.5),
            transform: `scale(${1 + pulse * 0.006 * (4 - i) + 0.01 * Math.sin(frame / 40 + i)})`,
          }}
        />
      ))}
      {/* 摇摆光柱 */}
      {[-160, 120].map((dx, i) => (
        <div
          key={dx}
          style={{
            position: "absolute",
            left: 860 + dx,
            top: -220,
            width: 260,
            height: 1400,
            transform: `rotate(${14 + i * 8 + Math.sin(frame / 190 + i * 2) * 3}deg)`,
            background: `linear-gradient(180deg, ${P.mint}14 0%, transparent 65%)`,
            filter: "blur(6px)",
          }}
        />
      ))}
      {/* 上升气泡 */}
      {Array.from({ length: 14 }, (_, i) => {
        const seed = Math.abs(Math.sin(i * 57.31)) ;
        const x = 40 + seed * 1840;
        const sp = 0.7 + Math.abs(Math.sin(i * 23.7)) * 1.1;
        const y = 1180 - ((frame * sp + seed * 1200) % 1320);
        const s = 4 + Math.abs(Math.sin(i * 11.3)) * 11;
        const sway = Math.sin(frame / 30 + i) * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + sway,
              top: y,
              width: s,
              height: s,
              borderRadius: "50%",
              border: `2px solid ${P.mint}`,
              opacity: 0.05 + 0.16 * (y / 1180),
              background: `${P.mint}11`,
            }}
          />
        );
      })}
      <WaveBand y={960} amp={14} speed={0.02} color={`${P.line}66`} phase={frame} />
      <WaveBand y={1000} amp={10} speed={0.03} color={`${P.bg2}aa`} phase={frame + 40} />
    </AbsoluteFill>
  );
};

// 一条水波剪影（SVG），phase 驱动缓慢流动
export const WaveBand: React.FC<{ y: number; amp: number; speed: number; color: string; phase: number }> = ({
  y,
  amp,
  speed,
  color,
  phase,
}) => {
  const pts: string[] = [];
  for (let x = 0; x <= 1920; x += 40) {
    pts.push(`${x},${y + Math.sin(x / 160 + phase * speed) * amp}`);
  }
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <polygon points={`0,1080 ${pts.join(" ")} 1920,1080`} fill={color} />
    </svg>
  );
};

// 本片 HUD：底部细进度条 + 前沿一枚随节拍呼吸的涟漪环 + 切场微光
export const FlowHud: React.FC<HudProps> = ({ cutFrames, totalFrames }) => {
  const frame = useCurrentFrame();
  const { beatPulse } = useBeat();
  const p = interpolate(frame, [0, totalFrames], [0, 1], CL);
  const pulse = beatPulse(frame);
  const flash = cutFrames.reduce((m, f) => (frame >= f ? Math.max(m, Math.exp(-(frame - f) / 4)) : m), 0);
  const r = 9 + pulse * 7;
  return (
    <>
      <AbsoluteFill style={{ background: P.mint, opacity: flash * 0.22, pointerEvents: "none" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 6, background: `${P.line}aa` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 6,
          width: `${p * 100}%`,
          background: `linear-gradient(90deg, ${P.mint}, ${P.gold})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: `calc(${p * 100}% - ${r}px)`,
          bottom: 3 - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          border: `3px solid ${P.mint}`,
          boxShadow: `0 0 ${8 + pulse * 18}px ${P.mint}`,
          opacity: p < 1 ? 1 : 0,
        }}
      />
    </>
  );
};

// 左上角章节标签：编号徽章 + 标题 + 薄荷下划线（带轻微悬浮）
export const Chapter: React.FC<{ t: number; step: string; title: string; color?: string }> = ({ t, step, title, color = P.mint }) => {
  const s = pop(t, 0, 12);
  const w = prog(t, 4, 16);
  return (
    <div
      style={{
        position: "absolute",
        top: 64,
        left: 100,
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: FONT,
        opacity: s,
        transform: `translateY(${(1 - s) * -40}px)`,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          color,
          fontSize: 28,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${Math.sin(t / 22) * 4}px)`,
          boxShadow: `0 0 ${18 * (1 + hit(t, 0, 6))}px ${color}66`,
        }}
      >
        {step}
      </div>
      <div style={{ fontSize: 46, fontWeight: 800, color: P.ink, letterSpacing: 2 }}>
        {title}
        <div style={{ height: 4, width: `${w * 100}%`, background: color, borderRadius: 2, marginTop: 6, opacity: 0.8 }} />
      </div>
    </div>
  );
};

// 底部字幕：半透明水色胶囊；to 之后淡出，便于同一位置换字幕
export const Sub: React.FC<{ t: number; from: number; to?: number; text: React.ReactNode; color?: string }> = ({
  t,
  from,
  to = Infinity,
  text,
  color = P.ink,
}) => {
  if (t < from || t >= to + 8) return null;
  const s = pop(t, from, 14);
  const out = to === Infinity ? 0 : prog(t, to, 8);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 86,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 40,
        fontWeight: 700,
        color,
        opacity: s * (1 - out),
        transform: `translateY(${(1 - s) * 30}px)`,
      }}
    >
      <span style={{ background: P.glass, padding: "12px 34px", borderRadius: 40, border: `2px solid ${P.mint}55` }}>{text}</span>
    </div>
  );
};

// 同心涟漪：每一层在 froms[i] 帧砸出并扩散到位；到位后缓慢呼吸
export const Ripple: React.FC<{
  t: number;
  x: number;
  y: number;
  froms: number[];
  r0?: number;
  gap?: number;
  color?: string;
  bright?: number; // 0~1 整体亮度，越投入越亮
}> = ({ t, x, y, froms, r0 = 90, gap = 60, color = P.mint, bright = 1 }) => (
  <>
    {froms.map((f, i) => {
      if (t < f) return null;
      const s = pop(t, f, 13);
      const r = (r0 + i * gap) * (0.4 + 0.6 * s) + Math.sin((t - f) / 18 + i) * 3;
      const h = hit(t, f, 6);
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
            border: `${3 + h * 4}px solid ${color}`,
            opacity: (0.85 - i * 0.12) * bright,
            boxShadow: `0 0 ${14 + h * 40}px ${color}88, inset 0 0 ${10 + h * 20}px ${color}44`,
          }}
        />
      );
    })}
  </>
);

// 水光玻璃卡：入场回弹 + 常态悬浮呼吸（每张卡相位不同，绝不停滞）
export const GlassCard: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  appear: number; // 0~1
  lit?: number; // 0~1 高亮
  color?: string;
  children: React.ReactNode;
}> = ({ x, y, w, h, appear, lit = 0, color = P.mint, children }) => {
  const t = useT();
  const bobY = appear > 0.9 ? Math.sin(t / 24 + (x + y) / 150) * 7 : 0;
  const rot = appear > 0.9 ? Math.sin(t / 31 + x / 200) * 0.9 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        borderRadius: 28,
        background: P.glass,
        border: `2px solid ${lit > 0.01 ? color : P.line}`,
        boxShadow: `0 0 ${lit * 50}px ${color}88`,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 60 + bobY}px) rotate(${rot}deg) scale(${0.85 + appear * 0.15 + lit * 0.04})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        color: P.ink,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
};

// 粒子迸发：from 帧起一圈粒子向外飞散并淡出（大卡点的"炸一下"）
export const Burst: React.FC<{
  t: number;
  from: number;
  x: number;
  y: number;
  n?: number;
  spread?: number;
  size?: number;
  colors?: string[];
}> = ({ t, from, x, y, n = 16, spread = 240, size = 12, colors = [P.mint, P.gold, "#ffffff"] }) => {
  if (t < from || t > from + 48) return null;
  const p = (t - from) / 48;
  const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 26), 3);
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + (i % 3) * 0.5;
        const r = ease * spread * (0.55 + ((i * 37) % 40) / 100);
        const s = size * (1 - p) * (0.7 + ((i * 13) % 30) / 100);
        const c = colors[i % colors.length];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + Math.cos(a) * r,
              top: y + Math.sin(a) * r - p * 36,
              width: s,
              height: s,
              borderRadius: "50%",
              background: c,
              opacity: (1 - p) * 0.95,
              boxShadow: `0 0 ${s}px ${c}`,
            }}
          />
        );
      })}
    </>
  );
};

// 砸入式大字：from 帧砸下，带一记打击放大
export const Slam: React.FC<{
  t: number;
  from: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  x?: number;
  y?: number;
  glowColor?: string;
}> = ({ t, from, children, size = 96, color = P.ink, x = 960, y = 540, glowColor }) => {
  if (t < from) return null;
  const s = pop(t, from, 10);
  const h = hit(t, from, 4);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${(1.6 - 0.6 * s) * (1 + h * 0.12)})`,
        opacity: Math.min(1, s * 1.4),
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 900,
        color,
        whiteSpace: "nowrap",
        textShadow: glowColor ? glow(glowColor, 1 + h) : undefined,
      }}
    >
      {children}
    </div>
  );
};

// 弹出的 emoji 图标：带持续悬浮呼吸
export const Icon: React.FC<{ t: number; from: number; x: number; y: number; emoji: string; size?: number; opacity?: number }> = ({
  t,
  from,
  x,
  y,
  emoji,
  size = 120,
  opacity = 1,
}) => {
  if (t < from) return null;
  const s = pop(t, from, 10);
  const bob = Math.sin((t - from) / 10 + x / 90) * 6;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        fontSize: size,
        lineHeight: 1,
        transform: `translate(-50%, -50%) translateY(${bob}px) scale(${s * (1 + hit(t, from, 4) * 0.2)})`,
        opacity,
      }}
    >
      {emoji}
    </div>
  );
};

// 左上角「瞬间 n/3」小标签（三共鸣幕用，冷开场不剧透主题）
export const MomentTag: React.FC<{ t: number; no: string }> = ({ t, no }) => {
  if (t < 0) return null;
  const s = pop(t, 2, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: 100,
        top: 64,
        padding: "10px 26px",
        borderRadius: 40,
        background: P.coral,
        color: P.abyss,
        fontFamily: FONT,
        fontSize: 32,
        fontWeight: 900,
        opacity: s,
        transform: `translateX(${(1 - s) * -40}px) rotate(${Math.sin(t / 30) * 1.5}deg)`,
      }}
    >
      瞬间 {no}
    </div>
  );
};
