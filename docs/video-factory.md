# 视频工厂手册

> 目标：用 Remotion 持续产出"流程科普"风格视频。本手册是目录边界与加视频流程的**唯一长期约定入口**。
> 历史重构过程记录见 `.trae/documents/refactor-shared-business-split.md`（非长期约定）。

---

## 一、目录边界规则

| 目录 | 放什么 | 加新视频时要改吗 |
|---|---|---|
| `src/shared/` | 与具体视频无关的框架、动画、可视化原语、类型 | 一般不改；只有新增通用能力时才加 |
| `src/videos/<id>/` | 这支视频的文案、场景、节奏、配色配置 | 只改这里 |
| `public/<id>/` | 这支视频的静态资源（BGM 等） | 只加这里 |

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
└── components/           ← 可视化组件（Center/NodeBox/Packet/Wire/Caption/SceneTitle/SceneShell/BeatGrid/ProgressHud）
```

### `src/videos/<id>/` 结构

```
src/videos/<id>/
├── spec.ts               ← 全部配置：BPM/拍数/场景表/BGM
└── scenes/               ← 本视频的场景组件（每场景一个文件）
```

---

## 二、加新视频 5 步

1. **复制骨架**：把 `src/videos/_template/` 复制成 `src/videos/<id>/`（`_template` 本身不注册为 Composition）。
2. **放 BGM**：音频放到 `public/<id>/bgm.mp3`。
3. **算节拍**：`npm run beat -- public/<id>/bgm.mp3`，把输出的 `bpm` / `offset` / `totalBeats` 填进 `spec.ts`。
4. **写场景**：改造 `scenes/` 下的场景，调整 `spec.ts` 里 scenes 表的拍号（切换点应落在强拍上）。
5. **注册**：在 `src/videos/index.ts` 里 `import` 并加入 `VIDEOS` 数组。

---

## 三、资源路径规范

- BGM 放 `public/<视频id>/bgm.mp3`，`spec.bgm` 写 `<视频id>/bgm.mp3`（相对 `public/`）。
- 视频目录 `src/videos/<id>/` 与资源目录 `public/<id>/` 使用同一 id，保持对齐。
- 渲染产物命名：`npm run render -- <id> out/<id>.mp4`。

---

## 四、常用命令

| 命令 | 作用 |
|---|---|
| `npm run studio` | 打开 Remotion Studio 预览 |
| `npm run render -- <id> out/<id>.mp4` | 渲染指定视频 |
| `npm run still` | 渲染静态帧 |
| `npm run beat -- <音频路径>` | 分析 BGM 得出 BPM/相位 |
| `npm run typecheck` | 类型检查 |
