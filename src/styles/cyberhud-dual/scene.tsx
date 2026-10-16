import React from "react";
import { FPS, useBeat, useT } from "../../shared";
import type { StylePalette } from "../contract";
import { Backdrop } from "./fx";
import { paletteAt } from "./theme";
import { ToneProvider } from "./tone";

// 场景自身取色：按「起始拍号 + 场景内帧」算出当前秒对应的调色板。
// 场景组件要给 Slam/Label 传显式颜色时用它（此时它还在 <Scene> 之外，拿不到 provider）；
// 场景内部的子组件一律用 useTone()，由 <Scene> 统一下发。
export const useToneAt = (start: number): StylePalette => {
    const beat = useBeat();
    const t = useT();
    return paletteAt((beat.bf(start) + t) / FPS);
};

// 场景包装：下发当前调色板 + 铺背景层。每个场景最外层用它。
export const Scene: React.FC<{ start: number; children: React.ReactNode }> = ({ start, children }) => {
    const tone = useToneAt(start);
    return (
        <ToneProvider value={tone}>
            <Backdrop />
            {children}
        </ToneProvider>
    );
};
