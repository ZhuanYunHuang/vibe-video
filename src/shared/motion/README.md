# 通用动效工具箱 · Motion Toolbox

从全仓库 40+ 处既有动效实现中提炼的 **19 项通用动效原语 + 几何工具**，业务侧统一从 `../../../shared` 导入：

```tsx
import { Typewriter, DrawPath, Shockwave, ParticleField } from "../../../shared";

<Typewriter t={t} from={K(2)} text="逐字打出来" style={{ fontSize: 56, color: "#E8F0FF" }} />
```

**效果验收**：`npm run render -- MotionDemo out/motion/demo.mp4`（约 40s 轮播全部 19 项）；
一页索引见 `out/motion/gallery.png`。

---

## 约定（全部组件）

- **t/from 纯函数**：内部禁用 beat hook（`useT/useAt/useBeat`），封面/展示页等 Still 可冻结渲染；
  - 例外：`MaskReveal` 用 `React.useId` 生成 mask id（非 beat hook，Still 安全）。
- 坐标基于 1920×1080；环形一律 SVG `<circle>`（**大元素禁用 `borderRadius:"50%"`**，>500px 会被 Chrome 裁半）。
- 冲击类在 `t < at` 时返回 null——在 Still/封面上要传有效帧（如 `at + 8`）。

## 文字类（6）

| 组件 | props | 说明 |
|---|---|---|
| `Typewriter` | `{t,from,text,speed?,cursor?,blink?,caretColor?,style?}` | 逐字显现 + 闪烁光标（speed=每字帧数） |
| `CountUp` | `{t,from,value,dur?,decimals?,prefix?,suffix?,style?}` | 数字滚动（等宽数字防跳动） |
| `StaggerText` | `{t,from,text,step?,y?,style?}` | 逐字依次浮现（中文按字拆） |
| `StrokeFillText` | `{t,from,text,strokeColor,fillColor,strokeWidth?,fillDelay?,fillDur?,style?}` | 先空心描边、后填色（两段式） |
| `RgbSplitText` | `{t,from,text,split?,decay?,color?,style?}` | 红/青错位故障后归位 |
| `ChromeText` | `{t,from,text,gradient?,animate?,glow?,style?}` | 铬字/渐变字，animate 时扫光 |

## 路径揭示类（4，依赖 @remotion/paths）

| 组件 | props | 说明 |
|---|---|---|
| `DrawPath` | `{t,from,d,dur?,stroke,width?,showHead?,style?}` | 沿 SVG path 逐段画出（可带端点圆头） |
| `PathFollower` | `{t,from,d,dur?,color?,size?,trail?,spin?,label?}` | 元素沿路径飞行 + 残影（结束自动淡出） |
| `MaskReveal` | `{t,from,d,dur?,mode?,strokeWidth?,children}` | 用"被画出"的路径作遮罩揭示 children（conceal 反向） |
| `Callout` | `{t,from,x,y,text,tx?,ty?,side?,color?,dur?}` | 引线标注（折线描画 + 标签弹出） |

## 环境持续类（4）——治"画面停住发呆"

| 组件 | props | 说明 |
|---|---|---|
| `ParticleField` | `{t,x?,y?,w?,h?,n?,color?,speed?,size?,drift?,rise?,seed?}` | 环境粒子场（尘埃/星点/飘雪；rise 为上升气泡） |
| `Sway` | `{t,from,x?,y?,dur?,amp?,period?,children}` | 摆动落定（弹性摆动定下后持续微摆，钟摆感） |
| `ParallaxLayers` | `{t,layers,dx?,dy?,cx?,cy?}` | 视差层（按 depth 各层不同幅度漂浮） |
| `FocusZoom` | `{t,from,dur?,fromScale?,toScale?,x?,y?,blur?,children}` | 聚焦推拉（缩放 + 由虚到实） |

## 冲击转场类（5）

| 组件 | props | 说明 |
|---|---|---|
| `Shockwave` | `{t,at,x?,y?,color?,rings?,maxRadius?,dur?}` | 多层圆环扩散（SVG circle 实现） |
| `SpeedLines` | `{t,at,color?,dur?,n?,cx?,cy?,inner?,outer?}` | 径向速度线一闪而过 |
| `ShakeWrapper` / `shake()` | `{t,ats,amp?,decay?,children}` / `shake(t,ats,amp,decay)→transform 串` | 内容级震屏（勿对整幅背景用每拍抖动） |
| `FlipCard` | `{t,from,x?,y?,w?,h?,rot?,flipAt?,front,back}` | 3D rotateY 翻牌 |
| `TransitionSweep` | `{t,from,dur?,mode?:"wipe"\|"route"\|"clock",color?,d?}` | 覆盖式转场扫屏（route 模式为蛇形路径铺开） |

## 几何工具（util）

`rnd(i,k)` 种子伪随机（粒子初值/相位稳定复现）｜`clamp01(x)` 限幅｜`polar(cx,cy,r,a)` 极坐标换算。

## 基础层补充（core/anim.ts）

`elastic(t,from,dur?,damping?)` 衰减振荡（摆动落定用）｜`sway(t,period?,amp?)` 持续微摆——与 `pop/prog/hit` 同族。

---

## 维护说明

- 依赖：`@remotion/paths@4.0.534`（**精确版本**，仅 `path.tsx` 使用）；`@remotion/transitions` 仅供 `demo/` 组装演示片。
- 出处对照与"从哪提炼"见各项实现注释；新增动效请遵循上述约定并同步更新本 README 与 `demo/items.tsx`（自动进入演示片与展示页）。
