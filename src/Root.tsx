import React from "react";
import { Composition, Still } from "remotion";
import { FPS, Video, VideoSpec, videoDuration } from "./shared";
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
  </>
);
