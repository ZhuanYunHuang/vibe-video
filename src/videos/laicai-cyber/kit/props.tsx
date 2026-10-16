import React from "react";
import { Img, staticFile } from "remotion";
import { pop } from "../../../shared";
import { FONT, P } from "../../../styles/cyberhud";

// 场景道具：像素手机（原神 logo 屏）/ 麦克风 / 扑克牌。

// 像素手机：硬边 + 阶梯角 + 实心投影；屏幕显示原神 logo（需求⑥）；landscape = 横屏
export const PhoneGenshin: React.FC<{ t: number; from: number; x?: number; y?: number; s?: number; rot?: number; landscape?: boolean }> = ({ t, from, x = 960, y = 540, s = 1, rot = -3, landscape = false }) => {
    const appear = pop(t, from, 11);
    const h = Math.max(0, Math.min(1, (t - from) / 5));
    const w = (landscape ? 660 : 320) * s;
    const hh = (landscape ? 330 : 640) * s;
    const cut = 16 * s;
    const clip = `polygon(${cut}px 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% calc(100% - ${cut}px), calc(100% - ${cut}px) 100%, ${cut}px 100%, 0 calc(100% - ${cut}px), 0 ${cut}px)`;
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y - hh / 2, width: w, height: hh, opacity: Math.min(1, appear * 1.3), transform: `rotate(${rot}deg) scale(${0.8 + 0.2 * appear})` }}>
            <div style={{ position: "absolute", inset: 0, clipPath: clip, background: "#0B0D14", boxShadow: `0 0 60px ${P.accentLight}66` }} />
            <div style={{ position: "absolute", left: 18 * s, right: 18 * s, top: 34 * s, bottom: 42 * s, background: "#FFFFFF", overflow: "hidden" }}>
                <Img src={staticFile("laicai/genshin.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {/* 亮屏扫光 */}
                <div style={{ position: "absolute", top: -40, bottom: -40, left: `${-40 + h * 160}%`, width: 90, background: "linear-gradient(90deg, transparent, #FFFFFF88, transparent)", transform: "skewX(-18deg)", opacity: Math.sin(Math.min(1, h) * Math.PI) }} />
            </div>
            {landscape ? (
                <div style={{ position: "absolute", left: 14 * s, top: "50%", width: 12 * s, height: 90 * s, background: "#2A2F3E", transform: "translateY(-50%)" }} />
            ) : (
                <div style={{ position: "absolute", left: "50%", top: 14 * s, width: 94 * s, height: 12 * s, background: "#2A2F3E", transform: "translateX(-50%)" }} />
            )}
            <div style={{ position: "absolute", left: "50%", bottom: 16 * s, width: 120 * s, height: 10 * s, background: "#2A2F3E", transform: "translateX(-50%)" }} />
        </div>
    );
};

// 像素麦克风（递麦交接用）
export const Mic: React.FC<{ x: number; y: number; rot?: number; glow?: number }> = ({ x, y, rot = 0, glow = 0 }) => (
    <div style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)`, filter: glow > 0 ? `drop-shadow(0 0 ${glow}px ${P.gold})` : undefined }}>
        <svg width={90} height={150} viewBox="0 0 90 150">
            <rect x={33} y={64} width={24} height={70} fill="#3A4152" />
            <rect x={27} y={12} width={36} height={58} fill="#E8ECF4" />
            {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={31} y={20 + i * 12} width={28} height={4} fill="#9AA3B5" />
            ))}
            <rect x={39} y={2} width={12} height={12} fill="#3A4152" />
            <rect x={27} y={128} width={36} height={8} fill="#3A4152" />
        </svg>
    </div>
);

// 像素扑克牌（河牌 / 三条九 / 六合彩用）
export const PokerCard: React.FC<{ x: number; y: number; rot?: number; label: string; red?: boolean; faceDown?: boolean; flip?: number; s?: number }> = ({ x, y, rot = 0, label, red = false, faceDown = false, flip = 1, s = 1 }) => {
    const w = 110 * s;
    const h = 156 * s;
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg) scaleX(${flip})`, background: faceDown ? "#1E2C48" : "#FFFFFF", border: `3px solid ${P.ink}`, boxShadow: "6px 6px 0 #00000055", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {faceDown ? (
                <div style={{ width: w - 18, height: h - 18, border: `2px dashed ${P.accentLight}66`, background: "repeating-linear-gradient(45deg, #24345C 0 8px, #1E2C48 8px 16px)" }} />
            ) : (
                <span style={{ fontFamily: FONT, fontSize: 52 * s, fontWeight: 700, color: red ? "#E63B2E" : P.ink }}>{label}</span>
            )}
        </div>
    );
};
