import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, SceneProps, useAt, useT } from "../../../shared";
import { PathLine, RoadNet, Stage } from "../kit/MapKit";
import { BEST_PATH, GRAD, P } from "../kit/theme";
import { Card } from "../kit/ui";

const STEPS = [
  { no: "1", title: "提问", desc: "哪条路最快？" },
  { no: "2", title: "建模", desc: "地图 → 带权图" },
  { no: "3", title: "求解", desc: "Dijkstra / A*" },
];

// 09 结尾：三步回顾 + 收尾金句 + 淡出
export const Outro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 本幕 32 拍：第 16 拍重拍砸出收尾金句，最后 4 拍淡出
  const cardAt = (i: number) => k(2 + i * 4);
  const finAt = k(16);
  const fin = pop(t, finAt, 13);
  const pathP = interpolate(t, [k(10), k(16)], [0, 1], CL);
  const fadeOut = interpolate(t, [k(28), k(32)], [1, 0], CL);

  return (
    <div style={{ position: "absolute", inset: 0, opacity: fadeOut }}>
      {/* 背景淡淡的路网 + 最优路线描出 */}
      <Stage style={{ opacity: 0.35, transform: "translate(240px, 120px) scale(0.75)" }}>
        <RoadNet mode="graph" />
        <PathLine path={BEST_PATH} p={pathP} id="outro" width={18} />
      </Stage>

      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: FONT, fontSize: 56, fontWeight: 900, color: P.ink, opacity: pop(t, k(1), 14) }}>
        导航规划路线，就三步
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", alignItems: "center", gap: 30 }}>
        {STEPS.map((s, i) => {
          const p = pop(t, cardAt(i), 12);
          return (
            <React.Fragment key={s.no}>
              {i > 0 ? <div style={{ fontSize: 60, color: P.teal, fontWeight: 900, opacity: p }}>→</div> : null}
              <Card style={{ width: 400, opacity: p, transform: `translateY(${(1 - p) * 120}px)` }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: GRAD, color: P.white, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 36, fontWeight: 900 }}>
                  {s.no}
                </div>
                <div style={{ marginTop: 16, fontSize: 48, fontWeight: 900 }}>{s.title}</div>
                <div style={{ marginTop: 8, fontSize: 30, color: P.sub }}>{s.desc}</div>
              </Card>
            </React.Fragment>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 680, textAlign: "center", fontFamily: FONT, opacity: fin, transform: `scale(${0.7 + fin * 0.3})` }}>
        <div style={{ fontSize: 60, fontWeight: 900, color: P.ink }}>
          每一次「开始导航」，都是一次
          <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>最短路计算</span>
        </div>
        <div style={{ marginTop: 20, fontSize: 34, color: P.sub, opacity: pop(t, k(20), 12) }}>下次出门，你就知道它在替你算什么了</div>
      </div>
    </div>
  );
};
