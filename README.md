# vibe-video

基于 **Remotion** 的「流程科普」视频工厂：每支视频 = 一份 `spec.ts` + 一组场景组件，共用装配器、风格包与节拍系统。

- 技术栈：Remotion 4.0.534 · React 19 · TypeScript · Three.js（部分片子）
- 现有成片：12 支（`src/videos/index.ts` 的 `VIDEOS`）
- 画布：1920×1080 / 30fps，成片 2–3 分钟

---

## 快速开始

```bash
npm install
npm run preview        # 实时预览 http://127.0.0.1:5180
npm run render -- DuoFold out/iphone-fold/duo-fold.mp4
```

> 需要 Node 20.19+ / 22.12+（推荐 22）。

---

## 实时预览（开发期默认入口）

```bash
npm run preview
```

启动后会自动打开浏览器（也可以手动访问 **http://127.0.0.1:5180**）。

**它和成片的关系**：预览跑的是与渲染完全相同的 React 组件树（同一份 `spec`、同一套 `Video` 装配器、同一份音频），只是不走编码。字体、3D、转场、字幕、配音都一致，差别只在导出压缩。

### 能做什么

| 能力 | 说明 |
|---|---|
| 首页列表 | 12 支视频全列出，点开即播 |
| 热更新 | 改 `src/videos/**` 保存，画面立刻变，**当前帧不丢** |
| 播放控制 | 满屏等比缩放，鼠标移动出控制条：播放 / 进度 / 静音 / 全屏 |
| 调试模式 | 右侧列出每场拍号、帧区间、时长；点一下跳转，支持逐帧、按场循环、帧/拍实时读数 |
| 一键渲染 | 试渲染（前 90 帧 / 0.5×）、当前场景、全片；显示打包/渲染/编码进度与剩余时间，可取消 |
| 成片回放 | 渲染完成后直接在面板里播放，支持拖进度条（Range），可复制输出路径 |

### 快捷键

| 键 | 行为 |
|---|---|
| `Space` / `K` | 播放 / 暂停 |
| `←` / `→` | 逐帧（`Shift` 加按 = 1 秒） |
| `[` / `]` | 上一场 / 下一场 |
| `1`–`9` | 跳到第 N 场 |
| `Home` / `End` | 片头 / 片尾 |
| `D` | 调试模式 |
| `M` | 静音 |
| `F` | 全屏 |
| `R` | 渲染面板 |

> 音频受浏览器策略限制，需要先点一次画面才会出声。

### 渲染产物

预览页触发的渲染一律落在 `out/preview/`（`<id>-<mode>-<时间戳>.mp4`），不会覆盖手工交付的 `out/<id>/`。

---

## 加一支新视频

1. **准备素材**：BGM → `public/<id>/bgm.mp3`；配音 → `public/<id>/vo/`；封面图 → `public/<id>/`。
2. **算节拍**：`npm run beat -- public/<id>/bgm.mp3`，把 `bpm` / `offset` / `totalBeats` 填进 `spec.ts`。
3. **写场景**：复制 `src/videos/_template/` 成 `src/videos/<id>/`，改造 `scenes/` 与 `spec.ts` 的场景表。
4. **注册**：在 `src/videos/index.ts` 的 `VIDEOS` 里加一行。
5. **启动预览**：`npm run preview` —— 生成完素材/场景后**必须先把项目跑起来**，直接在浏览器里看，不要先渲染。
6. **确认后再出片**：`npm run render -- <id> out/<id>/<id>.mp4`，或点预览页的「渲染成片」。
7. **导出封面**：`npm run still -- <id>Cover out/<id>/cover.png`。

---

## 目录结构

```
src/
├─ shared/             共用框架：装配器、节拍、动画、场景时间轴
├─ styles/             可复用风格包（15 套）+ 默认霓虹风
├─ videos/
│  ├─ index.ts         视频清单（VIDEOS）
│  └─ <id>/            spec.ts + scenes/ + kit/ + Cover.tsx
└─ Root.tsx            注册 Composition / Still
preview/               本地实时预览（Vite + @remotion/player + 渲染接口）
public/<id>/           该片的 BGM、配音、封面图等静态资源
out/<id>/              交付产物（成片、封面）
out/preview/           预览页触发的渲染产物
docs/                  视频工厂手册
.trae/skills/          视频生成 Skill（Agent 施工流程）
```

---

## 常用脚本

| 命令 | 作用 |
|---|---|
| `npm run preview` | 启动实时预览（127.0.0.1:5180，自动开浏览器） |
| `npm run render -- <id> <out>` | 渲染成片 |
| `npm run still -- <id> [out] --frame=N` | 导出单帧 / 封面 |
| `npm run beat -- <音频>` | 分析 BPM / 相位 / 可用拍数 |
| `npm run typecheck` | 视频代码类型检查 |
| `npm run typecheck:preview` | 预览页与渲染接口类型检查 |

---

## 更多文档

- [视频工厂手册](docs/video-factory.md) —— 目录边界、加片流程、资源规范
- [视频生成 Skill](.trae/skills/video-generation/SKILL.md) —— Agent 按图施工的完整流程与检查清单
- [风格库说明](src/styles/README.md) —— 15 套风格的色板、组件与适用场景
