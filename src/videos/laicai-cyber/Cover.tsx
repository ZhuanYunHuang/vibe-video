import React from "react";
import { Lanlao, P, PixelDude } from "./kit";
import { CoinRain } from "./kit";

// 赛博 HUD 版封面：深蓝黑 + 霓虹大标题 + HUD 角框 + 扫描光带 + 金币雨 + 双人物（静态冻结帧）。
export const Cover: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 32%, ${P.bgAlt} 0%, ${P.bg} 62%)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(0deg, ${P.line} 0 1px, transparent 1px 92px), repeating-linear-gradient(90deg, ${P.line} 0 1px, transparent 1px 92px)`, opacity: 0.35 }} />
        <CoinRain t={96} n={26} seed={71} speed={0.9} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 470, height: 120, background: `linear-gradient(180deg, transparent, ${P.accent}14, transparent)` }} />
        {/* 片名（霓虹） */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center" }}>
            <div style={{ fontFamily: '"Consolas","Microsoft YaHei",monospace', fontSize: 128, fontWeight: 700, color: P.ink, letterSpacing: 14, textShadow: `0 0 26px ${P.accent}66, 0 0 70px ${P.accent}33` }}>专升本 来财</div>
            <div style={{ fontFamily: '"Consolas",monospace', fontSize: 30, color: P.accent, letterSpacing: 10, marginTop: 24 }}>[ SYSTEM: 八方来财 ]</div>
            <div style={{ marginTop: 26, fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 36, color: P.inkSub, letterSpacing: 8 }}>天选之子 × 揽佬</div>
        </div>
        {/* 双人物 */}
        <PixelDude x={520} y={1010} s={1.5} mood="cool" armL={30} armR={0} shirt="天选之子" />
        <Lanlao x={1420} y={1010} s={1.55} mood="laugh" armL={100} armR={100} shades tilt={2} />
        {/* 四角 HUD 框 */}
        {[
            { left: 40, top: 40, br: true, bb: true },
            { right: 40, top: 40, bl: true, bb: true },
            { left: 40, bottom: 40, br: true, bt: true },
            { right: 40, bottom: 40, bl: true, bt: true },
        ].map((c, i) => (
            <div key={i} style={{ position: "absolute", left: c.left, right: c.right, top: c.top, bottom: c.bottom, width: 86, height: 86, borderLeft: c.bl ? `3px solid ${P.accent}AA` : undefined, borderRight: c.br ? `3px solid ${P.accent}AA` : undefined, borderTop: c.bt ? `3px solid ${P.accent}AA` : undefined, borderBottom: c.bb ? `3px solid ${P.accent}AA` : undefined }} />
        ))}
        <div style={{ position: "absolute", left: 64, top: 64, fontFamily: '"Consolas",monospace', fontSize: 22, color: P.inkSub }}>SYS.MV // 赛博 HUD 版</div>
        <div style={{ position: "absolute", right: 64, top: 64, fontFamily: '"Consolas",monospace', fontSize: 22, color: P.seal }}>REC ●</div>
    </div>
);
