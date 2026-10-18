import React from "react";
import { interpolate } from "remotion";
import { CL, SceneProps, prog, useAt, useT } from "../../../shared";
import { Badge, Line, P, Worker, glow, lightWarm, vignette } from "../kit";
import { T } from "../copy";

// 四个标签：先聚到脸前，k8 摘面具时一起被剥落飞走
const PeelTag: React.FC<{
  t: number;
  from: number;
  peelAt: number;
  ax: number;
  ay: number;
  cx: number;
  cy: number;
  text: string;
  color: string;
  rot: number;
}> = ({ t, from, peelAt, ax, ay, cx, cy, text, color, rot }) => {
  if (t < from) return null;
  const inP = prog(t, from, 9);
  const outP = prog(t, peelAt, 14);
  const x = ax + (cx - ax) * inP + (ax - cx) * outP * 1.5;
  const y = ay + (cy - ay) * inP + (ay - cy) * outP * 1.5;
  const o = Math.min(1, inP * 1.4) * (1 - outP);
  const sc = 0.8 + inP * 0.2;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${sc}) rotate(${rot + outP * 90}deg)`,
        opacity: o,
        padding: "8px 26px",
        borderRadius: 999,
        background: "#FFFFFF",
        border: `3.5px solid ${color}`,
        boxShadow: glow(color, 0.8),
        fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
        fontWeight: 900,
        fontSize: 40,
        whiteSpace: "nowrap",
        color,
      }}
    >
      {text}
    </div>
  );
};

// 第 9 幕（b192–208）：原因④ 在外面我们都戴着面具 —— 标签聚到面具上 → k8 摘下并剥落 → 暖光渗进家门
export const ReasonFour: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const unmasked = t >= k(8);
  const flyP = interpolate(t, [k(8), k(11.5)], [0, 1], CL);
  const maskX = 960 + flyP * 660;
  const maskY = 620 - flyP * 380;
  const maskRot = flyP * 170;
  const warmP = interpolate(t, [k(11), k(15)], [0, 1], CL);

  const tags = [
    { text: T.r4Tag1, ax: 400, ay: 300, cx: 800, cy: 548, rot: -8, c: P.cool, from: k(2) },
    { text: T.r4Tag2, ax: 1520, ay: 296, cx: 1120, cy: 548, rot: 6, c: P.cool, from: k(3) },
    { text: T.r4Tag3, ax: 380, ay: 660, cx: 790, cy: 712, rot: 5, c: P.blue, from: k(4) },
    { text: T.r4Tag4, ax: 1540, ay: 668, cx: 1130, cy: 712, rot: -6, c: P.blue, from: k(5) },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: P.night }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 32% 58% at 50% 52%, rgba(255,243,214,0.16) 0%, transparent 72%)` }} />
      <Badge t={t} from={k(0)} text={T.r4Badge} color={P.cool} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 168, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 70, color: "#FFFFFF", textShadow: glow(P.cool, 1) }}>
        {T.r4Title}
      </div>

      {tags.map((tg, i) => (
        <PeelTag key={i} t={t} from={tg.from} peelAt={k(8)} ax={tg.ax} ay={tg.ay} cx={tg.cx} cy={tg.cy} text={tg.text} color={tg.c} rot={tg.rot} />
      ))}

      {/* 主角：先戴面具，k8 摘下 */}
      <Worker x={960} y={920} s={1.05} mood={unmasked ? "tired" : "smile"} mask={!unmasked} breathe={0.8} pose={unmasked ? "cover" : "stand"} />

      {/* 被摘下的笑脸面具 */}
      {unmasked ? (
        <div
          style={{
            position: "absolute",
            left: maskX,
            top: maskY,
            transform: `translate(-50%, -50%) rotate(${maskRot}deg)`,
            opacity: 1 - flyP,
          }}
        >
          <svg width={130} height={140} viewBox="0 0 110 120">
            <rect x={8} y={8} width={94} height={104} rx={18} fill="#f2f7ff" opacity={0.94} />
            <path d="M28 52 Q34 40 40 52" stroke={P.orange} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M70 52 Q76 40 82 52" stroke={P.orange} strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M28 78 Q55 100 82 78" stroke={P.orange} strokeWidth={7} fill="none" strokeLinecap="round" />
          </svg>
        </div>
      ) : null}

      {/* 暖光从家门口渗入 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(270deg, rgba(255,217,138,${0.22 * warmP}) 0%, rgba(255,138,61,${0.12 * warmP}) 28%, transparent 62%)`,
        }}
      />
      {warmP > 0.05 ? <div style={{ position: "absolute", inset: 0, background: lightWarm(0.2 * warmP, "84%", "48%") }} /> : null}

      <Line t={t} from={k(10)} until={k(12)} parts={T.r4Off} size={50} />
      <Line t={t} from={k(12.6)} parts={[{ text: "家，是唯一" }, { text: "不用演戏", color: P.amber, hi: true }, { text: "的地方" }]} size={52} />
      <div style={{ position: "absolute", inset: 0, background: vignette(0.36), pointerEvents: "none" }} />
    </div>
  );
};
