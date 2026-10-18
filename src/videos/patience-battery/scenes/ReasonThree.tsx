import React from "react";
import { interpolate } from "remotion";
import { CL, SceneProps, hit, useAt, useT } from "../../../shared";
import { Badge, Bubble, ExpectBar, Line, Mom, P, Tag, Worker, glow, lightCool, vignette } from "../kit";
import { T } from "../copy";

// 第 8 幕（b160–192）：原因③ 越亲近，期待越高 —— 两根期待尺 + 一条「现实 60」虚线 + 情绪公式
// k16（176★）= 大卡点：公式砸入，−40 红字落地
export const ReasonThree: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const BAR_BOTTOM = 740;
  const BAR_H = 340;
  const realityY = BAR_BOTTOM - BAR_H * 0.6; // 现实 = 60
  const realSweep = interpolate(t, [k(8), k(9.5)], [0, 1], CL);
  const barsDim = t >= k(20) ? 0.28 : 1;
  const showFormula = t >= k(16) && t < k(24);
  const showGap = t >= k(16) && t < k(22);
  const shout = t >= k(20) && t < k(24);
  const formulaPop = hit(t, k(16), 5);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg, #101C3A 0%, #1B2C52 100%)" }}>
      <div style={{ position: "absolute", inset: 0, background: lightCool(0.2, "50%", "32%") }} />
      <Badge t={t} from={k(0)} text={T.r3Badge} color={P.blue} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 70, color: "#FFFFFF", textShadow: glow(P.blue, 1) }}>
        {T.r3Title}
      </div>

      {/* 两根期待尺（同一把尺：满格 100） */}
      <div style={{ position: "absolute", inset: 0, opacity: barsDim }}>
        <ExpectBar t={t} from={k(4)} x={560} y={BAR_BOTTOM} h={BAR_H} label={T.r3Outsider} target={100} value={30} color={P.cool} textColor="#E7EEF9" />
        <ExpectBar t={t} from={k(5)} x={1360} y={BAR_BOTTOM} h={BAR_H} label={T.r3Family} target={100} value={100} color={P.amber} textColor="#E7EEF9" />

        {/* 现实 60 虚线 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <line
            x1={340}
            y1={realityY}
            x2={340 + (1580 - 340) * realSweep}
            y2={realityY}
            stroke={P.warn}
            strokeWidth={5}
            strokeDasharray="18 14"
            opacity={0.95}
          />
        </svg>
        <Tag t={t} from={k(9)} until={k(15.5)} x={960} y={realityY} text="现实 60" color={P.warn} rot={-3} size={46} />
      </div>

      {/* 对外人：现实 > 期待 → +30 惊喜 */}
      <Tag t={t} from={k(10)} until={k(19.5)} x={560} y={880} text={T.r3Bonus} color={P.ok} rot={-5} size={44} />
      {/* 对家人：现实 < 期待 → 失望 */}
      <Tag t={t} from={k(14)} until={k(19.5)} x={1360} y={880} text="失望" color={P.warmRed} rot={4} size={44} />

      {/* 情绪公式（k16 砸入，取代现实标签） */}
      {showFormula ? (
        <div
          style={{
            position: "absolute",
            left: 960,
            top: realityY,
            transform: `translate(-50%, -50%) scale(${1 + formulaPop * 0.16}) rotate(${-2}deg)`,
            padding: "16px 44px",
            borderRadius: 18,
            border: `5px solid ${P.warn}`,
            background: "#FFFFFF",
            boxShadow: glow(P.warn, 1.1),
            fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
            fontWeight: 900,
            fontSize: 60,
            color: P.ink,
            whiteSpace: "nowrap",
          }}
        >
          {T.r3Formula}
        </div>
      ) : null}

      {/* −40 红字 */}
      {showGap ? (
        <div
          style={{
            position: "absolute",
            left: 1620,
            top: realityY + 6,
            transform: `translate(-50%, -50%) scale(${0.8 + hit(t, k(16), 5) * 0.4}) rotate(6deg)`,
            fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
            fontWeight: 900,
            fontSize: 150,
            color: P.warmRed,
            textShadow: glow(P.warmRed, 1.4),
            whiteSpace: "nowrap",
          }}
        >
          {T.r3Gap}
        </div>
      ) : null}

      {/* 读心术对峙 */}
      {shout ? (
        <>
          <Worker x={1150} y={1010} s={0.82} mood="burst" armR={120} flip />
          <Mom x={1650} y={1010} s={0.78} mood="worry" />
          <Bubble t={t} from={k(20)} until={k(23.4)} x={1150} y={620} text={T.r3Shout} tone="bad" size={46} tail="left" />
          <Tag t={t} from={k(21)} until={k(23.4)} x={1650} y={640} text="？？" color={P.dim} size={44} rot={8} />
        </>
      ) : null}

      <Line t={t} from={k(25)} until={k(28.4)} parts={[{ text: "可他们，不是" }, { text: "读心术大师", color: P.blue, hi: true }]} size={50} />
      <Line t={t} from={k(29)} parts={[{ text: "不说出口的期待，只会变成" }, { text: "失望", color: P.warmRed, hi: true }]} size={50} />
      <div style={{ position: "absolute", inset: 0, background: vignette(0.38), pointerEvents: "none" }} />
    </div>
  );
};
