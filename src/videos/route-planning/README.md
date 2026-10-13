# 《导航怎么规划最优路线？》（RoutePlanning）

> 一句话定位：从"导航凭什么选这条路"出发，引出 Dijkstra 与 A*，最后落到计算机科学里的「图的最短路径问题」。

## 这是什么

1. 开场：逐拍砸出标题。
2. 提问：拟真导航界面，输入目的地弹出 3 条路线，推荐的偏偏不是最短那条——它凭什么？
3. 建模：地图褪成「图」，路口是点、道路是线。
4. 最优的定义：边权 = 通行时间；直穿市中心 14 分钟 vs 绕外环 13 分钟。
5. 笨办法：穷举全部 78 条路线，路口一多就组合爆炸。
6. Dijkstra：按拍回放真实算法过程（锁定最近点 → 松弛邻居 → 优先队列），逼出 13 分钟的最优路线。
7. A*：`f = g + h`，同一网格下搜索范围只有 Dijkstra 的约三分之一。
8. 回到计算机：图的最短路径问题，1956 构思 / 1959 发表 / 1968 A*。
9. 为什么能秒算：`O((V+E)·log V)` + 启发式 + 路网分层预处理。
10. 结尾：提问 → 建模 → 求解。

## 怎么做

- **专属 `kit/`**：
  - `kit/theme.ts`：配色 `P`、示例路网 `NODES/EDGES`；模块加载时**预先跑好** Dijkstra（`DIJ`）、穷举（`ALL_PATHS`）、网格版 Dijkstra/A*（`GRID_DIJ/GRID_ASTAR`），场景只负责按拍回放，画面里的数字都是真实算法结果。
  - `kit/MapKit.tsx`：纯 props 的 SVG 原语（`Stage/RoadNet/Weights/NodeDot/PathLine/DistLabel/Pin`），封面也复用。
  - `kit/ui.tsx`：`MapBackdrop`、`AmapHud`、浅色 `Sub`/`Chapter`/`Card`、`PhoneFrame`。shared 的 `Caption/SceneTitle` 是深色写死的，浅色风不能直接用。
- **节拍卡点**：BGM `public/route-planning/bgm.mp3` 由 web-request 原曲 `atempo=1.25` 提速而来（`bpm 141 / offset 10`；`npm run beat` 会误判成半速 70.5）。场景内统一 `useAt(start, k)`；卡点只落在内容上（元素出场、数字砸入、算法每轮），画面本身不随拍晃动；HUD 只在切场时轻闪一下。
- **招牌转场**（`kit/HeroWipe.tsx`，第 `HERO_BEAT = 144` 拍）：导航播报牌倒数 3-2-1 → 巨型蓝绿导航路线带箭头一拍一行蛇形铺满全屏（whoosh）→ 切场那一拍白闪 + 砸出「Dijkstra」（boom）→ 路线开走露出新场景。音效 `whoosh.wav` / `vine-boom.wav` 来自 remotion.media。

## 采用什么风格

**高德风浅色地图 + 蓝绿主色**：浅灰绿地图底、白色路网、河流与绿地底纹；品牌渐变 `#1E8FE0 → #12B3A2`；路况绿 / 黄 / 红表示边权；`exitDim: 0`。

## 场景表

| 拍号 | 场景 | 转场 | 讲什么 |
|---|---|---|---|
| 0–12 | Intro | none | 标题 |
| 12–44 | AppUI | zoom | 导航界面 + 提问 |
| 44–80 | MapToGraph | slideLeft | 地图 → 图 |
| 80–116 | Weighted | circle | 边权与"最短≠最快" |
| 116–152 | Exhaustive | blinds | 穷举爆炸 |
| 152–204 | Dijkstra | diag | 算法回放 |
| 204–248 | AStar | slideUp | f=g+h 与搜索范围对比 |
| 248–284 | BackToCS | spin | 最短路径问题与时间轴 |
| 284–312 | Complexity | glitch | 复杂度与秒算 |
| 312–336 | Outro | fade | 三步回顾 |
