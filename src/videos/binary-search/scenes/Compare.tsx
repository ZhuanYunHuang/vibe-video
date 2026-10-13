import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { P } from "../kit/theme";
import { Bubble, Chapter, Sub, usePulse } from "../kit/ui";

// 每行：人数、挨个问的最坏次数、二分最坏次数
const ROWS = [
  { label: "15 人", linear: "15", bin: 4, w: 0.04 },
  { label: "1,000 人", linear: "1,000", bin: 10, w: 0.25 },
  { label: "100 万人", linear: "1,000,000", bin: 20, w: 0.62 },
  { label: "10 亿人", linear: "1,000,000,000", bin: 30, w: 1 },
];
const BAR_MAX = 760;

// 05 差距有多大：人数暴涨，二分次数几乎不变
export const Compare: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const pulse = usePulse(start);
  const rowAt = (i: number) => k(2 + i * 4);
  const logAt = k(22);
  const log = pop(t, logAt, 12);
  // 结论出现时表格整体退场，避免叠字
  const tableFade = interpolate(t, [logAt - 4, logAt + 6], [1, 0], CL);

  return (
    <>
      <Chapter t={t} no="05" title="差距有多大？" />

      {/* 表头 */}
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 190,
          display: "flex",
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 800,
          color: P.sub,
          opacity: pop(t, k(1), 14) * tableFade,
        }}
      >
        <div style={{ width: 240 }}>队伍人数</div>
        <div style={{ width: BAR_MAX + 60 }}>挨个问（最多）</div>
        <div>二分查找（最多）</div>
      </div>

      {ROWS.map((r, i) => {
        const a = rowAt(i);
        const s = pop(t, a, 13);
        const bar = prog(t, a, 14);
        const binP = pop(t, a + Math.round(k(1)), 9);
        return (
          <div
            key={r.label}
            style={{
              position: "absolute",
              left: 160,
              top: 260 + i * 130,
              display: "flex",
              alignItems: "center",
              opacity: Math.min(1, s * 1.4) * tableFade,
              transform: `translateX(${(1 - s) * -60}px)`,
            }}
          >
            <div style={{ width: 240, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: P.ink }}>{r.label}</div>
            <div style={{ width: BAR_MAX + 60, position: "relative", height: 60 }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 12,
                  height: 36,
                  width: Math.max(14, r.w * BAR_MAX * bar),
                  borderRadius: 18,
                  background: P.rose,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: Math.max(14, r.w * BAR_MAX * bar) + 14,
                  top: 10,
                  fontFamily: MONO,
                  fontSize: 32,
                  fontWeight: 800,
                  color: P.rose,
                  whiteSpace: "nowrap",
                  opacity: bar,
                  ...(r.w > 0.9 ? { left: 20, color: P.paper } : {}),
                }}
              >
                {r.linear} 次
              </div>
            </div>
            <div
              style={{
                padding: "6px 24px",
                borderRadius: 16,
                background: P.clay,
                color: P.paper,
                fontFamily: MONO,
                fontSize: 40,
                fontWeight: 900,
                transform: `scale(${binP})`,
              }}
            >
              {r.bin} 次
            </div>
          </div>
        );
      })}

      {/* 结论：log₂ n */}
      {t >= logAt ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 330,
            textAlign: "center",
            opacity: log,
            transform: `scale(${0.6 + log * 0.4})`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 900, color: P.ink }}>人数翻一倍，只多问 1 次</div>
          <div
            style={{
              display: "inline-block",
              marginTop: 30,
              padding: "16px 48px",
              borderRadius: 28,
              background: P.ink,
              color: P.paper,
              fontFamily: MONO,
              fontSize: 96,
              fontWeight: 900,
              boxShadow: `0 0 ${20 + pulse * 30}px ${P.clay}88`,
            }}
          >
            O(log n)
          </div>
        </div>
      ) : null}

      <Clawd
        x={1700}
        y={940}
        u={9}
        mood={t >= rowAt(3) ? "surprised" : t >= logAt ? "happy" : "normal"}
        jump={t >= logAt ? Math.abs(Math.sin(((t - logAt) / k(1)) * Math.PI)) * 34 : 0}
        squash={pulse * 0.18}
        lookY={-0.6}
        look={-0.8}
        arm={t >= logAt ? 1 : 0}
      />
      <Bubble t={t} from={rowAt(3) + Math.round(k(1))} to={logAt - 2} x={1640} y={820} text="10 亿人只要 30 次？！" size={30} />

      <Sub t={t} from={k(1)} to={k(17)}>
        挨个问的次数跟着人数一起涨，二分查找几乎原地不动
      </Sub>
      <Sub t={t} from={k(28)}>
        这就是"对数级"的威力
      </Sub>
    </>
  );
};
