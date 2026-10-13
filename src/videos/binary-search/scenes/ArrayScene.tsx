import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { NUMS, P, TARGET } from "../kit/theme";
import { Bubble, Chapter, Sub, usePulse } from "../kit/ui";

const BOX = 100;
const GAP = 12;
const LEFT = (1920 - (NUMS.length * BOX + (NUMS.length - 1) * GAP)) / 2;
const BX = (i: number) => LEFT + i * (BOX + GAP) + BOX / 2;
const TOP = 400;

// 与 Halving 相同的二分轨迹
const ROUNDS = (() => {
  const out: { lo: number; hi: number; mid: number }[] = [];
  let lo = 0;
  let hi = NUMS.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    out.push({ lo, hi, mid });
    if (NUMS[mid] === TARGET) break;
    if (NUMS[mid] < TARGET) lo = mid + 1;
    else hi = mid - 1;
  }
  return out;
})();

const ROUND_BEATS = 7;
const FIRST = 14;

// 指针：箭头 + 名称
const Pointer: React.FC<{ x: number; label: string; color: string; row: number; opacity: number }> = ({ x, label, color, row, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: TOP + BOX + 60 + row * 70,
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      opacity,
    }}
  >
    <div style={{ width: 0, height: 0, borderLeft: "16px solid transparent", borderRight: "16px solid transparent", borderBottom: `22px solid ${color}` }} />
    <div style={{ padding: "2px 14px", borderRadius: 10, background: color, color: P.paper, fontFamily: MONO, fontWeight: 800, fontSize: 28 }}>{label}</div>
  </div>
);

// 06 回到计算机：队伍 = 有序数组，号码 = 元素，位置 = 下标
export const ArrayScene: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const pulse = usePulse(start);
  const half = k(1) / 2;

  const rAt = ROUNDS.map((_, r) => k(FIRST + r * ROUND_BEATS));
  const cmpAt = rAt.map((a) => a + Math.round(k(2)));
  const cutAt = rAt.map((a) => a + Math.round(k(4)));
  const foundAt = cmpAt[ROUNDS.length - 1];
  const done = t >= foundAt;

  // 当前轮次（-1 表示未开始）
  const r = rAt.reduce((m, a, i) => (t >= a ? i : m), -1);
  const ease = (from: number) => interpolate(t, [from, from + 10], [0, 1], { ...CL, easing: (x) => 1 - (1 - x) ** 3 });
  const lerpPtr = (key: "lo" | "hi" | "mid") => {
    if (r < 0) return BX(key === "hi" ? NUMS.length - 1 : key === "mid" ? 7 : 0);
    const prev = r === 0 ? ROUNDS[0] : ROUNDS[r - 1];
    const p = ease(rAt[r]);
    return BX(prev[key] + (ROUNDS[r][key] - prev[key]) * (r === 0 ? 1 : p));
  };
  const ptrOn = pop(t, k(10), 12);
  const midOn = r >= 0 ? pop(t, rAt[0], 12) : 0;

  const inRange = (i: number) => {
    if (r < 0) return true;
    const rd = ROUNDS[r];
    // 本轮比较后才收缩
    if (t >= cutAt[r] && r + 1 < ROUNDS.length) {
      const nx = ROUNDS[r + 1];
      return i >= nx.lo && i <= nx.hi;
    }
    return i >= rd.lo && i <= rd.hi;
  };

  const v = r >= 0 ? NUMS[ROUNDS[r].mid] : 0;
  const cmpText = v === TARGET ? `arr[${ROUNDS[r]?.mid}] = ${v} === 81  找到！` : v < TARGET ? `${v} < 81  →  lo = mid + 1` : `${v} > 81  →  hi = mid - 1`;

  return (
    <>
      <Chapter t={t} no="06" title="回到计算机" />

      {/* 映射说明 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", gap: 30 }}>
        {[
          ["队伍", "有序数组"],
          ["号码牌", "元素值"],
          ["站位", "下标 index"],
        ].map(([a, b], i) => {
          const s = pop(t, k(2 + i * 2), 12);
          return (
            <div
              key={a}
              style={{
                padding: "10px 26px",
                borderRadius: 18,
                background: P.paper,
                border: `3px solid ${P.line}`,
                fontFamily: FONT,
                fontSize: 32,
                fontWeight: 800,
                color: P.ink,
                opacity: s * interpolate(t, [k(12), k(13)], [1, 0], CL),
                transform: `translateY(${(1 - s) * 30}px)`,
              }}
            >
              {a} <span style={{ color: P.clay }}>→</span> {b}
            </div>
          );
        })}
      </div>

      {/* 比较说明（替换映射说明的位置） */}
      {r >= 0 && t >= cmpAt[r] ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 180,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 46,
            fontWeight: 800,
            color: v === TARGET ? P.clay : P.ink,
            opacity: pop(t, cmpAt[r], 10),
            transform: `scale(${0.85 + pop(t, cmpAt[r], 10) * 0.15})`,
          }}
        >
          {cmpText}
        </div>
      ) : null}

      {/* 数组格子 */}
      {NUMS.map((n, i) => {
        const s = pop(t, Math.round(i * half * 0.5), 12);
        const on = inRange(i);
        const isMid = r >= 0 && ROUNDS[r].mid === i && t >= rAt[r];
        const hitMid = isMid && t >= cmpAt[r];
        const yay = done && n === TARGET;
        const bump = isMid ? Math.exp(-Math.max(0, t - rAt[r]) / 5) * 0.12 : 0;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: BX(i) - BOX / 2,
                top: TOP,
                width: BOX,
                height: BOX,
                borderRadius: 18,
                background: yay ? P.clay : hitMid ? P.clayLight : P.paper,
                border: `4px solid ${isMid ? P.clay : P.ink}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: 40,
                fontWeight: 900,
                color: yay ? P.paper : P.ink,
                opacity: Math.min(1, s * 1.5) * (on ? 1 : 0.22),
                transform: `translateY(${(1 - s) * -80 + (on ? 0 : 14)}px) scale(${1 + bump + (yay ? pulse * 0.08 : 0)})`,
                transition: "none",
              }}
            >
              {n}
            </div>
            <div
              style={{
                position: "absolute",
                left: BX(i),
                top: TOP + BOX + 12,
                transform: "translateX(-50%)",
                fontFamily: MONO,
                fontSize: 24,
                color: P.sub,
                opacity: pop(t, k(6), 12) * (on ? 1 : 0.3),
              }}
            >
              {i}
            </div>
          </React.Fragment>
        );
      })}

      {/* lo、hi 重合时左右错开，避免互相遮挡 */}
      {(() => {
        const lo = lerpPtr("lo");
        const hi = lerpPtr("hi");
        const spread = interpolate(hi - lo, [0, BOX + GAP], [34, 0], CL);
        return (
          <>
            <Pointer x={lo - spread} label="lo" color={P.sky} row={0} opacity={ptrOn} />
            <Pointer x={hi + spread} label="hi" color={P.rose} row={0} opacity={ptrOn} />
          </>
        );
      })()}
      <Pointer x={lerpPtr("mid")} label="mid" color={P.clay} row={1} opacity={midOn} />

      {/* 小人站在 mid 指针下方跟着走 */}
      <Clawd
        x={lerpPtr("mid")}
        y={TOP + BOX + 300}
        u={6}
        mood={done ? "happy" : "normal"}
        jump={r >= 0 ? Math.exp(-Math.max(0, t - rAt[r]) / 4) * 30 + (done ? Math.abs(Math.sin(((t - foundAt) / k(1)) * Math.PI)) * 24 : 0) : 0}
        squash={pulse * 0.2}
        lookY={-1}
        arm={done ? 1 : 0}
        opacity={midOn}
      />
      <Bubble t={t} from={foundAt + Math.round(k(1))} to={k(40)} x={lerpPtr("mid") + 140} y={TOP + BOX + 250} text="返回下标 12" size={30} color={P.clay} />

      <Sub t={t} from={k(1)} to={k(9)}>
        把排队的小伙伴，换成一个排好序的数组
      </Sub>
      <Sub t={t} from={k(10)} to={rAt[0] - 1}>
        lo、hi 圈出搜索范围，mid 指向正中间
      </Sub>
      <Sub t={t} from={rAt[0] + 2} to={cutAt[1]}>
        mid = ⌊(lo + hi) / 2⌋，和目标比大小
      </Sub>
      <Sub t={t} from={cutAt[1] + 2} to={foundAt - 2}>
        小了就挪 lo，大了就挪 hi，范围不断砍半
      </Sub>
      <Sub t={t} from={k(41)}>
        4 次比较，从 15 个元素里精准命中
      </Sub>
    </>
  );
};
