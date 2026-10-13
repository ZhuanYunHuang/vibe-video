import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, pop, SceneProps, useAt, useT } from "../../../shared";
import { GRAD, P } from "../kit/theme";

const WORDS = [
  { text: "导航", k: 0, color: P.ink },
  { text: "怎么", k: 2, color: P.ink },
  { text: "规划", k: 4, color: P.ink },
  { text: "最优路线", k: 6, color: P.blue },
];

// 00 开场：逐拍砸字 → 主标题 + 蓝绿渐变条
export const Intro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  // 本幕 16 拍：每 2 拍砸一个词，第 8 拍（半句重音）合成主标题
  const titleAt = k(8);
  const ts = pop(t, titleAt, 9);
  const qAt = k(9);
  const q = hit(t, qAt, 5);
  const subAt = k(11);

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      {t < titleAt ? (
        <div style={{ display: "flex", gap: 30, fontSize: 120, fontWeight: 900 }}>
          {WORDS.map((w) => {
            const f = k(w.k);
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
          <div style={{ fontSize: 58, color: P.sub, fontWeight: 700, letterSpacing: 10 }}>你每天都在用的导航</div>
          <div style={{ fontSize: 150, fontWeight: 900, marginTop: 14, color: P.ink }}>
            怎么规划
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>最优路线</span>
            <span
              style={{
                display: "inline-block",
                color: P.teal,
                transform: `scale(${1 + q * 0.6}) rotate(${q * 20}deg)`,
                opacity: t >= qAt ? 1 : 0,
              }}
            >
              ？
            </span>
          </div>
          <div
            style={{
              height: 12,
              margin: "24px auto 0",
              borderRadius: 6,
              background: GRAD,
              width: `${interpolate(t, [titleAt, titleAt + 24], [0, 100], CL)}%`,
            }}
          />
          <div style={{ marginTop: 26, fontSize: 36, color: P.sub, opacity: pop(t, subAt, 12) }}>答案藏在一个 60 多年前的算法里</div>
        </div>
      )}
    </div>
  );
};
