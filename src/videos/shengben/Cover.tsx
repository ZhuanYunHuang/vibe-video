import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared";
import { Dude } from "./kit/Dude";
import { glow, P } from "./kit/theme";

// 封面（静态）：霓虹舞台 + 指天的天选之子 + 片名
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, ${P.bg2} 0%, ${P.bg} 55%, ${P.night} 100%)`, fontFamily: FONT, overflow: "hidden" }}>
    {/* 透视网格 */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
      {Array.from({ length: 21 }).map((_, i) => (
        <line key={`v${i}`} x1={960} y1={640} x2={-1200 + i * 216} y2={1080} stroke={P.magenta} strokeWidth={2} />
      ))}
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 640 + ((i + 1) / 8) ** 2 * 440;
        return <line key={`h${i}`} x1={0} y1={y} x2={1920} y2={y} stroke={P.cyan} strokeWidth={2} />;
      })}
    </svg>
    {/* 光束 */}
    {Array.from({ length: 7 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 1380 - 60,
          top: -60,
          width: 120,
          height: 1400,
          transformOrigin: "50% 0%",
          transform: `rotate(${-36 + i * 12}deg)`,
          background: `linear-gradient(${[P.cyan, P.magenta, P.yellow][i % 3]}aa, transparent 80%)`,
          filter: "blur(6px)",
          opacity: 0.6,
        }}
      />
    ))}
    <Dude x={1380} y={1040} s={2.1} mood="cool" glasses armR={165} armL={30} />

    <div style={{ position: "absolute", left: 110, top: 200 }}>
      <div style={{ fontSize: 210, fontWeight: 900, lineHeight: 1.05, color: "#fff", WebkitTextStroke: `8px ${P.magenta}`, textShadow: glow(P.magenta, 1.8) }}>
        升本后
        <br />
        醒来
      </div>
      <div
        style={{
          display: "inline-block",
          marginTop: 50,
          padding: "14px 34px",
          borderRadius: 16,
          background: P.yellow,
          color: "#111",
          fontSize: 54,
          fontWeight: 900,
          border: "6px solid #111",
          transform: "rotate(-3deg)",
        }}
      >
        我能专升本 你不能本升专
      </div>
      <div style={{ marginTop: 40, fontSize: 40, color: P.sub, letterSpacing: 4 }}>动画 MV · 上饶天选之子</div>
    </div>
  </AbsoluteFill>
);
