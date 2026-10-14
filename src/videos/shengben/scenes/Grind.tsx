import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash } from "../kit/Fx";
import { glow, P, useSec } from "../kit/theme";
import { Bubble } from "../kit/ui";

const FORMULAS = ["E=mc²", "F=ma", "H₂O", "sin²+cos²=1", "a²+b²=c²", "NaCl", "∫x dx", "v=s/t"];
const ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// 第 4 幕（b64–96）：同根生/滚开 → 没关系 → △80 数理化公式雨 → 26 个字母砸满屏
export const Grind: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const sec = useSec(start);

  const kick = sec(34.5); // 「专你就给我滚开」
  const kicked = prog(t, kick, 12);
  const formulaAt = k(16); // △80
  const abcAt = sec(45.2); // 26个字母
  const desk = pop(t, sec(36.25), 12);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* 同根生：一棵树两个枝 */}
      {t < sec(36.2) ? (
        <div style={{ position: "absolute", inset: 0, opacity: interpolate(t, [sec(35.8), sec(36.2)], [1, 0], CL) }}>
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
            <path d="M960 1000 L960 620 M960 700 Q800 600 700 420 M960 700 Q1120 600 1220 420" stroke={P.green} strokeWidth={22} fill="none" strokeLinecap="round" strokeDasharray={1200} strokeDashoffset={1200 * (1 - prog(t, 0, 16))} style={{ filter: `drop-shadow(0 0 14px ${P.green})` }} />
          </svg>
          <div style={{ position: "absolute", left: 660, top: 330, fontFamily: FONT, fontSize: 110, fontWeight: 900, color: P.cyan, textShadow: glow(P.cyan), opacity: pop(t, k(2), 12) }}>专</div>
          <div
            style={{
              position: "absolute",
              left: 1180,
              top: 330,
              fontFamily: FONT,
              fontSize: 110,
              fontWeight: 900,
              color: P.yellow,
              textShadow: glow(P.yellow),
              opacity: pop(t, k(2), 12) * (1 - kicked),
              transform: `translate(${kicked * 900}px, ${-kicked * 400}px) rotate(${kicked * 540}deg)`,
            }}
          >
            本
          </div>
          <Bubble t={t} from={kick} x={760} y={300} text="滚开！" color={P.red} />
        </div>
      ) : null}

      {/* 自习：书桌 */}
      {t >= sec(36.2) ? (
        <>
          <div
            style={{
              position: "absolute",
              left: 560,
              top: 760,
              width: 800,
              height: 40,
              borderRadius: 10,
              background: "#4b3a2a",
              boxShadow: `0 0 0 4px ${P.yellow}55`,
              transform: `scaleX(${desk})`,
            }}
          />
          <div style={{ position: "absolute", left: 700, top: 690, width: 220, height: 70, background: "#fff", transform: "skewX(-12deg)", border: `4px solid ${P.cyan}` }} />
          <div style={{ position: "absolute", left: 1000, top: 690, width: 220, height: 70, background: "#fff", transform: "skewX(12deg)", border: `4px solid ${P.cyan}` }} />
          <Dude x={960} y={760} s={1.1} mood={t >= sec(41.6) ? "angry" : "happy"} armL={70} armR={70 + Math.sin(t / 3) * 10} />
          <Bubble t={t} from={sec(37.8)} until={sec(40.6)} x={1360} y={380} text="本科不比专科差（的好的那种）" color="#fff" />
        </>
      ) : null}

      {/* △80：数理化公式雨 */}
      {t >= formulaAt
        ? FORMULAS.map((f, i) => {
            const d = t - formulaAt - i * 3;
            if (d < 0) return null;
            return (
              <div
                key={f}
                style={{
                  position: "absolute",
                  left: 120 + ((i * 233) % 1650),
                  top: -80 + d * 9 - (i % 3) * 60,
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 50 + (i % 3) * 14,
                  color: [P.cyan, P.magenta, P.yellow][i % 3],
                  textShadow: glow([P.cyan, P.magenta, P.yellow][i % 3], 0.6),
                  opacity: interpolate(t, [abcAt - 6, abcAt], [1, 0], CL),
                }}
              >
                {f}
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
          fontSize: 96,
          color: "#fff",
          textShadow: glow(P.yellow, 1),
          opacity: pop(t, sec(41.6), 12) * interpolate(t, [abcAt - 4, abcAt], [1, 0], CL),
        }}
      >
        数 · 理 · 化 · 走天下
      </div>

      {/* 26 个字母砸满屏 */}
      {t >= abcAt
        ? ABC.map((c, i) => {
            const s = pop(t, abcAt + i * 2, 10);
            const col = i % 9;
            const row = Math.floor(i / 9);
            return (
              <div
                key={c}
                style={{
                  position: "absolute",
                  left: 220 + col * 185,
                  top: 150 + row * 200,
                  fontFamily: MONO,
                  fontWeight: 900,
                  fontSize: 150,
                  color: "#fff",
                  WebkitTextStroke: `4px ${[P.cyan, P.magenta, P.yellow][i % 3]}`,
                  textShadow: glow([P.cyan, P.magenta, P.yellow][i % 3], 0.8),
                  transform: `translateY(${(1 - s) * -300}px) scale(${s})`,
                  opacity: Math.min(1, s * 2),
                }}
              >
                {c}
              </div>
            );
          })
        : null}
      <Flash t={t} at={formulaAt} color={P.yellow} max={0.35} />
      <Flash t={t} at={abcAt} color={P.cyan} max={0.4} />
    </div>
  );
};
