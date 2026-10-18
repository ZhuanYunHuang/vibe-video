import React from "react";
import { interpolate } from "remotion";
import { CL, SceneProps, StaggerText, TransitionSweep, useAt, useT } from "../../../shared";
import { DotGrid, Line, P, glow, lightWarm, vignette } from "../kit";
import { T } from "../copy";

// 第 11 幕（b224–240）：时间账 —— 30 年 × 7 天 = 210 个点，从"全都还在"到"大半已经过去"
export const ThirtyYears: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 倒计时：0 → 0.86（已经过去的陪伴越来越多）
  const used = interpolate(t, [k(5), k(16)], [0, 0.86], CL);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "linear-gradient(180deg, #FFF6E8 0%, #F7ECD9 100%)" }}>
      <div style={{ position: "absolute", inset: 0, background: lightWarm(0.16, "50%", "30%") }} />

      {/* 标题 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 72, color: P.ink, textShadow: glow(P.warn, 0.8) }}>
        <StaggerText t={t} from={k(0)} text={T.t30a} step={1.8} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 244, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 52, color: "#E8742A", textShadow: glow("#E8742A", 0.6) }}>
        {t >= k(3) ? <StaggerText t={t} from={k(3)} text={T.t30b} step={1.8} /> : null}
      </div>

      {/* 点阵（倒计时模式） */}
      <DotGrid t={t} lit={used} x={960} y={600} gap={18} mode="countdown" />

      {/* 图例 + 状态标 */}
      <div style={{ position: "absolute", left: 1160, top: 560, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 700, fontSize: 28, color: P.sub }}>
        ● 每一点 = 1 天
      </div>
      <div style={{ position: "absolute", left: 1160, top: 366, display: "flex", alignItems: "center", gap: 14, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 38, color: "#8A7A5E" }}>
        <span style={{ width: 16, height: 16, borderRadius: 8, background: "#D9BE97", display: "inline-block" }} />
        {T.t30past}
      </div>
      <div style={{ position: "absolute", left: 1160, top: 866, display: "flex", alignItems: "center", gap: 14, fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 38, color: "#E08A1E" }}>
        <span style={{ width: 18, height: 18, borderRadius: 9, background: "#F5A623", display: "inline-block" }} />
        {T.t30left}
      </div>

      {/* 过渡句 */}
      {t >= k(11) ? <Line t={t} from={k(11)} parts={[{ text: "那么，我们可——", color: P.amber, hi: true }]} size={56} /> : null}
      <TransitionSweep t={t} from={k(13)} dur={34} mode="wipe" color={P.amber} />
      <div style={{ position: "absolute", inset: 0, background: vignette(0.26, "120,80,40"), pointerEvents: "none" }} />
    </div>
  );
};
