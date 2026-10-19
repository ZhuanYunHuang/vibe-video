# 计划：《我的》歌词 MV（GALI 片段）

## 1. 概述

把用户上传的 ~40.7s 歌曲片段（`我的 gali.m4a`）做成一支 **歌词 MV 风** 的卡点视频，落到本项目（Remotion 视频工厂）中，成为新增业务 `src/videos/gali/`。

三段式结构（严格按用户要求）：

| 段落 | 歌词范围 | 背景 | 核心动效 |
|---|---|---|---|
| A 开场 Hook | L1–L8（That's my chains … 全都是我的） | **黄色** | 逐句砸入 + 重拍卡点震动 |
| B 主歌 | L9–L25（白色的瓶子 … 毛衍七） | **黑色**（在 L9 硬切） | 逐字显示、重点词整体砸入、进鼓波浪震动、三押高亮 |
| C 尾 Hook | L26–L29（That's my ×4） | **黄色**（回到 A 的节奏） | 同 A：重拍卡点震动 |

硬性约束（来自用户）：① 转场不闪频；② 长句拆行显示；③ 卡点特效多；④ 段落切换/重点句按用户指定处理。

## 2. 现状分析（已完成的探索）

**框架层（`src/shared/`，不可改）**
- 装配器 [Video.tsx](file:///d:/newDownload/project/vibe-video/src/shared/Video.tsx)：吃一份 `VideoSpec`，按 `scenes[]` 生成 `<Sequence>`，套 `SceneShell`，挂 `Backdrop`/`Hud`，播 `spec.bgm`。场景 `start/end` 单位是**拍号**，`beat.bf(b)` 换算成帧（`FPS=30`）。
- 类型 [types.ts](file:///d:/newDownload/project/vibe-video/src/shared/core/types.ts)：`SceneDef = { start, end, Comp: React.FC<SceneProps>, trans, bg }`；`SceneProps = { start: number }`；`VideoSpec` 含 `bpm/offset/totalBeats/transFrames/tailFrames/bgm/bg/scenes/style?/Backdrop?/Hud?/exitDim?/Cover?`。
- 节拍 [beat-context.tsx](file:///d:/newDownload/project/vibe-video/src/shared/runtime/beat-context.tsx)：`useT()`（场景内帧，0=场景起始拍）、`useAt()`、`useBeat()`；`beat.beatPulse(frame)` 每拍脉冲。
- 转场 [SceneShell.tsx](file:///d:/newDownload/project/vibe-video/src/shared/components/SceneShell.tsx)：`trans:"none"` 时 `p=1`，**无任何转场闪白**，只在结尾按 `exitDim` 压暗（设 `exitDim:0` 即完全硬切、零闪频）→ 满足要求①。
- 注册 [Root.tsx](file:///d:/newDownload/project/vibe-video/src/Root.tsx)：`VIDEOS` 里的 spec 自动注册 Composition；`spec.Cover` 自动注册 `<id>Cover` Still。**不用改 Root.tsx**。
- 预览 [items.ts](file:///d:/newDownload/project/vibe-video/preview/src/data/items.ts)：预览页视频列表直接取 `VIDEOS`，注册即出现。

**风格层：`src/styles/lyricmv/`（歌词 MV 风，第 16 套风格包，可直接复用）**
- [index.ts](file:///d:/newDownload/project/vibe-video/src/styles/lyricmv/index.ts) 导出：`kit`（StyleKit）、`FONT/MONO/LATIN/textWidth/fitSize`、`PAL`/`Pal`/`ThemeId`、`Fonts`、`Grain/Scanlines/Vignette/LineSlab/CutFlash/GhostLine`、文字特效 `SlamText/CrawlText/ChaosText/ShakeText/SlashText/SplitText/StampText/FocusText/RhymeText`、`Stage/Sub/Chapter/Slam/Card/Stamp/Mark/Kicks/Particles/Backdrop/Hud`。
- 文字特效 [textfx.tsx](file:///d:/newDownload/project/vibe-video/src/styles/lyricmv/textfx.tsx) 全是 t/from 纯函数：
  - `CrawlText` = 逐字打字（每字从右侧滑入）→ 用作「一个字一个字显示」。
  - `RhymeText` = 反色切角色块整体弹出 → 用作重点词/三押高亮（`保龄球`/`望远镜`/`帽檐底`/`毛衍七`/`我的`）。
  - `SlamText` = 1.3 倍压到 1 + 硬投影 + 抖动 → 整词砸入。
  - `ShakeText` = 逐字错频抖动 → 卡点震动可复用。
- 画面层 [frame.tsx](file:///d:/newDownload/project/vibe-video/src/styles/lyricmv/frame.tsx)：`Grain/Scanlines/Vignette/LineSlab/CutFlash/GhostLine` 均 t 的纯函数。
- 字体 [Fonts.tsx](file:///d:/newDownload/project/vibe-video/src/styles/lyricmv/Fonts.tsx)：`Fonts` 用 `delayRender` 注入优设标题黑，**每个场景/封面都要挂**。

**既有同类业务范例（同风格 = 直接参照）**
- [wangwei/spec.ts](file:///d:/newDownload/project/vibe-video/src/videos/wangwei/spec.ts)：`style: kit`、`Backdrop: () => null`、`Hud: () => null`、`exitDim: 0`、`trans: "none"`、`transFrames: 1`。
- [wangwei/scenes.tsx](file:///d:/newDownload/project/vibe-video/src/videos/wangwei/scenes.tsx)：`SceneDef[]`，场景切点对齐句首，每场 2 句，`bg` 统一深色。
- [wangwei/kit/lyrics.ts](file:///d:/newDownload/project/vibe-video/src/videos/wangwei/kit/lyrics.ts)：`LINES` 数据结构（`i/s/e/text/parts/fx/layout/align/theme/note`）。
- [graduation-mv](file:///d:/newDownload/project/vibe-video/src/videos/graduation-mv/spec.ts)：另一支纯文字 MV，同样是「场景切点对齐真实句点」。

**结论**：本任务属于「歌词 MV」类，应复用 `styles/lyricmv` 的组件能力，但**不直接复用 kit 的 `LyricStage`**（它是 wangwei 专用：暗/红双主题 + dropSec 固定逻辑，与本案「黄/黑三段 + 逐字 + 波浪震动」不符）→ 在业务目录内写自定义舞台。

## 3. 前置阻塞：音频转码（必须先做）

**问题**：上传文件 `我的 gali.m4a` 是 **ALAC** 编码（ffprobe 确认 `codec_name=alac`，44.1kHz/立体声，时长 **40.68s**）。Remotion 自带的 ffmpeg（`node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe`）**没有 ALAC 解码器**（实测 `no decoder found for: alac`），因此：
- `npm run beat` 无法解码分析；`<Audio>` 渲染时也无法解码 → 必须转码。

**方案**：安装一个自带完整解码器的 ffmpeg 二进制（npm 上分发、不依赖 GitHub），把 m4a 转成 Remotion 支持的 mp3：
1. `npm i -D @ffmpeg-installer/ffmpeg`（其 Windows 二进制 `@ffmpeg-installer/win32-x64` 在 npm registry 上，已确认可获取）。
2. 用该二进制转码：
   `ffmpeg -i "…/我的 gali.m4a" -c:a libmp3lame -b:a 320k -ar 44100 -ac 2 public/gali/bgm.mp3`
3. 转码完成后确认时长/可解码：`ffprobe public/gali/bgm.mp3`；再跑 `npm run beat -- public/gali/bgm.mp3`。
4. 转码后 **卸载** `@ffmpeg-installer/ffmpeg`（仅为一次性转码，避免把 64MB 依赖留在 `package.json`）。

> 若第 1 步安装/下载失败，退路：`npm i -D ffmpeg-static`（等价二进制）。

## 4. 节奏与歌词时间轴推演（核心，落地时执行）

1. **跑节拍分析**：`npm run beat -- public/gali/bgm.mp3`，拿到 `bpm`、`offset`(帧)、可用拍数、16 拍大卡点表（★/△）、强拍总表、16 拍边界抬升。
   - 若提示「半速误判」→ 按双倍 BPM 填 spec（offset 不变）。
2. **定位结构锚点**：写一个**临时**分析脚本（放在项目外的临时目录，不进仓库）解码同一段音频，输出「低频（底鼓）能量 + 起音强度」的逐 1/30s 曲线，用来定位：
   - 「进鼓点」（低频能量陡增处）= 用户指定的 **`把我的名字`** 那一句；
   - 段落边界：Hook（A）→ 主歌（B）的进唱点 = `白色的瓶子`；主歌 → 尾 Hook（C）= 第一个 `That's my`。
3. **把 29 句歌词落到拍号网格**：以第 1、2 步的实测网格为准，按句长（音节密度）分配每句起始拍与占拍数；长句拆行后在行内按拍再分（见 §5）。
   - 时间轴一律**用绝对拍号表达**（`bf()` 换算），保证每个卡点/重点词都精确落在拍上；必要时可用小数拍（如 `62.5`）微调到唱腔起音处。
4. **写进 `spec.ts` 注释**：把大卡点落点表抄进注释，让每个 `scenes[].start/end` 都能对上表里的拍号。

> 说明：歌词逐句精确时间在本机无法「听」出来，采用 **节拍网格 + 结构锚点 + 唱腔起音特征** 推演，并在预览页（见 §9）与用户一起微调；这是本项目歌词 MV 的既有工作方式（wangwei 亦以秒级时间轴 + 拍网格校正落地）。

## 5. 分镜与逐句视觉设计

### 场景划分（3 场，`trans: "none"` 硬切、零闪频）

```ts
// 大卡点落点表（来自 npm run beat，落地时补全）
scenes: [
  { start: 0,   end: <L9 起始拍>, Comp: HookScene,  trans: "none", bg: YELLOW },  // A 黄
  { start: <L9 起始拍>, end: <L26 起始拍>, Comp: VerseScene, trans: "none", bg: BLACK },   // B 黑
  { start: <L26 起始拍>, end: TOTAL_BEATS, Comp: OutroScene, trans: "none", bg: YELLOW },  // C 黄
]
```
- 背景切换由 `SceneDef.bg` 承担（黄 ↔ 黑），`Backdrop` 只做**中性底纹**（颗粒/扫描线/暗角 + 极淡径向），不参与换色。
- 场景内**逐句硬切**（不闪白）：上一句整块消失、下一句出现。用「句级」内容切换替代转场动画 → 满足要求①。

### A 开场 Hook（黄底）— L1–L8
- 黄色底 `#FFE600`，字色近黑 `#0B0B0B`，强调红 `#C8102E`（可选）。
- 每句整词 `SlamText` 砸入（1.3→1、硬投影），**逐句硬切**。
- **重拍卡点震动**：以 §4 的强拍表为触发点，对**歌词内容块**做短促位移+轻微缩放（`hit()` 包络），并在每 4 小节重拍（★）叠加一次极轻微**镜头震动**；不做整幅每拍抖动（避免观感晕）。
- 布局：`That's my ___` 统一「小字 That's my + 大字关键词」的两段式；`全都是我的` 用 `RhymeText` 把「我的」做成反色面包块强调。

### B 主歌（黑底）— L9–L25
- 黑色底 `#050505`，字色骨白 `#EFE9DA`，强调红 `#C8102E`。
- **L9 起硬切黑底，取消震动**；此后**逐字显示**：用 `TypeLine`（基于 kit `CrawlText` 思路，逐字按帧顺序点亮，从右侧轻微滑入）表现「一个字一个字显示」。
- **`保龄球` 整体砸入**：L10「像打保龄球」中 `保龄球` 用 `RhymeText`（整体弹出 + 反色块）与前面的 `像打` 区分 → 满足「一起显示突出重点」。
- **`把我的名字`（L11）= 进鼓重点句**：在 §4 定位的进鼓帧处，该句以整词 `SlamText` 砸入，并对该句文字施加 **波浪震动** `WaveText`（逐字沿行进正弦做上下位移 + 容器轻微摇摆，约 1.5s 衰减）→ 对应「黑色背景加波浪震动」。
- 长句拆行（要求②）：把 L11、L18、L23 等长句拆成 2–3 行显示（逐行依次点亮），见 §6 数据表。
- **三押高亮**：`望远镜`(L23 句尾)、`帽檐底`(L24 句尾)、`毛衍七`(L25 句尾) 作为一组韵脚，各以 `RhymeText` 色块弹出，并在**右侧固定面板**依次累积展示这三块，形成「三押」视觉组 → 满足「一组三押，突出重点」。

### C 尾 Hook（黄底）— L26–L29
- 回到黄底，**与 A 同参数**（同样的字体/字号/震动节奏）：`That's my` ×4 逐拍砸入、逐句硬切，重拍卡点震动。
- 收尾：最后一句后短暂停顿 → 画面轻微压暗/淡出（`tailFrames` 内完成），不做闪白。

## 6. 歌词数据表（`kit/lyrics.ts`，逐句定义「行内拆行 + 关键帧标记」）

每句一条记录：`{ i, b, beats, rows: [{ text, charFx?: "type"|"slam", spans?: [{ text, rhyme?: true }] }], flags?: { wave?, shake? } }`。

拆行/重点安排（时间轴 `b/beats` 待 §4 定，此处只定「内容与效果」）：

| i | 原文 | 显示拆行 | 重点/效果 |
|---|---|---|---|
|1-3|That's my chains / fame / gang | That's my **chains**（两段式） | slam |
|4|全都是我的 | 全都是**我的** | RhymeText 强调「我的」 |
|5-7|love / boy / money | 同上两段式 | slam |
|8|全都是我的 | 同 L4 | RhymeText |
|9|白色的瓶子在角落里面堆一堆把他们全部击落 | 「白色的瓶子在角落里面堆一堆」/「把他们全部击落」 | 逐字 |
|10|像打保龄球 | 「像打」+**保龄球** | 保龄球 RhymeText 整体砸入 |
|11|把我的名字挂 Hall of fame 的墙壁 | 「把我的名字」/「挂 Hall of fame 的墙壁」 | **进鼓 Slam + WaveText 波浪震动** |
|12|但传奇的结局我还没赢够 | 单行（超长则拆 2 行） | 逐字 |
|13|拿我的笔拿我的笔 | 单行 | 逐字 + 轻震 |
|14|填上不一样的油彩 | 单行 | 逐字 |
|15|That I've been told | 单行 | 逐字（拉丁字体） |
|16-17|How about the cream ×2 | 各单行 | 逐字 |
|18|擦了擦嘴 没有弄脏 我白的领口 | 「擦了擦嘴 没有弄脏」/「我白的领口」 | 逐字 |
|19|全都是我的 Got Margiela tabi | 「全都是**我的**」/「Got Margiela tabi」 | RhymeText |
|20|Got J. Watanabe lets bag it up | 单行 | 逐字 |
|21|全都是我的 Got ERD jacket | 「全都是**我的**」/「Got ERD jacket」 | RhymeText |
|22|我像在堆乐高 We stack it up | 「我像在堆乐高」/「We stack it up」 | 逐字 |
|23|想定GALI的位置但看不清坐标都拿起了望远镜 | 「想定 GALI 的位置」/「但看不清坐标」/「都拿起了 **望远镜**」 | 逐字 + 望远镜 RhymeText |
|24|59 Fifity 我帽檐底 | 「59 Fifity」/「我**帽檐底**」 | 帽檐底 RhymeText |
|25|全明星 BENZO跟毛衍七 | 「全明星 BENZO」/「跟**毛衍七**」 | 毛衍七 RhymeText（三押组第三个） |
|26-29|That's my ×4 | That's my | slam + 重拍震动（= A 段落节奏） |

**三押面板**：L23/L24/L25 的 `望远镜 / 帽檐底 / 毛衍七` 右侧累积展示（一次出现一块），保持到 B 段结束。

## 7. 文件与改动清单

**新增（业务目录 `src/videos/gali/`，符合 skill 铁律）**
1. `src/videos/gali/kit/index.ts` — 一行 `export * from "../../../styles/lyricmv";` + 本地额外导出（`GaliStage`、`WaveText`、`TypeLine`、`YELLOW/BLACK` 调色板、`LYRICS` 等）。
2. `src/videos/gali/kit/theme.ts` — `YELLOW`/`BLACK` 两套 `Pal`（字号/字色/强调色/底纹强度）+ 复用 `FONT/MONO`。
3. `src/videos/gali/kit/lyrics.ts` — `BPM/offset/TOTAL_BEATS`、`SECTIONS`（黄/黑/黄拍区间）、`LYRICS`（§6 的逐句数据 + 拍号时间轴）。
4. `src/videos/gali/kit/stage.tsx` — `GaliStage`（按绝对拍号驱动本场景的句子渲染、句级硬切、逐字/砸入/RhymeText、波浪震动、重拍震动）+ `WaveText` + `TypeLine`；`Fonts` 在此挂载。
5. `src/videos/gali/scenes.tsx` — `HookScene / VerseScene / OutroScene`（`React.FC<SceneProps>`，`displayName` 设好供预览调试面板显示），产出 `GALI_SCENES: SceneDef[]`。
6. `src/videos/gali/spec.ts` — `VideoSpec`（见 §8）。
7. `src/videos/gali/Cover.tsx` — 封面（§9）。

**资源**
8. `public/gali/bgm.mp3` — §3 转码产物。

**改动（1 处）**
9. `src/videos/index.ts` — `import { gali } from "./gali/spec";` 并加入 `VIDEOS`。

**不改**：`src/shared/**`、`src/Root.tsx`、`src/styles/**`、`preview/**`。

## 8. `spec.ts` 关键字段

```ts
export const gali: VideoSpec = {
  id: "Gali",
  bpm: /* npm run beat 结果 */,
  offset: /* 首拍帧 */,
  totalBeats: /* 可用拍数内、使总时长≈40.7s（取整拍） */,
  transFrames: 1,          // 与 wangwei 一致，转场帧极小
  tailFrames: /* 20~30，收尾留白 */,
  bgm: "gali/bgm.mp3",
  bg: BLACK_BG,
  width: 1920, height: 1080,
  style: kit,              // styles/lyricmv
  Backdrop: GaliBackdrop,  // 中性底纹（不换色）
  Hud: () => null,         // 无进度条
  exitDim: 0,              // 硬切、无压暗
  Cover,
  scenes: GALI_SCENES,     // 三场：黄 / 黑 / 黄
};
```

## 9. 封面（`Cover.tsx`）

- 静态图（**禁止**使用 `useT/useAt/useBeat/BeatGrid/ProgressHud`），但可复用 kit 的 `Fonts/Grain/Scanlines/Vignette`（t 的纯函数，传 `t=0`）。
- 与视频同风格同主题：**黄底 + 近黑超粗标题**，主标题 `我的`，副标题 `That's my … 全都是我的`；右侧/底部放小字 `GALI · LYRIC MV`。
- 标志性视觉复用：把歌词里最辨识度的 `全都是我的`（`我的` 反色面包块）搬上封面。
- 导出：`npm run still -- GaliCover out/gali/cover.png`。

## 10. 假设与决策

- **id / 标题**：`id: "Gali"`，标题「我的」；目录 `src/videos/gali/` ↔ `public/gali/`（同 id）。
- **风格**：复用 `src/styles/lyricmv` 风格包（`spec.style = kit`），但在业务目录内写**自定义舞台**，不直接用 wangwei 专用的 `LyricStage`。
- **配色**：A/C 黄底近黑字；B 黑底骨白字 + 红强调（与 kit 的 dark 主题一致）。
- **卡点观感**：把「震动」作用在**内容块**上（逐句/逐词），重拍（★）叠加极轻微镜头震动；不做整幅每拍抖动（遵循 skill 铁律，同时满足「重拍卡点震动」）。
- **转场**：全程 `trans:"none"` + `exitDim:0` → 零闪频硬切；黄↔黑由场景 `bg` 承担。
- **逐字显示**：`逐字` 指**每句内容逐字点亮**（不是整句一次性出现）。
- **不画插画**：本片为纯文字 + 强动效的歌词 MV（用户强调的是卡点与文字特效），不新增 `art.tsx`，避免喧宾夺主。
- **时间轴**：以节拍网格为准（绝对拍号），由 §4 推演，预览中与用户微调。

## 11. 验证步骤

1. `npm i -D @ffmpeg-installer/ffmpeg` → 转码 → `ffprobe public/gali/bgm.mp3` 确认可解码、时长正确 → 卸载该依赖。
2. `npm run beat -- public/gali/bgm.mp3`，把落点表抄入 `spec.ts` 注释并确定 `bpm/offset/totalBeats`。
3. `npm run typecheck`（退出码 0）。
4. `npm run preview`（后台常驻）→ 把 `http://127.0.0.1:5180/?v=Gali` 发给用户；分镜核对用 `&debug=1`。
5. 抽帧自查：`npm run still -- Gali --scale=0.25 --frame=<各段关键帧>`（黄段/黑段/进鼓/三押/尾段）。
6. 导出封面：`npm run still -- GaliCover out/gali/cover.png`。
7. 用户确认后才渲染：`npm run render -- Gali out/gali/gali.mp4`。

## 12. 风险与应对

- **ALAC 转码**：依赖 npm 上可下载的完整 ffmpeg 二进制（已确认可获取）；失败则退路 `ffmpeg-static`。
- **歌词逐句时间精度**：无法在本机「听」出精确时间 → 采用节拍网格 + 结构锚点（进鼓点/换段点）推演，并用预览页与用户逐段微调；如需更高精度，可选路线：本地 Whisper 逐字转写（需额外模型/依赖，成本较高，默认不做）。
- **段落边界**：黄→黑（L9）与进鼓（L11）两个锚点必须落准，否则整片观感错位 → 优先用「低频能量陡增」实测定位，再在预览里校对。
