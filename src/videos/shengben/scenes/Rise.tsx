import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, pop, SceneProps, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash, shake, Shockwave, SlamWord, Sparks, SpeedLines } from "../kit/Fx";
import { T } from "../kit/lyrics";
import { glow, P, useSec } from "../kit/theme";
import { FinalChorus } from "./Chorus";

// 间奏重击（音频起音峰实测）：drop 之后每 ≈0.73s 一记
const HITS = [114.82, 115.56, 116.29, 117.03, 117.76];
const HIT_WORDS = ["专", "升", "本", "上", "岸"];

// 第 9 幕（b224–272）：「我就忘专」→ 全曲唯一静音（屏息）→「咋地」砸下 → 紧接最强重拍 DROP → 间奏重击 → 终副歌
export const Rise: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const sec = useSec(start);

  const forget = sec(T.wangZhuan);
  const hush = sec(T.silence);
  const zadi = sec(T.zadi);
  const drop = sec(T.drop);
  const hits = HITS.map(sec);
  const chorus = sec(118.6);

  if (t >= chorus) return <FinalChorus start={start} />;

  // 静音段：画面逐渐压黑、主角定格，只剩一束顶光
  const dark = interpolate(t, [hush, hush + 8, zadi - 1, zadi], [0, 0.82, 0.82, 0.2], CL);
  const afterDrop = t >= drop;
  const beams = afterDrop ? 1 : 0;
  // 重击：每一记都让光束、主角弹一下
  let kick = hit(t, drop, 6);
  for (const h of hits) kick = Math.max(kick, hit(t, h, 5));
  const zoomIn = interpolate(t, [hush, zadi], [1, 1.12], CL);
  const zoomOut = afterDrop ? 1 + hit(t, drop, 7) * 0.12 : zoomIn;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `${shake(t, [zadi, drop, ...hits], 36)} scale(${zoomOut})` }}>
      {/* 舞台光束：DROP 瞬间全亮 */}
      {Array.from({ length: 9 }).map((_, i) => {
        const a = -44 + i * 11 + Math.sin((t + i * 20) / 14) * 7;
        const c = [P.cyan, P.magenta, P.yellow][i % 3];
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 960 - 60,
              top: -60,
              width: 120 + kick * 60,
              height: 1400,
              transformOrigin: "50% 0%",
              transform: `rotate(${a}deg)`,
              background: `linear-gradient(${c}dd, transparent 85%)`,
              opacity: beams * (0.45 + kick * 0.5),
              filter: "blur(6px)",
            }}
          />
        );
      })}

      {afterDrop ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 120,
            textAlign: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 140,
            color: "#fff",
            WebkitTextStroke: `5px ${P.cyan}`,
            textShadow: glow(P.cyan, 1.4 + kick),
            transform: `scale(${pop(t, drop, 9) * (1 + kick * 0.08)})`,
          }}
        >
          天选之子
        </div>
      ) : null}

      <Dude
        x={960}
        y={1000}
        s={1.5}
        glasses={t >= zadi}
        mood={t >= zadi ? "cool" : t >= hush ? "smug" : "laugh"}
        armR={t >= zadi ? 165 : t >= forget ? 120 : 60}
        armL={afterDrop ? 40 + kick * 60 : 0}
        jump={afterDrop ? kick * 70 : t < hush ? Math.abs(Math.sin((t - forget) / 5)) * 40 : 0}
        squat={t >= hush && t < zadi ? 0.25 : 0}
      />

      {/* 间奏重击：每一记砸一个霓虹字 */}
      {HIT_WORDS.map((w, i) => {
        const a = hits[i];
        if (t < a) return null;
        const s = pop(t, a, 9);
        return (
          <div
            key={w}
            style={{
              position: "absolute",
              left: 260 + i * 350,
              top: 560,
              transform: `translate(-50%, -50%) scale(${s * (1 + hit(t, a, 4) * 0.3)})`,
              fontFamily: FONT,
              fontSize: 160,
              fontWeight: 900,
              color: "#fff",
              WebkitTextStroke: `5px ${P.yellow}`,
              textShadow: glow(P.yellow, 1),
              opacity: 0.9,
            }}
          >
            {w}
          </div>
        );
      })}

      {/* 静音压黑（主角之外全部暗下去，只留顶光） */}
      <div
        style={{
          position: "absolute",
          inset: -200,
          background: `radial-gradient(ellipse 22% 60% at 50% 55%, transparent 0%, #000 70%)`,
          opacity: dark,
        }}
      />

      {/* 「我就忘专」 */}
      <SlamWord t={t} at={forget} text="我就忘专" color={P.yellow} size={220} y={250} until={hush} rotate={-3} />
      {/* 「咋地」：静音后第一声，砸满屏 */}
      <SlamWord t={t} at={zadi} text="咋地" color={P.red} size={480} y={420} until={drop + 10} rotate={-8} />
      <Flash t={t} at={zadi} color={P.red} max={0.55} decay={4} />

      {/* DROP：紧接「咋地」的最强重拍 */}
      <Flash t={t} at={drop} max={1} decay={7} />
      <Shockwave t={t} at={drop} color={P.yellow} rings={4} />
      <Shockwave t={t} at={drop + 3} color={P.magenta} rings={2} />
      <SpeedLines t={t} at={drop} color="#fff" dur={26} n={56} />
      <Sparks t={t} at={drop} y={420} n={70} power={1.8} />
      {hits.map((h) => (
        <React.Fragment key={h}>
          <Flash t={t} at={h} color={P.cyan} max={0.25} decay={4} />
          <Shockwave t={t} at={h} color={P.cyan} rings={1} />
        </React.Fragment>
      ))}
      <Flash t={t} at={forget} color={P.yellow} max={0.5} />
    </div>
  );
};
