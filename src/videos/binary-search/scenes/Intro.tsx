import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { P } from "../kit/theme";
import { Bubble, useBounce } from "../kit/ui";

const TITLE = ["二", "分", "查", "找"];

// 开场：小人从天而降，逐拍砸出标题
export const Intro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const bounce = useBounce();

  // 第 0 拍落地
  const drop = interpolate(t, [-10, 0], [900, 0], { ...CL, easing: (x) => x * x });
  const landSquash = t >= 0 ? Math.exp(-t / 4) * 0.9 : 0;
  const b = bounce(t, k(1), k(9), 60);
  const wave = t >= k(10) ? (Math.sin(((t - k(10)) / (k(1) || 1)) * Math.PI) + 1) / 2 : 0;
  const sub = pop(t, k(6), 14);

  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", gap: 18 }}>
        {TITLE.map((ch, i) => {
          const s = pop(t, k(1 + i), 10);
          return (
            <div
              key={ch}
              style={{
                fontFamily: FONT,
                fontSize: 180,
                fontWeight: 900,
                color: i < 2 ? P.clay : P.ink,
                opacity: Math.min(1, s * 1.4),
                transform: `translateY(${(1 - s) * -120}px) scale(${0.6 + s * 0.4})`,
              }}
            >
              {ch}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 400,
          textAlign: "center",
          fontFamily: MONO,
          fontSize: 44,
          letterSpacing: 10,
          color: P.sub,
          opacity: sub,
          transform: `translateY(${(1 - sub) * 20}px)`,
        }}
      >
        BINARY SEARCH
      </div>

      <Clawd
        x={960}
        y={900}
        u={22}
        mood={t < k(5) ? "normal" : "happy"}
        jump={drop + b.jump}
        squash={landSquash + b.squash}
        arm={wave}
        look={t < k(5) ? Math.sin(t / 14) * 0.6 : 0}
      />
      <Bubble t={t} from={k(10)} x={1290} y={700} text="用一次排队，讲清楚它" />
    </>
  );
};
