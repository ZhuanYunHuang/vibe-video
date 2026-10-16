import React from "react";
import { Lanlao, P, PixelDude } from "./kit";
import { CoinRain } from "./kit";

// 像素封面：深空底 + 金色网格 + 金币雨 + 天选之子 × 揽佬 + 片名（静态，冻结帧参数）。
export const Cover: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 40%, ${P.bgAlt} 0%, ${P.bg} 62%)`, overflow: "hidden" }}>
        {/* 点阵网格 */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${P.gold}18 1.6px, transparent 1.6px)`, backgroundSize: "46px 46px" }} />
        {/* 金币雨（冻结帧） */}
        <CoinRain t={72} n={30} seed={61} speed={1} />
        {/* 底部光带 */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, height: 220, background: `linear-gradient(180deg, transparent, ${P.gold}18)` }} />
        {/* 两位主角 */}
        <PixelDude x={520} y={1010} s={1.55} mood="cool" armL={30} armR={0} shirt="天选之子" />
        <Lanlao x={1420} y={1010} s={1.6} mood="laugh" armL={100} armR={100} shades tilt={2} />
        {/* 片名 */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center" }}>
            <div style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 150, fontWeight: 700, color: P.gold, letterSpacing: 18, textShadow: `0 0 46px ${P.gold}55, 8px 8px 0 #00000088` }}>专升本 来财</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 26 }}>
                {Array.from({ length: 18 }, (_, i) => (
                    <div key={i} style={{ width: 26, height: 12, background: i % 2 ? P.accent : P.gold }} />
                ))}
            </div>
            <div style={{ marginTop: 30, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 38, color: P.ink, letterSpacing: 8 }}>天选之子 × 揽佬 · 八方来财</div>
        </div>
        {/* 角标 */}
        <div style={{ position: "absolute", left: 60, top: 56, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 26, color: `${P.inkSub}`, letterSpacing: 4 }}>像素风 MV · PIXEL</div>
        <div style={{ position: "absolute", right: 60, top: 56, fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 26, color: `${P.gold}`, letterSpacing: 4 }}>来财 · 来</div>
    </div>
);
