import React from "react";
import type { StyleKit } from "../contract";
import { kit as bauhaus } from "../bauhaus";
import { kit as collage } from "../collage";
import { kit as cyberhud } from "../cyberhud";
import { kit as datainfo } from "../datainfo";
import { kit as explode } from "../explode";
import { kit as flat } from "../flat";
import { kit as hanzi } from "../hanzi";
import { kit as mathviz } from "../mathviz";
import { kit as picturebook } from "../picturebook";
import { kit as pixel } from "../pixel";
import { PixelFontLoader } from "../pixel/Fonts";
import { kit as scale } from "../scale";
import { kit as shadowpuppet } from "../shadowpuppet";
import { kit as synthwave } from "../synthwave";
import { kit as variety } from "../variety";
import { kit as whiteboard } from "../whiteboard";

// 风格展示页（Still）：15 格总览（3 列 × 5 行），15 套全部交付。
// 只使用各 kit 的 Backdrop（仅 useCurrentFrame，Still 安全），不依赖 beat。

type Tile = { kit: StyleKit; name: string; tag: string };

const TILES: Tile[] = [
    { kit: whiteboard, name: "白板手绘", tag: "马克笔当场画懂" },
    { kit: pixel, name: "像素风", tag: "8-bit 复古硬核" },
    { kit: flat, name: "扁平 MG", tag: "现代弹性动效" },
    { kit: shadowpuppet, name: "皮影戏", tag: "幕布剪影 · 关节动作" },
    { kit: cyberhud, name: "赛博 HUD", tag: "霓虹扫描 · 数据流" },
    { kit: datainfo, name: "数据信息图", tag: "等宽大数字讲数据" },
    { kit: collage, name: "拼贴", tag: "撕纸拼贴 · 观点输出" },
    { kit: bauhaus, name: "Bauhaus", tag: "三原色几何构成" },
    { kit: synthwave, name: "Synthwave", tag: "80s 落日霓虹" },
    { kit: explode, name: "3D 拆解", tag: "影棚爆炸图 · 分层悬浮" },
    { kit: hanzi, name: "汉字演变", tag: "火光铸刻 · 字形演化" },
    { kit: variety, name: "综艺花字", tag: "逐字弹跳 · 粗描边" },
    { kit: picturebook, name: "绘本科画", tag: "钢笔线稿 · 蜡笔涂色" },
    { kit: mathviz, name: "数学可视化", tag: "干净几何 · 公式浮现" },
    { kit: scale, name: "比例尺对比", tag: "同屏缩放 · 镜头拉远" },
];

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

const TILE_W = 600;
const TILE_H = 176;
const GAP = 14;

export const StyleGallery: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, background: "#F2F2F0", overflow: "hidden" }}>
        <PixelFontLoader />
        <div style={{ position: "absolute", left: 0, right: 0, top: 26, textAlign: "center", fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 34, fontWeight: 700, color: "#22262E", letterSpacing: 4 }}>
            风格库 · STYLE KITS —— 15 套全部交付
        </div>
        {TILES.map((tile, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x = 42 + col * (TILE_W + GAP);
            const y = 84 + row * (TILE_H + GAP * 0.9);
            return (
                <div key={i} style={{ position: "absolute", left: x, top: y, width: TILE_W, height: TILE_H, border: "2px solid #2E2A2422", overflow: "hidden" }}>
                    <KitTile kit={tile.kit} name={tile.name} tag={tile.tag} />
                </div>
            );
        })}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 16, color: "#9A978C", letterSpacing: 2 }}>
            每套详情与色板键名见 src/styles/README.md ｜ 演示片 out/styles/demo-&lt;id&gt;.mp4
        </div>
    </div>
);
