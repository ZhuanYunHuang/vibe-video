import React from "react";
import { AbsoluteFill } from "remotion";
import { KAI, P } from "./kit/theme";

// 四角星（泥金）
const Sparkle: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = P.gold }) => (
    <svg width={24 * s} height={24 * s} style={{ position: "absolute", left: x - 12 * s, top: y - 12 * s }}>
        <path d="M0,-10 Q2,-2 10,0 Q2,2 0,10 Q-2,2 -10,0 Q-2,-2 0,-10 Z" fill={c} opacity={0.9} />
    </svg>
);

// 印章（封面静态版：与 kit Seal 同视觉，无动画无 hook）
const CoverSeal: React.FC<{ x: number; y: number; size?: number; rot?: number; text: string }> = ({ x, y, size = 130, rot = -4, text }) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size,
            transform: `translate(-50%, -50%) rotate(${rot}deg)`,
            background: P.sealPaste,
            borderRadius: "12px 9px 14px 10px / 10px 14px 9px 13px",
            boxShadow: "0 2px 8px rgba(169,52,40,0.4), inset 0 0 8px rgba(0,0,0,0.28)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: KAI,
            fontWeight: 900,
            color: P.card,
            letterSpacing: 2,
            fontSize: size * 0.3,
            lineHeight: 1.15,
            padding: 8,
        }}
    >
        {text.split("").map((ch, i) => (
            <span key={i}>{ch}</span>
        ))}
    </div>
);

// 塔罗牌背线描（封面静态版）
const TarotBack: React.FC<{ x: number; y: number; rot: number; w?: number; h?: number }> = ({ x, y, rot, w = 220, h = 350 }) => (
    <svg width={w} height={h} style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg)` }}>
        <rect x={6} y={6} width={w - 12} height={h - 12} rx={14} fill={P.card} stroke={P.ink} strokeWidth={3} opacity={0.95} />
        <rect x={18} y={18} width={w - 36} height={h - 36} rx={10} stroke={P.ink} strokeWidth={1.5} fill="none" opacity={0.6} />
        <circle cx={w / 2} cy={h * 0.46} r={42} stroke={P.ink} strokeWidth={2.5} fill="none" opacity={0.75} />
        <path d={`M${w / 2},${h * 0.46 - 42} A42,42 0 0 0 ${w / 2},${h * 0.46 + 42} A31,31 0 0 1 ${w / 2},${h * 0.46 - 42} Z`} fill={P.ink} opacity={0.6} />
        {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return <line key={i} x1={w / 2 + Math.cos(a) * 54} y1={h * 0.46 + Math.sin(a) * 54} x2={w / 2 + Math.cos(a) * 74} y2={h * 0.46 + Math.sin(a) * 74} stroke={P.ink} strokeWidth={1.5} opacity={0.55} />;
        })}
        {[
            [44, 44],
            [w - 44, 44],
            [44, h - 44],
            [w - 44, h - 44],
        ].map(([cx, cy], i) => (
            <g key={i}>
                {[0, 90, 180, 270].map((a) => (
                    <circle key={a} cx={cx + Math.cos((a * Math.PI) / 180) * 7} cy={cy + Math.sin((a * Math.PI) / 180) * 7} r={3.5} fill={P.ink} opacity={0.55} />
                ))}
            </g>
        ))}
        <text x={w / 2} y={h - 62} textAnchor="middle" fontSize={24} fontFamily={KAI} fill={P.ink} opacity={0.7}>月亮</text>
    </svg>
);

// 铜钱：圆 + 方孔 + 「算命」二字
const Coin: React.FC<{ x: number; y: number; rot?: number; size?: number }> = ({ x, y, rot = 0, size = 96 }) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size,
            transform: `translate(-50%, -50%) rotate(${rot}deg)`,
            background: P.card,
            border: `4px solid ${P.ink}`,
            borderRadius: "50%",
            boxShadow: "0 4px 12px #2E2A2428",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: KAI,
            fontWeight: 900,
            color: P.ink,
            fontSize: size * 0.26,
        }}
    >
        <span style={{ position: "absolute", top: size * 0.05 }}>算</span>
        <span style={{ position: "absolute", bottom: size * 0.05 }}>命</span>
        <div style={{ width: size * 0.28, height: size * 0.28, border: `4px solid ${P.ink}`, background: P.xuan }} />
    </div>
);

// 算命老先生（底部中央焦点；诸葛亮式：纶巾 + 三缕长须 + 交领长袍 + 手持羽扇）
const OldMaster: React.FC<{ x: number; y: number }> = ({ x, y }) => (
    <>
        {/* 身后暖光晕 */}
        <div style={{ position: "absolute", left: x - 230, top: y - 80, width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${P.gold}44 0%, ${P.gold}18 45%, transparent 68%)` }} />
        {/* 脚下投影 */}
        <div style={{ position: "absolute", left: x - 170, top: y + 352, width: 340, height: 26, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(46,42,36,0.22) 0%, transparent 68%)" }} />
        <svg width={320} height={360} style={{ position: "absolute", left: x - 160, top: y }}>
            {/* 长袍（含宽肩） */}
            <path d="M160,196 Q70,238 42,360 L278,360 Q250,238 160,196 Z" fill={P.card} stroke={P.ink} strokeWidth={3.5} />
            <path d="M160,236 L160,360" stroke={P.ink} strokeWidth={2} opacity={0.4} />
            {/* 交领 */}
            <path d="M130,198 L160,238 L190,198" stroke={P.ink} strokeWidth={3} fill="none" strokeLinejoin="round" />
            {/* 双广袖 */}
            <path d="M98,250 Q68,306 82,352 L148,352 Q138,298 120,252 Z" fill={P.card} stroke={P.ink} strokeWidth={3} />
            <path d="M222,250 Q252,306 238,352 L172,352 Q182,298 200,252 Z" fill={P.card} stroke={P.ink} strokeWidth={3} />
            {/* 三缕长须（垂在袍前） */}
            <path d="M148,198 Q136,244 120,288" stroke={P.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            <path d="M160,202 Q160,250 160,298" stroke={P.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            <path d="M172,198 Q184,244 200,288" stroke={P.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            {/* 头 */}
            <circle cx={160} cy={136} r={62} fill={P.card} stroke={P.ink} strokeWidth={3.5} />
            {/* 纶巾：软冠 + 额带 + 双飘带 */}
            <path d="M108,64 Q120,18 160,16 Q200,18 212,64 Z" fill={P.card} stroke={P.ink} strokeWidth={3.5} />
            <path d="M100,62 Q160,42 220,62 L220,84 Q160,64 100,84 Z" fill={P.card} stroke={P.ink} strokeWidth={3} />
            <path d="M102,82 Q92,116 84,140" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M218,82 Q228,116 236,140" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
            {/* 眉毛 + 含笑闭眼 */}
            <path d="M126,120 Q140,112 154,120" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M166,120 Q180,112 194,120" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d="M128,138 Q140,146 152,138" stroke={P.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.85} />
            <path d="M168,138 Q180,146 192,138" stroke={P.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" opacity={0.85} />
            {/* 八字须 */}
            <path d="M134,178 Q147,170 160,178 Q173,170 186,178" stroke={P.ink} strokeWidth={3} fill="none" strokeLinecap="round" />
            {/* 羽扇（右手持）：扇面 + 羽纹 + 扇柄 + 手 */}
            <g transform="rotate(-24 88 186)">
                <ellipse cx={88} cy={182} rx={38} ry={58} fill={P.card} stroke={P.ink} strokeWidth={3} />
                <path d="M88,230 Q68,196 74,162" stroke={P.ink} strokeWidth={1.8} fill="none" opacity={0.55} />
                <path d="M88,230 Q88,190 88,150" stroke={P.ink} strokeWidth={1.8} fill="none" opacity={0.55} />
                <path d="M88,230 Q108,196 102,162" stroke={P.ink} strokeWidth={1.8} fill="none" opacity={0.55} />
            </g>
            <path d="M110,236 L118,262" stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
            <circle cx={118} cy={266} r={13} fill={P.card} stroke={P.ink} strokeWidth={3} />
        </svg>
        <Sparkle x={x - 196} y={y + 96} s={0.9} />
        <Sparkle x={x + 190} y={y + 62} s={1.1} />
        <Sparkle x={x + 150} y={y + 250} s={0.7} />
    </>
);

// 视频封面（静态图）。不用任何依赖节拍 context 的组件，纸肌理与线描全部纯 CSS/SVG 自绘。
export const Cover: React.FC = () => (
    <AbsoluteFill style={{ background: P.xuan, fontFamily: KAI, overflow: "hidden" }}>
        {/* 纸肌理：纸纹 + 黄斑 + 做旧边缘 */}
        <AbsoluteFill
            style={{
                backgroundImage: `repeating-linear-gradient(0deg, rgba(217,203,174,0.05) 0px, rgba(217,203,174,0.05) 1px, transparent 1px, transparent 7px), repeating-linear-gradient(90deg, rgba(217,203,174,0.04) 0px, rgba(217,203,174,0.04) 1px, transparent 1px, transparent 9px), radial-gradient(circle at 18% 16%, rgba(201,185,143,0.12) 0%, transparent 34%), radial-gradient(circle at 84% 82%, rgba(201,185,143,0.14) 0%, transparent 36%), radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(46,42,36,0.12) 100%)`,
            }}
        />
        {/* 古籍双线框 + 四角朱砂饰 */}
        <div style={{ position: "absolute", inset: 36, border: `2px solid ${P.ink}`, borderRadius: 4, opacity: 0.9 }} />
        <div style={{ position: "absolute", inset: 48, border: `1px solid ${P.ink}`, opacity: 0.55 }} />
        {[
            { left: 30, top: 30, bl: true, bt: true },
            { right: 30, top: 30, br: true, bt: true },
            { left: 30, bottom: 30, bl: true, bb: true },
            { right: 30, bottom: 30, br: true, bb: true },
        ].map((c, i) => (
            <div
                key={i}
                style={{
                    position: "absolute",
                    left: c.left,
                    right: c.right,
                    top: c.top,
                    bottom: c.bottom,
                    width: 46,
                    height: 46,
                    borderLeft: c.bl ? `5px solid ${P.cinnabar}` : undefined,
                    borderRight: c.br ? `5px solid ${P.cinnabar}` : undefined,
                    borderTop: c.bt ? `5px solid ${P.cinnabar}` : undefined,
                    borderBottom: c.bb ? `5px solid ${P.cinnabar}` : undefined,
                }}
            />
        ))}
        {/* 泥金星点 */}
        {[
            [560, 180, 4],
            [860, 120, 3],
            [1120, 170, 4],
            [1640, 120, 5],
            [220, 180, 3],
            [1790, 320, 3],
            [170, 560, 4],
            [1730, 720, 3],
            [660, 700, 4],
            [1300, 660, 3],
            [640, 214, 3],
        ].map(([x, y, r], i) => (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: r * 2, height: r * 2, borderRadius: "50%", background: P.gold, opacity: 0.85 }} />
        ))}
        <Sparkle x={700} y={150} s={1.1} />
        <Sparkle x={1250} y={110} s={0.9} />
        <Sparkle x={300} y={120} s={1} />
        <Sparkle x={1560} y={420} s={0.8} />
        <Sparkle x={720} y={660} s={0.9} />
        {/* 左上星座连线（呼应「星座」开场） */}
        <svg width={420} height={240} style={{ position: "absolute", left: 120, top: 380 }}>
            <polyline points="40,60 120,110 220,50 300,120 380,90" stroke={P.huaqing} strokeWidth={1.5} fill="none" opacity={0.55} />
            {[
                [40, 60, 5],
                [120, 110, 4],
                [220, 50, 6],
                [300, 120, 4],
                [380, 90, 5],
            ].map(([cx, cy, r], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill={P.gold} opacity={0.9} />
            ))}
        </svg>
        <Sparkle x={250} y={410} s={0.7} />
        {/* 朱砂符纸（顶部红色强对比） */}
        <div style={{ position: "absolute", left: 1104, top: 46, width: 64, height: 190, background: P.cinnabar, border: `2px solid ${P.cinnabarDeep}`, borderRadius: 4, transform: "rotate(-2deg)", boxShadow: "0 4px 12px #A9342833" }}>
            <svg width={64} height={190}>
                <g stroke={P.card} strokeWidth={4} strokeLinecap="round" opacity={0.9} fill="none">
                    <path d="M19,30 L45,30" />
                    <path d="M19,44 L45,44" />
                    <path d="M32,30 L32,54" />
                    <path d="M32,64 C15,80 49,94 32,110 C15,126 49,140 32,156" />
                    <path d="M19,166 L45,166" />
                    <path d="M19,178 L45,178" />
                </g>
            </svg>
        </div>
        {/* 主副标题 */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 240, textAlign: "center" }}>
            <div style={{ fontSize: 110, fontWeight: 900, color: P.ink, letterSpacing: 6 }}>算命，为什么这么准？</div>
            <div style={{ fontSize: 46, color: P.inkLight, marginTop: 34, letterSpacing: 4 }}>你的大脑，在帮他们补全</div>
        </div>
        {/* 红笔圈「准」+ 批注「？」：封面动态元素，点破主题 */}
        <svg width={280} height={200} style={{ position: "absolute", left: 1226, top: 222, transform: "rotate(-3deg)", overflow: "visible" }}>
            <ellipse cx={140} cy={90} rx={106} ry={72} stroke={P.cinnabar} strokeWidth={6} fill="none" opacity={0.92} />
            <ellipse cx={143} cy={93} rx={106} ry={72} stroke={P.cinnabar} strokeWidth={2.5} fill="none" opacity={0.4} />
        </svg>
        <div style={{ position: "absolute", left: 1500, top: 200, fontFamily: KAI, fontSize: 44, fontWeight: 900, color: P.cinnabar, transform: "rotate(-10deg)" }}>？</div>
        <CoverSeal x={300} y={300} text="巴纳姆" />
        {/* 竖排风味小字 */}
        <div style={{ position: "absolute", left: 92, top: 600, writingMode: "vertical-rl", fontFamily: KAI, fontSize: 30, color: P.inkLight, letterSpacing: 10, opacity: 0.75 }}>天机不可泄露</div>
        {/* 塔罗牌：后一张叠层 + 前一张主牌 */}
        <TarotBack x={270} y={600} rot={-14} w={190} h={300} />
        <TarotBack x={190} y={545} rot={-8} />
        {/* 铜钱 ×2（填左侧与右中空区） */}
        <Coin x={565} y={525} rot={-11} size={110} />
        <Coin x={1290} y={560} rot={9} size={96} />
        {/* 星盘线描（加月牙与八卦字，增强右上角） */}
        <svg width={360} height={360} style={{ position: "absolute", left: 1430, top: 150 }}>
            {[60, 120, 180].map((r, i) => (
                <circle key={r} cx={180} cy={180} r={r} stroke={P.huaqing} strokeWidth={i === 2 ? 2.5 : 1.2} fill="none" opacity={i === 2 ? 0.8 : 0.6} />
            ))}
            <circle cx={180} cy={180} r={150} stroke={P.huaqing} strokeWidth={1} fill="none" opacity={0.5} strokeDasharray="6 8" />
            {/* 中心月牙 */}
            <circle cx={180} cy={180} r={40} stroke={P.huaqing} strokeWidth={2} fill="none" opacity={0.85} />
            <path d="M180,140 A40,40 0 0 0 180,220 A29,29 0 0 1 180,140 Z" fill={P.huaqing} opacity={0.55} />
            {Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={180 + Math.cos(a) * 168} y1={180 + Math.sin(a) * 168} x2={180 + Math.cos(a) * 180} y2={180 + Math.sin(a) * 180} stroke={P.huaqing} strokeWidth={2.2} opacity={0.75} />;
            })}
            {["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"].map((g, i) => {
                const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                return (
                    <text key={g} x={180 + Math.cos(a) * 162} y={180 + Math.sin(a) * 162 + 8} textAnchor="middle" fontSize={22} fontFamily={KAI} fill={P.huaqing} opacity={0.75}>
                        {g}
                    </text>
                );
            })}
            {[
                [70, 40, 3],
                [260, 90, 2.5],
                [120, 280, 3],
                [290, 250, 2],
                [180, 30, 2],
            ].map(([cx, cy, r], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill={P.gold} opacity={0.85} />
            ))}
        </svg>
        {/* 签筒 + 上上签签文 */}
        <svg width={140} height={220} style={{ position: "absolute", left: 1550, top: 650 }}>
            {[
                [30, 20, 60],
                [50, 0, 84],
                [70, 26, 52],
                [88, 10, 72],
                [104, 34, 44],
            ].map(([x, top, h], i) => (
                <line key={i} x1={x} y1={top + 60} x2={x} y2={top + h} stroke={P.ink} strokeWidth={4} strokeLinecap="round" opacity={0.7} />
            ))}
            <path d="M22,60 L26,196 Q26,206 36,206 L104,206 Q114,206 114,196 L118,60 Z" fill={P.card} stroke={P.ink} strokeWidth={3} opacity={0.95} />
            <line x1={22} y1={92} x2={118} y2={92} stroke={P.ink} strokeWidth={2} opacity={0.6} />
            <line x1={23} y1={140} x2={117} y2={140} stroke={P.ink} strokeWidth={2} opacity={0.6} />
        </svg>
        <div
            style={{
                position: "absolute",
                left: 1700,
                top: 660,
                width: 62,
                height: 170,
                background: P.card,
                border: `2px solid ${P.cinnabar}`,
                borderRadius: 4,
                transform: "rotate(8deg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 3px 10px #2E2A2433",
            }}
        >
            <div style={{ writingMode: "vertical-rl", fontFamily: KAI, fontSize: 30, fontWeight: 900, color: P.cinnabar, letterSpacing: 6 }}>上上签</div>
        </div>
        {/* 算命老先生（底部中央焦点） */}
        <OldMaster x={960} y={570} />
        {/* 底部小字 */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 950, textAlign: "center", fontSize: 34, color: P.inkLight, letterSpacing: 6 }}>
            <span style={{ color: P.cinnabar, marginRight: 18 }}>——</span>当算命遇上心理学<span style={{ color: P.cinnabar, marginLeft: 18 }}>——</span>
        </div>
    </AbsoluteFill>
);
