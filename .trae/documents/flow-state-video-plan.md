# 计划书 V2：科普视频《心流状态》（全新「深潜水流」风格）

> V1 被驳回原因：沿用了默认霓虹网格风格。V2 按用户要求设计**项目中从未出现过的全新风格**，并严格按 video-generation skill 的自定义风格路径（`kit/` + `Backdrop`/`Hud` 覆盖）执行。

## 一、概述

- **选题**：心流状态（Flow）——打游戏、考试、开车三个共鸣场景切入 → 转折提问 → 概念 → 机制（通道模型）→ 特征 → 方法 → 收尾。
- **视频 id**：`flow-state`；Composition id：`FlowState`；目录 `src/videos/flow-state/` ↔ `public/flow-state/`。
- **BGM**：沿用用户指定"默认 BGM"（音频与 web-request 同源），复制一份到 `public/flow-state/bgm.mp3`。已知参数 `bpm 112.8 / offset 12`，音频 192.9s。
- **时长**：`totalBeats = 336`（≈178.7s）+ `tailFrames 30` ≈ 3 分钟（binary-search 同 BGM 已验证 336 拍安全）。
- **交付物**：kit 风格包 + spec + 10 场景 + 封面 + `out/flow-state.mp4` + `out/flow-state/cover.png`。

## 二、全新风格设计：「深潜水流」（项目内无先例）

### 与四种既有风格的差异

| 已有风格 | 底色/主色 | 本风格 |
|---|---|---|
| 默认霓虹网格 | 深蓝 #0b1020 + 青/粉/黄霓虹 + 网格线 | **深墨绿** + 薄荷柔光 + **涟漪环**（无网格） |
| binary-search 纸面 | 暖白 + 陶土橙 + 点阵 | 深色系，完全相反 |
| route-planning 地图 | 浅青绿 + 蓝/青 | 深色 + 绿相主色、无地图元素 |
| shengben 舞台 | 深夜蓝黑 + cyan/magenta 舞台光 | 绿黑底 + 单一薄荷水光，无舞台/人物剧情 |

### 专属调色板（`kit/theme.ts` 的 `P`）

```ts
export const P = {
  bg: "#041F1B",      // 深墨绿黑（整片底色）
  bg2: "#0A352C",     // 水光渐变辅助底
  abyss: "#02150F",   // 最深处（渐变远端）
  mint: "#5FE8C0",    // 主强调：水光薄荷
  coral: "#FF9E6E",   // 副强调：暖珊瑚（焦虑/警示/对比）
  gold: "#FFCE7A",    // 点缀：沙金（高亮数字/关键词）
  ink: "#EAFBF4",     // 主文字：雾白
  sub: "#8FB8AC",     // 弱文字：水雾灰绿
  line: "#1B5A4C",    // 描边/分隔线
  glass: "#0F4A3D99", // 玻璃卡底（半透明水色）
};
```

### 视觉母题：同心涟漪（Ripple）

全片统一语言——**"专注 = 涟漪扩散"**：三场景中各有一枚涟漪环，随投入加深逐层扩散变亮；概念幕 Flow 大字浮在涟漪中心；通道模型幕把"心流通道"画成一条流动的水带。涟漪既有主题隐喻，又天然承担卡点动画（每层环 `pop` 砸出落在拍上）。

### `kit/` 风格包（参照 binary-search 模式）

| 文件 | 内容 |
|---|---|
| `kit/theme.ts` | 调色板 `P` + 全片共用常量（章节表等） |
| `kit/ui.tsx` | 见下 |

`kit/ui.tsx` 组件清单（**替代 shared 的 C 调色板组件**，避免藏青胶囊字幕/藏青徽章文字串味）：

- `DiveBackdrop`（自定义 Backdrop）：深墨绿径向渐变（上深下微亮的水光）+ 极淡同心涟漪环纹理（CSS border 圆环，静态自绘）+ 底部两层缓慢波动的波浪剪影（`P.bg2`/`P.line`，低透明度）。
- `FlowHud`（自定义 Hud，吃 `HudProps`）：底部 6px 进度条（`P.line` 底轨 + `mint→gold` 渐变填充）+ 进度前沿一枚随 `beatPulse` 呼吸的涟漪圆点（薄荷描边圆环，替代默认黄色小球）。
- `Chapter`（章节标签，替代 `SceneTitle`）：左上角 `P.mint` 底圆角徽章（编号，文字用 `P.bg`）+ `P.ink` 章节标题 + 薄荷下划线进度。
- `Sub`（底部字幕，替代 `Caption`）：`P.glass` 半透明胶囊 + `P.mint` 细描边 + `P.ink` 文字。
- `Ripple`（涟漪环）：`{ x, y, layers, color?, from }`，多层同心圆逐层 `pop` 扩散，微光 `boxShadow`。
- `GlassCard`（水光玻璃卡）：半透明 `P.glass` 底 + `P.line` 描边 + 大圆角，用于特征卡/方法卡/人物卡。
- `Wave`（底部波浪剪影）：供 Backdrop 与个别场景（开车幕的"路面/车流"意象）复用的 SVG 波浪层。

### spec 覆盖项

- `Backdrop: DiveBackdrop`、`Hud: FlowHud`；底色 `bg: P.bg`，各幕 `scenes[].bg` 在 `P.bg / P.bg2 / P.abyss` 间轮换制造章节节奏。
- `exitDim`：深色风格，保留默认 0.5（退场压暗在水底风格里反而增强"下沉"感），不设。

## 三、叙事结构（与 V1 一致，视觉语言全部换成水流母题）

1. **钩子**（Intro）：你有没有过这种时刻？——三枚迷你涟漪依次亮起。
2. **三场景**：打游戏 / 考试 / 开车，每幕中央一枚涟漪随"越来越投入"逐层扩散，幕尾都是"时间消失/事后恍惚"的共性细节。
3. **转折提问**：三图标汇聚——共同点是什么？
4. **概念**：米哈里 1975 年提出 Flow，涟漪中心浮出大字。
5. **机制**：挑战-技能"河床"模型——焦虑区（珊瑚）/ 无聊区（灰绿）/ 心流通道（薄荷水带沿对角一次画满）。
6. **特征**：四大体验 2×2 玻璃卡（时间感消失、忘我、全神贯注、内在奖赏）。
7. **方法**：三张方法卡（明确目标 / 即时反馈 / 难度匹配）。
8. **收尾**：涟漪收束 + 金句。

## 四、场景表与卡点规划（336 拍全表）

拍 1 拍 ≈ 0.532s。所有 `start/end` 为 16 的倍数；**每个 16 拍边界都有大卡点**（切场转场或幕内内容跳变），无空档。实施时跑 `npm run beat` 取得 ★/△ 落点表抄进 spec 注释：★ 处按表切场，△ 边界按表改为幕内跳变（下表边界均已预安排跳变，二者取其一即可）。

| 拍号 | 时间(s) | 场景文件 | 转场 | 内容与幕内卡点 |
|---|---|---|---|---|
| 0–16 | 0–8.5 | Intro.tsx | none | 拍0-3 逐拍砸字"你有没有/过/这种/时刻？"；拍4 主标题《心流状态》弹出+三迷你涟漪起；拍6 问号 hit；拍9/11/13 手柄/试卷/方向盘图标依次 pop |
| 16–48 | 8.5–25.5 | Game.tsx | zoom | 拍17 涟漪第1层+手柄卡；拍18-21 键位/操作标签逐拍砸入；拍22 "操作行云流水"；**拍32 跳变**：时钟快进+大数字"3小时"沙金砸入（涟漪加层变亮）；拍30 "一抬头天黑了" |
| 48–80 | 25.5–42.6 | Exam.tsx | slideLeft | 拍49 铃+试卷卡；拍50-53 笔尖/公式元素逐拍入；拍54 "周围的声音消失了"；**拍64 跳变**："回过神来，最后一题刚好写完"（涟漪满层）；拍68 收卷铃 |
| 80–112 | 42.6–59.6 | Drive.tsx | circle | 拍81 方向盘卡+Wave 路面波浪；拍82-85 车流/导航元素逐拍入；拍86 "人车合一"；**拍96 跳变**："到家了，却不记得怎么开回来的" |
| 112–128 | 59.6–68.1 | Common.tsx | spin | 拍112-114 三图标从四周飞入居中叠成涟漪中心；拍116 "三件毫不相关的事"；拍120 大字 hit "共同点是什么？" |
| 128–176 | 68.1–93.6 | Concept.tsx | slideLeft | 拍130 人物卡"心理学家 米哈里·契克森米哈赖"；拍132-134 "1975 年提出 Flow"；**拍144 跳变**：涟漪中心浮出大字 "Flow 心流"（hit）；**拍160 跳变**：定义玻璃卡"全力投入一件事的心理状态"；拍162-168 关键词逐个点亮：专注/忘我/掌控感 |
| 176–240 | 93.6–127.7 | Channel.tsx | circle | 拍178 坐标轴 prog 画出（横=挑战 纵=技能）；**拍192 跳变**：左上"焦虑区"珊瑚砸入+例"新手打排位"；**拍208 跳变**：右下"无聊区"灰绿砸入+例"高手打人机"；**拍224 跳变**：对角"心流通道"薄荷水带一次画满+拍228 "挑战与技能刚刚好" |
| 240–288 | 127.7–153.2 | Traits.tsx | blinds | 拍244 特征①"时间感消失"；拍252 特征②"忘我"；**拍256 跳变**：特征③"全神贯注"；拍264 特征④"内在奖赏"；**拍272 跳变**：四卡收束成 2×2 玻璃卡阵列；拍280 全卡涟漪高亮"这些，就是心流" |
| 288–320 | 153.2–170.2 | HowTo.tsx | diag | 拍290 方法卡①"设定明确目标"；拍296 方法卡②"寻找即时反馈"；**拍304 跳变**：方法卡③"难度调到刚好够得着"；拍312 三卡收束+行动号召 |
| 320–336 | 170.2–178.7 | Outro.tsx | glitch | 拍322 金句"真正的快乐，来自全情投入"；拍328 标题复现《心流状态》+大涟漪收束；拍332 三图标+关注提示 |

**幕内小卡点**：所有元素出场用 `k(n)` 卡拍，优先选 `npm run beat` 强拍总表中的拍；脉冲 `hit(t, k(n))`、弹出 `pop(t, k(n))`。不给整幅画面加每拍抖动，只让涟漪/卡片等内容元素跟拍。

**转场选择**：各幕布局差异大，用强转场（zoom/slideLeft/circle/spin/blinds/diag/glitch）；若实施中相邻幕复用了同一队形坐标，改 `fade` 保持连续。

## 五、实施步骤

### 步骤 1：复制骨架
`src/videos/_template/` → `src/videos/flow-state/`（保留 Cover.tsx / spec.ts / scenes/ 结构）。

### 步骤 2：放置 BGM
复制 `public/web-request/bgm.mp3` → `public/flow-state/bgm.mp3`。

### 步骤 3：分析节拍
`npm run beat -- public/flow-state/bgm.mp3`：确认 `bpm 112.8 / offset 12`（若有半速误判提示按双倍 BPM 填）、可用拍数 ≥ 336；把 **大卡点落点表（★/△）与强拍总表**抄进 `spec.ts` 顶部注释，按"★ 切场、△ 幕内跳变"微调第四节表格。

### 步骤 4：编写 `kit/` 风格包
- `kit/theme.ts`：`P` 调色板（见第二节）+ 章节常量。
- `kit/ui.tsx`：`DiveBackdrop` / `FlowHud` / `Chapter` / `Sub` / `Ripple` / `GlassCard` / `Wave`。
  - 全部只从 `../../../shared` import 动画与时间工具（`pop/hit/prog/useBeat/useT/CL/FONT/MONO/FPS/HudProps`），配色一律用 `P`，不碰 shared 的 `C`。

### 步骤 5：编写 `spec.ts`
```ts
export const flowState: VideoSpec = {
  id: "FlowState",
  bpm: 112.8, offset: 12, totalBeats: 336,
  transFrames: 12, tailFrames: 30,
  bgm: "flow-state/bgm.mp3",
  bg: P.bg, width: 1920, height: 1080,
  Backdrop: DiveBackdrop,   // 全新风格：深潜水流背景
  Hud: FlowHud,             // 全新风格：涟漪进度 HUD
  Cover,
  scenes: [ /* 按第四节表格填 10 行，bg 在 P.bg/P.bg2/P.abyss 间轮换 */ ],
};
```

### 步骤 6：编写 10 个场景
`scenes/Intro.tsx`、`Game.tsx`、`Exam.tsx`、`Drive.tsx`、`Common.tsx`、`Concept.tsx`、`Channel.tsx`、`Traits.tsx`、`HowTo.tsx`、`Outro.tsx`。
- 统一 `React.FC<SceneProps>`，从 `../../../shared` 只 import 动画/时间工具与类型，风格元素一律用 kit 组件（Chapter/Sub/Ripple/GlassCard/Wave）。
- 每幕动画触发点全部 `k(n)` 卡拍；三共鸣幕共用"中央涟漪 + 元素卡"队形（坐标一致），幕间转场可用 `fade` 也可按表强转场（实施时目测定夺）。

### 步骤 7：注册
`src/videos/index.ts`：import `flowState` 并加入 `VIDEOS` 数组末尾。

### 步骤 8：封面 `Cover.tsx`
- 主标题"心流状态"（"心流"薄荷高亮）；副标题钩子"打游戏、考试、开车的共同秘密"。
- 标志性视觉：大同心涟漪环 + 手柄/试卷/方向盘三图标 + 底部波浪剪影，全部用 `P` 调色板与 kit 元素。
- **静态图约束**：不用 `BeatGrid/ProgressHud/useT/useAt/useBeat`，底纹与涟漪用纯 CSS 自绘（可复用 `Ripple`/`Wave` 的静态画法，但传入固定进度而非节拍值）。

### 步骤 9：校验与渲染
```
npm run typecheck
npm run studio                                        # 目测风格/节奏/卡点/封面
npm run still -- FlowState --scale=0.25 --frame=30    # 抽帧自查布局
npm run still -- FlowStateCover out/flow-state/cover.png
npm run render -- FlowState out/flow-state.mp4
```

## 六、假设与决策

| 决策点 | 选择 | 理由 |
|---|---|---|
| 风格 | 「深潜水流」深墨绿+薄荷+涟漪（kit 全自定义） | 项目四种既有风格全避开；水意象与 Flow 主题强契合 |
| 叙事/时长 | 沿用 V1 结构与 336 拍（用户未对内容提异议） | 三场景开头是用户原始需求；3 分钟符合 skill 目标 |
| BGM | 仍用默认 BGM（用户 V1 指定，音频≠风格） | skill 明确允许复用已有音频 |
| exitDim | 不设（默认 0.5） | 深色风格压暗退场增强"下沉"感；仅浅色纸面才需 0 |
| shared 组件取舍 | Chapter/Sub 用 kit 自制替代 SceneTitle/Caption | 二者硬编码 `C.bg` 藏青胶囊/徽章，与绿系风格串味 |

## 七、验证清单

- [ ] `id` 全局唯一；`src/videos/flow-state/` ↔ `public/flow-state/` 同 id
- [ ] BGM 就位，`bpm/offset/totalBeats` 来自 beat 输出，落点表已抄进 spec 注释，336 ≤ 可用拍数
- [ ] scenes 连续无空洞、start/end 全为 16 的倍数；每个 16 拍边界都有大卡点
- [ ] 无整幅画面每拍抖动；涟漪/卡片等元素动画全部卡拍
- [ ] kit 风格不与四种既有风格撞型；场景/封面配色全部来自 `kit/theme.ts` 的 `P`
- [ ] 封面无节拍依赖；已挂 `spec.Cover` 并导出 PNG
- [ ] 已注册 `src/videos/index.ts`；`npm run typecheck` 退出码 0
- [ ] studio 预览风格统一、卡点跟拍；成片时长 ≈ 3:00
