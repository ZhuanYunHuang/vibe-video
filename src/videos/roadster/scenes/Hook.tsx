import React from "react";
import { pop, prog, SceneProps, useT } from "../../../shared";
import { CameraRig, CarOnRamp, Chip, FONT, Grid3D, HalfPipeRamp, MONO, P, Particles, Scene3D, Sfx, Slam, Stage, VoSub, SvgLayer, Vo, useK } from "../kit";

// 第 1 幕 · 钩子 v2（发布会式 3D 开场）：品牌卡 → 车慢慢爬上垂直弯道 → 倒挂悬停
export const Hook: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);

    const brandOut = prog(t, K(1.2), 14);
    const brandIn = pop(t, K(0), 10);
    const tagIn = prog(t, K(1.6), 14);

    return (
        <Stage t={t}>
            {/* 3D 舞台：半管坡道 + 爬坡倒挂 */}
            <Scene3D fov={40} pos={[7.6, 2.2, 11.8]}>
                <Grid3D />
                <HalfPipeRamp />
                <CarOnRamp t={t} climbFrom={K(1.5)} climbTo={K(11.5)} lightsAt={K(2)} />
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(0), pos: [3.6, 2.2, 11.6], look: [0.8, 1.2, 0] },
                        { at: K(3), pos: [2.4, 3.0, 11.2], look: [2.8, 1.7, 0] },
                        { at: K(6), pos: [0.2, 5.2, 12.8], look: [6.0, 5.7, 0] },
                        { at: K(8), pos: [-0.6, 7.6, 12.6], look: [3.6, 10.2, 0] },
                        { at: K(11.5), pos: [-1.4, 9.8, 12.4], look: [-1.0, 11.9, 0] },
                        { at: K(13.5), pos: [-1.8, 10.2, 11.6], look: [-1.6, 12.1, 0] },
                        { at: K(16), pos: [-2.2, 9.9, 11.2], look: [-2.0, 12.2, 0] },
                    ]}
                />
            </Scene3D>

            {/* 开场品牌卡（0~1.5 拍） */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 28,
                    background: "radial-gradient(60% 60% at 50% 45%, #1C1F27 0%, #14161B 72%)",
                    opacity: (1 - brandOut) * Math.min(1, brandIn * 1.3),
                    transform: `scale(${0.94 + 0.06 * Math.min(1, brandIn)})`,
                }}
            >
                <svg width="108" height="108" viewBox="0 0 100 100">
                    <path d="M22 32 Q50 18 78 32 L78 43 Q50 32 22 43 Z" fill="#E31937" />
                    <path d="M43 41 L57 41 L53.5 88 L46.5 88 Z" fill="#E31937" />
                </svg>
                <div style={{ fontFamily: FONT, fontSize: 148, fontWeight: 900, letterSpacing: 36, color: "#E8EDF6", textShadow: "0 12px 34px #00000099" }}>TESLA</div>
                <div style={{ fontFamily: MONO, fontSize: 34, color: P.accent, letterSpacing: 8 }}>全新 ROADSTER · 发布会演示复刻</div>
            </div>

            {/* 常驻角标 */}
            <div style={{ position: "absolute", right: 96, top: 74, opacity: tagIn, display: "flex", alignItems: "center", gap: 14, border: `1px solid ${P.line}`, borderRadius: 8, padding: "10px 20px", background: "#1C1F27CC" }}>
                <div style={{ width: 10, height: 10, background: "#E31937", borderRadius: 2, transform: "rotate(45deg)" }} />
                <div style={{ fontFamily: MONO, fontSize: 26, color: P.ink, letterSpacing: 3 }}>TESLA 全新 ROADSTER</div>
            </div>

            <Slam t={t} from={K(13)} x={960} y={800} size={100}>吸顶之谜</Slam>
            <Particles t={t} from={K(13)} x={960} y={800} n={16} spread={300} />
            <SvgLayer>
                <Chip x={430} y={800} label="磁铁" strike appear={pop(t, K(14), 12)} />
                <Chip x={1490} y={800} label="胶水" strike appear={pop(t, K(14.6), 12)} />
            </SvgLayer>
            <VoSub t={t} from={K(0.5)} file="vo-01" />
            <Sfx from={K(0)} file="whoosh" volume={0.7} />
            <Sfx from={K(13)} file="whoosh" volume={0.6} />
            <Vo from={K(0.5)} file="vo-01" />
        </Stage>
    );
};
