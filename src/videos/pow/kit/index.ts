// 复用第 16 套风格包「歌词 MV」，并在本业务内追加：四套主题色 + 枪墙舞台。
export * from "../../../styles/lyricmv";
export { PowStage, DiagLayer } from "./stage";
export { GREEN, GREEN_LIGHT, GREEN_DEEP, WALL, INK_DARK_BG, INK_LIGHT, ACID_BG, DARK, DEEP, ACID, FLARE } from "./theme";
export {
    BPM,
    OFFSET,
    TOTAL_BEATS,
    TRANS_FRAMES,
    TAIL_FRAMES,
    LABEL,
    SNIPER_SEC,
    RESET_SEC,
    ACID_SEC,
    FLURRY_SEC,
    HERO_SEC,
    FINALE_SEC,
    RESET_BEAT,
    ACID_BEAT,
    FLURRY_BEAT,
    HERO_BEAT,
    FINALE_BEAT,
    SHAKES,
    SHOTS,
    LYRICS,
    CROSSHAIR_ATS,
    SWEEP_ATS,
    STAMP_SEC,
} from "./lyrics";
export type { LyricLine, Row, RowFx, Shot, Span } from "./lyrics";
