import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { MEMBER_COLORS } from "../kit/Queue";
import { P } from "../kit/theme";
import { Bubble, useBounce, usePulse } from "../kit/ui";

const POINTS = [
  { no: "1", title: "先排好序", desc: "二分的前提：数据必须有序" },
  { no: "2", title: "每次问中间", desc: "一次比较，淘汰一半" },
  { no: "3", title: "O(log n)", desc: "10 亿个数，最多 30 次" },
];

// 08 结尾：三条要点 + 全员谢幕
export const Outro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const pulse = usePulse(start);
  const bounce = useBounce();

  const cardAt = (i: number) => k(2 + i * 4);
  const finalAt = k(16);
  const fin = pop(t, finalAt, 13);
  const castAt = k(22);
  const fadeOut = interpolate(t, [k(40), k(44)], [1, 0], CL);
  const cardsUp = interpolate(t, [finalAt - 4, finalAt + 8], [0, 1], { ...CL, easing: (x) => 1 - (1 - x) ** 3 });

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeOut }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120 - cardsUp * 40,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 56,
          fontWeight: 900,
          color: P.ink,
          opacity: pop(t, k(1), 14),
        }}
      >
        二分查找，记住三件事
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 250 - cardsUp * 60,
          display: "flex",
          justifyContent: "center",
          gap: 40,
          transform: `scale(${1 - cardsUp * 0.12})`,
        }}
      >
        {POINTS.map((p, i) => {
          const s = pop(t, cardAt(i), 12);
          return (
            <div
              key={p.no}
              style={{
                width: 460,
                padding: "30px 34px",
                borderRadius: 30,
                background: P.paper,
                border: `4px solid ${P.ink}`,
                boxShadow: `0 12px 0 ${P.ink}22`,
                opacity: Math.min(1, s * 1.4),
                transform: `translateY(${(1 - s) * 120}px) rotate(${(1 - s) * (i - 1) * 6}deg)`,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 18,
                  background: P.clay,
                  color: P.paper,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: MONO,
                  fontSize: 38,
                  fontWeight: 900,
                }}
              >
                {p.no}
              </div>
              <div style={{ marginTop: 18, fontFamily: i === 2 ? MONO : FONT, fontSize: 48, fontWeight: 900, color: P.ink }}>{p.title}</div>
              <div style={{ marginTop: 10, fontFamily: FONT, fontSize: 30, color: P.sub }}>{p.desc}</div>
            </div>
          );
        })}
      </div>

      {/* 收尾金句 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 600,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 64,
          fontWeight: 900,
          color: P.clay,
          opacity: fin,
          transform: `scale(${0.7 + fin * 0.3})`,
        }}
      >
        聪明的找法，是每一步都扔掉一半
      </div>

      {/* 全员谢幕：每拍一起跳 */}
      {Array.from({ length: 9 }, (_, i) => {
        const isHero = i === 4;
        const x = 960 + (i - 4) * 150;
        const enter = castAt + Math.round(Math.abs(i - 4) * k(1) * 0.5);
        const s = pop(t, enter, 12);
        const b = bounce(t, castAt + k(2), k(40), isHero ? 46 : 32);
        return (
          <Clawd
            key={i}
            x={x}
            y={980 + (1 - s) * 260}
            u={isHero ? 9 : 6}
            color={isHero ? P.clay : MEMBER_COLORS[i % MEMBER_COLORS.length]}
            mood={t >= castAt + k(2) ? "happy" : "normal"}
            jump={b.jump}
            squash={b.squash + pulse * 0.1}
            arm={t >= castAt + k(2) ? 1 : 0}
            armL={isHero && t >= castAt + k(2) ? 1 : 0}
            seed={i}
          />
        );
      })}
      <Bubble t={t} from={k(30)} to={k(39)} x={1110} y={860} text="下次找东西，记得先问中间！" size={30} />
    </div>
  );
};
