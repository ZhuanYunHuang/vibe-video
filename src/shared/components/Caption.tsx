import React from "react";
import { pop } from "../core/anim";
import { C, FONT } from "../core/theme";

// 底部字幕条
export const Caption: React.FC<{ t: number; from: number; text: string; color?: string }> = ({ t, from, text, color = C.text }) => {
  const s = pop(t, from, 14);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 90,
        left: 0,
        right: 0,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 40,
        fontWeight: 700,
        color,
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
      }}
    >
      <span style={{ background: "#0b1020cc", padding: "10px 28px", borderRadius: 14, border: `2px solid ${C.line}` }}>{text}</span>
    </div>
  );
};
