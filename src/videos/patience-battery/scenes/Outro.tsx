import React from "react";
import { interpolate } from "remotion";
import { CL, SceneProps, StaggerText, useAt, useT } from "../../../shared";
import { Battery, NeonTitle, P, glow, vignette } from "../kit";
import { T } from "../copy";

// 第 15 幕（b288–304）：金句 + 片名落版 + 电量条回到 100% 定格
export const Outro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const fade = interpolate(t, [k(14), k(16)], [0, 1], CL);
  const lvl = interpolate(t, [k(8), k(12)], [74, 100], CL);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: P.night }}>
      {/* 星点 */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (i * 149) % 1860;
        const y = 60 + ((i * 89) % 900);
        const tw = 0.25 + 0.25 * Math.sin(t / 12 + i * 2.1);
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 3, height: 3, borderRadius: "50%", background: "#cfe6ff", opacity: Math.max(0.06, tw) }} />;
      })}

      <div style={{ position: "absolute", left: 0, right: 0, top: 232, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 84, color: "#FFFFFF" }}>
        {t >= k(2) ? <StaggerText t={t} from={k(2)} text={T.end1} step={2.2} /> : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 366, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 900, fontSize: 96, color: "#FFFFFF" }}>
        {t >= k(5) ? <StaggerText t={t} from={k(5)} text={T.end2} step={2.2} /> : null}
      </div>
      {/* 高亮「最爱我们的人」 */}
      {t >= k(8) ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 366,
            textAlign: "center",
            fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
            fontWeight: 900,
            fontSize: 96,
            color: P.amber,
            textShadow: glow(P.amber, 1.1),
            opacity: interpolate(t, [k(8), k(9)], [0, 1], CL),
          }}
        >
          {T.end2}
        </div>
      ) : null}

      {/* 电量条：回满 100% 定格（母题收束） */}
      <div style={{ position: "absolute", inset: 0, opacity: interpolate(t, [k(7), k(9)], [0, 1], CL) }}>
        <Battery t={t} x={960} y={596} w={720} level={lvl} charging delta={t >= k(8) && t < k(11) ? { v: 26, at: k(8) } : undefined} />
      </div>

      <NeonTitle t={t} from={k(10)} text={T.title} color={P.cool} size={126} y={786} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 856, textAlign: "center", fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif', fontWeight: 700, fontSize: 36, letterSpacing: 8, color: P.dim, opacity: interpolate(t, [k(11.5), k(12.5)], [0, 1], CL) }}>
        —— {T.subtitle} ——
      </div>

      <div style={{ position: "absolute", inset: 0, background: vignette(0.34), pointerEvents: "none" }} />
      {/* 结尾渐暗 */}
      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: fade, pointerEvents: "none" }} />
    </div>
  );
};
