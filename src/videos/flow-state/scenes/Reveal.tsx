import React from "react";
import { FONT, hit, MONO, pop, prog, SceneProps, useT } from "../../../shared";
import { glow, P, useK } from "../kit/theme";
import { Burst, Chapter, GlassCard, Ripple, Slam, Stage, Sub, usePulse } from "../kit/ui";

// 拍 112~144 揭题（全片高光）：
//   113-117 涟漪酝酿 + 「这种感觉，有个名字」/ 118 Flow / 120★「心 流」逐字浮动+粒子爆出
//   124 人物卡 / △128 研究背景字幕 / 130 定义卡 / 136★ 1975 砸入 / 139-142 关键词点亮
export const Reveal: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const pulse = usePulse(start);
  const named = t >= K(118);
  const lift = prog(t, K(128), 14); // 大字上移让位给卡片
  const keys = [
    { text: "全神贯注", b: 136 },
    { text: "忘记自我", b: 139 },
    { text: "乐在其中", b: 142 },
  ];

  return (
    <Stage t={t}>
      <Chapter t={t} step="?" title="这种感觉，有个名字" color={P.gold} />
      <Ripple t={t} x={960} y={440} froms={[K(113), K(114), K(115), K(116), K(120), K(121)]} r0={150} gap={70} bright={named ? 1 : 0.5} />
      <Burst t={t} from={K(120)} x={960} y={520} spread={380} size={15} colors={[P.mint, "#fff", P.gold]} />

      {/* 揭题大字：逐字独立浮动 + 水光呼吸，128 拍后上移让位 */}
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${-lift * 150}px) scale(${1 - lift * 0.18})` }}>
        <Slam t={t} from={K(118)} x={960} y={400} size={92} color={P.sub}>
          <span style={{ display: "inline-block", transform: `translateY(${Math.sin(t / 16) * 6}px)` }}>Flow</span>
        </Slam>
        <Slam t={t} from={K(120)} x={960} y={520} size={170} color={P.mint} glowColor={P.mint}>
          {["心", "流"].map((c, i) => (
            <span
              key={c}
              style={{
                display: "inline-block",
                transform: `translateY(${Math.sin(t / 17 + i * 2.1) * 11}px)`,
                textShadow: glow(P.mint, 1.1 + 0.4 * Math.sin(t / 21 + i * 1.3) + pulse * 0.8),
              }}
            >
              {c}
            </span>
          ))}
        </Slam>
      </div>

      {/* △128 起逐步补全出处与定义 */}
      <GlassCard x={430} y={740} w={520} h={360} appear={named ? pop(t, K(124), 12) : 0} lit={hit(t, K(136), 8)}>
        <div style={{ fontSize: 100, lineHeight: 1, transform: `rotate(${Math.sin(t / 20) * 4}deg)` }}>🧑‍🔬</div>
        <div style={{ fontSize: 38, fontWeight: 900, marginTop: 18 }}>米哈里 · 契克森米哈赖</div>
        <div style={{ fontSize: 28, color: P.sub, marginTop: 8 }}>美国心理学家</div>
      </GlassCard>
      <GlassCard x={1330} y={740} w={900} h={360} appear={t >= K(130) ? pop(t, K(130), 12) : 0} lit={hit(t, K(130), 8)}>
        <div style={{ fontFamily: MONO, fontSize: 60, fontWeight: 900, color: P.gold, textShadow: glow(P.gold, 0.8 + pulse * 0.6), transform: `scale(${1 + hit(t, K(136), 5) * 0.2})` }}>
          <span style={{ fontFamily: FONT, fontSize: 36, color: P.sub, marginRight: 16 }}>提出于</span>1975
        </div>
        <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.5, marginTop: 14 }}>
          全身心投入一件事时，<span style={{ color: P.mint }}>意识和行动融为一体</span>
        </div>
        <div style={{ display: "flex", gap: 26, marginTop: 20 }}>
          {keys.map((k) => {
            const on = t >= K(k.b);
            return (
              <div
                key={k.text}
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  padding: "5px 22px",
                  borderRadius: 30,
                  border: `2px solid ${on ? P.gold : P.line}`,
                  color: on ? P.gold : P.sub,
                  transform: `translateY(${Math.sin(t / 19 + k.b) * 4}px) scale(${1 + hit(t, K(k.b), 4) * 0.25})`,
                  boxShadow: on ? `0 0 ${8 + hit(t, K(k.b), 5) * 20}px ${P.gold}55` : undefined,
                }}
              >
                {k.text}
              </div>
            );
          })}
        </div>
      </GlassCard>

      <Sub t={t} from={K(113)} to={K(120)} text="刚才那三种「忘我」，被同一个人研究透了" color={P.sub} />
      <Sub t={t} from={K(136)} to={K(144)} text="它不是玄学，是被写了 40 年的科学概念" />
    </Stage>
  );
};
