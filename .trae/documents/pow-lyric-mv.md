# 计划：《POW》歌词 MV（荧光绿 × 炭黑 · 枪墙弹孔版）

> 本版按用户反馈重写，新增四条硬要求（§5.1）：
> ① 墙面 + 逐发弹孔；② 11 个枪声卡点 + 1 个炮声（打穿墙 + 字碎 + 转场）；③「法老夸我说 / 吊的来」两段分离排布；④「心狠又手辣我做事的方式」鼓点进场做强过渡强卡点。

## 1. 概述

用户上传 `pow 杨和苏.mp3`（**71.74s / 44.1kHz / 立体声 / MP3**）与《POW》封面图，要求做**歌词 MV**，**主题色取自封面**：**荧光绿 `#4AFF00` + 炭黑 `#141414` + 骨白 `#F2F2F2`**（街头涂鸦 / 粗笔刷质感）。

做法与已交付的《嘻哈魂》杨和苏 verse（`xiahun`）同源：复用第 16 套风格包 `src/styles/lyricmv` 的原语，在**新业务目录** `src/videos/pow/` 放自己的舞台 / 主题 / 歌词时间轴，舞台从 `xiahun/kit/stage.tsx` 复制后按本片裁剪。

本片**专属视觉核心**：**狙击手母题**——十字准星 + **一面墙**，bgm 里每一发枪声在墙上打出一个**弹孔**，最后的**炮声**把整面墙打穿、把当前这行字打碎，然后转场。

- **Composition id**：`Pow`；**目录** `src/videos/pow/` ↔ **素材** `public/pow/bgm.mp3`
- 成片 ≈ **72.3s**（正片 71.55s + 尾留白 0.8s）

## 2. 现状分析（已完成的探索）

**框架层（不改）**
- 装配器 [Video.tsx](file:///d:/newDownload/project/vibe-video/src/shared/Video.tsx)：吃 `VideoSpec`，按 `scenes[]` 出 `<Sequence>` + `SceneShell`；`spec.bgm` 相对 `public/`。
- 场景 `start/end` 是**拍号**（`beat.bf()` 换帧，`FPS = 30`）；[types.ts](file:///d:/newDownload/project/vibe-video/src/shared/core/types.ts)、[timing.ts](file:///d:/newDownload/project/vibe-video/src/shared/core/timing.ts)。
- [SceneShell.tsx](file:///d:/newDownload/project/vibe-video/src/shared/components/SceneShell.tsx)：**入场转场占前 `beat.TRANS` 帧**，`type` 支持 `none / zoom / slideLeft / slideUp / circle / blinds / diag / spin / glitch / fade`，其中 **`glitch` 已实现**（位移 + `skewX` + `clipPath` 收拢，随 `TRANS` 帧驱动）——本片的"打穿后转场"和"鼓点进场"都用它，因此 **`transFrames` 必须从 1 提到 12**（0.4s）才能看见效果。
- 注册 [Root.tsx](file:///d:/newDownload/project/vibe-video/src/Root.tsx) 与预览 [items.ts](file:///d:/newDownload/project/vibe-video/preview/src/data/items.ts) 都吃 `VIDEOS`，**只需在 `src/videos/index.ts` 加一行**。

**可直接照搬的模板（`src/videos/xiahun/`）**
- [kit/stage.tsx](file:///d:/newDownload/project/vibe-video/src/videos/xiahun/kit/stage.tsx)：`XhStage`，props `{ start, lines, pal, tone, shakes? }`，按**绝对秒**定位（`toT(sec) = round(sec*30) - bf(start)`）。已实现 `TypeSpan` 逐字 / `PopWord`（`RhymeText` 反色切角块）/ `SlamPlain` 整句砸入 / `outline` / `wave` 波浪 / `shakes` 卡点震动 / `impact` 冲击波 + 强震 / `popZoom + veil` 收官放大化入底色 / `ToneBackdrop`。
- [kit/lyrics.ts](file:///d:/newDownload/project/vibe-video/src/videos/xiahun/kit/lyrics.ts)：`BPM/OFFSET/TOTAL_BEATS/TRANS_FRAMES/TAIL_FRAMES/LABEL` + 场景秒锚点 + `SHAKES` + `LYRICS`；类型 `Span = {t, pop?}`、`Row = {spans, slam?, at?, fx?, popZoom?, pair?, dur?}`、`LyricLine = {i, s, rows, wave?, size?, impact?, note}`。
- [kit/theme.ts](file:///d:/newDownload/project/vibe-video/src/videos/xiahun/kit/theme.ts)、[scenes.tsx](file:///d:/newDownload/project/vibe-video/src/videos/xiahun/scenes.tsx)、[spec.ts](file:///d:/newDownload/project/vibe-video/src/videos/xiahun/spec.ts)、[Cover.tsx](file:///d:/newDownload/project/vibe-video/src/videos/xiahun/Cover.tsx)（纯静态，**禁止** `useT/useBeat/BeatGrid`）。
- 共享动效可直接用：`Shockwave` / `SpeedLines`（[motion/impact.tsx](file:///d:/newDownload/project/vibe-video/src/shared/motion/impact.tsx)）、`rnd` / `clamp01`（[motion/util.ts](file:///d:/newDownload/project/vibe-video/src/shared/motion/util.ts)）。

**工具链（本机可用）**
- `npm run beat -- <音频>`（脚本 [analyze-beat.mjs](file:///d:/newDownload/project/vibe-video/scripts/analyze-beat.mjs)，内置 Remotion ffmpeg，支持 mp3）。
- 逐句时间戳：临时装 `@huggingface/transformers`（`hf-mirror.com`）跑 Whisper 逐字转写 → 起唱秒；再用 300–2600Hz 人声带能量校核（上一支已跑通，用完即卸）。**Python 不可用**（Store 占位）。
- Remotion 自带 ffmpeg **无 rawvideo/bmp 编码器**，取帧/取色走 **PNG**（本次已实测）。

**本曲实测事实（本次探索已跑）**
- 音频 **71.74s**，可用拍数 ≈ **121**。
- `npm run beat` 报 **61.6 BPM**，但 Top5 候选得分几乎持平（0.229/0.227/0.226/0.225/0.224）⇒ **弱周期，该值不可信**。
- **底鼓包络自相关**复测（22050Hz / hop=128 ⇒ 172.27 帧/秒）：`0–71.7s` 与 `15–55s` 两窗一致在 **lag = 101 帧**出尖峰（r = 0.0306 / 0.0401，约为次峰 1.5–2 倍）⇒ **BPM ≈ 102.3（0.5865s/拍）**；相位扫描 ⇒ **首拍 ≈ 0.227s**（该相位下拍点与实测底鼓 0.21 / 3.74 / 4.34 / 4.93 / 6.66 / 7.81 / 8.48 / 9.03 / 10.23s 对得上）。
- **16 拍大卡点**（9.38s 一个）：`0.23 / 9.61 / 19.0 / 28.4 / 37.7 / 47.1 / 56.5 / 65.9s`，与脚本 ★（0.03s、46.8s）方向一致。
- **封面取样色**（96×96 解码像素统计）：最饱和绿 `#42FD00`、`g≥180` 均值 `#73F00D` ⇒ 主强调色 **`#4AFF00`**；底色主导 `#303030`(25.1%) / `#202020`(19.6%) ⇒ 炭黑 **`#141414`**；白字 `#F0F0F0` ⇒ **`#F2F2F2`**。

## 3. 视觉主题定义（decision complete）

### 3.1 四套 `Pal`（键名与 `styles/lyricmv` 的 `Pal` 完全一致）

| Pal | 用途 | bg | ink | accent | dim | block / blockInk | flash / burst | scan / grain / vig |
|---|---|---|---|---|---|---|---|---|
| `DARK` | A（枪墙场）/D/E | `#141414` | `#F2F2F2` | `#4AFF00` | `#6E6E6E` | `#4AFF00` / `#0A0A0A` | `#4AFF00` | 0.16 / 0.18 / 0.9 |
| `DEEP` | B（Reset 场） | `#0C0C0C` | `#F7F7F7` | `#4AFF00` | `#5E5E5E` | `#4AFF00` / `#0A0A0A` | `#7DFF33` | 0.13 / 0.16 / 1 |
| `ACID` | C（**荧光绿反色场**） | `#4AFF00` | `#0A0A0A` | `#0A0A0A` | `#2F6F00` | `#0A0A0A` / `#4AFF00` | `#0A0A0A` | 0.08 / 0.10 / 0.35 |
| `FLARE` | F（收官场） | `#0A0A0A` | `#FFFFFF` | `#4AFF00` | `#6E6E6E` | `#FFFFFF` / `#0A0A0A` | `#4AFF00` | 0.12 / 0.14 / 0.8 |

常量：`GREEN = "#4AFF00"`、`GREEN_DIM = "#2F6F00"`、`WALL = "#2A2A2A"`、`INK_DARK_BG = "#141414"`、`INK_LIGHT = "#F2F2F2"`、`ACID_BG = "#4AFF00"`。`FONT / MONO / LATIN / textWidth / fitSize` 一律从 `styles/lyricmv` 沿用（优设标题黑 + 等宽）。

### 3.2 专属视觉组件（全部写在 `kit/stage.tsx`，只依赖 `t` 与绝对秒）

1. `GrungeBackdrop({ pal })` — 炭黑磨砂底：45° 斜纹 + **3–5 道斜向绿流光**（整片不动）+ `Grain` + `Scanlines` + `Vignette`。用于 B/D/E/F 场。
2. **`WallBackdrop({ pal, shot })`** — **场 A 的底：一面墙**。混凝土/砖墙质感（砖缝线 + 噪点 + 顶部暗角 + 绿流光斜扫），**弹孔层**按 `SHOTS` 累积渲染。
3. **`BulletHole({ x, y, r, t, at, kind, pal })`** — 弹孔：深色圆坑 + 外圈亮边 + 4–6 条径向裂纹 + 灰尘；入场 6 帧 `scale 1.6→1` + 短促 `Shockwave` 环 + **绿色枪口闪光**（径向渐变，0.25s 内衰减）。`kind: "gun"`（小孔 r≈26px）｜`kind: "cannon"`（**大破口** r≈260px，不规则多边形边缘 + 背后绿白光 + 飞散碎片）。
4. **`Crosshair({ t, at, pal })`** — 十字准星（两条细线 + 四角刻度 + 圆心小圈 + 中心点），入场淡入 → 收缩锁定 → 轻微抖动；用于 L1、L2 与 L38（回场）。不做常驻 HUD。
5. **`GreenSweep({ t, at, pal })`** — 倾斜绿光带横扫（0.5s），用于场 B 入场、L22「肃清」、L34。
6. **`ShatterRow`** — **字被打碎**：`Row.shatterAt` 秒到点后，本行每个字做 抖动 → 位移 + 旋转 + 缩小 + 淡出（按字序错峰 14 帧，位移方向用 `rnd(i)` 伪随机）；同时从行内位置飞出 40 片短矩形碎片；叠加 `BreachOverlay`（全屏破口 + 径向裂纹 + `Shockwave` + `SpeedLines`）。
7. **`PowStamp({ t, at, pal })`** — 末帧 `POW!!` 定格：白 brush 粗字（轻微旋转 + 描边磨边）+ 绿斜杠压角 + `Shockwave`，与封面同款。
8. 逐步字特效沿用 `xiahun` 的 `TypeSpan / PopWord / SlamPlain / WordRow / LetterRow / SlideInRow / SinkRow / ExpandRow / SplitRow / PierceRow`，**新增 `DiagRow`**（见 §5.1 ③）。

## 4. 节拍与时间轴（落地时执行）

1. `npm run beat -- public/pow/bgm.mp3` → 记录输出；注释里写明**本片采用底鼓自相关实测 `BPM = 102.3` / 首拍 `0.227s`**（脚本 61.6 属弱周期误报）+ 16 拍大卡点表。
2. **枪声 / 炮声检测（本片新增的关键步骤）**：用 Remotion ffmpeg 解码 **22050 单声道 WAV**，对 **2–8kHz 带通**做谱通量峰值检测（局部极大 + 与前峰间隔 ≥ 0.15s + 阈值取前 3% 分位），得到枪击点秒表。
   - 目标点（用户点名，按歌词顺序）：`mode`｜`就`｜`走`｜`口`｜`油`｜`配`｜`咽`｜`下`｜`甜`｜`感`｜`谢` = **11 发枪**；`头` = **1 发炮**（该段低频爆裂最强）。
   - 交叉核对：检测到的峰值应与 Whisper 转写出的这些**字的起唱/收尾秒**就近匹配（容差 ±0.12s）；若检测到多于 11 发，按字位就近取；若少于，逐句核对（**优先保证用户点名的这 12 个点都有孔**，缺的用转写字位补）。最终 12 个秒数写进 `kit/lyrics.ts` 的 `SHOTS`。
3. **逐句时间戳**：临时装 `@huggingface/transformers`（`npm i --no-save`，`HF_ENDPOINT=https://hf-mirror.com`），16k 单声道解码 → Whisper（`Xenova/whisper-base`，失败退 `whisper-tiny`）逐字转写 → 每句起唱秒，按本片 42 行对齐行号（中英混排的分行边界以转写为准）。收尾：`npm uninstall` + `git checkout -- package-lock.json`。
4. **人声带能量校核**：300–2600Hz 带通能量（STFT，hop=128）核对句首是否落在 `0.227 + n×0.5865` 拍网格上，**偏差 < 0.15s 才吸附**。
5. 场景边界 = 各段首句实测起唱秒（**L15 / L27 / L32 / L35 / L39**，另 L1 场首为 0），换算 `拍 = 秒 × 102.3 / 60`。**`spec.offset = 0`**（同 `xiahun`）⇒ `帧 = 秒 × 30`、`拍号 = 秒 × 1.705`，所有时间数据用**秒**表达。
6. **参数（写入 `kit/lyrics.ts`）**：`BPM = 102.3`、`OFFSET = 0`（帧）、`TOTAL_BEATS = 122`（71.55s）、**`TRANS_FRAMES = 12`**（0.4s，让 `glitch` 转场可见）、`TAIL_FRAMES = 24`、`LABEL = "POW"`。
7. **卡点表**：A 场用 `SHOTS` 秒数（枪击 = 轻震 1.1 + 弹孔，炮击 = 强震 2.2 + 冲击波）驱动 `shakes`；B/D/E 场用每句实测起唱秒生成 `SHAKES`；`ACID` 场（C）不加 `shakes`，改用 `slam + impact`（绿底抖动易脏）。

## 5. 分场设计与四条硬要求

### 5.1 用户点名要求的四条

**① 墙面 + 逐发弹孔（L6–L7）**
`In my killer's mode 你们就别想走` / `张开口盯着猎物身上滴的油` 这一段：**底色换成一面墙**；`mode / 就 / 走 / 口 / 油` 五发枪声各在墙上**打出一个弹孔**（孔位用 `rnd(i)` 伪随机散布在安全边距内 x 5–95% / y 6–94%，画在底纹层即字的下方，不遮字），同时字上有绿色枪口闪光 + 短冲击环 + 轻震。

**② 11 发枪声卡点 + 1 发炮声（L10–L14）**
- 枪声点：`我们全队最权威的技术配上了前卫的 flow` 的 **`配`**、`咽下还残留着烟味的酒` 的 **`咽`/`下`**、`自己做蛋糕不如抢来的甜味可口` 的 **`甜`**、`感谢那些前赴后继来垫背的头` 的 **`感`/`谢`** —— 共 6 发，**与 ① 同款处理**（墙上继续加弹孔 + 枪口闪光 + 卡点轻震），孔位与前面 5 个不重叠。
- 炮声点：`感谢那些前赴后继来垫背的头` 的末字 **`头`** = **1 发炮**（强烈卡点）：`ShatterRow` 把**整行字打碎**（碎片飞散）+ **`BreachOverlay` 把整面墙打穿**（大破口 + 背后绿白光 + 径向裂纹 + `Shockwave` + `SpeedLines`）+ 强震；随后**转场**到下一场（场 B 入场用 `trans: "glitch"`，12 帧）。

**③「法老夸我说 / 吊的来」两段分离（L17）**
新增行特效 `DiagRow`：**两段分别锚定在画面左上与右下**，中间留大片空档（**不挨在一起**）：先出「法老夸我说」（左上，x≈6%/y≈30%），停一拍后再出「吊的来」（右下，x≈52%/y≈66%，轻微旋转）。**决策 D9**：把"不挨在一起"理解为**空间上拉开距离**（同时也不在同一时刻出现），如与用户预期不符，改 `kit/lyrics.ts` 该行的 `fx` / 锚点即可。

**④「心狠又手辣我做事的方式」鼓点进场（L27 = 场 C 首句）**
**强过渡 + 强卡点**：场 C 入场 `trans: "glitch"`（12 帧）→ 底色切到 **荧光绿反色场**（绿底黑字）→ 该句 `slam` + `impact`（冲击波 + 强震 + `GreenSweep` 横扫叠加）→ 场上加一层 2 帧绿爆闪。后续 L28–L31 在绿场里展开。

### 5.2 六场

| 场 | 组件 / displayName | 行区间 | 底（Pal） | 入场 trans | 视觉标识 |
|---|---|---|---|---|---|
| A | `SniperScene` / `Sniper` | L1–L14 | `DARK` + **墙面** | `none` | **十字准星**（L1/L2）+ 逐发弹孔 + 炮击穿墙字碎 |
| B | `ResetScene` / `Reset` | L15–L26 | `DEEP` + 绿磨砂 | **`glitch`** | 炮击穿后的过场；`GreenSweep` 入场；含 DiagRow（L17） |
| C | `AcidScene` / `Acid` | L27–L31 | `ACID`（绿底黑字） | **`glitch`** | **鼓点进场**：爆闪 + 横扫 + slam 强卡 |
| D | `FlurryScene` / `Flurry` | L32–L34 | `DARK` + 绿磨砂 | `none` | 三连砸入，每句 `impact` + 绿光横扫 |
| E | `HeroScene` / `Hero` | L35–L38 | `DARK` + 绿磨砂 | `none` | 准星回场（L38），「泼该」砸入 |
| F | `FinaleScene` / `Finale` | L39–L42 | `FLARE` | `none` | 收官 slam 四连 → 原地放大化入底色 → **POW!! 定格** |

- A→B 的"转场"由 A 结尾的炮击穿墙 + B 的 `glitch` 入场共同完成；其余相邻场 `trans:"none"`（零闪频）+ `exitDim: 0`。
- `scenes.tsx` 导出 `POW_SCENES: SceneDef[]`；场 A 传 `shots={SHOTS.filter(s => s.sec >= A_SEC && s.sec < B_SEC)}`，其余场传 `shots={[]}`。

## 6. 歌词数据与逐句处理（42 行）

类型扩展：`Span = { t: string; pop?: boolean; shot?: boolean }`（`shot` = 该字/词是枪声卡点，点亮时做绿色闪光 + 短冲击）；`Row = { spans; slam?; at?; fx?; popZoom?; dur?; shatterAt?: number }`（`shatterAt` = 炮声秒，触发整行打碎）；`LyricLine` 不变。**特效集合（本片只保留用到的，其余移植时删）**：`word`｜`letter`｜`slideIn`｜`sink`｜`expand`｜`pierce`｜`split`｜`diag`｜`outline`｜（默认逐字）｜`slam`｜`wave`｜`impact`｜`popZoom`。

| i | 原文 | 显示拆行 | 处理 |
|---|---|---|---|
|1|雪飘落在我的枪口|单行|逐字；**十字准星入场**；「枪口」pop|
|2|狙击手就位敌人一个都不能放走|「狙击手就位」/「敌人一个都不能放走」|整句 slam + **impact**（准星收缩锁定）|
|3|血腥味越闻越上头展开追击|「血腥味越闻越上头」/「展开追击」|第一行逐字；「展开追击」`slideIn`|
|4|韵脚是我手里牵的狼狗|单行|逐字；「狼狗」pop|
|5|I killed a goat 抓住他的羊头放我床头|「I killed a goat」/「抓住他的羊头放我床头」|第一行 `word`；第二行逐字；「羊头」pop|
|6|In my killer's mode 你们就别想走|「In my killer's mode」/「你们就别想走」|**①** 第一行 `word`，`mode` **`shot`**；第二行逐字，`就` / `走` **`shot`**；三发各打一个弹孔|
|7|张开口盯着猎物身上滴的油|单行|**①** 逐字；`口` / `油` **`shot`**；再打两个弹孔|
|8|巅峰特遣队一出现你们毫无疑问|「巅峰特遣队一出现」/「你们毫无疑问」|整句 slam|
|9|变成我们点缀|单行|逐字；「点缀」pop|
|10|我们全队最权威的技术配上了前卫的 flow|「我们全队最权威的技术」/「配上了前卫的 flow」|**②** 第二行首字 `配` **`shot`**（弹孔）；「flow」pop|
|11|咽下还残留着烟味的酒|单行|**②** 逐字；`咽` / `下` 各 **`shot`**（两个弹孔）|
|12|自己做蛋糕不如抢来的甜味可口|单行|**②** 逐字；`甜` **`shot`**（弹孔）|
|13|我们太强没法谦卑地走|单行|逐字；「谦卑」**outline**（透明字 + 绿描边）|
|14|感谢那些前赴后继来垫背的头|单行|**②** 逐字；`感` / `谢` **`shot`**（两个弹孔）；末字 `头` = **炮声** → `shatterAt`（整行**打碎** + **打穿墙** + 强震）→ 转场|
|15|做得太好是 my bad|单行|逐字；「my bad」pop|
|16|你们讨厌但是我 Like that like that|「你们讨厌但是我」/「Like that like that」|第二行 `letter` + 绿字|
|17|法老夸我说吊的来|「法老夸我说」/「吊的来」|**③** `fx: "diag"`：两段分离（左上 / 右下，中间留空档），先后出现|
|18|谢老板听完了要说我帅惨帅惨|单行|逐字 + `wave`；「帅惨帅惨」pop|
|19|I'm back to beginning|单行|`letter`（逐字母）|
|20|一开始就注定赢|单行|`expand`（从下往上长出来）+ slam；「注定赢」pop|
|21|不听不听他们说的所以孤零零|「不听不听他们说的」/「所以孤零零」|第二行 `sink`（向下聚拢退场 = 孤零零）|
|22|肃清附近所有反对声音|「肃清附近」/「所有反对声音」|第一行 `split`；「所有反对声音」`pierce`（绿字斜穿）+ `GreenSweep` + **impact**|
|23|我是你们哭着走不出的那片寂静岭|「我是你们哭着走不出的」/「那片寂静岭」|「寂静岭」**outline**|
|24|聆听我们进军浩浩荡荡你没搞好状况|「聆听我们进军浩浩荡荡」/「你没搞好状况」|逐字 + `wave`|
|25|兄弟你们最好早早让让位置|单行|逐字；「让让位置」pop|
|26|让我得到我所窥视的美食的 taste|「让我得到我所窥视的」/「美食的 taste」|「taste」`letter` + pop|
|27|心狠又手辣我做事的方式|单行|**④ C 场首句**：绿底黑字 + `slam` + **impact** + 爆闪/横扫|
|28|都别过来惹老子烧了你房子|单行|逐字；「烧了你房子」pop|
|29|这无害的外表是迷惑的装饰|单行|逐字；「迷惑的装饰」**outline**（黑描边）|
|30|别对我指手画脚你什么档次|单行|slam；「什么档次」pop|
|31|像李宁拿着火炬 back in08|「像李宁拿着火炬」/「back in08」|第二行 `letter` + pop|
|32|被我搅浑哪个敢来趟水|单行|**D 场首句**：slam + **impact**|
|33|想赢我们我告诉你 no way|单行|slam；「no way」pop|
|34|谁敢多说一句来人掌嘴|单行|slam + **impact**；`GreenSweep` 横扫|
|35|我像是张飞一夫当关万夫莫开|「我像是张飞」/「一夫当关万夫莫开」|**E 场首句**；第二行 slam + 「万夫莫开」pop|
|36|不想你们狼狈妈老鼠在过街|单行|逐字；「老鼠在过街」pop|
|37|我们坐在巅峰眼中只有天空|单行|逐字 + `wave`；「只有天空」pop|
|38|我来送你们泼该|单行|slam + **impact**；「泼该」pop；**准星回场**|
|39|刻板印象我来颠覆它|单行|**F 场首句**：slam；「颠覆」pop|
|40|靠的不是努力这是天赋哈|单行|slam；「天赋」pop|
|41|碰嘛断送你的前途哈|单行|slam；「断送」pop|
|42|你想看我淘汰老子偏不噶|「你想看我淘汰」/「老子偏不噶」|「偏不噶」pop + **`popZoom`** 原地放大铺满 → `veil` 化入底色 → 末帧 **`PowStamp`（白 brush POW!! + 绿斜杠 + 冲击波）定格**|

- 拆行一律 ≤ 2 行；转写结果出来后，若某句实测 < 0.5s 则不拆行（只扔 slam / 逐字）。
- `outline` 描边色随场取 `pal.accent`（DARK = 绿、ACID = 黑）。

## 7. 文件与改动清单

**新增业务目录 `src/videos/pow/`（只动 `src/videos/<id>/`、`public/<id>/`、`src/videos/index.ts`）**

1. `kit/theme.ts` — `DARK / DEEP / ACID / FLARE` 四套 `Pal` + 颜色常量；`FONT / MONO / LATIN / textWidth / fitSize` re-export `styles/lyricmv`。
2. `kit/lyrics.ts` — `BPM / OFFSET / TOTAL_BEATS / TRANS_FRAMES / TAIL_FRAMES / LABEL`；场锚点秒（`A_SEC/B_SEC/…`）与对应拍号；`SHAKES`；**`SHOTS: { sec, kind: "gun" | "cannon", x, y }[]`（12 条）**；`LYRICS`（42 行）；类型 `Span / Row / RowFx / LyricLine / Shot`。
3. `kit/stage.tsx` — 由 `xiahun/kit/stage.tsx` 移植裁剪：
   - 保留 `TypeSpan / PopWord / SlamPlain / WordRow / LetterRow / SlideInRow / SinkRow / ExpandRow / SplitRow / PierceRow / RowView / wave / shakes / impact / popZoom + veil`；
   - **删除**本片用不到的 `StairsRow + Crown / ApartRow / SlideOutRow`（不留死代码）；
   - **新增** `GrungeBackdrop / WallBackdrop / BulletHole / BreachOverlay / Crosshair / GreenSweep / ShatterRow / DiagRow / PowStamp`，导出 `PowStage`；props = `{ start, lines, pal, tone, shakes?, shots?, crosshairAts?, sweepAts?, stampAt? }`。
4. `scenes.tsx` — 6 场（`SniperScene / ResetScene / AcidScene / FlurryScene / HeroScene / FinaleScene`，写好 `displayName`），导出 `POW_SCENES: SceneDef[]`。
5. `spec.ts` — `VideoSpec`：`id:"Pow"`、`style: kit`、`bg: INK_DARK_BG`、`Backdrop: () => null`、`Hud: () => null`、`exitDim: 0`、`1920×1080`、`Cover`、`scenes: POW_SCENES`；注释抄入节拍分析、16 拍大卡点表、枪/炮声检测结果。
6. `kit/index.ts` — `export * from "../../../styles/lyricmv";` + 本业务 `theme / lyrics / stage` 导出（与 `xiahun/kit/index.ts` 同构）。
7. `Cover.tsx` — **静态封面**（对齐上传封面）：炭黑磨砂 + 斜向绿斜杠 + 白 brush 大字 `POW!!`（旋转 + 描边磨边）+ 顶部白条 `黄旭 | 杨和苏KeyNG | VaVa毛衍七` + 左下 `POW · LYRIC MV` / 右下 `42 LINES · 71.7S`；底部 `1920 × 1080 / 30FPS`。**禁用** `useT/useBeat/BeatGrid/ProgressHud`。

**素材**

8. `public/pow/bgm.mp3` — 把上传的 mp3 拷一份进去（无需转码）。

**改动（1 处）**

9. `src/videos/index.ts` — `import { pow } from "./pow/spec";` 并加入 `VIDEOS`。

**不改**：`src/shared/**`、`src/Root.tsx`、`src/styles/**`、`preview/**`、其他业务目录。

## 8. 假设与决策

- **D1 · id / 标题**：`id = "Pow"`；目录 `src/videos/pow/` ↔ `public/pow/bgm.mp3`；`LABEL = "POW"`，封面顶部按上传封面写三位艺人名。
- **D2 · 复用方式**：**复制** `xiahun/kit/stage.tsx` 到新业务目录再裁剪，**不跨业务引用**。
- **D3 · 歌词覆盖关系（重要）**：音频仅 **71.74s**、歌词 **42 行**，存在"音频只覆盖部分歌词"的可能。**决策**：以 Whisper 转写实测为准——唱到第 N 行就做前 N 行，**不擅自补行**；若确有缺失，在交付说明里如实标注"音频实际覆盖 L1–Lx"。
- **D4 · 主题**：取封面色（`#4AFF00` / `#141414` / `#F2F2F2`）；**ACID 反色场**只给 diss 段（L27–L31）≈8s，收官场 `FLARE` + 末帧 `POW!!`。
- **D5 · 时间基准**：`spec.offset = 0`，时间数据全用**秒**（帧 = 秒×30，拍号 = 秒×1.705），与 `xiahun` 一致。
- **D6 · 转场**：`transFrames = 12`；A→B（炮击穿后）与 B→C（鼓点进场）用 `glitch`；其余 `trans:"none"` + `exitDim: 0`。
- **D7 · 无 HUD / 进度条**；不给整幅画面加每拍抖动（跟拍只发生在内容层）。
- **D8 · 拍速**：取底鼓自相关实测 **102.3 BPM**（脚本 61.6 为弱周期误报），已用 16 拍大卡点与实测重拍点交叉验证。
- **D9 ·「不挨在一起」**：理解为**空间上拉开距离**（左上 / 右下，中间留空档 + 先后出现）；若用户本意是纯时间错开，只需改该行 `fx`。
- **D10 · 枪/炮声秒数**：以音频**瞬态检测**为准（11 枪 + 1 炮，用转写字位就近锚定），而不是纯靠拍网格推算。

## 9. 验证步骤

1. 拷贝 mp3 → `public/pow/bgm.mp3`；Remotion ffmpeg 确认时长 ≈ 71.7s。
2. `npm run beat -- public/pow/bgm.mp3` → 连同 §2 实测结论写进 `spec.ts` 注释。
3. **枪/炮声检测**：2–8kHz 谱通量峰值 → 12 个秒数 → 与歌词字位对齐 → 写进 `SHOTS`。
4. Whisper 逐字转写（临时装依赖）→ 42 行（或音频实际覆盖行）起唱秒 → 写进 `kit/lyrics.ts` → 卸载依赖 + `git checkout -- package-lock.json`。
5. `npm run typecheck`（退出码 0）+ `npm run typecheck:preview`。
6. `npm run still -- Pow --scale=0.25 --frame=<关键帧>` 抽帧自查：**弹孔是否逐发累加**、枪口闪光是否跟点、**炮击穿墙 + 字碎**是否成立、`ACID` 绿底黑字对比度、`DiagRow` 两段是否确实分离、末帧 `POW!!` 是否铺满且与封面同款。
7. `npm run preview`（后台常驻，若已在跑则不重启）→ 把 `http://127.0.0.1:5180/?v=Pow` 发给用户（分镜核对加 `&debug=1`）；**重点让用户逐句核对 11+1 个枪/炮卡点是否踩准**。
8. 导出封面 `npm run still -- PowCover out/pow/cover.png`。
9. **用户确认后**渲染：`npm run render -- Pow out/pow/pow.mp4`（产物统一放 `out/pow/`）。

## 10. 风险与应对

- **枪/炮声漏检或误检**：宽带瞬态在密集鼓点里可能被掩蔽 → 用歌词字位做锚点（用户点名的 12 个字）就近匹配 + 逐句人耳式复核（抽帧 + 预览页逐帧步进）；宁可 12 个点全有孔，也不出现"多点/少点"。
- **拍速不确定**（脚本 61.6 vs 自相关 102.3）：以 102.3 为准；视觉落点全用秒表达，BPM 只影响 `shakes` 与拍号换算。
- **逐句时间精度**：中文快嘴 + 中英混排，Whisper 可能漏句/错位 → 人声带能量分段兜底 + 拍网格吸附（±0.15s）+ 预览页逐句微调（只改 `kit/lyrics.ts` 的 `s`）。
- **歌词与音频覆盖不一致**：按 D3 执行并如实标注。
- **荧光绿大面积铺底刺眼**：`ACID` 场仅 5 行（≈8s），底叠黑斜纹 + 噪点降饱和，字用纯黑。
- **42 行密度**（≈1.7s/行）：逐字受 `CPF_MAX = 1.15` 约束，长行拆 ≤ 2 行；实测 < 0.5s 的句子不拆行。
- **墙面 + 弹孔的可读性**：弹孔画在底纹层且透明度收敛（孔坑 ≤ 0.75），确保不与白字/绿字抢视；抽帧优先核对这一点。
