import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, pop } from "../../../shared";
import { glow, P } from "./theme";

// ============ 大标题 ============
// 原片风格大字：彩字 + 白描边 + 微倾斜 + 柔投影（组件名沿用，API 不变）
export const NeonTitle: React.FC<{
  t: number;
  from: number;
  text: string;
  color?: string;
  size?: number;
  x?: number;
  y?: number;
  until?: number;
  rotate?: number;
}> = ({ t, from, text, color = P.amber, size = 150, x = 960, y = 470, until = Infinity, rotate = -2 }) => {
  if (t < from) return null;
  const s = pop(t, from, 10);
  const jit = hit(t, from, 5) * 14;
  const end = Number.isFinite(until) ? until : from + 1e6;
  const o = interpolate(t, [end, end + 10], [1, 0], CL);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${0.9 + s * 0.1}) rotate(${rotate}deg) translateX(${jit}px)`,
        opacity: o * Math.min(1, s * 1.4),
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 14,
        whiteSpace: "nowrap",
        color,
        WebkitTextStroke: `${Math.max(3, size / 42)}px #FFFFFF`,
        textShadow: glow("#1B2C52", 1.4),
        paintOrder: "stroke",
      }}
    >
      {text}
    </div>
  );
};

// ============ 字幕行 ============
export type Seg = { text: string; color?: string; hi?: boolean };

// 白底圆角字幕条（原片样式），hi 关键词保持调用方给的颜色
export const Line: React.FC<{
  t: number;
  from: number;
  parts: string | Seg[];
  size?: number;
  y?: number; // 底边距，默认 96
  until?: number;
}> = ({ t, from, parts, size = 46, y = 96, until = Infinity }) => {
  if (t < from) return null;
  const s = pop(t, from, 14);
  const end = Number.isFinite(until) ? until : from + 1e6;
  const o = interpolate(t, [end, end + 8], [1, 0], CL);
  const segs: Seg[] = typeof parts === "string" ? [{ text: parts }] : parts;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: y,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1.5,
        opacity: Math.min(s, o),
        transform: `translateY(${(1 - s) * 30}px)`,
      }}
    >
      <span
        style={{
          background: "rgba(255,255,255,0.95)",
          padding: "12px 34px",
          borderRadius: 18,
          border: "2px solid #E3D5BC",
          boxShadow: glow("#C98A4B", 0.7),
          color: P.ink,
        }}
      >
        {segs.map((sg, i) => (
          <span key={i} style={{ color: sg.color ?? P.ink }}>
            {sg.text}
          </span>
        ))}
      </span>
    </div>
  );
};

// ============ 对话气泡 ============
type Tone = "cool" | "warm" | "bad" | "good" | "plain";
const toneColor: Record<Tone, string> = {
  cool: P.cool,
  warm: P.amber,
  bad: P.magenta,
  good: P.ok,
  plain: P.ink,
};

// 白底黑字气泡（原片样式）：tone 决定描边与字色
export const Bubble: React.FC<{
  t: number;
  from: number;
  x: number;
  y: number;
  text: string;
  tone?: Tone;
  size?: number;
  until?: number;
  tail?: "left" | "right" | "none";
}> = ({ t, from, x, y, text, tone = "cool", size = 44, until = Infinity, tail = "left" }) => {
  if (t < from) return null;
  const s = pop(t, from, 12);
  const end = Number.isFinite(until) ? until : from + 1e6;
  const o = interpolate(t, [end, end + 6], [1, 0], CL);
  const c = toneColor[tone];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -100%) scale(${s})`,
        transformOrigin: "50% 100%",
        opacity: o,
        padding: "14px 30px",
        borderRadius: 22,
        background: "#FFFFFF",
        border: `4px solid ${tone === "plain" ? "#D8DEE9" : c}`,
        boxShadow: glow(c, 0.8),
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        whiteSpace: "nowrap",
        color: tone === "plain" ? P.ink : c,
      }}
    >
      {text}
      {tail !== "none" ? (
        <div
          style={{
            position: "absolute",
            bottom: -16,
            [tail === "left" ? "left" : "right"]: 44,
            width: 0,
            height: 0,
            borderLeft: tail === "left" ? "0 solid transparent" : "14px solid transparent",
            borderRight: tail === "left" ? "14px solid transparent" : "0 solid transparent",
            borderTop: `16px solid ${tone === "plain" ? "#D8DEE9" : c}`,
          } as React.CSSProperties}
        />
      ) : null}
    </div>
  );
};

// ============ 章节徽章 ============
// 「原因 ① / 方法 ②」彩底白字圆角徽章
export const Badge: React.FC<{ t: number; from: number; text: string; color?: string; x?: number; y?: number }> = ({
  t,
  from,
  text,
  color = P.amber,
  x = 120,
  y = 92,
}) => {
  if (t < from) return null;
  const s = pop(t, from, 11);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${s}) rotate(-2deg)`,
        transformOrigin: "0 50%",
        opacity: Math.min(1, s * 1.4),
        padding: "10px 32px",
        borderRadius: 999,
        background: color,
        boxShadow: glow(color, 1),
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 44,
        letterSpacing: 4,
        color: "#FFFFFF",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

// ============ 标签胶囊 ============
// 白底彩字胶囊：摔门 / 懂事 / +30 惊喜！……
export const Tag: React.FC<{
  t: number;
  from: number;
  x: number;
  y: number;
  text: string;
  color?: string;
  rot?: number;
  size?: number;
  until?: number;
}> = ({ t, from, x, y, text, color = P.magenta, rot = 0, size = 40, until = Infinity }) => {
  if (t < from) return null;
  const s = pop(t, from, 10);
  const end = Number.isFinite(until) ? until : from + 1e6;
  const o = interpolate(t, [end, end + 8], [1, 0], CL);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s}) rotate(${rot}deg)`,
        opacity: Math.min(1, s * 1.3) * o,
        padding: "8px 26px",
        borderRadius: 999,
        background: "#FFFFFF",
        border: `3.5px solid ${color}`,
        boxShadow: glow(color, 0.8),
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        whiteSpace: "nowrap",
        color,
      }}
    >
      {text}
    </div>
  );
};

// ============ 对比卡 ============
// 白底圆角 + 彩描边 + 柔投影；accent 给一道左侧色条，脱离"纯白 PPT 卡片"感
export const Card: React.FC<{
  t: number;
  from: number;
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  color?: string;
  rot?: number;
  icon?: React.ReactNode;
  accent?: string;
}> = ({ t, from, x, y, w, h, title, sub, color = P.cool, rot = 0, icon, accent }) => {
  if (t < from) return null;
  const s = pop(t, from, 11);
  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        transform: `scale(${s}) rotate(${rot}deg)`,
        opacity: Math.min(1, s * 1.3),
        borderRadius: 28,
        background: "#FFFFFF",
        border: `5px solid ${color}`,
        boxShadow: glow(color, 1.2),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        overflow: "hidden",
      }}
    >
      {accent ? <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 16, background: accent }} /> : null}
      {icon}
      <div style={{ fontWeight: 900, fontSize: 58, color: P.ink }}>{title}</div>
      <div style={{ fontWeight: 700, fontSize: 36, color: P.sub, marginTop: 14 }}>{sub}</div>
    </div>
  );
};

// ============ 印章 ============
// 「重来一次 / 原因①②③④」式印章：空心描边 + 微旋 + 砸落（scale 2.4 → 1）
export const Stamp: React.FC<{
  t: number;
  from: number;
  text: string;
  x?: number;
  y?: number;
  color?: string;
  rot?: number;
  size?: number;
  until?: number;
}> = ({ t, from, x = 960, y = 540, text, color = P.magenta, rot = -8, size = 64, until = Infinity }) => {
  if (t < from) return null;
  const d = t - from;
  const sc = interpolate(d, [0, 3, 7], [2.4, 0.94, 1], CL);
  const end = Number.isFinite(until) ? until : from + 1e6;
  const o = interpolate(t, [from, from + 2, end, end + 8], [0, 1, 1, 0], CL);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${sc}) rotate(${rot}deg)`,
        opacity: o * 0.92,
        padding: "12px 40px",
        border: `8px solid ${color}`,
        borderRadius: 14,
        color,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 12,
        whiteSpace: "nowrap",
        background: "rgba(255,255,255,0.06)",
      }}
    >
      {text}
    </div>
  );
};

// ============ 期待柱 ============
// 浅色轨道 + 实色填充 + 虚线目标
export const ExpectBar: React.FC<{
  t: number;
  from: number;
  x: number; // 柱中心 x
  y: number; // 柱底 y
  w?: number;
  h?: number;
  label: string;
  target: number; // 目标值（满格）
  value: number; // 当前值（调用方插值）
  color?: string;
  over?: boolean; // value 超过 target 时标红
  textColor?: string; // 数值/标签字色（深底场景传浅色）
}> = ({ t, from, x, y, w = 150, h = 380, label, target, value, color = P.cool, over = false, textColor = P.ink }) => {
  if (t < from) return null;
  const s = pop(t, from, 12);
  const vh = (Math.max(0, Math.min(value, target)) / target) * h;
  const fillCol = over ? P.magenta : color;
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h, width: w, height: h, opacity: Math.min(1, s * 1.3), transform: `scaleY(${s})`, transformOrigin: "50% 100%" }}>
      {/* 轨道 */}
      <div style={{ position: "absolute", inset: 0, border: "4px solid #D8DEE9", borderRadius: 14, background: "#FFFFFF" }} />
      {/* 填充 */}
      <div
        style={{
          position: "absolute",
          left: 8,
          right: 8,
          bottom: 8,
          height: Math.max(0, vh - 16),
          background: `linear-gradient(180deg, ${fillCol}, ${fillCol}CC)`,
          borderRadius: 9,
        }}
      />
      {/* 目标线 */}
      <div style={{ position: "absolute", left: -8, right: -8, top: 0, borderTop: `3px dashed ${fillCol}`, opacity: 0.9 }} />
      <div style={{ position: "absolute", left: "50%", top: -46, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: textColor, whiteSpace: "nowrap" }}>
        {Math.round(value)}
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: -56, transform: "translateX(-50%)", fontFamily: FONT, fontWeight: 900, fontSize: 34, color: textColor, whiteSpace: "nowrap" }}>
        {label}
      </div>
    </div>
  );
};
