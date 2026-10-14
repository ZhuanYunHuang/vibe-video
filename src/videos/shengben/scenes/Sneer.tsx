import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash, shake, Shockwave, SlamWord, SpeedLines, Sparks } from "../kit/Fx";
import { glow, P, useSec } from "../kit/theme";
import { Bubble } from "../kit/ui";

// 第 2 幕（b32–48）：专本之墙 → 重拍②「狂」炸裂 → 本科生的眼神
export const Sneer: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const sec = useSec(start);
  const PUNCH = k(8); // b40「狂」

  const wall = interpolate(t, [-10, 4], [0, 1], CL);
  const wallBreak = prog(t, PUNCH, 10);
  // 本科生们从右侧排队登场，眼神扫过来
  const nerdIn = prog(t, sec(20.3), 12);
  const stare = t >= sec(20.45); // 别…别用那种眼神看着我
  const shrug = t >= sec(22.75) ? Math.sin(((t - sec(22.75)) / k(1)) * Math.PI) * 30 : 0; // 你叫本科生来

  return (
    <div style={{ position: "absolute", inset: 0, transform: shake(t, [PUNCH], 40) }}>
      {/* 中间的墙：专 | 本 */}
      <div
        style={{
          position: "absolute",
          left: 920,
          top: 160,
          width: 80,
          height: 820,
          background: `repeating-linear-gradient(0deg, #3a2f4f 0 60px, #2a2238 60px 66px)`,
          border: `4px solid ${P.magenta}`,
          boxShadow: `0 0 30px ${P.magenta}`,
          transform: `scaleY(${wall}) translateY(${wallBreak * 900}px) rotate(${wallBreak * 18}deg)`,
          transformOrigin: "50% 100%",
          opacity: 1 - wallBreak,
        }}
      />
      {(["专", "本"] as const).map((w, i) => {
        const s = pop(t, i * 4, 12);
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: i === 0 ? 420 : 1500,
              top: 180,
              transform: `translateX(-50%) scale(${s})`,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 200,
              color: "#fff",
              WebkitTextStroke: `6px ${i === 0 ? P.cyan : P.yellow}`,
              textShadow: glow(i === 0 ? P.cyan : P.yellow, 1.2),
              opacity: t < PUNCH ? 1 : 0.25,
            }}
          >
            {w}
          </div>
        );
      })}

      {/* 主角 */}
      <Dude
        x={t < PUNCH ? 420 : 760}
        y={980}
        s={1.25}
        mood={t >= sec(22.7) ? "smug" : t >= PUNCH ? "angry" : "cool"}
        glasses={t >= PUNCH && t < sec(20.5)}
        armR={t >= PUNCH && t < sec(20.5) ? 165 : 30 + shrug}
        armL={30 + shrug}
        jump={t >= PUNCH ? Math.exp(-(t - PUNCH) / 6) * 100 : 0}
        look={stare ? 1 : 0}
      />

      {/* 本科生们 */}
      {[0, 1, 2].map((i) => (
        <Dude
          key={i}
          x={1250 + i * 210 + (1 - nerdIn) * 900}
          y={980}
          s={1.05}
          nerd
          mood="smug"
          shirt="本科"
          shirtColor="#3b4a7a"
          look={-1}
          opacity={nerdIn}
        />
      ))}
      {/* 眼神射线 */}
      {stare && t < sec(22.7)
        ? [0, 1, 2].map((i) => {
            const p = prog(t, sec(20.5) + i * 3, 6);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 900,
                  top: 560 + i * 8,
                  width: (1250 + i * 210 - 900) * p,
                  height: 6,
                  marginLeft: (1250 + i * 210 - 900) * (1 - p),
                  background: `linear-gradient(90deg, transparent, ${P.red})`,
                  boxShadow: `0 0 16px ${P.red}`,
                }}
              />
            );
          })
        : null}
      <Bubble t={t} from={sec(22.7)} x={760} y={430} text="叫你们本科生来！" color={P.yellow} />

      {/* 重拍②：「狂」 */}
      <SpeedLines t={t} at={PUNCH} color={P.magenta} />
      <Shockwave t={t} at={PUNCH} color={P.magenta} />
      <Sparks t={t} at={PUNCH} y={460} power={1.3} />
      <SlamWord t={t} at={PUNCH} text="狂" color={P.magenta} size={620} until={sec(20.5)} rotate={-10} />
      <Flash t={t} at={PUNCH} color={P.magenta} max={0.8} />
      <Flash t={t} at={PUNCH} />
    </div>
  );
};
