import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { CameraRig, Chapter, Grid3D, PhoneModel, Scene3D, Stage, Subs, Tag, useK, Vo } from "../kit";

// 08 · 日常：合上 5.4 寸，展开 7.6 寸，半折立起来
const Card: React.FC<{ children: React.ReactNode; opacity: number }> = ({ children, opacity }) => (
    <div style={{ position: "absolute", left: 1290, top: 300, width: 470, background: "#FFFFFF", border: "1px solid #D7DDE8", borderRadius: 18, boxShadow: "0 22px 54px #0F172A18", padding: "26px 28px", opacity, transform: `translateY(${(1 - opacity) * 16}px)` }}>
        {children}
    </div>
);

const Line: React.FC<{ children: React.ReactNode; size?: number; color?: string; top?: number }> = ({ children, size = 22, color = "#5A6474", top = 10 }) => (
    <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: size, color, marginTop: top, letterSpacing: 1, lineHeight: 1.4 }}>{children}</div>
);

export const Daily: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const open = t < K(200) ? 0 : t < K(212) ? prog(t, K(200), 56) : 1 - prog(t, K(214), 40) * 0.55;
    const a = prog(t, K(192), 14);
    const b = prog(t, K(202), 14);
    const c = prog(t, K(214), 14);
    return (
        <Stage t={t}>
            <Scene3D fov={36} pos={[5.4, 2.7, 6.6]}>
                <Grid3D />
                <group position={[0, 1.34, 0]}>
                    <PhoneModel open={open} />
                </group>
                <CameraRig
                    t={t}
                    keys={[
                        { at: K(192), pos: [-6.2, 2.9, 2.6], look: [0, 1.34, 0] },
                        { at: K(203), pos: [-2.8, 2.6, 6.4], look: [0, 1.34, 0] },
                        { at: K(224), pos: [2.2, 2.5, 6.8], look: [0, 1.34, 0] },
                    ]}
                />
            </Scene3D>

            <Chapter t={t} step="05" title="合上 5.4 寸，展开 7.6 寸" />

            {t < K(204) ? (
                <>
                    <Tag t={t} from={K(195)} x={330} y={420} text="外屏 5.4 寸" size={26} color="#2563EB" />
                    <Tag t={t} from={K(196)} x={330} y={462} text="回消息、扫码，不用展开" size={19} color="#5A6474" />
                </>
            ) : null}
            {t >= K(204) && t < K(214) ? (
                <>
                    <Tag t={t} from={K(206)} x={330} y={520} text="内屏 7.6 寸" size={26} color="#2563EB" />
                    <Tag t={t} from={K(207)} x={330} y={562} text="同比例，内容自动放大" size={19} color="#5A6474" />
                </>
            ) : null}
            {t >= K(214) ? (
                <>
                    <Tag t={t} from={K(217)} x={330} y={620} text="半折悬停" size={26} color="#EA580C" />
                    <Tag t={t} from={K(218)} x={330} y={662} text="自己站得住，不用手举着" size={19} color="#5A6474" />
                </>
            ) : null}

            {t < K(202) ? (
                <Card opacity={a}>
                    <Line size={18} color="#8A94A6" top={0}>信息 · 现在</Line>
                    <Line size={28} color="#121722" top={12}>今晚 7 点，老地方见</Line>
                    <Line size={21} top={10}>小林 · 刚刚</Line>
                    <div style={{ marginTop: 18, height: 8, width: 120, borderRadius: 4, background: "#F97316" }} />
                </Card>
            ) : t < K(214) ? (
                <Card opacity={b}>
                    <Line size={18} color="#8A94A6" top={0}>分屏 · 两个 App</Line>
                    {[
                        ["资料", "一边查，一边记"],
                        ["笔记", "不用来回切 App"],
                    ].map(([k, v], i) => (
                        <div key={k} style={{ marginTop: 16, padding: "14px 16px", borderRadius: 12, background: i === 0 ? "#F3F6FB" : "#FFF7ED", border: "1px solid #E6EBF3" }}>
                            <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 24, color: "#121722" }}>{k}</div>
                            <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 20, color: "#5A6474", marginTop: 6 }}>{v}</div>
                        </div>
                    ))}
                </Card>
            ) : (
                <Card opacity={c}>
                    <Line size={18} color="#8A94A6" top={0}>FaceTime · 00:12</Line>
                    <div style={{ marginTop: 14, height: 220, borderRadius: 14, background: "linear-gradient(150deg, #1B3155, #0B1220)", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", left: 24, top: 24, width: 84, height: 84, borderRadius: "50%", background: "#2E4B72" }} />
                        <div style={{ position: "absolute", left: 24, top: 120, width: 160, height: 10, borderRadius: 5, background: "#3E6699" }} />
                        <div style={{ position: "absolute", right: 20, bottom: 20, width: 74, height: 54, borderRadius: 10, background: "#0A0F18", border: "1px solid #33507A" }} />
                    </div>
                    <Line size={18} top={12}>屏下前摄 · 屏幕不开口</Line>
                </Card>
            )}

            <Vo from={K(193)} file="vo-14" />
            <Vo from={K(205)} file="vo-15" />
            <Vo from={K(216)} file="vo-16" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
