import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, hit, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { NodeDot, RoadNet, Stage } from "../kit/MapKit";
import { EDGES, NODES, P } from "../kit/theme";
import { Card, Chapter, Sub } from "../kit/ui";

// 马路上跑的小车：from 为出发拍，dur 为行驶拍数（都在第 9~16 拍之间）
const CARS = [
  { path: [0, 1, 4, 7, 10], from: 9, dur: 6.5, color: P.blue },
  { path: [3, 6, 9, 10], from: 9.5, dur: 5.5, color: P.teal },
  { path: [10, 8, 5, 2, 0], from: 10, dur: 5.5, color: P.amber },
  { path: [7, 5, 6, 3], from: 10.5, dur: 5, color: P.green },
];

// 沿节点序列取 p（0→1）处的位置与朝向
const along = (path: number[], p: number) => {
  const pts = path.map((i) => NODES[i]);
  const lens = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.y - pts[i].y));
  let d = p * lens.reduce((a, b) => a + b, 0);
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const a = pts[i];
      const b = pts[i + 1];
      const r = Math.min(1, d / lens[i]);
      return { x: a.x + (b.x - a.x) * r, y: a.y + (b.y - a.y) * r, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
    }
    d -= lens[i];
  }
  return { x: pts[0].x, y: pts[0].y, a: 0 };
};

// 02 地图 → 图：马路褪成连线，路口变成节点
export const MapToGraph: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 前半乐句：马路每半拍铺一条；第 16 拍重拍：马路"啪"地变成图，节点每半拍弹出
  const roadIn = (i: number) => prog(t, k(i * 0.5), 8);
  const morphAt = k(16);
  const morph = prog(t, morphAt, 6);
  const jump = hit(t, morphAt, 6);
  const nodeAt = (i: number) => k(16 + i * 0.5);
  const edgeAt = k(16);
  const card1 = pop(t, k(18), 12);
  const card2 = pop(t, k(22), 12);
  const capAt = k(26);
  const roadOpacity = interpolate(morph, [0, 1], [1, 0], CL);

  // 马路铺完（第 9 拍）到变图（第 16 拍）之间：小车上路 + 扫描线识别路口
  const scanFrom = k(11);
  const scanTo = k(15.5);
  const scanX = interpolate(t, [scanFrom, scanTo], [100, 1340], CL);
  const scanOn = t >= scanFrom && t < morphAt;
  const scanned = NODES.filter((n) => scanOn && n.x <= scanX).length;
  const hintS = pop(t, k(11), 12) * interpolate(t, [morphAt - 6, morphAt], [1, 0], CL);

  return (
    <>
      <Chapter t={t} step="02" title="地图，在它眼里是一张「图」" />
      <Stage style={{ transform: `scale(${1 + jump * 0.05})` }}>
        <g opacity={roadOpacity}>
          <RoadNet appear={roadIn} mode="road" />
        </g>
        <g opacity={morph}>
          <RoadNet appear={(i) => prog(t, edgeAt + i * 1.5, 6)} mode="graph" />
        </g>
        {/* 小车沿马路行驶，变图时随马路一起淡出 */}
        <g opacity={roadOpacity}>
          {CARS.map((c, i) => {
            const p = interpolate(t, [k(c.from), k(c.from + c.dur)], [0, 1], CL);
            if (t < k(c.from)) return null;
            const pos = along(c.path, p);
            return (
              <g key={i} transform={`translate(${pos.x} ${pos.y}) rotate(${pos.a})`} opacity={interpolate(p, [0, 0.08, 0.92, 1], [0, 1, 1, 0])}>
                <rect x={-20} y={-11} width={40} height={22} rx={8} fill={c.color} stroke={P.white} strokeWidth={3} />
                <path d="M6 -6 L16 0 L6 6 Z" fill={P.white} />
              </g>
            );
          })}
        </g>
        {/* 扫描线：扫过的路口亮起蓝圈，为下一拍"路口变成点"埋伏笔 */}
        {scanOn ? (
          <g>
            <rect x={scanX - 120} y={90} width={120} height={800} fill={`url(#scanGrad)`} />
            <line x1={scanX} y1={90} x2={scanX} y2={890} stroke={P.blue} strokeWidth={4} />
            <defs>
              <linearGradient id="scanGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={P.blue} stopOpacity={0} />
                <stop offset="100%" stopColor={P.blue} stopOpacity={0.18} />
              </linearGradient>
            </defs>
            {NODES.map((n, i) => {
              if (n.x > scanX) return null;
              // 刚被扫到时圈最大，随扫描线远离逐渐收小
              const ring = Math.exp(-(scanX - n.x) / 80);
              return <circle key={i} cx={n.x} cy={n.y} r={30 + ring * 26} fill="none" stroke={P.blue} strokeWidth={5} opacity={0.4 + ring * 0.6} />;
            })}
          </g>
        ) : null}
        {NODES.map((_, i) => {
          const s = pop(t, nodeAt(i), 11);
          const cross = 1 - morph;
          return (
            <g key={i}>
              {/* 路口示意：先是小白圈，变形后成为节点 */}
              {cross > 0 ? <NodeDot i={i} s={pop(t, k(i * 0.8), 12) * cross} r={14} ring={P.roadEdge} /> : null}
              <NodeDot i={i} s={s} ring={P.blue} r={24} glow={Math.exp(-Math.max(0, t - nodeAt(i)) / 6)} />
            </g>
          );
        })}
      </Stage>

      {/* 识别进度提示：变图前让位给后面的两张卡 */}
      {hintS > 0.01 ? (
        <div style={{ position: "absolute", left: 1380, top: 380, width: 460, fontFamily: FONT, opacity: hintS, transform: `translateX(${(1 - Math.min(1, hintS)) * 80}px)` }}>
          <Card accent={P.blue}>
            <div style={{ fontSize: 30, color: P.sub, fontWeight: 700 }}>正在识别路口…</div>
            <div style={{ fontFamily: MONO, fontSize: 80, fontWeight: 900, color: P.blue, marginTop: 4 }}>
              {scanned}
              <span style={{ fontSize: 34, color: P.sub }}> / {NODES.length}</span>
            </div>
          </Card>
        </div>
      ) : null}

      <div style={{ position: "absolute", left: 1380, top: 330, width: 460, display: "flex", flexDirection: "column", gap: 30, fontFamily: FONT }}>
        <Card accent={P.blue} style={{ opacity: card1, transform: `translateX(${(1 - card1) * 120}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width={50} height={50}>
              <circle cx={25} cy={25} r={18} fill={P.white} stroke={P.blue} strokeWidth={6} />
            </svg>
            <div style={{ fontSize: 40, fontWeight: 900 }}>路口 = 点</div>
          </div>
          <div style={{ fontSize: 28, color: P.sub, marginTop: 8 }}>共 {NODES.length} 个节点</div>
        </Card>
        <Card accent={P.teal} style={{ opacity: card2, transform: `translateX(${(1 - card2) * 120}px)` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <svg width={50} height={50}>
              <line x1={4} y1={25} x2={46} y2={25} stroke={P.teal} strokeWidth={7} strokeLinecap="round" />
            </svg>
            <div style={{ fontSize: 40, fontWeight: 900 }}>道路 = 线</div>
          </div>
          <div style={{ fontSize: 28, color: P.sub, marginTop: 8 }}>共 {EDGES.length} 条边</div>
        </Card>
      </div>

      <Sub t={t} from={capAt} text="它不用眼睛看地图——它把地图变成一张『图』：路口是点，道路是线" />
    </>
  );
};
