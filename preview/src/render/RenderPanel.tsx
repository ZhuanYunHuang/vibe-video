import React, { useMemo, useState } from "react";
import type { SceneRange } from "@src/shared/core/scene-timeline";
import { FPS } from "@src/shared/core/timing";
import type { VideoSpec } from "@src/shared/core/types";
import { useRenderJob, type RenderMode } from "./useRenderJob";

const etaText = (s: number | null | undefined) => {
    if (s === null || s === undefined) return "估算中";
    if (s <= 0) return "即将完成";
    const m = Math.floor(s / 60);
    const sec = Math.round(s % 60);
    return m > 0 ? `${m} 分 ${sec} 秒` : `${sec} 秒`;
};

export const RenderPanel: React.FC<{
    spec: VideoSpec;
    scene: SceneRange;
    onClose: () => void;
    onBeforeStart: () => void;
}> = ({ spec, scene, onClose, onBeforeStart }) => {
    const { job, error, busy, start, cancel } = useRenderJob();
    const [mode, setMode] = useState<RenderMode>("test");
    const [scale, setScale] = useState(0.5);
    const [copied, setCopied] = useState(false);

    const sceneFrames = useMemo(() => [scene.from, scene.endExclusive - 1] as [number, number], [scene]);

    const begin = () => {
        onBeforeStart();
        void start({
            id: spec.id,
            mode,
            frames: mode === "test" ? [0, 89] : mode === "scene" ? sceneFrames : undefined,
            scale: mode === "test" ? scale : undefined,
        });
    };

    const copyPath = async () => {
        if (!job?.output) return;
        try {
            await navigator.clipboard.writeText(job.output);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    const done = job?.status === "done";
    const running = busy && !!job && ["bundling", "rendering", "encoding"].includes(job.status);

    return (
        <div className="mask" onPointerDown={onClose}>
            <div className="render-panel" onPointerDown={(e) => e.stopPropagation()}>
                <header>
                    <div>
                        <div className="rp-title">渲染成片</div>
                        <div className="rp-sub">
                            {spec.id} · {scene.name}
                        </div>
                    </div>
                    <button className="icon" onClick={onClose}>
                        ×
                    </button>
                </header>

                {!running && !done ? (
                    <>
                        <div className="rp-modes">
                            {(
                                [
                                    ["test", "试渲染", "前 90 帧 · 约 30 秒"],
                                    ["scene", "当前场景", `${(scene.durationInFrames / FPS).toFixed(1)}s`],
                                    ["full", "全片", "1080p · 约 10 分钟"],
                                ] as [RenderMode, string, string][]
                            ).map(([m, label, hint]) => (
                                <button key={m} className={`rp-mode ${mode === m ? "on" : ""}`} onClick={() => setMode(m)}>
                                    <span className="rp-mode-t">{label}</span>
                                    <span className="rp-mode-h">{hint}</span>
                                </button>
                            ))}
                        </div>

                        {mode === "test" ? (
                            <label className="rp-scale">
                                缩放
                                <select value={scale} onChange={(e) => setScale(Number(e.target.value))}>
                                    <option value={1}>1× · 1920×1080</option>
                                    <option value={0.75}>0.75× · 1440×810</option>
                                    <option value={0.5}>0.5× · 960×540</option>
                                </select>
                            </label>
                        ) : null}

                        <div className="rp-note">
                            {mode === "full"
                                ? "全片渲染会占用 CPU/GPU，期间预览可能变卡；可以随时取消。"
                                : "只渲染一小段，用来确认排版、节奏和音频，不产出交付版。"}
                        </div>

                        <button className="rp-start" onClick={begin}>
                            开始渲染
                        </button>
                    </>
                ) : null}

                {job ? (
                    <div className="rp-job">
                        <div className="rp-stage">
                            <span className={`dot ${job.status}`} />
                            {job.stageLabel ?? job.status}
                            <span className="rp-pct">{Math.round(job.progress ?? 0)}%</span>
                        </div>
                        <div className="rp-bar">
                            <span style={{ width: `${Math.max(0, Math.min(100, job.progress ?? 0))}%` }} />
                        </div>
                        {job.totalFrames ? (
                            <div className="rp-meta">
                                {job.renderedFrames ?? 0} / {job.totalFrames} 帧 · 剩余 {etaText(job.etaSeconds)}
                            </div>
                        ) : null}
                        {running ? (
                            <button className="rp-cancel" onClick={() => void cancel()}>
                                取消渲染
                            </button>
                        ) : null}
                    </div>
                ) : null}

                {error ? <div className="rp-error">{error}</div> : null}

                {done && job?.jobId ? (
                    <div className="rp-done">
                        <video src={`/api/render/output?jobId=${job.jobId}`} controls />
                        <div className="rp-path">
                            <code>{job.output}</code>
                            <button onClick={() => void copyPath()}>{copied ? "已复制" : "复制路径"}</button>
                        </div>
                        <button className="rp-start ghost" onClick={() => setMode("full")}>
                            再渲染一版
                        </button>
                    </div>
                ) : null}

                {job?.logTail?.length ? (
                    <details className="rp-log">
                        <summary>日志</summary>
                        <pre>{job.logTail.join("\n")}</pre>
                    </details>
                ) : null}
            </div>
        </div>
    );
};
