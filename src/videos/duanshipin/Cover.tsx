import React from "react";
import { FiveElements, GiftIcon, type GiftKind, P, PR } from "./kit";

// 封面（纯静态 Still：只画静态底纹与元素，不碰 useT / useAt / useBeat 等节拍 context）。
// 结构：左半冷监控青 / 右半警报红 → 上部手机信息流 + 礼物撒满 + 判决条与热搜榜 → 中部全宽标题板（超大青红错位标题）→ 底部五行格与数据条。
const GRID = (c: string) => `repeating-linear-gradient(0deg, ${c} 0 1px, transparent 1px 92px), repeating-linear-gradient(90deg, ${c} 0 1px, transparent 1px 92px)`;

// 礼物散布（固定坐标，保证 Still 每次一致）；左半走冷色、右半走红金
const GIFTS: { kind: GiftKind; x: number; y: number; s: number; hot: boolean }[] = [
    { kind: "carnival", x: 470, y: 138, s: 150, hot: false },
    { kind: "rocket", x: 662, y: 168, s: 112, hot: false },
    { kind: "heart", x: 842, y: 132, s: 70, hot: false },
    { kind: "box", x: 980, y: 158, s: 92, hot: true },
    { kind: "supercar", x: 1082, y: 146, s: 130, hot: true },
    { kind: "heart", x: 478, y: 336, s: 78, hot: false },
    { kind: "rocket", x: 618, y: 356, s: 102, hot: false },
    { kind: "carnival", x: 796, y: 300, s: 142, hot: false },
    { kind: "box", x: 1002, y: 326, s: 88, hot: true },
    { kind: "supercar", x: 700, y: 472, s: 130, hot: false },
    { kind: "heart", x: 942, y: 466, s: 72, hot: true },
    { kind: "rocket", x: 1122, y: 430, s: 96, hot: true },
];

// 数据流颗粒（固定坐标）
const DUST = Array.from({ length: 34 }, (_, i) => ({
    x: (i * 173) % 1820 + 60,
    y: ((i * 271) % 900) + 90,
    w: 40 + (i % 4) * 30,
    hot: ((i * 173) % 1820) > 960,
    tall: i % 5 === 0,
}));

export const Cover: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, background: "#05070C", fontFamily: '"Consolas","Microsoft YaHei",monospace', overflow: "hidden" }}>
        {/* 双段底色 */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1080, background: `radial-gradient(ellipse at 30% 40%, ${P.bgAlt} 0%, ${P.bg} 68%)` }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 900, background: `radial-gradient(ellipse at 70% 40%, ${PR.bgAlt} 0%, ${PR.bg} 68%)` }} />
        <div style={{ position: "absolute", left: 1060, top: 0, bottom: 0, width: 40, background: `linear-gradient(90deg, #0000, ${PR.accent}, #0000)`, opacity: 0.55 }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRID("#1E2C48"), opacity: 0.3 }} />

        {/* 数据流颗粒 + 扫描线 */}
        {DUST.map((d, i) => (
            <div key={i} style={{ position: "absolute", left: d.x, top: d.y, width: d.tall ? 5 : d.w, height: d.tall ? 60 : 5, background: d.hot ? PR.accent : P.accent, opacity: d.tall ? 0.28 : 0.42 }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: 596, height: 2, background: `linear-gradient(90deg, ${P.accent}00, ${P.accent}AA, ${PR.accent}AA, ${PR.accent}00)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 900, height: 1, background: "#1E2C4866" }} />

        {/* 左：手机信息流（缩排上移给标题板让位） */}
        <div style={{ position: "absolute", left: 110, top: 150, width: 300, height: 452, background: `${P.card}EE`, boxShadow: `inset 0 0 0 3px ${P.accent}, 0 0 44px ${P.accent}33`, clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%)" }}>
            <div style={{ position: "absolute", left: 16, top: 14, fontSize: 18, color: P.bg, background: P.accent, padding: "2px 10px", fontWeight: 700 }}>推荐</div>
            <div style={{ position: "absolute", left: 16, right: 16, top: 56, height: 196, background: P.bg, boxShadow: `inset 0 0 0 1px ${P.line}`, overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: GRID(P.line), opacity: 0.6 }} />
                <div style={{ position: "absolute", left: "50%", top: 28, width: 50, height: 50, borderRadius: "50%", transform: "translateX(-50%)", background: `${P.accent}33`, boxShadow: `inset 0 0 0 2px ${P.accent}` }} />
                <div style={{ position: "absolute", left: "50%", top: 82, width: 122, height: 106, transform: "translateX(-50%)", background: `${P.accent}22`, boxShadow: `inset 0 0 0 2px ${P.accent}`, clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }} />
            </div>
            <div style={{ position: "absolute", left: 20, top: 268, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ width: 210, height: 12, background: `${P.ink}CC` }} />
                <div style={{ width: 150, height: 12, background: `${P.inkSub}66` }} />
            </div>
            <div style={{ position: "absolute", left: 20, right: 20, bottom: 24, display: "flex", justifyContent: "space-between", fontFamily: '"Consolas",monospace', fontSize: 19, color: P.accent }}>
                {["♥ 128.4w", "▤ 3.2w", "⇄ 9.1w", "★ 2.7w"].map((s, i) => (
                    <span key={i}>{s}</span>
                ))}
            </div>
        </div>

        {/* 中：礼物撒满 */}
        {GIFTS.map((g, i) => (
            <div key={i} style={{ position: "absolute", left: g.x, top: g.y }}>
                <GiftIcon t={12 + i * 7} kind={g.kind} size={g.s} color={g.hot ? PR.accent : P.accent} />
            </div>
        ))}

        {/* 右上：判决条 */}
        <div style={{ position: "absolute", right: 120, top: 150, width: 560, display: "flex", flexDirection: "column", gap: 14 }}>
            {[
                { l: "造谣", v: "枪毙" },
                { l: "营销号", v: "活埋" },
                { l: "矩阵号", v: "加税" },
            ].map((it, i) => (
                <div key={i} style={{ position: "relative", height: 74, display: "flex", alignItems: "center", gap: 18, paddingLeft: 20, background: `${PR.card}DD`, boxShadow: `inset 0 0 0 1.5px ${PR.line}` }}>
                    <span style={{ fontFamily: '"Consolas",monospace', fontSize: 21, color: PR.inkSub }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 27, color: PR.ink, flex: 1 }}>{it.l}</span>
                    <span style={{ fontSize: 31, fontWeight: 700, color: PR.accent, letterSpacing: 4, marginRight: 200 }}>{it.v}</span>
                    <span style={{ position: "absolute", right: 16, top: 11, width: 148, height: 50, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `inset 0 0 0 3px ${PR.seal}`, color: PR.seal, fontSize: 23, fontWeight: 700, letterSpacing: 3, transform: "rotate(-9deg)" }}>已执行</span>
                </div>
            ))}
        </div>

        {/* 右中：热搜榜 */}
        <div style={{ position: "absolute", right: 120, top: 428, width: 560 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 26, fontWeight: 700, color: PR.accent, letterSpacing: 3 }}>热搜榜</span>
                <span style={{ fontFamily: '"Consolas",monospace', fontSize: 15, color: PR.inkSub }}>按反智度排序</span>
            </div>
            {[
                { t: "越反智越上热搜", h: "412万", up: true },
                { t: "比脏 · 谁能脏得过", h: "388万", up: false },
                { t: "过期电子榨菜", h: "296万", up: false },
            ].map((r, i) => (
                <div key={i} style={{ height: 48, display: "flex", alignItems: "center", gap: 14, background: `${PR.card}AA`, boxShadow: `inset 0 0 0 1px ${PR.line}`, paddingLeft: 14, marginBottom: 8 }}>
                    <span style={{ fontFamily: '"Consolas",monospace', fontSize: 24, fontWeight: 700, width: 30, color: i === 0 ? PR.seal : PR.gold }}>{i + 1}</span>
                    <span style={{ fontSize: 22, color: PR.ink, flex: 1 }}>{r.t}</span>
                    <span style={{ fontFamily: '"Consolas",monospace', fontSize: 17, color: PR.accent, paddingRight: 12 }}>{r.h}</span>
                    {r.up ? <span style={{ fontFamily: '"Consolas",monospace', fontSize: 15, color: PR.seal }}>▲</span> : null}
                </div>
            ))}
        </div>

        {/* 中部：全宽标题板（超大青红错位标题） */}
        <div style={{ position: "absolute", left: 120, top: 626, width: 1680, height: 288, background: `linear-gradient(90deg, ${P.accent}, ${PR.accent})`, clipPath: "polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)" }}>
            <div style={{ position: "absolute", inset: 3, background: `${P.bg}F7`, clipPath: "polygon(26px 0, 100% 0, 100% calc(100% - 26px), calc(100% - 26px) 100%, 0 100%, 0 26px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "relative", width: "100%", height: 216 }}>
                    {[
                        { dx: 7, dy: 7, c: PR.accent, glow: false },
                        { dx: -5, dy: -5, c: P.accent, glow: false },
                        { dx: 0, dy: 0, c: P.ink, glow: true },
                    ].map((L, i) => (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                top: 22,
                                textAlign: "center",
                                fontSize: 168,
                                lineHeight: 1.1,
                                fontWeight: 700,
                                letterSpacing: 22,
                                whiteSpace: "nowrap",
                                color: L.c,
                                transform: `translate(${L.dx}px, ${L.dy}px)`,
                                textShadow: L.glow ? `0 0 34px ${P.accent}88, 0 0 96px ${PR.accent}66` : undefined,
                            }}
                        >
                            为了短视频
                        </div>
                    ))}
                </div>
                <div style={{ fontSize: 44, color: P.inkSub, letterSpacing: 14, marginTop: 4, whiteSpace: "nowrap" }}>揽佬 &amp; AR刘夫阳 · 赛博 HUD MV</div>
            </div>
        </div>

        {/* 底部：五行格 + 数据面板 */}
        <FiveElements t={0} from={-240} x={330} y={934} cell={58} />
        <div style={{ position: "absolute", left: 620, top: 922, display: "flex", gap: 44, alignItems: "baseline" }}>
            {[
                { k: "点赞", v: "128.4w", c: P.accent },
                { k: "连击", v: "×99", c: P.gold },
                { k: "时长", v: "02:49", c: P.inkSub },
                { k: "BPM", v: "175", c: PR.accent },
            ].map((d, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontFamily: '"Consolas",monospace', fontSize: 17, color: "#5C7A99", letterSpacing: 3 }}>{d.k}</span>
                    <span style={{ fontFamily: '"Consolas",monospace', fontSize: 42, fontWeight: 700, color: d.c, letterSpacing: 1, textShadow: `0 0 16px ${d.c}55` }}>{d.v}</span>
                </div>
            ))}
        </div>

        {/* 四角框 + 模式标签 */}
        {[
            { left: 40, top: 40, br: true, bb: true, c: P.accent },
            { right: 40, top: 40, bl: true, bb: true, c: PR.accent },
            { left: 40, bottom: 40, br: true, bt: true, c: P.accent },
            { right: 40, bottom: 40, bl: true, bt: true, c: PR.accent },
        ].map((k, i) => (
            <div key={i} style={{ position: "absolute", left: k.left, right: k.right, top: k.top, bottom: k.bottom, width: 86, height: 86, borderLeft: k.bl ? `3px solid ${k.c}AA` : undefined, borderRight: k.br ? `3px solid ${k.c}AA` : undefined, borderTop: k.bt ? `3px solid ${k.c}AA` : undefined, borderBottom: k.bb ? `3px solid ${k.c}AA` : undefined }} />
        ))}
        <div style={{ position: "absolute", left: 60, top: 46, fontFamily: '"Consolas",monospace', fontSize: 22, color: P.inkSub, letterSpacing: 3 }}>MODE // OBSERVE</div>
        <div style={{ position: "absolute", right: 60, top: 46, fontFamily: '"Consolas",monospace', fontSize: 22, color: PR.inkSub, letterSpacing: 3 }}>MODE // JUDGE</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 54, textAlign: "center", fontFamily: '"Consolas",monospace', fontSize: 22, color: `${P.inkSub}99`, letterSpacing: 8 }}>
            480 BEATS · 赛博 HUD · CYBER HUD DUAL
        </div>
    </div>
);
