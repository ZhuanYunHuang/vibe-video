import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CL, FONT, HudProps, hit, pop, prog, useBeat, useT } from "../../../shared";
import { KAI, P } from "./theme";

// 场景内节拍脉冲（按绝对帧对齐 BGM）
export const usePulse = (start: number) => {
    const beat = useBeat();
    const t = useT();
    return beat.beatPulse(beat.bf(start) + t);
};

// 纸面微运镜：呼吸式缩放 + 极轻平移（纸不宜大幅晃动）
export const Stage: React.FC<{ t: number; children: React.ReactNode }> = ({ t, children }) => (
    <div
        style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${1.012 + 0.010 * Math.sin(t / 300)}) translate(${Math.sin(t / 380) * 4}px, ${Math.cos(t / 330) * 3}px)`,
        }}
    >
        {children}
    </div>
);

// 种子化伪随机（同一下标每次结果稳定）
const rnd = (i: number, k = 1) => Math.abs(Math.sin(i * 12.9898 * k + 78.233)) % 1;

// 本片背景：宣纸肌理（纸筋纤维 + 做旧黄斑）+ 淡罗盘 watermark + 浮动微尘
export const PaperBackdrop: React.FC = () => {
    const frame = useCurrentFrame();
    const trigrams = ["乾", "兑", "离", "震", "巽", "坎", "艮", "坤"];
    return (
        <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
            {/* 做旧：边缘压暗 + 黄斑水渍 */}
            <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(46,42,36,0.10) 100%)" }} />
            {[
                { x: 240, y: 180, s: 420, o: 0.12 },
                { x: 1620, y: 860, s: 520, o: 0.14 },
                { x: 1380, y: 140, s: 300, o: 0.10 },
                { x: 420, y: 920, s: 360, o: 0.11 },
            ].map((st, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: st.x - st.s / 2,
                        top: st.y - st.s / 2,
                        width: st.s,
                        height: st.s,
                        borderRadius: "50%",
                        background: `radial-gradient(circle, rgba(201,185,143,${st.o}) 0%, transparent 70%)`,
                    }}
                />
            ))}
            {/* 纸筋纤维 */}
            <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
                {Array.from({ length: 46 }, (_, i) => {
                    const x = rnd(i, 1) * 1900 + 10;
                    const y = rnd(i, 2) * 1060 + 10;
                    const len = 30 + rnd(i, 3) * 60;
                    const dx = (rnd(i, 4) - 0.5) * 26;
                    const dy = (rnd(i, 5) - 0.5) * 14;
                    return (
                        <path
                            key={i}
                            d={`M${x},${y} Q${x + dx / 2},${y + dy} ${x + dx},${y + dy * 1.6}`}
                            stroke={P.fiber}
                            strokeWidth={1 + rnd(i, 6) * 0.6}
                            opacity={0.18 + rnd(i, 7) * 0.17}
                            fill="none"
                            strokeLinecap="round"
                            transform={`translate(${-len / 2},0)`}
                        />
                    );
                })}
            </svg>
            {/* 淡罗盘 watermark：3 同心圆 + 24 刻度 + 八卦字 */}
            <svg width={380} height={380} style={{ position: "absolute", left: 1370, top: 430 }}>
                {[60, 125, 190].map((r, i) => (
                    <circle key={r} cx={190} cy={190} r={r} stroke={P.huaqing} strokeWidth={i === 2 ? 1.5 : 1} fill="none" opacity={0.1} />
                ))}
                {Array.from({ length: 24 }, (_, i) => {
                    const a = (i / 24) * Math.PI * 2;
                    const major = i % 6 === 0;
                    const r1 = major ? 168 : 176;
                    return (
                        <line
                            key={i}
                            x1={190 + Math.cos(a) * r1}
                            y1={190 + Math.sin(a) * r1}
                            x2={190 + Math.cos(a) * 190}
                            y2={190 + Math.sin(a) * 190}
                            stroke={P.huaqing}
                            strokeWidth={major ? 2 : 1}
                            opacity={0.1}
                        />
                    );
                })}
                {trigrams.map((g, i) => {
                    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
                    return (
                        <text
                            key={g}
                            x={190 + Math.cos(a) * 148}
                            y={190 + Math.sin(a) * 148 + 9}
                            textAnchor="middle"
                            fontSize={26}
                            fill={P.huaqing}
                            opacity={0.1}
                            fontFamily={KAI}
                        >
                            {g}
                        </text>
                    );
                })}
            </svg>
            {/* 浮动微尘 */}
            {Array.from({ length: 16 }, (_, i) => {
                const x = 40 + rnd(i, 8) * 1840;
                const sp = 0.3 + rnd(i, 9) * 0.3;
                const y = 1180 - ((frame * sp + rnd(i, 10) * 1200) % 1320);
                const s = 2 + rnd(i, 11) * 3;
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: x + Math.sin(frame / 30 + i) * 14,
                            top: y,
                            width: s,
                            height: s,
                            borderRadius: "50%",
                            background: i % 3 === 0 ? P.gold : P.ink,
                            opacity: 0.06 + rnd(i, 12) * 0.08,
                        }}
                    />
                );
            })}
        </AbsoluteFill>
    );
};

// 本片 HUD：切场朱砂洗光 + 底部朱砂标尺进度条 + 印章形进度头
export const BarnumHud: React.FC<HudProps> = ({ cutFrames, totalFrames }) => {
    const frame = useCurrentFrame();
    const { beatPulse } = useBeat();
    const p = interpolate(frame, [0, totalFrames], [0, 1], CL);
    const pulse = beatPulse(frame);
    const flash = cutFrames.reduce((m, f) => (frame >= f ? Math.max(m, Math.exp(-(frame - f) / 4)) : m), 0);
    const r = 9 + pulse * 5;
    return (
        <>
            <AbsoluteFill style={{ background: P.cinnabar, opacity: flash * 0.1, pointerEvents: "none" }} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: `${P.fiber}` }} />
            <div
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 5,
                    width: `${p * 100}%`,
                    background: `linear-gradient(90deg, ${P.cinnabarDeep}, ${P.cinnabar})`,
                }}
            />
            <div
                style={{
                    position: "absolute",
                    left: `calc(${p * 100}% - ${r}px)`,
                    bottom: 3 - r,
                    width: r * 2,
                    height: r * 2,
                    background: P.cinnabar,
                    border: `2px solid ${P.gold}`,
                    borderRadius: 3,
                    transform: `rotate(45deg) scale(${1 + pulse * 0.4})`,
                    boxShadow: `0 0 10px ${P.cinnabar}88`,
                    opacity: p < 1 ? 1 : 0,
                }}
            />
        </>
    );
};

// 朱砂印章（全片母题）：拍点 pop 砸入 + 过冲回摆；方红底白字，多字竖排
export const Seal: React.FC<{
    t: number;
    from: number;
    x: number;
    y: number;
    text: string;
    size?: number;
    rot?: number;
    color?: string;
}> = ({ t, from, x, y, text, size = 110, rot = 5, color = P.sealPaste }) => {
    if (t < from) return null;
    const s = pop(t, from, 11);
    const h = hit(t, from, 4);
    const multi = text.length > 1;
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: size,
                height: size,
                transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * 20}deg) scale(${1.5 - 0.5 * s + h * 0.08})`,
                opacity: Math.min(1, s * 1.3),
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: color,
                    borderRadius: "12px 9px 14px 10px / 10px 14px 9px 13px",
                    boxShadow: `0 2px 8px ${color}66, inset 0 0 8px rgba(0,0,0,0.28), inset 0 0 2px rgba(255,255,255,0.25)`,
                    display: "flex",
                    flexDirection: multi ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: KAI,
                    fontWeight: 900,
                    color: P.card,
                    letterSpacing: multi ? 2 : 0,
                    fontSize: size * (multi ? 0.3 : 0.42),
                    lineHeight: multi ? 1.15 : 1,
                    padding: multi ? 8 : 0,
                    textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                }}
            >
                {multi ? text.split("").map((ch, i) => <span key={i}>{ch}</span>) : text}
            </div>
        </div>
    );
};

// 左上角章节标签：方章徽章 + 楷体标题 + 墨笔刷下划线
export const Chapter: React.FC<{ t: number; step: string; title: string }> = ({ t, step, title }) => {
    const s = pop(t, 0, 12);
    const w = prog(t, 4, 14);
    return (
        <div
            style={{
                position: "absolute",
                left: 100,
                top: 64,
                display: "flex",
                alignItems: "center",
                gap: 22,
                fontFamily: KAI,
                opacity: s,
                transform: `translateX(${(1 - s) * -40}px)`,
            }}
        >
            <div
                style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    border: `3px solid ${P.cinnabar}`,
                    color: P.cinnabar,
                    fontSize: step.length > 1 ? 25 : 30, // 双字（其一/其二/其三）要缩一号才放得进一行
                    lineHeight: 1,
                    whiteSpace: "nowrap",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `rotate(-3deg) translateY(${Math.sin(t / 22) * 4}px)`,
                    background: P.card,
                }}
            >
                {step}
            </div>
            <div style={{ fontSize: 48, fontWeight: 900, color: P.ink, letterSpacing: 4 }}>
                {title}
                <svg width={300} height={14} style={{ display: "block", marginTop: 4 }}>
                    <path d="M2,8 Q80,3 160,7 T298,5" stroke={P.ink} strokeWidth={5} strokeLinecap="round" fill="none" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - w)} />
                    <path d="M6,11 Q90,7 170,10 T294,9" stroke={P.ink} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.35} pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - w) * 1.15} />
                </svg>
            </div>
        </div>
    );
};

// 底部字幕：纯文字一行，不加边框/底条
export const Sub: React.FC<{ t: number; from: number; to?: number; children: React.ReactNode }> = ({ t, from, to = Infinity, children }) => {
    if (t < from || t > to + 8) return null;
    const s = pop(t, from, 14);
    const out = to === Infinity ? 0 : prog(t, to, 8);
    return (
        <div
            style={{
                position: "absolute",
                bottom: 84,
                left: 0,
                right: 0,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 38,
                fontWeight: 700,
                color: P.ink,
                opacity: s * (1 - out),
                transform: `translateY(${(1 - s) * 30}px)`,
            }}
        >
            {children}
        </div>
    );
};

// 墨框纸卡：card 底 + 墨框 + 四角 L 形加粗描边（古籍框线）+ 常驻轻浮动
export const InkCard: React.FC<{
    x: number;
    y: number;
    w: number;
    h: number;
    appear: number;
    lit?: number;
    rot?: number;
    float?: boolean; // 默认轻浮动；屏幕内等不该浮的场景传 false
    children: React.ReactNode;
}> = ({ x, y, w, h, appear, lit = 0, rot = 0, float = true, children }) => {
    const t = useT();
    const bob = appear > 0.9 ? Math.sin(t / 26 + (x + y) / 150) * 0.5 : 0;
    const bobY = float && appear > 0.9 ? Math.sin(t / 30 + (x + y) / 90) * 3.5 : 0;
    const corner: React.CSSProperties = { position: "absolute", width: 14, height: 14, border: `0 solid ${P.ink}` };
    return (
        <div
            style={{
                position: "absolute",
                left: x - w / 2,
                top: y - h / 2,
                width: w,
                height: h,
                background: P.card,
                border: `2px solid ${P.ink}`,
                borderRadius: 4,
                boxShadow: lit > 0.01 ? `0 4px 14px #2E2A2418, 0 0 ${lit * 36}px ${P.cinnabar}55` : "0 4px 14px #2E2A2418",
                opacity: appear,
                transform: `translateY(${(1 - appear) * 46 + bobY}px) rotate(${rot + bob}deg) scale(${0.92 + 0.08 * appear})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT,
                color: P.ink,
                textAlign: "center",
                padding: 18,
            }}
        >
            <div style={{ ...corner, left: -2, top: -2, borderLeftWidth: 4, borderTopWidth: 4 }} />
            <div style={{ ...corner, right: -2, top: -2, borderRightWidth: 4, borderTopWidth: 4 }} />
            <div style={{ ...corner, left: -2, bottom: -2, borderLeftWidth: 4, borderBottomWidth: 4 }} />
            <div style={{ ...corner, right: -2, bottom: -2, borderRightWidth: 4, borderBottomWidth: 4 }} />
            {children}
        </div>
    );
};

// 塔罗牌：牌背花纹 + rotateY 翻牌（flipAt 拍起 14 帧翻完）
export const TarotCard: React.FC<{
    t: number;
    from: number;
    x: number;
    y: number;
    w?: number;
    h?: number;
    rot?: number;
    flipAt?: number; // 不传则始终保持牌背
    front: React.ReactNode;
}> = ({ t, from, x, y, w = 300, h = 480, rot = -5, flipAt, front }) => {
    const s = pop(t, from, 12);
    const bob = Math.sin(t / 24) * 6;
    const flip = flipAt === undefined ? 0 : prog(t, flipAt, 14);
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                height: h,
                marginLeft: -w / 2,
                marginTop: -h / 2,
                perspective: 1400,
                transform: `translateY(${(1 - s) * 40 + bob}px) scale(${0.6 + 0.4 * s})`,
                opacity: Math.min(1, s * 1.2),
            }}
        >
            <div style={{ position: "relative", width: w, height: h, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg)` }}>
                {/* 牌背 */}
                <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", borderRadius: 14, background: P.card, border: `3px solid ${P.huaqing}`, overflow: "hidden" }}>
                    <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
                        <rect x={16} y={16} width={w - 32} height={h - 32} rx={10} stroke={P.huaqing} strokeWidth={1.5} fill="none" opacity={0.7} />
                        <circle cx={w / 2} cy={h / 2} r={46} stroke={P.huaqing} strokeWidth={2.5} fill="none" />
                        <path d={`M${w / 2},${h / 2 - 46} A46,46 0 0 0 ${w / 2},${h / 2 + 46} A34,34 0 0 1 ${w / 2},${h / 2 - 46} Z`} fill={P.huaqing} opacity={0.85} />
                        {Array.from({ length: 8 }, (_, i) => {
                            const a = (i / 8) * Math.PI * 2;
                            return (
                                <line
                                    key={i}
                                    x1={w / 2 + Math.cos(a) * 60}
                                    y1={h / 2 + Math.sin(a) * 60}
                                    x2={w / 2 + Math.cos(a) * 82}
                                    y2={h / 2 + Math.sin(a) * 82}
                                    stroke={P.huaqing}
                                    strokeWidth={1.5}
                                    opacity={0.6}
                                />
                            );
                        })}
                        {[
                            [44, 44],
                            [w - 44, 44],
                            [44, h - 44],
                            [w - 44, h - 44],
                        ].map(([cx, cy], i) => (
                            <g key={i}>
                                {[0, 90, 180, 270].map((a) => (
                                    <circle key={a} cx={cx + Math.cos((a * Math.PI) / 180) * 7} cy={cy + Math.sin((a * Math.PI) / 180) * 7} r={3.5} fill={P.huaqing} opacity={0.7} />
                                ))}
                            </g>
                        ))}
                    </svg>
                </div>
                {/* 牌面 */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        borderRadius: 14,
                        background: P.card,
                        border: `2px solid ${P.ink}`,
                        boxShadow: "inset 0 0 24px rgba(46,42,36,0.08)",
                        overflow: "hidden",
                    }}
                >
                    {front}
                </div>
            </div>
        </div>
    );
};

// 红笔圈注（全片母题）：椭圆圈用 CSS 描边 div（大尺寸下 SVG 合成会缺半圈），波浪划线用 SVG；可带批注小字
export const RedPen: React.FC<{
    t: number;
    from: number;
    x: number;
    y: number;
    w?: number;
    h?: number;
    dur?: number;
    rot?: number;
    underline?: boolean;
    note?: string;
    color?: string;
}> = ({ t, from, x, y, w = 220, h = 90, dur = 12, rot = -3, underline = false, note, color = P.cinnabar }) => {
    if (t < from) return null;
    const p = prog(t, from, dur);
    const pw = w + 48;
    const ph = h + 48;
    const cx = pw / 2;
    const cy = ph / 2;
    const rx = w / 2;
    // 椭圆圈淡入进度（主圈即时、副圈延迟 3 帧）
    const ringIn = Math.min(1, Math.max(0, (t - from) / dur));
    const ring2In = 0.4 * Math.min(1, Math.max(0, (t - from - 3) / dur));
    return (
        <div style={{ position: "absolute", left: x - pw / 2, top: y - ph / 2, width: pw, height: ph, transform: `rotate(${rot}deg)`, pointerEvents: "none" }}>
            {underline ? (
                <svg width={pw} height={ph} style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d={`M${cx - rx},${cy + 6} Q${cx - rx / 3},${cy - 6} ${cx},${cy + 4} T${cx + rx},${cy - 2}`} stroke={color} strokeWidth={4} strokeLinecap="round" fill="none" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
                    <path d={`M${cx - rx},${cy + 12} Q${cx + rx / 3},${cy} ${cx + rx},${cy + 8}`} stroke={color} strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.4} pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - Math.max(0, Math.min(1, (t - from - 4) / dur)))} />
                </svg>
            ) : (
                <>
                    <div style={{ position: "absolute", left: 24, top: 24, width: w, height: h, border: `5px solid ${color}`, borderRadius: w > 500 ? 120 : "50%", opacity: ringIn }} />
                    <div style={{ position: "absolute", left: 27, top: 26, width: w, height: h, border: `2px solid ${color}`, borderRadius: w > 500 ? 120 : "50%", opacity: ring2In }} />
                </>
            )}
            {note && t >= from + 4 ? (
                <div
                    style={{
                        position: "absolute",
                        left: pw - 30,
                        top: -18,
                        fontFamily: KAI,
                        fontSize: 28,
                        fontWeight: 900,
                        color,
                        transform: `rotate(-4deg) scale(${pop(t, from + 4, 10)})`,
                        opacity: Math.min(1, pop(t, from + 4, 10) * 1.3),
                        whiteSpace: "nowrap",
                    }}
                >
                    {note}
                </div>
            ) : null}
        </div>
    );
};

// 场景 1 手机：深色机壳 + 听筒条 + 屏幕（内容由 children 画）
export const PhoneMockup: React.FC<{
    t: number;
    from: number;
    x: number;
    y: number;
    w?: number;
    h?: number;
    rot?: number;
    children: React.ReactNode;
}> = ({ t, from, x, y, w = 420, h = 860, rot = -2, children }) => {
    const s = pop(t, from, 12);
    const bob = Math.sin(t / 30) * 3;
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: w,
                height: h,
                marginLeft: -w / 2,
                marginTop: -h / 2,
                background: "#211D18",
                border: `3px solid ${P.ink}`,
                borderRadius: 46,
                boxShadow: "0 18px 44px #2E2A2455",
                transform: `translateY(${(1 - s) * 60 + bob}px) rotate(${rot}deg) scale(${0.8 + 0.2 * s})`,
                opacity: Math.min(1, s * 1.2),
            }}
        >
            <div style={{ position: "absolute", left: w / 2 - 60, top: 22, width: 120, height: 8, borderRadius: 4, background: "#3A342C" }} />
            <div style={{ position: "absolute", inset: 12, borderRadius: 36, background: P.card, overflow: "hidden" }}>{children}</div>
        </div>
    );
};

// 砸入大字（纸上版）：KAI 900、不发光、极淡投影
export const Slam: React.FC<{
    t: number;
    from: number;
    x: number;
    y: number;
    children: React.ReactNode;
    size?: number;
    color?: string;
    rot?: number;
}> = ({ t, from, x, y, children, size = 92, color = P.ink, rot = 0 }) => {
    if (t < from) return null;
    const s = pop(t, from, 10);
    const h = hit(t, from, 4);
    return (
        <div
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${rot + (1 - s) * 8}deg) scale(${(1.5 - 0.5 * s) * (1 + h * 0.07)})`,
                opacity: Math.min(1, s * 1.3),
                fontFamily: KAI,
                fontSize: size,
                fontWeight: 900,
                color,
                whiteSpace: "nowrap",
                textShadow: `0 2px 0 ${P.fiber}66`,
            }}
        >
            {children}
        </div>
    );
};
