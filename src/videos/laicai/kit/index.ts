// 「专升本 来财」kit：像素风格包 + 本视频私有件（人物 / 金币 / 歌词 HUD / 道具 / 歌词表）。
// 场景统一从 "../kit" 导入。
export * from "../../../styles/pixel";
export { Lanlao, PixelDude } from "./characters";
export type { DudeMood, LanlaoMood } from "./characters";
export { CoinBurst, CoinPile, CoinRain } from "./coin";
export { LyricHud, useSec } from "./hud";
export { activeLine, LYRICS, T } from "./lyrics";
export type { LyricLine } from "./lyrics";
export { Mic, PhoneGenshin, PokerCard } from "./props";
