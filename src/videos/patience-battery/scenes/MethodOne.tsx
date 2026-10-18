import React from "react";
import { interpolate } from "remotion";
import { CL, ParticleField, SceneProps, hit, useAt, useT } from "../../../shared";
import { Badge, Battery, HomeExterior, Line, P, Stamp, Worker, glow } from "../kit";
import { T } from "../copy";

// 第 12 幕（b240–256）：方法① 进门前，先给自己 10 秒 ——「重来一次」印章 + 门口呼吸倒计时 + 电量回充 26 → 50
export const MethodOne: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const step = k(1) - k(0);
  const countIdx = Math.min(9, Math.max(0, Math.floor((t - k(4)) / step)));
  const counting = t >= k(4) && t < k(14);
  const n = 10 - countIdx;
  const nPop = hit(t, k(4) + countIdx * step, 4);

  const lvl = interpolate(t, [k(2), k(12), k(13)], [26, 26, 50], CL);
  const delta = t >= k(12) && t < k(14.5) ? { v: 24, at: k(12) } : undefined;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <HomeExterior t={t} light={0.9} parallax={0.55} />
      {/* 门口呼吸粒子 */}
      <ParticleField t={t} x={1100} y={420} w={380} h={540} n={16} color={P.amber} rise speed={0.7} size={6} seed={4} />

      <Badge t={t} from={k(0)} text={T.m1Badge} color={P.ok} />
      {/* 重来一次印章 */}
      <Stamp t={t} from={k(0.6)} text={T.replay} x={300} y={930} color={P.ok} rot={-9} size={56} />

      <div style={{ position: "absolute", left: 0, right: 0, top: 168, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 62, color: "#FFFFFF", textShadow: glow(P.night, 1.2) }}>
        {T.m1Title}
      </div>

      <Worker x={1180} y={965} s={0.95} mood={t >= k(12) ? "neutral" : "tired"} breathe={1} />
      <Battery t={t} x={1580} y={190} w={400} level={lvl} delta={delta} charging={t >= k(12)} />

      {/* 倒计时 */}
      {counting ? (
        <div
          style={{
            position: "absolute",
            left: 560,
            top: 490,
            transform: `translate(-50%, -50%) scale(${1 + nPop * 0.35})`,
            fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
            fontWeight: 900,
            fontSize: 240,
            color: "#FFFFFF",
            textShadow: glow(P.night, 1.6),
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {n}
        </div>
      ) : null}

      <Line t={t} from={k(14)} parts={[{ text: "把外面的情绪，" }, { text: "留在门外", color: P.ok, hi: true }]} size={52} />
    </div>
  );
};
