// 爆炸位移：按序号错峰 + 三次缓出 + 落定回弹；所有 3D 场共用
export const explodeOffset = (p: number, i: number, n: number, distance: number, stagger = 0.045, bounce = 0.03) => {
    const span = Math.max(0.35, 1 - (n - 1) * stagger);
    const local = Math.min(1, Math.max(0, (p - i * stagger) / span));
    const e = 1 - Math.pow(1 - local, 3);
    const over = Math.sin(local * Math.PI) * bounce;
    return (e + over) * distance;
};

// 单件透明度：主体 1 / 次要件 0.75 / 内部结构 0.55
export const partOpacity = (i: number, n: number) => (i < n * 0.4 ? 1 : i < n * 0.75 ? 0.78 : 0.55);

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
