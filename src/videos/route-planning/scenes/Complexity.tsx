import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, hit, pop, SceneProps, useAt, useT } from "../../../shared";
import { P } from "../kit/theme";
import { Card, Chapter, Sub } from "../kit/ui";

const LEVELS = [
  { n: 300, label: "一个小区" },
  { n: 50000, label: "一座城市" },
  { n: 30000000, label: "全国路网" },
];

// 伪随机但确定的点阵位置
const DOTS = Array.from({ length: 600 }, (_, i) => ({
  x: (Math.sin(i * 12.9898) * 43758.5453) % 1,
  y: (Math.sin(i * 78.233) * 12345.678) % 1,
}));

// 08 为什么能秒算：数据再大，算法也扛得住
export const Complexity: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 本幕 32 拍：第 16 拍重拍跳到「全国路网」千万级
  const LV_BEATS = [2, 8, 16];
  const lvAt = (i: number) => k(LV_BEATS[i]);
  const lv = LEVELS.reduce((m, _, i) => (t >= lvAt(i) ? i : m), -1);
  const prev = lv > 0 ? LEVELS[lv - 1].n : 0;
  const num = lv < 0 ? 0 : Math.round(interpolate(t, [lvAt(lv), lvAt(lv) + k(2)], [prev, LEVELS[lv].n], CL));
  const dotCount = [0, 60, 220, 600][lv + 1];
  const oAt = k(20);
  const o = pop(t, oAt, 12);
  const msAt = k(24);
  const capAt = k(26);

  return (
    <>
      <Chapter t={t} step="08" title="为什么它能「秒算」？" />

      {/* 左：点阵加密 */}
      <div style={{ position: "absolute", left: 120, top: 200, width: 760, height: 640, borderRadius: 30, background: P.white, border: `3px solid ${P.line}`, overflow: "hidden" }}>
        {DOTS.slice(0, dotCount).map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 20 + Math.abs(d.x) * 720,
              top: 20 + Math.abs(d.y) * 600,
              width: 8,
              height: 8,
              borderRadius: 4,
              background: i % 3 === 0 ? P.teal : P.blue,
              opacity: 0.75,
            }}
          />
        ))}
        <div style={{ position: "absolute", left: 16, bottom: 16, padding: "8px 18px", borderRadius: 20, background: `${P.white}ee`, fontFamily: FONT }}>
          <div style={{ fontSize: 30, color: P.sub, fontWeight: 700 }}>{lv >= 0 ? LEVELS[lv].label : ""}</div>
          <div style={{ fontFamily: MONO, fontSize: 84, fontWeight: 900, color: P.ink, transform: `scale(${1 + (lv >= 0 ? hit(t, lvAt(lv), 6) * 0.1 : 0)})`, transformOrigin: "left" }}>
            {num.toLocaleString("en-US")}
            <span style={{ fontFamily: FONT, fontSize: 32, color: P.sub }}> 个路口</span>
          </div>
        </div>
      </div>

      {/* 右：复杂度 */}
      <div style={{ position: "absolute", left: 980, top: 240, width: 820, display: "flex", flexDirection: "column", gap: 30 }}>
        <Card accent={P.blue} style={{ opacity: o, transform: `translateX(${(1 - o) * 120}px)` }}>
          <div style={{ fontSize: 30, color: P.sub, fontWeight: 700 }}>堆优化 Dijkstra 的时间复杂度</div>
          <div style={{ fontFamily: MONO, fontSize: 72, fontWeight: 900, color: P.blue, marginTop: 10 }}>O((V+E)·log V)</div>
          <div style={{ fontSize: 28, color: P.sub, marginTop: 6 }}>V = 路口数，E = 道路数；log 让规模增长变得「温和」</div>
        </Card>
        <Card accent={P.teal} style={{ opacity: pop(t, msAt, 12), transform: `translateX(${(1 - pop(t, msAt, 12)) * 120}px)` }}>
          <div style={{ fontSize: 34, fontWeight: 900 }}>
            再加上 <span style={{ color: P.teal }}>A* 方向感</span> + <span style={{ color: P.teal }}>路网分层预处理</span>
          </div>
          <div style={{ fontSize: 30, color: P.sub, marginTop: 8 }}>
            千万级路口，也能在 <b style={{ fontFamily: MONO, color: P.teal, fontSize: 40 }}>毫秒级</b> 算完
          </div>
        </Card>
      </div>

      <Sub t={t} from={capAt} text="靠优先队列和启发式，全国路网也能一眨眼算完" />
    </>
  );
};
