import React from "react";
import type { SceneDef, SceneProps } from "../../shared";
import { DEEP_PAL, DEEP_SHAKES, DEEP_START, LIGHT_PAL, LIGHT_SEC, LIGHT_START, LYRICS, MID_PAL, MID_SHAKES, MID_SEC, MID_START, TOTAL_BEATS, XhStage } from "./kit";

// A 深灰场：开场自报家门（L1–L13），居中，每 2 拍卡点震动
const DeepScene: React.FC<SceneProps> = ({ start }) => (
    <XhStage start={start} lines={LYRICS.filter((l) => l.s < MID_SEC)} pal={DEEP_PAL} tone="deep" shakes={DEEP_SHAKES} />
);
DeepScene.displayName = "Deep";

// B 中灰场：diss 快嘴段（L14–L26），左对齐，卡点震动
const MidScene: React.FC<SceneProps> = ({ start }) => (
    <XhStage start={start} lines={LYRICS.filter((l) => l.s >= MID_SEC && l.s < LIGHT_SEC)} pal={MID_PAL} tone="mid" shakes={MID_SHAKES} />
);
MidScene.displayName = "Mid";

// C 浅灰白场：夺冠/收官（L27–L38），居中，末尾 RapStar 原地放大铺满定格
const LightScene: React.FC<SceneProps> = ({ start }) => (
    <XhStage start={start} lines={LYRICS.filter((l) => l.s >= LIGHT_SEC)} pal={LIGHT_PAL} tone="light" />
);
LightScene.displayName = "Light";

// 三段硬切（trans none + exitDim 0）：不闪频；灰阶切换由场景底色承担
export const XIAHUN_SCENES: SceneDef[] = [
    { start: DEEP_START, end: MID_START, Comp: DeepScene, trans: "none", bg: DEEP_PAL.bg },
    { start: MID_START, end: LIGHT_START, Comp: MidScene, trans: "none", bg: MID_PAL.bg },
    { start: LIGHT_START, end: TOTAL_BEATS, Comp: LightScene, trans: "none", bg: LIGHT_PAL.bg },
];
