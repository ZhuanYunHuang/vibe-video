import React from "react";
import { rnd } from "../../../shared";

// 伪 3D 金币特效：面/边两态翻转（scaleX 模拟 rotateY）+ 深度分层 + 重力落地弹跳滚动 + 散落闪烁。
// 丝滑要点：逐帧精确积分（不跳步）、轻重力更飘、入场错峰"绽放"、落地后贴地滚动。
// CoinBurst = 重拍爆散；CoinRain = 常驻金币雨（来财段）。

const GOLD = "#FFD23F";
const GOLD_D = "#C99A1F";
const FRAME = 1 / 30;
const GRAVITY = 850; // px/s²（偏轻：飞得更飘、散得更开）

type Coin = {
    a: number; // 迸射角
    v: number; // 初速 px/s
    size: number; // 币径（深度分层）
    spin0: number;
    spinV: number; // 翻转角速度
    delay: number; // 入场错峰帧
    life: number; // 总寿命帧
};

const makeCoins = (n: number, seed: number): Coin[] =>
    Array.from({ length: n }, (_, i) => ({
        a: -Math.PI / 2 + (rnd(i, seed) - 0.5) * 2.7,
        v: 460 + rnd(i, seed + 7) * 660,
        size: 20 + rnd(i, seed + 13) * 18,
        spin0: rnd(i, seed + 19) * Math.PI,
        spinV: 5.5 + rnd(i, seed + 23) * 5.5,
        delay: rnd(i, seed + 31) * 7,
        life: 170 + rnd(i, seed + 29) * 100,
    }));

// 币面（正面/侧面共用外壳）
const CoinFace: React.FC<{ size: number; sx: number; glow?: string }> = ({ size, sx, glow }) =>
    Math.abs(sx) > 0.28 ? (
        <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%, #FFF3C4 0%, ${GOLD} 45%, ${GOLD_D} 100%)`, border: `2px solid ${GOLD_D}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 14px ${glow ?? GOLD}55` }}>
            <span style={{ fontSize: size * 0.52, fontWeight: 700, color: "#8A6B1A", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', transform: `scaleX(${1 / Math.max(0.3, Math.abs(sx))})`, display: "flex" }}>财</span>
        </div>
    ) : (
        <div style={{ width: size * 0.3, height: size, background: `linear-gradient(180deg, ${GOLD}, ${GOLD_D})`, borderRadius: 3 }} />
    );

// 单枚金币：逐帧积分出位置（含落地反弹 + 贴地滚动），每帧都有精确新位置
const CoinSprite: React.FC<{ t: number; at: number; x: number; y: number; c: Coin; floor: number; idx: number }> = ({ t, at, x, y, c, floor, idx }) => {
    const d = t - at - c.delay;
    if (d < 1 || d > c.life) return null;
    let px = 0;
    let py = 0;
    let vx = Math.cos(c.a) * c.v;
    let vy = Math.sin(c.a) * c.v;
    const steps = Math.min(Math.ceil(d), 260);
    for (let f = 0; f < steps; f++) {
        vx *= 0.996; // 空气阻力
        vy += GRAVITY * FRAME;
        px += vx * FRAME;
        py += vy * FRAME;
        if (py > floor - y) {
            py = floor - y;
            if (vy > 55) {
                vy = -vy * 0.45;
                vx *= 0.74;
            } else {
                vy = 0;
                vx *= 0.92; // 落地后贴地滚动，慢慢滑停
            }
        }
    }
    const settled = vy === 0 && py >= floor - y - 1;
    const spin = c.spin0 + c.spinV * (d / 30) * (settled ? 0.35 : 1);
    const sx = Math.cos(spin);
    const fade = d > c.life - 46 ? Math.max(0, (c.life - d) / 46) : 1;
    const popIn = Math.min(1, d / 5); // 出现瞬间快速放大，避免突兀
    const twinkle = settled ? 0.78 + 0.22 * Math.sin(t / 4 + idx * 1.7) : 1;
    return (
        <div style={{ position: "absolute", left: x + px, top: y + py, transform: `translate(-50%, -50%) scaleX(${Math.abs(sx) > 0.28 ? sx : sx >= 0 ? 0.22 : -0.22}) scale(${0.6 + 0.4 * popIn})`, opacity: fade * twinkle * popIn, zIndex: Math.round(c.size) }}>
            <CoinFace size={c.size} sx={sx} />
        </div>
    );
};

// 爆金币：从 (x,y) 向四周迸射、落地散落滚动、停留闪烁后淡出
export const CoinBurst: React.FC<{ t: number; at: number; x?: number; y?: number; n?: number; seed?: number; floor?: number }> = ({ t, at, x = 960, y = 480, n = 42, seed = 1, floor = 1010 }) => {
    if (t < at - 1) return null;
    const coins = makeCoins(n, seed);
    return (
        <>
            {coins.map((c, i) => (
                <CoinSprite key={i} t={t} at={at} x={x} y={y} c={c} floor={floor} idx={i} />
            ))}
            {/* 迸射瞬间的金色闪光点 */}
            {t - at < 10
                ? Array.from({ length: 10 }, (_, i) => {
                      const a = (i / 10) * Math.PI * 2;
                      const r = (t - at) * 42;
                      return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * r, top: y + Math.sin(a) * r, width: 8, height: 8, background: "#FFF3C4", opacity: 1 - (t - at) / 10 }} />;
                  })
                : null}
        </>
    );
};

// 金币雨：全屏持续下落（循环）+ 横向缓摆，用于来财段常驻氛围 / 高潮
export const CoinRain: React.FC<{ t: number; n?: number; seed?: number; speed?: number; x0?: number; w?: number }> = ({ t, n = 34, seed = 3, speed = 1, x0 = 0, w = 1920 }) => {
    const coins = React.useMemo(() => makeCoins(n, seed + 100), [n, seed]);
    return (
        <>
            {coins.map((c, i) => {
                const cycle = 200 + rnd(i, seed + 40) * 130;
                const progress = ((t * speed * (0.6 + rnd(i, seed + 50) * 0.55) + rnd(i, seed + 60) * cycle) % cycle) / cycle;
                const px = x0 + rnd(i, seed + 70) * w + Math.sin(t / 34 + i * 1.3) * 16;
                const py = -60 + progress * 1260;
                const spin = c.spin0 + c.spinV * (t / 30);
                const sx = Math.cos(spin);
                return (
                    <div key={i} style={{ position: "absolute", left: px, top: py, transform: `translate(-50%, -50%) scaleX(${Math.abs(sx) > 0.3 ? sx : 0.22})`, opacity: 0.92, zIndex: Math.round(c.size) }}>
                        <CoinFace size={c.size} sx={sx} />
                    </div>
                );
            })}
        </>
    );
};

// 落地散场后的金币堆（静态层，用于爆金币淡出后不再闪动）
export const CoinPile: React.FC<{ x?: number; n?: number; seed?: number }> = ({ x = 960, n = 16, seed = 9 }) => (
    <>
        {Array.from({ length: n }, (_, i) => {
            const px = x + (rnd(i, seed) - 0.5) * 640;
            const py = 990 + rnd(i, seed + 5) * 20;
            const size = 22 + rnd(i, seed + 7) * 14;
            return <div key={i} style={{ position: "absolute", left: px, top: py, width: size, height: size * 0.94, borderRadius: "50%", background: `radial-gradient(circle at 34% 30%, #FFF3C4 0%, ${GOLD} 45%, ${GOLD_D} 100%)`, border: `2px solid ${GOLD_D}` }} />;
        })}
    </>
);
