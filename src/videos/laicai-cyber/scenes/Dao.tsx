import React from "react";
import { pop, prog, SceneProps, useT } from "../../../shared";
import { Kicks, Lanlao, P, PixelDude, Slam, Stage, useSec, useK } from "../kit";

// 第 13 幕 · 道与东来（125.39-133.2s）：人太多 → 两袖清风 → 一阴一阳（太极旋转）→ 紫气东来。
export const Dao: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const crowd = t >= sec(126.1) && t < sec(128.0);
    const clean = t >= sec(128.0) && t < sec(129.6);
    const tai = t >= sec(129.7) && t < sec(131.5);
    const purple = t >= sec(131.6);
    // 太极用 SVG 双色半圆旋转（>500px 也不用 border-radius）
    const spin = ((t - sec(129.7)) / 30) * 90;
    return (
        <Kicks t={t} K={K} beats={[256, 264, 272]}>
            <Stage t={t}>
                {/* 找你做事人太多：周围挤满小人 */}
                {crowd ? (
                    <>
                        {[0, 1, 2, 3, 4, 5].map((i) => {
                            const a = (i / 6) * Math.PI * 2 + 0.4;
                            return <PixelDude key={i} x={960 + Math.cos(a) * 620} y={980 + Math.sin(a) * 120} s={0.8} mood="happy" shirt={`求带${i + 1}`} shirtColor={["#3B4A7A", "#2E351F", "#5A2E4F", "#2E4358", "#4A3A1E", "#33394A"][i]} />;
                        })}
                        <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 46, color: P.ink, opacity: pop(t, sec(126.1), 11) }}>找你做事人太多 · 排队！</div>
                    </>
                ) : null}
                {/* 两袖清风：抖袖 + 清风线条 */}
                {clean ? (
                    <>
                        <Lanlao x={960} y={990} s={1.55} mood="cool" armL={Math.sin(t / 4) * 30 + 90} armR={-Math.sin(t / 4) * 30 + 90} />
                        {Array.from({ length: 6 }, (_, i) => (
                            <div key={i} style={{ position: "absolute", left: 480 + ((i * 191 + t * 9) % 1000), top: 420 + (i % 3) * 60, width: 120, height: 5, background: `${P.accentLight}88`, transform: `rotate(-12deg)`, opacity: 0.7 }} />
                        ))}
                        <Slam t={t} from={sec(128.1)} x={960} y={280} size={72} color={P.accentLight}>
                            事情两袖清风做
                        </Slam>
                    </>
                ) : null}
                {/* 一阴一阳：像素太极 */}
                {tai ? (
                    <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) rotate(${spin}deg)`, opacity: pop(t, sec(129.7), 12) }}>
                        <svg width={420} height={420} viewBox="0 0 200 200">
                            <circle cx={100} cy={100} r={96} fill="#0B0D18" stroke={P.ink} strokeWidth={6} />
                            <path d="M100,4 A96,96 0 0 1 100,196 A48,48 0 0 1 100,100 A48,48 0 0 0 100,4" fill={P.ink} />
                            <circle cx={100} cy={52} r={14} fill={P.ink} />
                            <circle cx={100} cy={148} r={14} fill="#0B0D18" />
                        </svg>
                        <div style={{ position: "absolute", left: -40, right: -40, top: 440, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 48, color: P.ink, whiteSpace: "nowrap" }}>一阴一阳之谓道</div>
                    </div>
                ) : null}
                {/* 紫气东来：紫雾 + 金光（自右向左涌来） */}
                {purple ? (
                    <>
                        {[0, 1, 2, 3].map((i) => (
                            <div key={i} style={{ position: "absolute", right: -300 + (t - sec(131.6)) * (5 + i), top: 80 + i * 230, width: 820, height: 210, background: `linear-gradient(270deg, ${["#8A5CFF", "#B48CFF", "#7A4FE0", "#D9C2FF"][i]}44, transparent)`, opacity: prog(t, sec(131.6) + i * 4, 16) * 0.85 }} />
                        ))}
                        <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center" }}>
                            <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 78, fontWeight: 700, color: "#C9AFFF", opacity: pop(t, sec(131.7), 12), textShadow: "0 0 30px #8A5CFF88" }}>紫气东来</span>
                        </div>
                        <Lanlao x={960} y={990} s={1.5} mood="money" armL={100} armR={100} shades={false} crown jump={Math.abs(Math.sin(t / 8)) * 10} />
                    </>
                ) : null}
                {!crowd && !clean && !tai && !purple ? <Lanlao x={960} y={990} s={1.5} mood="cool" armL={20} armR={10} /> : null}
            </Stage>
        </Kicks>
    );
};
