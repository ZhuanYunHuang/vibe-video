import React from "react";
import { useCurrentFrame } from "remotion";
import { FPS, rnd } from "../../shared";
import { Fonts } from "./Fonts";
import { CutFlash, GhostLine, Grain, Scanlines, Vignette } from "./frame";
import { P } from "./theme";

// 歌词 MV 的画面层：颗粒、扫描线、暗角、巨字残影；HUD 只有一条 1px 进度线。

// 背景：近黑底 + 深红十字光 + 巨字残影，无四角 HUD 框
export const Backdrop: React.FC = () => {
    const f = useCurrentFrame();
    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: P.bg }}>
            <Fonts />
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 72% 62% at 50% 42%, ${P.accent}2E, transparent 74%)` }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, ${P.accent}1F, transparent 46%)` }} />
            <GhostLine t={f} text="韵" size={540} x={1160} y={520} rot={-6} opacity={0.06} />
            <Scanlines t={f} opacity={0.14} />
            <Grain t={f} opacity={0.13} />
            <Vignette strength={1} />
        </div>
    );
};

// HUD：底部 1px 进度线 + 句号 + 时间码，不做百分比条
export const Hud: React.FC<{ cutFrames: number[]; totalFrames: number }> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const p = Math.min(1, frame / Math.max(1, totalFrames));
    const flash = cutFrames.reduce((m, f) => Math.max(m, frame >= f ? Math.exp(-(frame - f) / 5) : 0), 0);
    const lineNo = cutFrames.filter((f) => frame >= f).length + 1;
    return (
        <>
            <div style={{ position: "absolute", left: 60, right: 60, bottom: 46, height: 1, background: `${P.ink}22` }}>
                <div style={{ width: `${p * 100}%`, height: "100%", background: P.accent }} />
            </div>
            <div style={{ position: "absolute", left: 60, bottom: 58, fontFamily: '"Consolas",monospace', fontSize: 16, letterSpacing: 4, color: P.inkSub }}>
                {`L.${String(lineNo).padStart(2, "0")}`}
            </div>
            <div style={{ position: "absolute", right: 60, bottom: 58, fontFamily: '"Consolas",monospace', fontSize: 16, letterSpacing: 3, color: P.inkSub }}>
                {`${(frame / FPS).toFixed(1)}s / ${(totalFrames / FPS).toFixed(1)}s`}
            </div>
            <div style={{ position: "absolute", inset: 0, background: P.accent, opacity: flash * 0.035, pointerEvents: "none" }} />
        </>
    );
};

// 重拍：只位移内容，并在每个重拍点补 2 帧纸白闪
export const Kicks: React.FC<{ t: number; K: (b: number) => number; beats: number[]; children: React.ReactNode }> = ({ t, K, beats, children }) => {
    const k = beats.reduce((m, b) => Math.max(m, t >= K(b) ? Math.exp(-(t - K(b)) / 6) : 0), 0);
    const j = k > 0.2 ? (Math.floor(t) % 2 ? 1 : -1) * 10 * k : 0;
    return (
        <>
            <div style={{ position: "absolute", inset: 0, transform: `translateX(${j}px)` }}>{children}</div>
            {beats.map((b, i) => (
                <CutFlash key={i} t={t} at={K(b)} color={P.extra?.paper ?? "#F2EDE3"} frames={2} />
            ))}
        </>
    );
};

// 粒子：低密度尘埃，向上飘散
export const Particles: React.FC<{ t: number; from: number; x: number; y: number; n?: number; spread?: number; color?: string }> = ({
    t,
    from,
    x,
    y,
    n = 14,
    spread = 220,
    color = P.ink,
}) => {
    const d = t - from;
    if (d < 0 || d > 54) return null;
    const q = d / 54;
    return (
        <>
            {Array.from({ length: n }, (_, i) => {
                const a = (i / n) * Math.PI * 2 + rnd(i, 3) * 0.6;
                const r = 20 + spread * (0.4 + rnd(i, 7)) * q;
                const s = 2 + rnd(i, 11) * 2;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x + Math.cos(a) * r,
                            top: y + Math.sin(a) * r - d * 1.2,
                            width: s,
                            height: s,
                            borderRadius: "50%",
                            background: color,
                            opacity: (1 - q) * 0.5,
                        }}
                    />
                );
            })}
        </>
    );
};
