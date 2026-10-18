import React from "react";
import { interpolate } from "remotion";
import { CL, SceneProps, hit, useAt, useT } from "../../../shared";
import { Badge, Battery, Bubble, Extra, Line, LivingRoom, Mom, NightCity, P, Stamp, Worker, glow } from "../kit";
import { T } from "../copy";

// 第 14 幕（b272–288）：方法③ 把客气，也分一点给家人 ——「重来一次」：冷暖分屏 → 同桌的暖光
export const MethodThree: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const split = t < k(8);
  const heartP = split ? 1 + hit(t, k(6), 6) * 0.4 : 0;
  const heartBeat = split ? 1 + 0.06 * Math.sin(t / 5) : 0;
  const lvl = interpolate(t, [k(8), k(12.5)], [62, 74], CL);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {split ? (
        <>
          {/* 左：外面（冷） */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
              <NightCity t={t} starfield={false} parallax={0.5} vig={0.2} />
              <Worker x={620} y={900} s={0.72} mood="smile" armR={50} />
              <Extra x={330} y={900} s={0.68} hue="teal" mood="smile" />
            </div>
            <div style={{ position: "absolute", inset: 0, background: "rgba(5,7,15,0.35)" }} />
            <div style={{ position: "absolute", left: 480, top: 120, transform: "translateX(-50%)", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 60, color: P.cool, textShadow: glow(P.cool, 1), letterSpacing: 12 }}>
              {T.outSide}
            </div>
          </div>
          {/* 右：家（暖） */}
          <div style={{ position: "absolute", left: 960, top: 0, width: 960, height: 1080, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: -960, top: 0, width: 1920, height: 1080 }}>
              <LivingRoom t={t} dishes steam clock={[19, 0]} parallax={0.5} vig={0.2} />
              <Mom x={1500} y={960} s={0.8} mood="warm" />
            </div>
            <div style={{ position: "absolute", left: 480, top: 120, transform: "translateX(-50%)", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 60, color: P.amber, textShadow: glow(P.amber, 1), letterSpacing: 12 }}>
              {T.atHome}
            </div>
          </div>
          {/* 中缝光带 */}
          <div style={{ position: "absolute", left: 958, top: 0, bottom: 0, width: 5, background: `linear-gradient(180deg, ${P.cool}, ${P.amber})`, boxShadow: `0 0 22px ${P.amber}88` }} />
          {/* 心 */}
          <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%, -50%) scale(${heartP * heartBeat || heartP})` }}>
            <svg width={120} height={110} viewBox="0 0 120 110">
              <path d="M60 98 C20 66 6 44 14 26 C22 8 46 6 60 26 C74 6 98 8 106 26 C114 44 100 66 60 98 Z" fill="rgba(232,86,75,0.25)" stroke={P.warmRed} strokeWidth={5} style={{ filter: "drop-shadow(0 4px 0 rgba(42,46,58,0.12))" }} />
            </svg>
          </div>
          <Badge t={t} from={k(0)} text={T.m3Badge} color={P.amber} x={120} y={210} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 286, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 64, color: P.ink, textShadow: glow(P.amber, 0.8) }}>
            {T.m3Title}
          </div>
        </>
      ) : (
        <>
          {/* 全屏暖：一家人同桌 */}
          <LivingRoom t={t} dishes steam clock={[19, 0]} parallax={0.5} />
          <Badge t={t} from={k(8)} text={T.m3Badge} color={P.amber} />
          <Stamp t={t} from={k(0.5)} text={T.replay} x={1640} y={930} color={P.amber} rot={-9} size={52} />
          <Worker x={1330} y={965} s={0.95} mood="smile" breathe={0.8} flip />
          <Mom x={560} y={968} s={0.95} mood="warm" armL={t >= k(10) && t < k(12.5) ? 100 : 0} breathe={0.8} dish />
          <Battery t={t} x={1580} y={150} w={420} level={lvl} delta={{ v: 12, at: k(12.5) }} charging />
          <Bubble t={t} from={k(10)} until={k(14)} x={560} y={600} text={T.momCare} tone="warm" size={46} tail="right" />
          <Line t={t} from={k(12.6)} parts={[{ text: "最亲近的人，" }, { text: "更值得被温柔以待", color: P.amber, hi: true }]} size={52} />
        </>
      )}
    </div>
  );
};
