import React from "react";
import { pop, prog, SceneProps, ShakeWrapper, useT } from "../../../shared";
import { CoinRain, Kicks, Lanlao, P, PixelDude, Slam, Stage, useSec, useK } from "../kit";

// 第 11 幕 · 利滚利（101.98-109.78s）：来财 chant 收尾 → 106.3 钱生钱流水线 → 107.8 八方箭头汇聚（好运八方来）。
export const Money: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const flow = t >= sec(106.3);
    const arrows = t >= sec(107.8);
    const mult = [1, 2, 4, 8, 16];
    // 八方箭头：8 个方向汇聚到中心
    const dirs = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
    return (
        <Kicks t={t} K={K} beats={[216, 224]}>
            <ShakeWrapper t={t} ats={[sec(102.4), sec(104.4)]} amp={13} decay={10}>
            <Stage t={t}>
                {t < sec(106.0) ? <CoinRain t={t - sec(98.4)} n={30} seed={31} speed={1.1} /> : null}
                {/* 101.98 卡点: chant 收尾大字 */}
                {t < sec(103.4) ? (
                    <Slam t={t} from={K(208)} x={960} y={430} size={190} color={P.gold}>
                        来财 来
                    </Slam>
                ) : null}
                {/* 钱生钱流水线 */}
                {flow ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 430, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
                        {mult.map((m, i) => {
                            const d = t - sec(106.3) - i * 9;
                            if (d < 0) return null;
                            const s = pop(t, sec(106.3) + i * 9, 10);
                            return (
                                <React.Fragment key={m}>
                                    <div style={{ background: "#2E2A18", border: `4px solid ${P.gold}`, padding: "12px 22px", opacity: Math.min(1, s * 1.3), transform: `scale(${s})` }}>
                                        <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 46, color: P.gold }}>¥{m}</span>
                                    </div>
                                    {i < mult.length - 1 ? <span style={{ color: P.accent, fontSize: 40, opacity: prog(t, sec(106.3) + i * 9 + 4, 8) }}>→</span> : null}
                                </React.Fragment>
                            );
                        })}
                        <div style={{ position: "absolute", top: 110, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 38, color: P.accentLight, opacity: prog(t, sec(106.5), 14) }}>宗旨利滚利</div>
                    </div>
                ) : null}
                {/* 八方来 */}
                {arrows ? (
                    <>
                        {dirs.map((a, i) => {
                            const r = 900 - 520 * prog(t, sec(107.8) + i * 2.5, 22);
                            return <div key={i} style={{ position: "absolute", left: 960 + Math.cos(a) * r, top: 540 + Math.sin(a) * r * 0.72, width: 26, height: 26, background: i % 2 ? P.accent : P.gold, opacity: 0.95, transform: `rotate(${(a * 180) / Math.PI + 45}deg)` }} />;
                        })}
                        <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center" }}>
                            <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 64, fontWeight: 700, color: P.gold, opacity: pop(t, sec(107.9), 11), textShadow: `0 0 24px ${P.gold}66` }}>八方 · 来财</span>
                        </div>
                    </>
                ) : null}
                <Lanlao x={520} y={990} s={1.35} mood={arrows ? "money" : "cool"} armL={arrows ? 100 : 20} armR={arrows ? 100 : 10} shades={!arrows} />
                <PixelDude x={1420} y={990} s={1.2} mood="happy" armL={80} armR={80} shirt="天选之子" />
            </Stage>
            </ShakeWrapper>
        </Kicks>
    );
};
