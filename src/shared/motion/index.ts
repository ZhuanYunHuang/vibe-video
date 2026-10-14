// 通用动效工具箱：从全仓库 40+ 处既有实现提炼的 19 项动效原语（+ 几何工具）。
// 约定：全部 t/from 纯函数（禁 beat hook，Still 可冻结）；坐标基于 1920×1080；
// 环形一律 SVG <circle>（大元素禁用 borderRadius:"50%"）。详见本目录 README.md。
export { clamp01, polar, rnd } from "./util";
export { ChromeText, CountUp, RgbSplitText, StaggerText, StrokeFillText, Typewriter } from "./text";
export { Callout, DrawPath, MaskReveal, PathFollower } from "./path";
export { FocusZoom, ParallaxLayers, ParticleField, Sway } from "./ambient";
export { FlipCard, ShakeWrapper, Shockwave, SpeedLines, TransitionSweep, shake } from "./impact";
