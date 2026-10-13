import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

export type Mood = "normal" | "happy" | "surprised" | "sad" | "think" | "closed";

type ClawdProps = {
  x: number; // 身体中心 x
  y: number; // 脚底 y
  u: number; // 一个像素格的边长
  color?: string;
  mood?: Mood;
  walk?: number; // 步伐相位（弧度）
  stride?: number; // 步伐幅度 0~1
  jump?: number; // 离地高度 px
  squash?: number; // 正值压扁、负值拉长
  arm?: number; // 右臂抬起 0~1
  armL?: number; // 左臂抬起 0~1
  look?: number; // 眼珠左右 -1~1
  lookY?: number; // 眼珠上下 -1~1
  dim?: number; // 置灰 0~1
  opacity?: number;
  seed?: number; // 眨眼错相
  children?: React.ReactNode; // 头顶附属物（号码牌等）
};

// Claude 的像素小人：方身体、两只竖眼、两侧小手、四条腿
export const Clawd: React.FC<ClawdProps> = ({
  x,
  y,
  u,
  color = P.clay,
  mood = "normal",
  walk = 0,
  stride = 0,
  jump = 0,
  squash = 0,
  arm = 0,
  armL = 0,
  look = 0,
  lookY = 0,
  dim = 0,
  opacity = 1,
  seed = 0,
  children,
}) => {
  const frame = useCurrentFrame();
  const s = Math.sin(walk);
  const liftA = Math.max(0, s) * stride;
  const liftB = Math.max(0, -s) * stride;
  const bob = Math.abs(s) * stride * 0.35 * u;
  const blink = (mood === "normal" || mood === "think") && (frame + seed * 37) % 113 < 4;
  const lx = look * 0.5;
  const ly = lookY * 0.5;
  const legs = [3, 5, 8, 10];
  const ink = P.ink;

  const eyes = (() => {
    if (blink || mood === "closed") {
      return [4, 9].map((ex) => <rect key={ex} x={ex + lx} y={2.6} width={1} height={0.35} fill={ink} />);
    }
    if (mood === "happy") {
      return [4, 9].map((ex) => (
        <path key={ex} d={`M${ex - 0.25} 3.2 L${ex + 0.5} 2.2 L${ex + 1.25} 3.2`} stroke={ink} strokeWidth={0.55} fill="none" />
      ));
    }
    if (mood === "surprised") {
      return [
        ...[4, 9].map((ex) => <rect key={ex} x={ex - 0.2 + lx} y={1.2} width={1.4} height={2.6} fill={ink} />),
        <rect key="m" x={6.5} y={4.3} width={1} height={1} fill={ink} />,
      ];
    }
    if (mood === "sad") {
      return [
        <rect key="a" x={4} y={2.3} width={1} height={1.4} fill={ink} />,
        <rect key="b" x={9} y={2.3} width={1} height={1.4} fill={ink} />,
        <path key="c" d="M3.5 1.8 L5.3 1.2 M8.7 1.2 L10.5 1.8" stroke={ink} strokeWidth={0.4} fill="none" />,
      ];
    }
    const ty = mood === "think" ? -0.4 : 0;
    return [4, 9].map((ex) => <rect key={ex} x={ex + lx} y={1.5 + ly + ty} width={1} height={2} fill={ink} />);
  })();

  const w = 14 * u;
  const h = 8 * u;
  const lift = jump + bob;

  return (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - h,
        width: w,
        height: h,
        opacity,
        filter: dim > 0 ? `grayscale(${dim}) brightness(${1 + dim * 0.12})` : undefined,
      }}
    >
      {/* 地面阴影：跳得越高越小 */}
      <div
        style={{
          position: "absolute",
          left: w * 0.12 + Math.min(lift, 120) * 0.15,
          right: w * 0.12 + Math.min(lift, 120) * 0.15,
          bottom: -u * 0.5,
          height: u,
          borderRadius: "50%",
          background: "#1F1E1D",
          opacity: 0.12 * Math.max(0.3, 1 - lift / 160),
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${-lift}px) scale(${1 + squash * 0.12}, ${1 - squash * 0.12})`,
          transformOrigin: "50% 100%",
        }}
      >
        <svg viewBox="0 0 14 8" width={w} height={h} style={{ overflow: "visible", display: "block" }} shapeRendering="crispEdges">
          {legs.map((lx0, i) => {
            const l = i % 2 === 0 ? liftA : liftB;
            return <rect key={i} x={lx0} y={6} width={1} height={2 - l * 0.9} fill={color} />;
          })}
          <rect x={0} y={2 - armL * 2.4} width={2.2} height={2} fill={color} />
          <rect x={11.8} y={2 - arm * 2.4} width={2.2} height={2} fill={color} />
          <rect x={2} y={0} width={10} height={6.2} fill={color} />
          {eyes}
        </svg>
        {children ? (
          <div style={{ position: "absolute", left: "50%", bottom: h, transform: "translateX(-50%)" }}>{children}</div>
        ) : null}
      </div>
    </div>
  );
};
