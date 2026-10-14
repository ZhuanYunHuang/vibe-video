import React from "react";
import { MOTION_ITEMS } from "./items";

// 动效展示页（Still）：19 格索引 —— 每格 = 冻结帧预览 + 名称（冻结帧参数见各项 best）。
// 仅用纯函数组件，无 beat 依赖。

const TILE_W = 356;
const TILE_H = 236;
const GAP = 12;
const COLS = 5;
const PREVIEW_H = 200;
const SCALE = TILE_W / 1920;

export const MotionGallery: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, background: "#F2F2F0", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 24, textAlign: "center", fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 32, fontWeight: 700, color: "#22262E", letterSpacing: 4 }}>
            动效工具箱 · MOTION TOOLBOX —— 19 项
        </div>
        {MOTION_ITEMS.map((def, i) => {
            const col = i % COLS;
            const row = Math.floor(i / COLS);
            const x = 46 + col * (TILE_W + GAP);
            const y = 80 + row * (TILE_H + GAP);
            return (
                <div key={def.id} style={{ position: "absolute", left: x, top: y, width: TILE_W, height: TILE_H, background: "#14171F", border: "2px solid #2E2A2422", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, width: TILE_W, height: PREVIEW_H, overflow: "hidden" }}>
                        <div style={{ width: 1920, height: 1080, transform: `scale(${SCALE})`, transformOrigin: "top left" }}>{def.content(def.best)}</div>
                    </div>
                    <div style={{ position: "absolute", left: 12, right: 12, top: PREVIEW_H, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 22, fontWeight: 800, color: "#E8F0FF" }}>{def.cn}</span>
                        <span style={{ fontFamily: '"Consolas",monospace', fontSize: 15, color: "#6C8BB0" }}>{def.en}</span>
                    </div>
                </div>
            );
        })}
        {/* 末格：标题瓦片 */}
        <div style={{ position: "absolute", left: 46 + 4 * (TILE_W + GAP), top: 80 + 3 * (TILE_H + GAP), width: TILE_W, height: TILE_H, background: "#1F2433", border: "2px dashed #39415A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 26, fontWeight: 800, color: "#E8F0FF" }}>演示片</div>
            <div style={{ fontFamily: '"Consolas",monospace', fontSize: 16, color: "#6C8BB0", textAlign: "center", lineHeight: 1.7 }}>
                out/motion/demo.mp4
                <br />
                MotionDemo（40s · 19 项轮播）
            </div>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: '"Microsoft YaHei",sans-serif', fontSize: 15, color: "#9A978C", letterSpacing: 2 }}>
            用法与出处见 src/shared/motion/README.md ｜ 全部为 t/from 纯函数（Still 可冻结）
        </div>
    </div>
);
