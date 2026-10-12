import React from "react";
import { C, FONT, MONO } from "../core/theme";

// 节点盒子
export const NodeBox: React.FC<{
  x: number;
  y: number;
  label: string;
  sub?: string;
  icon: string;
  color: string;
  appear: number;
  glow?: number;
  w?: number;
}> = ({ x, y, label, sub, icon, color, appear, glow = 0, w = 250 }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y - 85,
      width: w,
      height: 170,
      borderRadius: 24,
      background: C.panel,
      border: `4px solid ${color}`,
      boxShadow: `0 0 ${20 + glow * 60}px ${color}${glow > 0.05 ? "aa" : "33"}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
      color: C.text,
      transform: `scale(${appear * (1 + glow * 0.12)})`,
      opacity: Math.min(1, appear * 1.5),
    }}
  >
    <div style={{ fontSize: 56 }}>{icon}</div>
    <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4 }}>{label}</div>
    {sub ? <div style={{ fontSize: 22, color: C.dim, fontFamily: MONO }}>{sub}</div> : null}
  </div>
);
