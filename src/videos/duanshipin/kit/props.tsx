import React from "react";
import { CL, hit, pop, prog } from "../../../shared";
import { interpolate } from "remotion";
import { FONT, MONO, useTone } from "../../../styles/cyberhud-dual";
import { Label, ScanBox } from "./hudbits";
import { GIFT_NAME, GiftIcon, type GiftKind } from "./icons";

// 本 MV 的意象素材件：歌词里出现的每样东西，一律 HUD 符号化（不见血、不见具象伤害）。
// 全部 t/from 纯函数、取色走 useTone()，随冷青→警报红自动换色。

// 数字爬升（整数）
export const count = (t: number, from: number, to: number, dur = 30) =>
    Math.round(interpolate(t, [from, from + dur], [0, to], { ...CL, easing: (x) => 1 - Math.pow(1 - x, 3) }));

// 人形轮廓（头 + 身），用于扫描/锁定/矩阵
export const Person: React.FC<{ t?: number; x: number; y: number; h?: number; color?: string; opacity?: number }> = ({ x, y, h = 120, color, opacity = 1 }) => {
    const P = useTone();
    const c = color ?? P.accent;
    const head = h * 0.26;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: h * 0.5, height: h, transform: "translate(-50%,-50%)", opacity }}>
            <div style={{ position: "absolute", left: "50%", top: 0, width: head, height: head, borderRadius: "50%", transform: "translateX(-50%)", background: `${c}33`, boxShadow: `inset 0 0 0 2px ${c}` }} />
            <div style={{ position: "absolute", left: "50%", top: head + 4, width: h * 0.44, height: h - head - 4, transform: "translateX(-50%)", background: `${c}22`, boxShadow: `inset 0 0 0 2px ${c}`, clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }} />
        </div>
    );
};

// ① 竖屏手机壳：短视频信息流 + 右侧四计数器
export const PhoneFeed: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; likes?: number; comments?: number; shares?: number; saves?: number; hitAt?: number }> = ({ t, from, x, y, w = 340, h = 620, likes = 0, comments = 0, shares = 0, saves = 0, hitAt = 0 }) => {
    const P = useTone();
    const s = pop(t, from, 12);
    const buttons = [
        { icon: "♥", n: likes, label: "赞" },
        { icon: "▤", n: comments, label: "评论" },
        { icon: "⇄", n: shares, label: "转发" },
        { icon: "★", n: saves, label: "收藏" },
    ];
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${s})`, opacity: Math.min(1, s * 1.2) }}>
            <div style={{ position: "absolute", inset: 0, background: `${P.card}EE`, boxShadow: `inset 0 0 0 3px ${P.accent}, 0 0 40px ${P.accent}33`, clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 34px), calc(100% - 34px) 100%, 0 100%)" }}>
                {/* 顶部标签 */}
                <div style={{ position: "absolute", left: 16, top: 14, display: "flex", gap: 10, fontFamily: MONO, fontSize: 18 }}>
                    <span style={{ color: P.bg, background: P.accent, padding: "2px 10px", fontWeight: 700 }}>推荐</span>
                    <span style={{ color: `${P.inkSub}` }}>关注</span>
                </div>
                {/* 画面占位：抽象人形 + 网格 */}
                <div style={{ position: "absolute", left: 16, right: 16, top: 56, height: h * 0.44, background: `${P.bg}`, overflow: "hidden", boxShadow: `inset 0 0 0 1px ${P.line}` }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${P.line} 0 1px, transparent 1px 34px), repeating-linear-gradient(90deg, ${P.line} 0 1px, transparent 1px 34px)`, opacity: 0.5 }} />
                    <Person x={w / 2 - 16} y={h * 0.22} h={150} opacity={0.9} />
                    <ScanBox t={t} from={from + 6} x={10} y={10} w={w - 36} h={h * 0.44 - 20} />
                </div>
                {/* 标题文本条 */}
                <div style={{ position: "absolute", left: 20, top: h * 0.44 + 74, display: "flex", flexDirection: "column", gap: 8 }}>
                    {[0.86, 0.62, 0.74].map((k, i) => (
                        <div key={i} style={{ width: (w - 40) * k, height: 12, background: i === 0 ? `${P.ink}CC` : `${P.inkSub}66` }} />
                    ))}
                </div>
                {/* 四计数器 */}
                <div style={{ position: "absolute", left: 20, right: 20, bottom: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    {buttons.map((b, i) => {
                        const hot = hit(t, from + hitAt + i * 8, 8);
                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, transform: `scale(${1 + hot * 0.22})` }}>
                                <span style={{ fontSize: 26, color: P.accent, textShadow: `0 0 12px ${P.accent}` }}>{b.icon}</span>
                                <span style={{ fontFamily: MONO, fontSize: 19, fontWeight: 700, color: P.ink }}>{b.n >= 10000 ? `${(b.n / 10000).toFixed(1)}w` : b.n}</span>
                                <span style={{ fontFamily: FONT, fontSize: 15, color: `${P.inkSub}` }}>{b.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ② 头像分身矩阵：一格一格点亮，越点越多
export const AvatarMatrix: React.FC<{ t: number; from: number; x: number; y: number; cols?: number; rows?: number; cell?: number; gap?: number }> = ({ t, from, x, y, cols = 7, rows = 5, cell = 62, gap = 12 }) => {
    const P = useTone();
    const w = cols * cell + (cols - 1) * gap;
    const h = rows * cell + (rows - 1) * gap;
    const total = cols * rows;
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, display: "flex", flexWrap: "wrap", gap }}>
            {Array.from({ length: total }, (_, i) => {
                const on = t >= from + i * 2;
                const s = on ? pop(t, from + i * 2, 14) : 0;
                const dupe = (i * 7) % 11 === 0;
                return (
                    <div key={i} style={{ width: cell, height: cell, background: `${P.card}`, boxShadow: `inset 0 0 0 ${dupe ? 2 : 1}px ${dupe ? P.gold : P.line}`, transform: `scale(${s})`, opacity: s, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Person x={cell / 2} y={cell / 2 + 4} h={cell * 0.74} color={dupe ? P.gold : P.accent} opacity={0.85} />
                    </div>
                );
            })}
        </div>
    );
};

// ③ 五行格：金木水土亮着，「火」被锁死
export const FiveElements: React.FC<{ t: number; from: number; x: number; y: number; cell?: number }> = ({ t, from, x, y, cell = 132 }) => {
    const P = useTone();
    const gap = 18;
    const items = ["金", "木", "水", "火", "土"];
    const w = items.length * cell + (items.length - 1) * gap;
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y, display: "flex", gap }}>
            {items.map((it, i) => {
                const locked = it === "火";
                const s = pop(t, from + i * 5, 12);
                const shake = locked ? Math.sin(t / 2.2) * 2 : 0;
                return (
                    <div key={i} style={{ position: "relative", width: cell, height: cell, transform: `translate(${shake}px, 0) scale(${s})`, opacity: s, background: `${P.card}`, boxShadow: `inset 0 0 0 3px ${locked ? P.inkSub : P.accent}, 0 0 ${locked ? 0 : 22}px ${locked ? P.line : P.accent}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: FONT, fontSize: 56, fontWeight: 700, color: locked ? `${P.inkSub}66` : P.ink, textShadow: locked ? undefined : `0 0 16px ${P.accent}88` }}>{it}</span>
                        {locked ? (
                            <>
                                <div style={{ position: "absolute", width: cell * 0.9, height: 3, background: P.seal, transform: "rotate(-28deg)", boxShadow: `0 0 12px ${P.seal}` }} />
                                <div style={{ position: "absolute", bottom: 6, fontFamily: MONO, fontSize: 13, color: P.seal, letterSpacing: 1 }}>LOCKED</div>
                            </>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
};

// ④ 热搜榜：条目按「反智度」重新排序，越蠢越往上
export const HotSearchList: React.FC<{ t: number; x: number; y: number; w?: number; items: string[]; shiftAt: number; hot?: number[] }> = ({ t, x, y, w = 520, items, shiftAt, hot }) => {
    const P = useTone();
    const rowH = 62;
    const before = items;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, color: P.accent, letterSpacing: 2 }}>热搜榜</span>
                <span style={{ fontFamily: MONO, fontSize: 16, color: P.inkSub }}>REAL-TIME · 按反智度排序</span>
            </div>
            <div style={{ position: "relative", height: items.length * rowH }}>
                {before.map((text, i) => {
                    const target = i === 0 || i === 1 ? (t >= shiftAt ? (i === 0 ? 1 : 0) : i) : i;
                    const ty = target * rowH;
                    const p = prog(t, shiftAt, 14);
                    const yy = i === 0 || i === 1 ? interpolate(p, [0, 1], [i * rowH, ty]) : i * rowH;
                    const ascend = t >= shiftAt && i === 1;
                    return (
                        <div key={i} style={{ position: "absolute", left: 0, top: yy, width: "100%", height: rowH - 8, display: "flex", alignItems: "center", gap: 14, background: `${P.card}AA`, boxShadow: `inset 0 0 0 1px ${P.line}`, paddingLeft: 14 }}>
                            <span style={{ fontFamily: MONO, fontSize: 26, fontWeight: 700, width: 34, color: ascend ? P.seal : i < 3 ? P.gold : P.inkSub }}>{target + 1}</span>
                            <span style={{ fontFamily: FONT, fontSize: 24, color: P.ink, flex: 1 }}>{text}</span>
                            <span style={{ fontFamily: MONO, fontSize: 18, color: P.accent, paddingRight: 12 }}>{`${(hot?.[i] ?? 98 - i * 7)}万`}</span>
                            {ascend ? <div style={{ position: "absolute", right: -26, fontFamily: MONO, fontSize: 15, color: P.seal, transform: "translateY(-8px)" }}>▲</div> : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// ⑤ 流量密码：抽象锁 + 密码框
export const PasswordLock: React.FC<{ t: number; from: number; x: number; y: number; w?: number; code?: string }> = ({ t, from, x, y, w = 520, code = "✳◈✜◉☰" }) => {
    const P = useTone();
    const p = prog(t, from + 10, 40);
    const chars = code.split("");
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y, width: w }}>
            <div style={{ fontFamily: MONO, fontSize: 20, color: P.inkSub, letterSpacing: 2, marginBottom: 8 }}>TRAFFIC_PASSWORD.EXE</div>
            <div style={{ position: "relative", height: 74, background: `${P.bg}`, boxShadow: `inset 0 0 0 2px ${P.accent}`, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
                {chars.map((c, i) => {
                    const on = p * chars.length > i;
                    return <span key={i} style={{ fontFamily: MONO, fontSize: 38, color: on ? P.accent : `${P.inkSub}55`, textShadow: on ? `0 0 14px ${P.accent}` : undefined }}>{on ? c : "•"}</span>;
                })}
                <span style={{ marginLeft: "auto", width: 14, height: 34, background: P.accent, opacity: Math.floor(t / 6) % 2 ? 1 : 0.15 }} />
                {/* 锁 */}
                <div style={{ position: "absolute", right: -96, top: -14, width: 78, height: 92 }}>
                    <div style={{ position: "absolute", left: 12, top: 0, width: 54, height: 42, border: `7px solid ${p >= 1 ? P.accent : P.inkSub}`, borderBottom: "none", borderRadius: "27px 27px 0 0", opacity: 0.9 }} />
                    <div style={{ position: "absolute", left: 0, top: 38, width: 78, height: 54, background: `${P.card}`, boxShadow: `inset 0 0 0 3px ${p >= 1 ? P.accent : P.inkSub}` }}>
                        <div style={{ position: "absolute", left: "50%", top: 16, width: 8, height: 22, background: p >= 1 ? P.accent : P.inkSub, transform: "translateX(-50%)" }} />
                    </div>
                    <div style={{ position: "absolute", left: -6, top: 104, width: 90, textAlign: "center", fontFamily: MONO, fontSize: 15, color: p >= 1 ? P.seal : P.inkSub }}>{p >= 1 ? "" : "C 1 0 1 1"}</div>
                </div>
            </div>
            <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 18, color: p >= 1 ? P.seal : P.inkSub, letterSpacing: 2 }}>
                {p >= 1 ? "// 抽象之锁 已上锁 · 解锁需交出全部体面" : "// 输入中…"}
            </div>
        </div>
    );
};

// ⑥ 大坝 + 引流
export const DamFlow: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; flow?: number }> = ({ t, from, x, y, w = 460, h = 250, flow = 1 }) => {
    const P = useTone();
    const s = pop(t, from, 12);
    const p = prog(t, from + 8, 34);
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h, transform: `scale(${s})`, opacity: s, background: `${P.card}CC`, boxShadow: `inset 0 0 0 2px ${P.line}`, clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%)" }}>
            <div style={{ position: "absolute", left: 14, top: 12, fontFamily: MONO, fontSize: 18, color: P.inkSub, letterSpacing: 2 }}>DAM // 梯级水电</div>
            {/* 坝体 */}
            <svg width={w} height={h} style={{ position: "absolute", left: 0, top: 0 }}>
                <path d={`M0 ${h - 30} L0 ${h - 150} L${w * 0.42} ${h - 30} Z`} fill={`${P.line}`} />
                {Array.from({ length: Math.round(p * 22) }, (_, i) => (
                    <rect key={i} x={14 + i * (w * 0.4) / 24} y={h - 40 - i * 5} width={9} height={8} fill={P.accent} opacity={0.8} />
                ))}
                <rect x={w * 0.42} y={h - 30} width={w * 0.58 * p} height={9} fill={P.accent} opacity={0.9} />
            </svg>
            {/* 引流管：越傻越粗 */}
            <div style={{ position: "absolute", left: w * 0.44, top: h - 74, width: w * 0.5, height: 12 + flow * 22, background: `${P.accent}55`, boxShadow: `inset 0 0 0 2px ${P.accent}` }} />
            <Label t={t} from={from + 30} x={w - 16} y={h - 104} text={`装傻引流量 ${(flow * 100).toFixed(0)}%`} size={20} color={P.gold} align="right" />
        </div>
    );
};

// ⑦ 水位上升到「顶流」
export const RiverRise: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; p: number; label?: string }> = ({ t, from, x, y, w = 300, h = 620, p, label = "顶流" }) => {
    const P = useTone();
    const k = Math.max(0, Math.min(1, p));
    const top = y + h * (1 - k);
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", boxShadow: `inset 0 0 0 2px ${P.line}` }}>
            {/* 水 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: top - y, bottom: 0, background: `linear-gradient(180deg, ${P.accent}66, ${P.accentDeep}44)` }}>
                {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (i * 90 + ((t * 3) % 90)) % h, height: 2, background: `${P.accentLight}66` }} />
                ))}
            </div>
            {/* 水面波纹 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: top - y - 3, height: 6, background: P.accentLight, boxShadow: `0 0 20px ${P.accent}` }} />
            {k >= 0.985 ? (
                <div style={{ position: "absolute", left: 0, right: 0, top: -2, textAlign: "center", fontFamily: FONT, fontSize: 54, fontWeight: 700, color: P.bg, background: P.accent, letterSpacing: 8, padding: "8px 0", boxShadow: `0 0 40px ${P.accent}` }}>{label}</div>
            ) : null}
            <div style={{ position: "absolute", left: 8, bottom: 8, fontFamily: MONO, fontSize: 18, color: P.ink, letterSpacing: 1 }}>{`水头 ${(k * 100).toFixed(0)}%`}</div>
        </div>
    );
};

// ⑧ 过期电子榨菜罐头堆
export const ExpiredCans: React.FC<{ t: number; from: number; x: number; y: number; n?: number }> = ({ t, from, x, y, n = 4 }) => {
    const P = useTone();
    return (
        <div style={{ position: "absolute", left: x, top: y, display: "flex", gap: 16, alignItems: "flex-end" }}>
            {Array.from({ length: n }, (_, i) => {
                const s = pop(t, from + i * 6, 12);
                return (
                    <div key={i} style={{ position: "relative", width: 104, height: 138, transform: `scale(${s})`, opacity: s, background: `${P.card}`, boxShadow: `inset 0 0 0 3px ${P.inkSub}`, clipPath: "polygon(0 8px, 8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}>
                        <div style={{ position: "absolute", left: 8, right: 8, top: 16, height: 42, background: `${P.bg}`, boxShadow: `inset 0 0 0 1px ${P.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 13, color: P.accent }}>▶ 电子榨菜</div>
                        <div style={{ position: "absolute", left: 8, right: 8, top: 68, display: "flex", flexDirection: "column", gap: 6 }}>
                            <div style={{ height: 8, background: `${P.inkSub}66` }} />
                            <div style={{ height: 8, width: "70%", background: `${P.inkSub}44` }} />
                        </div>
                        <div style={{ position: "absolute", left: 0, right: 0, bottom: 10, textAlign: "center", fontFamily: MONO, fontSize: 15, fontWeight: 700, color: P.seal, transform: "rotate(-9deg)", border: `2px solid ${P.seal}`, margin: "0 12px", letterSpacing: 1 }}>EXPIRED</div>
                    </div>
                );
            })}
        </div>
    );
};

// ⑨ 珠峰标尺 vs 道德制高点
export const MoralRuler: React.FC<{ t: number; from: number; x: number; y: number; h?: number }> = ({ t, from, x, y, h = 560 }) => {
    const P = useTone();
    const p = prog(t, from + 12, 30);
    const everest = h * 0.72;
    const moral = h * 0.72 + 90 * p;
    const mk = (top: number, label: string, value: string, c: string, left: number) => (
        <div style={{ position: "absolute", left, top: 0, width: 4, height: h, background: `${P.line}` }}>
            <div style={{ position: "absolute", left: -6, bottom: 0, width: 16, height: h - top, background: `${c}22`, boxShadow: `inset 0 0 0 2px ${c}` }} />
            <div style={{ position: "absolute", left: -10, top, width: 24, height: 4, background: c, boxShadow: `0 0 14px ${c}` }} />
            <div style={{ position: "absolute", left: 20, top: top - 34, fontFamily: MONO, fontSize: 20, color: c, whiteSpace: "nowrap", letterSpacing: 1 }}>{label}</div>
            <div style={{ position: "absolute", left: 20, top: top + 2, fontFamily: MONO, fontSize: 26, fontWeight: 700, color: c, whiteSpace: "nowrap" }}>{value}</div>
        </div>
    );
    return (
        <div style={{ position: "absolute", left: x, top: y, width: 640, height: h }}>
            {mk(h - everest, "珠穆朗玛", "8848.86 m", P.inkSub, 0)}
            {mk(h - moral, "道德制高点", `${(8848.86 + p * 2400).toFixed(0)} m`, P.accent, 300)}
            {/* 山峰剪影 */}
            <svg width={640} height={h} style={{ position: "absolute", left: 0, top: 0, opacity: 0.5 }}>
                <path d={`M-10 ${h} L120 ${h - everest} L250 ${h} Z`} fill={`${P.inkSub}33`} stroke={P.inkSub} />
            </svg>
        </div>
    );
};

// ⑩ 人体 → 条形码 扫描
export const CodeScan: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number }> = ({ t, from, x, y, w = 380, h = 480 }) => {
    const P = useTone();
    const p = prog(t, from + 8, 40);
    const bars = Math.round(p * 34);
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h }}>
            <div style={{ position: "absolute", inset: 0, background: `${P.card}88`, boxShadow: `inset 0 0 0 2px ${P.line}` }} />
            {/* 人形 → 条形码 */}
            <Person x={w / 2} y={h / 2} h={h * 0.62} opacity={1 - p} />
            <div style={{ position: "absolute", left: w * 0.12, right: w * 0.12, top: h * 0.3, height: h * 0.4, display: "flex", gap: 3, alignItems: "stretch", opacity: p }}>
                {Array.from({ length: 34 }, (_, i) => (
                    <div key={i} style={{ flex: i % 3 === 0 ? 1.6 : 0.7, background: i < bars ? P.ink : "transparent", boxShadow: i < bars ? `0 0 8px ${P.ink}55` : undefined, opacity: i < bars ? 1 : 0 }} />
                ))}
            </div>
            <ScanBox t={t} from={from} x={0} y={0} w={w} h={h} />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -40, textAlign: "center", fontFamily: MONO, fontSize: 22, color: P.accent, letterSpacing: 3 }}>
                {`HUMAN → CODE  ${(p * 100).toFixed(0)}%`}
            </div>
        </div>
    );
};

// ⑪ 情绪货币兑换机 + 电闸
export const EmotionMeter: React.FC<{ t: number; from: number; x: number; y: number; w?: number; on?: number }> = ({ t, from, x, y, w = 620, on = 0 }) => {
    const P = useTone();
    const p = prog(t, from + 10, 36);
    const lever = 1 - Math.max(0, Math.min(1, on));
    const emotions = ["愤怒", "焦虑", "对立", "恐惧"];
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y, width: w }}>
            <div style={{ fontFamily: MONO, fontSize: 20, color: P.inkSub, letterSpacing: 2, marginBottom: 12 }}>EMOTION ⇄ CURRENCY</div>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
                {/* 情绪输入 */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {emotions.map((e, i) => {
                        const s = pop(t, from + i * 5, 12);
                        return <div key={i} style={{ fontFamily: FONT, fontSize: 22, color: P.ink, background: `${P.card}`, boxShadow: `inset 0 0 0 1px ${P.line}`, padding: "4px 14px", opacity: s, transform: `translateX(${(1 - s) * -20}px)`, width: 130 }}>{e}</div>;
                    })}
                </div>
                {/* 转换管 */}
                <div style={{ position: "relative", width: 150, height: 30 }}>
                    <div style={{ position: "absolute", inset: 0, background: `${P.line}66`, boxShadow: `inset 0 0 0 2px ${P.line}` }} />
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 150 * p, background: P.gold, boxShadow: `0 0 18px ${P.gold}` }} />
                    <div style={{ position: "absolute", left: 150 * p - 6, top: -6, width: 12, height: 42, background: P.gold }} />
                </div>
                {/* 硬币输出 */}
                <div style={{ position: "relative", width: 170, height: 90 }}>
                    {Array.from({ length: 6 }, (_, i) => {
                        const s = pop(t, from + 30 + i * 4, 10);
                        return (
                            <div key={i} style={{ position: "absolute", left: (i % 3) * 56, top: Math.floor(i / 3) * 46, width: 46, height: 46, borderRadius: "50%", background: `${P.gold}22`, boxShadow: `inset 0 0 0 2px ${P.gold}`, transform: `scale(${s})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 20, color: P.gold }}>¥</div>
                        );
                    })}
                </div>
            </div>
            {/* 电闸 */}
            <div style={{ position: "absolute", right: -30, top: 210, width: 190, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: MONO, fontSize: 17, color: P.inkSub, letterSpacing: 1 }}>对立电闸</div>
                <div style={{ position: "relative", width: 120, height: 26, background: `${P.line}88`, boxShadow: `inset 0 0 0 2px ${P.line}` }}>
                    <div style={{ position: "absolute", left: lever * 88, top: -12, width: 32, height: 50, background: on > 0.5 ? P.seal : P.accent, boxShadow: `0 0 18px ${on > 0.5 ? P.seal : P.accent}`, clipPath: "polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%)" }} />
                </div>
                <div style={{ fontFamily: MONO, fontSize: 20, fontWeight: 700, color: on > 0.5 ? P.seal : P.inkSub }}>{on > 0.5 ? "ON · 短路" : "OFF"}</div>
            </div>
        </div>
    );
};

// ⑫ 直播礼物雨：跑车 / 嘉年华 / 火箭（大礼）+ 小心心 / 礼盒（小礼）自下往上升，带拖尾与连击计数
export const GiftRain: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number }> = ({ t, from, x, y, w = 1920, h = 1080 }) => {
    const P = useTone();
    const span = h + 460;
    const items = Array.from({ length: 32 }, (_, i) => {
        const kind: GiftKind = i % 7 === 0 ? "carnival" : i % 5 === 0 ? "supercar" : i % 3 === 0 ? "rocket" : i % 2 === 0 ? "heart" : "box";
        const big = kind === "carnival" || kind === "supercar" || kind === "rocket";
        const speed = big ? 2.6 : 4.2 + ((i * 17) % 22) / 10;
        const cyc = ((t - from) * speed + i * 149) % span;
        const rise = (cyc + span) % span;
        return {
            kind,
            big,
            size: big ? 116 + (i % 3) * 26 : 50 + (i % 3) * 16,
            xx: ((i * 211) % Math.round(w * 0.92)) + 50,
            yy: h + 180 - rise,
        };
    });
    const combo = Math.max(1, Math.floor((t - from) / 9));
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden" }}>
            {items.map((it, i) => {
                const on = t >= from;
                if (!on) return null;
                return (
                    <div key={i} style={{ position: "absolute", left: it.xx, top: it.yy, opacity: 0.92 }}>
                        {/* 拖尾光带 */}
                        <div style={{ position: "absolute", left: it.size * 0.42, top: it.size * 0.9, width: it.big ? 10 : 5, height: 90 + ((i * 31) % 90), background: `linear-gradient(180deg, ${it.big ? P.gold : P.accent}88, transparent)` }} />
                        <GiftIcon t={t + i * 5} kind={it.kind} size={it.size} />
                        {it.big ? (
                            <div style={{ position: "absolute", left: it.size + 4, top: it.size * 0.3, whiteSpace: "nowrap", fontFamily: FONT, fontSize: 22, fontWeight: 700, color: P.bg, background: it.kind === "carnival" ? P.seal : P.gold, padding: "3px 10px", letterSpacing: 2 }}>
                                {GIFT_NAME[it.kind]} ×{1 + (i % 5)}
                            </div>
                        ) : null}
                    </div>
                );
            })}
            {/* 连击计数 */}
            <div style={{ position: "absolute", right: 60, bottom: 40, textAlign: "right" }}>
                <div style={{ fontFamily: MONO, fontSize: 22, color: `${P.inkSub}`, letterSpacing: 3 }}>GIFT COMBO</div>
                <div style={{ fontFamily: MONO, fontSize: 62, fontWeight: 700, color: P.gold, letterSpacing: 2, textShadow: `0 0 24px ${P.gold}66` }}>连击 ×{combo}</div>
            </div>
        </div>
    );
};

// ⑭ 辣馄饨碗
export const WontonBowl: React.FC<{ t: number; from: number; x: number; y: number; r?: number }> = ({ t, from, x, y, r = 210 }) => {
    const P = useTone();
    const s = pop(t, from, 13);
    const steam = (i: number) => Math.sin(t / 11 + i * 1.7) * 16;
    return (
        <div style={{ position: "absolute", left: x - r, top: y - r * 0.42, width: r * 2, height: r * 1.1, transform: `scale(${s})`, opacity: s }}>
            {/* 热气 */}
            {[0, 1, 2].map((i) => (
                <div key={i} style={{ position: "absolute", left: r * 0.5 + i * r * 0.5, top: -70, width: 6, height: 70, background: `linear-gradient(180deg, transparent, ${P.inkSub}55)`, transform: `translateX(${steam(i)}px)`, opacity: 0.7 }} />
            ))}
            {/* 碗 */}
            <div style={{ position: "absolute", left: 0, top: r * 0.34, width: r * 2, height: r * 0.76, background: `${P.card}`, boxShadow: `inset 0 0 0 4px ${P.accent}`, clipPath: "polygon(0 0, 100% 0, 78% 100%, 22% 100%)" }} />
            {/* 汤面 + 馄饨 */}
            <div style={{ position: "absolute", left: r * 0.08, top: r * 0.34, width: r * 1.84, height: r * 0.34, background: `${P.accentDeep}55`, boxShadow: `inset 0 0 0 2px ${P.accent}` }}>
                {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} style={{ position: "absolute", left: 26 + i * (r * 0.34), top: 8 + (i % 2) * 22, width: 62, height: 44, borderRadius: "50% 50% 44% 44%", background: `${P.ink}22`, boxShadow: `inset 0 0 0 2px ${P.ink}77` }} />
                ))}
                {/* 辣油 */}
                {Array.from({ length: 9 }, (_, i) => (
                    <div key={`o${i}`} style={{ position: "absolute", left: 20 + i * 38, top: 6 + ((i * 17) % 40), width: 14, height: 14, borderRadius: "50%", background: P.seal, opacity: 0.75 }} />
                ))}
            </div>
            <div style={{ position: "absolute", left: 0, top: r * 1.16, width: r * 2, textAlign: "center", fontFamily: FONT, fontSize: 30, color: P.gold, letterSpacing: 6 }}>辣 馄 饨</div>
        </div>
    );
};

// ⑮ 通天塔 vs 胃容量
export const TowerGut: React.FC<{ t: number; from: number; x: number; y: number; h?: number }> = ({ t, from, x, y, h = 560 }) => {
    const P = useTone();
    const towerH = h * 0.62;
    const gutH = h * 0.62 * (1 + prog(t, from + 26, 26) * 0.62);
    const layers = 9;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: 760, height: h }}>
            {/* 塔 */}
            <div style={{ position: "absolute", left: 60, bottom: 90, width: 180, display: "flex", flexDirection: "column-reverse", alignItems: "center" }}>
                {Array.from({ length: layers }, (_, i) => {
                    const s = pop(t, from + i * 3, 12);
                    return <div key={i} style={{ width: 180 - i * 12, height: towerH / layers - 4, background: `${P.card}`, boxShadow: `inset 0 0 0 2px ${P.inkSub}`, opacity: s, transform: `scale(${s})` }} />;
                })}
            </div>
            <div style={{ position: "absolute", left: 20, bottom: 44, width: 260, textAlign: "center", fontFamily: MONO, fontSize: 22, color: P.inkSub, letterSpacing: 2 }}>通天塔</div>
            {/* 胃：比塔更高 */}
            <div style={{ position: "absolute", left: 380, bottom: 90, width: 280, height: gutH, background: `${P.accent}1A`, boxShadow: `inset 0 0 0 3px ${P.accent}`, borderRadius: "120px 120px 60px 60px", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: gutH * prog(t, from + 20, 30), background: `${P.accent}33` }} />
                {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} style={{ position: "absolute", left: 14, right: 14, bottom: (gutH * prog(t, from + 20, 30) * (i + 1)) / 6, height: 1, background: `${P.accent}66` }} />
                ))}
            </div>
            <div style={{ position: "absolute", left: 340, bottom: 44, width: 360, textAlign: "center", fontFamily: MONO, fontSize: 22, color: P.accent, letterSpacing: 2 }}>你的胃</div>
            <div style={{ position: "absolute", left: 380, bottom: gutH + 100, width: 280, textAlign: "center", fontFamily: MONO, fontSize: 22, color: P.accent, fontWeight: 700 }}>
                {`DEPTH ${(gutH / towerH * 100).toFixed(0)}% > TOWER`}
            </div>
        </div>
    );
};

// ⑯ 滚动数据流（背景环境件）
export const DataStream: React.FC<{ t: number; x: number; y: number; w: number; h: number; n?: number; reverse?: boolean }> = ({ t, x, y, w, h, n = 26, reverse = false }) => {
    const P = useTone();
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", opacity: 0.55 }}>
            {Array.from({ length: n }, (_, i) => {
                const sp = 60 + ((i * 29) % 90);
                const dur = h + 80;
                const off = (((t * sp) / 14 + i * 61) % dur + dur) % dur;
                return (
                    <div key={i} style={{ position: "absolute", left: (i * 97) % w, top: reverse ? dur - off - 60 : off - 60, fontFamily: MONO, fontSize: 15, color: i % 4 === 0 ? P.gold : P.accent, whiteSpace: "nowrap" }}>
                        {i % 3 === 0 ? "01011010" : i % 3 === 1 ? "▮▯▮▯▮" : "▓▒░"}
                    </div>
                );
            })}
        </div>
    );
};

// ⑰ 留言输入框（「发言」）
export const CommentBox: React.FC<{ t: number; from: number; x: number; y: number; w?: number; text?: string }> = ({ t, from, x, y, w = 760, text = "发言" }) => {
    const P = useTone();
    const p = prog(t, from, 24);
    const shown = text.slice(0, Math.ceil(p * text.length));
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y, width: w }}>
            <div style={{ height: 84, background: `${P.bg}`, boxShadow: `inset 0 0 0 2px ${P.accent}`, display: "flex", alignItems: "center", padding: "0 24px", gap: 10 }}>
                <span style={{ fontFamily: FONT, fontSize: 34, color: P.ink, letterSpacing: 2 }}>{shown}</span>
                <span style={{ width: 3, height: 40, background: P.accent, opacity: Math.floor(t / 6) % 2 ? 1 : 0.1 }} />
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 18, color: P.inkSub }}>发送</span>
            </div>
            <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 17, color: P.inkSub, letterSpacing: 1 }}>// 你能说话，但没有人会听见</div>
        </div>
    );
};

// ⑱ 数据污染泄漏（「拉稀」的 HUD 化写法）
export const DataLeak: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number }> = ({ t, from, x, y, w = 400, h = 420 }) => {
    const P = useTone();
    const on = t >= from ? Math.min(1, (t - from) / 24) : 0;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden", opacity: on }}>
            {/* 管口 */}
            <div style={{ position: "absolute", left: w / 2 - 60, top: 0, width: 120, height: 26, background: `${P.line}`, boxShadow: `inset 0 0 0 2px ${P.gold}` }} />
            <div style={{ position: "absolute", left: w / 2 - 60, top: 0, width: 120, height: 10, backgroundImage: `repeating-linear-gradient(45deg, ${P.gold} 0 8px, ${P.bg} 8px 16px)` }} />
            {/* 喷出的乱码 */}
            {Array.from({ length: 40 }, (_, i) => {
                const off = ((t - from) * (2 + (i % 5)) * 1.4 + i * 53) % h;
                const cx = w / 2 + (Math.sin(i * 3.1 + t / 20) * w * 0.34 * (off / h)) * 1.6;
                return (
                    <div key={i} style={{ position: "absolute", left: cx, top: off, fontFamily: MONO, fontSize: 18, color: i % 5 === 0 ? P.seal : P.gold, opacity: 0.8 * (1 - off / h) }}>
                        {["▒", "▓", "░", "✕", "#"][i % 5]}
                    </div>
                );
            })}
            <div style={{ position: "absolute", left: 0, bottom: 0, right: 0, fontFamily: MONO, fontSize: 22, color: P.seal, letterSpacing: 2, textAlign: "center" }}>DATA LEAK · 内容降级</div>
        </div>
    );
};

// ⑲ 复活币投币机
export const ReviveCoin: React.FC<{ t: number; from: number; x: number; y: number }> = ({ t, from, x, y }) => {
    const P = useTone();
    const p = prog(t, from + 10, 30);
    return (
        <div style={{ position: "absolute", left: x - 150, top: y, width: 300 }}>
            <div style={{ position: "relative", height: 260, background: `${P.card}`, boxShadow: `inset 0 0 0 3px ${P.accent}` , clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}>
                <div style={{ position: "absolute", left: 20, top: 18, fontFamily: MONO, fontSize: 20, color: P.inkSub, letterSpacing: 2 }}>RESPAWN</div>
                <div style={{ position: "absolute", left: 0, right: 0, top: 66, textAlign: "center" }}>
                    {Array.from({ length: 6 }, (_, i) => (
                        <div key={i} style={{ display: "inline-block", margin: 6, width: 58, height: 58, borderRadius: "50%", background: `${P.gold}1A`, boxShadow: `inset 0 0 0 2px ${P.gold}`, opacity: t >= from + i * 5 ? 1 : 0.15, transform: `scale(${t >= from + i * 5 ? 1 : 0.8})`, fontFamily: MONO, fontSize: 22, color: P.gold, lineHeight: "58px" }}>R</div>
                    ))}
                </div>
                {/* 投币口 */}
                <div style={{ position: "absolute", left: 90, bottom: 22, width: 120, height: 12, background: `${P.bg}`, boxShadow: `inset 0 0 0 2px ${P.inkSub}` }} />
                {/* 下落的币 */}
                <div style={{ position: "absolute", left: 144, top: 100 + p * 110, width: 24, height: 24, borderRadius: "50%", background: P.gold, boxShadow: `0 0 14px ${P.gold}` }} />
            </div>
            <div style={{ marginTop: 12, textAlign: "center", fontFamily: FONT, fontSize: 20, color: P.inkSub, letterSpacing: 2 }}>为了短视频 · 寻找复活币</div>
        </div>
    );
};

// ⑳ 地质年代表盘（反向旋转）
export const EraDial: React.FC<{ t: number; from: number; x: number; y: number; r?: number }> = ({ t, from, x, y, r = 250 }) => {
    const P = useTone();
    const eras = ["2026", "全新世", "侏罗纪", "三叠纪"];
    const p = prog(t, from + 12, 60);
    const ang = -90 - p * 270;
    return (
        <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2 }}>
            <svg width={r * 2} height={r * 2} style={{ position: "absolute", inset: 0 }}>
                <circle cx={r} cy={r} r={r - 10} fill="none" stroke={P.line} strokeWidth={2} />
                <circle cx={r} cy={r} r={r - 46} fill="none" stroke={P.line} strokeWidth={1} />
                {Array.from({ length: 60 }, (_, i) => {
                    const a = (i / 60) * Math.PI * 2;
                    const long = i % 5 === 0;
                    return <line key={i} x1={r + Math.cos(a) * (r - 10)} y1={r + Math.sin(a) * (r - 10)} x2={r + Math.cos(a) * (r - (long ? 34 : 22))} y2={r + Math.sin(a) * (r - (long ? 34 : 22))} stroke={long ? P.inkSub : P.line} strokeWidth={long ? 3 : 1.5} />;
                })}
                {eras.map((e, i) => {
                    const a = (-Math.PI / 2) + (i / (eras.length - 1)) * (-Math.PI * 1.5);
                    return <text key={i} x={r + Math.cos(a) * (r - 74)} y={r + Math.sin(a) * (r - 74)} fill={i === eras.length - 1 ? P.seal : P.inkSub} fontSize={22} fontFamily='"Consolas",monospace' textAnchor="middle" dominantBaseline="middle">{e}</text>;
                })}
                {/* 指针 */}
                <g transform={`rotate(${ang} ${r} ${r})`}>
                    <line x1={r} y1={r} x2={r} y2={40} stroke={P.accent} strokeWidth={5} />
                    <polygon points={`${r},28 ${r - 12},52 ${r + 12},52`} fill={P.accent} />
                </g>
                {/* 恐龙剪影 */}
                <path d={`M${r - 26} ${r + 30} l22 -26 l10 4 l6 -14 l8 16 l16 8 l-10 6 l4 12 l-14 -6 l-20 8 l-14 -8 Z`} fill={p > 0.75 ? P.accent : "transparent"} opacity={0.9} />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, top: r - 22, textAlign: "center", fontFamily: MONO, fontSize: 30, fontWeight: 700, color: p > 0.75 ? P.seal : P.accent, letterSpacing: 2 }}>
                {p < 0.34 ? "2026" : p < 0.68 ? "侏罗纪" : "三叠纪"}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: r - 60, textAlign: "center", fontFamily: MONO, fontSize: 19, color: P.inkSub, letterSpacing: 2 }}>ERA REWIND · 社会倒退</div>
        </div>
    );
};

// ㉑ 盘古开天地（劈开后冻结 + CANCELLED）
export const PanguSplit: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; cancelAt: number }> = ({ t, from, x, y, w = 1100, h = 560, cancelAt }) => {
    const P = useTone();
    const p = prog(t, from + 8, 34);
    const gap = p * 150;
    const cancelled = t >= cancelAt;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
            {/* 天 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: -gap * 0.9, height: h / 2, background: `${P.accent}14`, boxShadow: `inset 0 0 0 2px ${P.accent}66`, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 16, fontFamily: FONT, fontSize: 40, color: P.accent, letterSpacing: 12 }}>天</div>
            {/* 地 */}
            <div style={{ position: "absolute", left: 0, right: 0, top: h / 2 + gap * 0.9, height: h / 2, background: `${P.inkSub}14`, boxShadow: `inset 0 0 0 2px ${P.inkSub}66`, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 16, fontFamily: FONT, fontSize: 40, color: P.inkSub, letterSpacing: 12 }}>地</div>
            {/* 斧 */}
            <div style={{ position: "absolute", left: "50%", top: h / 2 - 200, width: 26, height: 400, background: P.gold, transform: `translateX(-50%) rotate(${(1 - prog(t, from + 4, 22)) * 62}deg)`, boxShadow: `0 0 30px ${P.gold}` }} />
            {cancelled ? (
                <div style={{ position: "absolute", left: 0, right: 0, top: h / 2 - 58, textAlign: "center", fontFamily: MONO, fontSize: 76, fontWeight: 700, color: P.seal, letterSpacing: 10, textShadow: `0 0 30px ${P.seal}`, transform: `scale(${pop(t, cancelAt, 10)})` }}>
                    CANCELLED
                </div>
            ) : null}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -46, textAlign: "center", fontFamily: MONO, fontSize: 22, color: P.inkSub, letterSpacing: 3 }}>
                {cancelled ? "// 开天辟地 已取消" : "// 开天辟地 进行中…"}
            </div>
        </div>
    );
};

// ㉒ 钱雨（不属于你的钱）
export const MoneyRain: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number; n?: number }> = ({ t, from, x, y, w = 1200, h = 520, n = 22 }) => {
    const P = useTone();
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, overflow: "hidden" }}>
            {Array.from({ length: n }, (_, i) => {
                const sp = 34 + ((i * 41) % 50);
                const off = (((t - from) * sp * 0.08 + i * 71) % (h + 120) + h + 120) % (h + 120);
                return (
                    <div key={i} style={{ position: "absolute", left: (i * 149) % w, top: off - 120, width: 26, height: 40, background: `${P.gold}CC`, boxShadow: `inset 0 0 0 2px ${P.gold}`, transform: `rotate(${Math.sin(t / 12 + i) * 18}deg)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontSize: 18, color: P.bg, opacity: t >= from ? 1 : 0 }}>¥</div>
                );
            })}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, textAlign: "center", fontFamily: MONO, fontSize: 22, color: P.gold, letterSpacing: 3, opacity: t >= from ? 1 : 0 }}>// 不属于你的钱</div>
        </div>
    );
};

// ㉓ 平台 offer 弹窗
export const OfferPopup: React.FC<{ t: number; from: number; x: number; y: number; title?: string; lines: string[]; color?: string }> = ({ t, from, x, y, title = "就业机会 × 1", lines, color }) => {
    const P = useTone();
    const s = pop(t, from, 13);
    const w = 620;
    const h = 100 + lines.length * 42;
    return (
        <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h, transform: `scale(${s})`, opacity: Math.min(1, s * 1.2), background: `${P.bg}EE`, boxShadow: `inset 0 0 0 3px ${color ?? P.accent}`, clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%)" }}>
            <div style={{ height: 52, background: `${color ?? P.accent}22`, display: "flex", alignItems: "center", padding: "0 20px", fontFamily: FONT, fontSize: 24, fontWeight: 700, color: color ?? P.accent, letterSpacing: 2 }}>
                {title}
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 20, color: P.inkSub }}>✕</span>
            </div>
            <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
                {lines.map((l, i) => (
                    <div key={i} style={{ fontFamily: MONO, fontSize: 22, color: P.ink, letterSpacing: 1, opacity: t >= from + 8 + i * 6 ? 1 : 0.15 }}>
                        <span style={{ color: color ?? P.accent }}>▸ </span>
                        {l}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ㉔ 狐狸成精（数据流里竖起耳朵的剪影）
export const FoxSpirit: React.FC<{ t: number; from: number; x: number; y: number; size?: number }> = ({ t, from, x, y, size = 300 }) => {
    const P = useTone();
    const p = prog(t, from + 10, 40);
    const s = pop(t, from, 12);
    return (
        <div style={{ position: "absolute", left: x, top: y, width: size, height: size, transform: `scale(${s})`, opacity: Math.min(1, s * 1.1) }}>
            <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
                {/* 头 */}
                <path d="M50 34 L32 12 L36 38 Z" fill={P.accent} opacity={0.85} />
                <path d="M50 34 L68 12 L64 38 Z" fill={P.accent} opacity={0.85} />
                <ellipse cx="50" cy="52" rx="24" ry="19" fill={`${P.accent}33`} stroke={P.accent} strokeWidth="2" />
                <path d="M28 58 L10 76 L40 70 L50 84 L60 70 L90 76 L72 58 Z" fill={`${P.accent}22`} stroke={P.accent} strokeWidth="2" />
                {/* 眼 */}
                <ellipse cx="41" cy="49" rx="4" ry={2 + p * 4} fill={P.bg} stroke={P.accent} strokeWidth="1.5" />
                <ellipse cx="59" cy="49" rx="4" ry={2 + p * 4} fill={P.bg} stroke={P.accent} strokeWidth="1.5" />
                {/* 尾 */}
                <path d={`M74 62 q${18 + p * 14} 6 ${10 + p * 6} -22`} fill="none" stroke={P.accent} strokeWidth="6" opacity={0.7} />
            </svg>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -18, textAlign: "center", fontFamily: MONO, fontSize: 20, color: P.accent, letterSpacing: 2 }}>
                {`SPIRIT.EXE ${(p * 100).toFixed(0)}%`}
            </div>
        </div>
    );
};

// ㉕ 判决清单（逐条盖章）
export const VerdictList: React.FC<{ t: number; x: number; y: number; w?: number; items: { label: string; verdict: string; at: number }[] }> = ({ t, x, y, w = 1080, items }) => {
    const P = useTone();
    const rowH = 82;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w }}>
            {items.map((it, i) => {
                const on = t >= it.at;
                const stamped = t >= it.at + 18;
                const s = on ? pop(t, it.at, 13) : 0;
                return (
                    <div key={i} style={{ position: "relative", height: rowH - 10, marginBottom: 10, display: "flex", alignItems: "center", gap: 20, paddingLeft: 22, background: `${P.card}CC`, boxShadow: `inset 0 0 0 1.5px ${P.line}`, opacity: Math.min(1, s * 1.3), transform: `translateX(${(1 - s) * 40}px)` }}>
                        <span style={{ fontFamily: MONO, fontSize: 24, color: P.inkSub, width: 34 }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ fontFamily: FONT, fontSize: 30, color: P.ink, flex: 1 }}>{it.label}</span>
                        <span style={{ fontFamily: MONO, fontSize: 20, color: P.inkSub, letterSpacing: 2, marginRight: 24 }}>判决</span>
                        <span style={{ fontFamily: FONT, fontSize: 34, fontWeight: 700, color: P.accent, letterSpacing: 4, marginRight: 216, minWidth: 110, textAlign: "center", textShadow: `0 0 16px ${P.accent}66` }}>{it.verdict}</span>
                        {stamped ? (
                            <div style={{ position: "absolute", right: 22, top: rowH / 2 - 38, width: 168, height: 56, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 0 3px ${P.seal}`, color: P.seal, fontFamily: FONT, fontSize: 26, fontWeight: 700, letterSpacing: 4, transform: `rotate(-9deg) scale(${pop(t, it.at + 18, 9) * (1 + hit(t, it.at + 18, 5) * 0.12)})`, opacity: Math.min(1, pop(t, it.at + 18, 10) * 1.35), textShadow: `0 0 14px ${P.seal}66` }}>
                                已 执 行
                            </div>
                        ) : null}
                    </div>
                );
            })}
            <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 18, color: P.inkSub, letterSpacing: 2 }}>
                // 判决不具法律效力 · 仅为画面符号
            </div>
        </div>
    );
};

// ㉖ 全片关机序列（Zero 幕）
export const ZeroOverlay: React.FC<{ t: number; from: number; lines: string[] }> = ({ t, from, lines }) => {
    const P = useTone();
    return (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: MONO }}>
                {lines.map((l, i) => {
                    const on = t >= from + i * 7;
                    if (!on) return null;
                    return (
                        <div key={i} style={{ fontSize: 26, letterSpacing: 3, color: i === lines.length - 1 ? P.seal : P.inkSub, opacity: pop(t, from + i * 7, 14), marginBottom: 10 }}>
                            <span style={{ color: P.accent }}>&gt; </span>
                            {l}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
