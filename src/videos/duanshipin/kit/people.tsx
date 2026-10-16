import React from "react";
import { CL, pop } from "../../../shared";
import { interpolate } from "remotion";
import { FONT, MONO, useTone } from "../../../styles/cyberhud-dual";

// 人物类素材：博尔特 city walk、揽佬旁白。全部 HUD 线框，不使用真人素材。

/* ========================= 博尔特 city walk ========================= */

// 侧视 HUD 线框人 + 横向滚动的城市天际线。笑点在「慢」：一个两步循环 48 帧。
export const BoltCityWalk: React.FC<{ t: number; from: number; x: number; y: number; w?: number; h?: number }> = ({ t, from, x, y, w = 1040, h = 560 }) => {
    const P = useTone();
    const s = pop(t, from, 12);
    const groundY = h - 86;
    const ph = ((t - from) / 48) * Math.PI * 2;
    const bob = -Math.abs(Math.sin(ph)) * 4;
    const cx = w * 0.36;
    const hipY = groundY - 122 + bob;
    const shY = hipY - 96;

    const LEG1 = 60;
    const LEG2 = 60;
    const leg = (phase: number) => {
        const a1 = 0.55 * Math.sin(phase);
        const a2 = a1 - 0.85 * Math.max(0, -Math.cos(phase));
        const knee = { x: cx + Math.sin(a1) * LEG1, y: hipY + Math.cos(a1) * LEG1 };
        const foot = { x: knee.x + Math.sin(a2) * LEG2, y: knee.y + Math.cos(a2) * LEG2 };
        return { knee, foot };
    };
    const arm = (phase: number) => {
        const b = -0.5 * Math.sin(phase);
        const c = b - 0.55 * Math.max(0, Math.sin(phase));
        const el = { x: cx + Math.sin(b) * 46, y: shY + Math.cos(b) * 46 };
        const hand = { x: el.x + Math.sin(c) * 44, y: el.y + Math.cos(c) * 44 };
        return { el, hand };
    };
    const L1 = leg(ph);
    const L2 = leg(ph + Math.PI);
    const A1 = arm(ph + Math.PI);
    const A2 = arm(ph);

    const buildings = Array.from({ length: 14 }, (_, i) => ({
        x: (((i * 138 - (t - from) * 0.32) % (w + 260)) + w + 260) % (w + 260) - 130,
        bw: 62 + ((i * 37) % 54),
        bh: 90 + ((i * 71) % 190),
    }));

    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `scale(${s})`, opacity: s }}>
            {/* 城市天际线 */}
            <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
                {buildings.map((b, i) => (
                    <g key={i} opacity={0.55}>
                        <rect x={b.x} y={groundY - b.bh} width={b.bw} height={b.bh} fill={`${P.card}`} stroke={`${P.inkSub}66`} strokeWidth="1.5" />
                        {Array.from({ length: Math.floor(b.bh / 46) }, (_, r) =>
                            Array.from({ length: 2 }, (_, c) => (
                                <rect key={`${r}-${c}`} x={b.x + 12 + c * 24} y={groundY - b.bh + 12 + r * 42} width={12} height={16} fill={(i + r + c) % 3 === 0 ? `${P.accent}88` : `${P.inkSub}44`} />
                            )),
                        )}
                    </g>
                ))}
                <line x1="0" y1={groundY} x2={w} y2={groundY} stroke={P.accent} strokeWidth="2.5" opacity={0.85} />
                {Array.from({ length: 26 }, (_, i) => (
                    <line key={i} x1={((i * 44 - (t - from) * 1.6) % w + w) % w} y1={groundY} x2={((i * 44 - (t - from) * 1.6) % w + w) % w - 22} y2={groundY + 22} stroke={`${P.accent}44`} strokeWidth="2" />
                ))}
            </svg>

            {/* 人：躯干 + 头 + 四肢 */}
            <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
                <ellipse cx={cx} cy={groundY + 6} rx={92} ry={12} fill={`${P.accent}22`} />
                {/* 腿 */}
                {[L1, L2].map((L, i) => (
                    <g key={i}>
                        <line x1={cx} y1={hipY} x2={L.knee.x} y2={L.knee.y} stroke={P.ink} strokeWidth="13" strokeLinecap="round" />
                        <line x1={L.knee.x} y1={L.knee.y} x2={L.foot.x} y2={L.foot.y} stroke={P.ink} strokeWidth="11" strokeLinecap="round" />
                        <line x1={L.foot.x - 14} y1={L.foot.y + 3} x2={L.foot.x + 20} y2={L.foot.y + 3} stroke={P.gold} strokeWidth="8" strokeLinecap="round" />
                    </g>
                ))}
                {/* 躯干 */}
                <line x1={cx} y1={hipY} x2={cx} y2={shY} stroke={P.ink} strokeWidth="17" strokeLinecap="round" />
                <line x1={cx} y1={hipY} x2={cx} y2={shY} stroke={P.accent} strokeWidth="3" strokeLinecap="round" opacity={0.6} />
                {/* 手臂 */}
                {[A1, A2].map((A, i) => (
                    <g key={i}>
                        <line x1={cx} y1={shY + 6} x2={A.el.x} y2={A.el.y} stroke={P.ink} strokeWidth="10" strokeLinecap="round" />
                        <line x1={A.el.x} y1={A.el.y} x2={A.hand.x} y2={A.hand.y} stroke={P.ink} strokeWidth="9" strokeLinecap="round" />
                    </g>
                ))}
                {/* 头 */}
                <circle cx={cx} cy={shY - 34} r="27" fill={`${P.card}`} stroke={P.ink} strokeWidth="5" />
                <path d={`M ${cx - 27} ${shY - 40} A 27 27 0 0 1 ${cx + 27} ${shY - 40}`} fill={P.accent} opacity={0.85} />
                {/* 号码布 */}
                <rect x={cx + 10} y={shY + 14} width={30} height={22} fill={`${P.gold}33`} stroke={P.gold} strokeWidth="2" />
                <text x={cx + 25} y={shY + 31} fill={P.gold} fontSize="15" fontFamily='"Consolas",monospace' textAnchor="middle">9.58</text>
            </svg>

            {/* 标签：CITY WALK + 配速 */}
            <div style={{ position: "absolute", left: cx - 30, top: shY - 130, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 700, color: P.bg, background: P.accent, padding: "4px 16px", letterSpacing: 4 }}>CITY WALK</span>
                <span style={{ fontFamily: MONO, fontSize: 24, color: P.gold, letterSpacing: 2 }}>配速 5.2 km/h</span>
            </div>
            <div style={{ position: "absolute", left: cx - 30, top: shY - 84, fontFamily: MONO, fontSize: 18, color: P.inkSub, letterSpacing: 2 }}>
                步频 28 步/分 · 全程 {((t - from) / 30 / 60 * 5.2).toFixed(2)} km
            </div>

            {/* 右侧：与算法的对比（加暗底保证在城市剪影上也读得清） */}
            <div style={{ position: "absolute", right: -20, top: h * 0.26, width: w * 0.44, padding: "22px 24px", background: `${P.bg}E6`, boxShadow: `inset 0 0 0 2px ${P.line}`, clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)", display: "flex", flexDirection: "column", gap: 26 }}>
                <div style={{ fontFamily: MONO, fontSize: 18, color: `${P.inkSub}`, letterSpacing: 3 }}>SPEED COMPARISON</div>
                <CmpRow label="博尔特 100m（当年）" value="9.58 s" p={0.08} />
                <CmpRow label="博尔特 city walk（现在）" value="5.2 km/h" p={0.05} />
                <CmpRow label="算法 run the world" value="∞ / 0.02s" p={interpolate(t, [from + 20, from + 150], [0, 1], CL)} accent />
            </div>

            <div style={{ position: "absolute", left: 0, bottom: 6, fontFamily: MONO, fontSize: 20, color: `${P.ink}CC`, letterSpacing: 3, background: `${P.bg}CC`, padding: "4px 12px" }}>
                OLYMPIC RECORD 9.58s → NOW: CITY WALK · 我的家人们
            </div>
        </div>
    );
};

const CmpRow: React.FC<{ label: string; value: string; p: number; accent?: boolean }> = ({ label, value, p, accent = false }) => {
    const P = useTone();
    const c = accent ? P.accent : P.inkSub;
    const k = Math.min(1, Math.max(0, p));
    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 21, color: P.inkSub, letterSpacing: 2, marginBottom: 6 }}>
                <span>{label}</span>
                <span style={{ color: c, fontWeight: 700 }}>{value}</span>
            </div>
            <div style={{ position: "relative", width: "100%", height: 18, background: `${P.line}66`, boxShadow: `inset 0 0 0 1.5px ${P.line}` }}>
                <div style={{ width: `${k * 100}%`, height: "100%", background: c, boxShadow: accent ? `0 0 16px ${c}AA` : undefined }} />
                <div style={{ position: "absolute", left: `calc(${k * 100}% - 8px)`, top: -20, fontFamily: FONT, fontSize: 20, color: c }}>⚑</div>
            </div>
        </div>
    );
};

/* ========================== 揽佬旁白 ========================== */

// HUD 线框头肩像：黑色棒球帽 + 墨镜（对齐源视频里揽佬的造型）+ 手持麦克风。
// 因为旁白没有歌词表，配一条「现场转写」字幕滚屏，只写极通用的短句。
const SPEECH = ["谢谢啊", "家人们听我说", "就这样吧", "不多说了"];

export const LanlaoVoice: React.FC<{ t: number; from: number; x: number; y: number; size?: number }> = ({ t, from, x, y, size = 420 }) => {
    const P = useTone();
    const s = pop(t, from, 13);
    const talking = t >= from;
    const mouth = 4 + Math.abs(Math.sin(t / 5)) * 11;
    const brow = Math.sin(t / 3.3);
    // 幕首帧 t 可能为负（入场转场那 12 帧），必须先夹到 0，否则负下标会取到 undefined
    const base = Math.max(0, t - from);
    const idx = Math.floor(base / 54) % SPEECH.length;
    const bubble = SPEECH[idx];
    const typing = Math.min(bubble.length, Math.floor((base % 54) / 6) + 1);

    const w = size;
    const h = size * 1.12;
    return (
        <div style={{ position: "absolute", left: x, top: y, width: w, height: h, transform: `scale(${s})`, opacity: s * (0.4 + Math.min(1, base / 20) * 0.6) }}>
            <svg width={w} height={h} style={{ position: "absolute", inset: 0 }} viewBox="0 0 100 112">
                {/* 肩 */}
                <path d="M 12 112 C 18 84 32 72 50 72 C 68 72 82 84 88 112 Z" fill={`${P.card}`} stroke={P.inkSub} strokeWidth="1.6" />
                <path d="M 30 112 L 34 92 M 70 112 L 66 92" stroke={P.line} strokeWidth="1.2" />
                {/* 颈 */}
                <rect x="44" y="62" width="12" height="14" fill={`${P.card}`} stroke={P.inkSub} strokeWidth="1.4" />
                {/* 头 */}
                <ellipse cx="50" cy="42" rx="21" ry="24" fill={`${P.card}`} stroke={P.ink} strokeWidth="1.8" />
                {/* 黑色棒球帽：帽顶 + 前檐 */}
                <path d="M 29 36 C 30 20 40 12 50 12 C 60 12 70 20 71 36 Z" fill="#12141A" stroke={P.ink} strokeWidth="1.6" />
                <path d="M 24 37 C 34 41 52 42 72 37 L 72 40 C 52 46 32 45 24 40 Z" fill="#1B1E26" stroke={P.inkSub} strokeWidth="1.2" />
                <path d="M 68 34 C 82 33 92 36 96 41 C 90 43 78 42 70 39 Z" fill="#12141A" stroke={P.inkSub} strokeWidth="1.2" />
                {/* 墨镜 */}
                <rect x="31" y="36" width="17" height="11" rx="5" fill="#0B0D12" stroke={P.accent} strokeWidth="1.6" />
                <rect x="52" y="36" width="17" height="11" rx="5" fill="#0B0D12" stroke={P.accent} strokeWidth="1.6" />
                <line x1="48" y1="40" x2="52" y2="40" stroke={P.accent} strokeWidth="1.6" />
                <path d="M 31 38 L 26 36 M 69 38 L 74 36" stroke={P.accent} strokeWidth="1.4" opacity={0.7} />
                {/* 口型（说话） */}
                <rect x={50 - 6} y={56} width={12} height={talking ? mouth : 3} rx={2.5} fill={P.accent} opacity={talking ? 0.95 : 0.35} />
                {/* 眉/鼻（轻微起伏，避免死板） */}
                <path d={`M ${38} ${52 + brow} L ${46} ${51 + brow}`} stroke={P.inkSub} strokeWidth="1.2" />
                <path d={`M ${54} ${51 + brow} L ${62} ${52 + brow}`} stroke={P.inkSub} strokeWidth="1.2" />
                <path d="M 50 46 L 50 53" stroke={P.inkSub} strokeWidth="1.1" />
                {/* 右手举麦 */}
                <path d="M 82 96 C 78 84 74 78 70 74" fill="none" stroke={P.inkSub} strokeWidth="4" strokeLinecap="round" />
                <rect x="60" y="60" width="7" height="16" rx="3" fill={`${P.line}`} stroke={P.inkSub} strokeWidth="1.3" />
                <circle cx="63.5" cy="58" r="4.5" fill={`${P.card}`} stroke={P.accent} strokeWidth="1.5" />
            </svg>

            {/* 声波 */}
            <div style={{ position: "absolute", right: 6, top: h * 0.46, display: "flex", alignItems: "center", gap: 3, height: 54 }}>
                {Array.from({ length: 7 }, (_, i) => {
                    const a = Math.abs(Math.sin(t / 4.5 + i * 0.7));
                    return <div key={i} style={{ width: 4, height: 6 + a * 46, background: P.accent, opacity: 0.45 + a * 0.55, boxShadow: `0 0 8px ${P.accent}66` }} />;
                })}
            </div>

            {/* 名牌 + 状态 */}
            <div style={{ position: "absolute", left: 0, top: 0, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 700, color: P.bg, background: P.accent, padding: "3px 14px", letterSpacing: 4 }}>揽佬</span>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: MONO, fontSize: 17, color: P.seal, letterSpacing: 2 }}>
                    <span style={{ width: 8, height: 8, background: P.seal, opacity: Math.floor(t / 8) % 2 ? 1 : 0.25 }} />
                    旁白 / NARRATING
                </span>
            </div>

            {/* 现场转写字幕（旁白无歌词表，只写通用短句） */}
            <div style={{ position: "absolute", left: 0, right: 0, bottom: -6, display: "flex", alignItems: "center", gap: 8, fontFamily: MONO, fontSize: 20, color: `${P.ink}CC`, letterSpacing: 1, background: `${P.bg}CC`, padding: "6px 12px", boxShadow: `inset 0 0 0 1.5px ${P.line}`, whiteSpace: "nowrap", overflow: "hidden" }}>
                <span style={{ color: P.accent, fontSize: 15 }}>ASR</span>
                <span>{bubble.slice(0, typing)}</span>
                <span style={{ width: 3, height: 20, background: P.accent, opacity: Math.floor(t / 6) % 2 ? 1 : 0.1 }} />
                <span style={{ color: `${P.inkSub}`, fontSize: 15, marginLeft: "auto" }}>转写中</span>
            </div>
        </div>
    );
};
