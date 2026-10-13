---
name: "video-generation"
description: "在本 Remotion 视频工厂中新增/生成一支视频：复制 _template 骨架、放置 BGM、分析节拍、编写 spec 与场景、注册、生成与视频同风格的封面，并渲染导出。当用户要求'生成视频''新增一支视频''把某主题做成科普视频''加一个视频业务'时调用。"
---

# 视频生成（Video Generation）

本 Skill 指导你在本项目中**从零产出（生成）一支视频**。项目是一个基于 **Remotion 4** 的"视频工厂"：`src/shared/` 是与具体视频无关的通用框架，`src/videos/<id>/` 是每一支视频的业务代码（本项目中"业务" = 一支视频）。

> 目录边界与长期约定见 `docs/video-factory.md`（唯一约定入口）；已有业务的范例见各业务目录下的 `README.md`。

## 何时使用

- 用户要求"生成/做一支视频""新增一支视频""把这个主题做成科普视频""加一个视频业务"。
- 需要给现有视频加场景、改节奏、换风格（仍属于对"某支视频业务"的生成/改造）。

## 铁律（不要违反）

1. **只改 `src/videos/<id>/`、`public/<id>/`、`src/videos/index.ts`**；不要为了某支视频去改 `src/shared/`。
2. **`_template` 目录不注册 Composition**，它只是复制用的骨架。
3. **视频目录 id 与资源目录 id 保持一致**：`src/videos/<id>/` ↔ `public/<id>/`。
4. **卡点规则（核心）**：BGM 每 **4 小节** 是一个乐句，乐句的第一拍是**重拍**。
   - 场景切换点（`scenes[].start/end`）取 **16 的倍数拍**（4/4 拍下 4 小节 = 16 拍），这样切场天然落在重拍上。
   - **每 4 小节必须安排一次大卡点**：要么切场转场，要么做一次强烈的内容跳变（数字跳变 / 元素砸入 / 路径画出）。
   - 两个大卡点之间（约 6~7s）**不允许出现"画面在干等下一个转场"的空档**，用内容跳变填满。
   - 其余拍子按需卡点（元素出场、数字砸入），优先选分析输出的"强拍总表"里的拍。
   - **不要给整幅画面加每拍抖动/缩放**（观感会晕）；跟拍只让内容元素动。
5. **每支视频都要配一张封面**：在业务目录写 `Cover.tsx`，挂到 `spec.Cover`，随视频一起交付（它是视频的门面，必须与视频同风格、同主题）。

## 生成流程（8 步）

### 步骤 0 · 选题与分镜
先想清楚，再动手：
- 主题：这支视频要讲清楚**一个问题/一个概念**（如"访问网页背后的链路""二维码会不会用完""二分查找"）。
- 分镜：把主题拆成 N 个"每幕一个概念"的场景，排出顺序（Intro → 主体若干幕 → Outro）。
- 节奏：**成片总时长目标 2~3 分钟，尽量做到 3 分钟（≈180s）**。先按目标时长反推拍数，再分给各幕：
  - 换算：`totalBeats ≈ 目标秒数 × bpm / 60`（bpm 112.8 时，2~3 分钟 ≈ 226~339 拍；bpm 120 时 ≈ 240~360 拍）。
  - 最终时长 ≈ `totalBeats × 60/bpm + tailFrames/FPS` 秒（正片 + 收尾）。
  - 目标 3 分钟就取区间上限（如 112.8bpm 取 ~336 拍，参考 `binary-search`）；实在撑不满 3 分钟就退到 2 分钟下限，**不要为凑时长注水**。
  - 每幕拍数按内容分配，且**取 16 的倍数**（4 小节）：主体幕通常 16 / 32 / 48 拍。
  - **分幕时先把大卡点铺出来**：把总拍数按 16 拍一段列出来，逐段标"转场"还是"内容跳变"，再决定每幕占几段。

### 步骤 1 · 复制骨架
把 `src/videos/_template/` 整个复制成 `src/videos/<id>/`（`<id>` 用 kebab-case，如 `web-request`）。
产物：`spec.ts`（配置）+ `scenes/`（场景）+ `Cover.tsx`（封面）。

### 步骤 2 · 放置 BGM
音频放到 `public/<id>/bgm.mp3`。
- 可以复用已有业务的音频（如 `web-request/bgm.mp3` 被 `qrcode`、`binary-search` 复用），只要放一份到自己的资源目录。
- 资源目录必须与视频目录同 id。

### 步骤 3 · 分析节拍（决定卡点，最关键的一步）
```
npm run beat -- public/<id>/bgm.mp3
```
输出分三部分，**都要用上**：
1. **拍速参数**：`bpm`、`首拍相位(offset)`、`每拍帧数`、`可用拍数`，以及可直接粘贴进 `spec.ts` 的 `bpm` / `offset` / `totalBeats` 三行。
   - `totalBeats` 不要超过音频"可用拍数"，否则片尾会没声音。
   - 若输出提示"检测到半速误判"，**按提示的双倍 BPM 填 spec**（offset 不变）——BPM 检测常把快歌听成一半速度。
2. **重拍结构**：给出 4 小节（16 拍）边界的抬升系数。>1 说明边界确实更重，卡点可按 16 拍铺。
3. **大卡点落点表**：每 16 拍一行的「拍号 / 秒数 / ★或△ / 强度」。
   - `★` = 该拍明显偏重，**直接在这里切场**；
   - `△` = 该边界偏弱，别硬切场，改做内容跳变（数字跳变 / 元素砸入）；
   - 还有一张"强拍总表"，供幕内小卡点挑拍用。

**把落点表抄进 `spec.ts` 的注释**，让 `scenes[]` 的每一个 `start` 都能对上表里的拍号。这一步做完，分镜的拍号就定死了，后面写场景只按这些拍号取 `k(n)`。

### 步骤 4 · 编写 `spec.ts`
`spec.ts` 导出唯一一份 `VideoSpec`，字段如下（参照 `src/videos/<已有业务>/spec.ts`）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | string | Composition id，全局唯一（如 `WebRequest`） |
| `bpm` / `offset` | number | 由步骤 3 得出（若提示半速误判，用双倍 BPM） |
| `totalBeats` | number | 正片总拍数；按**目标时长 2~3 分钟（尽量 3 分钟）**反推（见步骤 0），**且取 16 的倍数**，不超过音频可用拍数 |
| `transFrames` | number | 转场帧数（让转场结束正好落在拍上，常用 12） |
| `tailFrames` | number | 结尾留白帧数（常用 30~45） |
| `bgm` | string | 相对 `public/` 的路径，如 `<id>/bgm.mp3` |
| `bg` | string | 整片底色 |
| `width` / `height` | number | 常用 `1920 / 1080` |
| `scenes` | `SceneDef[]` | 场景表：`{ start, end, Comp, trans, bg }`，`start/end` 为**拍号**，全部取 **16 的倍数** |
| `Backdrop?` | `React.FC` | 可选，场景内背景层（不填用默认 `BeatGrid`） |
| `Hud?` | `React.FC<HudProps>` | 可选，顶层 HUD（不填用默认 `ProgressHud`） |
| `exitDim?` | number | 可选，退场压暗程度，默认 `0.5`；纸面风格常设 `0` |
| `Cover?` | `React.FC` | 封面组件；挂上后自动注册为 id `<视频id>Cover` 的 Still（步骤 7） |

**`scenes[]` 的写法（按大卡点铺）**：

```ts
// 大卡点落点（来自 npm run beat）：0★ / 16△ / 32★ / 48△ / 64△ ...
// 规则：每个 start 取 16 的倍数；★ 处切场，幕内部的 △ 处做内容跳变
scenes: [
  { start: 0,  end: 16, Comp: Intro,      trans: "none",      bg: P.bg },
  { start: 16, end: 32, Comp: AppUI,      trans: "zoom",      bg: P.bg },
  { start: 32, end: 64, Comp: MapToGraph, trans: "slideLeft", bg: P.land }, // 内部跳变：拍 48
  { start: 64, end: 80, Comp: Weighted,   trans: "circle",    bg: P.bg },
  ...
],
```

> 关键：**场景长度是 16 的整数倍**。若某幕内容只需 24 拍，就凑成 32 拍（加一个内部跳变），不要出现 24 或 40 这种非 16 倍数。

### 步骤 5 · 编写场景
每个场景一个文件 `scenes/<Name>.tsx`，统一签名：

```tsx
import { Caption, Center, pop, SceneProps, useAt, useT } from "../../../shared";

export const MyScene: React.FC<SceneProps> = ({ start }) => {
  const t = useT();            // 场景内相对帧：0 帧 = 本场景起始拍
  const at = useAt();
  const k = (n: number) => at(start, n);   // 第 n 拍的场景内帧（n 可为小数，如 0.5 表示半拍）
  const lineAt = k(4);
  return (
    <Center>
      <div style={{ transform: `scale(${pop(t, 0)})` }}>标题</div>
      <Caption t={t} from={lineAt} text="字幕" />
    </Center>
  );
};
```

- 场景内所有动画触发点都用 `k(n)` 卡在拍上；节奏脉冲可用 `useBeat().beatPulse(frame)`。
- **幕内必须安排跳变**：一幕若跨过 16 拍边界（如 32 拍长），要在这些边界处各做一次内容跳变，避免"画面在干等"。跳变示例：数字从 92 跳到 259、卡片整块砸入、路径一次性画满、画面元素堆叠刷新。
- 触发点写法：`const jumpAt = k(16)` 后配 `hit(t, jumpAt, 6)` / `pop(t, jumpAt, 10)`，卡点落在拍上就自然跟拍。
- `TransType` 可选值：`none | zoom | slideLeft | slideUp | circle | blinds | diag | spin | glitch | fade`。
  - 相邻场景**布局一致**时用 `fade` 交叉淡入，画面连续不跳。
  - 大卡点处（★）可用更"重"的转场；全屏覆盖式的招牌转场（如整屏路线扫过）底层场景设 `trans: "none"` 硬切即可。

### 步骤 6 · 注册
在 `src/videos/index.ts` 里 `import` 新 spec 并加入 `VIDEOS` 数组：
```ts
import { myVideo } from "./my-video/spec";
export const VIDEOS: VideoSpec[] = [webRequest, qrcode, binarySearch, myVideo];
```
> `src/Root.tsx` 会自动为该 spec 注册视频 Composition；若 spec 挂了 `Cover`，还会自动额外注册一张 `<视频id>Cover` 的 Still。你**不需要**改 `Root.tsx`。

### 步骤 7 · 制作视频封面
封面是视频的门面，必须**与视频息息相关**——主题一致、风格一致，一眼能认出属于这支视频。做法：

1. 在业务目录写 `Cover.tsx`（`_template/Cover.tsx` 已是起点），组件签名是普通 `React.FC`，**不带 props**。
2. 挂到 `spec.Cover`（`src/videos/<id>/spec.ts`）。
3. 跑 `npm run still -- <视频id>Cover out/<id>/cover.png` 导出 PNG。

**封面内容（建议三件套）**：
- **主标题**：视频标题，把关键词高亮（区别于场景里的小字）。
- **副标题/钩子**：一句勾起好奇心的话（如"背后到底发生了什么？"）。
- **标志性视觉**：直接搬视频里最有辨识度的元素（web-request 的链路节点、qrcode 的点阵、binary-search 的 Clawd 与队伍）。

**风格要跟视频对齐**：
- 默认风格视频：用 shared 的 `C` 调色板 + `FONT`/`MONO`，深蓝底 + 霓虹色。
- 自定义风格视频：用业务 `kit/` 里的专属调色板与素材（如 binary-search 用 `kit/theme.ts` 的 `P`、`kit/Clawd.tsx` 的小人）。

**硬性约束**：封面是**静态图**，只渲染一帧，**不能使用依赖节拍 context 的东西**——`BeatGrid` / `ProgressHud` / `useT` / `useAt` / `useBeat` 都会在 Still 里报错。需要网格/点阵底纹就自己用 CSS 画（参考 `kit/ui.tsx` 的 `PaperBackdrop`）。

### 步骤 8 · 校验与渲染
```
npm run typecheck                                # 类型检查，退出码必须为 0
npm run studio                                   # 打开 Remotion Studio 预览（核对节奏/卡点/封面）
npm run still -- <id> --scale=0.25 --frame=30    # 抽视频单帧快速自查布局
npm run still -- <id>Cover out/<id>/cover.png     # 导出封面 PNG
npm run render -- <id> out/<id>.mp4               # 渲染成片
```

## 风格：默认 vs 自定义

- **默认霓虹网格风格**：不填 `Backdrop` / `Hud`，即用 `shared` 默认的深蓝网格背景（随节拍呼吸）+ 渐变进度条 HUD。`web-request`、`qrcode` 用的是这一套，靠 `scenes[].bg` 换章节底色。
- **自定义风格覆盖**：当选题需要不同气质时（例如纸质绘本风），在 `spec.ts` 里覆盖 `Backdrop` / `Hud` / `exitDim`，并在业务目录下建 `kit/` 放专属资源。
  - 范例：`src/videos/binary-search/` —— 暖白纸面 + 陶土橙，`kit/theme.ts`（专属配色 `P` + 队形常量）、`kit/Clawd.tsx`（像素小人）、`kit/Queue.tsx`、`kit/ui.tsx`（自定义 `PaperBackdrop` / `ClawdHud` 等）。

## shared API 速查（业务侧只从 `../../../shared` import）

- **装配**：`Video`、`videoDuration`（一般不用手写）。
- **时间与节拍**：`useT()`（场景内帧）、`useAt()`（`(start, k) => 帧`）、`useBeat()`（`{ BEAT, OFFSET, TRANS, bf, beatPulse }`）、`FPS`、`CL`（interpolate 的 clamp 选项）、`makeBeat`。
- **动画工具**：`pop(t, from, damping?)`（回弹弹出，返回 0→1）、`prog(t, from, dur)`（平滑进度 0→1）、`hit(t, from, decay?)`（打击脉冲，衰减）。
- **配色与字体**：`C`（默认调色板）、`FONT`、`MONO`。
- **可视化组件**：
  - `Center`（居中容器）
  - `SceneTitle`（`{ t, step, title, color }` 步骤标题）
  - `NodeBox`（`{ x, y, label, sub?, icon, color, appear, glow?, w? }` 节点盒子）
  - `Packet`（`{ from:[x,y], to:[x,y], p, color, label? }` 数据包沿路径飞行）
  - `Wire`（`{ from, to, color, p, t }` 虚线连接）
  - `Caption`（`{ t, from, text, color? }` 底部字幕）
  - `SceneShell`（`{ type, total, bg, exitDim?, children }` 转场外壳，通常由装配器调用）
  - `BeatGrid`（默认背景）、`ProgressHud`（默认 HUD）
- **类型**：`SceneProps`、`SceneDef`、`TransType`、`VideoSpec`、`Beat`、`HudProps`。

## 检查清单

- [ ] `id` 全局唯一，且与目录 / `public/<id>/` 一致
- [ ] BGM 已放到 `public/<id>/bgm.mp3`，`spec.bgm` 路径正确
- [ ] `bpm` / `offset` / `totalBeats` 来自 `npm run beat`（半速误判时用双倍 BPM），且 `totalBeats` 不超过音频可用拍数、取 16 的倍数
- [ ] 成片总时长落在 **2~3 分钟**（目标 3 分钟，约 180s）；不够就补内容而非注水
- [ ] `scenes[].start/end` 连续无空洞、全部取 **16 的倍数**（落在每 4 小节的乐句重拍上）
- [ ] **每个 16 拍边界都有大卡点**（切场转场 或 强烈内容跳变），没有"干等转场"的空档
- [ ] 没有给整幅画面加每拍抖动（跟拍只发生在内容元素上）
- [ ] 每个场景文件从 `../../../shared` import，统一 `React.FC<SceneProps>`
- [ ] 已在 `src/videos/index.ts` 注册
- [ ] 已写 `Cover.tsx` 并挂到 `spec.Cover`；封面与视频**同主题同风格**，且不含节拍 context 依赖
- [ ] 已导出封面 `out/<id>/cover.png`
- [ ] `npm run typecheck` 通过；`npm run studio` 目测节奏与封面 OK

## 常见坑

- **BGM 时长不足**：`totalBeats` 超过音频可用拍数 → 片尾静音。回到步骤 3 调小。
- **切场不跟拍**：切换点没落在乐句重拍上（观感像"画面在原地等"）→ 把 `scenes[].start/end` 都改成 16 的倍数。
- **两个大卡点之间空档**：幕跨了 16 拍边界却什么都没发生 → 在该边界加一次内容跳变。
- **全片抖动**：给场景根节点加了每拍 scale/rotate → 观感会晕，删掉；只让内容元素跟拍。
- **BPM 半速误判**：`npm run beat` 把快歌听成一半速度（输出会提示）→ 按双倍 BPM 填 spec，offset 不变。
- **画面跳变**：相邻场景布局一致却没复用队形/坐标、又用了非 `fade` 转场 → 改 `fade` 并保持元素坐标一致。
- **误注册骨架**：把 `_template` 加进了 `VIDEOS` → 骨架不注册，只在 `videos/index.ts` 注册真实业务。
- **资源放错目录**：BGM 放到 `public/` 根或别的 id 目录 → 必须 `public/<id>/`。
- **自定义风格漏设退场**：换浅色纸面风格却沿用默认退场压暗 → 设 `exitDim: 0`。
- **封面误用节拍组件**：封面是静态 Still，误用 `BeatGrid` / `ProgressHud` / `useT` / `useAt` / `useBeat` 会直接报错 → 底纹自绘，别碰节拍 context。
- **封面与视频脱节**：封面没复用视频的配色 / 母题 → 必须同主题同风格，让人一眼认出属于这支视频。
