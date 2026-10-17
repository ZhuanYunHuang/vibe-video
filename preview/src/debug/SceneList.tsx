import React from "react";
import { FPS } from "@src/shared/core/timing";
import type { SceneRange } from "@src/shared/core/scene-timeline";

const timecode = (frame: number) => {
    const total = frame / FPS;
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const f = Math.round(frame % FPS);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(f).padStart(2, "0")}`;
};

export const FrameHud: React.FC<{ frame: number; duration: number; bpm: number; offset: number; scene: SceneRange | null }> = ({ frame, duration, bpm, offset, scene }) => {
    const beat = frame < offset ? null : (frame - offset) / ((60 / bpm) * FPS);
    const p = scene ? Math.min(1, Math.max(0, (frame - scene.from) / scene.durationInFrames)) : 0;
    return (
        <div className="hud">
            <div className="hud-row">
                <span className="hud-k">帧</span>
                <span className="hud-v">
                    {frame} <em>/ {duration - 1}</em>
                </span>
            </div>
            <div className="hud-row">
                <span className="hud-k">时间</span>
                <span className="hud-v">{timecode(frame)}</span>
            </div>
            <div className="hud-row">
                <span className="hud-k">拍</span>
                <span className="hud-v">{beat === null ? "片头" : beat.toFixed(2)}</span>
            </div>
            <div className="hud-row">
                <span className="hud-k">场景</span>
                <span className="hud-v">{scene ? `${scene.index + 1}. ${scene.name}` : "—"}</span>
            </div>
            <div className="hud-bar">
                <span style={{ width: `${p * 100}%` }} />
            </div>
        </div>
    );
};

export const SceneList: React.FC<{
    ranges: SceneRange[];
    frame: number;
    duration: number;
    bpm: number;
    offset: number;
    current: number;
    loop: boolean;
    onSelect: (r: SceneRange) => void;
    onToggleLoop: () => void;
}> = ({ ranges, frame, duration, bpm, offset, current, loop, onSelect, onToggleLoop }) => (
    <aside className="debug">
        <FrameHud frame={frame} duration={duration} bpm={bpm} offset={offset} scene={ranges[current] ?? null} />
        <div className="debug-head">
            场景 · {ranges.length}
            <label className="loop">
                <input type="checkbox" checked={loop} onChange={onToggleLoop} />
                循环本场
            </label>
        </div>
        <div className="debug-list">
            {ranges.map((r, i) => (
                <button key={r.index} className={`scene ${i === current ? "on" : ""}`} onClick={() => onSelect(r)}>
                    <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="name">{r.name}</span>
                    <span className="meta">
                        {r.startBeat}–{r.endBeat} 拍 · {(r.durationInFrames / FPS).toFixed(1)}s
                    </span>
                    <span className="frames">
                        {r.from}–{r.endExclusive - 1}
                    </span>
                </button>
            ))}
        </div>
    </aside>
);
