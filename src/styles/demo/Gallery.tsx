import React from "react";
import type { StyleKit } from "../contract";
import { Fonts as LyricFonts } from "../lyricmv";
import { PixelFontLoader } from "../pixel/Fonts";
import { STYLE_CATALOG } from "./catalog";

// 风格展示页（Still）：16 格总览（4 列 × 4 行），16 套全部交付。
// 只使用各 kit 的 Backdrop（仅 useCurrentFrame，Still 安全），不依赖 beat；瓦片数据来自 catalog。

const PALETTE_KEYS = ["bg", "bgAlt", "card", "ink", "inkSub", "line", "accent", "accentDeep", "accentLight", "gold", "seal"] as const;

const KitTile: React.FC<{ kit: StyleKit; name: string; tag: string }> = ({ kit, name, tag }) => {
    const P = kit.P;
    return (
        <div style={{ position: "absolute", inset: 0, background: P.bg, overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 26, top: 18, width: 140, height: 58 }}>
                <kit.Backdrop />
            </div>
            <div style={{ position: "absolute", left: 14, top: 92, fontFamily: kit.fonts.FONT, fontSize: 34, fontWeight: 700, color: P.ink }}>{name}</div>
            <div style={{ position: "absolute", right: 16, top: 20, fontFamily: kit.fonts.MONO, fontSize: 16, color: P.inkSub, letterSpacing: 2 }}>{kit.id.toUpperCase()}</div>
            <div style={{ position: "absolute", right: 16, top: 42, fontFamily: kit.fonts.FONT, fontSize: 17, color: P.inkSub }}>{tag}</div>
            {/* 语义色带 */}
            <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, display: "flex", gap: 5 }}>
                {PALETTE_KEYS.map((k) => (
                    <div key={k} style={{ flex: 1, height: 30, background: P[k], border: "1px solid #00000026" }} />
                ))}
            </div>
        </div>
    );
};

const TILE_W = 448;
const TILE_H = 212;
const GAP = 14;

export const StyleGallery: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, background: "#F2F2F0", overflow: "hidden" }}>
        <PixelFontLoader />
        <LyricFonts />
        <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 34, fontWeight: 700, color: "#22262E", letterSpacing: 4 }}>
            风格库 · STYLE KITS —— 16 套全部交付
        </div>
        {STYLE_CATALOG.map((tile, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const x = 42 + col * (TILE_W + GAP);
            const y = 94 + row * (TILE_H + GAP);
            return (
                <div key={i} style={{ position: "absolute", left: x, top: y, width: TILE_W, height: TILE_H, border: "2px solid #2E2A2422", overflow: "hidden" }}>
                    <KitTile kit={tile.kit} name={tile.name} tag={tile.tag} />
                </div>
            );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 16, color: "#9A978C", letterSpacing: 2 }}>
            每套详情与色板键名见 src/styles/README.md ｜ 预览副本 src/styles/preview/
        </div>
    </div>
);
