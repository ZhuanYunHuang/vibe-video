import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, hit, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { DistLabel, NodeDot, PathLine, RoadNet, Stage, Weights } from "../kit/MapKit";
import { BEST_PATH, DIJ, EDGES, GRAD, NODES, P, START, edgeIndex } from "../kit/theme";
import { Card, Chapter, Sub } from "../kit/ui";

// 本幕 48 拍：第 16 拍重拍正好是第 6 轮锁定，第 32 拍重拍画出最优路线
const STEP_BEAT = 6; // 第一轮所在拍（前 3 拍被招牌转场盖住）
const STEP_GAP = 2; // 每轮 2 拍：第 1 拍锁定，第 2 拍松弛
const RELAX_DELAY = 1;

// 05 Dijkstra：每次锁定离起点最近的点，再用它松弛邻居
export const Dijkstra: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  const stepAt = (i: number) => k(STEP_BEAT + i * STEP_GAP);
  const relaxAt = (i: number) => k(STEP_BEAT + i * STEP_GAP + RELAX_DELAY);

  // 按拍回放预计算好的 Dijkstra 过程
  const dist: number[] = NODES.map((_, i) => (i === START ? 0 : Infinity));
  const locked = NODES.map(() => false);
  const flash = NODES.map(() => 0);
  const relaxEdges: number[] = [];
  let cur = -1;
  let curStep = -1;
  DIJ.steps.forEach((s, i) => {
    if (t < stepAt(i)) return;
    locked[s.u] = true;
    cur = s.u;
    curStep = i;
    if (t >= relaxAt(i)) {
      s.relax.forEach((r) => {
        dist[r.v] = r.d;
        flash[r.v] = Math.max(flash[r.v], hit(t, relaxAt(i), 6));
      });
    }
  });
  // 只高亮当前这一轮的松弛边
  if (curStep >= 0 && t >= relaxAt(curStep)) {
    const s = DIJ.steps[curStep];
    s.relax.forEach((r) => relaxEdges.push(edgeIndex(s.u, r.v)));
  }
  const queue = NODES.map((_, i) => i)
    .filter((i) => !locked[i] && dist[i] < Infinity)
    .sort((a, b) => dist[a] - dist[b]);

  const lastStep = DIJ.steps.length - 1;
  const pathAt = k(Math.max(32, STEP_BEAT + lastStep * STEP_GAP + 2));
  const pathP = prog(t, pathAt, k(2));
  const nameS = pop(t, k(3), 12);
  // 路线画完后逐拍累加每段耗时：2 + 2 + 3 + 2 + 4 = 13
  const sumAt = (i: number) => pathAt + k(2) + k(i);
  const segs = BEST_PATH.slice(1).map((v, i) => EDGES[edgeIndex(BEST_PATH[i], v)][2]);
  const sumShown = segs.filter((_, i) => t >= sumAt(i)).length;
  const totalAt = sumAt(segs.length);
  const capAt = k(44); // 累加式让位给字幕
  const sumOut = interpolate(t, [capAt - 4, capAt], [1, 0], CL);

  return (
    <>
      <Chapter t={t} step="05" title="Dijkstra 算法" />
      <Stage>
        <RoadNet mode="graph" dim={(i) => (pathP > 0 && !BEST_PATH.some((v, j) => j > 0 && edgeIndex(BEST_PATH[j - 1], v) === i) ? 0.4 : 1)} />
        {/* 当前轮被松弛的边 */}
        {relaxEdges.map((ei) => {
          const [a, b] = EDGES[ei];
          return <line key={ei} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke={P.amber} strokeWidth={10} strokeLinecap="round" opacity={0.8} />;
        })}
        <PathLine path={BEST_PATH} p={pathP} id="dij" width={18} />
        <Weights appear={() => 1} color={() => P.sub} />
        {NODES.map((_, i) => {
          const isCur = i === cur && pathP <= 0;
          return (
            <NodeDot
              key={i}
              i={i}
              r={24}
              fill={locked[i] ? (isCur ? P.blue : P.teal) : P.white}
              ring={locked[i] ? P.white : P.blue}
              glow={isCur ? 1 : 0}
              label={String.fromCharCode(65 + i)}
            />
          );
        })}
        {NODES.map((_, i) => (
          <DistLabel key={i} i={i} text={dist[i] === Infinity ? "∞" : String(dist[i])} color={locked[i] ? P.teal : P.blue} flash={flash[i]} />
        ))}
      </Stage>

      {/* 逐拍累加：2 + 2 + 3 + 2 + 4 = 13 分钟 */}
      {sumShown > 0 ? (
        <div style={{ position: "absolute", left: 0, width: 1380, top: 900, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, fontFamily: MONO, fontWeight: 900, opacity: sumOut }}>
          {segs.slice(0, sumShown).map((w, i) => (
            <React.Fragment key={i}>
              {i > 0 ? <span style={{ fontSize: 48, color: P.sub }}>+</span> : null}
              <span
                style={{
                  fontSize: 60,
                  color: P.blue,
                  display: "inline-block",
                  transform: `translateY(${(1 - pop(t, sumAt(i), 10)) * -50}px) scale(${1 + hit(t, sumAt(i), 4) * 0.4})`,
                }}
              >
                {w}
              </span>
            </React.Fragment>
          ))}
          {t >= totalAt ? (
            <>
              <span style={{ fontSize: 48, color: P.sub }}>=</span>
              <span
                style={{
                  padding: "4px 28px",
                  borderRadius: 40,
                  background: GRAD,
                  color: P.white,
                  fontSize: 70,
                  display: "inline-block",
                  transform: `scale(${pop(t, totalAt, 9) * (1 + hit(t, totalAt, 5) * 0.3)})`,
                }}
              >
                {DIJ.cost} 分钟
              </span>
            </>
          ) : null}
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 1380, top: 190, width: 480, display: "flex", flexDirection: "column", gap: 22, fontFamily: FONT }}>
        <Card accent={P.blue} style={{ opacity: nameS, transform: `translateX(${(1 - nameS) * 120}px)`, padding: "20px 28px" }}>
          <div style={{ fontSize: 26, color: P.sub }}>Edsger W. Dijkstra · 1959</div>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8, lineHeight: 1.5 }}>
            ① 取出<span style={{ color: P.blue }}>离起点最近</span>的点，锁定
            <br />② 用它<span style={{ color: P.amber }}>松弛</span>邻居：发现更短就更新
          </div>
        </Card>
        <Card style={{ opacity: pop(t, k(4), 12), padding: "20px 28px", transform: `scale(${1 + hit(t, stepAt(Math.max(0, curStep)), 5) * (curStep >= 0 ? 0.04 : 0)})` }}>
          <div style={{ fontSize: 26, color: P.sub, fontWeight: 700 }}>
            优先队列 <span style={{ fontFamily: MONO, fontSize: 22 }}>（小的先出）</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14, minHeight: 64 }}>
            {queue.slice(0, 6).map((v, j) => (
              <div
                key={v}
                style={{
                  padding: "8px 14px",
                  borderRadius: 14,
                  background: j === 0 ? P.blue : P.bg,
                  color: j === 0 ? P.white : P.ink,
                  fontFamily: MONO,
                  fontSize: 26,
                  fontWeight: 900,
                  transform: `scale(${1 + flash[v] * 0.2})`,
                }}
              >
                {String.fromCharCode(65 + v)}:{dist[v]}
              </div>
            ))}
            {queue.length === 0 && t >= stepAt(0) ? <div style={{ fontSize: 26, color: P.sub }}>（空）</div> : null}
          </div>
        </Card>
        <Card style={{ opacity: pop(t, stepAt(0), 12), padding: "16px 28px" }}>
          <div style={{ fontSize: 26, color: P.sub }}>
            第 <b style={{ fontFamily: MONO, color: P.ink, fontSize: 34 }}>{curStep + 1}</b> 轮 · 已锁定{" "}
            <b style={{ fontFamily: MONO, color: P.teal, fontSize: 34 }}>{locked.filter(Boolean).length}</b> / {NODES.length}
          </div>
        </Card>
      </div>

      <Sub t={t} from={capAt} text="从起点出发，每次只扩展最近的点——一步步把最优路线逼出来" />
    </>
  );
};
