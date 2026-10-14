import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, pop, SceneProps, useT } from "../../../shared";
import { glow, P, useK } from "../kit/theme";
import { Burst, Icon, Ripple, Stage } from "../kit/ui";

// 拍 320~336 收尾：321 322（强拍）金句两行逐行砸入 / 328 三图标归位（带悬浮）
// 334 标题复现（水光呼吸）/ ★336 粒子+涟漪爆开收尾
export const Outro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const lines = [
    { text: "真正的快乐", b: 321, color: P.ink },
    { text: "来自全情投入的那一刻", b: 322, color: P.mint },
  ];
  const sink = interpolate(t, [K(332), K(334)], [0, 1], CL);

  return (
    <Stage t={t}>
      <Ripple t={t} x={960} y={500} froms={[K(321), K(322), K(336), K(336) + 3, K(336) + 6]} r0={170} gap={120} />
      <Burst t={t} from={K(336)} x={960} y={470} spread={420} size={15} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: FONT, opacity: 1 - sink, transform: `translateY(${-sink * 60}px)` }}>
        {lines.map((l) =>
          t >= K(l.b) ? (
            <div
              key={l.text}
              style={{
                fontSize: l.b === 321 ? 80 : 104,
                fontWeight: 900,
                color: l.color,
                marginTop: 20,
                textShadow: l.color === P.mint ? glow(P.mint, 1 + 0.3 * Math.sin(t / 20) + hit(t, K(l.b), 5)) : undefined,
                transform: `scale(${pop(t, K(l.b), 10)}) translateY(${Math.sin(t / 19 + l.b) * 6}px)`,
              }}
            >
              {l.text}
            </div>
          ) : null,
        )}
      </div>
      {t >= K(334) ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, textAlign: "center", fontFamily: FONT, transform: `scale(${pop(t, K(334), 10) * (1 + hit(t, K(336), 5) * 0.08)})` }}>
          <div style={{ fontSize: 160, fontWeight: 900, color: P.ink, letterSpacing: 10, textShadow: glow(P.mint, 1.1 + 0.4 * Math.sin(t / 18) + hit(t, K(336), 6) * 1.2) }}>
            心流<span style={{ color: P.mint }}>状态</span>
          </div>
          <div style={{ fontSize: 40, color: P.sub, marginTop: 10, letterSpacing: 8 }}>下次进入时，记得享受它</div>
        </div>
      ) : null}
      {[
        { e: "🎮", x: 700 },
        { e: "📝", x: 960 },
        { e: "🚗", x: 1220 },
      ].map((ic, i) => (
        <Icon key={ic.e} t={t} from={K(328) + i * 5} x={ic.x} y={830} emoji={ic.e} size={96} />
      ))}
    </Stage>
  );
};
