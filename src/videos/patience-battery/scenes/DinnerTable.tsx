import React from "react";
import { interpolate } from "remotion";
import { CL, SceneProps, hit, shake, useAt, useT } from "../../../shared";
import { Battery, Bubble, DoorSlam, Line, LivingRoom, Mom, P, SlamWord, Worker } from "../kit";
import { T } from "../copy";

// 第 4 幕（b64–80）：回到家 —— 妈妈开饭 → 主角从右侧进门 → 一句话不对摔门进房 →「砰」
// 全片最大卡点：震屏 + 冲击波 + 闪光，电量砸到 4%（耗尽）
export const DinnerTable: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 主角：不走位，就站在门口附近；k6 情绪起来 → k9 甩门进房（淡出）→ k10 摔门
  const WX = 1470;
  const exitFade = t >= k(9.1) ? interpolate(t, [k(9.1), k(9.7)], [1, 0], CL) : 1;
  const gone = t >= k(9.7);
  const momWave = t >= k(2) && t < k(6) ? 110 : 0;
  const lvl = interpolate(t, [k(4), k(10)], [12, 4], CL);
  // 进门脉冲（k0）与妈妈端菜上桌（k4）——补掉前两拍的空档
  const doorP = hit(t, k(0.4), 5);
  const dishP = interpolate(t, [k(4), k(5.4)], [0, 1], CL);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", transform: shake(t, [k(10)], 30) }}>
      <LivingRoom t={t} dishes steam clock={[19, 0]} parallax={0.5} />

      {/* 右侧的门（他进出的门） */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={1600} y={470} width={200} height={438} rx={8} fill={P.home2} />
        <rect x={1600} y={470} width={200} height={438} rx={8} fill="none" stroke="#B0763C" strokeWidth={8} />
        <rect x={1618} y={488} width={164} height={404} rx={6} fill="#8A5A3A" />
        <rect x={1642} y={524} width={116} height={130} rx={6} fill="#9C6B45" />
        <rect x={1642} y={686} width={116} height={170} rx={6} fill="#9C6B45" />
        <circle cx={1746} cy={710} r={9} fill="#F5C542" />
      </svg>

      {/* k0：他刚推门进来，门缝暖光脉冲 */}
      {doorP > 0.02 ? (
        <div
          style={{
            position: "absolute",
            left: 1600 - 160,
            top: 470,
            width: 400,
            height: 440,
            background: `radial-gradient(ellipse at 50% 50%, rgba(255,217,138,${doorP * 0.5}) 0%, transparent 68%)`,
          }}
        />
      ) : null}

      {/* k4：妈妈端上最后一盘菜 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${(1 - dishP) * 220} ${(1 - dishP) * -60})`} opacity={dishP}>
          <ellipse cx={760} cy={714} rx={58} ry={16} fill="#FFFDF6" stroke="#D8DEE9" strokeWidth={2.5} />
          <ellipse cx={760} cy={708} rx={44} ry={11} fill="#8FCB6B" />
        </g>
      </svg>

      {/* 妈妈 */}
      <Mom x={520} y={968} s={0.95} mood={t >= k(12) ? "sad" : t >= k(6) ? "worry" : "warm"} armL={momWave} breathe={0.8} dish={t < k(13.5)} />
      {/* 主角 */}
      {!gone ? (
        <Worker
          x={WX}
          y={965}
          s={0.95}
          mood={t >= k(6) ? "burst" : t >= k(4) ? "worry" : "tired"}
          pose="stand"
          view="front"
          tilt={t >= k(6) ? -4 : 0}
          breathe={0.8}
          opacity={exitFade}
        />
      ) : null}

      {/* 电量：砸到 4% 并出现裂纹 */}
      <Battery t={t} x={1530} y={140} w={460} level={lvl} cracked={lvl <= 6} delta={{ v: -8, at: k(10) }} />

      {/* 台词 */}
      <Bubble t={t} from={k(2)} until={k(7)} x={520} y={600} text={T.momCall} tone="warm" size={48} tail="left" />

      {/* 摔门 */}
      <DoorSlam t={t} at={k(10)} x={1700} />
      <SlamWord t={t} at={k(10)} text={T.slam} color={P.magenta} size={430} y={418} until={k(14)} rotate={-5} />
      <Line t={t} from={k(12.5)} parts={[{ text: "电量", color: P.sub }, { text: "耗尽", color: P.low, hi: true }]} size={50} />
    </div>
  );
};
