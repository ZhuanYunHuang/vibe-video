import type React from "react";
import { MOTION_DEMO_FRAMES, MotionDemo } from "@src/shared/motion/demo";
import type { VideoSpec } from "@src/shared/core/types";
import { videoDuration } from "@src/shared/Video";
import { DEMO_SPECS } from "@src/styles/demo/specs";
import { STYLE_CATALOG } from "@src/styles/demo/catalog";
import { VIDEOS } from "@src/videos";

export type PreviewKind = "video" | "style" | "motion";

export type PreviewItem = {
    id: string;
    title: string;
    subtitle: string;
    kind: PreviewKind;
    accent: string;
    width: number;
    height: number;
    durationInFrames: number;
    spec?: VideoSpec;
    component?: React.FC;
};

// 名称直接取 catalog，避免再加一份手写清单
const STYLE_NAMES: Record<string, string> = Object.fromEntries(STYLE_CATALOG.map((e) => [e.id, e.name]));

const fromSpec = (spec: VideoSpec, kind: PreviewKind, title: string): PreviewItem => ({
    id: spec.id,
    title,
    subtitle: `${spec.scenes.length} 场 · ${spec.width}×${spec.height}`,
    kind,
    accent: spec.bg ?? spec.style?.P.bg ?? "#14161B",
    width: spec.width,
    height: spec.height,
    durationInFrames: videoDuration(spec),
    spec,
});

export const VIDEO_ITEMS: PreviewItem[] = VIDEOS.map((spec) => fromSpec(spec, "video", spec.id));

export const STYLE_ITEMS: PreviewItem[] = DEMO_SPECS.map((spec) => {
    const key = spec.id.replace("StyleDemo-", "");
    return fromSpec(spec, "style", STYLE_NAMES[key] ?? key);
});

export const MOTION_ITEM: PreviewItem = {
    id: "MotionDemo",
    title: "19 项通用动效",
    subtitle: "文字 / 路径 / 环境 / 冲击",
    kind: "motion",
    accent: "#1E293B",
    width: 1920,
    height: 1080,
    durationInFrames: MOTION_DEMO_FRAMES,
    component: MotionDemo as unknown as React.FC,
};

export const ALL_ITEMS: PreviewItem[] = [...VIDEO_ITEMS, MOTION_ITEM, ...STYLE_ITEMS];
