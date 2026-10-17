import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { P, kit } from "./kit";
import { Hook } from "./scenes/Hook";
import { Form } from "./scenes/Form";
import { Hinge } from "./scenes/Hinge";
import { HingeMat } from "./scenes/HingeMat";
import { Turn } from "./scenes/Turn";
import { Stack } from "./scenes/Stack";
import { Crease } from "./scenes/Crease";
import { Daily } from "./scenes/Daily";
import { Reliability } from "./scenes/Reliability";
import { Cost } from "./scenes/Cost";
import { Verdict } from "./scenes/Verdict";
import { Outro } from "./scenes/Outro";

// 《iPhone Duo 是怎么折叠的？》：明亮版 3D 拆解科普片
// BGM 复用 roadster/bgm.mp3（bpm 112.8 / offset 12），336 拍 ≈ 178.7s + tail ≈ 3:00
export const iphoneFold: VideoSpec = {
    id: "DuoFold",
    bpm: 112.8,
    offset: 12,
    totalBeats: 336,
    transFrames: 12,
    tailFrames: 14,
    bgm: "iphone-fold/bgm.mp3",
    bg: P.bg,
    width: 1920,
    height: 1080,
    style: kit,
    Cover,
    scenes: [
        { start: 0, end: 24, Comp: Hook, trans: "none", bg: P.bg },
        { start: 24, end: 56, Comp: Form, trans: "zoom", bg: P.bg },
        { start: 56, end: 88, Comp: Hinge, trans: "circle", bg: P.bg },
        { start: 88, end: 104, Comp: HingeMat, trans: "fade", bg: P.bg },
        { start: 104, end: 120, Comp: Turn, trans: "blinds", bg: "#E9EFF8" },
        { start: 120, end: 160, Comp: Stack, trans: "slideUp", bg: P.bg },
        { start: 160, end: 192, Comp: Crease, trans: "fade", bg: P.bg },
        { start: 192, end: 224, Comp: Daily, trans: "slideLeft", bg: P.bg },
        { start: 224, end: 256, Comp: Reliability, trans: "fade", bg: P.bg },
        { start: 256, end: 280, Comp: Cost, trans: "blinds", bg: P.bg },
        { start: 280, end: 312, Comp: Verdict, trans: "fade", bg: P.bg },
        { start: 312, end: 336, Comp: Outro, trans: "circle", bg: P.bg },
    ],
};
