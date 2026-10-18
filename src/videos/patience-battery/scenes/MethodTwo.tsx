import React from "react";
import { interpolate } from "remotion";
import { CL, SceneProps, useAt, useT } from "../../../shared";
import { Badge, Battery, Bubble, Line, LivingRoom, Mom, P, Stamp, Worker, glow } from "../kit";
import { T } from "../copy";

// 第 13 幕（b256–272）：方法② 说出感受，而不是发脾气 ——「重来一次」：同一晚、同一张桌子，换一句话
export const MethodTwo: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const strikeP = interpolate(t, [k(5), k(6)], [0, 1], CL);
  const showBad = t >= k(4) && t < k(8);
  const showGood = t >= k(8);
  const lvl = interpolate(t, [k(8), k(11.5)], [50, 62], CL);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <LivingRoom t={t} dishes steam clock={[19, 30]} parallax={0.5} />
      <Badge t={t} from={k(0)} text={T.m2Badge} color={P.ok} />
      <Stamp t={t} from={k(0.4)} text={T.replay} x={280} y={930} color={P.ok} rot={-9} size={52} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 168, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 60, color: P.ink, textShadow: glow(P.ok, 0.8) }}>
        {T.m2Title}
      </div>

      {/* 人物 */}
      <Worker
        x={1430}
        y={965}
        s={0.95}
        mood={showBad ? "burst" : "neutral"}
        armL={showBad ? 130 : 0}
        armR={showBad ? 110 : 0}
        tilt={showBad ? -5 : 0}
        breathe={0.8}
        flip
      />
      <Mom x={480} y={968} s={0.95} mood={showGood ? "warm" : "worry"} armL={showGood && t >= k(13.5) ? 80 : 0} breathe={0.8} dish={!showGood} />

      {/* 电量：说出感受也在回充 */}
      <Battery t={t} x={1580} y={150} w={420} level={lvl} delta={{ v: 12, at: k(11.5) }} charging={t >= k(11)} />

      {/* ✗ 发脾气 */}
      {showBad ? (
        <>
          <Bubble t={t} from={k(4)} until={k(8)} x={1430} y={600} text={T.m2Bad} tone="bad" size={48} tail="left" />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <line
              x1={1180}
              y1={620}
              x2={1180 + strikeP * 560}
              y2={540}
              stroke={P.warmRed}
              strokeWidth={10}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 10px ${P.warmRed})` }}
            />
          </svg>
          <div style={{ position: "absolute", left: 1690, top: 430, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 90, color: P.warmRed, textShadow: glow(P.warmRed, 1) }}>✗</div>
        </>
      ) : null}

      {/* ✓ 说出感受 */}
      {showGood ? (
        <>
          <Bubble t={t} from={k(8)} until={k(13)} x={1430} y={600} text={T.m2Good} tone="good" size={46} tail="left" />
          <div style={{ position: "absolute", left: 1690, top: 430, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 90, color: P.ok, textShadow: glow(P.ok, 1) }}>✓</div>
        </>
      ) : null}
      <Bubble t={t} from={k(13.6)} x={480} y={600} text={T.momReply} tone="warm" size={46} tail="right" />

      <Line t={t} from={k(11.6)} until={k(14.4)} parts={[{ text: "说出「我累了」，" }, { text: "比摔门更有力量", color: P.ok, hi: true }]} size={50} />
    </div>
  );
};
