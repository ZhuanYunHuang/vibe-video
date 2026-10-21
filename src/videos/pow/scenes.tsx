import React from "react";
import type { SceneDef, SceneProps } from "../../shared";
import {
    ACID,
    ACID_BEAT,
    ACID_SEC,
    CROSSHAIR_ATS,
    DARK,
    DEEP,
    FINALE_BEAT,
    FINALE_SEC,
    FLARE,
    FLURRY_BEAT,
    FLURRY_SEC,
    HERO_BEAT,
    HERO_SEC,
    LYRICS,
    PowStage,
    RESET_BEAT,
    RESET_SEC,
    SHAKES,
    SHOTS,
    STAMP_SEC,
    SWEEP_ATS,
    TOTAL_BEATS,
} from "./kit";

// A 枪墙场（L1–L14）：十字准星 + 逐发弹孔 + 炮声打穿墙并把字打碎
const SniperScene: React.FC<SceneProps> = ({ start }) => (
    <PowStage start={start} tone="wall" pal={DARK} lines={LYRICS.filter((l) => l.s < RESET_SEC)} shots={SHOTS} crosshairAts={CROSSHAIR_ATS.slice(0, 2)} shakes={SHAKES} />
);
SniperScene.displayName = "Sniper";

// B Reset 场（L15–L26）：炮击穿后过场（glitch 入场）+ 绿笔触扫入；含 L17 分离两段
const ResetScene: React.FC<SceneProps> = ({ start }) => (
    <PowStage start={start} tone="grunge" pal={DEEP} lines={LYRICS.filter((l) => l.s >= RESET_SEC && l.s < ACID_SEC)} shakes={SHAKES} sweepAts={[RESET_SEC, SWEEP_ATS[0]]} />
);
ResetScene.displayName = "Reset";

// C Acid 场（L27–L31）：鼓点进场的荧光绿反色场（绿底黑字），首句强卡
const AcidScene: React.FC<SceneProps> = ({ start }) => (
    <PowStage start={start} tone="acid" pal={ACID} lines={LYRICS.filter((l) => l.s >= ACID_SEC && l.s < FLURRY_SEC)} sweepAts={[ACID_SEC]} />
);
AcidScene.displayName = "Acid";

// D Flurry 场（L32–L34）：快嘴三连砸入
const FlurryScene: React.FC<SceneProps> = ({ start }) => (
    <PowStage start={start} tone="grunge" pal={DARK} lines={LYRICS.filter((l) => l.s >= FLURRY_SEC && l.s < HERO_SEC)} shakes={SHAKES} sweepAts={[SWEEP_ATS[1]]} />
);
FlurryScene.displayName = "Flurry";

// E Hero 场（L35–L38）：准星回场，末句砸入
const HeroScene: React.FC<SceneProps> = ({ start }) => (
    <PowStage start={start} tone="grunge" pal={DARK} lines={LYRICS.filter((l) => l.s >= HERO_SEC && l.s < FINALE_SEC)} shakes={SHAKES} crosshairAts={[CROSSHAIR_ATS[2]]} />
);
HeroScene.displayName = "Hero";

// F Finale 场（L39–L42）：收官 slam 四连 → 原地放大化入底色 → POW!! 定格
const FinaleScene: React.FC<SceneProps> = ({ start }) => (
    <PowStage start={start} tone="grunge" pal={FLARE} lines={LYRICS.filter((l) => l.s >= FINALE_SEC)} shakes={SHAKES} stampAt={STAMP_SEC} />
);
FinaleScene.displayName = "Finale";

// 换场：全程硬切；A→B（炮击穿后）与 B→C（鼓点进场）用 glitch 强过渡
export const POW_SCENES: SceneDef[] = [
    { start: 0, end: RESET_BEAT, Comp: SniperScene, trans: "none", bg: DARK.bg },
    { start: RESET_BEAT, end: ACID_BEAT, Comp: ResetScene, trans: "glitch", bg: DEEP.bg },
    { start: ACID_BEAT, end: FLURRY_BEAT, Comp: AcidScene, trans: "glitch", bg: ACID.bg },
    { start: FLURRY_BEAT, end: HERO_BEAT, Comp: FlurryScene, trans: "none", bg: DARK.bg },
    { start: HERO_BEAT, end: FINALE_BEAT, Comp: HeroScene, trans: "none", bg: DARK.bg },
    { start: FINALE_BEAT, end: TOTAL_BEATS, Comp: FinaleScene, trans: "none", bg: FLARE.bg },
];
