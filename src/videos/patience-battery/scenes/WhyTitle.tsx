import React from "react";
import { SceneProps, Typewriter, useAt, useT } from "../../../shared";
import { Flash, Line, Mom, P, Worker, glow, lightCool, lightWarm, vignette } from "../kit";
import { T } from "../copy";

// 第 5 幕（b80–96）：为什么 —— 同一扇门，门外冷 / 门内暖「对切」（k8 硬切）；
// 「为什么」落在门缝光上，两问分别落在前后两半
export const WhyTitle: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const outside = t >= k(8); // k8（88 拍）= 对切跳变
  const seam = 0.45 + 0.25 * Math.sin(t / 14);
  const doorGlow = outside ? 0.5 + 0.3 * Math.sin(t / 9) : seam;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* 门外（冷）/ 门内（暖）对切 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: outside ? "linear-gradient(180deg, #0E1830 0%, #172747 100%)" : "linear-gradient(180deg, #FFF6E8 0%, #FBE7C8 100%)",
        }}
      />

      {/* 同一扇门（位置不变，只换世界） */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={760} y={196} width={400} height={726} rx={12} fill={outside ? "#3E3226" : "#8A5A3A"} />
        <rect x={786} y={222} width={348} height={674} rx={8} fill={outside ? "#4A3B2E" : "#9C6B45"} />
        <rect x={952} y={222} width={18} height={674} fill={outside ? "#33291F" : "#8A5A3A"} />
        <circle cx={1104} cy={576} r={11} fill="#F5C542" />
        {/* 门缝光 */}
        <rect x={1158} y={206} width={10} height={706} fill="#FFD98A" opacity={0.5 * doorGlow} />
        <rect x={762} y={916} width={396} height={9} fill="#FFD98A" opacity={0.75 * doorGlow} />
      </svg>

      {/* 门外：地面的冷光与他的影子 */}
      {outside ? (
        <>
          <div style={{ position: "absolute", inset: 0, background: lightCool(0.26, "36%", "40%") }} />
          <div
            style={{
              position: "absolute",
              left: 900,
              top: 940,
              width: 700,
              height: 120,
              background: "radial-gradient(ellipse at 50% 50%, rgba(10,16,32,0.55) 0%, transparent 70%)",
            }}
          />
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: lightWarm(0.24, "70%", "44%") }} />
      )}

      {/* 门内：妈妈独站；门外：他背对门站着 */}
      {outside ? (
        <Worker x={1310} y={985} s={0.78} mood="guilty" pose="cover" dim={0.45} breathe={0.7} />
      ) : (
        <Mom x={620} y={952} s={0.86} mood="sad" breathe={0.7} photo={t >= k(5)} />
      )}

      {/* 「为什么」大字：落在门缝光上 */}
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 350,
          transform: "translate(-50%, -50%)",
          fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
          fontWeight: 900,
          fontSize: 190,
          letterSpacing: 24,
          color: "#FFFFFF",
          WebkitTextStroke: `${outside ? 9 : 8}px ${outside ? P.cool : P.amber}`,
          textShadow: glow(outside ? P.cool : P.amber, 1.6),
          paintOrder: "stroke",
        }}
      >
        <Typewriter t={t} from={k(1.5)} text={T.why} speed={7} caretColor={outside ? P.cool : P.amber} />
      </div>

      {/* 暗角 */}
      <div style={{ position: "absolute", inset: 0, background: vignette(0.4, outside ? "8,14,30" : "120,80,40"), pointerEvents: "none" }} />

      {/* 对切闪光 */}
      <Flash t={t} at={k(8)} color="#FFFFFF" decay={5} max={0.4} />

      {/* 两问 */}
      <Line t={t} from={k(4)} until={k(7.6)} parts={[{ text: "我们总是对" }, { text: "最亲近的人", color: P.amber, hi: true }, { text: "发脾气，" }]} size={54} />
      <Line t={t} from={k(10)} parts={[{ text: "对" }, { text: "外人", color: P.cool, hi: true }, { text: "，却很客气？" }]} size={54} />
    </div>
  );
};
