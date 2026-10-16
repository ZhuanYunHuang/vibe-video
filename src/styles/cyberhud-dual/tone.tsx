import { createContext, useContext } from "react";
import type { StylePalette } from "../contract";
import { P } from "./theme";

// 调色板下发通道：场景用 <Scene start> 把「当前秒对应的调色板」灌进来，
// 契约组件（Sub/Slam/Card/…）从中取色，于是换色只改一处、场景代码不用写死颜色。
const ToneCtx = createContext<StylePalette>(P);

export const ToneProvider = ToneCtx.Provider;

// 契约组件取色：无 provider（封面 Still / 展示页）时回退阶段 A 冷色
export const useTone = (): StylePalette => useContext(ToneCtx);
