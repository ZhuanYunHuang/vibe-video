import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { BeatProvider } from "./runtime/beat-context";
import { BeatGrid, ProgressHud, SceneShell } from "./components";
import { CL, makeBeat } from "./core/timing";
import { getSceneRanges } from "./core/scene-timeline";
import { C } from "./core/theme";
import { VideoSpec } from "./core/types";

// 通用装配器：吃一份 VideoSpec，输出完整视频。此处不含任何具体视频的业务数据。
export const Video: React.FC<{ spec: VideoSpec }> = ({ spec }) => {
  const beat = useMemo(
    () => makeBeat(spec.bpm, spec.offset, spec.transFrames),
    [spec.bpm, spec.offset, spec.transFrames],
  );
  const duration = beat.bf(spec.totalBeats) + spec.tailFrames;
  const bodyEnd = beat.bf(spec.totalBeats);
  const ranges = useMemo(() => getSceneRanges(spec), [spec]);
  // 风格来源优先级：显式 Backdrop/Hud 覆盖 > style 整套风格包 > 默认网格背景与进度条
  const Backdrop = spec.Backdrop ?? spec.style?.Backdrop ?? BeatGrid;
  const Hud = spec.Hud ?? spec.style?.Hud ?? ProgressHud;
  const bg = spec.bg ?? spec.style?.P.bg ?? C.bg;
  const exitDim = spec.exitDim ?? spec.style?.exitDim;

  return (
    <BeatProvider beat={beat}>
      <AbsoluteFill style={{ background: bg }}>
        {spec.bgm ? (
          <Audio
            src={staticFile(spec.bgm)}
            volume={(f) => interpolate(f, [0, 10, bodyEnd, duration], [0, 1, 1, 0], CL)}
          />
        ) : null}
        {ranges.map((r, i) => {
          const isLast = i === ranges.length - 1;
          const Comp = spec.scenes[i].Comp;
          return (
            <Sequence key={r.startBeat} from={r.from} durationInFrames={r.durationInFrames} name={r.name}>
              <SceneShell type={r.trans} total={isLast ? r.durationInFrames + 999 : r.durationInFrames} bg={spec.scenes[i].bg} exitDim={exitDim}>
                <Backdrop />
                <Comp start={r.startBeat} />
              </SceneShell>
            </Sequence>
          );
        })}
        <Hud cutFrames={spec.scenes.slice(1).map((s) => beat.bf(s.start))} totalFrames={bodyEnd} />
      </AbsoluteFill>
    </BeatProvider>
  );
};

// Composition 需要同步的总时长，不能在组件内部算
export const videoDuration = (spec: VideoSpec) =>
  makeBeat(spec.bpm, spec.offset, spec.transFrames).bf(spec.totalBeats) + spec.tailFrames;
