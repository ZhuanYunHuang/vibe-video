import React from "react";
import { pop, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { Queue } from "../kit/Queue";
import { QX, Q_UNIT, S_GROUND, S_UNIT } from "../kit/theme";
import { Bubble, Chapter, Goal, Sub, usePulse, walkPath } from "../kit/ui";

// 01 排队找人：15 个小伙伴列队入场，主角登场说明目标
export const QueueScene: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const pulse = usePulse(start);

  const hero = walkPath(t, [k(14), k(18)], [-200, 260], S_UNIT);
  const arrive = k(6);
  const landSquash = t >= arrive ? Math.exp(-(t - arrive) / 4) * 0.8 : 0;

  return (
    <>
      <Chapter t={t} no="01" title="排队找人" />
      <Goal t={t} from={k(20)} count={0} lastAsk={-999} />

      <Queue
        get={(i) => {
          const w = walkPath(t, [k(1), arrive], [QX(i) + 1500, QX(i)], Q_UNIT);
          return {
            x: w.x,
            walk: w.walk,
            stride: w.stride,
            squash: t >= arrive ? landSquash + pulse * 0.18 : 0,
            tag: pop(t, k(7 + i * 0.5), 10),
            look: t > k(16) ? -0.6 : 0,
          };
        }}
      />

      <Clawd
        x={hero.x}
        y={S_GROUND}
        u={S_UNIT}
        walk={hero.walk}
        stride={hero.stride}
        squash={t > k(18) ? pulse * 0.2 : 0}
        mood={t >= k(24) && t < k(30) ? "think" : "normal"}
        lookY={t >= k(18) ? -0.8 : 0}
        look={t >= k(18) ? 0.6 : 0}
      />
      <Bubble t={t} from={k(18)} to={k(25)} x={hero.x + 40} y={800} text="我在找 81 号朋友！" />

      <Sub t={t} from={k(2)} to={k(13)}>
        15 个小伙伴排成一队，每人举着号码牌
      </Sub>
      <Sub t={t} from={k(24)} to={k(31)}>
        可他不知道，81 号站在哪……
      </Sub>
    </>
  );
};
