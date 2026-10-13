# 新视频计划书：《导航怎么规划最优路线？》（v2 · 高德蓝绿风）

> 依据 `.trae/skills/video-generation/SKILL.md` 编制。本文件即"脚本计划书"（分镜脚本 + 字幕文案 + 风格规范 + spec 参数 + 改动清单 + 验证步骤）。
> 确认后按此执行，产出 `src/videos/route-planning/` 业务目录、`public/route-planning/bgm.mp3` 资源与封面，并渲染成片。

---

## 一、本次优化点（对比 v1 初版）

| # | v1 初版 | v2 优化后 | 为什么更好 |
|---|---|---|---|
| 1 | 沿用默认深蓝霓虹风格（不建 `kit/`） | **自定义「高德蓝绿」风格**：浅色地图底 + 蓝绿渐变主色，建业务级 `kit/`（配色 / 地图原语 / UI），`exitDim: 0` | 用户指定；且导航主题天然是"浅色地图 App"，比霓虹风贴题得多 |
| 2 | 开场是"抽象两条路线" | **开场直接摆一台拟真导航界面**：搜索框输入目的地 → 弹出 3 张路线卡片（时间 / 红绿灯 / 距离），推荐卡高亮 | 一眼就有代入感，钩子更强；也为后面"它凭什么选这条"埋问题 |
| 3 | 只说"地图变图" | **补充"代价＝通行时间"的可视化**，并给出"最短距离 ≠ 最快路线"的对照 | 把"最优"的定义讲清楚，避免观众误解成"几何最短" |
| 4 | Dijkstra 只演示"逐轮外扩" | **补齐三件套**：距离标签 `∞→具体值` 实时更新、**松弛（relax）** 高亮、**优先队列**小队列可视化 | 这才是 Dijkstra 的真正机制，而不是"从近到远扩散"的空壳 |
| 5 | A\* 描述较虚 | 明确公式 **`f = g + h`**，左右对比**搜索区域面积**（Dijkstra 全域 vs A\* 朝目标收拢） | 让"启发式"这个抽象概念有可量化的画面 |
| 6 | "回到计算机算法"较空泛 | 收束为教科书式版式：**图的最短路径问题（Shortest Path）**、分支「图论 / 贪心 / 优先队列」、时间轴 **1956 构思 / 1959 发表** | 真正"回到计算机算法本身"，给出学科坐标 |
| 7 | 10 幕直铺 | 重排为 **10 幕**：把"提问"合并进拟真界面幕，Dijkstra/A\* 各留足 52/44 拍，切换点仍全部落在 4 的倍数拍 | 叙事更连贯、算法演示不赶 |
| 8 | 未说明浅色风格的技术约束 | 明确：shared 的 `Caption/SceneTitle/NodeBox/BeatGrid/ProgressHud` **写死了深色**，浅色风必须像 `binary-search` 那样在 `kit/` 里自建 `Sub/Chapter/Card/Backdrop/Hud` | 否则画面会出现深色面板压在浅色地图上，风格穿帮 |

---

## 二、摘要

在现有"视频工厂"上新增第四支视频 **route-planning**（Composition id：`RoutePlanning`），主题科普《导航怎么规划最优路线？》。

- **叙事三步（严格按用户要求）**：① 先抛问题勾兴趣 → ② 拆解"怎么规划的"、引出算法 → ③ 点名是什么算法，再回到计算机算法本身。
- **BGM**：复用 `public/web-request/bgm.mp3`（`bpm 112.8 / offset 12`，实测 ≈192.9s），足够覆盖全片、无需循环。
- **时长**：目标 **3 分钟**（`totalBeats = 336` ≈ 178.7s + `tailFrames 30` = 1s ≈ **180s ≈ 3:00**），取 SKILL 建议的时长上限，内容按 10 幕充分展开，不注水。
- **风格**：**自定义「高德蓝绿」** —— 浅色地图底、蓝绿渐变主色、白色路网。通过 spec 覆盖 `Backdrop` / `Hud` / `exitDim`，业务目录建 `kit/`（严格效仿 [binary-search](file:///d:/newDownload/project/vibe-video/src/videos/binary-search/README.md)）。
- **卡点**：所有场景切换点落在强拍（4 的倍数拍）；动画触发只用 `useAt(start, k)` / `useT()` + `pop/prog/hit`，禁止硬编码绝对帧号。

---

## 三、现状分析（已探索确认）

- **工厂结构**：`src/shared/`（`core/` 类型与工具、`runtime/` 节拍 Context、`components/` 可视化原语）+ `src/videos/<id>/`（`spec.ts` + `scenes/`），见 [video-factory.md](file:///d:/newDownload/project/vibe-video/docs/video-factory.md)。
- **现有业务**：[web-request](file:///d:/newDownload/project/vibe-video/src/videos/web-request/spec.ts)（默认霓虹风，10 场景 ≈61.5s）、[qrcode](file:///d:/newDownload/project/vibe-video/src/videos/qrcode/spec.ts)（默认霓虹风，9 场景，`280 拍 / tail 45` ≈2:31）、[binary-search](file:///d:/newDownload/project/vibe-video/src/videos/binary-search/spec.ts)（**自定义纸面风范例**，9 场景，`336 拍 / tail 30` ≈3:00，`exitDim: 0`）。
- **节拍数学**（FPS=30）：`BEAT = 60/112.8×30 ≈ 15.957 帧/拍`；`bf(336) = 12 + 336×15.957 ≈ 5374 帧 ≈ 179.1s`；视频总长 = `bf(totalBeats) + tailFrames ≈ 5404 帧 ≈ 180.1s`（见 [Video.tsx](file:///d:/newDownload/project/vibe-video/src/shared/Video.tsx#L15-L16)）。
- **装配与注册**：`src/shared/Video.tsx` 是通用装配器，`Backdrop = spec.Backdrop ?? BeatGrid`、`Hud = spec.Hud ?? ProgressHud`（[L18-L19](file:///d:/newDownload/project/vibe-video/src/shared/Video.tsx#L18-L19)）；`src/videos/index.ts` 的 `VIDEOS` 数组驱动 Root 自动注册；spec 挂了 `Cover` 会自动注册 `<id>Cover` 的 Still。**均无需改 `Root.tsx`**。
- **⚠ 浅色风格的技术约束（本次关键发现）**：shared 的以下组件**把深色写死在代码里**，浅色风直接复用会穿帮——
  - [Caption.tsx](file:///d:/newDownload/project/vibe-video/src/shared/components/Caption.tsx#L24)：字幕底色硬编码 `#0b1020cc` + `C.line` 描边；
  - [SceneTitle.tsx](file:///d:/newDownload/project/vibe-video/src/shared/components/SceneTitle.tsx#L27-L38)：步骤色块用 `C.bg`，标题用 `C.text`；
  - [NodeBox.tsx](file:///d:/newDownload/project/vibe-video/src/shared/components/NodeBox.tsx#L24-L40)：面板 `C.panel` + 文字 `C.text`；
  - [BeatGrid.tsx](file:///d:/newDownload/project/vibe-video/src/shared/components/BeatGrid.tsx)/[ProgressHud.tsx](file:///d:/newDownload/project/vibe-video/src/shared/components/ProgressHud.tsx)：深色霓虹网格 + 闪白进度条。
  → 结论：必须效仿 binary-search，在 `kit/` 内自建 `Sub`（字幕）/ `Chapter`（章节标签）/ `Card`（卡片）/ 地图背景与 HUD，**只从 shared 取节拍与动画工具**。
- **可复用的节拍/动画原语**（从 `../../../shared` import）：`useT/useAt/useBeat`、`pop/prog/hit`、`CL`、`FPS`、`FONT/MONO`、`SceneProps`、`TransType`、`AbsoluteFill`（remotion）。
- **BGM 复用**已在 qrcode / binary-search 两处验证；`public/<id>/` 与视频目录同 id 是硬性约定。

---

## 四、风格规范：高德蓝绿（`kit/theme.ts` 的 `P`）

浅色地图底 + 蓝绿渐变主色，贴近高德地图 App 的观感。

| 角色 | 变量 | 值 | 用途 |
|---|---|---|---|
| 地图底 | `P.bg` | `#EEF5F3` | 整片底色 |
| 陆地区块 | `P.land` | `#E2EDEA` | 区块/底图分层 |
| 建筑块 | `P.block` | `#D3E5E0` | 楼块纹理（低透明度） |
| 水域 | `P.water` | `#B7DFEE` | 河流/湖 |
| 绿地 | `P.park` | `#CDE9C6` | 公园 |
| 道路 | `P.road` | `#FFFFFF` | 路网主色 |
| 道路描边 | `P.roadEdge` | `#CDDED9` | 路的描边 |
| 主文字 | `P.ink` | `#14323E` | 标题/正文 |
| 次文字 | `P.sub` | `#5C7681` | 辅助说明 |
| 分隔线 | `P.line` | `#C6D9D5` | 卡片描边/网格 |
| 品牌蓝 | `P.blue` | `#1E8FE0` | 起点/主高亮 |
| 品牌青绿 | `P.teal` | `#12B3A2` | 终点/渐变末端 |
| 畅通绿 | `P.green` | `#28B96B` | 畅通路段 |
| 缓行黄 | `P.amber` | `#F2A93B` | 缓行路段 |
| 拥堵红 | `P.red` | `#F0553D` | 拥堵路段 |
| 主渐变 | `P.grad` | `linear-gradient(90deg, #1E8FE0, #12B3A2)` | 品牌渐变条/进度条 |

- **退出压暗**：`spec.exitDim = 0`（浅色底不做退场压暗，同 binary-search）。
- **字体**：`FONT` / `MONO` 沿用 shared 常量（配色换，字体不换）。

---

## 五、脚本（分镜 + 画面 + 字幕）

> 一句话主题：**导航 0.1 秒给出的"最优路线"，背后是一道 60 多年前就被解决的计算机经典问题。**

### 幕 0 · Intro（拍 0–12，转场 none，底色 `P.bg`）
- **画面**：逐拍砸字「导」「航」「怎么」→ 收束成主标题「导航怎么规划**最优路线**？」+ 蓝绿渐变条展开。
- **字幕**：无（标题即信息）。

### 幕 1 · AppUI（拍 12–44，转场 zoom，底色 `P.bg`）——【步骤①：先提问，勾兴趣】
- **画面**：一台手机框，模拟高德界面——
  1. 顶部搜索框逐字敲入「人民广场」；
  2. 底部弹出 **3 张路线卡片**（推荐 / 时间 / 红绿灯），各带「时间 / 里程 / 红绿灯数」，中间一张带 `推荐` 徽标高亮；
  3. 画面停一拍，打出问题字「**它凭什么选这条？**」。
- **字幕**："你输入目的地，它 0.1 秒就替你选好了路线——它凭什么？"

### 幕 2 · MapToGraph（拍 44–80，转场 slideLeft，底色 `P.land`）——【步骤②：怎么规划】
- **画面**：同一片地图"褪去外衣"，路口逐个变成**节点**（圆点）、道路变成**边**（连线），底图淡出成一张网格图。
- **字幕**："它不用眼睛看图——它把地图变成一张『图』：路口是点，道路是线。"

### 幕 3 · Weighted（拍 80–116，转场 circle，底色 `P.bg`）——【"最优"的定义】
- **画面**：每条边旁浮出权重标签（`3` `5` `2` `8`…，单位"分钟"）；右侧两张对照卡：`最短距离 8.2km` ✕ ／ `最快路线 19 分钟` ✓。
- **字幕**："『最优』不是最短，而是最快——每条路都有一个代价。"

### 幕 4 · Exhaustive（拍 116–152，转场 blinds，底色 `P.land`）——【笨办法，制造张力】
- **画面**：把 A→B 的**所有路径**逐条列出并计数（3 → 十几 → 密密麻麻），数字疯涨，最后红色禁令盖下。
- **字幕**："把每条路都试一遍？路一多，组合数就爆炸，根本算不完。"

### 幕 5 · Dijkstra（拍 152–204，转场 diag，底色 `P.bg`）——【步骤③：是什么算法】
- **画面**：点名 **Dijkstra 算法**（荷兰计算机科学家 Edsger W. Dijkstra）。4 轮演示：
  1. 起点点亮，距离标签 `0`，其余显 `∞`；
  2. 从"已知集合"里挑**当前距离最近的未访问点**锁定（高亮圈）；
  3. 用它**松弛（relax）** 邻居：`dist[v] > dist[u] + w` 时更新标签并闪一下（黄色脉冲）；
  4. 逐轮外扩，直到终点锁定 → 蓝绿渐变**高亮最终最优路径**。
  右下角常驻一个小的 **优先队列** 可视化（每次"取出最小 / 压入候选"都动一下）。
- **字幕**："换个思路：从起点出发，每次只扩展离得最近的那个点，一步步把最优路径逼出来。"

### 幕 6 · AStar（拍 204–248，转场 slideUp，底色 `P.bg`）——【优化：A\*】
- **画面**：公式 `f = g + h`（`g`＝已走代价，`h`＝到终点的直线距离）逐项亮起；左右分屏对比搜索范围面积——左 Dijkstra「四周均匀扩散」，右 **A\***「朝目标方向收拢」，两块半透明覆盖面叠加对比，右侧明显更小。
- **字幕**："再加一点『大概还有多远』的方向感，就能搜得更快——这就是 A\*。"

### 幕 7 · BackToCS（拍 248–284，转场 spin，底色 `P.land`）——【回到计算机算法本身】
- **画面**：抽象画面收束成教科书式版式——
  - 大字标题「**图的最短路径问题**」/ 英文 `Shortest Path Problem`；
  - 分支标签「图论 · 贪心 · 优先队列」；
  - 时间轴刻度 **1956 构思 → 1959 发表**；
  - 三张要点卡：`建模：地图 → 带权图` / `求解：Dijkstra · A*` / `出处：计算机科学经典算法`。
- **字幕**："绕了一圈，它其实是一道计算机科学里的老题目：图的最短路径。"

### 幕 8 · Complexity（拍 284–312，转场 glitch，底色 `P.bg`）——【为什么导航能秒算】
- **画面**：路口数从几百 → 几万 → 千万级逐级放大（数字滚动 + 点阵加密），右侧亮出复杂度 `O((V + E)·log V)` 与「优先队列（堆）」。
- **字幕**："全国路网几千万个路口，靠优先队列优化，它依然能在毫秒级算完。"

### 幕 9 · Outro（拍 312–336，转场 fade，底色 `P.bg`）
- **画面**：三步回顾卡「提问 → 建模 → 求解」依次落位 + 收尾标语「你按下的每一次『开始导航』，都是一次最短路计算。」→ 片尾淡出（`tailFrames 30`）。
- **字幕**："下次导航时你可以想想：它正在替你解一道最短路。"

**拍号分配校验**：12+32+36+36+36+52+44+36+28+24 = **336** ✓；切换点 (12/44/80/116/152/204/248/284/312) 均为 4 的倍数 → 落在强拍 ✓。

---

## 六、spec 关键参数

| 字段 | 值 | 说明 |
|---|---|---|
| `id` | `RoutePlanning` | Composition id，全局唯一 |
| `bpm` / `offset` | `112.8` / `12` | 复用 BGM，参数沿用（执行前用 `npm run beat` 复核） |
| `totalBeats` | `336` | 正片总拍数 ≈178.7s |
| `transFrames` | `12` | 转场帧数 |
| `tailFrames` | `30` | 结尾留白 |
| `bgm` | `route-planning/bgm.mp3` | 相对 `public/` 的路径 |
| `bg` | `P.bg`（`#EEF5F3`） | 浅色地图底 |
| `width` × `height` | `1920 × 1080` | FPS 30 |
| `Backdrop` | `MapBackdrop` | 自定义：浅色地图纹理（水域/绿地/街道网格） |
| `Hud` | `AmapHud` | 自定义：底部蓝绿渐变进度条 + 一个沿条前进的"定位针" |
| `exitDim` | `0` | 浅色底不压暗退场 |
| `Cover` | `Cover`（`./Cover`） | 封面，自动注册 `RoutePlanningCover` Still |

```ts
scenes: [
  { start: 0,   end: 12,  Comp: Intro,      trans: "none",      bg: P.bg },
  { start: 12,  end: 44,  Comp: AppUI,      trans: "zoom",      bg: P.bg },
  { start: 44,  end: 80,  Comp: MapToGraph, trans: "slideLeft", bg: P.land },
  { start: 80,  end: 116, Comp: Weighted,   trans: "circle",    bg: P.bg },
  { start: 116, end: 152, Comp: Exhaustive, trans: "blinds",    bg: P.land },
  { start: 152, end: 204, Comp: Dijkstra,   trans: "diag",      bg: P.bg },
  { start: 204, end: 248, Comp: AStar,      trans: "slideUp",   bg: P.bg },
  { start: 248, end: 284, Comp: BackToCS,   trans: "spin",      bg: P.land },
  { start: 284, end: 312, Comp: Complexity, trans: "glitch",    bg: P.bg },
  { start: 312, end: 336, Comp: Outro,      trans: "fade",      bg: P.bg },
],
```

---

## 七、改动清单（全部落在 `src/videos/route-planning/` 与 `public/route-planning/`）

### A. `kit/`（本片专属基础设施，效仿 binary-search）

| # | 文件 | 动作 | 说明 |
|---|---|---|---|
| 1 | `kit/theme.ts` | 新增 | `P` 高德蓝绿调色板（见第四节）+ 地图几何常量（画布尺寸、**固定路网节点坐标数组 `NODES`**、**边表 `EDGES`（含权重）**、起点/终点索引、A→B 最优路径节点序列） |
| 2 | `kit/MapKit.tsx` | 新增 | 地图原语（全部吃纯 props，**不依赖节拍 context**）：`MapCanvas`（水域/绿地/街道底纹）、`RoadNet`（按 `EDGES` 画路 + 权重标签）、`NodeDot`（路口点，支持 `locked/reached` 态）、`PathLine`（沿节点序列画高亮路径，支持 `progress` 动画，带蓝绿渐变描边）、`DistLabel`（节点距离标签 `∞/数字`）、`ExploreField`（Dijkstra 全向扩散环 / A\* 朝目标收拢的半透明搜索域） |
| 3 | `kit/ui.tsx` | 新增 | 业务 UI：`MapBackdrop`（本片背景层）、`AmapHud`（自定义 HUD，用 `useBeat`/`useCurrentFrame`）、`Sub`（浅色字幕条，替代 shared `Caption`）、`Chapter`（章节标签，替代 shared `SceneTitle`）、`Card`（浅色卡片）、`RouteCard`（路线卡片：时间/里程/红绿灯/推荐徽标）、`PhoneFrame`（手机外框，供 AppUI 幕） |

### B. `spec.ts` / `Cover.tsx` / `scenes/` / 注册

| # | 文件 | 动作 | 说明 |
|---|---|---|---|
| 4 | `public/route-planning/bgm.mp3` | 新增 | 从 `public/web-request/bgm.mp3` 复制（资源目录与视频 id 对齐） |
| 5 | `src/videos/route-planning/spec.ts` | 新增 | 见第六节参数 + 场景表；`import { P } from "./kit/theme"`、`MapBackdrop/AmapHud`、`Cover` |
| 6 | `src/videos/route-planning/Cover.tsx` | 新增 | 封面（无 props、静态）：浅色地图底 + 路网 + 高亮路径 + 定位针；主标题「导航怎么规划**最优路线**？」+ 副标「它到底在后台算了什么？」+ 蓝绿渐变。**自绘静态 SVG，禁用节拍 context**（`BeatGrid/ProgressHud/useT/useAt/useBeat`） |
| 7 | `scenes/Intro.tsx` | 新增 | 砸字 → 主标题 + 渐变条（结构仿 [web-request Intro](file:///d:/newDownload/project/vibe-video/src/videos/web-request/scenes/Intro.tsx)，配色改 `P`） |
| 8 | `scenes/AppUI.tsx` | 新增 | 拟真导航界面：搜索框打字 → 3 张路线卡片 → 提问字 |
| 9 | `scenes/MapToGraph.tsx` | 新增 | 地图 → 图：底图淡出、`NodeDot`/`RoadNet` 随拍逐点出现 |
| 10 | `scenes/Weighted.tsx` | 新增 | 权重标签 + "最短≠最快"对照卡 |
| 11 | `scenes/Exhaustive.tsx` | 新增 | 路径穷举列举 → 计数暴涨 → 红色禁令 |
| 12 | `scenes/Dijkstra.tsx` | 新增 | 4 轮：起点/锁点/松弛/命中；含距离标签更新、优先队列小面板、最优路径高亮 |
| 13 | `scenes/AStar.tsx` | 新增 | `f = g + h` 公式 + 左右搜索域面积对比 |
| 14 | `scenes/BackToCS.tsx` | 新增 | 图的最短路径问题：标题 + 分支标签 + 时间轴 + 三张要点卡 |
| 15 | `scenes/Complexity.tsx` | 新增 | 路口量级滚动 + `O((V+E)·log V)` + 优先队列 |
| 16 | `scenes/Outro.tsx` | 新增 | 三步回顾卡 + 收尾标语 + 淡出 |
| 17 | `src/videos/index.ts` | 修改 | `import { routePlanning } from "./route-planning/spec";` 并加入 `VIDEOS` 数组 |
| 18 | `src/videos/route-planning/README.md` | 新增 | 与现有 3 支视频目录约定保持一致，内容即本脚本概要 |

**明确不改**：`src/shared/**`、`src/Root.tsx`、`remotion.config.ts`、`package.json`；**不引入新依赖**（路网/地图全部用 SVG + CSS 自绘）。

---

## 八、Assumptions & Decisions

| # | 决策 | 理由 |
|---|---|---|
| 1 | 复用 `web-request/bgm.mp3`，参数沿用 `112.8 / 12` | 与 qrcode / binary-search 同源，实测 ≈192.9s 足够 3 分钟，无需循环 |
| 2 | 目标时长 3 分钟（`336 拍 / tail 30` ≈180s） | SKILL 建议尽量做满 3 分钟；10 幕内容充分，不注水 |
| 3 | **自定义「高德蓝绿」风格**，建 `kit/`，`exitDim: 0` | 用户指定；浅色地图是该主题最强代入感；`exitDim 0` 因浅底压暗会脏 |
| 4 | 自建 `Sub/Chapter/Card` 替代 shared `Caption/SceneTitle` | shared 这几个组件把深色写死（见第三节），浅色风直接复用会穿帮 |
| 5 | 路网几何用**固定坐标数组**（`kit/theme.ts` 的 `NODES/EDGES`），非随机生成 | 每帧渲染必须确定性；且能让 Dijkstra / A\* 幕跨场景复用同一张图，画面连续 |
| 6 | 算法口径：Dijkstra（1956 构思 / 1959 发表）为主线，A\*（`f=g+h`）作优化延伸 | 契合用户"引出算法 → 点名算法 → 回到计算机算法"三步；导航实际以 A\* 居多 |
| 7 | 复杂度科普口径 `O((V+E)·log V)`（堆优化） | 面向科普，只传递"千万级节点也能秒算"的直觉，不承担严格证明 |
| 8 | 卡片/文案给的是"面向观众的信息设计"，非精确数值 | 视频传递的是直觉与流程，不承担精确性义务（与 qrcode 同策略） |

---

## 九、验证步骤

| # | 验证项 | 命令 / 动作 | 通过标准 |
|---|---|---|---|
| 1 | 节拍复核 | `npm run beat -- public/route-planning/bgm.mp3` | 输出 `bpm≈112.8 / offset≈12`，可用拍数 ≥ 336 |
| 2 | 类型检查 | `npm run typecheck` | 退出码 0 |
| 3 | Composition 注册 | `npm run studio` | 侧边栏出现 `RoutePlanning`（≈5404 帧 ≈180s）与 `RoutePlanningCover` |
| 4 | 布局自查（各幕抽帧） | `npm run still -- RoutePlanning --scale=0.5 --frame=<各切换帧>` | 无溢出/错位/深色残留（重点看浅色卡与字幕反差） |
| 5 | 封面导出 | `npm run still -- RoutePlanningCover out/route-planning/cover.png` | 生成 PNG，与视频同主题同风格 |
| 6 | 卡点抽查 | 抽帧核对 `bf(start)`：0/12/44/80/116/152/204/248/284/312 | 切换点动画收口、转场完成落拍 |
| 7 | 渲染成片 | `npm run render -- RoutePlanning out/route-planning.mp4` | 产出 1920×1080 30fps 含音轨，时长 ≈180s |
| 8 | 边界回归 | `git status` | 改动仅限 `src/videos/route-planning/**`、`src/videos/index.ts`、`public/route-planning/**` |

---

## 十、开放问题（如与预期不符请指出，默认按上表执行）

1. **蓝绿配色的"浓淡"**：现取"浅色地图底 + 蓝绿主色"（贴高德日间地图）。若你想要**深色夜间导航风**（黑底 + 蓝绿荧光路网），配色与 `MapBackdrop` 会整体翻转，需提前说。
2. **手机框**：幕 1 用了拟真手机框。若不想出现"设备外壳"、只要纯地图 UI，可去掉 `PhoneFrame`。
3. **算法深度**：主线 Dijkstra + A\*；若要再补 Bellman-Ford / Floyd（多源最短路）需加幕并重排拍号。
4. **是否产出 `README.md`**：默认产出，以对齐现有三支视频的目录约定。
