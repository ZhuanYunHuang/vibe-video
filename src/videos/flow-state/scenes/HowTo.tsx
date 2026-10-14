import React from "react";
import { FONT, hit, MONO, pop, SceneProps, useT } from "../../../shared";
import { glow, P, useK } from "../kit/theme";
import { Burst, Chapter, GlassCard, Stage, Sub, usePulse } from "../kit/ui";

// 拍 288~320 怎么进入心流：
//   ★288 标题 / 290（强拍）方法① / 296（强拍）方法② / △304 跳变：方法③ + 流动连线串起三卡
//   308·310 强拍节点依次亮起 / 317（强拍）行动号召
export const HowTo: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const pulse = usePulse(start);
  const tips = [
    { no: "1", title: "目标明确", desc: "知道下一步要做什么", ex: "「今晚刷完这 20 题」", b: 290, x: 400 },
    { no: "2", title: "即时反馈", desc: "做对做错马上知道", ex: "游戏的分数、对答案", b: 296, x: 960 },
    { no: "3", title: "难度刚好", desc: "比现在的自己难一点点", ex: "跳一跳，够得着", b: 304, x: 1520 },
  ];
  const linked = t >= K(304);

  return (
    <Stage t={t}>
      <Chapter t={t} step="3" title="怎么主动进入？" />
      {/* △304：三卡下方连线，颜色持续流动 */}
      {linked ? (
        <div
          style={{
            position: "absolute",
            left: 400,
            top: 809,
            height: 6,
            width: 1120 * Math.min(1, pop(t, K(304), 16)),
            background: `linear-gradient(90deg, ${P.mint}, ${P.gold}, ${P.mint})`,
            backgroundSize: "200% 100%",
            backgroundPosition: `${(t * 14) % 400}px 0`,
            boxShadow: `0 0 ${20 + hit(t, K(304), 6) * 40 + pulse * 14}px ${P.mint}`,
          }}
        />
      ) : null}
      {tips.map((tp) => {
        const on = t >= K(tp.b);
        return (
          <GlassCard key={tp.no} x={tp.x} y={540} w={460} h={480} appear={on ? pop(t, K(tp.b), 12) : 0} lit={hit(t, K(tp.b), 8) + (t >= K(317) ? 0.5 : 0)}>
            <div style={{ fontFamily: MONO, fontSize: 90, fontWeight: 900, color: P.mint, textShadow: glow(P.mint, 0.7 + pulse * 0.5), transform: `translateY(${Math.sin(t / 18 + tp.x) * 5}px)` }}>{tp.no}</div>
            <div style={{ fontSize: 56, fontWeight: 900, marginTop: 6 }}>{tp.title}</div>
            <div style={{ fontSize: 32, color: P.sub, marginTop: 18 }}>{tp.desc}</div>
            <div style={{ fontSize: 30, color: P.gold, marginTop: 28, fontFamily: FONT }}>{tp.ex}</div>
          </GlassCard>
        );
      })}
      {/* 304 / 308 / 310 三个强拍：连线上的节点依次亮起 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 801, display: "flex", justifyContent: "center", gap: 30 }}>
        {[304, 308, 310].map((b) => (
          <div
            key={b}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: t >= K(b) ? P.mint : P.abyss,
              border: `3px solid ${t >= K(b) ? P.gold : P.line}`,
              transform: `scale(${1 + hit(t, K(b), 4) * 0.8 + pulse * 0.15})`,
              boxShadow: t >= K(b) ? `0 0 ${14 + pulse * 12}px ${P.mint}` : undefined,
            }}
          />
        ))}
      </div>
      <Burst t={t} from={K(317)} x={960} y={430} spread={280} size={12} />
      <Sub t={t} from={K(293)} to={K(310)} text="心流不靠运气，可以自己“造”出来" color={P.sub} />
      <Sub t={t} from={K(310)} to={K(317)} text="三个条件凑齐，大脑就会自己沉进去" />
      <Sub t={t} from={K(317)} text="再加一条：关掉手机通知" color={P.gold} />
    </Stage>
  );
};
