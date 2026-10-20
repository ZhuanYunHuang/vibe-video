# 计划：《嘻哈魂》杨和苏 verse 歌词 MV（灰色主题）

## 1. 概述

用户上传了新的音频 `嘻哈魂 杨和苏 (1).mp3`（**37.69s / 44.1kHz / 立体声 / MP3**，可直接使用，无需转码）与一段 38 句歌词，要求做一支**歌词 MV**，**主题色为灰色**（参考图取样 = `#313138`，一枚略带蓝调的炭灰）。

做法与已交付的《我的》(`gali`) 完全同源：复用第 16 套风格包 `styles/lyricmv`，在**新业务目录**里放一份舞台与主题；把上一支调好的特效能力（逐字、砸入、重点词块、波浪震动、卡点震动、定格放大转场）按本曲内容重新编排。

- **Composition id**：`Xiahun`　**目录**：`src/videos/xiahun/` ↔ **素材**：`public/xiahun/bgm.mp3`
- 灰色不换色相，改用**三个灰阶**区分段落（深灰 → 中灰 → 浅灰白场），既有结构感又不偏离"灰色主题"。

## 2. 现状分析（已完成的探索）

**框架层（不改）** — 与上一支完全一致：
- 装配器 [Video.tsx](file:///d:/newDownload/project/vibe-video/src/shared/Video.tsx)：吃 `VideoSpec`，按 `scenes[]` 出 `<Sequence>` + `SceneShell`，`trans:"none"` + `exitDim:0` = 零闪频硬切；`spec.bgm` 相对 `public/`。
- 场景 `start/end` 是**拍号**（`beat.bf(b)` 换算成帧，`FPS=30`）；[types.ts](file:///d:/newDownload/project/vibe-video/src/shared/core/types.ts)。
- 注册 [Root.tsx](file:///d:/newDownload/project/vibe-video/src/Root.tsx) / 预览 [items.ts](file:///d:/newDownload/project/vibe-video/preview/src/data/items.ts) 都吃 `VIDEOS`，**只需在 `src/videos/index.ts` 加一行**。

**可直接照搬的模板（上一支业务 `src/videos/gali/`）**
- [kit/stage.tsx](file:///d:/newDownload/project/vibe-video/src/videos/gali/kit/stage.tsx)：`MvStage`，props `{ start, lines, pal, theme: "yellow"|"black", shakes?: {sec,amp}[] }`；内部按**绝对秒**定位（`t = 绝对帧 - bf(start)`，`toT(sec)=round(sec*30)-bf(start)`），已实现：
  - `TypeSpan` 逐字显示（未到字 `visibility:hidden` 占位，不跳版）
  - `SlamText` 整句砸入 / `PopWord`（`RhymeText` 反色切角块，整体弹出）
  - `outline` 行特效：透明填充 + 主题色描边
  - 进鼓 `wave` 波浪震动（逐字沿正弦位移，1.2s 衰减）
  - 重拍 `shakes` 卡点震动（只作用内容层，不抖整幅）
  - `popZoom` + `veil`：某行重点词**原地放大**铺满画面，末尾化入纯色 → 硬切下一场零跳变
- [kit/lyrics.ts](file:///d:/newDownload/project/vibe-video/src/videos/gali/kit/lyrics.ts)：数据类型 `Span / Row{fx:"rainbow"|"outline"|"stack", slam, at, popZoom} / LyricLine{ i, s, rows, hookKey, wave, bowling, note }`。
- [kit/theme.ts](file:///d:/newDownload/project/vibe-video/src/videos/gali/kit/theme.ts)：两套 `Pal`。
- [scenes.tsx](file:///d:/newDownload/project/vibe-video/src/videos/gali/scenes.tsx) / [spec.ts](file:///d:/newDownload/project/vibe-video/src/videos/gali/spec.ts) / [Cover.tsx](file:///d:/newDownload/project/vibe-video/src/videos/gali/Cover.tsx)：三段场景 + spec 字段 + 纯静态封面（`background + Fonts + Grain`，**禁止** `useT/useBeat/BeatGrid`）。

**工具链（本机可用）**
- `npm run beat -- <音频>` → BPM / 首拍相位 / 可用拍数 / 16 拍大卡点表（★/△）/ 强拍总表（脚本 [analyze-beat.mjs](file:///d:/newDownload/project/vibe-video/scripts/analyze-beat.mjs)，内置 Remotion 自带 ffmpeg，**支持 mp3**）。
- 逐句时间戳：临时装 `@huggingface/transformers`（走 `hf-mirror.com` 镜像）本地 Whisper 逐字转写 → 拿到每句起唱秒数；再用 300–2600Hz 人声带能量在拍网格上校正（这两步上一支已跑通，用完即卸）。
- Remotion 自带 ffmpeg 无 rawvideo/bmp 编码器，**取色/取帧都走 PNG**。

**结论**：本任务是"同模板换主题 + 换歌词时间轴"的第二次落地，风险主要在**逐句时间轴**（仍是"节拍网格 + Whisper 实测 + 人声带校正"三步法）与**灰阶三段的对比度**（灰底灰字容易糊，必须拉开明度差）。

## 3. 灰色主题定义（decision complete）

取样参考图 = `#313138`。三段灰阶（同一色相，只动明度）：

| 场 | 用途 | 底色 | 字色 | 重点词块 |
|---|---|---|---|---|
| A 深灰 | L1–L13 出场/自报家门 | `#1F1F24` | `#EDEDF2` | 浅灰块 `#E6E6EC` + 深灰字 `#1F1F24` |
| B 中灰 | L14–L26 diss 段 | `#313138`（= 参考图色） | `#F2F2F6` | 白块 `#FAFAFC` + 深灰字 `#232329` |
| C 浅灰（白场） | L27–L38 夺冠/收官 | `#E9E9EE` | `#1F1F24` | 深灰块 `#232329` + 浅灰字 `#E9E9EE` |

- 单调灰、无彩色强调（不加任何红/黄），保证"主题色就是灰"。
- 底纹：中性 `Grain` + `Scanlines` + 淡对角斜纹；A/B 加 `Vignette`，C 不加（浅场压暗会脏）。
- 每场的 `SceneDef.bg` 用对应底色；`spec.bg` 取 `#1F1F24`；`Backdrop: () => null`（底纹各场景自己画）。

## 4. 节奏与时间轴（落地时执行）

1. `npm run beat -- public/xiahun/bgm.mp3` → 拿 `bpm / offset(帧) / 可用拍数 / 大卡点落点表 / 强拍总表`；若提示半速误判按双倍 BPM 填。
2. 临时装 `@huggingface/transformers`，走 `hf-mirror.com`，对 `public/xiahun/bgm.mp3`（先解码 16k 单声道）跑 Whisper `Xenova/whisper-base` 逐字转写 → 38 句的实测起唱秒数。
3. 用 300–2600Hz 人声带能量（STFT，hop=128）在 1/172s 精度上核对每个"句首"是否踩拍（参考 gali：能量峰值正好落在 `0.775 + n×(60/bpm)`），把句子**吸附到最近的拍**（偏差 < 0.15s 才吸）。
4. 定锚点：**L1 起唱点**、**最后一句 `老子才是RapStar`**、以及大卡点表里的 ★（切场/大跳变）。其余句按上一步实测值写死。
5. 场景边界（`scenes[].start/end`，拍号）取 16 的倍数落在实测切换点上；spec 用 `offset=0`，则**帧 = 秒 × 30、拍号 = 秒 × bpm/60**（与 gali 一致，便于全部用秒写数据）。
6. 把大卡点落点表抄进 `spec.ts` 注释。

## 5. 歌词数据与逐句处理（38 句）

复用 `Row = { spans, slam?, at?, fx?, popZoom? }`；`Span = { t, pop? }`。**长句拆行**（要求 2 的延续），重点词用 `pop: true`。

| i | 原文 | 显示拆行 | 处理 |
|---|---|---|---|
|1|Bow down to the KeyNG(这就是杨和苏)|「Bow down to the」+ **KeyNG**（pop）| 开场砸字（slam）；（括号里"这就是杨和苏"作右上小字注解，不逐字唱） |
|2|代表WalkingDead|单行| 逐字；WalkingDead 用拉丁字体 |
|3-4|带我兄弟 / 冲进这游戏| 各单行 | 逐字 |
|5-6|拿走我们 / 早应该拿走的| 各单行 | 逐字 |
|7-8|把钱和名誉 / 装进兜里| 各单行 | 逐字；「兜里」轻震 |
|9|You know the name KeyNG|「You know the name」+**KeyNG**(pop)| 重点 |
|10|求你们别再放口气| 单行 | 逐字 |
|11|用战斗力 穿透你|「用战斗力」/「穿透你」| 拆两行；「穿透你」slam |
|12|Now喘口气| 单行 | **outline**（透明字+灰描边，表现"喘口气"的轻） |
|13|Listen to me| 单行 | 逐字 |
|14|他们一看到我就紧张| 单行 | 逐字 |
|15-16|就像女孩子 / 看到了新郎官| 各单行 | 逐字（中灰场起） |
|17-18|他们有苦 / 说不出的样子|「他们有苦」/「说不出的样子」| 拆行 |
|19|多无助| 单行 | **outline**（无助的虚） |
|20-21|但在嘴上面 / 又经常酸| 各单行 | 逐字；「酸」pop |
|22-23|别来跟我碰 / 我怕你痛| 各单行 | 「碰」「痛」pop，两句 slam 卡重拍 |
|24-25|带我兄弟向上冲锋 / 往死里弄| 各单行 | 逐字 + 卡点轻震 |
|26|Vroom Vroom| Vroom ×2 | **逐字 + 重拍震动**（引擎感：抖动幅度加大、字距拉开） |
|27|登上冠军的宝座|「登上冠军」/「的宝座」| **进 C 场**；「冠军」pop |
|28-31|这个位置不好坐 / 但你们实在是 / 和我差得太远了 / 我先走了| 各单行 | 逐字 |
|32|来不及说再见了| 单行 | 逐字 |
|33|What| 单行 | slam 单字 |
|34-37|没有东风 / 没有luck / 只有执着 / 只有love| 各单行 | 逐字；`luck` `love` 用拉丁字体 + pop |
|38|老子才是RapStar|「老子才是」/ **RapStar**(pop)| **收官 slam + `popZoom` 原地放大铺满 + veil 化入灰底**（同 gali 的转场放大手法，收尾定格） |

- **进鼓/波浪震动**：按第 4 步定位到的强拍，给 1–2 句重点（L11 或 L22、L27）安排 `wave: true`。
- **卡点震动**：A/B 两场给重拍 `shakes`（列表按实测拍点），C 场不加（浅场抖动易脏）。
- 若某句实测时长过短（< 0.45s），拆行不超过 2 行，避免逐字来不及。

## 6. 文件与改动清单

**新增业务目录 `src/videos/xiahun/`（符合 skill 铁律：只动 `src/videos/<id>/`、`public/<id>/`、`src/videos/index.ts`）**
1. `kit/theme.ts` — 三套灰阶 `Pal`（A/B/C）+ 导出 `FONT/MONO`。
2. `kit/lyrics.ts` — `BPM/OFFSET/TOTAL_BEATS/TRANS_FRAMES/TAIL_FRAMES/LABEL`、三段场景拍号常量、`SHAKES` 列表、`LYRICS`（38 句）、类型 `Span/Row/LyricLine`。
3. `kit/stage.tsx` — 由 gali 的 `MvStage` **移植并按需裁剪**：保留 `TypeSpan / PopWord / RowView(slam|pop|outline) / 波浪 / 卡点震动 / popZoom+veil / 三套底色底纹`；**删掉本片用不到的** `rainbow` 行特效、`StackRow`、`BowlingLine`（比例原则：不留死代码）。
4. `scenes.tsx` — 三场（`DeepGrey / MidGrey / LightGrey`，`React.FC<SceneProps>`，写好 `displayName`），产出 `XIAHUN_SCENES: SceneDef[]`。
5. `spec.ts` — `VideoSpec`：`id:"Xiahun"`、`style: kit`、`Backdrop: () => null`、`Hud: () => null`、`exitDim: 0`、`trans:"none"`、`width/height 1920×1080`、`Cover`。
6. `Cover.tsx` — 纯静态封面（灰底 + 白字，**不得**使用节拍 context）。

**素材**
7. `public/xiahun/bgm.mp3` — 直接把上传的 mp3 拷贝一份到该目录（无需转码）。

**改动（1 处）**
8. `src/videos/index.ts` — `import { xiahun } from "./xiahun/spec";` 并加入 `VIDEOS`。

**不改**：`src/shared/**`、`src/Root.tsx`、`src/styles/**`、`preview/**`、`src/videos/gali/**`。

## 7. 封面

沿用用户刚定下的封面语言（纯色底 + 纯白大标题）：
- 底色：灰 `#313138`（= 参考图色）；粒子/斜纹极淡。
- 主标题（白）：**`老子才是 RapStar`**，两行排布：`老子才是`（大） / `RapStar`（次大）。
- 边角小字（浅灰）：左 `嘻哈魂 / 杨和苏`、右 `KEYNG · LYRIC MV`、底部 `38 LINES · 37.7S`、`1920 × 1080 / 30FPS`。
- 导出：`npm run still -- XiahunCover out/xiahun/cover.png`。

## 8. 假设与决策

- **id / 标题**：`id:"Xiahun"`（嘻哈魂）；目录 `src/videos/xiahun/` ↔ `public/xiahun/`（同 id）。
- **复用方式**：**复制** gali 的舞台到新业务目录再裁剪，**不跨业务引用**（保持每支视频自包含，符合仓库既有做法）。
- **主题**：单调灰、无彩色；用「深灰→中灰→浅灰白场」三段灰阶做结构，不靠换色相。
- **首句括号**：`(这就是杨和苏)` 作为注解小字，不参与逐字唱（原歌词里它更像旁注）。
- **转场**：全程 `trans:"none"` + `exitDim:0`，零闪频；换场靠底色硬切。
- **时间轴**：以"节拍网格 + Whisper 实测 + 人声带校正"为准，落点数据全部用**秒**表达（帧 = 秒 × 30），拍号仅用于场景边界与震动触发；预览里再与用户微调。
- **无 HUD / 进度条**；**不要**给整幅画面加每拍抖动。

## 9. 验证步骤

1. 拷贝 mp3 → `public/xiahun/bgm.mp3`，`ffprobe` 确认 mp3/44.1kHz/≈37.7s。
2. `npm run beat -- public/xiahun/bgm.mp3`，落点表抄进 `spec.ts` 注释，定 `bpm/offset/totalBeats`。
3. 临时装 `@huggingface/transformers` 跑 Whisper 取 38 句实测秒数 → 写进 `kit/lyrics.ts` → **卸载依赖并 `git checkout -- package-lock.json`**。
4. `npm run typecheck`（退出码 0）。
5. `npm run still -- Xiahun out/xiahun/v-<关键帧>.png` 抽帧自查：三段底色对比度是否够、灰底灰字是否清楚、重点词块是否跳得出来、收官放大是否铺满。
6. `npm run preview`（若已在跑则不重启）→ 把 `http://127.0.0.1:5180/?v=Xiahun` 发给用户；分镜核对加 `&debug=1`。
7. 导出封面 `npm run still -- XiahunCover out/xiahun/cover.png`。
8. 用户确认后渲染：`npm run render -- Xiahun out/xiahun/xiahun.mp4`（产物统一放 `out/xiahun/`）。

## 10. 风险与应对

- **逐句时间精度**：本机听不到唱腔，靠 Whisper 实测 + 人声带校正 + 拍网格吸附；仍可能个别句偏 → 预览页与用户逐句微调（改 `lyrics.ts` 的 `s` 即可）。
- **灰阶对比度**：灰底 + 灰字容易糊 → 严格按第 3 节的明度差（底/字差值 ≥ 0.6），抽帧核对优先看这一点。
- **38 句密度高**：37.7s 里 38 句 = 平均 ~1s/句，逐字动画要压缩到 `cpf` 上限内；过短句减少拆行。
- **Whisper 镜像限流**：`hf-mirror.com` 首次请求可能 429 → 带 User-Agent 重试；仍失败则退化为纯节拍网格 + 人声带分段推演。
