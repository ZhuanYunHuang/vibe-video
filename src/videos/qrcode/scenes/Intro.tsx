import React from "react";
import { interpolate } from "remotion";
import { CL, C, Center, FONT, hit, pop, SceneProps, useAt, useT } from "../../../shared";

const WORDS = [
  { text: "二维", k: 0, color: C.text },
  { text: "码", k: 1, color: C.text },
  { text: "会", k: 2, color: C.text },
  { text: "被", k: 3, color: C.text },
  { text: "用完", k: 4, color: C.text },
  { text: "吗", k: 5, color: C.yellow },
  { text: "？", k: 6, color: C.pink },
];

// 开场：逐拍砸字 → 主标题 → 渐变条
export const Intro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const titleAt = at(start, 7);
  const showTitle = t >= titleAt;
  const ts = pop(t, titleAt, 9);
  const barAt = at(start, 9);
  const subAt = at(start, 10);

  return (
    <Center>
      {!showTitle ? (
        <div style={{ display: "flex", gap: 26, fontSize: 110, fontWeight: 900 }}>
          {WORDS.map((w) => {
            const f = at(start, w.k);
            const s = pop(t, f, 10);
            return (
              <span
                key={w.text}
                style={{
                  color: w.color,
                  opacity: t >= f ? 1 : 0,
                  transform: `translateY(${(1 - s) * -120}px) scale(${1 + hit(t, f, 3) * 0.25})`,
                  display: "inline-block",
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", transform: `scale(${0.6 + ts * 0.4})`, opacity: ts }}>
          <div style={{ fontSize: 58, color: C.dim, fontWeight: 700, letterSpacing: 10 }}>每天都被扫无数次的方块</div>
          <div style={{ fontSize: 150, fontWeight: 900, marginTop: 14, fontFamily: FONT }}>
            二维码
            <span style={{ color: C.yellow }}>会被用完</span>
            <span
              style={{
                display: "inline-block",
                color: C.pink,
                transform: `scale(${1 + hit(t, titleAt + 6, 5) * 0.5}) rotate(${hit(t, titleAt + 6, 5) * 18}deg)`,
                opacity: t >= titleAt + 6 ? 1 : 0,
              }}
            >
              吗？
            </span>
          </div>
          <div
            style={{
              height: 10,
              margin: "24px auto 0",
              borderRadius: 5,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.pink}, ${C.yellow})`,
              width: `${interpolate(t, [barAt, barAt + 24], [0, 100], CL)}%`,
            }}
          />
          <div style={{ marginTop: 26, fontSize: 36, color: C.dim, opacity: pop(t, subAt, 12) }}>本期用「数学」回答你</div>
        </div>
      )}
    </Center>
  );
};
