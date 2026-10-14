import React from "react";
import { P } from "./theme";

export type DudeMood = "cool" | "smug" | "happy" | "shock" | "sad" | "angry" | "sleep" | "laugh";

type DudeProps = {
  x: number; // 脚底中心 x
  y: number; // 脚底 y
  s?: number; // 缩放（1 ≈ 400px 高）
  mood?: DudeMood;
  armL?: number; // 左臂角度：0 下垂，90 平举，160 举过头
  armR?: number;
  jump?: number; // 离地 px
  squat?: number; // 0~1 下蹲
  tilt?: number; // 整体倾斜角度
  look?: number; // 眼珠 -1~1
  shirt?: string; // T 恤字
  shirtColor?: string;
  glasses?: boolean; // 墨镜
  nerd?: boolean; // 本科生造型：圆框眼镜 + 短发
  back?: boolean; // 背影
  dim?: number; // 置灰 0~1
  opacity?: number;
  flip?: boolean;
};

// 主角"天选之子"：Q 版说唱小人（黑 T 恤白字、银链、遮眼刘海）
export const Dude: React.FC<DudeProps> = ({
  x,
  y,
  s = 1,
  mood = "cool",
  armL = 0,
  armR = 0,
  jump = 0,
  squat = 0,
  tilt = 0,
  look = 0,
  shirt = "天选之子",
  shirtColor = P.shirt,
  glasses = false,
  nerd = false,
  back = false,
  dim = 0,
  opacity = 1,
  flip = false,
}) => {
  const legH = 120 * (1 - squat * 0.55);
  const top = 400 - legH - 120; // 身体顶部
  const headY = top - 58;
  const lx = look * 6;
  const arm = (side: -1 | 1, deg: number) => {
    const sx = 100 + side * 46;
    return (
      <g transform={`rotate(${side * -deg} ${sx} ${top + 14})`}>
        <rect x={sx - 12} y={top + 6} width={24} height={92} rx={12} fill={shirtColor} />
        <rect x={sx - 10} y={top + 58} width={20} height={42} rx={10} fill={P.skin} />
        <circle cx={sx} cy={top + 102} r={14} fill={P.skin} />
      </g>
    );
  };

  const eyes = (() => {
    if (back) return null;
    const ey = headY + 6;
    if (glasses)
      return (
        <g>
          <rect x={62} y={ey - 14} width={34} height={22} rx={6} fill="#05060a" />
          <rect x={104} y={ey - 14} width={34} height={22} rx={6} fill="#05060a" />
          <rect x={94} y={ey - 8} width={12} height={4} fill="#05060a" />
          <rect x={68} y={ey - 10} width={10} height={4} rx={2} fill={P.cyan} opacity={0.8} />
        </g>
      );
    switch (mood) {
      case "shock":
        return (
          <g>
            <circle cx={80} cy={ey} r={13} fill="#fff" />
            <circle cx={120} cy={ey} r={13} fill="#fff" />
            <circle cx={80 + lx} cy={ey} r={5} fill="#111" />
            <circle cx={120 + lx} cy={ey} r={5} fill="#111" />
          </g>
        );
      case "happy":
      case "laugh":
        return (
          <g stroke="#111" strokeWidth={5} fill="none" strokeLinecap="round">
            <path d={`M70 ${ey + 4} Q80 ${ey - 8} 90 ${ey + 4}`} />
            <path d={`M110 ${ey + 4} Q120 ${ey - 8} 130 ${ey + 4}`} />
          </g>
        );
      case "sleep":
        return (
          <g stroke="#111" strokeWidth={5} strokeLinecap="round">
            <path d={`M70 ${ey} L90 ${ey}`} />
            <path d={`M110 ${ey} L130 ${ey}`} />
          </g>
        );
      case "sad":
        return (
          <g>
            <ellipse cx={80 + lx} cy={ey + 2} rx={6} ry={8} fill="#111" />
            <ellipse cx={120 + lx} cy={ey + 2} rx={6} ry={8} fill="#111" />
            <path d={`M66 ${ey - 14} L90 ${ey - 8} M134 ${ey - 14} L110 ${ey - 8}`} stroke="#111" strokeWidth={4} />
            <path d={`M122 ${ey + 12} q-4 14 0 20 q4 -6 0 -20`} fill={P.cyan} />
          </g>
        );
      case "angry":
        return (
          <g>
            <ellipse cx={80 + lx} cy={ey + 2} rx={6} ry={7} fill="#111" />
            <ellipse cx={120 + lx} cy={ey + 2} rx={6} ry={7} fill="#111" />
            <path d={`M64 ${ey - 16} L92 ${ey - 6} M136 ${ey - 16} L108 ${ey - 6}`} stroke="#111" strokeWidth={6} strokeLinecap="round" />
          </g>
        );
      default:
        // cool / smug：半眯眼
        return (
          <g>
            <ellipse cx={80 + lx} cy={ey + 2} rx={7} ry={mood === "smug" ? 4 : 7} fill="#111" />
            <ellipse cx={120 + lx} cy={ey + 2} rx={7} ry={mood === "smug" ? 4 : 7} fill="#111" />
          </g>
        );
    }
  })();

  const mouth = (() => {
    if (back) return null;
    const my = headY + 34;
    switch (mood) {
      case "shock":
        return <ellipse cx={100} cy={my + 4} rx={10} ry={14} fill="#3a0d14" />;
      case "happy":
        return <path d={`M84 ${my} Q100 ${my + 18} 116 ${my}`} fill="#3a0d14" />;
      case "laugh":
        return <path d={`M78 ${my - 4} Q100 ${my + 28} 122 ${my - 4} Z`} fill="#3a0d14" />;
      case "sad":
        return <path d={`M86 ${my + 8} Q100 ${my - 4} 114 ${my + 8}`} stroke="#3a0d14" strokeWidth={5} fill="none" />;
      case "angry":
        return <rect x={84} y={my} width={32} height={10} rx={4} fill="#3a0d14" />;
      case "sleep":
        return <ellipse cx={104} cy={my + 2} rx={5} ry={4} fill="#3a0d14" />;
      case "smug":
        return <path d={`M88 ${my + 4} Q106 ${my + 10} 116 ${my - 4}`} stroke="#3a0d14" strokeWidth={5} fill="none" strokeLinecap="round" />;
      default:
        return <path d={`M88 ${my + 2} L114 ${my + 2}`} stroke="#3a0d14" strokeWidth={5} strokeLinecap="round" />;
    }
  })();

  return (
    <div
      style={{
        position: "absolute",
        left: x - 100 * s,
        top: y - 400 * s - jump,
        width: 200 * s,
        height: 400 * s,
        opacity,
        transform: `rotate(${tilt}deg) scaleX(${flip ? -1 : 1})`,
        transformOrigin: "50% 100%",
        filter: dim > 0 ? `grayscale(${dim}) brightness(${1 - dim * 0.35})` : undefined,
      }}
    >
      <svg viewBox="0 0 200 400" width={200 * s} height={400 * s} style={{ overflow: "visible", display: "block" }}>
        <ellipse cx={100} cy={402 + jump / s} rx={70} ry={12} fill="#000" opacity={0.35 * Math.max(0.2, 1 - jump / 300)} />
        {/* 腿 */}
        <rect x={66} y={400 - legH} width={30} height={legH} rx={8} fill={P.jeans} />
        <rect x={104} y={400 - legH} width={30} height={legH} rx={8} fill={P.jeans} />
        <rect x={58} y={388} width={42} height={14} rx={7} fill="#f2f2f2" />
        <rect x={100} y={388} width={42} height={14} rx={7} fill="#f2f2f2" />
        {arm(-1, armL)}
        {arm(1, armR)}
        {/* 身体 */}
        <rect x={54} y={top} width={92} height={128} rx={20} fill={shirtColor} />
        {!back && shirt ? (
          <text x={100} y={top + 84} textAnchor="middle" fontSize={shirt.length > 3 ? 19 : 24} fontWeight={900} fill="#f4f4f4" fontFamily="sans-serif">
            {shirt}
          </text>
        ) : null}
        {!back && !nerd ? (
          <g fill="none" stroke={P.silver} strokeLinecap="round">
            <path d={`M76 ${top + 4} Q100 ${top + 52} 124 ${top + 4}`} strokeWidth={6} strokeDasharray="7 4" />
            <path d={`M82 ${top + 4} Q100 ${top + 36} 118 ${top + 4}`} strokeWidth={3} />
          </g>
        ) : null}
        {/* 头 */}
        <circle cx={100} cy={headY} r={60} fill={P.skin} />
        {eyes}
        {mouth}
        {nerd ? (
          <g>
            <path d={`M40 ${headY - 10} Q100 ${headY - 92} 160 ${headY - 10} L160 ${headY - 30} Q100 ${headY - 70} 40 ${headY - 30} Z`} fill={P.hair} />
            {!back ? (
              <g fill="none" stroke="#111" strokeWidth={4}>
                <circle cx={80} cy={headY + 8} r={16} />
                <circle cx={120} cy={headY + 8} r={16} />
                <path d={`M96 ${headY + 8} L104 ${headY + 8}`} />
              </g>
            ) : null}
          </g>
        ) : (
          <path
            d={
              back
                ? `M38 ${headY + 10} Q36 ${headY - 74} 100 ${headY - 70} Q166 ${headY - 74} 162 ${headY + 10} L162 ${headY + 44} Q100 ${headY + 60} 38 ${headY + 44} Z`
                : `M36 ${headY + 30} Q30 ${headY - 76} 100 ${headY - 72} Q172 ${headY - 76} 164 ${headY + 30} L152 ${headY - 6} L140 ${headY - 2} L128 ${headY - 14} L112 ${headY - 6} L98 ${headY - 16} L84 ${headY - 6} L70 ${headY - 14} L56 ${headY - 4} L48 ${headY + 4} Z`
            }
            fill={P.hair}
          />
        )}
      </svg>
    </div>
  );
};
