import React from "react";
import { FONT, MONO, hit, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { NodeDot, PathLine, Pin, RoadNet, Stage, Weights } from "../kit/MapKit";
import { BEST_PATH, END, NAIVE_PATH, NODES, P, START, pathCost } from "../kit/theme";
import { Card, Chapter, Sub } from "../kit/ui";

// 03 "最优"的定义：每条路有代价（通行时间），最短 ≠ 最快
export const Weighted: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 前半乐句：18 个权重每半拍砸一个 → 路况上色；第 16 拍重拍：红色"看着最近"的路线砸出
  const wAt = (i: number) => k(2 + i * 0.5);
  const traffic = prog(t, k(12), k(2));
  const naiveP = prog(t, k(16), 8);
  const c1 = pop(t, k(16), 10);
  const c1Hit = hit(t, k(16), 6);
  const bestP = prog(t, k(22), k(2));
  const c2 = pop(t, k(24), 12);
  const capAt = k(28);

  return (
    <>
      <Chapter t={t} step="03" title="「最优」到底是什么？" />
      <Stage>
        <RoadNet mode="graph" traffic={traffic} />
        <PathLine path={NAIVE_PATH} p={naiveP} color={P.red} width={12} id="naive" />
        <PathLine path={BEST_PATH} p={bestP} id="best3" />
        {NODES.map((_, i) => (
          <NodeDot key={i} i={i} ring={P.blue} r={18} />
        ))}
        <Weights appear={(i) => pop(t, wAt(i), 12)} />
        <Pin x={NODES[START].x} y={NODES[START].y} color={P.blue} text="出发" />
        <Pin x={NODES[END].x} y={NODES[END].y} color={P.teal} text="到达" />
      </Stage>

      <div style={{ position: "absolute", left: 1380, top: 250, width: 470, display: "flex", flexDirection: "column", gap: 28, fontFamily: FONT }}>
        <Card style={{ fontSize: 30, color: P.sub, opacity: pop(t, k(5), 12) }}>
          边上的数字 = <b style={{ color: P.ink }}>通行时间（分钟）</b>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 26 }}>
            <span style={{ color: P.green, fontWeight: 900 }}>● 畅通</span>
            <span style={{ color: P.amber, fontWeight: 900 }}>● 缓行</span>
            <span style={{ color: P.red, fontWeight: 900 }}>● 拥堵</span>
          </div>
        </Card>
        <Card accent={P.red} style={{ opacity: c1, transform: `translateX(${(1 - c1) * 120}px) scale(${1 + c1Hit * 0.1})` }}>
          <div style={{ fontSize: 30, color: P.red, fontWeight: 900 }}>✕ 直穿市中心</div>
          <div style={{ fontSize: 28, color: P.sub, marginTop: 6 }}>看着最近，但一路拥堵</div>
          <div style={{ fontFamily: MONO, fontSize: 56, fontWeight: 900, color: P.red, marginTop: 4 }}>{pathCost(NAIVE_PATH)} 分钟</div>
        </Card>
        <Card accent={P.teal} style={{ opacity: c2, transform: `translateX(${(1 - c2) * 120}px)` }}>
          <div style={{ fontSize: 30, color: P.teal, fontWeight: 900 }}>✓ 绕外环</div>
          <div style={{ fontSize: 28, color: P.sub, marginTop: 6 }}>多走几步，但一路畅通</div>
          <div style={{ fontFamily: MONO, fontSize: 56, fontWeight: 900, color: P.teal, marginTop: 4 }}>{pathCost(BEST_PATH)} 分钟</div>
        </Card>
      </div>

      <Sub t={t} from={capAt} text="『最优』不是最短，而是总代价最小——每条路都有一个代价" />
    </>
  );
};
