import React from "react";
import { SceneProps, shake, useAt, useT } from "../../../shared";
import { Badge, Break, Flash, Line, P, Tag, glow, lightCool, vignette } from "../kit";
import { T } from "../copy";

// 玻璃杯：crackAt 后被一指碰碎，碎片飞出
const GlassStation: React.FC<{ t: number; crackAt: number }> = ({ t, crackAt }) => {
  const d = t - crackAt;
  const broken = d >= 0;
  const shards = [
    { a: -60, r: 210 },
    { a: -20, r: 250 },
    { a: 25, r: 220 },
    { a: 70, r: 200 },
    { a: 130, r: 240 },
    { a: -130, r: 230 },
  ];
  return (
    <svg width={520} height={420} viewBox="-260 -210 520 420" style={{ position: "absolute", left: 520 - 260, top: 660 - 210, overflow: "visible" }}>
      {/* 玻璃杯（上宽下窄的直身杯） */}
      {!broken ? (
        <g>
          <path d="M-74 -120 L74 -120 L58 96 L-58 96 Z" fill="rgba(74,144,217,0.14)" stroke={P.cool} strokeWidth={6} strokeLinejoin="round" />
          <path d="M-70 -100 L70 -100 L56 72 L-56 72 Z" fill="rgba(159,216,232,0.18)" />
          <line x1={-66} y1={-40} x2={66} y2={-40} stroke={P.cool} strokeWidth={3} opacity={0.45} />
        </g>
      ) : (
        // 碎片
        shards.map((s, i) => {
          const rad = (s.a * Math.PI) / 180;
          const fly = Math.min(1, d / 22);
          const ox = Math.cos(rad) * s.r * fly;
          const oy = Math.sin(rad) * s.r * fly - 40 * fly;
          const rot = fly * (i % 2 ? 240 : -220);
          return (
            <path
              key={i}
              d="M-22 -30 L20 -38 L14 30 L-16 26 Z"
              fill="rgba(159,216,232,0.75)"
              stroke={P.cool}
              strokeWidth={4}
              transform={`translate(${ox} ${oy}) rotate(${rot}) scale(${Math.max(0.2, 1 - fly * 0.5)})`}
              opacity={1 - fly * 0.85}
            />
          );
        })
      )}
    </svg>
  );
};

// 橡皮筋：一次/二次/三次拉开（peg 间距递增），snapAt 断成两截飞出
const BandStation: React.FC<{ t: number; appearAt: number; snapAt: number }> = ({ t, appearAt, snapAt }) => {
  if (t < appearAt) return null;
  const stretchP = Math.max(0, Math.min(1, (t - appearAt) / Math.max(1, snapAt - appearAt)));
  const half = 200 + stretchP * 140; // 单侧半宽 200 → 340
  const cy = 660;
  const snapped = t >= snapAt;
  const fly = snapped ? Math.min(1, (t - snapAt) / 20) : 0;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      {/* 两端的钉子 */}
      {[-1, 1].map((s, i) => (
        <circle key={i} cx={1400 + s * (half + 26)} cy={cy} r={14} fill={P.amber} stroke="#C98A4B" strokeWidth={4} />
      ))}
      {!snapped ? (
        <path
          d={`M${1400 - half} ${cy} Q 1400 ${cy + 46 + stretchP * 30} ${1400 + half} ${cy}`}
          stroke={P.warmRed}
          strokeWidth={11}
          fill="none"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 12px ${P.warmRed}88)` }}
        />
      ) : (
        <g stroke={P.warmRed} strokeWidth={10} fill="none" strokeLinecap="round">
          <path
            d={`M${1400 - half} ${cy} Q ${1400 - half / 2} ${cy + 70} ${1400} ${cy}`}
            transform={`translate(${-fly * 300} ${-fly * 190}) rotate(${-fly * 200} 1400 ${cy})`}
            opacity={1 - fly * 0.8}
          />
          <path
            d={`M${1400 + half} ${cy} Q ${1400 + half / 2} ${cy + 70} ${1400} ${cy}`}
            transform={`translate(${fly * 300} ${-fly * 170}) rotate(${fly * 200} 1400 ${cy})`}
            opacity={1 - fly * 0.8}
          />
        </g>
      )}
    </svg>
  );
};

// 第 7 幕（b128–160）：原因② 笃定他们不会离开 —— 左边玻璃碰一下就碎，右边橡皮筋第三次被拉断
// k16（144 拍）= 大卡点：橡皮筋「啪」断 + 冲击波 + 震屏
export const ReasonTwo: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const harms = [
    { text: T.tagSlam, from: k(11), x: 560, rot: -5 },
    { text: T.tagTalk, from: k(12), x: 880, rot: 3 },
    { text: T.tagImp, from: k(13), x: 1220, rot: -4 },
    { text: T.tagCold, from: k(14), x: 1540, rot: 4 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg, #101C3A 0%, #1B2C52 100%)", transform: shake(t, [k(16)], 32) }}>
      <div style={{ position: "absolute", inset: 0, background: lightCool(0.2, "50%", "34%") }} />
      <Badge t={t} from={k(0)} text={T.r2Badge} color={P.magenta} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 158, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 70, color: "#FFFFFF", textShadow: glow(P.magenta, 1) }}>
        {T.r2Title}
      </div>

      {/* 台座 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {[520, 1400].map((x, i) => (
          <g key={i}>
            <rect x={x - 210} y={790} width={420} height={26} rx={12} fill="#FFFFFF" opacity={0.9} />
          </g>
        ))}
      </svg>

      {/* 左：对外人（玻璃） */}
      <Tag t={t} from={k(4)} x={520} y={320} text={T.r2Glass} color={P.cool} rot={-2} size={48} />
      <div style={{ position: "absolute", left: 520, top: 870, transform: "translateX(-50%)", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 34, color: P.dim, whiteSpace: "nowrap" }}>
        {T.r2GlassSub}
      </div>
      <GlassStation t={t} crackAt={k(8)} />
      <Break t={t} at={k(8)} x={520} y={660} color={P.cool} radius={420} />

      {/* 右：对家人（橡皮筋） */}
      <Tag t={t} from={k(6)} x={1400} y={320} text={T.r2Band} color={P.amber} rot={2} size={48} />
      <div style={{ position: "absolute", left: 1400, top: 870, transform: "translateX(-50%)", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 34, color: P.dim, whiteSpace: "nowrap" }}>
        {T.r2BandSub}
      </div>
      <BandStation t={t} appearAt={k(10)} snapAt={k(16)} />

      {/* 第一次 / 第二次 / 第三次 */}
      <Tag t={t} from={k(12)} until={k(16)} x={1180} y={560} text={T.once1} color={P.warn} rot={-6} size={40} />
      <Tag t={t} from={k(14)} until={k(16)} x={1400} y={470} text={T.once2} color={P.warn} rot={3} size={40} />
      <Tag t={t} from={k(16)} until={k(21)} x={1650} y={560} text={T.once3} color={P.low} rot={5} size={40} />

      {/* 拉断 */}
      <Break t={t} at={k(16)} x={1400} y={660} color={P.warmRed} radius={620} />

      {/* 底部：我们拉它的方式 */}
      {harms.map((h, i) => (
        <Tag key={i} t={t} from={h.from} until={k(19)} x={h.x} y={985} text={h.text} color={P.magenta} rot={h.rot} size={36} />
      ))}

      <Line t={t} from={k(20)} until={k(23.5)} parts={[{ text: "可是，橡皮筋拉太多次，" }, { text: "也会断", color: P.warmRed, hi: true }]} size={50} />
      <Line t={t} from={k(24)} parts={[{ text: "安全感，" }, { text: "不是伤害的许可证", color: P.magenta, hi: true }]} size={50} />
      <Flash t={t} at={k(16)} color="#FFFFFF" decay={7} max={0.3} />
      <div style={{ position: "absolute", inset: 0, background: vignette(0.38), pointerEvents: "none" }} />
    </div>
  );
};
