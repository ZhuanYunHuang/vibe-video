# 目录结构改进方案

## 摘要

当前"视频工厂"结构（`src/shared/` 共用框架 + `src/videos/<id>/` 业务代码）经过上一轮重构已经成立，shared/videos 边界清晰、`_template` 骨架可用、渲染结果保持像素级不变。本次改进聚焦三点：

1. **约定文档化**：把长期有效的目录边界与加视频流程从历史重构文档中提炼成独立手册，让"加新视频不改 shared"的约定有显式入口。
2. **`shared/` 内部按职责分组**：把"纯类型/工具"与"React Context 运行时"分开，边界更清晰；保持 `shared/index.ts` barrel 导出不变，场景 import 零改动。
3. **资源路径约定固化**：明确 `public/<视频id>/` 与 `src/videos/<视频id>/` 的对齐关系。

路径别名（tsconfig paths）经评估**维持原决策不做**（理由见"明确不做"节）。

---

## 一、当前目录结构分析

```
vibe-video/
├── .trae/documents/refactor-shared-business-split.md   ← 约定只存在于历史重构文档
├── package.json / tsconfig.json / remotion.config.ts
├── public/web-request/bgm.mp3                          ← 资源与视频 id 对齐，但约定无显式文档
├── scripts/analyze-beat.mjs
├── src/
│   ├── index.ts                                        ← registerRoot
│   ├── Root.tsx                                        ← 遍历 VIDEOS 注册 Composition
│   ├── shared/                                         ← 共用框架（视频无关）
│   │   ├── index.ts                                    ← barrel 导出
│   │   ├── Video.tsx                                   ← 通用装配器
│   │   ├── anim.ts / theme.ts / timing.ts / types.ts   ← 纯逻辑，平铺在根
│   │   ├── beat-context.tsx                            ← React Context 运行时，与纯逻辑混平铺
│   │   └── components/                                 ← 9 个可视化组件
│   └── videos/                                         ← 业务代码
│       ├── index.ts                                    ← 视频清单（显式）
│       ├── _template/                                  ← 新视频骨架（不注册）
│       └── web-request/                                ← 当前唯一视频
│           ├── spec.ts
│           └── scenes/                                 ← 10 个场景
└── out/                                                ← 渲染产物（已 gitignore）
```

### 已经做对的点

- **shared / videos 分层**：`VideoSpec` + 通用装配器 [Video.tsx](file:///d:/newDownload/project/vibe-video/src/shared/Video.tsx) 与业务 spec 完全解耦，加视频只改 `videos/` 和 `videos/index.ts`。
- **`_template` 不注册**：利用 `videos/index.ts` 显式清单，天然排除骨架目录。
- **barrel 导出**：场景统一 `import { ... } from "../../../shared"`，组件内部实现变化不影响场景。
- **资源目录对齐**：`public/web-request/bgm.mp3` ↔ `src/videos/web-request/`。

### 可改进的点

| # | 问题 | 影响 |
|---|---|---|
| 1 | 目录边界与加视频流程的约定只写在历史重构文档里，位置不显眼 | 新成员/后续开发容易误改 shared 或漏步骤 |
| 2 | `shared/` 根下纯逻辑（anim/theme/timing/types）与 React Context（beat-context）平铺混放 | 语义边界不清晰，文件多了会继续堆 |
| 3 | 资源路径约定（`public/<id>/bgm.mp3`）无显式规范，靠 spec 注释口头约定 | 新视频容易放错资源位置 |

---

## 二、改进方案

### 改进 1：目录约定文档化（建议做）

新增 `docs/video-factory.md`，作为"视频工厂手册"：

- **目录边界规则表**：`shared/` 放什么、`videos/<id>/` 放什么、加新视频要不要改（内容从原重构文档提炼）。
- **加新视频 5 步 checklist**（对应 `_template/spec.ts` 顶部注释）：
  1. 复制 `_template` 为 `src/videos/<id>/`
  2. BGM 放 `public/<id>/bgm.mp3`
  3. `npm run beat -- public/<id>/bgm.mp3` 得出 BPM/offset，填进 spec
  4. 改场景、调整 scenes 表拍号
  5. 在 `src/videos/index.ts` 注册
- **渲染产物命名规范**：`npm run render -- <id> out/<id>.mp4`。

历史文档 `refactor-shared-business-split.md` 保留不动（它是重构过程记录，非长期约定）。

### 改进 2：`shared/` 内部按职责分组（建议做，场景零改动）

```
src/shared/
├── index.ts              ← barrel 导出不变，场景 import 全部不动
├── Video.tsx             ← 通用装配器（留根，因为它依赖全部子层）
├── core/                 ← 纯类型与工具，无 React 状态
│   ├── types.ts
│   ├── timing.ts
│   ├── theme.ts
│   └── anim.ts
├── runtime/
│   └── beat-context.tsx  ← Context 下发
└── components/           ← 不变（9 个组件）
```

改动内容（全部在 shared 内部，场景零改动）：

| 文件 | 改动 |
|---|---|
| `shared/types.ts` → `shared/core/types.ts` | 移动 |
| `shared/timing.ts` → `shared/core/timing.ts` | 移动；`./types` import 改 `./types`（同目录不变） |
| `shared/theme.ts` → `shared/core/theme.ts` | 移动 |
| `shared/anim.ts` → `shared/core/anim.ts` | 移动；`./timing` import 改 `./timing`（同目录不变） |
| `shared/beat-context.tsx` → `shared/runtime/beat-context.tsx` | 移动；`./types` 改 `../core/types` |
| `shared/components/*.tsx` | `../timing`→`../core/timing`、`../theme`→`../core/theme`、`../anim`→`../core/anim`、`../beat-context`→`../runtime/beat-context`、`../types`→`../core/types` |
| `shared/index.ts` | 更新导入路径（导出名与结构不变） |
| `shared/Video.tsx` | `./timing`→`./core/timing`、`./beat-context`→`./runtime/beat-context`、`./types`→`./core/types` |

> 需要逐一确认的组件引用（Phase 1 已抽查）：`SceneTitle.tsx`、`ProgressHud.tsx` 引用了 `../anim`、`../beat-context`、`../theme`、`../timing`、`../types` 等；执行时以 Grep 全量核对。

**收益**：core（纯逻辑）/ runtime（Context）/ components（UI）三层语义清晰，后续 shared 扩展有明确落点。**成本**：仅 shared 内部约 15 个文件的 import 路径调整。

### 改进 3：资源路径约定固化（轻量）

- 在 `docs/video-factory.md` 中写明规范：**BGM 放 `public/<视频id>/bgm.mp3`，`spec.bgm` 写 `<视频id>/bgm.mp3`**。
- 在 `_template/spec.ts` 的 `bgm` 注释里同步点明该规范。
- 不做目录重命名（`public/web-request/` 已与 `src/videos/web-request/` 对齐）。

---

## 三、明确不做（保持现状）

| 候选 | 理由 |
|---|---|
| tsconfig paths 别名（如 `@shared/`） | Remotion 4 默认不解析 TS paths，需额外 webpack override（[官方文档](https://www.remotion.dev/docs/typescript-aliases)）；重构文档决策 #7 已明确"收益不抵风险"，当前 `../../../shared` 层级固定，场景每处只 import 一次，改动收益低 |
| 自动扫描 `videos/` 生成清单 | 破坏显式清单与 `_template` 排除机制，可预测性下降 |
| 场景文件按段落分子目录 | 当前 10 个平铺、命名已按流程顺序（Intro→…→Outro），分组属过度设计 |
| shared 顶层再抽子目录（如 ui/） | components/ 已承担 UI 分组，9 个组件无需再拆 |

---

## 四、Assumptions & Decisions

| # | 决策 | 理由 |
|---|---|---|
| 1 | 本次只做结构优化，不改任何文案、数值、节拍、动画曲线 | 与上一轮重构原则一致，渲染结果必须保持像素级不变 |
| 2 | 新增 `docs/video-factory.md` 作为约定唯一入口 | 历史文档是过程记录，不宜当长期手册 |
| 3 | `shared/` 分 core/runtime/components 三层，`index.ts` barrel 导出名不变 | 场景零改动、回归风险最小 |
| 4 | 不引入任何新依赖、不改 `remotion.config.ts`、不做路径别名 | 维持既有决策，控制风险 |

---

## 五、验证步骤

| # | 验证项 | 通过标准 |
|---|---|---|
| 1 | 类型检查 | `npm run typecheck` 退出码 0 |
| 2 | 场景 import 零改动 | `git diff` 中 `src/videos/**` 无任何改动 |
| 3 | 渲染回归（可选但推荐） | 重渲染 1-2 个代表帧与现 `out/video.mp4` 对应帧比对，视觉一致 |
| 4 | 约定文档存在 | `docs/video-factory.md` 包含边界规则表 + 5 步 checklist + 资源路径规范 |
