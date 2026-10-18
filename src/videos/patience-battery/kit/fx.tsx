import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, Shockwave, SpeedLines, hit } from "../../../shared";
import { glow, P } from "./theme";

// 全屏闪光：at 帧瞬间满亮，随后衰减
export const Flash: React.FC<{ t: number; at: number; color?: string; decay?: number; max?: number }> = ({
  t,
  at,
  color = "#fff",
  decay = 5,
  max = 0.9,
}) => {
  const o = hit(t, at, decay) * max;
  if (o < 0.01) return null;
  return <div style={{ position: "absolute", inset: -200, background: color, opacity: o, pointerEvents: "none" }} />;
};

// 巨字砸入：白字 + 彩色描边 + 投影，until 后淡出（原片「为什么/砰」式大字）
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
  const end = Number.isFinite(until) ? until : at + 1e6;
  const o = interpolate(t, [at - 2, at, end, end + 8], [0, 1, 1, 0], CL);
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          fontFamily: FONT,
          fontSize: size,
          fontWeight: 900,
          lineHeight: 1,
          whiteSpace: "nowrap",
          transform: `translate(-50%, -50%) scale(${sc}) rotate(${rotate}deg)`,
          color: "#FFFFFF",
          WebkitTextStroke: `${Math.max(8, size / 42)}px ${color}`,
          textShadow: glow("#1B2C52", 2),
          paintOrder: "stroke",
        }}
      >
        {text}
      </div>
    </div>
  );
};

// 断裂冲击组合：冲击波 + 速度线 + 闪光（橡皮筋「啪」断 / 玻璃碎）
export const Break: React.FC<{ t: number; at: number; x?: number; y?: number; color?: string; radius?: number }> = ({
  t,
  at,
  x = 960,
  y = 540,
  color = P.warmRed,
  radius = 560,
}) => (
  <>
    <Shockwave t={t} at={at} x={x} y={y} color={color} rings={3} maxRadius={radius} dur={28} />
    <SpeedLines t={t} at={at} cx={x} cy={y} color={color} dur={12} n={10} inner={260} outer={640} />
    <Flash t={t} at={at} color={color} decay={6} max={0.32} />
  </>
);

// 摔门组合：闪光 + 冲击波（震屏由场景用 shake/ShakeWrapper 挂在内容层）
export const DoorSlam: React.FC<{ t: number; at: number; x?: number; color?: string }> = ({ t, at, x = 1290, color = P.magenta }) => (
  <>
    <Shockwave t={t} at={at} x={x} y={620} color={color} rings={4} maxRadius={900} dur={32} />
    <SpeedLines t={t} at={at} cx={x} cy={620} color="#FFE9FF" dur={12} n={12} inner={200} outer={780} />
    <Flash t={t} at={at} color={color} decay={5} max={0.4} />
  </>
);
