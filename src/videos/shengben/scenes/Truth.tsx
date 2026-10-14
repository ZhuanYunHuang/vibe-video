import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash, shake, Shockwave, SlamWord, Sparks } from "../kit/Fx";
import { glow, P, useSec } from "../kit/theme";
import { Bubble, Sign } from "../kit/ui";

// 第 8 幕（b192–224）：不忘本也不忘专 → 夜路 → △208 不会修车 → 其实不来自汽修二班 → 「骗你的」
export const Truth: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const sec = useSec(start);

  const both = pop(t, sec(94.6), 11); // 我不忘本也不忘专
  const you = sec(96.5); // 我只要有你在的大专
  const car = sec(98.85); // 我不会修汽车
  const notFrom = sec(103.15); // 额…其实我就不来自汽修的二班
  const lie = sec(108.35); // 我前面全都是骗你的
  const walk = interpolate(t, [you, notFrom], [380, 1500], CL);
  const signPeel = prog(t, notFrom + 10, 12);
  const night = t < lie;

  return (
    <div style={{ position: "absolute", inset: 0, transform: shake(t, [lie], 34) }}>
      {night ? (
        <>
          {/* 本 + 专 两颗心 */}
          {t < you ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 220, display: "flex", justifyContent: "center", gap: 120, transform: `scale(${both})` }}>
              {[
                { w: "本", c: P.yellow },
                { w: "专", c: P.cyan },
              ].map(({ w, c }) => (
                <div key={w} style={{ width: 300, height: 300, borderRadius: "50%", border: `10px solid ${c}`, boxShadow: `0 0 40px ${c}`, textAlign: "center", lineHeight: "280px", fontFamily: FONT, fontSize: 180, fontWeight: 900, color: "#fff", textShadow: glow(c) }}>
                  {w}
                </div>
              ))}
            </div>
          ) : null}
          {/* 夜路路灯 */}
          {t >= you
            ? Array.from({ length: 5 }).map((_, i) => {
                const x = 200 + i * 380;
                const on = interpolate(walk - x, [-200, 0, 300], [0.15, 1, 0.3], CL);
                return (
                  <div key={i} style={{ position: "absolute", left: x, top: 300 }}>
                    <div style={{ position: "absolute", left: -6, top: 0, width: 12, height: 640, background: "#2a3350" }} />
                    <div style={{ position: "absolute", left: -40, top: -20, width: 80, height: 30, borderRadius: 14, background: P.yellow, opacity: on, boxShadow: `0 0 50px ${P.yellow}` }} />
                    <div style={{ position: "absolute", left: -200, top: 10, width: 400, height: 640, background: `radial-gradient(ellipse at 50% 0%, ${P.yellow}55, transparent 70%)`, opacity: on }} />
                  </div>
                );
              })
            : null}
          {t >= you ? (
            <Dude x={walk} y={960} s={1.05} mood={t >= notFrom ? "smug" : t >= car ? "happy" : "cool"} tilt={Math.sin(t / 4) * 3} armR={t >= car && t < notFrom ? 90 : 10} />
          ) : (
            <Dude x={960} y={1000} s={1.15} mood="happy" armL={120} armR={120} />
          )}
          <Bubble t={t} from={you} until={car} x={walk} y={480} text="我只要有你在的大专" color="#fff" />
          {t >= car && t < notFrom ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: FONT, fontSize: 90, fontWeight: 900, color: "#fff", textShadow: glow(P.green), transform: `scale(${pop(t, car, 11)})` }}>
              不会修车 🚗✖ 也不会完蛋
            </div>
          ) : null}
          {/* 汽修二班 牌子被撕掉 */}
          {t >= notFrom ? (
            <div style={{ transform: `translate(${signPeel * 600}px, ${signPeel * 700}px) rotate(${signPeel * 70}deg)`, opacity: 1 - signPeel * 0.8 }}>
              <Sign x={960} y={110} w={600} text="汽修二班" color={P.cyan} on={1 - signPeel} />
            </div>
          ) : null}
          <Bubble t={t} from={notFrom} until={lie} x={walk} y={480} text="额…其实我不来自汽修二班" color={P.yellow} />
        </>
      ) : (
        <>
          {/* 骗你的！（b224 ★ 切到下一幕接「我就忘专 咋地」） */}
          <Dude x={960} y={1000} s={1.45} mood="angry" armR={160} />
          <SlamWord t={t} at={lie} text="骗你的！" color={P.magenta} size={300} y={260} />
          <Sparks t={t} at={lie} y={300} power={1.4} />
          <Shockwave t={t} at={lie} color={P.magenta} />
        </>
      )}
      <Flash t={t} at={lie} max={0.95} />
    </div>
  );
};
