import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash, shake, Shockwave } from "../kit/Fx";
import { glow, P, useSec } from "../kit/theme";
import { Bubble, Sign } from "../kit/ui";

// 第 6 幕（b128–160）：整个 vs 半个 → △144 撒西不理达纳 → 汽修二班 → 上岸了呢 → 「什么？」
export const Flex: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const sec = useSec(start);

  const whole = pop(t, sec(63.5), 11);
  const half = pop(t, sec(65.05), 11);
  const cut = prog(t, sec(65.6), 8);
  const sashi = sec(68.05); // 撒西不理达纳（△144 附近）
  const shop = sec(70.0); // 汽修二班
  const shopIn = pop(t, shop, 12);
  const brag = sec(72.0); // 我现在可是专升本上岸了呢
  const what = sec(75.35); // 什么？专升本上岸了
  const firstOut = interpolate(t, [sashi - 6, sashi], [1, 0], CL);

  return (
    <div style={{ position: "absolute", inset: 0, transform: shake(t, [sashi, what], 24) }}>
      {/* 整个 vs 半个：两张证书 */}
      {t < sashi ? (
        <div style={{ position: "absolute", inset: 0, opacity: firstOut }}>
          <div
            style={{
              position: "absolute",
              left: 300,
              top: 260,
              width: 560,
              height: 400,
              borderRadius: 20,
              background: "#c8102e",
              border: `8px solid ${P.yellow}`,
              boxShadow: `0 0 50px ${P.yellow}`,
              transform: `scale(${whole}) rotate(-5deg)`,
              textAlign: "center",
              fontFamily: FONT,
              color: P.yellow,
              paddingTop: 70,
            }}
          >
            <div style={{ fontSize: 90, fontWeight: 900 }}>整个</div>
            <div style={{ fontSize: 40, color: "#fff", marginTop: 30 }}>我的专升本</div>
          </div>
          <div style={{ position: "absolute", left: 1080, top: 260, width: 560, height: 400, transform: `scale(${half}) rotate(5deg)` }}>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: i * 280,
                  top: 0,
                  width: 280,
                  height: 400,
                  overflow: "hidden",
                  transform: `translate(${(i ? 1 : -1) * cut * 120}px, ${cut * (i ? 80 : -40)}px) rotate(${(i ? 1 : -1) * cut * 14}deg)`,
                  opacity: i === 1 ? 1 - cut * 0.7 : 1,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -i * 280,
                    width: 560,
                    height: 400,
                    borderRadius: 20,
                    background: "#3b4a7a",
                    border: `8px solid ${P.sub}`,
                    textAlign: "center",
                    fontFamily: FONT,
                    color: "#fff",
                    paddingTop: 70,
                  }}
                >
                  <div style={{ fontSize: 90, fontWeight: 900 }}>半个</div>
                  <div style={{ fontSize: 40, marginTop: 30 }}>你的专升本</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* 撒西不理达纳：日漫风大字 */}
      {t >= sashi && t < shop ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 200,
              textAlign: "center",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 150,
              color: "#fff",
              WebkitTextStroke: `6px ${P.magenta}`,
              textShadow: glow(P.magenta, 1.4),
              transform: `scale(${pop(t, sashi, 9)}) rotate(-3deg)`,
            }}
          >
            撒西不理达纳
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 400, textAlign: "center", fontFamily: FONT, fontSize: 56, color: P.sub, opacity: pop(t, sashi + at(start, 2), 12) }}>
            （久しぶりだな · 好久不见啊）
          </div>
          <Dude x={960} y={1000} s={1.1} mood="smug" glasses armR={120} armL={20} />
        </>
      ) : null}

      {/* 回到汽修二班 */}
      {t >= shop ? (
        <>
          <div style={{ opacity: shopIn, transform: `translateY(${(1 - shopIn) * -80}px)` }}>
            <Sign x={960} y={90} w={600} text="汽修二班" color={P.cyan} />
          </div>
          {/* 轮胎、扳手 */}
          <div style={{ position: "absolute", left: 160, top: 640, width: 260, height: 260, borderRadius: "50%", border: "46px solid #1d1d22", boxShadow: `0 0 0 6px ${P.line}`, opacity: shopIn }} />
          <div style={{ position: "absolute", left: 1560, top: 700, fontSize: 160, opacity: shopIn, transform: "rotate(-30deg)" }}>🔧</div>
          {[0, 1, 2].map((i) => (
            <Dude
              key={i}
              x={520 + i * 440 + (i === 1 ? 0 : 0)}
              y={1000}
              s={i === 1 ? 1.3 : 1.05}
              shirt={i === 1 ? "天选之子" : "汽修"}
              shirtColor={i === 1 ? P.shirt : "#3a4a3a"}
              mood={i === 1 ? (t >= brag ? "smug" : "cool") : t >= what ? "shock" : "sad"}
              armR={i === 1 && t >= brag ? 140 : 0}
              look={i === 0 ? 1 : i === 2 ? -1 : 0}
              opacity={shopIn}
            />
          ))}
          <Bubble t={t} from={brag} until={what} x={960} y={330} text="我现在可是上岸了呢～" color={P.yellow} />
          <Bubble t={t} from={what} x={520} y={420} text="什么？！" color="#fff" />
          <Bubble t={t} from={what + 4} x={1400} y={420} text="上岸了？！" color="#fff" />
        </>
      ) : null}

      <Shockwave t={t} at={sashi} color={P.magenta} />
      <Flash t={t} at={sashi} color={P.magenta} max={0.5} />
      <Flash t={t} at={what} max={0.6} />
    </div>
  );
};
