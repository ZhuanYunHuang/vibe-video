import { FPS, useBeat } from "../../../shared";

// 《升本后醒来》专属配色：深夜霓虹 + 现场舞台蓝
export const P = {
  bg: "#0b1020",
  bg2: "#121a33",
  night: "#070a16",
  cyan: "#22e4ff",
  magenta: "#ff3ea5",
  yellow: "#ffd23f",
  red: "#ff4d4d",
  green: "#3dffa8",
  ink: "#eaf6ff",
  sub: "#8ea3c7",
  line: "#2a3a66",
  skin: "#f6d3b3",
  hair: "#15131a",
  shirt: "#16161c",
  jeans: "#2b3f73",
  silver: "#d9e2ee",
};

// 场景内：把原曲里的绝对秒数换算成场景时间 t（与 useT() 同一坐标）
export const useSec = (start: number) => {
  const beat = useBeat();
  return (sec: number) => Math.round(sec * FPS) - beat.bf(start);
};

// 文字霓虹发光
export const glow = (color: string, r = 1) =>
  `0 0 ${6 * r}px ${color}, 0 0 ${18 * r}px ${color}, 0 0 ${42 * r}px ${color}88`;
