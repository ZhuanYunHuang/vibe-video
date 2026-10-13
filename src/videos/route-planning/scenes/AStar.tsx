import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, hit, pop, SceneProps, useAt, useT } from "../../../shared";
import { GH, GRID_ASTAR, GRID_DIJ, GW, G_END, G_START, P, isWall } from "../kit/theme";
import { Card, Chapter, Sub } from "../kit/ui";

const CELL = 38;

type Search = { order: number[]; path: number[] };

// 一块搜索网格：按 shown 数量依次点亮已探索格子，done 后画出路径
const Grid: React.FC<{ x: number; y: number; s: Search; shown: number; pathP: number; color: string }> = ({ x, y, s, shown, pathP, color }) => {
  const visited = new Set(s.order.slice(0, shown));
  const pathSet = new Set(s.path.slice(0, Math.round(pathP * s.path.length)));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: GW * CELL,
        height: GH * CELL,
        display: "grid",
        gridTemplateColumns: `repeat(${GW}, ${CELL}px)`,
        borderRadius: 16,
        overflow: "hidden",
        border: `3px solid ${P.line}`,
        background: P.white,
      }}
    >
      {Array.from({ length: GW * GH }, (_, i) => {
        const cx = i % GW;
        const cy = Math.floor(i / GW);
        const wall = isWall(cx, cy);
        const isS = cx === G_START.x && cy === G_START.y;
        const isE = cx === G_END.x && cy === G_END.y;
        const bg = isS
          ? P.blue
          : isE
            ? P.teal
            : wall
              ? P.ink
              : pathSet.has(i)
                ? P.amber
                : visited.has(i)
                  ? `${color}55`
                  : "transparent";
        return <div key={i} style={{ width: CELL, height: CELL, background: bg, boxShadow: `inset 0 0 0 1px ${P.line}88` }} />;
      })}
    </div>
  );
};

// 06 A*：加入"离终点还有多远"的估计，搜索范围大幅收拢
export const AStar: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 本幕 48 拍：第 16 拍重拍 A* 正好找到终点；第 32 拍重拍砸出结论
  const fAt = (i: number) => k(1 + i * 1.5);
  const runFrom = k(10);
  const aDoneAt = k(16);
  const rate = GRID_ASTAR.order.length / (aDoneAt - runFrom);
  const runTo = runFrom + GRID_DIJ.order.length / rate;
  const shown = Math.max(0, Math.floor((t - runFrom) * rate));
  const dijShown = Math.min(GRID_DIJ.order.length, shown);
  const aShown = Math.min(GRID_ASTAR.order.length, shown);
  const aHit = hit(t, aDoneAt, 6);
  const aPath = interpolate(t, [aDoneAt, aDoneAt + 20], [0, 1], CL);
  const dPath = interpolate(t, [runTo, runTo + 20], [0, 1], CL);
  const resAt = k(32);
  const res = pop(t, resAt, 12);
  const capAt = k(36);

  const TERMS = [
    { text: "f", color: P.ink },
    { text: "=", color: P.sub },
    { text: "g", color: P.blue, note: "已经走了多远" },
    { text: "+", color: P.sub },
    { text: "h", color: P.teal, note: "估计还剩多远" },
  ];

  return (
    <>
      <Chapter t={t} step="06" title="更快一步：A* 算法" />

      {/* 公式 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", gap: 28, fontFamily: MONO, opacity: 1 - res }}>
        {TERMS.map((term, i) => {
          const s = pop(t, fAt(i), 11);
          return (
            <div key={i} style={{ textAlign: "center", opacity: s, transform: `translateY(${(1 - s) * -60}px) scale(${1 + hit(t, fAt(i), 4) * 0.2})` }}>
              <div style={{ fontSize: 80, fontWeight: 900, color: term.color, lineHeight: 1 }}>{term.text}</div>
              {term.note ? <div style={{ fontFamily: FONT, fontSize: 26, color: term.color, fontWeight: 700, marginTop: 6 }}>{term.note}</div> : null}
            </div>
          );
        })}
      </div>

      {/* 左右对比 */}
      {[
        { x: 120, s: GRID_DIJ, shown: dijShown, path: dPath, color: P.blue, name: "Dijkstra：四面八方都要找", n: dijShown },
        { x: 1002, s: GRID_ASTAR, shown: aShown, path: aPath, color: P.teal, name: "A*：朝着终点找", n: aShown },
      ].map((g) => (
        <React.Fragment key={g.name}>
          <div
            style={{
              position: "absolute",
              left: g.x,
              top: 330,
              fontFamily: FONT,
              fontSize: 32,
              fontWeight: 900,
              color: g.color,
              opacity: pop(t, k(8), 12),
              transform: `scale(${1 + (g.s === GRID_ASTAR ? aHit * 0.15 : 0)})`,
              transformOrigin: "left center",
            }}
          >
            {g.name}
            <span style={{ fontFamily: MONO, fontSize: 28, color: P.sub, marginLeft: 16 }}>搜了 {g.n} 格</span>
          </div>
          <Grid x={g.x} y={385} s={g.s} shown={g.shown} pathP={g.path} color={g.color} />
        </React.Fragment>
      ))}

      {/* 结论 */}
      {t >= resAt ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center" }}>
          <Card accent={P.teal} style={{ fontSize: 44, fontWeight: 900, opacity: res, transform: `scale(${0.6 + res * 0.4})` }}>
            同样的最优路线，A* 只搜了 <span style={{ fontFamily: MONO, color: P.teal }}>{Math.round((GRID_ASTAR.order.length / GRID_DIJ.order.length) * 100)}%</span> 的范围
          </Card>
        </div>
      ) : null}

      <Sub t={t} from={capAt} text="再加一点『大概还剩多远』的方向感，就能少走很多冤枉路" />
    </>
  );
};
