import React from "react";
import { interpolate } from "remotion";
import { CL, FocusZoom, SceneProps, pop, useAt, useT } from "../../../shared";
import { Battery, Line, LivingRoom, Mom, P, lightWarm } from "../kit";
import { T } from "../copy";

// 第 10 幕（b208–224）：她的夜 —— 收拾碗筷 → 盖上留给儿子的那碗 → 抱着全家福 → 门口留灯
// 门外的电量在她看不见的地方，悄悄回充 4 → 26
export const MomsNight: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const dishP = pop(t, k(6), 12); // 碗盖落下
  const lampP = interpolate(t, [k(12), k(14.5)], [0, 1], CL);
  const lvl = interpolate(t, [k(10), k(14)], [4, 26], CL);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <FocusZoom t={t} from={k(8)} dur={44} fromScale={1} toScale={1.16} x={1080} y={320} blur={4}>
        <LivingRoom t={t} dishes={false} steam={false} dim={0.42} clock={[21, 30]} parallax={0.5} vig={0.2} />

        {/* 留给儿子的那碗饭 + 盖上盖子 */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <ellipse cx={1240} cy={714} rx={58} ry={16} fill="#FFFDF6" stroke="#D8DEE9" strokeWidth={2.5} />
          <ellipse cx={1240} cy={708} rx={44} ry={11} fill="#F5C542" opacity={0.85} />
          <g transform={`translate(1240 700) scale(${0.7 + dishP * 0.3}) translate(-1240 -700)`}>
            <path d="M1189 700 a51 22 0 0 1 102 0 Z" fill="#FFFFFF" stroke="#D8DEE9" strokeWidth={3} />
            <circle cx={1240} cy={674} r={9} fill="#C98A4B" />
          </g>
        </svg>

        {/* 妈妈：收拾 → 抱全家福 */}
        <Mom x={620} y={968} s={0.92} mood="sad" armL={t < k(10) ? 34 : 0} dish={t < k(10)} photo={t >= k(10)} breathe={0.6} dim={0.15} />

        {/* 门口的灯：留一盏给他 */}
        <div style={{ position: "absolute", left: 70, top: 260, width: 210, height: 640 }}>
          <div style={{ position: "absolute", inset: 0, background: lightWarm(0.34 * lampP, "30%", "46%") }} />
        </div>
      </FocusZoom>

      {/* 房门（左）+ 门缝透光 */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <rect x={70} y={260} width={210} height={640} rx={8} fill="#3E3226" stroke={P.dim} strokeWidth={4} />
        <rect x={286} y={270} width={8} height={620} fill={P.amber} opacity={lampP} />
      </svg>

      {/* 门外的电量：悄悄回充 */}
      <Battery t={t} x={1560} y={140} w={420} level={lvl} ghost charging={t >= k(11)} delta={t >= k(11) ? { v: 22, at: k(11) } : undefined} />

      <Line t={t} from={k(3)} until={k(9)} parts={T.night} size={52} />
      <Line t={t} from={k(9.4)} until={k(13.4)} parts={T.nightDish} size={52} />
      <Line t={t} from={k(13.8)} parts={T.nightLight} size={52} />
    </div>
  );
};
