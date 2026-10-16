import React from "react";
import { pop, SceneProps, Shockwave, useT } from "../../../shared";
import { CoinRain, Kicks, Lanlao, P, PixelDude, Slam, Stage, useSec, useK } from "../kit";

// 第 10 幕 · 来财大合唱（94.17-101.98s）：等河牌收势 → 98.5s「来财 来」chant 起 → 全屏金币雨 + 逐拍大字（全片最高潮）。
export const Hook: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const K = useK(start);
    const sec = useSec(start);
    const hookOn = t >= sec(98.4);
    const beat = (b: number) => t >= K(b);
    const dance = Math.sin(t / 9) * 16;
    return (
        <Kicks t={t} K={K} beats={[192, 200, 208]}>
            <Stage t={t}>
                {/* 常驻金币雨（chant 起） */}
                {hookOn ? <CoinRain t={t - sec(98.4)} n={40} seed={29} speed={1.25} /> : null}
                {/* 两人蹦跳 */}
                <Lanlao x={700} y={990} s={1.55} mood="laugh" armL={hookOn ? 130 : 40} armR={hookOn ? 130 : 40} jump={hookOn ? Math.abs(dance) : 0} shades={false} />
                <PixelDude x={1230} y={990} s={1.45} mood="laugh" armL={hookOn ? 130 : 40} armR={hookOn ? 130 : 40} jump={hookOn ? Math.abs(Math.sin(t / 9 + 2) * 16) : 0} shirt="天选之子" />
                {/* 「来财 来」逐拍大字 ×2 + 冲击波 */}
                {beat(200) && t < sec(100.5) ? (
                    <Slam t={t} from={K(200)} x={960} y={420} size={200} color={P.gold}>
                        来财 来
                    </Slam>
                ) : null}
                {beat(200) && t < K(200) + 40 ? <Shockwave t={t} at={K(200)} x={960} y={480} color={P.gold} rings={3} maxRadius={820} dur={32} /> : null}
                {/* 98.5s 的第一次 chant */}
                {hookOn && t < sec(100.5) ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 200, textAlign: "center", opacity: pop(t, sec(98.5), 10), transform: `scale(${0.85 + 0.15 * pop(t, sec(98.5), 10)})` }}>
                        <span style={{ fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 120, fontWeight: 700, color: "#8A6B1A", WebkitTextStroke: `5px ${P.gold}`, letterSpacing: 14 }}>来财 来</span>
                    </div>
                ) : null}
                {/* 河牌收势（98 前） */}
                {!hookOn ? (
                    <div style={{ position: "absolute", left: 0, right: 0, top: 300, textAlign: "center", fontFamily: '"FusionPixel","Microsoft YaHei",sans-serif', fontSize: 46, color: P.inkSub, opacity: 0.8 }}>难的是等河牌……</div>
                ) : null}
            </Stage>
        </Kicks>
    );
};
