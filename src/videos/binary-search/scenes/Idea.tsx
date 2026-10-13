import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { Queue } from "../kit/Queue";
import { NUMS, P, QX, Q_GROUND, S_GROUND, S_UNIT, TARGET_IDX } from "../kit/theme";
import { Bubble, Chapter, Goal, Sub, usePulse, walkPath } from "../kit/ui";

const MID = 7;

// 03 灵光一闪：号码是排好序的！先问中间
export const Idea: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const pulse = usePulse(start);
  const half = k(1) / 2;

  const hero = walkPath(t, [0, k(4)], [QX(TARGET_IDX), QX(MID)], S_UNIT);
  const waveAt = (i: number) => k(8) + Math.round(i * half);
  const bulbAt = k(16);
  const bulb = pop(t, bulbAt, 9);
  const midAt = k(20);
  const arrowP = prog(t, k(8), k(16) - k(8));
  const splitP = pop(t, k(24), 13);

  return (
    <>
      <Chapter t={t} no="03" title="灵光一闪" />
      <Goal t={t} from={-99} count={13} lastAsk={-999} />

      {/* 从小到大的箭头 */}
      <div
        style={{
          position: "absolute",
          left: QX(0) - 40,
          top: Q_GROUND + 30,
          height: 10,
          width: arrowP * (QX(14) - QX(0) + 80),
          background: P.clay,
          borderRadius: 5,
          opacity: interpolate(t, [k(23), k(24)], [1, 0.25], CL),
        }}
      />
      {arrowP > 0.02 ? (
        <div
          style={{
            position: "absolute",
            left: QX(0) - 40 + arrowP * (QX(14) - QX(0) + 80) - 16,
            top: Q_GROUND + 17,
            width: 0,
            height: 0,
            borderTop: "18px solid transparent",
            borderBottom: "18px solid transparent",
            borderLeft: `28px solid ${P.clay}`,
            opacity: interpolate(t, [k(23), k(24)], [1, 0.25], CL),
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: Q_GROUND + 54,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 34,
          fontWeight: 800,
          color: P.clay,
          opacity: pop(t, k(15), 12) * interpolate(t, [k(23), k(24)], [1, 0], CL),
        }}
      >
        号码从小到大，排得整整齐齐
      </div>

      {/* 左右两半的提示 */}
      {[
        { x: (QX(0) + QX(6)) / 2, text: "← 都比中间小", color: P.sky },
        { x: (QX(8) + QX(14)) / 2, text: "都比中间大 →", color: P.rose },
      ].map((h) => (
        <div
          key={h.text}
          style={{
            position: "absolute",
            left: h.x,
            top: Q_GROUND + 50,
            transform: `translateX(-50%) scale(${splitP})`,
            padding: "8px 22px",
            borderRadius: 14,
            background: h.color,
            color: P.paper,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 32,
            whiteSpace: "nowrap",
          }}
        >
          {h.text}
        </div>
      ))}

      <Queue
        get={(i) => {
          const w = waveAt(i);
          const isMid = i === MID;
          const midOn = isMid && t >= midAt;
          return {
            jump: hit(t, w, 5) * 26 + (midOn ? Math.max(0, Math.sin(((t - midAt) / k(1)) * Math.PI)) * 22 : 0),
            squash: pulse * 0.12,
            tag: 1 + hit(t, w, 6) * 0.3 + (midOn ? 0.2 : 0),
            tagColor: midOn ? P.paper : t >= w && t < w + 12 ? P.clay : P.ink,
            tagBg: midOn ? P.clay : undefined,
            mood: midOn ? "happy" : "normal",
            dim: t >= k(24) && !isMid ? 0.25 : 0,
          };
        }}
      />

      <Clawd
        x={hero.x}
        y={S_GROUND}
        u={S_UNIT}
        walk={hero.walk}
        stride={hero.stride}
        mood={t < k(5) ? "sad" : t < bulbAt ? "think" : "surprised"}
        lookY={-1}
        jump={t >= bulbAt ? Math.max(0, Math.sin(((t - bulbAt) / 10) * Math.PI)) * 50 * (t < bulbAt + 10 ? 1 : 0) : 0}
        arm={t >= midAt ? 1 : 0}
        squash={pulse * 0.15}
      />
      {/* 灯泡 */}
      {t >= bulbAt ? (
        <div
          style={{
            position: "absolute",
            left: hero.x - 34,
            top: S_GROUND - 200 - bulb * 20,
            transform: `scale(${bulb})`,
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: P.gold,
            boxShadow: `0 0 ${30 + pulse * 40}px ${P.gold}`,
            border: `4px solid ${P.ink}`,
          }}
        />
      ) : null}
      <Bubble t={t} from={k(5)} to={k(13)} x={hero.x + 180} y={830} text="…有没有更快的办法？" size={30} />
      <Bubble t={t} from={bulbAt + 2} to={k(23)} x={hero.x + 230} y={830} text="号码是排好序的！" size={34} color={P.clay} />

      <Sub t={t} from={k(0)} to={k(5)}>
        {`${NUMS.length} 个人问 13 次，100 万人可就问到天荒地老`}
      </Sub>
      <Sub t={t} from={k(20)} to={k(24)}>
        那就……先问正中间那个！
      </Sub>
      <Sub t={t} from={k(25)}>
        问一次，就知道 81 在左半边还是右半边
      </Sub>
    </>
  );
};
