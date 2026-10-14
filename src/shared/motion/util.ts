// 动效工具箱的几何/数据纯工具（无 React、无状态）

// 种子化伪随机：同 (i, k) 必得稳定的 0~1 值，粒子初值/相位用
export const rnd = (i: number, k = 1) => {
    const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return x - Math.floor(x);
};

// 限幅到 0~1
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

// 极坐标换算：圆心 + 半径 + 角度 -> [x, y]
export const polar = (cx: number, cy: number, r: number, a: number): [number, number] => [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
