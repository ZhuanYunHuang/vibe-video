import React from "react";
import { pop, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { Queue, shake } from "../kit/Queue";
import { P, QX, S_GROUND, S_UNIT, TARGET_IDX } from "../kit/theme";
import { Bubble, Chapter, Goal, Sub, usePulse, walkPath } from "../kit/ui";

// 02 挨个问：一个一个问过去，越问越累
export const Linear: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const pulse = usePulse(start);

  // 前 3 次每 2 拍问一个，之后加速到每拍一个
  const askBeat = (i: number) => (i < 3 ? 2 + i * 2 : 8 + (i - 3));
  const asks = Array.from({ length: TARGET_IDX + 1 }, (_, i) => k(askBeat(i)));
  const found = asks[TARGET_IDX];
  const count = asks.filter((a) => t >= a).length;
  const lastAsk = [...asks].reverse().find((a) => t >= a) ?? -999;

  // 主角在每次提问前半拍到位
  const half = Math.round(k(1) / 2);
  const frames = [0, ...asks.map((a) => a - Math.min(half, 6))];
  const xs = [260, ...asks.map((_, i) => QX(i))];
  const hero = walkPath(t, frames, xs, S_UNIT);
  const tired = t > k(10) && t < found;
  const sweat = tired ? (t % 20) / 20 : -1;

  return (
    <>
      <Chapter t={t} no="02" title="笨办法：挨个问" />
      <Goal t={t} count={count} lastAsk={lastAsk} />

      <Queue
        get={(i) => {
          const a = i <= TARGET_IDX ? asks[i] : 1e9;
          const [dx, look] = shake(t, a);
          const isTarget = i === TARGET_IDX;
          const asked = t >= a + 10 && !isTarget;
          const yay = isTarget && t >= found;
          return {
            x: QX(i) + (isTarget ? 0 : dx),
            look: isTarget ? 0 : look,
            dim: asked ? 0.75 : 0,
            mood: yay ? "happy" : t >= a && t < a + 10 && !isTarget ? "closed" : "normal",
            jump: yay ? pop(t, found, 8) * 40 * Math.max(0, Math.sin(((t - found) / 9) * Math.PI)) : 0,
            arm: yay ? 1 : 0,
            squash: pulse * 0.12,
            tagColor: yay ? P.clay : asked ? P.sub : P.ink,
            tag: yay ? 1 + pop(t, found, 8) * 0.25 : 1,
          };
        }}
      />

      <Clawd
        x={hero.x}
        y={S_GROUND}
        u={S_UNIT}
        walk={hero.walk}
        stride={hero.stride}
        mood={t >= found ? "happy" : tired ? "sad" : "normal"}
        lookY={-0.8}
        arm={t >= found ? 1 : 0}
        squash={pulse * 0.15}
      />
      {sweat >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: hero.x + 80,
            top: S_GROUND - 120 + sweat * 50,
            width: 16,
            height: 22,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: P.sky,
            opacity: 1 - sweat,
          }}
        />
      ) : null}

      <Bubble t={t} from={asks[0] - 4} to={asks[2] + 6} x={hero.x + 30} y={790} text="你是 81 号吗？" size={32} />
      <Bubble t={t} from={asks[0]} to={asks[0] + 12} x={QX(0)} y={460} text="不是~" size={28} />
      <Bubble t={t} from={asks[1]} to={asks[1] + 12} x={QX(1)} y={460} text="不是~" size={28} />
      <Bubble t={t} from={found} to={k(21)} x={QX(TARGET_IDX)} y={450} text="是我！" size={34} color={P.clay} />

      <Sub t={t} from={k(1)} to={k(7)}>
        最直接的办法：从头开始，一个一个问
      </Sub>
      <Sub t={t} from={k(9)} to={k(17)}>
        不是…不是…还不是……
      </Sub>
      <Sub t={t} from={k(21)} to={k(26)}>
        找到了，但足足问了 13 次
      </Sub>
      <Sub t={t} from={k(27)}>
        要是队伍有 100 万人呢？
      </Sub>
    </>
  );
};
