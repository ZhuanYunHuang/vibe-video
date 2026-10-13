import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CL, FONT, HudProps, MONO, hit, pop, prog } from "../../../shared";
import { HeroSfx, HeroWipe } from "./HeroWipe";
import { GRAD, P } from "./theme";

// 地图底纹：水域 + 公园 + 街区网格（纯静态，封面也复用）
export const MapTexture: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <AbsoluteFill style={{ opacity, pointerEvents: "none" }}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${P.block}aa 3px, transparent 3px), linear-gradient(90deg, ${P.block}aa 3px, transparent 3px)`,
        backgroundSize: "120px 120px",
      }}
    />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M1480 -20 C 1420 220 1600 380 1540 560 C 1480 760 1640 900 1600 1100" fill="none" stroke={P.water} strokeWidth={90} strokeLinecap="round" />
      <rect x={1640} y={120} width={240} height={180} rx={40} fill={P.park} />
      <rect x={60} y={60} width={220} height={140} rx={36} fill={P.park} />
      <rect x={1680} y={760} width={200} height={220} rx={40} fill={P.park} />
    </svg>
  </AbsoluteFill>
);

// 本片背景层：静态地图底纹
export const MapBackdrop: React.FC = () => <MapTexture opacity={0.6} />;

// 本片 HUD：切场轻闪 + 招牌转场 + 底部进度条
export const AmapHud: React.FC<HudProps> = ({ cutFrames, totalFrames }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, totalFrames], [0, 1], CL);
  const flash = cutFrames.reduce((m, f) => (frame >= f ? Math.max(m, Math.exp(-(frame - f) / 3)) : m), 0);
  return (
    <>
      <AbsoluteFill style={{ background: P.white, opacity: flash * 0.3, pointerEvents: "none" }} />
      <HeroWipe />
      <HeroSfx />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 8, background: `${P.line}cc` }} />
      <div style={{ position: "absolute", left: 0, bottom: 0, height: 8, width: `${p * 100}%`, background: GRAD }} />
      <div
        style={{
          position: "absolute",
          left: `calc(${p * 100}% - 18px)`,
          bottom: -2,
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: P.white,
          border: `4px solid ${P.blue}`,
          boxShadow: `0 0 12px ${P.blue}66`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: p < 1 ? 1 : 0,
        }}
      >
        <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderLeft: `13px solid ${P.blue}`, marginLeft: 3 }} />
      </div>
    </>
  );
};

// 底部字幕（浅色卡片）
export const Sub: React.FC<{ t: number; from: number; text: string; to?: number }> = ({ t, from, text, to }) => {
  const s = pop(t, from, 14);
  const out = to === undefined ? 1 : interpolate(t, [to, to + 8], [1, 0], CL);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 40,
        fontWeight: 700,
        color: P.ink,
        opacity: s * out,
        transform: `translateY(${(1 - s) * 40}px)`,
      }}
    >
      <span style={{ background: `${P.white}f2`, padding: "12px 32px", borderRadius: 18, border: `3px solid ${P.line}`, boxShadow: `0 8px 24px ${P.ink}14` }}>{text}</span>
    </div>
  );
};

// 章节标签：左上角编号 + 标题 + 蓝绿下划线
export const Chapter: React.FC<{ t: number; step: string; title: string }> = ({ t, step, title }) => {
  const s = pop(t, 0, 12);
  const w = prog(t, 2, 16);
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 100,
        display: "flex",
        alignItems: "center",
        gap: 22,
        fontFamily: FONT,
        transform: `translateX(${(1 - s) * -80}px)`,
        opacity: s,
      }}
    >
      <div
        style={{
          background: GRAD,
          color: P.white,
          fontFamily: MONO,
          fontWeight: 900,
          fontSize: 32,
          padding: "8px 18px",
          borderRadius: 14,
          transform: `scale(${1 + hit(t, 0) * 0.3})`,
        }}
      >
        {step}
      </div>
      <div style={{ fontSize: 54, fontWeight: 900, color: P.ink }}>
        {title}
        <div style={{ height: 6, width: `${w * 100}%`, background: GRAD, borderRadius: 3, marginTop: 6 }} />
      </div>
    </div>
  );
};

// 浅色卡片
export const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; accent?: string }> = ({ children, style, accent }) => (
  <div
    style={{
      background: P.white,
      borderRadius: 28,
      border: `3px solid ${accent ?? P.line}`,
      boxShadow: `0 14px 36px ${P.ink}18`,
      padding: "26px 32px",
      fontFamily: FONT,
      color: P.ink,
      ...style,
    }}
  >
    {children}
  </div>
);

// 手机外框
export const PhoneFrame: React.FC<{ x: number; y: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, children, style }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 520,
      height: 960,
      borderRadius: 64,
      background: P.ink,
      padding: 16,
      boxShadow: `0 30px 80px ${P.ink}44`,
      ...style,
    }}
  >
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 50, overflow: "hidden", background: P.bg }}>
      {children}
      <div style={{ position: "absolute", top: 14, left: "50%", width: 130, height: 30, marginLeft: -65, borderRadius: 15, background: P.ink }} />
    </div>
  </div>
);
