import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { BeatProvider } from "./runtime/beat-context";
import { BeatGrid, ProgressHud, SceneShell } from "./components";
import { CL, makeBeat } from "./core/timing";
import { VideoSpec } from "./core/types";

// 通用装配器：吃一份 VideoSpec，输出完整视频。此处不含任何具体视频的业务数据。
export const Video: React.FC<{ spec: VideoSpec }> = ({ spec }) => {
  const beat = useMemo(
    () => makeBeat(spec.bpm, spec.offset, spec.transFrames),
    [spec.bpm, spec.offset, spec.transFrames],
  );
  const duration = beat.bf(spec.totalBeats) + spec.tailFrames;
  const bodyEnd = beat.bf(spec.totalBeats);
  // 风格可覆盖：未指定时用默认的网格背景与进度条
  const Backdrop = spec.Backdrop ?? BeatGrid;
  const Hud = spec.Hud ?? ProgressHud;

  return (
    <BeatProvider beat={beat}>
      <AbsoluteFill style={{ background: spec.bg }}>
        <Audio
          src={staticFile(spec.bgm)}
          volume={(f) => interpolate(f, [0, 10, bodyEnd, duration], [0, 1, 1, 0], CL)}
        />
        {spec.scenes.map((s, i) => {
          const from = Math.max(0, beat.bf(s.start) - beat.TRANS);
          const isLast = i === spec.scenes.length - 1;
          // 场景在 end 拍结束；下一场景从 end 拍前 TRANS 帧开始盖上来
          const dur = isLast ? duration - from : beat.bf(s.end) - from;
          const Comp = s.Comp;
          return (
            <Sequence key={s.start} from={from} durationInFrames={dur} name={Comp.name}>
              <SceneShell type={s.trans} total={isLast ? dur + 999 : dur} bg={s.bg} exitDim={spec.exitDim}>
                <Backdrop />
                <Comp start={s.start} />
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
