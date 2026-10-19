import React from "react";
import type { SceneDef, SceneProps } from "../../shared";
import { BLACK, BLACK_PAL, HOOK_SHAKES, HOOK_START, LYRICS, MvStage, OUTRO_SHAKES, OUTRO_START, TOTAL_BEATS, VERSE_START, YELLOW, YELLOW_PAL } from "./kit";

// 黄场：开场 Hook（L1–L8）
const HookScene: React.FC<SceneProps> = ({ start }) => (
    <MvStage start={start} lines={LYRICS.filter((l) => l.i <= 8)} pal={YELLOW_PAL} theme="yellow" shakes={HOOK_SHAKES} />
);
HookScene.displayName = "Hook";

// 黑场：主歌（L9–L25），逐字 + 进鼓波浪 + 保龄球幕 + 转场放大
const VerseScene: React.FC<SceneProps> = ({ start }) => (
    <MvStage start={start} lines={LYRICS.filter((l) => l.i >= 9 && l.i <= 25)} pal={BLACK_PAL} theme="black" />
);
VerseScene.displayName = "Verse";

// 黄场：收尾 Hook（L26–L29），与开场同节奏
const OutroScene: React.FC<SceneProps> = ({ start }) => (
    <MvStage start={start} lines={LYRICS.filter((l) => l.i >= 26)} pal={YELLOW_PAL} theme="yellow" shakes={OUTRO_SHAKES} />
);
OutroScene.displayName = "Outro";

// 三段硬切（trans none + exitDim 0）：不闪频；黄↔黑由场景底色承担
export const GALI_SCENES: SceneDef[] = [
    { start: HOOK_START, end: VERSE_START, Comp: HookScene, trans: "none", bg: YELLOW },
    { start: VERSE_START, end: OUTRO_START, Comp: VerseScene, trans: "none", bg: BLACK },
    { start: OUTRO_START, end: TOTAL_BEATS, Comp: OutroScene, trans: "none", bg: YELLOW },
];
