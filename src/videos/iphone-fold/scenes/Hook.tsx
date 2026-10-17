import React from "react";
import { pop, prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Grid3D, PhoneModel, Scene3D, Stage, Subs, useK, Vo } from "../kit";

// 01 · 钩子：iPhone 终于折叠了 —— 那它为什么能折？
export const Hook: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const open = prog(t, K(13), 48);
    const titleOut = prog(t, K(7), 12);
    const qIn = pop(t, K(7.2), 12);
    const badge = pop(t, K(20), 12);
    return (
        <Stage t={t}>
            <Scene3D fov={36} pos={[6.9, 2.7, 1.5]}>
                <Grid3D />
                <group position={[1.62, 1.58, 0]} scale={0.86}>
                    <PhoneModel open={open} />
                </group>
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(0), pos: [6.7, 2.9, 2.9], look: [-0.3, 1.35, 0] },
                        { at: K(10), pos: [6.3, 2.6, 4.0], look: [-0.3, 1.35, 0] },
                        { at: K(18), pos: [5.0, 2.5, 6.6], look: [-0.3, 1.35, 0] },
                        { at: K(24), pos: [4.6, 2.5, 7.2], look: [-0.3, 1.35, 0] },
                    ]}
                />
            </Scene3D>

            <div style={{ position: "absolute", left: 120, top: 250, opacity: 1 - titleOut }}>
                <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 26, color: "#F97316", letterSpacing: 6, fontWeight: 700 }}>苹果第一台折叠屏</div>
                <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 100, fontWeight: 900, color: "#121722", letterSpacing: 2, lineHeight: 1.05, marginTop: 18 }}>
                    iPhone Duo
                </div>
                <div style={{ width: 120, height: 6, background: "#F97316", marginTop: 26 }} />
                <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 30, color: "#5A6474", marginTop: 24, letterSpacing: 1 }}>
                    合上 11.3 mm，展开 5.2 mm
                </div>
            </div>

            <div style={{ position: "absolute", left: 120, top: 430, opacity: Math.min(1, qIn * 1.15), transform: `translateY(${(1 - qIn) * 22}px)` }}>
                <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 78, fontWeight: 900, color: "#121722", letterSpacing: 2, lineHeight: 1.22 }}>
                    手机为什么
                    <br />
                    <span style={{ color: "#F97316" }}>能折叠？</span>
                </div>
            </div>

            <div style={{ position: "absolute", left: 120, top: 700, opacity: Math.min(1, badge), transform: `translateY(${(1 - badge) * 16}px)` }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 12, background: "#FFFFFF", border: "1px solid #D7DDE8", borderRadius: 10, padding: "12px 20px", boxShadow: "0 12px 28px #0F172A14" }}>
                    <div style={{ fontFamily: '"Cascadia Code",Consolas,monospace', fontSize: 40, color: "#F97316", fontWeight: 700 }}>+6.1</div>
                    <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 20, color: "#5A6474", letterSpacing: 2 }}>mm 的差值</div>
                </div>
            </div>

            <Vo from={K(0.5)} file="vo-01" />
            <Vo from={K(10)} file="vo-02" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
