import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { Queue } from "../kit/Queue";
import { NUMS, P, QX, Q_GROUND, S_GROUND, S_UNIT, TARGET } from "../kit/theme";
import { Bubble, Chapter, Confetti, Goal, Sub, usePulse, walkPath } from "../kit/ui";

// 二分过程：每轮 [lo, hi] → 问 mid → 淘汰一半
const ROUNDS = (() => {
  const out: { lo: number; hi: number; mid: number; nlo: number; nhi: number }[] = [];
  let lo = 0;
  let hi = NUMS.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const v = NUMS[mid];
    const nlo = v < TARGET ? mid + 1 : lo;
    const nhi = v > TARGET ? mid - 1 : hi;
    out.push({ lo, hi, mid, nlo: v === TARGET ? mid : nlo, nhi: v === TARGET ? mid : nhi });
    if (v === TARGET) break;
    lo = nlo;
    hi = nhi;
  }
  return out;
})();

const ROUND_BEATS = 8;
const FIRST = 2;

// 04 一刀切一半：在队伍里真正跑一遍二分
export const Halving: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const pulse = usePulse(start);

  const askAt = ROUNDS.map((_, r) => k(FIRST + r * ROUND_BEATS + 2));
  const cutAt = ROUNDS.map((_, r) => k(FIRST + r * ROUND_BEATS + 4));
  const foundAt = askAt[ROUNDS.length - 1];
  const count = askAt.filter((a) => t >= a).length;
  const lastAsk = [...askAt].reverse().find((a) => t >= a) ?? -999;

  // 主角走到每轮的 mid
  const frames = [0];
  const xs = [QX(7)];
  ROUNDS.forEach((rd, r) => {
    frames.push(k(FIRST + r * ROUND_BEATS), askAt[r] - 4);
    xs.push(xs[xs.length - 1], QX(rd.mid));
  });
  const hero = walkPath(t, frames, xs, S_UNIT);

  // 当前有效区间（用于高亮框）
  const cur = (() => {
    let lo = 0;
    let hi = NUMS.length - 1;
    let from = -999;
    ROUNDS.forEach((rd, r) => {
      if (t >= cutAt[r]) {
        lo = rd.nlo;
        hi = rd.nhi;
        from = cutAt[r];
      }
    });
    return { lo, hi, from };
  })();
  const prevRange = (() => {
    const idx = ROUNDS.findIndex((_, r) => cutAt[r] === cur.from);
    if (idx <= 0) return { lo: 0, hi: NUMS.length - 1 };
    return { lo: ROUNDS[idx - 1].nlo, hi: ROUNDS[idx - 1].nhi };
  })();
  const ease = interpolate(t, [cur.from, cur.from + 12], [0, 1], { ...CL, easing: (x) => 1 - (1 - x) ** 3 });
  const boxLo = prevRange.lo + (cur.lo - prevRange.lo) * (cur.from < 0 ? 1 : ease);
  const boxHi = prevRange.hi + (cur.hi - prevRange.hi) * (cur.from < 0 ? 1 : ease);

  const done = t >= foundAt;

  return (
    <>
      <Chapter t={t} no="04" title="一刀切掉一半" />
      <Goal t={t} from={-99} count={count} lastAsk={lastAsk} />

      {/* 当前搜索区间框 */}
      <div
        style={{
          position: "absolute",
          left: QX(boxLo) - 58,
          width: QX(boxHi) - QX(boxLo) + 116,
          top: Q_GROUND - 180,
          height: 200,
          borderRadius: 28,
          border: `5px dashed ${done ? P.clay : P.ink}`,
          background: done ? `${P.clayLight}33` : "#ffffff55",
          opacity: pop(t, k(1), 14),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: (QX(boxLo) + QX(boxHi)) / 2,
          top: Q_GROUND + 50,
          transform: "translateX(-50%)",
          fontFamily: MONO,
          fontSize: 32,
          fontWeight: 800,
          color: P.sub,
          whiteSpace: "nowrap",
          opacity: pop(t, k(1), 14),
        }}
      >
        还剩 {Math.round(boxHi - boxLo + 1)} 人
      </div>

      <Queue
        get={(i) => {
          // 第几轮被淘汰
          const outRound = ROUNDS.findIndex((rd) => i < rd.nlo || i > rd.nhi);
          const outAt = outRound >= 0 ? cutAt[outRound] : 1e9;
          const o = interpolate(t, [outAt, outAt + 10], [0, 1], CL);
          const askR = ROUNDS.findIndex((rd) => rd.mid === i);
          const asked = askR >= 0 && t >= askAt[askR];
          const isTarget = NUMS[i] === TARGET;
          const yay = isTarget && done;
          return {
            dy: o * 26,
            dim: o * 0.85,
            opacity: 1 - o * 0.55,
            tag: 1 - o * 0.25 + (asked && !yay && o === 0 ? 0.15 : 0) + (yay ? pop(t, foundAt, 8) * 0.3 : 0),
            tagColor: yay ? P.paper : asked ? P.clay : P.ink,
            tagBg: yay ? P.clay : undefined,
            mood: yay ? "happy" : o > 0.5 ? "closed" : "normal",
            jump: yay ? Math.abs(Math.sin(((t - foundAt) / k(1)) * Math.PI)) * 40 : 0,
            arm: yay ? 1 : 0,
            squash: o > 0 ? 0 : pulse * 0.12,
          };
        }}
      />

      <Clawd
        x={hero.x}
        y={S_GROUND}
        u={S_UNIT}
        walk={hero.walk}
        stride={hero.stride}
        lookY={-0.9}
        mood={done ? "happy" : "normal"}
        arm={done ? 1 : 0}
        armL={done ? 1 : 0}
        jump={done ? Math.abs(Math.sin(((t - foundAt) / k(1)) * Math.PI)) * 50 : 0}
        squash={pulse * 0.15}
      />

      {ROUNDS.map((rd, r) => {
        const v = NUMS[rd.mid];
        const reply = v === TARGET ? "就是我！" : v < TARGET ? `我是 ${v}，往右找` : `我是 ${v}，往左找`;
        return (
          <React.Fragment key={r}>
            <Bubble t={t} from={askAt[r] - 3} to={askAt[r] + 6} x={QX(rd.mid) + 30} y={790} text="你几号？" size={30} />
            <Bubble
              t={t}
              from={askAt[r] + Math.round(k(1) / 2)}
              to={r === ROUNDS.length - 1 ? 1e9 : cutAt[r] + 10}
              x={Math.min(1640, Math.max(280, QX(rd.mid)))}
              y={400}
              text={reply}
              size={32}
              color={v === TARGET ? P.clay : P.ink}
            />
          </React.Fragment>
        );
      })}
      <Confetti t={t} from={foundAt} />

      {/* 战绩对比 */}
      {done ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 160,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: 64,
            fontWeight: 900,
            color: P.ink,
            opacity: pop(t, foundAt + k(2), 12),
            transform: `scale(${0.7 + pop(t, foundAt + k(2), 12) * 0.3})`,
          }}
        >
          只问了 <span style={{ color: P.clay, fontFamily: MONO }}>4</span> 次！（刚才是 13 次）
        </div>
      ) : null}

      <Sub t={t} from={k(1)} to={cutAt[0] - 2}>
        先问中间：44 比 81 小，左边全都不用看了
      </Sub>
      <Sub t={t} from={cutAt[0] + 4} to={cutAt[1] - 2}>
        在剩下的里面，再问中间
      </Sub>
      <Sub t={t} from={cutAt[1] + 4} to={cutAt[2] - 2}>
        每问一次，范围就缩小一半
      </Sub>
      <Sub t={t} from={cutAt[2] + 4}>
        一刀一半，越找越快
      </Sub>
    </>
  );
};
