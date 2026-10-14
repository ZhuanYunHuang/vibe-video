import React from "react";
import { Easing, interpolate } from "remotion";
import { CL, FONT, hit, pop, SceneProps, useT } from "../../../shared";
import { P, glow, useK } from "../kit/theme";
import { Burst, Ripple, Slam, Stage, Sub, usePulse } from "../kit/ui";

const ease = Easing.bezier(0.7, 0, 0.2, 1);

// 拍 96~112 共同点提问：
//   97-99 三图标逐个就位（带自转+悬浮）/ 100★ 三条共性逐拍点亮 / 104-106 汇聚
//   109·110★「共同点 / 是什么？」双击砸入 + 粒子
export const Common: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const pulse = usePulse(start);
  const icons = [
    { emoji: "🎮", x: 480 },
    { emoji: "📝", x: 960 },
    { emoji: "🚗", x: 1440 },
  ];
  const merge = ease(interpolate(t, [K(104), K(106)], [0, 1], CL));
  const traits = [
    { text: "时间消失", b: 100 },
    { text: "杂念消失", b: 101 },
    { text: "做得特别顺", b: 102 },
  ];

  return (
    <Stage t={t}>
      <Ripple t={t} x={960} y={420} froms={[K(106), K(108), K(110)]} r0={120} gap={80} />
      {icons.map((ic, i) => {
        const s = pop(t, K(97) + i * 5, 11);
        const x = ic.x + (960 - ic.x) * merge;
        return (
          <div
            key={ic.emoji}
            style={{
              position: "absolute",
              left: x,
              top: 420 + Math.sin(t / 15 + i * 2.2) * 12 * (1 - merge),
              fontSize: 150,
              lineHeight: 1,
              transform: `translate(-50%, -50%) rotate(${Math.sin(t / 12 + i * 1.4) * 7 * (1 - merge)}deg) scale(${s * (1 - merge * 0.35)})`,
              opacity: 1 - merge * 0.5 + (i === 1 ? merge * 0.5 : 0),
              filter: i === 1 && merge > 0.5 ? `drop-shadow(0 0 24px ${P.mint})` : undefined,
            }}
          >
            {ic.emoji}
          </div>
        );
      })}
      {traits.map((tr, i) =>
        t >= K(tr.b) && t < K(104) ? (
          <div
            key={tr.text}
            style={{
              position: "absolute",
              left: icons[i].x,
              top: 640,
              transform: `translate(-50%, -50%) scale(${pop(t, K(tr.b), 10) * (1 + hit(t, K(tr.b), 3) * 0.25)})`,
              opacity: 1 - merge,
              fontFamily: FONT,
              fontSize: 48,
              fontWeight: 800,
              color: P.mint,
            }}
          >
            {tr.text}
          </div>
        ) : null,
      )}
      <Burst t={t} from={K(110)} x={960} y={700} spread={300} size={13} />
      <Slam t={t} from={K(109)} x={960} y={700} size={120} color={P.ink}>
        共同点
        <span
          style={{
            color: P.gold,
            textShadow: glow(P.gold, 1 + hit(t, K(110), 5)),
            display: "inline-block",
            transform: `scale(${1 + hit(t, K(110), 5) * 0.25 + pulse * 0.03})`,
          }}
        >
          是什么？
        </span>
      </Slam>
      <Sub t={t} from={K(100)} to={K(104)} text="三件毫不相干的事，却是同一种感觉" color={P.sub} />
    </Stage>
  );
};
