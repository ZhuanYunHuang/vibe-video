import React from "react";
import { SceneDef, SceneProps } from "../../../shared";
import { P } from "../kit/theme";
import { VerseScene } from "./VerseScene";

// 场景工厂：每场固定两句，名称写进 displayName 供预览调试面板显示
const makeVerseScene = (index: number, beats: number, isLast: boolean): React.FC<SceneProps> => {
    const Comp: React.FC<SceneProps> = (props) => <VerseScene {...props} index={index} beats={beats} isLast={isLast} />;
    Comp.displayName = `Verse${String(index + 1).padStart(2, "0")}`;
    return Comp;
};

// 场景边界对齐到真实句点（秒），再换算成拍号；两句一场
const PLAN: { start: number; end: number }[] = [
    { start: 0, end: 7.7353 }, // 句 1-2
    { start: 7.7353, end: 15.9687 }, // 句 3-4
    { start: 15.9687, end: 25.169 }, // 句 5-6
    { start: 25.169, end: 32.6699 }, // 句 7-8
    { start: 32.6699, end: 44.008 }, // 句 9-10
    { start: 44.008, end: 53.1803 }, // 句 11-12
    { start: 53.1803, end: 64 }, // 句 13-14
];

export const VERSE_SCENES: SceneDef[] = PLAN.map((p, i) => ({
    start: p.start,
    end: p.end,
    Comp: makeVerseScene(i, p.end - p.start, i === PLAN.length - 1),
    trans: "none",
    bg: P.bg,
}));
