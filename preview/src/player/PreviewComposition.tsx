import React from "react";
import type { VideoSpec } from "@src/shared/core/types";
import { Video } from "@src/shared/Video";

// Player 的组件引用必须稳定：模块级组件 + inputProps 传 spec
export const PreviewComposition: React.FC<{ spec: VideoSpec }> = ({ spec }) => <Video spec={spec} />;
