// 复用第 16 套风格包「歌词 MV」，并在本业务内追加：黄/黑主题、自定义舞台。
export * from "../../../styles/lyricmv";
export { MvStage } from "./stage";
export { YELLOW, BLACK, YELLOW_PAL, BLACK_PAL, ACCENT, INK_ON_YELLOW, INK_ON_BLACK } from "./theme";
export {
    BPM,
    OFFSET,
    TOTAL_BEATS,
    TRANS_FRAMES,
    TAIL_FRAMES,
    LABEL,
    HOOK_START,
    VERSE_START,
    OUTRO_START,
    HOOK_SHAKES,
    OUTRO_SHAKES,
    LYRICS,
} from "./lyrics";
export type { LyricLine, Row, RowFx, Span } from "./lyrics";
