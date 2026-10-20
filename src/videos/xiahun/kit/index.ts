// 复用第 16 套风格包「歌词 MV」，并在本业务内追加：灰阶三主题 + 自定义舞台。
export * from "../../../styles/lyricmv";
export { XhStage } from "./stage";
export { GREY, DEEP_PAL, MID_PAL, LIGHT_PAL, INK_LIGHT, INK_DARK } from "./theme";
export {
    BPM,
    OFFSET,
    TOTAL_BEATS,
    TRANS_FRAMES,
    TAIL_FRAMES,
    LABEL,
    DEEP_START,
    MID_START,
    LIGHT_START,
    MID_SEC,
    LIGHT_SEC,
    DEEP_SHAKES,
    MID_SHAKES,
    LYRICS,
} from "./lyrics";
export type { LyricLine, Row, RowFx, Span } from "./lyrics";
