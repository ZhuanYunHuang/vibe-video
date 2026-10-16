import React from "react";
import { pop } from "../../../shared";
import { FONT, MONO, useTone } from "../../../styles/cyberhud-dual";
import { ScanBox } from "./hudbits";

// 本 MV 的标识与道具素材：蓝牌特斯拉、直播礼物图标、平台示意标识。
// 全部矢量 HUD 描边、t/from 纯函数、取色走 useTone()。
// 平台标识一律为「示意」：不使用任何官方图形的轮廓、比例或配色组合。

/* ============================ 蓝牌特斯拉 ============================ */

// 牌照对比行（实际 / 应为）
const PlateRow: React.FC<{ label: string; plate: string; text: string; ok: boolean }> = ({ label, plate, text, ok }) => {
    const P = useTone();
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontFamily: MONO, fontSize: 18, color: P.inkSub, width: 44 }}>{label}</span>
            <span style={{ width: 150, height: 40, background: plate, boxShadow: "inset 0 0 0 2.5px #EEF5FF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 17, color: "#EEF5FF", letterSpacing: 1 }}>{text}</span>
            <span style={{ fontFamily: MONO, fontSize: 24, fontWeight: 700, color: ok ? "#2FA84F" : P.seal }}>{ok ? "✔" : "✕"}</span>
        </div>
    );
};

// Model 3/Y **正面视角**：无进气格栅的光滑前脸、左右细长上挑的 LED 大灯、下进气口、两侧后视镜。
// 车牌挂在**前保险杠正中**（侧视图把车牌贴在车身上是不对的）。
// 歌词的笑点是「假」：蓝牌本是燃油车牌照，挂在纯电车上 → 扫描直接判 FAKE。
export const TeslaFake: React.FC<{ t: number; from: number; x: number; y: number; judgeAt: number }> = ({ t, from, x, y, judgeAt }) => {
    const P = useTone();
    const s = pop(t, from, 12);
    const shake = t - from < 16 ? Math.sin(t * 3.1) * 4 : 0;
    const judged = t >= judgeAt;
    const glitch = judged && t - judgeAt < 12 ? (t % 2 ? 3 : -3) : 0;

    return (
        <div style={{ position: "absolute", left: x, top: y, width: 760, height: 600, transform: `translate(-50%,-50%) scale(${s}) translateX(${shake + glitch}px)`, opacity: s }}>
            <svg width={760} height={600} viewBox="0 0 760 600" style={{ position: "absolute", inset: 0 }}>
                {/* 地面 + 前轮 */}
                <line x1="40" y1="538" x2="720" y2="538" stroke={P.line} strokeWidth="2" />
                {[140, 620].map((cx, i) => (
                    <g key={i}>
                        <ellipse cx={cx} cy={498} rx={70} ry={34} fill={P.bg} stroke={P.inkSub} strokeWidth="4" />
                        <ellipse cx={cx} cy={498} rx={42} ry={19} fill="none" stroke={P.inkSub} strokeWidth="2" opacity={0.6} />
                    </g>
                ))}
                {/* 车身正面：车顶 → 挡风 → 肩线 → 保险杠（左右对称） */}
                <path d="M 302 58 L 458 58 L 568 194 L 642 300 L 664 470 L 96 470 L 118 300 L 192 194 Z" fill={P.card} stroke={P.inkSub} strokeWidth="3" />
                {/* 车顶 */}
                <rect x={306} y={48} width={148} height={16} rx={7} fill={P.card} stroke={P.inkSub} strokeWidth="3" />
                {/* 挡风玻璃 */}
                <path d="M 316 78 L 444 78 L 534 190 L 226 190 Z" fill={`${P.accent}1E`} stroke={P.accent} strokeWidth="2" />
                {/* 无格栅的光滑前脸：只留一道分缝 */}
                <path d="M 128 302 L 632 302" stroke={P.inkSub} strokeWidth="2" opacity={0.5} />
                {/* 细长上挑的 LED 大灯 */}
                <path d="M 134 330 L 288 306 L 290 342 L 138 356 Z" fill={`${P.accent}2A`} stroke={P.accent} strokeWidth="2.5" />
                <path d="M 626 330 L 472 306 L 470 342 L 622 356 Z" fill={`${P.accent}2A`} stroke={P.accent} strokeWidth="2.5" />
                {/* 下进气口 */}
                <rect x={206} y={452} width={348} height={34} rx={6} fill={P.bg} stroke={P.inkSub} strokeWidth="2.5" />
                {Array.from({ length: 12 }, (_, i) => (
                    <line key={i} x1={222 + i * 28} y1={457} x2={222 + i * 28} y2={481} stroke={P.inkSub} strokeWidth="2" opacity={0.45} />
                ))}
                {/* 两侧后视镜 */}
                <path d="M 118 210 L 178 200 L 186 230 L 124 242 Z" fill={P.card} stroke={P.inkSub} strokeWidth="2.5" />
                <path d="M 642 210 L 582 200 L 574 230 L 636 242 Z" fill={P.card} stroke={P.inkSub} strokeWidth="2.5" />
                {/* 车标位（判假后 TESLA → T3SLA） */}
                <text x={380} y={292} fill={judged ? P.seal : P.inkSub} fontSize="22" fontWeight="700" letterSpacing="5" textAnchor="middle" fontFamily='"Consolas",monospace'>
                    {judged ? "T3SLA" : "TESLA"}
                </text>
                {/* 车牌 → 校验面板 的指示线 */}
                <path d="M 507 398 L 686 398" stroke={P.seal} strokeWidth="2" strokeDasharray="6 6" opacity={judged ? 1 : 0} />
            </svg>

            {/* 蓝牌：挂在前保险杠正中 */}
            <div style={{ position: "absolute", left: 265, top: 366, width: 230, height: 64, background: "#1B4FB5", boxShadow: "inset 0 0 0 3px #DDE7FF", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 27, color: "#DDE7FF", letterSpacing: 3 }}>
                粤B·00000
            </div>
            <ScanBox t={t} from={from + 14} x={253} y={354} w={254} h={88} />

            {/* 判假：实际蓝牌 vs 应为绿牌 */}
            <div style={{ position: "absolute", left: 700, top: 296, width: 430, padding: "18px 22px", background: `${P.bg}EE`, boxShadow: `inset 0 0 0 2px ${P.seal}`, opacity: pop(t, judgeAt + 4, 12), clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%)" }}>
                <div style={{ fontFamily: MONO, fontSize: 18, color: P.seal, letterSpacing: 3, marginBottom: 14 }}>PLATE CHECK // 牌照校验</div>
                <PlateRow label="实际" plate="#1B4FB5" text="蓝牌 · 燃油" ok={false} />
                <PlateRow label="应为" plate="#2FA84F" text="绿牌 · 新能源" ok />
                <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 17, color: P.inkSub, letterSpacing: 1 }}>纯电车不可能挂蓝牌 → 判定山寨</div>
            </div>

            {/* 判假结论 */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -54, textAlign: "center", opacity: pop(t, judgeAt + 6, 12) }}>
                <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 700, color: P.seal, letterSpacing: 3, textShadow: `0 0 20px ${P.seal}88` }}>{judged ? "VERDICT: FAKE" : "SCANNING ..."}</div>
                <div style={{ fontFamily: MONO, fontSize: 18, color: P.inkSub, letterSpacing: 2, marginTop: 4 }}>车型＝新能源 · 牌照＝燃油 · 判定山寨</div>
            </div>
        </div>
    );
};

/* ============================== 礼物图标 ============================== */

const GiftFrame: React.FC<{ t: number; size: number; rot?: number; opacity?: number; children: React.ReactNode }> = ({ t, size, rot = 0, opacity = 1, children }) => (
    <div style={{ width: size, height: size, transform: `rotate(${rot + Math.sin(t / 11) * 6}deg)`, opacity, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children}
    </div>
);

// 火箭
export const RocketGift: React.FC<{ t: number; size?: number; color?: string }> = ({ t, size = 84, color }) => {
    const P = useTone();
    const c = color ?? P.accent;
    const flame = 10 + Math.abs(Math.sin(t / 3)) * 16;
    return (
        <GiftFrame t={t} size={size}>
            <svg width={size} height={size} viewBox="0 0 60 60">
                <path d="M30 4 C38 12 42 22 42 32 L18 32 C18 22 22 12 30 4 Z" fill={`${c}22`} stroke={c} strokeWidth="2.5" />
                <circle cx="30" cy="22" r="5.5" fill={P.bg} stroke={c} strokeWidth="2" />
                <path d="M18 28 L6 40 L18 42 Z" fill={`${c}22`} stroke={c} strokeWidth="2" />
                <path d="M42 28 L54 40 L42 42 Z" fill={`${c}22`} stroke={c} strokeWidth="2" />
                <path d="M24 32 L24 44 L36 44 L36 32" fill={`${c}22`} stroke={c} strokeWidth="2" />
                <path d={`M26 45 L30 ${45 + flame} L34 45 Z`} fill={P.gold} />
            </svg>
        </GiftFrame>
    );
};

// 跑车
export const SupercarGift: React.FC<{ t: number; size?: number; color?: string }> = ({ t, size = 96, color }) => {
    const P = useTone();
    const c = color ?? P.gold;
    const flame = 8 + Math.abs(Math.sin(t / 4)) * 12;
    return (
        <GiftFrame t={t} size={size}>
            <svg width={size} height={size * 0.7} viewBox="0 0 80 56">
                <path d="M6 40 L10 30 C14 24 24 20 34 19 L44 12 C50 9 58 9 63 12 L70 20 C74 24 76 30 76 36 L76 42 L6 42 Z" fill={`${c}1E`} stroke={c} strokeWidth="2.5" />
                <path d="M34 20 L42 13 L58 13 L66 21 Z" fill={`${c}33`} stroke={c} strokeWidth="1.6" />
                <circle cx="22" cy="42" r="9" fill={P.bg} stroke={c} strokeWidth="2.5" />
                <circle cx="60" cy="42" r="9" fill={P.bg} stroke={c} strokeWidth="2.5" />
                <path d="M70 24 L78 22 L78 30 L70 28 Z" fill={c} opacity={0.9} />
                <path d={`M4 34 L${4 - flame} 32 L4 38 Z`} fill={P.seal} />
            </svg>
        </GiftFrame>
    );
};

// 嘉年华（旋转木马）
export const CarnivalGift: React.FC<{ t: number; size?: number; color?: string }> = ({ t, size = 110, color }) => {
    const P = useTone();
    const c = color ?? P.seal;
    const spin = t / 8;
    return (
        <GiftFrame t={t} size={size}>
            <svg width={size} height={size} viewBox="0 0 80 80">
                <path d="M12 40 C12 26 25 16 40 16 C55 16 68 26 68 40 Z" fill={`${c}1E`} stroke={c} strokeWidth="2.5" />
                {Array.from({ length: 6 }, (_, i) => {
                    const a = (i / 6) * Math.PI + Math.PI;
                    return <circle key={i} cx={40 + Math.cos(a) * 26} cy={40 + Math.sin(a) * 22} r="3" fill={c} opacity={0.8} />;
                })}
                <line x1="40" y1="10" x2="40" y2="16" stroke={c} strokeWidth="2.5" />
                <circle cx="40" cy="8" r="4" fill={P.gold} />
                {[-22, -8, 8, 22].map((dx, i) => (
                    <g key={i}>
                        <line x1={40 + dx} y1="40" x2={40 + dx} y2="62" stroke={c} strokeWidth="2" />
                        <g transform={`translate(${40 + dx} ${44 + Math.abs(Math.sin(t / 12 + i)) * -6})`}>
                            <path d="M-7 8 L-4 0 L4 0 L7 8 Z" fill={`${c}44`} stroke={c} strokeWidth="1.6" />
                            <circle cx="-5" cy="-4" r="2.2" fill={c} />
                            <path d="M-6 14 L0 8 L6 14" fill="none" stroke={c} strokeWidth="1.6" />
                        </g>
                    </g>
                ))}
                <path d="M10 62 L70 62 L74 70 L6 70 Z" fill={`${c}22`} stroke={c} strokeWidth="2.5" />
                <line x1="40" y1="40" x2={40 + Math.cos(spin) * 18} y2={40 + Math.sin(spin) * 14} stroke={P.gold} strokeWidth="2" opacity={0.7} />
            </svg>
        </GiftFrame>
    );
};

// 小心心
export const HeartGift: React.FC<{ t: number; size?: number; color?: string }> = ({ t, size = 62, color }) => {
    const P = useTone();
    const c = color ?? P.accentLight;
    return (
        <GiftFrame t={t} size={size}>
            <svg width={size} height={size} viewBox="0 0 40 40">
                <path d="M20 34 C6 25 3 16 8 10 C12 6 18 7 20 12 C22 7 28 6 32 10 C37 16 34 25 20 34 Z" fill={`${c}33`} stroke={c} strokeWidth="2.5" />
            </svg>
        </GiftFrame>
    );
};

// 礼盒
export const BoxGift: React.FC<{ t: number; size?: number; color?: string }> = ({ t, size = 74, color }) => {
    const P = useTone();
    const c = color ?? P.gold;
    return (
        <GiftFrame t={t} size={size}>
            <svg width={size} height={size} viewBox="0 0 48 48">
                <rect x="8" y="20" width="32" height="22" fill={`${c}22`} stroke={c} strokeWidth="2.5" />
                <rect x="5" y="13" width="38" height="8" fill={`${c}33`} stroke={c} strokeWidth="2.5" />
                <line x1="24" y1="13" x2="24" y2="42" stroke={c} strokeWidth="2.5" />
                <path d="M24 13 C18 4 8 6 12 12 M24 13 C30 4 40 6 36 12" fill="none" stroke={P.seal} strokeWidth="2.5" />
            </svg>
        </GiftFrame>
    );
};

export const GIFTS = ["rocket", "supercar", "carnival", "heart", "box"] as const;
export type GiftKind = (typeof GIFTS)[number];

// 统一入口：kind + size + 可选 color（不传就跟随当前调色板）
export const GiftIcon: React.FC<{ t: number; kind: GiftKind; size?: number; color?: string }> = ({ t, kind, size, color }) => {
    switch (kind) {
        case "rocket":
            return <RocketGift t={t} size={size ?? 84} color={color} />;
        case "supercar":
            return <SupercarGift t={t} size={size ?? 96} color={color} />;
        case "carnival":
            return <CarnivalGift t={t} size={size ?? 110} color={color} />;
        case "heart":
            return <HeartGift t={t} size={size ?? 62} color={color} />;
        default:
            return <BoxGift t={t} size={size ?? 74} color={color} />;
    }
};

export const GIFT_NAME: Record<GiftKind, string> = { rocket: "火箭", supercar: "跑车", carnival: "嘉年华", heart: "小心心", box: "礼盒" };

/* ============================ 平台示意标识 ============================ */

// 字节（示意）：音符形 + 青红三层错位叠印（抖音那种造型语言），配汉字名牌。
// 音符造型自绘、不复刻官方矢量路径；保留「示意标识」小字。
export const ByteMark: React.FC<{ t: number; from: number; x: number; y: number; size?: number }> = ({ t, from, x, y, size = 96 }) => {
    const P = useTone();
    const s = pop(t, from, 12);
    const CYAN = "#25F4EE";
    const RED = "#FE2C55";
    const WHITE = "#EAFDFF";
    // 同一组音符图形（圆头 + 粗符干 + 顶部短尾钩）画三遍做错位叠印
    const note = (fill: string, dx: number, dy: number) => (
        <g transform={`translate(${dx} ${dy})`}>
            <ellipse cx="34" cy="68" rx="23" ry="18" fill={fill} />
            <rect x="50" y="12" width="20" height="60" rx="9" fill={fill} />
            <path d="M 64 12 L 90 21 L 90 42 L 64 33 Z" fill={fill} />
        </g>
    );
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, opacity: s, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ position: "relative", width: size, height: size, background: "#07080C", boxShadow: `inset 0 0 0 2px ${P.inkSub}`, clipPath: "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)", overflow: "hidden" }}>
                <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
                    {note(RED, 8, 8)}
                    {note(CYAN, 2, 2)}
                    {note(WHITE, -3, -3)}
                </svg>
            </div>
            <div>
                <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: P.ink, letterSpacing: 6 }}>字节</div>
                <div style={{ fontFamily: MONO, fontSize: 16, color: P.inkSub, letterSpacing: 2, marginTop: 4 }}>BYTE · 内容平台（示意标识）</div>
            </div>
        </div>
    );
};

// 新浪（示意）：同心弧组成的抽象光圈/眼形 + 一道横穿波浪（眼睛 + 新浪）。
// 刻意避开官方眼形轮廓的比例。
export const SinaMark: React.FC<{ t: number; from: number; x: number; y: number; size?: number }> = ({ t, from, x, y, size = 96 }) => {
    const P = useTone();
    const s = pop(t, from, 12);
    const cx = size * 0.75;
    const cy = size * 0.5;
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s})`, opacity: s, display: "flex", alignItems: "center", gap: 16 }}>
            <svg width={size * 1.5} height={size} style={{ flexShrink: 0 }}>
                {/* 同心弧光圈（留一道缺口，像光圈而非闭合眼形） */}
                {[40, 30, 21].map((r, i) => (
                    <path key={i} d={`M ${cx - r * 0.96} ${cy} A ${r} ${r * 0.66} 0 1 1 ${cx + r * 0.96} ${cy}`} fill="none" stroke={i === 1 ? P.accent : P.inkSub} strokeWidth={i === 1 ? 3 : 2} strokeLinecap="round" opacity={1 - i * 0.22} />
                ))}
                <circle cx={cx} cy={cy} r={9} fill={P.accent} opacity={0.9} />
                {/* 横穿波浪 */}
                <path d={`M 2 ${cy} Q ${size * 0.25} ${cy - size * 0.22} ${size * 0.5} ${cy} T ${size * 0.98} ${cy}`} fill="none" stroke={P.accentLight} strokeWidth="2.5" opacity={0.85} />
                <path d={`M 2 ${cy + size * 0.12} Q ${size * 0.25} ${cy - size * 0.1} ${size * 0.5} ${cy + size * 0.12} T ${size * 0.98} ${cy + size * 0.12}`} fill="none" stroke={P.accentLight} strokeWidth="1.6" opacity={0.45} />
            </svg>
            <div>
                <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 700, color: P.ink, letterSpacing: 6 }}>新浪</div>
                <div style={{ fontFamily: MONO, fontSize: 16, color: P.inkSub, letterSpacing: 2, marginTop: 4 }}>SINA · 草原（示意标识）</div>
            </div>
        </div>
    );
};

// 判假结论条（复用）
export const FakeTag: React.FC<{ t: number; from: number; x: number; y: number; text: string }> = ({ t, from, x, y, text }) => {
    const P = useTone();
    const s = pop(t, from, 10);
    return (
        <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(-7deg) scale(${s})`, opacity: Math.min(1, s * 1.3), boxShadow: `inset 0 0 0 3px ${P.seal}`, color: P.seal, fontFamily: FONT, fontSize: 30, fontWeight: 700, letterSpacing: 5, padding: "6px 20px", textShadow: `0 0 14px ${P.seal}66` }}>
            {text}
        </div>
    );
};
