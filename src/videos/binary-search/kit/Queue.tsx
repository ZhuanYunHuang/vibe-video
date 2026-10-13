import React from "react";
import { Clawd, Mood } from "./Clawd";
import { Tag } from "./ui";
import { NUMS, P, Q_GROUND, Q_UNIT, QX } from "./theme";

export const MEMBER_COLORS = [P.sky, P.sage, P.gold, P.rose, "#8C7AB8", "#C98B5B"];

// 单个队员的可覆盖状态
export type MemberState = {
  x?: number;
  dy?: number;
  jump?: number;
  squash?: number;
  walk?: number;
  stride?: number;
  mood?: Mood;
  look?: number;
  dim?: number;
  opacity?: number;
  arm?: number;
  tag?: number; // 号码牌缩放，0 表示不显示
  tagColor?: string;
  tagBg?: string;
};

// 15 人的队伍：每人状态由 get(i) 决定
export const Queue: React.FC<{ get: (i: number) => MemberState }> = ({ get }) => (
  <>
    {NUMS.map((n, i) => {
      const s = get(i);
      const tag = s.tag ?? 1;
      return (
        <Clawd
          key={i}
          x={s.x ?? QX(i)}
          y={Q_GROUND + (s.dy ?? 0)}
          u={Q_UNIT}
          color={MEMBER_COLORS[i % MEMBER_COLORS.length]}
          mood={s.mood}
          walk={s.walk}
          stride={s.stride}
          jump={s.jump}
          squash={s.squash}
          look={s.look}
          dim={s.dim}
          opacity={s.opacity}
          arm={s.arm}
          seed={i}
        >
          {tag > 0.01 ? <Tag n={n} scale={tag} color={s.tagColor ?? P.ink} bg={s.tagBg} /> : null}
        </Clawd>
      );
    })}
  </>
);

// 摇头：返回 [x 抖动, 眼珠偏移]
export const shake = (t: number, from: number) => {
  if (t < from || t > from + 14) return [0, 0];
  const d = (t - from) / 14;
  const v = Math.sin(d * Math.PI * 4) * (1 - d);
  return [v * 6, v * 1.6];
};
