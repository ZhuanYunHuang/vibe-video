# 风格库 · Style Kits

可复用视频风格包。每套风格 = **一份语义调色板 + 一套字体 + 背景/HUD + 一整套同名契约组件 + 封面模板**，
放在 `src/styles/<style>/`。新视频只需在 `kit/index.ts` 写一行 re-export 即可整片换风格，
场景文案可跨风格复用（组件同名同签名）。

---

## 30 秒上手：给新视频选一套风格

```ts
// src/videos/<id>/kit/index.ts —— 全部内容就这一行
export * from "../../../styles/whiteboard"; // 或 pixel / flat
```

```ts
// src/videos/<id>/spec.ts —— 挂上整套风格（bg / exitDim 可省，自动取 kit 的推荐值）
import { kit } from "./kit";
export const spec: VideoSpec = {
  /* ... */
  style: kit, // 背景层 + HUD + 推荐 exitDim 一次生效
  bg: kit.P.bg, // 可选：整片底色
};
```

```tsx
// 场景里统一从 "../kit" 取组件（不要直接 import src/styles/xxx）
import { Stage, Sub, Chapter, Slam, Card, Stamp, Mark, Kicks, Particles, P, FONT, useK, usePulse } from "../kit";
```

> 契约细节见 [`contract.ts`](./contract.ts)。约定：所有原语是 `t/from` 纯函数（封面/展示页等 Still 可冻结渲染），
> `t` 与 `from` 一律为**场景内帧**，用 `useK(start)` 把绝对拍号换算成场景帧。

---

## 已交付风格总览

| 风格 | 一句话定位 | 适合的选题气质 | 招牌动效 |
| --- | --- | --- | --- |
| **白板手绘** `whiteboard` | 白板 + 马克笔，像有人当场给你画懂 | 讲解、科普、板书推导、轻松教学 | 马克笔描画 + 描边后填色 + 手绘抖动 |
| **像素风** `pixel` | 8-bit 游戏机画面，复古硬核 | 科技、游戏、怀旧、数据可视化 | 低分辨率帧步进 + 扫描线 + RGB 分离 |
| **扁平 MG** `flat` | 现代动效设计，干净有弹性 | 商业、产品、互联网、轻科普 | 弹性 overshoot + 形状漂移 + 荧光笔扫过 |
| **皮影戏** `shadowpuppet` | 幕布透光 + 关节剪影 | 典故、历史、寓言、传统文化 | 吊起入场 + 关节钟摆 + 光斑呼吸 |
| **赛博 HUD** `cyberhud` | 霓虹扫描框 + 数据流 | 科技、安全、监控、硬核叙事 | 扫描光带 + 故障 glitch + 括号化 HUD |
| **数据信息图** `datainfo` | 等宽大数字讲数据 | 数据科普、研究报告、榜单 | 数字滚动计数 + 图表生长 + 刻度尺 |
| **拼贴** `collage` | 撕纸拼贴 + 半调网点 | 观点输出、都市话题、锐评 | 纸片错位摆动 + "啪"贴入 + 撕边 |
| **Bauhaus** `bauhaus` | 三原色几何构成 | 设计、艺术、品牌、理念 | 色块扫入 + 构成缓转 + 硬边投影 |
| **Synthwave** `synthwave` | 80s 落日霓虹 | 音乐、怀旧、复古科技 | 透视网格滚动 + 铬字 + 霓虹发光 |

效果预览：`out/styles/demo-<id>.mp4` 共 9 支（同一段三幕脚本分别用九套风格渲染，验证「换 kit 即换风格」）；
一页 15 格总览见 `out/styles/gallery.png`。

---

## 白板手绘 · whiteboard

**定位**：白板 + 马克笔手绘。像有人当场一边讲一边给你画出来，亲和力强、降低理解门槛。

**视觉基因**

| 语义键 | 色值 | 用途 |
| --- | --- | --- |
| bg / bgAlt | `#FBFBF7` / `#F1F1EA` | 白板白底 / 做旧档 |
| card | `#FFFFFF` | 纸卡面 |
| ink / inkSub | `#23272E` / `#6B7280` | 马克黑主字 / 次要字 |
| line | `#D8DAD6` | 背景淡格线 |
| accent / accentDeep / accentLight | `#E8452B` / `#B5321F` / `#F4A08E` | 红马克笔三档 |
| gold | `#F2B705` | 黄马克（点缀） |
| seal | `#E8452B` | 手绘圆章 |

字体：`FONT = LXGW WenKai / 楷体 → 系统回退`（手写感 CJK）。

**招牌动效**
- 常驻：整屏 1~2px 手绘抖动 + 呼吸缩放（Stage），画面永不静止；
- 标题大字：先描边后填色（马克笔两段式）；卡片：不规则圆角 + 手绘描边 + 轻浮动；
- 标注 Mark：马克笔双圈（错位复笔）或波浪划线，带"描画"进度；
- 本章还自带贴胶带的便签式章节头、手绘圆章、粉笔屑粒子、底部马克笔进度线 HUD。

**组件清单**：契约全套（Stage/Sub/Chapter/Slam/Card/Stamp/Mark/Kicks/Particles/Backdrop/Hud）+ `makeCover`。

**选用示例**：`kit/index.ts` → `export * from "../../../styles/whiteboard";`

---

## 像素风 · pixel

**定位**：16-bit 游戏机画面。深空底 + 像素块面 + 扫描线，复古硬核，科技/游戏选题天然契合。

**视觉基因**

| 语义键 | 色值 | 用途 |
| --- | --- | --- |
| bg / bgAlt | `#10121C` / `#1B1F33` | 深空底两档 |
| card | `#232840` | 面板面 |
| ink / inkSub | `#E8F0FF` / `#8FA0C8` | 亮字 / 暗字 |
| line | `#34406A` | 网格 / 暗描边 |
| accent / accentDeep / accentLight | `#57E389` / `#2FA95E` / `#9BF5B8` | 像素绿三档 |
| gold / seal | `#FFD23F` / `#FF4D6D` | 金币黄 / 警示粉 |

字体：**FusionPixel（缝合像素字体，OFL 开源）**，文件在 `public/fonts/`，由 `pixel/Fonts.tsx` 的
`PixelFontLoader` 用 `delayRender` 预加载；**字号取 12 的整数倍**（36/48/72/96）保证像素锐利；字体缺失自动回退。

**招牌动效**
- 常驻：位移每 2 帧才更新一次（8-bit 卡帧感）+ 扫描线滚动 + 像素星点闪烁；
- 大字：3.2→1 卡帧弹入 + RGB 分离（红/青错位拖影）；卡片：上扫逐行填充入场 + 实心像素投影；
- 标注 Mark：闪烁虚线选中框 或 分段方块下划线；粒子：纯色像素方块迸射；
- HUD：分段像素血条（前沿一格闪烁）。

**组件清单**：契约全套 + `PixelFontLoader` + `makeCover`。

**选用示例**：`kit/index.ts` → `export * from "../../../styles/pixel";`

---

## 扁平 MG · flat

**定位**：现代动效设计（Dribbble 气质）。纯色几何 + 大圆角 + 弹性运动，商业、干净、有活力。

**视觉基因**

| 语义键 | 色值 | 用途 |
| --- | --- | --- |
| bg / bgAlt | `#F7F8FA` / `#EEF1F6` | 浅灰底两档 |
| card | `#FFFFFF` | 白卡 |
| ink / inkSub | `#1F2937` / `#6B7280` | 深字 / 次要字 |
| line | `#E5E7EB` | 浅描边 |
| accent / accentDeep / accentLight | `#4C6FFF` / `#3A56D4` / `#9DB2FF` | 主蓝三档 |
| gold / seal | `#FFC93C` / `#FF6B35` | 黄 / 橙（贴纸徽章） |
| extra.mint | `#2BD9C2` | 薄荷点缀 |

字体：系统粗黑体（微软雅黑/苹方）。

**招牌动效**
- 常驻：视差漂移 + 呼吸缩放的"活镜头"+ 背景大几何形缓慢漂移；
- 大字：粗体弹性砸入 + 落地压扁（squash & stretch）；卡片：大圆角 + 柔长投影 + 弹性 pop；
- 标注 Mark：荧光笔高亮块（scaleX 扫过、正片叠底）或圆角下划线；粒子：几何彩屑（圆/方/三角）；
- HUD：胶囊进度条 + 弹性端点。

**组件清单**：契约全套 + `makeCover`。

**选用示例**：`kit/index.ts` → `export * from "../../../styles/flat";`

---

## 皮影戏 · shadowpuppet

**定位**：米黄幕布透光 + 纯黑关节剪影。像戏台后打光、剪影登台，适合典故、历史、寓言。

**视觉基因**：bg `#F3E3C3`（幕布）/ card `#F9EED6`（透光纸）/ ink `#201A14`（剪影黑）/
accent `#B5402C`（皮影朱红）/ gold `#C99A3F`（掐丝金）；字体楷体。光斑呼吸 + 布纹 + 底部横杆。

**招牌动效**
- 元素"吊起"入场（从上方垂落回弹）+ 落定后持续关节钟摆（±1° 慢摆）；
- 大字为剪影字（纯黑 + 向下硬投影模拟透光）；卡片四角金铆钉；
- 标注为掐丝金双线圈 / 朱红划线；粒子为透光浮尘；HUD 是横杆上随进度行走的小剪影。

**选用示例**：`export * from "../../../styles/shadowpuppet";`

---

## 赛博 HUD · cyberhud

**定位**：深蓝黑 + 霓虹青/品红 + 扫描框与数据流。科技、安全、监控叙事的硬核气质。

**视觉基因**：bg `#0A0E1A` / card `#121A30` / ink `#D8F4FF` / accent `#00E5FF`（霓虹青）/
seal `#FF2E88`（品红）/ gold `#FFD23F`；等宽字体优先。四角 HUD 框 + 透视网格 + 伪终端小字。

**招牌动效**
- 扫描光带持续移动；入场"数字故障"（2-3 帧水平错位瞬切）；
- 大字带 ⟨ ⟩ 括号 + 霓虹发光；卡片切角 + 四角刻度框；字幕括号化 `[ 文本 ]`；
- 标注为四角扫描括号 + 扫描线；粒子为数据碎片（细条 + 方块）；HUD 为 `[████░░] 56%` 括号进度。

**选用示例**：`export * from "../../../styles/cyberhud";`

---

## 数据信息图 · datainfo

**定位**：冷静的数据感——暖白底 + 数据蓝/橙 + 等宽大数字 + 图表元素。数据科普、研究报告、榜单。

**视觉基因**：bg `#F7F5F0` / card `#FFFFFF` / ink `#1A2233` / accent `#2E6BFF`（数据蓝）/
gold `#FF9F1C`（数据橙）/ seal `#E5484D`（警示红）。点阵网格 + 角落刻度尺 + 柱状水印。

**招牌动效**
- 数字滚动计数（私有 `Counter` 组件：`<Counter t value size decimals />` 从 0 滚到目标值）；
- 大字带基线色条生长；卡片顶部色带 + 图表角标；标注为数据括号 `[ ]` + 引线标签；
- 粒子为数据点 + 短尾迹；HUD 为刻度尺进度（带百分比读数）。

**选用示例**：`export * from "../../../styles/datainfo";`

---

## 拼贴 · collage

**定位**：剪纸拼贴 + 撕边纸条 + 半调网点 + 胶带。观点输出、都市话题、锐评的气质。

**视觉基因**：bg `#E8DCC8`（牛皮纸）/ card `#FBF7EE` / ink `#2A2620` / accent `#D94F2B`（油墨红）/
gold `#E3A92C`。粗黑体标题 + 楷体手写批注 + 半调网点叠加 + 胶带痕。

**招牌动效**
- 每个元素独立慢频摆动（纸片被风吹）+ 入场"啪"贴上（快 pop + 微旋 settle）；
- 大字号为"剪报纸条"（底衬错位色条 + 白条黑字）；卡片为撕边纸片（clip-path 撕裂边）；
- 字幕是贴胶带的纸条；标注为红马克圈 / 划线；粒子为碎纸屑；HUD 是和纸胶带进度条。

**选用示例**：`export * from "../../../styles/collage";`

---

## Bauhaus · bauhaus

**定位**：三原色（红黄蓝）+ 黑 + 米白 + 直线/圆/三角构成 + 强网格排版。设计、艺术、品牌、理念话题。

**视觉基因**：bg `#F4F1EA` / card `#FFFFFF` / ink `#111111` / accent `#2456D6`（蓝）/
gold `#F5C518`（黄）/ seal `#E63B2E`（红）。细网格 + 页边距框 + 角落大型构成（缓转）。

**招牌动效**
- 构成式入场（色块从左扫入、文字跳出）+ 背景几何构成缓慢旋转（活动雕塑）；
- 大字为"色块字"（色块衬底 + 反白文字）；卡片黑色粗边 + 角上三原色小方块；
- 标注为黄色块高亮 / 黑色下划线；粒子为三原色几何粒；HUD 为红黄蓝三色分段进度。

**选用示例**：`export * from "../../../styles/bauhaus";`

---

## Synthwave · synthwave

**定位**：80s 复古——品红紫霓虹 + 透视网格地向线 + 落日圆盘 + 铬字。音乐、怀旧、复古科技。

**视觉基因**：bg `#14082B` / card `#241056` / ink `#FFE9FF` / accent `#FF3EA5`（品红）/
gold `#3DE8FF`（霓虹青）/ seal `#FFD23F`（落日黄）。星点 + 条纹落日 + 地平线光带。

**招牌动效**
- 透视网格向地平线持续滚动（常驻）+ 霓虹偶发闪烁；
- 大字为**铬字**（金属渐变 `background-clip:text` + 发光 + 光斑扫过）；
- 卡片霓虹描边发光 + 顶部品红渐变条；标注为霓虹四角括号 / 渐变下划线；
- 粒子为星尘（发光点 + 飞线）；HUD 为霓虹渐变条 + 发光端点。

**选用示例**：`export * from "../../../styles/synthwave";`

---

## 全部 15 种风格 · 状态总表

来源：Vincent 文森特《Opus 5.5 十五种视频风格》盘点（`mg-styles-15`）。本项目按批次引入。

| # | 风格 | 一句话定位 | 状态 |
| --- | --- | --- | --- |
| 1 | 白板手绘 | 马克笔当场画懂 | **已交付** |
| 2 | 像素风 | 8-bit 复古硬核 | **已交付** |
| 3 | 扁平 MG | 现代弹性动效 | **已交付** |
| 4 | 皮影戏 | 剪影布景 + 关节式动作 | **已交付** |
| 5 | 赛博 HUD | 霓虹扫描 + 数据流界面 | **已交付** |
| 6 | 数据信息图 | Kurzgesagt 式 + 等宽大数字 | **已交付** |
| 7 | 拼贴 | 剪纸拼贴 + 错位素材 | **已交付** |
| 8 | Bauhaus | 三原色几何 + 包豪斯排版 | **已交付** |
| 9 | Synthwave | 80s 霓虹 + 透视网格 | **已交付** |
| 10 | 3D 拆解 | three.js 爆炸图 + 影棚光 | 批次 3（需 @remotion/three） |
| 11 | 汉字演变 | WebGL 电影感 + 火光铸刻 | 批次 3（需 WebGL） |
| 12 | 综艺花字 | 逐字花式强调的综艺字幕 | 批次 3 |
| 13 | 绘本科画 | 钢笔线 + 蜡笔涂色 | 批次 3 |
| 14 | 数学可视化 | 3Blue1Brown 式几何动画 | 批次 3 |
| 15 | 比例尺对比 | 镜头拉远 + 同屏缩放对比 | 批次 3 |

### 后续批次规划

**批次 2（6 套，已交付）**：皮影戏、赛博 HUD、数据信息图、拼贴、Bauhaus、Synthwave —— 详情见上方各小节，
演示片 `out/styles/demo-<id>.mp4`，展示页对应瓦片见 `out/styles/gallery.png`。

**批次 3（6 套，规划中未实现，含技术预研）**
- **3D 拆解**：需引入 `@remotion/three` + three.js，产品分层爆炸图、镜头绕转；
- **汉字演变**：需 WebGL/着色器（火光、景深、金属质感），字形的历史演化叙事；
- **综艺花字**：逐字出现 + 描边/抖动/弹跳的花式强调字幕，适合娱乐化表达；
- **绘本科画**：钢笔线稿 + 蜡笔涂色 + 线条微抖，适合儿童向科普；
- **数学可视化**：深色底 + 干净几何 + 公式逐项浮现，从特殊到一般的推导演示；
- **比例尺对比**：同屏缩放 + 镜头不断拉远，呈现数量级差异。

> 每批完成后更新本表状态并补对应详情小节（照下面「加一套新风格」的流程）。

---

## 如何给风格库加一套新风格

1. 新建 `src/styles/<id>/`：`theme.ts`（语义色板映射 + 字体）、`ui.tsx`（契约组件）、
   `fx.tsx`（Backdrop/Hud/Kicks/Particles）、`Cover.tsx`（`makeCover` 工厂）、`index.ts`（导出 `kit: StyleKit`）；
2. 在 `src/styles/demo/specs.ts` 的 `DEMO_SPECS` 数组加入新 kit（自动获得一支演示片）；
3. 在 `src/styles/demo/Gallery.tsx` 的 `TILES` 数组把对应灰位换成 kit 瓦片（或追加新瓦片）；
4. 更新本 README：总览表、状态总表、新风格详情小节；
5. 验收：`npm run typecheck` → `npm run still -- StyleDemo-<id> out/styles/demo-<id>.png --frame=200`
   → `npm run render -- StyleDemo-<id> out/styles/demo-<id>.mp4` → `npm run still -- StyleGallery out/styles/gallery.png`。
