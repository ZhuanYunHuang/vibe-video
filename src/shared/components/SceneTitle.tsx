import React from "react";
import { hit, pop, prog } from "../core/anim";
import { useBeat } from "../runtime/beat-context";
import { C, FONT } from "../core/theme";

// 场景标题：步骤编号 + 文字，在第 0 拍砸入
export const SceneTitle: React.FC<{ t: number; step: string; title: string; color: string }> = ({ t, step, title, color }) => {
  const { BEAT } = useBeat();
  const s = pop(t, 0, 12);
  const w = prog(t, 2, BEAT);
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 110,
        display: "flex",
        alignItems: "center",
        gap: 24,
        fontFamily: FONT,
        transform: `translateX(${(1 - s) * -80}px)`,
        opacity: s,
      }}
    >
      <div
        style={{
          background: color,
          color: C.bg,
          fontWeight: 900,
          fontSize: 34,
          padding: "8px 18px",
          borderRadius: 12,
          transform: `scale(${1 + hit(t, 0) * 0.3})`,
        }}
      >
        {step}
      </div>
      <div style={{ fontSize: 56, fontWeight: 800, color: C.text }}>
        {title}
        <div style={{ height: 6, width: `${w * 100}%`, background: color, borderRadius: 3, marginTop: 6 }} />
      </div>
    </div>
  );
};
