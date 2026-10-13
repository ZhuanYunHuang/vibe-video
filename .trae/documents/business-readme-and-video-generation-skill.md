# 业务 README + 视频生成 Skill 计划

## 摘要

本项目是一个基于 **Remotion** 的"视频工厂"：`src/shared/` 是与视频无关的通用框架，`src/videos/<id>/` 是每一支视频的业务代码（业务 = 一支视频）。当前有 3 个业务：`web-request`、`qrcode`、`binary-search`，另有 `_template` 骨架（不注册为 Composition）。

本次要做两件事：

1. **为每个业务补 README**：在 `src/videos/<id>/` 下新增 `README.md`，讲清楚「这个业务是什么 / 怎么做 / 采用什么风格」。
2. **新增一个项目级 Skill**：`.trae/skills/video-generation/SKILL.md`，把"生成一支新视频"的完整流程固化下来，供 Agent 在新需求到来时按图施工。

---

## 一、当前状态分析（已读代码，非假设）

**框架层**（`src/shared/`，业务无关，由 `src/shared/index.ts` 桶导出）：

- `Video.tsx`：通用装配器，吃一份 `VideoSpec` 输出完整视频；遍历 `spec.scenes`，用 `Sequence` + `SceneShell` 拼场景，顶层挂 BGM（Audio）、背景层（`spec.Backdrop ?? BeatGrid`）、HUD（`spec.Hud ?? ProgressHud`）。
- `core/types.ts`：`SceneProps = { start: number }`、`TransType`（none/zoom/slideLeft/slideUp/circle/blinds/diag/spin/glitch/fade）、`HudProps`、`SceneDef`、`Beat`、`VideoSpec`。
- `core/timing.ts`：`FPS = 30`、`CL`（clamp 选项）、`makeBeat(bpm, offset, trans)` → `{ BEAT, OFFSET, TRANS, bf, beatPulse }`。
- `core/theme.ts`：默认调色板 `C`（深蓝霓虹）、`FONT`、`MONO`。
- `core/anim.ts`：`pop(t, from, damping)`（回弹弹出）、`prog(t, from, dur)`（平滑进度）、`hit(t, from, decay)`（打击脉冲）。
- `runtime/beat-context.tsx`：`BeatProvider` / `useBeat` / `useT`（场景内帧，0 = 场景起始拍）/ `useAt()`（`(start, k) => 第 k 拍相对帧`，k 可为小数）。
- `components/`：`Center`、`SceneTitle`、`NodeBox`、`Packet`、`Wire`、`Caption`、`SceneShell`（转场外壳）、`BeatGrid`（默认网格背景）、`ProgressHud`（默认进度条+切场闪白）。

**业务层**（`src/videos/<id>/`）：每支视频 = 一个 `spec.ts`（全部配置）+ `scenes/*.tsx`（每场景一个文件）。注册入口是 `src/videos/index.ts` 的显式数组 `VIDEOS`。

**三个业务的现状差异**：

| 业务 | id | 主题 | 风格 | 长度 |
|---|---|---|---|---|
| `web-request` | WebRequest | 访问网页背后的链路（DNS→TCP→TLS→HTTP→Server） | 默认霓虹网格（未覆盖 Backdrop/Hud），每场独立深色底 | 112 拍 |
| `qrcode` | Qrcode | 二维码会被用完吗（二进制/结构/版本/容量/计数） | 默认霓虹网格，靠 `scenes[].bg` 做章节色 | 280 拍 |
| `binary-search` | BinarySearch | 用"排队"比喻讲二分查找 | **独有自定义风格覆盖**：暖白纸面 + Claude 陶土橙，专属 `kit/`（theme/Clawd/ui），`PaperBackdrop` + `ClawdHud`，`exitDim:0` | 336 拍 |

**已有约定文档**：[docs/video-factory.md](file:///d:/newDownload/project/vibe-video/docs/video-factory.md)（目录边界 + 加新视频 5 步 + 资源路径规范），是长期约定入口。

**现状缺口**：① 每个业务"是什么/怎么做/什么风格"只散落在 `spec.ts` 顶部注释里，无独立说明；② "加一支视频"的流程只写了 5 步粗线，缺少 Agent 可直接执行的操作细节（shared API 用法、卡点规则、风格覆盖方式、校验/渲染命令）。

---

## 二、Proposed Changes

### 变更 1：为每个业务新增 `README.md`

在三个业务目录各新增一个 `README.md`，统一采用以下结构（内容按各业务实际填写，全部基于已读代码）：

```markdown
# <视频名>（<Composition id>）

> 一句话定位：<这片讲什么>

## 这是什么
<业务内容：主题、要回答/讲清楚的问题、受众、整体叙事结构（场景顺序）>

## 怎么做
- 组装方式：spec 驱动（`spec.ts` 是唯一配置入口），`src/shared` 提供装配器与组件
- 场景编排：N 个场景，列场景表（拍号区间 + 场景组件 + 转场）
- 节拍：BGM 来源与 BPM/offset/每拍帧数，`useAt(start, k)` 卡点
- 组件用法：用到了 shared 里的哪些组件/工具
- 注册：在 `src/videos/index.ts` 的 VIDEOS 里的位置

## 采用什么风格
- 背景层（BeatGrid 默认 or 自定义 Backdrop）
- 配色（C 默认调色板 or 专属 P）
- HUD（ProgressHud 默认 or 自定义 Hud）
- 转场策略、退场压暗（exitDim）
- 视觉母题（如像素小人、排队队形）

## spec 关键参数
| 字段 | 值 | 说明 |
（id/bpm/offset/totalBeats/transFrames/tailFrames/bgm/bg/width/height/风格覆盖）

## 场景表
| 拍号 | 场景组件 | 转场 | 说明 |
```

**逐个业务的内容要点**（执行时据此填写）：

- **`src/videos/web-request/README.md`**
  - 是什么：《访问一个网页，背后发生了多少事》——科普一次网页请求的完整链路：浏览器 → DNS 解析 → TCP 三次握手 → TLS 握手 → HTTP 请求 → 服务器处理 → 渲染 → 完成。
  - 怎么做：10 个场景（[spec.ts](file:///d:/newDownload/project/vibe-video/src/videos/web-request/spec.ts)），逐拍砸字开场；用 `Center`/`NodeBox`/`Packet`/`Wire`/`Caption`/`SceneTitle` 做链路可视化；节拍由 `scripts/analyze-beat.mjs` 分析 `public/web-request/bgm.mp3` 得出（bpm 112.8 / offset 12）。
  - 风格：**默认霓虹网格风格**——`C` 调色板（深蓝 `#0b1020`）、默认 `BeatGrid`（网格随节拍呼吸）、默认 `ProgressHud`（切场闪白 + 渐变进度条）；每场用 `scenes[].bg` 换底营造阶段感；转场丰富（zoom/slideLeft/circle/blinds/diag/slideUp/spin/glitch）。

- **`src/videos/qrcode/README.md`**
  - 是什么：《二维码会被用完吗？》——从二进制编码、矩阵结构、版本、容量、组合计数到消耗速度，用数学回答"二维码够不够用"。9 个场景：Intro→Binary→Structure→Version→Capacity→Count→Consume→Math→Outro。
  - 怎么做：同 web-request 的默认装配；BGM 复用 `public/qrcode/bgm.mp3`（112.8）；全程 `useAt` 卡点。
  - 风格：**默认霓虹网格风格 + 章节色**——不覆盖 Backdrop/Hud，靠 `scenes[].bg`（`#0d1430`/`#120f2e`/`#0a1a2a`…）区分章节；`C` 调色板做强调色。

- **`src/videos/binary-search/README.md`**
  - 是什么：《二分查找》——用"排队"比喻讲二分查找：有序队伍 + 目标号牌 81，每次问"在左半还是右半"，折半收敛；再对比线性查找，最后落到代码。9 个场景：Intro→Queue→Linear→Idea→Halving→Compare→Array→Code→Outro。
  - 怎么做：**唯一带专属 `kit/` 的业务**（[kit/theme.ts](file:///d:/newDownload/project/vibe-video/src/videos/binary-search/kit/theme.ts) 定义 `P` 调色板与排队队形常量、[kit/Clawd.tsx](file:///d:/newDownload/project/vibe-video/src/videos/binary-search/kit/Clawd.tsx) 像素小人、[kit/ui.tsx](file:///d:/newDownload/project/vibe-video/src/videos/binary-search/kit/ui.tsx) 业务级组件）；排队 4 幕共用同一队形，用 `fade` 交叉淡入保证画面连续。
  - 风格：**暖白纸面 + Claude 陶土橙**——`P.bg #F3EEE6` / `P.clay #D97757`；自定义 `Backdrop: PaperBackdrop`（浅点阵）与 `Hud: ClawdHud`（底部细进度条 + 随节拍跳跃的迷你小人）；`exitDim: 0`（暖色纸面不压暗退场）；主角是像素小人 Clawd。

**为什么/怎么做**：只在各业务目录下新增文件，不改任何 `shared/` 代码与既有场景，渲染结果零影响。

### 变更 2：新增项目级 Skill `video-generation`

新建目录 `.trae/skills/video-generation/`，创建 `SKILL.md`（遵循 skill-creator 约定：目录 `.trae/skills/<name>/` + `SKILL.md`，frontmatter 含 `name`/`description`）。

**Frontmatter**：

```yaml
---
name: "video-generation"
description: "在本 Remotion 视频工厂中新增/生成一支视频：复制 _template 骨架、放置 BGM、分析节拍、编写 spec 与场景、注册并渲染导出。当用户要求'生成/新增一支视频''把某主题做成视频''加一个科普视频'时调用。"
---
```

**正文大纲**（决策完整，执行时按此展开）：

1. **适用场景**：什么时候用本 skill；明确"业务 = `src/videos/<id>/` 里的一支视频"。
2. **目录与约定**：引用 [docs/video-factory.md](file:///d:/newDownload/project/vibe-video/docs/video-factory.md)（不重复其内容，只做指路 + 关键红线：不改 `shared`、`_template` 不注册、资源目录与视频 id 对齐）。
3. **生成流程（7 步，含命令与产物）**：
   - 步骤 0 选题与分镜：确定主题 → 拆出每场要讲的一个概念 → 估每场拍数（切换点落强拍）。
   - 步骤 1 复制骨架：`src/videos/_template/` → `src/videos/<id>/`。
   - 步骤 2 放 BGM：`public/<id>/bgm.mp3`（可与已有业务复用同一音频）。
   - 步骤 3 算节拍：`npm run beat -- public/<id>/bgm.mp3`，把输出的 `bpm`/`offset`/`totalBeats` 填进 `spec.ts`。
   - 步骤 4 写 `spec.ts`：给 `VideoSpec` 全字段表（id/bpm/offset/totalBeats/transFrames/tailFrames/bgm/bg/width/height/scenes + 可选 Backdrop/Hud/exitDim）与填写规则（`totalBeats` 由音频可用拍数决定；`transFrames` 让转场结束正好落在拍上）。
   - 步骤 5 写场景：`scenes/<Name>.tsx`，统一 `React.FC<SceneProps>`；示范 `useT()` / `useAt(start, k)` / `pop` / `hit` / `prog` 的用法与"卡点"写法；列 `TransType` 可选值。
   - 步骤 6 注册：在 `src/videos/index.ts` `import` 并加入 `VIDEOS`。
   - 步骤 7 校验与渲染：`npm run typecheck` → `npm run studio` 预览 → `npm run still` 抽帧 → `npm run render -- <id> out/<id>.mp4`。
4. **风格选择**：默认霓虹网格风格 vs 自定义风格覆盖（`Backdrop`/`Hud`/`exitDim` + 业务专属 `kit/`），以 binary-search 为例说明何时需要覆盖。
5. **shared API 速查**：可 `import { ... } from "../../../shared"` 的清单 + 关键组件签名（Center/SceneTitle/NodeBox/Packet/Wire/Caption/SceneShell/BeatGrid/ProgressHud + pop/prog/hit + useT/useAt/useBeat + FPS/CL/C/FONT/MONO + 类型）。
6. **检查清单**：id 唯一 / BGM 路径与时长 / 切点落强拍 / 资源目录对齐 / index 已注册 / typecheck 通过。
7. **常见坑**：BGM 时长不足导致 `totalBeats` 超界；切点不在强拍导致"不跟拍"；`_template` 被误注册；资源放错目录；自定义风格时忘设 `exitDim`。

**为什么/怎么做**：Skill 是"流程的可执行入口"，与 README/`docs` 分工——README 讲"这支视频是什么"，`docs/video-factory.md` 讲"目录约定"，Skill 讲"Agent 怎么一步步生成一支新视频"。

---

## 三、Assumptions & Decisions

| # | 决策/假设 | 理由 |
|---|---|---|
| 1 | "每个业务" = `src/videos/` 下的 **3 个真实业务**（web-request/qrcode/binary-search）；**不含** `_template` | `_template` 是骨架不是业务；其说明已由 `docs/video-factory.md` + `spec.ts` 顶部注释覆盖 |
| 2 | README 文件名用 `README.md`，语言中文，结构为「这是什么 / 怎么做 / 采用什么风格 + 参数表 + 场景表」 | 对齐用户原话"介绍这个业务是什么、怎么做的、采用什么风格" |
| 3 | Skill 定位为 **"生成一支新视频"的端到端流程**（选题→骨架→BGM→节拍→spec→场景→注册→渲染），而非仅"执行渲染命令" | 用户原话"实现视频的生成"，在视频工厂语境下最合理的解读是新增/产出一支视频的完整链路 |
| 4 | Skill 目录/名称：`.trae/skills/video-generation/SKILL.md` | 项目当前无任何 `.trae/skills/`，无命名冲突；沿用 skill-creator 的 kebab-case + `SKILL.md` 约定 |
| 5 | Skill 正文**引用**而非复制 `docs/video-factory.md`，只补充可执行细节 | 避免同一约定两处维护、产生漂移 |
| 6 | 本批改动**只新增文件**，不改 `shared/`、不改既有场景、不改 `docs/video-factory.md`、不动 BGM/渲染产物 | 与项目"渲染结果像素级不变"的一贯原则一致，把风险降到最低 |
| 7 | 不新增任何依赖、不改 `remotion.config.ts` | 与既有决策一致 |

> 若用户对「Skill 的定位（决策 3）」或「是否也给 `_template` 加 README（决策 1）」有不同意见，请在审阅时指出，会据此调整。

---

## 四、Verification

| # | 验证项 | 通过标准 |
|---|---|---|
| 1 | README 齐全 | `src/videos/{web-request,qrcode,binary-search}/README.md` 均存在，且包含「是什么/怎么做/风格」三节 |
| 2 | README 准确 | 文中引用的 id/拍数/场景名/BGM 路径/风格覆盖与各自 `spec.ts` 一致（逐项核对） |
| 3 | Skill 结构合法 | `.trae/skills/video-generation/SKILL.md` 存在，frontmatter 含 `name`+`description`，`description` 覆盖"做什么 + 何时调用" |
| 4 | Skill 可执行性 | 按 Skill 步骤能完整走通一遍"新增一支视频"（复制骨架→beat→spec→场景→注册）；步骤中命令与现有 `package.json` scripts 一致 |
| 5 | 零回归 | `git status` 仅新增上述文件，`src/shared/**`、`src/videos/**/scenes/**`、`docs/**` 无改动；`npm run typecheck` 退出码 0 |
