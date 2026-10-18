import React from "react";
import { interpolate } from "remotion";
import { CL, SceneProps, StaggerText, Typewriter, hit, useAt, useT } from "../../../shared";
import { Badge, Battery, Flash, Line, P, glow, lightCool, vignette } from "../kit";
import { T } from "../copy";

// 日耗流水条目
const LogChip: React.FC<{
  t: number;
  from: number;
  x: number;
  y: number;
  text: string;
  v: number;
  icon: React.ReactNode;
}> = ({ t, from, x, y, text, v, icon }) => {
  if (t < from) return null;
  const d = t - from;
  const inX = Math.max(0, 1 - d / 8) * 360; // 从右侧飞入
  const s = 1 + hit(t, from, 5) * 0.12;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) translateX(${inX}px) scale(${s})`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 30px",
        borderRadius: 18,
        whiteSpace: "nowrap",
        border: `4px solid #E3D5BC`,
        background: "#FFFFFF",
        boxShadow: glow(P.magenta, 0.7),
        fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
        opacity: Math.min(1, d / 3),
      }}
    >
      {icon}
      <span style={{ fontWeight: 900, fontSize: 40, color: P.ink }}>{text}</span>
      <span style={{ fontWeight: 900, fontSize: 46, color: P.magenta }}>−{v}%</span>
    </div>
  );
};

const ico = (d: string, c: string) => (
  <svg width={46} height={46} viewBox="0 0 46 46">
    <path d={d} fill="none" stroke={c} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 第 6 幕（b96–128）：原因① 耐心会被用完 —— 大电量条 +「扣电日志」四条流水，92 → 4%
// k16（112 拍）= 大卡点：标题从「耐心会被用完」硬切成「只剩最后一格电」
export const ReasonOne: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const lvl = interpolate(t, [k(6), k(8), k(12), k(16), k(20)], [92, 68, 48, 22, 4], CL);
  const delta = t >= k(20) ? { v: -18, at: k(20) } : t >= k(16) ? { v: -26, at: k(16) } : t >= k(12) ? { v: -20, at: k(12) } : t >= k(8) ? { v: -24, at: k(8) } : undefined;

  const chips = [
    { at: k(8), x: 520, y: 690, text: T.r1Boss, v: 24, icon: ico("M14 8 h12 v30 h-12 z M30 16 h8 v22 h-8 z", P.cool) },
    { at: k(12), x: 1400, y: 690, text: T.r1Metro, v: 20, icon: ico("M8 12 h30 v16 h-30 z M12 34 a3 3 0 1 0 0.1 0 M34 34 a3 3 0 1 0 0.1 0", P.cool) },
    { at: k(16), x: 520, y: 830, text: T.r1Client, v: 26, icon: ico("M9 10 h28 v18 h-28 z M16 34 l6 -6 l6 6", P.blue) },
    { at: k(20), x: 1400, y: 830, text: T.r1Mate, v: 18, icon: ico("M23 8 a8 8 0 1 0 0.1 0 M8 40 q15 -12 30 0", P.magenta) },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg, #101C3A 0%, #1B2C52 100%)" }}>
      <div style={{ position: "absolute", inset: 0, background: lightCool(0.22, "50%", "30%") }} />

      <Badge t={t} from={k(0)} text={T.r1Badge} color={P.cool} />
      {/* 标题：k16 硬切换 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 120,
          textAlign: "center",
          fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
          fontWeight: 900,
          fontSize: 74,
          color: "#FFFFFF",
          textShadow: glow(P.cool, 1.1),
        }}
      >
        {t < k(16) ? (
          <Typewriter t={t} from={k(2)} text={T.r1Title} speed={3.4} caretColor={P.cool} />
        ) : (
          <StaggerText t={t} from={k(16)} text={T.r1Last} step={1.4} style={{ fontSize: 66, color: P.warn }} />
        )}
      </div>

      {/* 大电量条（带扣电日志脚注） */}
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(t, [k(5), k(7)], [0, 1], CL) }}>
        <Battery t={t} x={960} y={490} w={1000} level={lvl} delta={delta} mode="log" cracked={lvl <= 6} />
      </div>

      {/* 扣电日志四条流水 */}
      {chips.map((c, i) => (
        <React.Fragment key={i}>
          <LogChip t={t} from={c.at} x={c.x} y={c.y} text={c.text} v={c.v} icon={c.icon} />
          <Flash t={t} at={c.at} color={P.magenta} decay={5} max={0.2} />
        </React.Fragment>
      ))}

      {/* 心理学标签 */}
      <Badge t={t} from={k(22)} text={T.r1Psy} color={P.blue} x={1490} y={92} />

      <Line t={t} from={k(25)} parts={[{ text: "回到家时，只剩" }, { text: "最后一格电", color: P.low, hi: true }]} size={50} />
      <div style={{ position: "absolute", inset: 0, background: vignette(0.4), pointerEvents: "none" }} />
    </div>
  );
};
