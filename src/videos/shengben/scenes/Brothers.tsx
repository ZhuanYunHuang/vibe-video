import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash, shake, Shockwave, SlamWord } from "../kit/Fx";
import { glow, P, useSec } from "../kit/theme";

// 第 3 幕（b48–64）：本科生看见我 → 重拍③「唉」炸裂 → 秒变兄弟 → 纸巾品牌
export const Brothers: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const sec = useSec(start);
  const PUNCH = k(8); // b56「唉」

  // 「唉」之前：对峙；之后：勾肩搭背
  const hug = prog(t, sec(28.7), 10);
  const gray = interpolate(t, [PUNCH, PUNCH + 2, sec(28.6), sec(28.9)], [0, 1, 1, 0], CL);
  const hearts = t >= sec(28.9) ? (t - sec(28.9)) : -1;
  const tissue = pop(t, sec(30.1), 11);

  return (
    <div style={{ position: "absolute", inset: 0, transform: shake(t, [PUNCH], 26) }}>
      <div style={{ position: "absolute", inset: 0, filter: gray > 0 ? `grayscale(${gray}) blur(${gray * 4}px)` : undefined }}>
        <Dude x={760 - hug * 120} y={980} s={1.25} mood={t >= sec(28.7) ? "laugh" : t >= PUNCH ? "sad" : "cool"} armR={hug * 120} />
        <Dude
          x={1260 - hug * 300}
          y={980}
          s={1.15}
          nerd
          shirt="本科"
          shirtColor="#3b4a7a"
          mood={t >= sec(28.7) ? "laugh" : t >= sec(25.6) ? "shock" : "smug"}
          armL={hug * 120}
          look={-1}
        />
        {/* 爱心 */}
        {hearts >= 0
          ? Array.from({ length: 8 }).map((_, i) => {
              const d = hearts - i * 4;
              if (d < 0) return null;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 820 + Math.sin(i * 1.7) * 180,
                    top: 420 - d * 5,
                    fontSize: 60 + (i % 3) * 20,
                    color: i % 2 ? P.magenta : P.red,
                    opacity: interpolate(d, [0, 40, 70], [1, 1, 0], CL),
                    textShadow: glow(P.magenta, 0.6),
                  }}
                >
                  ♥
                </div>
              );
            })
          : null}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 110,
            textAlign: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 110,
            color: "#fff",
            WebkitTextStroke: `5px ${P.green}`,
            textShadow: glow(P.green),
            opacity: pop(t, sec(28.7), 12),
          }}
        >
          亲如兄弟
        </div>

        {/* 纸巾品牌梗 */}
        {t >= sec(30.1) ? (
          <div
            style={{
              position: "absolute",
              left: 1460,
              top: 520,
              width: 300,
              height: 190,
              borderRadius: 18,
              background: "#fff",
              border: `6px solid ${P.cyan}`,
              boxShadow: `0 0 30px ${P.cyan}`,
              transform: `scale(${tissue}) rotate(8deg)`,
              fontFamily: FONT,
              textAlign: "center",
              paddingTop: 28,
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 900, color: "#111" }}>心相印</div>
            <div style={{ fontSize: 26, color: "#555", marginTop: 10 }}>裤兜里的品牌</div>
            <div style={{ fontSize: 22, color: "#888", marginTop: 6 }}>（真的是个品牌）</div>
          </div>
        ) : null}
      </div>

      {/* 重拍③：「唉」 */}
      <Shockwave t={t} at={PUNCH} color={P.ink} rings={2} />
      <SlamWord t={t} at={PUNCH} text="唉" color={P.sub} size={560} until={sec(28.6)} rotate={4} />
      <Flash t={t} at={PUNCH} color="#cfd8ea" max={0.9} />
    </div>
  );
};
