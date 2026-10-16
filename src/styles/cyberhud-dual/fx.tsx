import React from "react";
import { useCurrentFrame } from "remotion";
import { useToneNow } from "./theme";
import { useTone } from "./tone";

// 背景层：透视网格 + 四角 HUD 框 + 扫描光带 + 随机数据小块。
// 取色走 useTone()（由场景包装下发），所以换色时刻整张背景跟着一起变。
export const Backdrop: React.FC = () => {
    const P = useTone();
    const f = useCurrentFrame();
    const scanY = ((f * 5) % 1300) - 110;
    const blocks = Array.from({ length: 12 }, (_, i) => ({
        x: (i * 173) % 1780 + 60,
        y: ((i * 271) % 820) + 90,
        w: 40 + (i % 4) * 26,
        on: (Math.floor(f / 6) + i * 5) % 24 < 15,
    }));
    return (
        <>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 30%, ${P.bgAlt} 0%, ${P.bg} 62%)` }} />
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: `repeating-linear-gradient(0deg, ${P.line} 0 1px, transparent 1px 92px), repeating-linear-gradient(90deg, ${P.line} 0 1px, transparent 1px 92px)`,
                    opacity: 0.35,
                }}
            />
            {blocks.map((b, i) => (
                <div key={i} style={{ position: "absolute", left: b.x, top: b.y, width: b.w, height: 5, background: i % 3 === 0 ? P.gold : P.accent, opacity: b.on ? 0.5 : 0.12 }} />
            ))}
            <div style={{ position: "absolute", left: 0, right: 0, top: scanY, height: 90, background: `linear-gradient(180deg, transparent, ${P.accent}14, transparent)` }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: scanY + 88, height: 2, background: `${P.accent}66` }} />
            {/* 四角 HUD 框 */}
            {[
                { left: 28, top: 28, br: true, bb: true },
                { right: 28, top: 28, bl: true, bb: true },
                { left: 28, bottom: 28, br: true, bt: true },
                { right: 28, bottom: 28, bl: true, bt: true },
            ].map((c, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: c.left,
                        right: c.right,
                        top: c.top,
                        bottom: c.bottom,
                        width: 78,
                        height: 78,
                        borderLeft: c.bl ? `2.5px solid ${P.accent}AA` : undefined,
                        borderRight: c.br ? `2.5px solid ${P.accent}AA` : undefined,
                        borderTop: c.bt ? `2.5px solid ${P.accent}AA` : undefined,
                        borderBottom: c.bb ? `2.5px solid ${P.accent}AA` : undefined,
                    }}
                />
            ))}
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.7 }}>
                <text x={44} y={84} fontFamily='"Consolas",monospace' fontSize={20} fill={P.inkSub}>SYS.TRACK // 1920x1080</text>
                <text x={1700} y={84} fontFamily='"Consolas",monospace' fontSize={20} fill={P.inkSub}>REC ●</text>
                <text x={44} y={1022} fontFamily='"Consolas",monospace' fontSize={20} fill={P.inkSub}>CH-02</text>
                <text x={1790} y={1022} fontFamily='"Consolas",monospace' fontSize={20} fill={P.inkSub} textAnchor="end">SIGNAL 98%</text>
            </svg>
        </>
    );
};

// 全片 HUD：括号式分段进度条（顶层组件，按绝对帧取色）
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const P = useToneNow();
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / totalFrames);
    const segs = 28;
    const filled = Math.floor(p * segs);
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    return (
        <>
            <div style={{ position: "absolute", left: 130, bottom: 46, display: "flex", alignItems: "center", gap: 14, fontFamily: '"Consolas",monospace' }}>
                <span style={{ color: P.accent, fontSize: 30 }}>[</span>
                {Array.from({ length: segs }, (_, i) => (
                    <div key={i} style={{ width: 32, height: 12, background: i < filled ? P.accent : i === filled ? (Math.floor(frame / 5) % 2 ? P.accentLight : P.line) : P.line, opacity: i < filled ? 1 : 0.65, boxShadow: i < filled ? `0 0 8px ${P.accent}66` : undefined }} />
                ))}
                <span style={{ color: P.accent, fontSize: 30 }}>]</span>
                <span style={{ color: P.ink, fontSize: 26, letterSpacing: 1 }}>{Math.round(p * 100)}%</span>
            </div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.06, pointerEvents: "none" }} />
        </>
    );
};

// 重拍卡点：glitch 瞬切 + 霓虹洗光
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const P = useTone();
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    const j = k > 0.25 ? (Math.floor(t) % 2 ? 1 : -1) * 9 * k : 0;
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${j}px)` }}>{children}</div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: k * 0.09, pointerEvents: "none" }} />
        </>
    );
};

// 粒子：数据碎片（细长竖条 + 小方块）
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({ t, from, x, y, n = 18, spread = 250, color }) => {
    const P = useTone();
    const base = color ?? P.accent;
    if (t < from || t > from + 38) return null;
    const p = (t - from) / 38;
    const ease = 1 - Math.pow(1 - Math.min(1, (t - from) / 20), 3);
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + (i % 4) * 0.4;
                const r = ease * spread * (0.4 + ((i * 41) % 50) / 100);
                const tall = i % 3 !== 2;
                const c = [base, P.seal, P.gold][i % 3];
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x + Math.cos(a) * r,
                            top: y + Math.sin(a) * r + p * p * 40,
                            width: tall ? 4 : 12,
                            height: tall ? 22 * (1 - p * 0.5) : 12,
                            background: c,
                            opacity: (1 - p) * 0.85,
                            boxShadow: `0 0 10px ${c}66`,
                        }}
                    />
                );
            })}
        </>
    );
};
