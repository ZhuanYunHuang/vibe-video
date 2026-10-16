# 视频工厂手册

> 目标：用 Remotion 持续产出"流程科普"风格视频。本手册是目录边界与加视频流程的**唯一长期约定入口**。
> 历史重构过程记录见 `.trae/documents/refactor-shared-business-split.md`（非长期约定）。

---

## 一、目录边界规则

| 目录 | 放什么 | 加新视频时要改吗 |
|---|---|---|
| `src/shared/` | 与具体视频无关的框架、动画、可视化原语、类型 | 一般不改；只有新增通用能力时才加 |
| `src/shared/motion/` | **通用动效工具箱**（19 项 t/from 纯函数原语 + 几何工具） | 一般不改；新增通用动效时按 README 约定加 |
| `src/styles/` | **可复用风格包**：调色板 / 字体 / 背景 / HUD / 契约组件 / 封面模板 | 不填 style 就用默认风格；选风格只改 `kit/index.ts` 一行 |
| `src/videos/<id>/` | 这支视频的文案、场景、节奏、风格选择 | 只改这里 |
| `public/<id>/` | 这支视频的静态资源（BGM 等） | 只加这里 |
| `public/fonts/` | 风格库共用字体（如像素中文字体 FusionPixel，OFL 授权） | 一般不改 |

### `src/shared/` 内部职责

```
src/shared/
├── index.ts              ← 桶导出：场景只从这里 import
├── Video.tsx             ← 通用装配器（吃 VideoSpec，输出完整视频）
├── core/                 ← 纯类型与工具，无 React 状态
│   ├── types.ts            SceneProps / SceneDef / Beat / VideoSpec
│   ├── timing.ts           FPS / CL / makeBeat()
│   ├── theme.ts            C（调色板）/ FONT / MONO
│   └── anim.ts             pop / prog / hit
├── runtime/              ← React Context 运行时
│   └── beat-context.tsx    BeatProvider / useBeat / useT / useAt
├── motion/               ← 通用动效工具箱（19 项：text/path/ambient/impact + demo）
└── components/           ← 可视化组件（Center/NodeBox/Packet/Wire/Caption/SceneTitle/SceneShell/BeatGrid/ProgressHud）
```

### `src/videos/<id>/` 结构

```
src/videos/<id>/
├── spec.ts               ← 全部配置：BPM/拍数/场景表/BGM/风格（style: kit）
├── kit/                  ← 风格接入点：index.ts 一行 re-export 选中 src/styles/ 的一套风格
└── scenes/               ← 本视频的场景组件（每场景一个文件，从 "../kit" 取组件）
```

---

## 二、加新视频 5 步

1. **复制骨架**：把 `src/videos/_template/` 复制成 `src/videos/<id>/`（`_template` 本身不注册为 Composition）。
2. **选风格**（可选）：参考 `src/styles/README.md` 挑一套风格包，在 `kit/index.ts` 写一行
   `export * from "../../../styles/<风格名>";`；场景统一从 `"../kit"` 导入组件；`spec.ts` 加 `style: kit`。
   不选则用 shared 默认霓虹网格风格。
3. **放 BGM**：音频放到 `public/<id>/bgm.mp3`。
4. **算节拍**：`npm run beat -- public/<id>/bgm.mp3`，把输出的 `bpm` / `offset` / `totalBeats` 填进 `spec.ts`。
5. **写场景**：改造 `scenes/` 下的场景，调整 `spec.ts` 里 scenes 表的拍号（切换点应落在强拍上）。
6. **注册**：在 `src/videos/index.ts` 里 `import` 并加入 `VIDEOS` 数组。

---

## 三、资源路径规范

- BGM 放 `public/<视频id>/bgm.mp3`，`spec.bgm` 写 `<视频id>/bgm.mp3`（相对 `public/`）。
- 视频目录 `src/videos/<id>/` 与资源目录 `public/<id>/` 使用同一 id，保持对齐。
- **输出产物一律放独立目录 `out/<id>/`，每支新视频建一个新文件夹，不要散放在 `out/` 根目录**：
  - 成片：`npm run render -- <id> out/<id>/<id>.mp4`
  - 封面：`npm run still -- <id>Cover out/<id>/cover.png`
  - 竖版 / 历史版本也放同目录，命名如 `<id>-mobile.mp4`、`<id>-v2.mp4`

---

## 四、常用命令

| 命令 | 作用 |
|---|---|
| `npm run studio` | 打开 Remotion Studio 预览 |
| `npm run render -- <id> out/<id>/<id>.mp4` | 渲染指定视频（产物进 `out/<id>/`） |
| `npm run still` | 渲染静态帧 |
| `npm run beat -- <音频路径>` | 分析 BGM 得出 BPM/相位 |
| `npm run typecheck` | 类型检查 |

渲染风格演示片 / 展示页：
`npm run render -- StyleDemo-<风格id> out/styles/demo-<风格id>.mp4`、`npm run still -- StyleGallery out/styles/gallery.png`

---

## 五、风格库（src/styles/）

**是什么**：可复用的视频风格包。每套 = 语义调色板（`P`，统一键名 bg/ink/accent/seal…）+ 字体（FONT/MONO/DECOR）
+ `Backdrop`/`Hud` + 一整套**同名契约组件**（`Stage/Sub/Chapter/Slam/Card/Stamp/Mark/Kicks/Particles`）
+ 封面模板 `makeCover`。契约定义在 `src/styles/contract.ts`，所有原语是 `t/from` 纯函数（Still 可冻结渲染）。

**已交付（15 套）**：`whiteboard` 白板手绘、`pixel` 像素风（含 OFL 像素中文字体）、`flat` 扁平 MG、
`shadowpuppet` 皮影戏、`cyberhud` 赛博 HUD、`datainfo` 数据信息图、`collage` 拼贴、`bauhaus` Bauhaus、`synthwave` Synthwave、
`explode` 3D 拆解、`hanzi` 汉字演变、`variety` 综艺花字、`picturebook` 绘本科画、`mathviz` 数学可视化、`scale` 比例尺对比。
详情、色板表与批次规划见 **`src/styles/README.md`**。

**怎么用**：
- 新视频 `kit/index.ts` 一行 re-export：`export * from "../../../styles/whiteboard";`
- `spec.ts` 加 `style: kit`（`bg`/`exitDim` 可省，自动取 kit 推荐值）；`bgm`/`bg` 均可选化（无音频演示片可用）。
- 场景从 `"../kit"` 取组件；`Backdrop`/`Hud` 兼容链为 `spec.Backdrop ?? style.Backdrop ?? 默认`。
- 风格演示片与展示页由 `src/styles/demo/` 提供，在 `src/Root.tsx` 注册（与业务视频解耦）。

---

## 六、通用动效工具箱（src/shared/motion/）

**是什么**：从全仓库 40+ 处既有实现提炼的 **19 项通用动效原语**（文字 6：打字机/计数/逐字/描边填色/RGB/铬字；路径揭示 4：描画/飞沿/遮罩/引线；环境持续 4：粒子场/摆动落定/视差/聚焦；冲击转场 5：冲击波/速度线/震屏/翻牌/扫屏）+ 几何工具（rnd/clamp01/polar）。

**怎么用**：业务侧直接从 shared 桶取——`import { Typewriter, DrawPath, Shockwave } from "../../../shared"`；
全部为 **t/from 纯函数**（封面/展示页 Still 可冻结）；冲击类在 `t < at` 时返回 null，静帧需传有效帧。
与风格库是**互补关系**：风格契约组件管"某套风格的样子"，工具箱管"跨风格通用的动效"，风格组件与业务场景都可调用。

**细节文档**：`src/shared/motion/README.md`（19 项清单 + props + 约定）。
**演示验收**：`npm run render -- MotionDemo out/motion/demo.mp4`（40s 轮播）+ `npm run still -- MotionGallery out/motion/gallery.png`。
**依赖**：`@remotion/paths@4.0.534`（精确版本，仅路径类使用）；`@remotion/transitions` 仅用于 MotionDemo 组装。
