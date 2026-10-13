# 新视频计划书：《二维码会被用完吗？》

## 摘要

在现有"视频工厂"上新增第二支视频 **qrcode**（Composition id：`Qrcode`），主题为科普《二维码会被用完吗？》。

- **BGM**：复用 `public/web-request/bgm.mp3`（bpm 112.8 / offset 12 / transFrames 12 沿用），实测时长 192.9s，可支撑 2~3 分钟视频且无需循环。
- **时长**：约 **2 分 30 秒**（280 拍 ≈ 149s 正片 + 45 帧收尾 ≈ 150.8s），落在 2~3 分钟区间，内容按科普逻辑充分展开，不注水。
- **卡点**：全部动画触发只用拍号（`useAt`/`useT` + `pop/prog/hit`），场景切换落在强拍；转场复用 `SceneShell` 现有 9 种转场保证丝滑。
- **不动 shared**：本视频所需的新视觉（二维码格点、数字暴涨）全部在场景组件内部用现有原语 + remotion 插值实现，符合目录边界规则。

---

## 一、现状分析（已探索确认）

- 工厂结构：`src/shared/`（core/runtime/components 三层）+ `src/videos/<id>/`（spec.ts + scenes/），见 [video-factory.md](file:///d:/newDownload/project/vibe-video/docs/video-factory.md)。
- 现有视频 [web-request/spec.ts](file:///d:/newDownload/project/vibe-video/src/videos/web-request/spec.ts)：bpm 112.8、offset 12、transFrames 12、tailFrames 45、1920×1080、10 场景、约 61.5s。
- 节拍数学：BEAT = (60/112.8)×30 ≈ **15.96 帧/拍**；280 拍 = bf(280)=12+4468=4480 帧 ≈ 149.3s。
- 可用节拍原语：`useAt()→at(start,k)`（拍→帧）、`useT()`（场景内时间）、`pop/prog/hit`（[anim.ts](file:///d:/newDownload/project/vibe-video/src/shared/core/anim.ts)）、`SceneTitle`/`NodeBox`/`Caption`/`Center`/`ProgressHud`/`BeatGrid`/`SceneShell`。
- BGM 实测：`ffprobe` 返回 **192.888s**，足够覆盖全片，无需循环音频。

---

## 二、场景设计（9 场景 + 拍号表）

每场景 `start/end` 为拍号，切换点 = `bf(start)` 落在强拍。`totalBeats = 280`，`tailFrames = 45`。

| # | 场景文件 | 拍号范围 | 拍数 | 转场 | 背景色 | 内容 |
|---|---|---|---|---|---|---|
| 0 | `Intro.tsx` | 0–12 | 12 | none | `C.bg` | 逐拍砸字"二维码会被用完吗？"→ 主标题 + 渐变条 |
| 1 | `Binary.tsx` | 12–36 | 24 | zoom | `#0d1430` | 黑白格子=二进制：白0黑1，一串格子逐行展开存出文字 |
| 2 | `Structure.tsx` | 36–64 | 28 | slideLeft | `#120f2e` | 拆解二维码：三个定位角 + 校正图案 + 数据区高亮 |
| 3 | `Version.tsx` | 64–92 | 28 | circle | `#0a1a2a` | 版本 1→40：格数从 21×21 涨到 177×177，容量随之变大 |
| 4 | `Capacity.tsx` | 92–124 | 32 | blinds | `#0b1f1a` | 一个二维码能装多少：≈7089 个数字 / ≈4296 字母 / ≈2953 字节 |
| 5 | `Count.tsx` | 124–164 | 40 | diag | `#1f1a0b` | 组合数爆炸：2^208 ≈ 10^62 量级的天文数字，逐位滚动 |
| 6 | `Consume.tsx` | 164–196 | 32 | slideUp | `#1f0b1a` | 全球每年消耗 ~10^11 个量级（卡片+计数），对比二维码总数 |
| 7 | `Math.tsx` | 196–240 | 44 | spin | `#1f140b` | 数学对比：按消耗速度要 10^51 年，远超宇宙年龄 138 亿年 → 结论"用不完" |
| 8 | `Outro.tsx` | 240–280 | 40 | glitch | `C.bg` | 总结卡片（原理→数量→结论）+ 收尾标语 + 淡出 |

> 数值口径（科普向，实现时按此写死）：版本 1 = 21×21 = 441 格；版本 40 = 177×177 = 31329 格，L 级纠错可存 7089 数字 / 4296 字母数字 / 2953 字节；组合数取"版本 1、L 级有效模块约 208 个 → 2^208 ≈ 10^62"；宇宙年龄 1.38×10^10 年。视频中不逐字读码，只展示量级对比。

**卡点设计原则**（执行时严格遵守）：
- 每个场景只用 `const at = useAt(); const k = (n) => at(start, n);` 取拍帧，**禁止硬编码绝对帧号**。
- 入场/退场动画、元素砸入、数字滚动全部由 `pop(t, k(n))` / `prog(t, k(a), k(b)-k(a))` / `hit(t, k(n))` 驱动。
- 场景切换帧 = 强拍（由 `SceneShell` 转场 TRANS=12 帧收口在拍上，机制沿用现有实现，保证丝滑）。

---

## 三、改动清单（全部落在 `src/videos/qrcode/` 与 `public/qrcode/`）

| # | 文件 | 动作 | 说明 |
|---|---|---|---|
| 1 | `public/qrcode/bgm.mp3` | 新增 | 从 `public/web-request/bgm.mp3` 复制（内容一致，资源目录与视频 id 对齐，符合手册约定） |
| 2 | `src/videos/qrcode/spec.ts` | 新增 | `id: "Qrcode"`；bpm 112.8 / offset 12 / transFrames 12 / tailFrames 45；bgm `"qrcode/bgm.mp3"`；bg `C.bg`；width/height 1920×1080；上面 9 场景表 |
| 3 | `src/videos/qrcode/scenes/Intro.tsx` | 新增 | 开场（仿 [web-request Intro](file:///d:/newDownload/project/vibe-video/src/videos/web-request/scenes/Intro.tsx) 的逐拍砸字 + 标题 + 渐变条结构） |
| 4 | `src/videos/qrcode/scenes/Binary.tsx` | 新增 | 核心可视化：CSS Grid 渲染黑白格子矩阵（场景内自建小组件，不进 shared），随拍逐行点亮拼出文字 |
| 5 | `src/videos/qrcode/scenes/Structure.tsx` | 新增 | 画一个 25×25 二维码草图：三个定位角（方框高亮）+ 数据区着色，用 `SceneTitle`/`Caption` |
| 6 | `src/videos/qrcode/scenes/Version.tsx` | 新增 | 用 `interpolate` + 拍号驱动格数 21→177 增长，旁示容量条变长 |
| 7 | `src/videos/qrcode/scenes/Capacity.tsx` | 新增 | 三行数字卡片（数字/字母/字节），逐拍落下，`MONO` 字体 |
| 8 | `src/videos/qrcode/scenes/Count.tsx` | 新增 | 大数字逐位滚动（每拍翻一位），显示 2^208 ≈ 10^62 的量级 |
| 9 | `src/videos/qrcode/scenes/Consume.tsx` | 新增 | 全球消耗计数卡片 + 对比条（每年 vs 总数，总数条几乎不动） |
| 10 | `src/videos/qrcode/scenes/Math.tsx` | 新增 | 除法演示：总数 ÷ 年消耗 = 10^51 年，与宇宙年龄对比尺，亮出结论 |
| 11 | `src/videos/qrcode/scenes/Outro.tsx` | 新增 | 总结卡片（仿 [web-request Outro](file:///d:/newDownload/project/vibe-video/src/videos/web-request/scenes/Outro.tsx) 的 STEPS 卡片结构）+ 收尾标语 + 淡出 |
| 12 | `src/videos/index.ts` | 修改 | `import { qrcode } from "./qrcode/spec";` 并加入 `VIDEOS` 数组 |

**明确不改**：`src/shared/**`、`remotion.config.ts`、`package.json`、既有 `web-request/` 场景。不引入新依赖。

---

## 四、Assumptions & Decisions

| # | 决策 | 理由 |
|---|---|---|
| 1 | 复用现有 BGM，节拍参数沿用 112.8/12 | 用户指定；实测 192.9s 足够 2~3 分钟，无需循环 |
| 2 | 目标总拍 280 ≈ 2 分 30 秒 | 落在 2~3 分钟区间，内容按 9 场景充分展开，不注水 |
| 3 | 二维码视觉（格子/数字暴涨）写在场景组件内部 | 属于本视频业务视觉，按目录边界不污染 shared；若后续复用再提炼 |
| 4 | 数值取科普向量级（10^62 / 10^11 / 10^51 年） | 视频传递的是"天文数字 vs 人类消耗"的对比，不承担精确规范义务 |
| 5 | 场景 bg 沿用 web-request 的深色变体 + 每场景不同 | 延续既有视觉语言，转场切换有底色区分更丝滑 |

---

## 五、验证步骤

| # | 验证项 | 通过标准 |
|---|---|---|
| 1 | 类型检查 | `npm run typecheck` 退出码 0 |
| 2 | Composition 注册 | `npm run studio` 侧边栏出现 `Qrcode`，时长 ≈ 4525 帧（150.8s） |
| 3 | 渲染成功 | `npm run render -- Qrcode out/qrcode.mp4` 成功产出 1920×1080 30fps 含音轨 |
| 4 | 卡点抽查 | 渲染后抽帧检查：场景切换帧（各 `bf(start)`）处动画收口、转场完成；数字滚动逐拍递增 |
| 5 | 边界回归 | `git status` 确认改动仅限 `src/videos/qrcode/**`、`src/videos/index.ts`、`public/qrcode/**` |
