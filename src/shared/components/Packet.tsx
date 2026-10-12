import React from "react";
import { MONO } from "../core/theme";

// 数据包：在 A→B 之间按进度移动
export const Packet: React.FC<{
  from: [number, number];
  to: [number, number];
  p: number;
  color: string;
  label?: string;
}> = ({ from, to, p, color, label }) => {
  if (p <= 0 || p >= 1) return null;
  const x = from[0] + (to[0] - from[0]) * p;
  const y = from[1] + (to[1] - from[1]) * p - Math.sin(p * Math.PI) * 60;
  const trail = [0.06, 0.12, 0.18];
  return (
    <>
      {trail.map((d, i) => {
        const q = Math.max(0, p - d);
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: from[0] + (to[0] - from[0]) * q - 10,
              top: from[1] + (to[1] - from[1]) * q - Math.sin(q * Math.PI) * 60 - 10,
              width: 20,
              height: 20,
              borderRadius: 10,
              background: color,
              opacity: 0.5 - i * 0.15,
            }}
          />
        );
      })}
      <div
        style={{
          position: "absolute",
          left: x - 22,
          top: y - 22,
          width: 44,
          height: 44,
          borderRadius: 12,
          background: color,
          boxShadow: `0 0 30px ${color}`,
          transform: `rotate(${p * 360}deg)`,
        }}
      />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: x - 200,
            top: y - 80,
            width: 400,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 26,
            fontWeight: 700,
            color,
          }}
        >
          {label}
        </div>
      ) : null}
    </>
  );
};
