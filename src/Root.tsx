import React from "react";
import { Composition, Still } from "remotion";
import { FPS, Video, VideoSpec, videoDuration } from "./shared";
import { MOTION_DEMO_FRAMES, MotionDemo, MotionGallery } from "./shared/motion/demo";
import { DEMO_SPECS, STYLE_COVERS, StyleGallery } from "./styles/demo";
import { VIDEOS } from "./videos";

// spec 里含有 React 组件，无法作为 defaultProps 序列化，
// 因此用工厂把 spec 绑定进组件，而不是走 props。
const bindSpec = (spec: VideoSpec): React.FC => {
  const Bound: React.FC = () => <Video spec={spec} />;
  Bound.displayName = spec.id;
  return Bound;
};

export const RemotionRoot = () => (
  <>
    {VIDEOS.map((spec) => (
      <Composition
        key={spec.id}
        id={spec.id}
        component={bindSpec(spec)}
        durationInFrames={videoDuration(spec)}
        fps={FPS}
        width={spec.width}
        height={spec.height}
      />
    ))}
    {/* 封面：spec 提供了 Cover 的业务，自动注册一张同尺寸的静态图，id 为 <视频id>Cover */}
    {VIDEOS.map((spec) => {
      const Cover = spec.Cover;
      return Cover ? (
        <Still
          key={`${spec.id}Cover`}
          id={`${spec.id}Cover`}
          component={Cover}
          width={spec.width}
          height={spec.height}
        />
      ) : null;
    })}
    {/* 风格库演示：每套风格一支 12 秒演示片（与业务视频解耦，不进 videos/index.ts） */}
    {DEMO_SPECS.map((spec) => (
      <Composition
        key={spec.id}
        id={spec.id}
        component={bindSpec(spec)}
        durationInFrames={videoDuration(spec)}
        fps={FPS}
        width={spec.width}
        height={spec.height}
      />
    ))}
    {/* 风格展示页：一页 16 格总览（Still） */}
    <Still id="StyleGallery" component={StyleGallery} width={1920} height={1080} />
    {/* 风格封面：每套风格一张静态封面（StyleCover-<id>，用于仓库内预览副本 src/styles/preview/） */}
    {STYLE_COVERS.map(({ id, Comp }) => (
      <Still key={id} id={id} component={Comp} width={1920} height={1080} />
    ))}
    {/* 动效工具箱演示：19 项动效轮播（TransitionSeries 组装，与业务装配解耦） */}
    <Composition id="MotionDemo" component={MotionDemo} durationInFrames={MOTION_DEMO_FRAMES} fps={FPS} width={1920} height={1080} />
    <Still id="MotionGallery" component={MotionGallery} width={1920} height={1080} />
  </>
);
