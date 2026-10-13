# 《访问一个网页，背后发生了多少事》（WebRequest）

> 一句话定位：把"打开一个网页"这件日常小事拆开，逐层讲清浏览器到服务器再回来经历的全过程。

## 这是什么

一支 IT 科普短片，回答一个反直觉的问题：**你敲下回车到页面出现，中间到底发生了什么？**

叙事按网络分层一层层往下钻：

1. 敲下回车那一刻，一场接力赛开始。
2. DNS 解析：域名不能直接用，得先换成 IP。
3. TCP 三次握手：先和服务器建立可靠连接。
4. TLS 握手：给通话加把锁（HTTPS 加密）。
5. HTTP 请求：正式把请求发出去。
6. 服务器处理：请求穿过 CDN / 负载均衡 / 应用服务 / 缓存与数据库。
7. 浏览器渲染：解析 → 建树 → 布局 → 绘制 → 合成。
8. 页面完成，这一切通常不到 1 秒。
9. 收尾回顾整条链路。

受众：想建立网络整体图景的普通开发者 / 技术爱好者。

## 怎么做

- **组装方式**：`spec.ts` 是唯一配置入口，给出一份 `VideoSpec`；`src/shared/Video.tsx` 通用装配器据此拼出整片（背景层 + 场景 + BGM + HUD）。业务侧只从 `../../../shared` 取件。
- **场景编排**：10 个场景，每个场景一个文件（`scenes/*.tsx`），统一 `React.FC<SceneProps>`，入参只有 `start`（本场景起始拍号）。场景表见文末。
- **节拍卡点**：BGM 为 `public/web-request/bgm.mp3`，用 `npm run beat -- public/web-request/bgm.mp3` 分析得到 `bpm 112.8 / offset 12`（每拍 ≈ 16 帧）。场景内用 `useT()` 取场景相对帧，用 `useAt()(start, k)` 取"本场景第 k 拍"的位置，所有动画触发点都落在拍上。
- **组件与工具**：链路可视化主要用 shared 的 `NodeBox`（节点盒子）、`Packet`（数据包沿路径飞行带拖尾）、`Wire`（虚线连接）、`SceneTitle`（步骤标题）、`Caption`（底部字幕），动画用 `pop / prog / hit`。
- **注册**：在 `src/videos/index.ts` 的 `VIDEOS` 数组里 import 并加入（当前第一位）。

## 采用什么风格

**默认霓虹网格风格**（本片未做任何风格覆盖，直接用 `shared` 的默认值）：

- **背景层**：默认 `BeatGrid`——深蓝网格随 BGM 节拍呼吸（强拍更亮）。
- **配色**：默认 `C` 调色板，底色深蓝 `#0b1020`，强调色用青 / 粉 / 黄 / 紫 / 绿等霓虹色，节点用发光边框 + 图标。
- **HUD**：默认 `ProgressHud`——底部渐变进度条 + 切场瞬间闪白 + 随节拍脉冲的小球。
- **底色节奏**：每场用 `scenes[].bg` 换一个深色底（`#0d1430` → `#120f2e` → …），给不同网络层做"分层感"。
- **转场**：几乎所有转场类型轮着上——`zoom / slideLeft / circle / blinds / diag / slideUp / spin / glitch`，保证节奏不闷。

## spec 关键参数

| 字段 | 值 | 说明 |
|---|---|---|
| id | `WebRequest` | Composition id（全局唯一） |
| bpm / offset | `112.8` / `12` | BGM 节拍与首拍帧 |
| totalBeats | `112` | 正片总拍数 |
| transFrames | `12` | 转场帧数（转场结束正好落在拍上） |
| tailFrames | `45` | 结尾留白 1.5s |
| bgm | `web-request/bgm.mp3` | 相对 `public/` 的路径 |
| bg | `C.bg`（`#0b1020`） | 整片底色 |
| width × height | `1920 × 1080` | FPS 30 |
| 风格覆盖 | 无 | 使用默认 `BeatGrid` + `ProgressHud` |

## 场景表

| 拍号 | 场景组件 | 转场 | 讲什么 |
|---|---|---|---|
| 0–8 | Intro | none | 逐拍砸字，抛出问题 |
| 8–16 | Browser | zoom | 在地址栏输入网址、按下回车 |
| 16–32 | Dns | slideLeft | DNS 解析：依次问根 / .com / 权威服务器，拿到 IP |
| 32–44 | Tcp | circle | TCP 三次握手（SYN / SYN+ACK / ACK） |
| 44–56 | Tls | blinds | TLS 握手：证书校验 → 交换密钥 → 加密通道 |
| 56–68 | Http | diag | 发出 HTTP 请求、收到响应与 200 OK |
| 68–80 | Server | slideUp | 服务器内部：CDN → 负载均衡 → 应用服务 → 缓存 / 数据库 |
| 80–92 | Render | spin | 浏览器渲染流水线：解析 → DOM/CSSOM → 布局 → 绘制 → 合成 |
| 92–100 | Done | glitch | 3-2-1 倒计时后页面炸开完成 |
| 100–112 | Outro | zoom | 六步串联回顾 + 收尾标语 |
