import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared";
import { glow, P } from "./kit/theme";

// 悬念式封面：不剧透「心流」，用三联画面 + 钩子文案勾住点击（与正片同风格）
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: P.bg, fontFamily: FONT, overflow: "hidden" }}>
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 20%, ${P.bg2} 0%, ${P.abyss} 78%)` }} />
    {[520, 700, 900].map((r, i) => (
      <div
        key={r}
        style={{
          position: "absolute",
          left: 960 - r,
          top: 780 - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          border: `2px solid ${P.line}`,
          opacity: 0.55 - i * 0.14,
        }}
      />
    ))}

    {/* 顶部钩子 */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", fontSize: 62, fontWeight: 900, color: P.ink, letterSpacing: 4 }}>
      这三种<span style={{ color: P.coral }}>爽</span>，是<span style={{ color: P.mint, textShadow: glow(P.mint, 1.2) }}>同一种爽</span>
    </div>

    {/* 三联画面卡：游戏 / 考试 / 开车 */}
    {[
      { x: 260, emoji: "🎮", bars: [0.9, 0.55], tag: "打游戏" },
      { x: 770, emoji: "📝", bars: [0.75, 0.9, 0.4], tag: "考试" },
      { x: 1280, emoji: "🚗", bars: [0.85, 0.5], tag: "开车" },
    ].map((c, i) => (
      <div
        key={c.tag}
        style={{
          position: "absolute",
          left: c.x,
          top: 220,
          width: 380,
          height: 400,
          borderRadius: 30,
          background: P.glass,
          border: `3px solid ${i === 1 ? P.mint : P.line}`,
          boxShadow: i === 1 ? `0 0 60px ${P.mint}55` : "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
        }}
      >
        <div style={{ fontSize: 150, lineHeight: 1 }}>{c.emoji}</div>
        <div style={{ width: 240, display: "flex", flexDirection: "column", gap: 14 }}>
          {c.bars.map((w, j) => (
            <div key={j} style={{ height: 12, borderRadius: 6, background: P.line, overflow: "hidden" }}>
              <div style={{ width: `${w * 100}%`, height: "100%", background: `linear-gradient(90deg, ${P.mint}, ${P.gold})` }} />
            </div>
          ))}
        </div>
        <div style={{ fontSize: 34, fontWeight: 800, color: P.sub, letterSpacing: 6 }}>{c.tag}</div>
      </div>
    ))}
    {/* 卡片间隙的加号，暗示三者相加等于同一个东西 */}
    {[705, 1215].map((x) => (
      <div key={x} style={{ position: "absolute", left: x, top: 400, transform: "translate(-50%, -50%)", fontSize: 72, fontWeight: 900, color: P.mint, textShadow: glow(P.mint, 1.2) }}>
        +
      </div>
    ))}

    {/* 底部悬念句 + 角标 */}
    <div style={{ position: "absolute", left: 0, right: 0, top: 700, textAlign: "center", fontSize: 44, fontWeight: 800, color: P.sub, letterSpacing: 2 }}>
      你的大脑，早就告诉过你答案
    </div>
    <div
      style={{
        position: "absolute",
        right: 90,
        top: 76,
        padding: "12px 30px",
        borderRadius: 40,
        background: P.coral,
        color: P.abyss,
        fontSize: 40,
        fontWeight: 900,
      }}
    >
      看到最后揭晓
    </div>
    <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
      <polygon
        points={`0,1080 ${Array.from({ length: 49 }, (_, k) => `${k * 40},${960 + Math.sin(k * 0.25) * 16}`).join(" ")} 1920,1080`}
        fill={`${P.line}88`}
      />
    </svg>
  </AbsoluteFill>
);
