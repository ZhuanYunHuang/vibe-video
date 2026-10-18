import { FPS, useBeat } from "../../../shared";

// 《耐心电量》专属配色：暖色卡通（Q 版小人 + 暖橙室内 + 深蓝夜城）
// 重规划后只保留两个世界：冷（夜城 / 门外）与暖（家 / 门内）
export const P = {
  // 冷 · 外面/夜（深蓝夜城）
  night: "#101C3A",
  nightBlue: "#1B2C52",
  cool: "#4A90D9",
  blue: "#31406B",
  magenta: "#E8564B",
  // 暖 · 家（暖米 + 橙）
  home: "#FFF3E2",
  home2: "#FFE3BE",
  amber: "#F5A623",
  orange: "#FF8A3D",
  warmRed: "#E85D5D",
  // 公共
  ink: "#2A2E3A",
  sub: "#7C8BA8",
  dim: "#C9D4E8",
  ok: "#58B858",
  warn: "#F5C542",
  low: "#E84A4A",
  skin: "#FFD9B3",
  // 浅色底（时间账点阵幕）与白卡
  paper: "#EEF2FB",
  card: "#FFFFFF",
  mouth: "#8A4B2F",
};

// 卡通柔和投影（通用）
export const glow = (color: string, r = 1) =>
  `0 ${2 * r}px 0 rgba(42,46,58,0.08), 0 ${8 * r}px ${18 * r}px rgba(30,40,70,0.16)`;

// 统一暗角：把视线压回画面中心（治"平"，让画面有电影感）
export const vignette = (a = 0.34, rgb = "22,32,58") =>
  `radial-gradient(ellipse at 50% 44%, rgba(${rgb},0) 34%, rgba(${rgb},${a}) 100%)`;

// 门外冷光 / 门内暖光：全片"内外"的灯光隐喻
export const lightWarm = (a = 0.18, bx = "62%", by = "40%") =>
  `radial-gradient(ellipse 58% 62% at ${bx} ${by}, rgba(255,217,138,${a}) 0%, rgba(255,138,61,${a * 0.6}) 34%, transparent 72%)`;
export const lightCool = (a = 0.2, bx = "38%", by = "36%") =>
  `radial-gradient(ellipse 58% 62% at ${bx} ${by}, rgba(74,144,217,${a}) 0%, transparent 70%)`;

// 场景内：把绝对秒数换算成场景时间 t（备用，本片主要按拍锚定）
export const useSec = (start: number) => {
  const beat = useBeat();
  return (sec: number) => Math.round(sec * FPS) - beat.bf(start);
};
