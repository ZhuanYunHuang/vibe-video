import React from "react";
import { prog, SceneProps, useT } from "../../../shared";
import { Stage, Subs, Tag, useK, Vo } from "../kit";

// 12 · 收束：折痕还在，只是不再替你指出自己
export const Outro: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const pull = 1 - prog(t, K(320), 46) * 0.16;
    const glow = 0.35 + 0.22 * Math.sin(t / 11);
    const fade = prog(t, K(330), 26);
    return (
        <Stage t={t}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width={520} height={720} viewBox="0 0 520 720" style={{ transform: `scale(${pull})`, opacity: 0.96 }}>
                    <defs>
                        <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" stopColor="#EA580C" stopOpacity="0.55" />
                            <stop offset="0.5" stopColor="#F97316" stopOpacity="0.15" />
                            <stop offset="1" stopColor="#EA580C" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    <rect x="128" y="40" width="264" height="640" rx="26" fill="#090B10" stroke="#2A303C" strokeWidth="2" />
                    <rect x="128" y="40" width="10" height="640" rx="5" fill="url(#rim)" opacity={glow} />
                    <line x1="260" y1="52" x2="260" y2="668" stroke="#F97316" strokeWidth="1.6" opacity={0.55 + glow * 0.4} />
                    <line x1="260" y1="52" x2="260" y2="668" stroke="#EA580C" strokeWidth="6" opacity={glow * 0.18} />
                    <rect x="196" y="74" width="128" height="10" rx="5" fill="#171B22" />
                </svg>
            </div>

            <Tag t={t} from={K(320)} x={760} y={812} text="折痕还在。" size={38} color="#121722" />
            <div style={{ position: "absolute", left: 0, right: 0, top: 862, textAlign: "center", opacity: prog(t, K(328), 26), fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 44, color: "#2A3140", letterSpacing: 2 }}>
                下次合上它，你会想起那 6 毫米吗？
            </div>

            <div style={{ position: "absolute", inset: 0, background: "#F3F6FB", opacity: fade, pointerEvents: "none" }} />
            <Vo from={K(313)} file="vo-23" />
            <Vo from={K(327)} file="vo-24" />
            <Subs t={t} K={K} />
        </Stage>
    );
};
