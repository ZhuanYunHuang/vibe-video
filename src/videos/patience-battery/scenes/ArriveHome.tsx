import React from "react";
import { interpolate } from "remotion";
import { CL, ParticleField, SceneProps, hit, useAt, useT } from "../../../shared";
import { Battery, Flash, HomeExterior, Line, P, Worker } from "../kit";

// 第 3 幕（b32–48）：终于……到家了 —— 不走位，他就站在门口：
// 站在门外先缓一下（捂脸）→ 抬头看门牌「家」→ 按门把 → 推门（暖光爆开）；电量 30 → 12
export const ArriveHome: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const X = 1180;
  const calm = t >= k(4) && t < k(9); // 捂脸缓一下
  const light = interpolate(t, [k(10), k(13), k(14.6), k(15.2)], [0.15, 0.55, 0.55, 1], CL);
  const lvl = interpolate(t, [k(2), k(14)], [30, 12], CL);

  const signPulse = hit(t, k(11), 6);
  const knobPulse = hit(t, k(13), 5);
  const doorBurst = hit(t, k(14.6), 4);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <HomeExterior t={t} light={light} parallax={0.6} />

      {/* 街道冷雾 */}
      <ParticleField t={t} x={0} y={700} w={1500} h={380} n={18} color="#7FA8D8" speed={0.5} size={6} drift={26} seed={3} />

      {/* 他脚下的路灯光 */}
      <div
        style={{
          position: "absolute",
          left: X - 240,
          top: 840,
          width: 480,
          height: 160,
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,217,138,0.16) 0%, transparent 70%)",
        }}
      />

      {/* k11：抬头看门牌「家」 */}
      {signPulse > 0.02 ? (
        <div
          style={{
            position: "absolute",
            left: 1130,
            top: 460,
            width: 200,
            height: 96,
            borderRadius: 16,
            border: `4px solid rgba(255,217,138,${signPulse * 0.85})`,
            boxShadow: `0 0 38px rgba(255,217,138,${signPulse * 0.7})`,
            transform: `scale(${0.96 + (1 - signPulse) * 0.14})`,
          }}
        />
      ) : null}

      {/* k13：手按门把 */}
      {knobPulse > 0.02 ? (
        <div
          style={{
            position: "absolute",
            left: 1342,
            top: 770,
            width: 90,
            height: 90,
            marginLeft: -45,
            marginTop: -45,
            borderRadius: 45,
            border: `5px solid rgba(245,197,66,${knobPulse * 0.9})`,
            transform: `scale(${1 + (1 - knobPulse) * 0.9})`,
            opacity: knobPulse,
          }}
        />
      ) : null}

      {/* k14：推门 → 暖光爆开 */}
      <Flash t={t} at={k(14.6)} color="#FFD98A" decay={5} max={0.42} />
      {doorBurst > 0.02 ? (
        <div
          style={{
            position: "absolute",
            left: 1290 - 420,
            top: 560,
            width: 840,
            height: 520,
            background: `radial-gradient(ellipse at 50% 46%, rgba(255,217,138,${doorBurst * 0.55}) 0%, transparent 68%)`,
          }}
        />
      ) : null}

      <Worker
        x={X}
        y={965}
        s={0.98}
        mood={calm ? "guilty" : t >= k(14) ? "smile" : "tired"}
        pose={calm ? "cover" : "stand"}
        view="front"
        breathe={0.9}
        tilt={calm ? 0 : t >= k(9) ? 2 : 0}
      />

      <Battery t={t} x={1560} y={190} w={480} level={lvl} delta={{ v: -18, at: k(14) }} />

      <Line t={t} from={k(2)} until={k(8.4)} y={830} parts={[{ text: "终于……", color: P.sub }, { text: "到家了", color: P.amber, hi: true }]} size={52} />
    </div>
  );
};
