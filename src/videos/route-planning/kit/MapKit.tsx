import React from "react";
import { FONT, MONO } from "../../../shared";
import { EDGES, NODES, P, Pt, edgeMid, trafficColor } from "./theme";

// 地图/图原语：全部是纯 props 的 SVG 片段，不依赖节拍 context（封面也能用）

// 全画布 SVG 容器
export const Stage: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, ...style }}>
    {children}
  </svg>
);

const polyLen = (pts: Pt[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p.x - pts[i].x, p.y - pts[i].y), 0);

const toPoints = (pts: Pt[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");

// 路网：mode=road 画成白色马路，mode=graph 画成细连线
// appear(i) 控制每条边的出现进度 0→1；traffic=true 时按通行时间着色
export const RoadNet: React.FC<{
  appear?: (i: number) => number;
  mode?: "road" | "graph";
  traffic?: number; // 0→1 路况着色强度
  dim?: (i: number) => number; // 每条边的透明度
}> = ({ appear = () => 1, mode = "road", traffic = 0, dim = () => 1 }) => (
  <g>
    {EDGES.map(([a, b, w], i) => {
      const p = appear(i);
      if (p <= 0) return null;
      const A = NODES[a];
      const B = NODES[b];
      const x2 = A.x + (B.x - A.x) * p;
      const y2 = A.y + (B.y - A.y) * p;
      const road = mode === "road";
      return (
        <g key={i} opacity={dim(i)}>
          {road ? <line x1={A.x} y1={A.y} x2={x2} y2={y2} stroke={P.roadEdge} strokeWidth={34} strokeLinecap="round" /> : null}
          <line
            x1={A.x}
            y1={A.y}
            x2={x2}
            y2={y2}
            stroke={road ? P.road : P.edge}
            strokeWidth={road ? 26 : 6}
            strokeLinecap="round"
          />
          {traffic > 0 ? (
            <line x1={A.x} y1={A.y} x2={x2} y2={y2} stroke={trafficColor(w)} strokeWidth={road ? 10 : 8} strokeLinecap="round" opacity={traffic} />
          ) : null}
        </g>
      );
    })}
  </g>
);

// 边权标签（分钟）
export const Weights: React.FC<{ appear: (i: number) => number; color?: (i: number) => string }> = ({ appear, color }) => (
  <g>
    {EDGES.map(([, , w], i) => {
      const s = appear(i);
      if (s <= 0) return null;
      const m = edgeMid(i);
      const c = color ? color(i) : trafficColor(w);
      return (
        <g key={i} transform={`translate(${m.x} ${m.y}) scale(${s})`} opacity={Math.min(1, s * 1.5)}>
          <rect x={-30} y={-24} width={60} height={48} rx={14} fill={P.white} stroke={c} strokeWidth={4} />
          <text textAnchor="middle" dy={12} fontFamily={MONO} fontWeight={900} fontSize={32} fill={c}>
            {w}
          </text>
        </g>
      );
    })}
  </g>
);

// 路口节点
export const NodeDot: React.FC<{
  i: number;
  s?: number; // 出现进度
  fill?: string;
  ring?: string;
  r?: number;
  glow?: number;
  label?: string;
}> = ({ i, s = 1, fill = P.white, ring = P.edge, r = 22, glow = 0, label }) => {
  if (s <= 0) return null;
  const n = NODES[i];
  return (
    <g transform={`translate(${n.x} ${n.y}) scale(${s})`}>
      {glow > 0 ? <circle r={r + 18 + glow * 14} fill={ring} opacity={0.25 * glow} /> : null}
      <circle r={r} fill={fill} stroke={ring} strokeWidth={6} />
      {label ? (
        <text textAnchor="middle" dy={10} fontFamily={FONT} fontWeight={900} fontSize={28} fill={fill === P.white ? ring : P.white}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

// 沿节点序列画一条高亮路线，p 为描画进度 0→1
export const PathLine: React.FC<{ path: number[]; p: number; color?: string; width?: number; id: string }> = ({
  path,
  p,
  color,
  width = 16,
  id,
}) => {
  if (p <= 0) return null;
  const pts = path.map((i) => NODES[i]);
  const len = polyLen(pts);
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={P.blue} />
          <stop offset="100%" stopColor={P.teal} />
        </linearGradient>
      </defs>
      <polyline
        points={toPoints(pts)}
        fill="none"
        stroke={P.white}
        strokeWidth={width + 10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${len * p} ${len}`}
      />
      <polyline
        points={toPoints(pts)}
        fill="none"
        stroke={color ?? `url(#${id})`}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${len * p} ${len}`}
      />
    </g>
  );
};

// 节点上方的距离标签：∞ 或具体数字
export const DistLabel: React.FC<{ i: number; text: string; color: string; flash?: number }> = ({ i, text, color, flash = 0 }) => {
  const n = NODES[i];
  return (
    <g transform={`translate(${n.x} ${n.y - 58}) scale(${1 + flash * 0.35})`}>
      <rect x={-38} y={-26} width={76} height={50} rx={14} fill={flash > 0.05 ? P.amber : P.white} stroke={color} strokeWidth={3} />
      <text textAnchor="middle" dy={11} fontFamily={MONO} fontWeight={900} fontSize={30} fill={flash > 0.05 ? P.white : color}>
        {text}
      </text>
    </g>
  );
};

// 定位针（起点 / 终点）
export const Pin: React.FC<{ x: number; y: number; color: string; s?: number; text?: string }> = ({ x, y, color, s = 1, text }) => {
  if (s <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={16} ry={6} fill={P.ink} opacity={0.18} />
      <path d="M0 0 C -30 -40 -34 -58 -34 -72 A 34 34 0 1 1 34 -72 C 34 -58 30 -40 0 0 Z" fill={color} stroke={P.white} strokeWidth={5} />
      <circle cx={0} cy={-72} r={13} fill={P.white} />
      {text ? (
        <text x={0} y={-128} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={30} fill={color}>
          {text}
        </text>
      ) : null}
    </g>
  );
};
