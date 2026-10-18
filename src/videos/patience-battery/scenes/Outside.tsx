import React from "react";
import { interpolate } from "remotion";
import { CL, ParticleField, SceneProps, hit, useAt, useT } from "../../../shared";
import { Battery, Bubble, Extra, Flash, Line, NightCity, P, Worker } from "../kit";
import { T } from "../copy";

// 第 1 幕（b0–32，全片开场）：在外面 —— 全片不走位，正面朝镜头站着。
// 依次向 3 个同事赔笑问候，每问候完一个，电量就掉一格（92 → 78 → 62 → 44 → 30）。
// 问候 1 还戴着笑脸面具，之后懒得戴；主角表情随电量递进：真心笑 → 礼貌笑 → 面无表情 → 皱眉 → 疲态 → 垂眼。
export const Outside: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const GROUND = 982; // 同一条地平线
  const HERO_X = 430;
  const NPC = [
    { hue: "teal" as const, x: 780 },
    { hue: "purple" as const, x: 1120 },
    { hue: "blue" as const, x: 1460 },
  ];

  // 三轮问候：各有一段窗口（点头 + 赔笑台词），结束后掉电
  const greet = [
    { from: k(2), to: k(7.6), drop: k(8), v: -14 },
    { from: k(9.6), to: k(15.6), drop: k(16), v: -16 }, // 第二次扣电正好落在 k16（16★）
    { from: k(17.6), to: k(23.6), drop: k(24), v: -18 },
  ];
  const lastDrop = k(30.2);
  const inGreet = (i: number) => t >= greet[i].from && t < greet[i].to;
  const greet1 = inGreet(0);
  const waving = greet.some((g) => t >= g.from && t < g.from + 20); // 抬手示意（不走路）

  const lvl = interpolate(
    t,
    [k(1.4), k(7.6), k(8), k(15.6), k(16), k(23.6), k(24), k(30), lastDrop],
    [92, 92, 78, 78, 62, 62, 44, 44, 30],
    CL,
  );
  const delta = t >= k(30.4) ? { v: -14, at: lastDrop } : t >= k(24.2) ? { v: -18, at: k(24) } : t >= k(16.2) ? { v: -16, at: k(16) } : t >= k(8.2) ? { v: -14, at: k(8) } : undefined;
  const bump = Math.max(hit(t, k(8), 5), hit(t, k(16), 5), hit(t, k(24), 5), hit(t, lastDrop, 5));

  const moodFor = (lv: number) =>
    lv >= 80 ? "smile" : lv >= 66 ? "warm" : lv >= 53 ? "neutral" : lv >= 46 ? "worry" : lv >= 38 ? "tired" : "guilty";
  const heroMood = greet1 ? "smile" : moodFor(lvl);

  const bubbles = [
    { text: T.ok1, on: inGreet(0), from: k(2.4), until: k(7.2), x: (HERO_X + NPC[0].x) / 2 },
    { text: T.ok2, on: inGreet(1), from: k(10), until: k(15.2), x: (HERO_X + NPC[1].x) / 2 },
    { text: T.ok3, on: inGreet(2), from: k(18), until: k(23.2), x: (HERO_X + NPC[2].x) / 2 },
  ];

  // 同事退场：只淡出，不走位
  const npcO = (i: number) => {
    const d = k(25.5 + i * 1.2);
    return t >= d ? 1 - interpolate(t, [d, d + 14], [0, 1], CL) : 1;
  };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <NightCity t={t} parallax={0.6} />

      {/* 他脚下的路灯光 */}
      <div
        style={{
          position: "absolute",
          left: HERO_X - 250,
          top: 836,
          width: 500,
          height: 170,
          background: "radial-gradient(ellipse at 50% 50%, rgba(255,217,138,0.20) 0%, transparent 70%)",
        }}
      />

      <ParticleField t={t} x={0} y={300} w={1920} h={700} n={22} color="#9FD8E8" speed={0.35} size={5} drift={30} seed={9} />

      {/* 三个同事：正面站着；被问候时点头微笑，最后依次淡出 */}
      {NPC.map((n, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${1 + hit(t, greet[i].from, 4) * 0.05})`,
            transformOrigin: `${n.x}px ${GROUND}px`,
            opacity: npcO(i),
          }}
        >
          <Extra
            x={n.x}
            y={GROUND}
            s={0.94}
            hue={n.hue}
            mood={inGreet(i) ? "smile" : "neutral"}
            pose="stand"
            view="front"
            tilt={inGreet(i) ? -3 : 0}
            breathe={inGreet(i) ? 1.5 : 0.5}
          />
        </div>
      ))}

      {/* 主角：正面站着，问候 1 还戴面具，之后露出真实表情（随电量变差） */}
      <Worker
        x={HERO_X}
        y={GROUND}
        s={1}
        mood={heroMood}
        mask={greet1}
        pose="stand"
        view="front"
        armR={waving ? 52 : 0}
        breathe={0.7}
        tilt={greet1 ? 0 : t >= k(26) ? 3 : 0}
      />

      {/* 电量 HUD：每次扣电回弹一下 */}
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + bump * 0.028})`, transformOrigin: "1530px 190px" }}>
        <Battery t={t} x={1530} y={190} w={460} level={lvl} delta={delta} />
      </div>

      {/* 赔笑台词 */}
      {bubbles.map((b, i) => (b.on ? <Bubble key={i} t={t} from={b.from} until={b.until} x={b.x} y={430} text={b.text} tone="cool" size={46} tail="left" /> : null))}

      {/* 四次扣电的冲击 */}
      <Flash t={t} at={k(16)} color={P.magenta} decay={6} max={0.24} />
      <Flash t={t} at={k(8)} color={P.magenta} decay={6} max={0.18} />
      <Flash t={t} at={k(24)} color={P.magenta} decay={6} max={0.18} />
      <Flash t={t} at={lastDrop} color={P.magenta} decay={6} max={0.18} />

      <Line t={t} from={k(25.2)} until={k(28.6)} parts={T.maskOn} size={48} />
      <Line t={t} from={k(30.6)} parts={T.maskOut} size={48} />
    </div>
  );
};
