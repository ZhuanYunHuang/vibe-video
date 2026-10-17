import { makeBeat } from "./timing";
import type { TransType, VideoSpec } from "./types";

// 每场在时间轴上的真实帧区间：预览跳转与成片装配共用，避免两套算法。
export type SceneRange = {
    index: number;
    name: string;
    trans: TransType;
    startBeat: number;
    endBeat: number;
    from: number; // 含转场入点
    endExclusive: number; // 不含
    durationInFrames: number;
};

export const getSceneRanges = (spec: VideoSpec): SceneRange[] => {
    const beat = makeBeat(spec.bpm, spec.offset, spec.transFrames);
    const duration = beat.bf(spec.totalBeats) + spec.tailFrames;
    return spec.scenes.map((s, i) => {
        const from = Math.max(0, beat.bf(s.start) - beat.TRANS);
        const isLast = i === spec.scenes.length - 1;
        const endExclusive = isLast ? duration : beat.bf(s.end);
        return {
            index: i,
            name: s.Comp.displayName ?? s.Comp.name ?? `Scene ${i + 1}`,
            trans: s.trans,
            startBeat: s.start,
            endBeat: s.end,
            from,
            endExclusive,
            durationInFrames: endExclusive - from,
        };
    });
};
