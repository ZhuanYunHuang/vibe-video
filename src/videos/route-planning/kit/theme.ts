// 《导航怎么规划最优路线？》专属配色：高德风浅色地图 + 蓝绿主色
export const P = {
  bg: "#EEF5F3",
  land: "#E2EDEA",
  block: "#D3E5E0",
  water: "#B7DFEE",
  park: "#CDE9C6",
  road: "#FFFFFF",
  roadEdge: "#CDDED9",
  ink: "#14323E",
  sub: "#5C7681",
  line: "#C6D9D5",
  edge: "#8FB3AD",
  blue: "#1E8FE0",
  teal: "#12B3A2",
  green: "#28B96B",
  amber: "#F2A93B",
  red: "#F0553D",
  white: "#FFFFFF",
};

export const GRAD = `linear-gradient(90deg, ${P.blue}, ${P.teal})`;

// 路况配色：代价越大越堵
export const trafficColor = (w: number) => (w >= 6 ? P.red : w >= 4 ? P.amber : P.green);

// ---------- 示例路网（全片共用同一张图，坐标为 1920×1080 画布坐标） ----------
export type Pt = { x: number; y: number };

export const NODES: Pt[] = [
  { x: 180, y: 540 }, // 0 起点
  { x: 420, y: 300 },
  { x: 440, y: 560 },
  { x: 420, y: 800 },
  { x: 700, y: 270 },
  { x: 720, y: 520 },
  { x: 700, y: 800 },
  { x: 980, y: 320 },
  { x: 1000, y: 620 },
  { x: 980, y: 830 },
  { x: 1260, y: 520 }, // 10 终点
];

// [a, b, 通行时间（分钟）]
export const EDGES: [number, number, number][] = [
  [0, 1, 4],
  [0, 2, 2],
  [0, 3, 5],
  [1, 2, 1],
  [1, 4, 5],
  [2, 3, 2],
  [2, 5, 7],
  [3, 6, 3],
  [4, 5, 2],
  [4, 7, 3],
  [5, 6, 4],
  [5, 7, 6],
  [5, 8, 3],
  [6, 9, 2],
  [7, 10, 6],
  [8, 9, 3],
  [8, 10, 2],
  [9, 10, 4],
];

// 招牌转场所在拍：穷举「算不完」→ Dijkstra 登场
export const HERO_BEAT = 144;

export const START = 0;
export const END = 10;

export const edgeMid = (i: number): Pt => {
  const [a, b] = EDGES[i];
  return { x: (NODES[a].x + NODES[b].x) / 2, y: (NODES[a].y + NODES[b].y) / 2 };
};

export const edgeIndex = (a: number, b: number) =>
  EDGES.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a));

const ADJ: { v: number; w: number }[][] = NODES.map(() => []);
EDGES.forEach(([a, b, w]) => {
  ADJ[a].push({ v: b, w });
  ADJ[b].push({ v: a, w });
});

export const pathCost = (path: number[]) =>
  path.slice(1).reduce((s, v, i) => s + EDGES[edgeIndex(path[i], v)][2], 0);

// ---------- Dijkstra：预先跑一遍，场景只负责按拍"回放" ----------
export type DijStep = { u: number; d: number; relax: { v: number; d: number }[] };

const runDijkstra = () => {
  const dist = NODES.map(() => Infinity);
  const prev = NODES.map(() => -1);
  const done = NODES.map(() => false);
  dist[START] = 0;
  const steps: DijStep[] = [];
  for (;;) {
    let u = -1;
    for (let i = 0; i < NODES.length; i++) {
      if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
    }
    if (u < 0) break;
    done[u] = true;
    const relax: { v: number; d: number }[] = [];
    for (const { v, w } of ADJ[u]) {
      if (!done[v] && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
        relax.push({ v, d: dist[v] });
      }
    }
    steps.push({ u, d: dist[u], relax });
    if (u === END) break;
  }
  const path = [END];
  while (path[0] !== START) path.unshift(prev[path[0]]);
  return { steps, path, cost: dist[END] };
};

export const DIJ = runDijkstra();
export const BEST_PATH = DIJ.path; // 0-2-3-6-9-10：绕外环，13 分钟
export const NAIVE_PATH = [0, 2, 5, 8, 10]; // 直穿市中心：看着最近，14 分钟

// ---------- 穷举：起点到终点的全部简单路径 ----------
const allPaths = () => {
  const res: number[][] = [];
  const seen = NODES.map(() => false);
  const walk = (u: number, path: number[]) => {
    if (u === END) {
      res.push([...path]);
      return;
    }
    for (const { v } of ADJ[u]) {
      if (seen[v]) continue;
      seen[v] = true;
      path.push(v);
      walk(v, path);
      path.pop();
      seen[v] = false;
    }
  };
  seen[START] = true;
  walk(START, [START]);
  return res;
};

export const ALL_PATHS = allPaths();

// ---------- A* vs Dijkstra 网格搜索 ----------
export const GW = 21;
export const GH = 13;
export const G_START = { x: 2, y: 6 };
export const G_END = { x: 18, y: 6 };
export const isWall = (x: number, y: number) => x === 11 && y >= 3 && y <= 9;

const gridSearch = (heuristic: boolean) => {
  const id = (x: number, y: number) => y * GW + x;
  const h = (x: number, y: number) => (heuristic ? Math.abs(x - G_END.x) + Math.abs(y - G_END.y) : 0);
  const g = new Array(GW * GH).fill(Infinity);
  const prev = new Array(GW * GH).fill(-1);
  const closed = new Array(GW * GH).fill(false);
  const s = id(G_START.x, G_START.y);
  const e = id(G_END.x, G_END.y);
  g[s] = 0;
  const order: number[] = [];
  for (;;) {
    let best = -1;
    let bf = Infinity;
    let bh = Infinity;
    for (let i = 0; i < GW * GH; i++) {
      if (closed[i] || g[i] === Infinity) continue;
      const hi = h(i % GW, Math.floor(i / GW));
      const f = g[i] + hi;
      if (f < bf || (f === bf && hi < bh)) {
        best = i;
        bf = f;
        bh = hi;
      }
    }
    if (best < 0) break;
    closed[best] = true;
    order.push(best);
    if (best === e) break;
    const bx = best % GW;
    const by = Math.floor(best / GW);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = bx + dx;
      const ny = by + dy;
      if (nx < 0 || ny < 0 || nx >= GW || ny >= GH || isWall(nx, ny)) continue;
      const n = id(nx, ny);
      if (!closed[n] && g[best] + 1 < g[n]) {
        g[n] = g[best] + 1;
        prev[n] = best;
      }
    }
  }
  const path = [e];
  while (path[0] !== s) path.unshift(prev[path[0]]);
  return { order, path };
};

export const GRID_DIJ = gridSearch(false);
export const GRID_ASTAR = gridSearch(true);
