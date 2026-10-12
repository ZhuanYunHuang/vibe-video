import React from "react";
import { interpolate } from "remotion";
import { CL, C, Center, FONT, hit, pop, SceneProps, useAt, useT } from "../../../shared";

// 开场：逐拍砸字 → 主标题
export const Intro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const words = [
    { text: "你", k: 0, color: C.text },
    { text: "每天", k: 1, color: C.text },
    { text: "都在", k: 2, color: C.text },
    { text: "打开网页", k: 3, color: C.cyan },
  ];
  const titleAt = at(start, 4);
  const showTitle = t >= titleAt;
  const ts = pop(t, titleAt, 9);
  const qAt = at(start, 6);
  const q = hit(t, qAt, 5);

  return (
    <Center>
      {!showTitle ? (
        <div style={{ display: "flex", gap: 30, fontSize: 120, fontWeight: 900 }}>
          {words.map((w) => {
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
          <div style={{ fontSize: 64, color: C.dim, fontWeight: 700, letterSpacing: 8 }}>访问一个网页</div>
          <div style={{ fontSize: 150, fontWeight: 900, marginTop: 10, fontFamily: FONT }}>
            背后发生了
            <span style={{ color: C.yellow }}>多少事</span>
            <span
              style={{
                display: "inline-block",
                color: C.pink,
                transform: `scale(${1 + q * 0.6}) rotate(${q * 20}deg)`,
                opacity: t >= qAt ? 1 : 0,
              }}
            >
              ？
            </span>
          </div>
          <div
            style={{
              height: 10,
              margin: "20px auto 0",
              borderRadius: 5,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.pink}, ${C.yellow})`,
              width: `${interpolate(t, [titleAt, titleAt + 24], [0, 100], CL)}%`,
            }}
          />
        </div>
      )}
    </Center>
  );
};
