import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash } from "../kit/Fx";
import { glow, P, useSec } from "../kit/theme";

// 第 10 幕（b272–尾）：整个 vs 半个 收束 → 背影走向本科校门 → 片名
export const Outro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const sec = useSec(start);

  const whole = sec(133.7);
  const half = sec(135.2);
  const leave = sec(138.6);
  const walkP = prog(t, leave, 90);
  const fade = interpolate(t, [sec(143.5), sec(146.5)], [0, 1], CL);
  const title = pop(t, sec(140.5), 14);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 远处的校门 */}
      <div style={{ position: "absolute", left: 660, top: 260, width: 600, height: 460, borderRadius: "300px 300px 0 0", border: `14px solid ${P.yellow}`, boxShadow: `0 0 60px ${P.yellow}, inset 0 0 60px ${P.yellow}55` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: FONT, fontSize: 70, fontWeight: 900, color: "#fff", textShadow: glow(P.yellow) }}>本 科</div>

      {t < leave ? (
        <>
          {[
            { at: whole, text: "我 · 整个", c: P.yellow, x: 520 },
            { at: half, text: "你 · 半个", c: P.sub, x: 1400 },
          ].map((it) => {
            const s = pop(t, it.at, 10);
            return (
              <div
                key={it.text}
                style={{
                  position: "absolute",
                  left: it.x,
                  top: 780,
                  transform: `translate(-50%, -50%) scale(${s})`,
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 110,
                  color: "#fff",
                  WebkitTextStroke: `4px ${it.c}`,
                  textShadow: glow(it.c, 1),
                }}
              >
                {it.text}
              </div>
            );
          })}
          <Dude x={960} y={1000} s={1.2} mood="smug" armR={140} />
        </>
      ) : (
        <Dude x={960} y={1000 - walkP * 260} s={1.2 - walkP * 0.75} back opacity={1 - walkP * 0.6} />
      )}

      {/* 片名 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 780,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 140,
          color: "#fff",
          WebkitTextStroke: `6px ${P.magenta}`,
          textShadow: glow(P.magenta, 1.4),
          opacity: title,
          transform: `scale(${0.7 + title * 0.3})`,
        }}
      >
        升本后醒来
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontFamily: FONT, fontSize: 40, color: P.sub, opacity: title }}>
        原曲 / 演唱：上饶天选之子 · CDC LIVE
      </div>
      <Flash t={t} at={leave} color={P.yellow} max={0.4} />
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: fade }} />
    </div>
  );
};
