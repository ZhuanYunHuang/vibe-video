import React from "react";
import { AbsoluteFill } from "remotion";
import { Battery, Mom, NightCity, NeonTitle, P, Worker, glow, vignette } from "./kit";
import { T } from "./copy";

// 《耐心电量》封面（静态图）：夜城 + 母子 + 低电量 + 片名
// 重规划后重新构图，消除三处覆盖层碰撞：
//   ① 副标题不再压在「居酒屋」招牌上（顶部加暗色柔光罩 + 副标题自带实底胶囊）
//   ② 电池白卡不再压住主角躯干（母子分置左右下角，电池居中，互不重叠）
//   ③ 片名不再压楼顶（片名上移到天空区，下方留出安全间距）
// 注意：封面是静态帧，不使用节拍 context（useT/useAt/useBeat/BeatGrid）。
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <NightCity t={0} parallax={0} vig={0.2} />

    {/* 顶部暗色柔光罩：给片名与副标题一块可读区（而不是硬删招牌） */}
    <div
      style={{
        position: "absolute",
        left: -200,
        right: -200,
        top: -180,
        height: 780,
        background: "radial-gradient(ellipse 62% 70% at 50% 34%, rgba(9,16,34,0.86) 0%, rgba(9,16,34,0.5) 48%, transparent 78%)",
      }}
    />

    {/* 母子（左右下角，避开中心） */}
    <Worker x={520} y={980} s={1.1} mood="tired" tilt={3} />
    <Mom x={1420} y={980} s={1.05} mood="worry" />

    {/* 地面的暖光（把人物落到地上） */}
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, height: 8, background: "rgba(255,243,214,0.18)" }} />

    {/* 低电量 */}
    <Battery t={30} x={960} y={790} w={620} level={4} label cracked />

    {/* 片名 + 副标题 */}
    <NeonTitle t={30} from={0} text={T.title} color={P.cool} size={166} y={286} />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 424,
        textAlign: "center",
        fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
        fontWeight: 700,
        fontSize: 40,
        letterSpacing: 8,
        color: "#FFFFFF",
      }}
    >
      <span style={{ background: "rgba(9,16,34,0.78)", padding: "12px 34px", borderRadius: 12, textShadow: glow(P.night, 0.8) }}>{T.subtitle}</span>
    </div>

    <div style={{ position: "absolute", inset: 0, background: vignette(0.42), pointerEvents: "none" }} />
  </AbsoluteFill>
);
