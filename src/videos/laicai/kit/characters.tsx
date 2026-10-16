import React from "react";
import { P } from "../../../styles/pixel";

// 像素版两位主角（同一 200×400 骨架：脚底中心 x/y、中轴 100、脚底 y=400，便于同框与复用场景写法）。
// PixelDude = 天选之子移植版；Lanlao = 揽佬（平头 + 方形墨镜 + 印花 Polo + 手串 + 金耳环）。

const SKIN = "#F2CFA6";
const SKIN_D = "#D9AE80";
const HAIR = "#15131A";
const SHOE = "#E8ECF4";
const JEANS = "#3D5BD9";
const GOLD = "#FFD23F";

export type DudeMood = "cool" | "smug" | "happy" | "shock" | "sad" | "angry" | "sleep" | "laugh";

type BaseProps = {
    x: number; // 脚底中心 x
    y: number; // 脚底 y
    s?: number; // 缩放（1 ≈ 400px 高）
    armL?: number; // 左臂角度：0 下垂，90 平举，160 举过头
    armR?: number;
    jump?: number; // 离地 px
    squat?: number; // 0~1 下蹲
    tilt?: number;
    look?: number; // -1~1
    flip?: boolean;
    dim?: number;
    opacity?: number;
    back?: boolean;
};

// 像素方块五官：按 mood 返回 [眼] [嘴] 两组像素块（坐标相对头部中心）
const dudeFace = (mood: DudeMood, hx: number, hy: number, lx: number) => {
    const e = (dx: number, dy: number, w: number, h: number, c = "#111") => ({ x: hx + dx, y: hy + dy, w, h, c });
    const m = (dx: number, dy: number, w: number, h: number, c = "#3A0D14") => ({ x: hx + dx, y: hy + dy, w, h, c });
    switch (mood) {
        case "shock":
            return { eyes: [e(-26, -8, 18, 18, "#FFFFFF"), e(10, -8, 18, 18, "#FFFFFF"), e(-22 + lx, -4, 8, 8), e(14 + lx, -4, 8, 8)], mouth: [m(-8, 20, 18, 20)] };
        case "happy":
        case "laugh":
            return { eyes: [e(-30, -6, 12, 6), e(-14, -10, 12, 6), e(6, -10, 12, 6), e(20, -6, 12, 6)], mouth: [m(-14, 18, 30, mood === "laugh" ? 22 : 12)] };
        case "sleep":
            return { eyes: [e(-30, -2, 22, 5), e(8, -2, 22, 5)], mouth: [m(-4, 22, 10, 7)] };
        case "sad":
            return { eyes: [e(-26 + lx, -6, 12, 14), e(14 + lx, -6, 12, 14)], mouth: [m(-12, 26, 24, 5)], extra: [e(24, 10, 6, 14, "#4CC2FF")] };
        case "angry":
            return { eyes: [e(-26 + lx, -4, 12, 12), e(14 + lx, -4, 12, 12)], mouth: [m(-14, 22, 28, 8)], extra: [e(-30, -18, 20, 5), e(10, -18, 20, 5)] };
        case "smug":
            return { eyes: [e(-26 + lx, -2, 14, 6), e(12 + lx, -2, 14, 6)], mouth: [m(-12, 22, 10, 5), m(0, 24, 10, 5), m(10, 20, 6, 5)] };
        default:
            return { eyes: [e(-26 + lx, -4, 14, 12), e(12 + lx, -4, 14, 12)], mouth: [m(-12, 22, 26, 5)] };
    }
};

// 天选之子（像素版）：方块头 + 锯齿刘海 + 像素银链 + 像素绿 T 恤"天选之子"
export const PixelDude: React.FC<BaseProps & { mood?: DudeMood; shirt?: string; shirtColor?: string; glasses?: boolean; nerd?: boolean }> = ({ x, y, s = 1, mood = "cool", armL = 0, armR = 0, jump = 0, squat = 0, tilt = 0, look = 0, flip = false, dim = 0, opacity = 1, back = false, shirt = "天选之子", shirtColor = "#2FA95E", glasses = false, nerd = false }) => {
    const legH = 120 * (1 - squat * 0.55);
    const top = 400 - legH - 120;
    const headY = top - 58;
    const lx = Math.round(look * 8);
    const hx = 100;
    const face = dudeFace(mood, hx, headY, lx);
    const arm = (side: -1 | 1, deg: number) => {
        const ax = 100 + side * 46;
        return (
            <g transform={`rotate(${side * -deg} ${ax} ${top + 14})`}>
                <rect x={ax - 12} y={top + 2} width={24} height={96} fill={shirtColor} />
                <rect x={ax - 10} y={top + 58} width={20} height={42} fill={SKIN} />
                <rect x={ax - 14} y={top + 96} width={28} height={28} fill={SKIN} />
            </g>
        );
    };
    return (
        <div style={{ position: "absolute", left: x - 100 * s, top: y - 400 * s - jump, width: 200 * s, height: 400 * s, opacity, transform: `rotate(${tilt}deg) scaleX(${flip ? -1 : 1})`, transformOrigin: "50% 100%", filter: dim > 0 ? `grayscale(${dim}) brightness(${1 - dim * 0.35})` : undefined }}>
            <svg viewBox="0 0 200 400" width={200 * s} height={400 * s} style={{ overflow: "visible", display: "block" }}>
                <ellipse cx={100} cy={402 + jump / s} rx={70} ry={10} fill="#000" opacity={0.35 * Math.max(0.2, 1 - jump / 300)} />
                {/* 腿 + 鞋 */}
                <rect x={68} y={400 - legH} width={28} height={legH} fill={JEANS} />
                <rect x={104} y={400 - legH} width={28} height={legH} fill={JEANS} />
                <rect x={58} y={388} width={44} height={14} fill={SHOE} />
                <rect x={98} y={388} width={44} height={14} fill={SHOE} />
                {arm(-1, armL)}
                {arm(1, armR)}
                {/* 躯干 */}
                <rect x={54} y={top} width={92} height={128} fill={shirtColor} />
                <rect x={54} y={top} width={92} height={8} fill="#00000033" />
                {!back && shirt ? (
                    <text x={100} y={top + 86} textAnchor="middle" fontSize={24} fill="#04121C" fontFamily='"FusionPixel","Microsoft YaHei",sans-serif' fontWeight={700}>
                        {shirt}
                    </text>
                ) : null}
                {/* 像素银链 */}
                {!back && !nerd ? (
                    <g fill="#D9E2EE">
                        {[78, 88, 98, 108, 118].map((cx, i) => (
                            <rect key={i} x={cx} y={top + 10 + Math.abs(2 - i) * 7} width={9} height={9} />
                        ))}
                    </g>
                ) : null}
                {/* 方块头 */}
                <rect x={hx - 56} y={headY - 56} width={112} height={112} fill={SKIN} />
                <rect x={hx - 60} y={headY - 16} width={8} height={22} fill={SKIN} />
                <rect x={hx + 52} y={headY - 16} width={8} height={22} fill={SKIN_D} />
                {!back ? (
                    <>
                        {face.eyes.map((r, i) => (
                            <rect key={`e${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
                        ))}
                        {face.extra?.map((r, i) => (
                            <rect key={`x${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
                        ))}
                        {face.mouth.map((r, i) => (
                            <rect key={`m${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.c} />
                        ))}
                    </>
                ) : null}
                {/* 头发：锯齿刘海（背影为整块） */}
                {nerd ? (
                    <rect x={hx - 60} y={headY - 66} width={120} height={34} fill={HAIR} />
                ) : back ? (
                    <rect x={hx - 58} y={headY - 64} width={116} height={120} fill={HAIR} />
                ) : (
                    <g fill={HAIR}>
                        <rect x={hx - 60} y={headY - 66} width={120} height={34} />
                        <rect x={hx - 60} y={headY - 32} width={20} height={16} />
                        <rect x={hx - 32} y={headY - 32} width={18} height={22} />
                        <rect x={hx - 6} y={headY - 32} width={18} height={16} />
                        <rect x={hx + 18} y={headY - 32} width={18} height={22} />
                        <rect x={hx + 42} y={headY - 32} width={18} height={16} />
                    </g>
                )}
                {/* 墨镜（可选） */}
                {glasses && !back ? (
                    <g fill="#05060A">
                        <rect x={hx - 46} y={headY - 18} width={34} height={22} />
                        <rect x={hx + 12} y={headY - 18} width={34} height={22} />
                        <rect x={hx - 12} y={headY - 10} width={24} height={6} />
                        <rect x={hx - 40} y={headY - 14} width={10} height={5} fill={P.accentLight} opacity={0.8} />
                    </g>
                ) : null}
            </svg>
        </div>
    );
};

export type LanlaoMood = "cool" | "laugh" | "shock" | "money" | "pray";

// 揽佬（像素版）：平头 + 方形墨镜（常戴）+ 印花 Polo + 手串 + 金耳环；crown 可加冠
export const Lanlao: React.FC<BaseProps & { mood?: LanlaoMood; crown?: boolean; shades?: boolean }> = ({ x, y, s = 1, mood = "cool", armL = 0, armR = 0, jump = 0, squat = 0, tilt = 0, look = 0, flip = false, dim = 0, opacity = 1, back = false, crown = false, shades = true }) => {
    const legH = 120 * (1 - squat * 0.55);
    const top = 400 - legH - 120;
    const headY = top - 58;
    const POLO = "#1C1C24";
    const lx = Math.round(look * 8);
    const hx = 100;
    const arm = (side: -1 | 1, deg: number) => {
        const ax = 100 + side * 46;
        return (
            <g transform={`rotate(${side * -deg} ${ax} ${top + 14})`}>
                <rect x={ax - 13} y={top + 2} width={26} height={92} fill={POLO} />
                <rect x={ax - 10} y={top + 56} width={20} height={44} fill={SKIN} />
                {/* 左手腕手串（金色像素珠） */}
                {side === -1 ? (
                    <g fill={GOLD}>
                        <rect x={ax - 12} y={top + 70} width={24} height={6} />
                        <rect x={ax - 12} y={top + 80} width={24} height={6} />
                    </g>
                ) : null}
                <rect x={ax - 14} y={top + 96} width={28} height={28} fill={SKIN} />
            </g>
        );
    };
    // 嘴：mood 决定
    const mouth =
        mood === "laugh" ? <rect x={hx - 16} y={headY + 20} width={32} height={20} fill="#3A0D14" /> : mood === "shock" ? <rect x={hx - 10} y={headY + 18} width={20} height={24} fill="#3A0D14" /> : mood === "money" ? <g fill="#3A0D14"><rect x={hx - 14} y={headY + 22} width={28} height={6} /><rect x={hx - 18} y={headY + 14} width={8} height={6} /><rect x={hx + 10} y={headY + 14} width={8} height={6} /></g> : <rect x={hx - 12} y={headY + 22} width={24} height={5} fill="#3A0D14" />;
    return (
        <div style={{ position: "absolute", left: x - 100 * s, top: y - 400 * s - jump, width: 200 * s, height: 400 * s, opacity, transform: `rotate(${tilt}deg) scaleX(${flip ? -1 : 1})`, transformOrigin: "50% 100%", filter: dim > 0 ? `grayscale(${dim}) brightness(${1 - dim * 0.35})` : undefined }}>
            <svg viewBox="0 0 200 400" width={200 * s} height={400 * s} style={{ overflow: "visible", display: "block" }}>
                <ellipse cx={100} cy={402 + jump / s} rx={70} ry={10} fill="#000" opacity={0.35 * Math.max(0.2, 1 - jump / 300)} />
                {/* 白短裤 + 鞋（标志性纯白短裤） */}
                <rect x={68} y={400 - legH} width={28} height={legH} fill="#E8ECF4" />
                <rect x={104} y={400 - legH} width={28} height={legH} fill="#E8ECF4" />
                <rect x={58} y={388} width={44} height={14} fill="#B9C2D0" />
                <rect x={98} y={388} width={44} height={14} fill="#B9C2D0" />
                {arm(-1, armL)}
                {arm(1, armR)}
                {/* 印花 Polo：深底 + 像素印花点阵 + 领子 */}
                <rect x={54} y={top} width={92} height={128} fill={POLO} />
                <g fill="#8A6B3A">
                    {[68, 92, 116, 132].map((px) => (
                        <g key={px}>
                            <rect x={px} y={top + 34} width={4} height={4} />
                            <rect x={px + 6} y={top + 40} width={4} height={4} />
                            <rect x={px} y={top + 46} width={4} height={4} />
                            <rect x={px + 6} y={top + 74} width={4} height={4} />
                            <rect x={px} y={top + 80} width={4} height={4} />
                        </g>
                    ))}
                </g>
                <g fill={SKIN}>
                    <rect x={82} y={top} width={36} height={6} />
                    <rect x={88} y={top + 6} width={24} height={8} fill="#111118" />
                </g>
                {/* 方块头 + 平头 */}
                <rect x={hx - 56} y={headY - 56} width={112} height={112} fill={SKIN} />
                <rect x={hx - 62} y={headY - 14} width={10} height={18} fill={SKIN} />
                <rect x={hx + 52} y={headY - 14} width={10} height={18} fill={SKIN_D} />
                <rect x={hx - 60} y={headY - 64} width={120} height={26} fill={HAIR} />
                <rect x={hx - 60} y={headY - 40} width={8} height={26} fill={HAIR} />
                <rect x={hx + 52} y={headY - 40} width={8} height={26} fill={HAIR} />
                {/* 金色耳环 */}
                <rect x={hx + 52} y={headY + 12} width={7} height={7} fill={GOLD} />
                {!back ? (
                    <>
                        {shades ? (
                            <g>
                                <rect x={hx - 50} y={headY - 16} width={42} height={30} fill="#2A1D12" />
                                <rect x={hx + 8} y={headY - 16} width={42} height={30} fill="#2A1D12" />
                                <rect x={hx - 8} y={headY - 6} width={16} height={5} fill="#2A1D12" />
                                <rect x={hx - 44} y={headY - 12} width={10} height={6} fill="#C9A06A" opacity={0.85} />
                                <rect x={hx + 14} y={headY - 12} width={10} height={6} fill="#C9A06A" opacity={0.85} />
                            </g>
                        ) : mood === "money" ? (
                            <g fill={GOLD}>
                                <rect x={hx - 30 + lx} y={headY - 8} width={20} height={20} />
                                <rect x={hx + 10 + lx} y={headY - 8} width={20} height={20} />
                                <rect x={hx - 22 + lx} y={headY} width={4} height={4} fill="#8A6B3A" />
                                <rect x={hx + 18 + lx} y={headY} width={4} height={4} fill="#8A6B3A" />
                            </g>
                        ) : (
                            <g fill="#111">
                                <rect x={hx - 30 + lx} y={headY - 4} width={16} height={10} />
                                <rect x={hx + 14 + lx} y={headY - 4} width={16} height={10} />
                            </g>
                        )}
                        {mouth}
                    </>
                ) : null}
                {/* 皇冠 */}
                {crown ? (
                    <g fill={GOLD}>
                        <rect x={hx - 48} y={headY - 96} width={96} height={20} />
                        <rect x={hx - 48} y={headY - 116} width={16} height={22} />
                        <rect x={hx - 8} y={headY - 126} width={16} height={32} />
                        <rect x={hx + 32} y={headY - 116} width={16} height={22} />
                        <rect x={hx - 26} y={headY - 106} width={10} height={10} fill="#E63B2E" />
                        <rect x={hx + 16} y={headY - 106} width={10} height={10} fill="#E63B2E" />
                    </g>
                ) : null}
            </svg>
        </div>
    );
};
