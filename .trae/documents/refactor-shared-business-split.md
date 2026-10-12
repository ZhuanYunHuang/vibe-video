# 业务代码与共用代码分离方案

> 目标项目：`D:\newDownload\project\vibe-video`
> 现状：一个 Remotion 项目，内含 1 支视频（`WebRequest`，"访问一个网页背后发生了多少事"）
> 目标：改造成"视频工厂"——共用代码与业务代码分目录，新增视频只加目录、不改共用代码

---

## 一、当前状态分析

### 现有结构

```
vibe-video/
├── public/bgm.mp3                    单一 BGM，多视频会冲突
├── scripts/analyze.js                硬编码读 scripts/bgm.wav
├── scripts/analyze2.js               硬编码，与上重复
├── src/
│   ├── beat.ts                       节拍参数（BPM/OFFSET/TOTAL_BEATS/DURATION/TRANS）
│   ├── common.tsx                    调色板+字体+动画原语+6 个可视化组件，全混在一个文件
│   ├── Transition.tsx                SceneShell 转场外壳
│   ├── Main.tsx                      场景表 + BeatGrid + Hud + Audio + 装配逻辑
│   ├── Root.tsx                      硬编码注册 1 个 Composition
│   ├── index.ts                      registerRoot
│   └── scenes/                       10 个场景（平铺）
├── remotion.config.ts
└── package.json                      render 脚本写死 WebRequest
```

### 三个耦合点（必须解开）

**耦合点 1：节拍参数是模块级单例。**
[beat.ts](file:///D:/newDownload/project/vibe-video/src/beat.ts) 导出 `BEAT`、`OFFSET`、`DURATION` 等常量，被 [common.tsx](file:///D:/newDownload/project/vibe-video/src/common.tsx#L3) 和所有场景直接 import。第二支视频 BPM 不同时无法共存 —— 这是"持续做视频"最大的障碍。

**耦合点 2：装配逻辑与场景表混在 Main.tsx。**
[Main.tsx](file:///D:/newDownload/project/vibe-video/src/Main.tsx) 里 `SCENES` 是这支视频的业务数据，但 `BeatGrid`、`Hud`、`Audio`、Sequence 遍历是通用逻辑。加视频必须动这个文件。

**耦合点 3：Root.tsx 硬编码单一 Composition。**
[Root.tsx](file:///D:/newDownload/project/vibe-video/src/Root.tsx) 只注册 `WebRequest`。多视频需手改。

### 已确认的调用面（重构范围）

- 场景调用 `at(start, k)` / `useT()` 共 **43 处**
- 场景 import 集中为两类：`from "../beat"`（取 `CL`）、`from "../common"`（取组件与工具）
- 除 10 个场景外，`common.tsx` 内部 `SceneTitle` 也用到 `BEAT`

---

## 二、目标结构

```
vibe-video/
├── public/
│   └── web-request/bgm.mp3           每支视频一个资源目录
├── scripts/
│   └── analyze-beat.mjs              参数化：npm run beat -- <音频路径>
├── src/
│   ├── index.ts                      registerRoot（不变）
│   ├── Root.tsx                      遍历 VIDEOS 注册所有 Composition
│   │
│   ├── shared/                       ★ 共用代码（跨视频复用，做新视频一般不动）
│   │   ├── index.ts                  barrel：场景只从这里 import
│   │   ├── types.ts                  SceneProps / SceneDef / Beat / VideoSpec
│   │   ├── timing.ts                 FPS / CL / makeBeat()
│   │   ├── anim.ts                   pop / prog / hit
│   │   ├── theme.ts                  C（调色板）/ FONT / MONO
│   │   ├── beat-context.tsx          BeatProvider / useBeat / useT / useAt
│   │   ├── Video.tsx                 通用装配器：吃 VideoSpec，出完整视频
│   │   └── components/
│   │       ├── index.ts
│   │       ├── Center.tsx
│   │       ├── SceneTitle.tsx
│   │       ├── NodeBox.tsx
│   │       ├── Packet.tsx
│   │       ├── Wire.tsx
│   │       ├── Caption.tsx
│   │       ├── SceneShell.tsx        （原 Transition.tsx）
│   │       ├── BeatGrid.tsx
│   │       └── ProgressHud.tsx
│   │
│   └── videos/                       ★ 业务代码（每支视频一个目录）
│       ├── index.ts                  视频清单
│       ├── web-request/
│       │   ├── spec.ts               本视频的全部配置：BPM/拍数/场景表/BGM
│       │   └── scenes/               10 个场景（从 src/scenes 迁移）
│       │       └── Intro.tsx … Outro.tsx
│       └── _template/                新建视频的骨架（不被注册）
│           ├── spec.ts
│           └── scenes/Intro.tsx
```

**边界规则（写进目录注释，作为长期约定）**

| 目录 | 放什么 | 加新视频时要改吗 |
|---|---|---|
| `src/shared/` | 与具体视频无关的框架、动画、可视化原语、类型 | 一般不改；只有新增通用组件时才加 |
| `src/videos/<id>/` | 这支视频的文案、场景、节奏、配色配置 | 只改这里 |

---

## 三、Proposed Changes

### 1. `src/shared/types.ts`（新增）

集中所有跨文件类型，替代散落的 `SceneProps` 定义。

```ts
export type SceneProps = { start: number };

export type TransType =
  | "none" | "zoom" | "slideLeft" | "slideUp"
  | "circle" | "blinds" | "diag" | "spin" | "glitch";

export type SceneDef = {
  start: number;          // 起始拍号
  end: number;            // 结束拍号
  Comp: React.FC<SceneProps>;
  trans: TransType;
  bg: string;
};

// 由 makeBeat() 产出，经 Context 下发
export type Beat = {
  BEAT: number;           // 每拍帧数
  OFFSET: number;         // 首拍绝对帧
  TRANS: number;          // 转场帧数
  bf: (b: number) => number;
  beatPulse: (frame: number) => number;
};

export type VideoSpec = {
  id: string;             // Composition id，如 "WebRequest"
  bpm: number;
  offset: number;         // 首拍所在帧
  totalBeats: number;
  transFrames: number;    // 转场帧数，原 TRANS = 12
  tailFrames: number;     // 结尾留白帧数，原 45
  bgm: string;            // 相对 public 的路径
  bg: string;             // 整片底色
  width: number;
  height: number;
  scenes: SceneDef[];
};
```

**为什么**：`TransType` 现在埋在 `Transition.tsx` 里、`SceneProps` 埋在 `common.tsx` 里，`SceneDef` 是 `Main.tsx` 的局部类型。分散的类型让"共用/业务"边界模糊。

---

### 2. `src/shared/timing.ts`（新增，取代 `beat.ts`）

把"某支视频的节拍数值"换成"按参数生成节拍工具"。

```ts
export const FPS = 30;
export const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const makeBeat = (bpm: number, offset: number, trans: number): Beat => {
  const BEAT = (60 / bpm) * FPS;
  const bf = (b: number) => Math.round(offset + b * BEAT);
  const beatPulse = (frame: number) => {
    const t = frame - offset;
    if (t < 0) return 0;
    return Math.exp(-(t % BEAT) / 3.5);
  };
  return { BEAT, OFFSET: offset, TRANS: trans, bf, beatPulse };
};
```

- `bf` 公式与现有 [beat.ts](file:///D:/newDownload/project/vibe-video/src/beat.ts#L9) 逐字相同 → 保证 `at()` 输出不变。
- 现有 `beatPulse` 的衰减常数 `3.5` 原样保留。
- `FPS` 保持项目级常量（**决策理由见第五节**）。

---

### 3. `src/shared/anim.ts`（新增）

从 [common.tsx](file:///D:/newDownload/project/vibe-video/src/common.tsx#L33-L41) 原样搬出 `pop` / `prog` / `hit`，import `FPS`、`CL` 的来源改为 `./timing`。**函数体不改**。

---

### 4. `src/shared/theme.ts`（新增）

从 [common.tsx](file:///D:/newDownload/project/vibe-video/src/common.tsx#L5-L21) 原样搬出 `C`、`FONT`、`MONO`。值不变。

---

### 5. `src/shared/beat-context.tsx`（新增）

节拍参数的下发通道。这是解开"耦合点 1"的关键。

```tsx
const BeatCtx = createContext<Beat | null>(null);

export const BeatProvider: React.FC<{ beat: Beat; children: React.ReactNode }> = ...

export const useBeat = (): Beat => { /* 取不到就 throw，明确报错 */ };

// 场景内时间：0 帧 = 场景起始拍（前面 TRANS 帧是入场转场）
export const useT = () => useCurrentFrame() - useBeat().TRANS;

// 返回与现 at() 完全同签名的函数，调用点零改动
export const useAt = () => {
  const beat = useBeat();
  return (start: number, k: number) => beat.bf(start + k) - beat.bf(start);
};
```

**为什么用 Context 而不是 props**：
- 场景中 `at`/`useT` 各 43 处调用，props 方案要改 `SceneProps` 并在十几处调用点加参数；Context 方案只需在场景顶部加 1 行 `const at = useAt();`，**所有调用点保持原样**。
- 一个 Composition 天然只对应一支视频，Context 作用域与"一支视频一份节拍"完全对齐。
- 场景里 `t` 本来就是靠 `useT()` 隐式取的，再隐式取 `at` 与现有风格一致。

**关键约束**：`useAt()` 返回值与现 [common.tsx](file:///D:/newDownload/project/vibe-video/src/common.tsx#L30) 的 `at(start, k)` **签名与语义完全一致**，确保渲染结果像素级不变。

---

### 6. `src/shared/components/*`（新增，从 `common.tsx` + `Transition.tsx` 拆分）

| 新文件 | 来源 | 改动 |
|---|---|---|
| `Center.tsx` | common.tsx `Center` | 改用 `theme.ts` 的 `C`/`FONT` |
| `SceneTitle.tsx` | common.tsx `SceneTitle` | `BEAT` 从 `useBeat()` 取（原为模块常量） |
| `NodeBox.tsx` | common.tsx `NodeBox` | 仅改 import |
| `Packet.tsx` | common.tsx `Packet` | 仅改 import |
| `Wire.tsx` | common.tsx `Wire` | 仅改 import |
| `Caption.tsx` | common.tsx `Caption` | 仅改 import |
| `SceneShell.tsx` | Transition.tsx | `TRANS` 从 `useBeat()` 取；`TransType` 改从 `types.ts` 引 |
| `BeatGrid.tsx` | Main.tsx `BeatGrid` | 抽成组件，`beatPulse`/`BEAT`/`OFFSET` 从 `useBeat()` 取 |
| `ProgressHud.tsx` | Main.tsx `Hud` | 抽成组件，接收 `cutFrames: number[]`（各场景切换帧）与 `totalFrames` |

**组件样式、数值、动画曲线全部不改**，只换依赖来源。

`components/index.ts` 做桶导出。

> **注**：`Packet` 里的 `Math.sin(p * Math.PI) * 60`、`NodeBox` 的 `w = 250` 等魔法数字原样保留，不趁机重构。

---

### 7. `src/shared/Video.tsx`（新增）

通用装配器。吃一个 `VideoSpec`，输出完整视频。取代 `Main.tsx` 的作用，但**不含任何业务数据**。

```tsx
export const Video: React.FC<{ spec: VideoSpec }> = ({ spec }) => {
  const beat = useMemo(
    () => makeBeat(spec.bpm, spec.offset, spec.transFrames),
    [spec.bpm, spec.offset, spec.transFrames]
  );
  const duration = beat.bf(spec.totalBeats) + spec.tailFrames;

  return (
    <BeatProvider beat={beat}>
      <AbsoluteFill style={{ background: spec.bg }}>
        <Audio src={staticFile(spec.bgm)} volume={/* 原 fade 逻辑 */} />
        {spec.scenes.map((s, i) => { /* 原 Sequence + SceneShell 遍历逻辑 */ })}
        <ProgressHud cutFrames={spec.scenes.slice(1).map((s) => beat.bf(s.start))} totalFrames={beat.bf(spec.totalBeats)} />
      </AbsoluteFill>
    </BeatProvider>
  );
};

export const videoDuration = (spec: VideoSpec) => makeBeat(spec.bpm, spec.offset, spec.transFrames).bf(spec.totalBeats) + spec.tailFrames;
```

`videoDuration` 导出给 `Root.tsx` 算 `durationInFrames`（Composition 需要同步值，不能在组件内算）。

**Sequence 遍历逻辑逐字保留**，包括：
- `from = Math.max(0, bf(s.start) - TRANS)`
- `isLast` 分支与 `dur + 999` 的处理
- `beatPulse` 驱动的网格呼吸、`bar` 判定

---

### 8. `src/videos/web-request/spec.ts`（新增，承载全部业务配置）

```ts
import { C } from "../../shared";
import { Intro } from "./scenes/Intro";
/* …10 个场景 */

export const webRequest: VideoSpec = {
  id: "WebRequest",
  bpm: 112.8,
  offset: 12,
  totalBeats: 112,
  transFrames: 12,
  tailFrames: 45,
  bgm: "web-request/bgm.mp3",
  bg: C.bg,
  width: 1920,
  height: 1080,
  scenes: [
    { start: 0,   end: 8,           Comp: Intro,   trans: "none",      bg: C.bg },
    { start: 8,   end: 16,          Comp: Browser, trans: "zoom",      bg: "#0d1430" },
    { start: 16,  end: 32,          Comp: Dns,     trans: "slideLeft", bg: "#120f2e" },
    { start: 32,  end: 44,          Comp: Tcp,     trans: "circle",    bg: "#0a1a2a" },
    { start: 44,  end: 56,          Comp: Tls,     trans: "blinds",    bg: "#0b1f1a" },
    { start: 56,  end: 68,          Comp: Http,    trans: "diag",      bg: "#1f1a0b" },
    { start: 68,  end: 80,          Comp: Server,  trans: "slideUp",   bg: "#1f0b1a" },
    { start: 80,  end: 92,          Comp: Render,  trans: "spin",      bg: "#1f140b" },
    { start: 92,  end: 100,         Comp: Done,    trans: "glitch",    bg: C.bg },
    { start: 100, end: 112,         Comp: Outro,   trans: "zoom",      bg: C.bg },
  ],
};
```

数值全部照搬 [Main.tsx](file:///D:/newDownload/project/vibe-video/src/Main.tsx#L21-L32) 与 [beat.ts](file:///D:/newDownload/project/vibe-video/src/beat.ts#L1-L15)，不得改动。

---

### 9. 场景文件迁移（`src/scenes/` → `src/videos/web-request/scenes/`）

每个场景只需两处机械改动：

**改动 A：import 路径**
```ts
// 前
import { CL } from "../beat";
import { at, C, Caption, hit, MONO, pop, prog, SceneProps, SceneTitle, useT, Wire } from "../common";
// 后
import { CL, C, Caption, hit, MONO, pop, prog, SceneProps, SceneTitle, useAt, useT, Wire } from "../../../shared";
```

**改动 B：顶部取 `at`**
```ts
const t = useT();
const at = useAt();                       // 新增这一行
const k = (n: number) => at(start, n);    // 原样保留
```

- 用 `at(start, k)` 直接调用的场景（[Intro](file:///D:/newDownload/project/vibe-video/src/scenes/Intro.tsx)、[Browser](file:///D:/newDownload/project/vibe-video/src/scenes/Browser.tsx)）加 `const at = useAt();` 后其余不动。
- 场景内的所有文案、坐标、配色、节拍数字、JSX 结构**一律不改**。

---

### 10. `src/videos/index.ts` 与 `src/Root.tsx`（修改）

`videos/index.ts` — 视频清单，加视频只改这一行：
```ts
import { webRequest } from "./web-request/spec";
export const VIDEOS: VideoSpec[] = [webRequest];
```

`Root.tsx` — 遍历注册：
```tsx
export const RemotionRoot = () => (
  <>
    {VIDEOS.map((spec) => (
      <Composition
        key={spec.id}
        id={spec.id}
        component={Video}
        durationInFrames={videoDuration(spec)}
        fps={FPS}
        width={spec.width}
        height={spec.height}
        defaultProps={{ spec }}
      />
    ))}
  </>
);
```

加第二支视频后 Studio 侧边栏自动出现两个条目。`_template` 不列入 `VIDEOS`，因此不注册。

---

### 11. `src/videos/_template/`（新增骨架）

供复制使用的最小集合：
- `spec.ts`：带注释的空白配置（BPM/offset/拍数/BGM 路径/2 个占位场景）
- `scenes/Intro.tsx`、`scenes/Outro.tsx`：演示 `useT()`/`useAt()`/`Caption`/`Center` 用法的最小场景

要求：`tsc --noEmit` 通过（注意 `noUnusedLocals`，不写多余 import）。

---

### 12. `scripts/analyze-beat.mjs`（新增，取代两个旧脚本）

把"每支新 BGM 都要做一次"的分析步骤工具化。

- 入参：音频路径（`process.argv[2]`）
- 步骤：用 `npx remotion ffmpeg` 转单声道 22050Hz WAV 到系统临时目录 → 复用 [analyze2.js](file:///D:/newDownload/project/vibe-video/scripts/analyze2.js) 的梳状滤波打分算法（原样搬算法，不改参数：BPM 扫描 60–180、步长 0.05、相位步长 0.005）→ 输出
  - Top 5 BPM 候选与相位
  - 推荐值（含每拍帧数）
  - **可直接粘贴进 `spec.ts` 的片段**
  - 强起音点列表（前 75 秒），用于核对小节边界
- 结束后清理临时 WAV
- 删除 `analyze.js`、`analyze2.js`（逻辑已合并；两者对小节边界的输出保留在合并版里）

---

### 13. 资源与脚本配置

- **BGM 迁移**：`public/bgm.mp3` → `public/web-request/bgm.mp3`（多视频必须隔离；`spec.bgm` 相应为 `web-request/bgm.mp3`）
- **package.json**：
  ```json
  "name": "vibe-video",
  "scripts": {
    "studio": "remotion studio",
    "render": "remotion render",
    "still": "remotion still",
    "beat": "node scripts/analyze-beat.mjs",
    "typecheck": "tsc --noEmit"
  }
  ```
  用法：`npm run render -- WebRequest out/web-request.mp4`（不再写死视频 id）
- **remotion.config.ts 不动**（本机 Chrome 路径保留）

---

## 四、Assumptions & Decisions

| # | 决策 | 理由 |
|---|---|---|
| 1 | 共用代码放 `src/shared/`，业务代码放 `src/videos/<id>/` | 直接对应"共用 / 业务"的表述，命名无歧义 |
| 2 | 节拍参数用 **React Context** 下发，不用 props | 43 处调用点零改动；一个 Composition 一份节拍，作用域天然对齐；与现有 `useT()` 隐式取值的风格一致 |
| 3 | `useAt()` 返回 **与现 `at(start, k)` 同签名**的函数 | 调用点完全不变，把重构回归风险压到最低 |
| 4 | `NodeBox`/`Packet`/`Wire`/`SceneTitle`/`Caption` 归 `shared/` | 它们是"流程图科普视频"这一系列的通用可视化原语，跨视频复用概率高；若日后确认某组件只服务一支视频，再下沉到该视频目录 |
| 5 | `Intro`/`Outro` **不**抽成通用场景模板 | 开场与收尾文案高度定制，参数化会变僵化。留在各视频自己的 `scenes/` 里 |
| 6 | `FPS = 30` 保持项目级常量，不进 `VideoSpec` | 避免动画函数全局 hook 化。若将来要做 60fps，需把 `FPS` 改为 context 下发，此为已知技术债，已在 `timing.ts` 注释中标注 |
| 7 | 不做 tsconfig `paths` 别名，用相对路径 `../../../shared` | 别名需要 bundler 侧额外验证，收益不抵风险 |
| 8 | 不做多主题 / 主题切换 | 现有 `C` 调色板足够；每场景已有独立 `bg` 可做视觉区分。真需要时按 spec 加可选 `theme` 字段 |
| 9 | 不引入 Zod、不做 `calculateMetadata` | 当前无外部数据源驱动的需求，属过度设计 |
| 10 | `_template` 目录不注册为 Composition | 它只是复制骨架；注册会产生空白视频条目 |
| 11 | **渲染结果必须像素级不变** | 本次是纯结构重构。任何视觉差异都视为 bug |

---

## 五、执行顺序（决定验证方式）

重构前必须先落基准，否则失去比对依据：

1. **基准**：渲染 5 个关键帧（含各场景代表帧 + 转场帧）到 `out/_baseline/`
2. 建 `src/shared/` 全部文件（types → timing → anim → theme → beat-context → components → Video → index）
3. 迁移场景到 `src/videos/web-request/scenes/`，按第 9 节做机械改动
4. 写 `spec.ts`、`videos/index.ts`，改 `Root.tsx`
5. 删除旧文件：`src/beat.ts`、`src/common.tsx`、`src/Transition.tsx`、`src/Main.tsx`、`src/scenes/`
6. 迁移 BGM，改 `package.json`
7. 写 `analyze-beat.mjs`，删旧脚本
8. 写 `_template/`
9. **验证**（下一节）
10. 清理临时文件

---

## 六、验证步骤

| # | 验证项 | 通过标准 |
|---|---|---|
| 1 | 类型检查 | `npm run typecheck` 退出码 0，无报错 |
| 2 | **像素级回归** | 对第 5 节选定的同一组帧号，重构后渲染到 `out/_verify/`，与 `out/_baseline/` 逐文件比对哈希，**全部一致** |
| 3 | 成片重渲染 | `npm run render -- WebRequest out/video.mp4` 成功；`ffprobe` 时长 = `00:01:01.48`、分辨率 1920x1080、30fps、含音视频两轨，与重构前一致 |
| 4 | Composition 注册 | Studio 中能看到 `WebRequest`，时长与重构前一致（无多余条目） |
| 5 | 节拍工具 | `npm run beat -- public/web-request/bgm.mp3` 输出的 BPM 与相位，与现有 [beat.ts](file:///D:/newDownload/project/vibe-video/src/beat.ts) 里记录的 112.8 / 12 吻合 |
| 6 | 骨架可用 | `_template` 通过 tsc；其 import 路径可被直接复制使用 |
| 7 | 清理 | 无 `out/_baseline/`、`out/_verify/`、临时 WAV 残留；`src/` 下无旧文件 |

回归基准帧选取（覆盖不同段落与转场）：

| 帧号 | 对应内容 |
|---|---|
| 82 | 开场标题 |
| 449 | DNS 场景中段 |
| 864 | TLS 加密通道 |
| 1454 | 渲染流水线 |
| 1741 | 结尾总结页 |
| 1550 | 页面加载完成 + 粒子 |

---

## 七、明确不做的事

- 不改任何文案、坐标、颜色、动画曲线、节拍数值
- 不重构 `Packet`/`NodeBox` 里的魔法数字
- 不引入新依赖
- 不改 `remotion.config.ts`
- 不把这些共用组件发布为独立包（等有多项目需求再说）
