import React from "react";
import { FONT, hit, pop, SceneProps, useT } from "../../../shared";
import { P, useK } from "../kit/theme";
import { Burst, Chapter, GlassCard, Ripple, Slam, Stage, Sub } from "../kit/ui";

// 拍 240~288 四大特征（2×2 玻璃卡，各自悬浮相位不同）：
//   241★ 卡① / 247★ 卡② / ★256 卡③ + 中心涟漪爆开（256-259 连爆）/ 261★ 卡④
//   △272-273★ 跳变：四卡同时点亮 + 粒子 + 「这，就是心流」砸入 / 276★ 字幕收束
export const Traits: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const cards = [
    { icon: "⏳", title: "时间感消失", desc: "几小时像几分钟", b: 241, x: 560, y: 400 },
    { icon: "😶", title: "忘记自我", desc: "不再在意别人怎么看", b: 247, x: 1360, y: 400 },
    { icon: "🎯", title: "全神贯注", desc: "注意力只剩眼前这件事", b: 256, x: 560, y: 720 },
    { icon: "💎", title: "乐在其中", desc: "做这件事本身就是奖励", b: 261, x: 1360, y: 720 },
  ];
  const allLit = t >= K(273);

  return (
    <Stage t={t}>
      <Chapter t={t} step="2" title="它的四个信号" />
      <Ripple
        t={t}
        x={960}
        y={560}
        froms={[K(256), K(257), K(258), K(259), K(273), K(274)]}
        r0={90}
        gap={110}
        bright={allLit ? 0.8 + 0.2 * Math.sin(t / 16) : 0.5 + 0.12 * Math.sin(t / 22)}
      />
      <Burst t={t} from={K(273)} x={960} y={560} spread={330} size={13} colors={[P.gold, "#fff", P.mint]} />
      {cards.map((c) => {
        const on = t >= K(c.b);
        const lit = hit(t, K(c.b), 8) + (allLit ? 0.6 + hit(t, K(273), 8) * 0.6 : 0);
        return (
          <GlassCard key={c.title} x={c.x} y={c.y} w={640} h={260} appear={on ? pop(t, K(c.b), 12) : 0} lit={lit} color={allLit ? P.gold : P.mint}>
            <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
              <div
                style={{
                  fontSize: 96,
                  lineHeight: 1,
                  transform: `scale(${1 + hit(t, K(c.b), 4) * 0.3}) rotate(${Math.sin(t / 17 + c.b) * 7}deg)`,
                }}
              >
                {c.icon}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 54, fontWeight: 900, color: allLit ? P.gold : P.ink }}>{c.title}</div>
                <div style={{ fontSize: 32, color: P.sub, marginTop: 10, fontFamily: FONT }}>{c.desc}</div>
              </div>
            </div>
          </GlassCard>
        );
      })}
      <Slam t={t} from={K(273)} x={960} y={560} size={80} color={P.ink} glowColor={P.gold}>
        这，就是<span style={{ color: P.gold }}>心流</span>
      </Slam>
      <Sub t={t} from={K(244)} to={K(256)} text="回想一下：三个瞬间里是不是全都有？" color={P.sub} />
      <Sub t={t} from={K(276)} text="心流不是玄学，是大脑最高效的工作状态" color={P.mint} />
    </Stage>
  );
};
