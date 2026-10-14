import type { VideoSpec } from "../../shared";
import type { StyleKit } from "../contract";
import { kit as bauhaus } from "../bauhaus";
import { kit as collage } from "../collage";
import { kit as cyberhud } from "../cyberhud";
import { kit as datainfo } from "../datainfo";
import { kit as flat } from "../flat";
import { kit as pixel } from "../pixel";
import { kit as shadowpuppet } from "../shadowpuppet";
import { kit as synthwave } from "../synthwave";
import { kit as whiteboard } from "../whiteboard";
import { makeCardScene, makeImpactScene, makeTitleScene } from "./scenes";

// 用同一段三幕脚本 + 指定风格生成 12 秒演示片（无 BGM，节拍由 bpm/offset 驱动）
export const makeDemoSpec = (kit: StyleKit): VideoSpec => ({
    id: `StyleDemo-${kit.id}`,
    bpm: 120,
    offset: 0,
    totalBeats: 24,
    transFrames: 12,
    tailFrames: 24,
    width: 1920,
    height: 1080,
    style: kit,
    exitDim: kit.exitDim,
    scenes: [
        { start: 0, end: 8, Comp: makeTitleScene(kit), trans: "fade", bg: kit.P.bg },
        { start: 8, end: 16, Comp: makeCardScene(kit), trans: "circle", bg: kit.P.bgAlt },
        { start: 16, end: 24, Comp: makeImpactScene(kit), trans: "zoom", bg: kit.P.bg },
    ],
});

export const DEMO_SPECS: VideoSpec[] = [whiteboard, pixel, flat, shadowpuppet, cyberhud, datainfo, collage, bauhaus, synthwave].map(makeDemoSpec);
