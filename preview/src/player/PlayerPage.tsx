import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import type { SceneRange } from "@src/shared/core/scene-timeline";
import { getSceneRanges } from "@src/shared/core/scene-timeline";
import { FPS } from "@src/shared/core/timing";
import type { VideoSpec } from "@src/shared/core/types";
import { videoDuration } from "@src/shared/Video";
import { VIDEOS } from "@src/videos";
import { SceneList } from "../debug/SceneList";
import { RenderPanel } from "../render/RenderPanel";
import { PreviewComposition } from "./PreviewComposition";

const sessionKey = (id: string) => `vibe-preview:${id}`;

const timecode = (frame: number) => {
    const total = frame / FPS;
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60);
    const f = Math.round(frame % FPS);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(f).padStart(2, "0")}`;
};

export const PlayerPage: React.FC<{
    spec: VideoSpec;
    debug: boolean;
    onToggleDebug: () => void;
    onBack: () => void;
    onPick: (id: string) => void;
}> = ({ spec, debug, onToggleDebug, onBack, onPick }) => {
    const duration = useMemo(() => videoDuration(spec), [spec]);
    const ranges = useMemo(() => getSceneRanges(spec), [spec]);
    const playerRef = useRef<PlayerRef>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef(0);

    const initialFrame = useMemo(() => {
        try {
            const raw = sessionStorage.getItem(sessionKey(spec.id));
            if (raw) {
                const v = JSON.parse(raw) as { frame?: number };
                if (typeof v.frame === "number" && Number.isFinite(v.frame)) {
                    return Math.min(Math.max(0, Math.round(v.frame)), duration - 1);
                }
            }
        } catch {
            // 忽略损坏的会话数据
        }
        return 0;
    }, [spec.id, duration]);

    const [frame, setFrame] = useState(initialFrame);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [chrome, setChrome] = useState(true);
    const [loopScene, setLoopScene] = useState(false);
    const [renderOpen, setRenderOpen] = useState(false);
    const [started, setStarted] = useState(false);

    // 当前场景：重叠转场时取「正在进场」的那一场
    const current = useMemo(() => {
        let idx = 0;
        for (let i = 0; i < ranges.length; i += 1) if (frame >= ranges[i].from) idx = i;
        return idx;
    }, [frame, ranges]);
    const currentRef = useRef(current);
    currentRef.current = current;

    frameRef.current = frame;

    useEffect(() => {
        const p = playerRef.current;
        if (!p) return;
        const onFrame = (e: { detail: { frame: number } }) => setFrame(e.detail.frame);
        const onPlay = () => {
            setPlaying(true);
            setStarted(true);
        };
        const onPause = () => setPlaying(false);
        const onEnded = () => setPlaying(false);
        p.addEventListener("frameupdate", onFrame);
        p.addEventListener("seeked", onFrame);
        p.addEventListener("play", onPlay);
        p.addEventListener("pause", onPause);
        p.addEventListener("ended", onEnded);
        return () => {
            p.removeEventListener("frameupdate", onFrame);
            p.removeEventListener("seeked", onFrame);
            p.removeEventListener("play", onPlay);
            p.removeEventListener("pause", onPause);
            p.removeEventListener("ended", onEnded);
        };
    }, []);

    // 会话续播：整页刷新后回到原来的帧（暂停）
    useEffect(() => {
        const save = () => {
            try {
                sessionStorage.setItem(sessionKey(spec.id), JSON.stringify({ frame: frameRef.current }));
            } catch {
                // 隐私模式下忽略
            }
        };
        const timer = window.setInterval(save, 500);
        window.addEventListener("pagehide", save);
        const hot = import.meta.hot;
        hot?.on("vite:beforeFullReload", save);
        return () => {
            window.clearInterval(timer);
            window.removeEventListener("pagehide", save);
            hot?.off("vite:beforeFullReload", save);
        };
    }, [spec.id]);

    // 控制条：鼠标静止且正在播放时隐藏
    useEffect(() => {
        let timer = 0;
        const onMove = () => {
            setChrome(true);
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                if (playerRef.current?.isPlaying()) setChrome(false);
            }, 1600);
        };
        window.addEventListener("pointermove", onMove);
        return () => {
            window.removeEventListener("pointermove", onMove);
            window.clearTimeout(timer);
        };
    }, []);

    const seek = useCallback(
        (f: number) => {
            const p = playerRef.current;
            if (!p) return;
            const lo = loopScene ? ranges[currentRef.current].from : 0;
            const hi = loopScene ? ranges[currentRef.current].endExclusive - 1 : duration - 1;
            p.seekTo(Math.min(Math.max(Math.round(f), lo), hi));
        },
        [duration, loopScene, ranges],
    );

    const togglePlay = useCallback((e?: React.SyntheticEvent) => {
        const p = playerRef.current;
        if (!p) return;
        if (p.isPlaying()) p.pause();
        else p.play(e);
    }, []);

    const toggleMute = useCallback(() => {
        const p = playerRef.current;
        if (!p) return;
        if (p.isMuted()) {
            p.unmute();
            setMuted(false);
        } else {
            p.mute();
            setMuted(true);
        }
    }, []);

    const selectScene = useCallback((r: SceneRange) => {
        const p = playerRef.current;
        if (!p) return;
        p.pause();
        p.seekTo(r.from);
    }, []);

    const toggleLoop = useCallback(() => {
        const p = playerRef.current;
        const next = !loopScene;
        setLoopScene(next);
        if (next && p) {
            p.pause();
            p.seekTo(ranges[currentRef.current].from);
        }
    }, [loopScene, ranges]);

    const toggleFullscreen = useCallback(() => {
        if (document.fullscreenElement) void document.exitFullscreen();
        else void stageRef.current?.requestFullscreen();
    }, []);

    // 键盘
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const el = e.target as HTMLElement | null;
            if (el && (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || el.isContentEditable)) return;
            const p = playerRef.current;
            if (!p) return;
            const idx = currentRef.current;
            const step = e.shiftKey ? FPS : 1;
            switch (e.key) {
                case " ":
                case "k":
                    e.preventDefault();
                    togglePlay(e as unknown as React.SyntheticEvent);
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    seek(frameRef.current - step);
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    seek(frameRef.current + step);
                    break;
                case "[":
                    e.preventDefault();
                    selectScene(ranges[Math.max(0, idx - 1)]);
                    break;
                case "]":
                    e.preventDefault();
                    selectScene(ranges[Math.min(ranges.length - 1, idx + 1)]);
                    break;
                case "Home":
                    e.preventDefault();
                    selectScene(ranges[0]);
                    break;
                case "End":
                    e.preventDefault();
                    p.pause();
                    p.seekTo(duration - 1);
                    break;
                case "f":
                    toggleFullscreen();
                    break;
                case "m":
                    toggleMute();
                    break;
                case "d":
                    onToggleDebug();
                    break;
                case "r":
                    p.pause();
                    setRenderOpen(true);
                    break;
                default: {
                    const n = Number(e.key);
                    if (Number.isInteger(n) && n >= 1 && n <= 9 && ranges[n - 1]) {
                        e.preventDefault();
                        selectScene(ranges[n - 1]);
                    }
                }
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [duration, onToggleDebug, ranges, seek, selectScene, toggleFullscreen, toggleMute, togglePlay]);

    const loopRange = ranges[current];
    const inFrame = loopScene ? loopRange.from : 0;
    const outFrame = loopScene ? loopRange.endExclusive - 1 : duration - 1;

    return (
        <div className={`player ${chrome ? "" : "bare"} ${debug ? "with-debug" : ""}`} ref={stageRef}>
            <Player
                ref={playerRef}
                component={PreviewComposition}
                inputProps={{ spec }}
                durationInFrames={duration}
                compositionWidth={spec.width}
                compositionHeight={spec.height}
                fps={FPS}
                controls={false}
                clickToPlay
                spaceKeyToPlayOrPause={false}
                loop={loopScene}
                inFrame={inFrame}
                outFrame={outFrame}
                initialFrame={initialFrame}
                moveToBeginningWhenEnded={false}
                numberOfSharedAudioTags={20}
                renderLoading={() => <div className="stage-note">加载中…</div>}
                errorFallback={({ error }) => <div className="stage-note error">预览出错：{error.message}</div>}
                style={{ width: "100%", height: "100%" }}
            />

            {!started ? (
                <div className="tap-hint">
                    <span className="play-tri" />
                    点击画面播放
                </div>
            ) : null}

            <div className={`chrome top ${chrome ? "show" : ""}`}>
                <button className="icon" onClick={onBack} title="返回列表">
                    ←
                </button>
                <div className="titles">
                    <div className="t">{spec.id}</div>
                    <div className="s">
                        {loopRange.name} · {loopRange.startBeat}–{loopRange.endBeat} 拍
                    </div>
                </div>
                <div className="spacer" />
                <select className="picker" value={spec.id} onChange={(e) => onPick(e.target.value)}>
                    {VIDEOS.map((v) => (
                        <option key={v.id} value={v.id}>
                            {v.id}
                        </option>
                    ))}
                </select>
                <button className={debug ? "on" : ""} onClick={onToggleDebug}>
                    调试 D
                </button>
                <button
                    className="primary"
                    onClick={() => {
                        playerRef.current?.pause();
                        setRenderOpen(true);
                    }}
                >
                    渲染成片 R
                </button>
            </div>

            <div className={`chrome bottom ${chrome ? "show" : ""}`}>
                <button className="icon wide" onClick={(e) => togglePlay(e)}>
                    {playing ? "❚❚" : "▶"}
                </button>
                <span className="tc">
                    {timecode(frame)} <em>/ {timecode(duration)}</em>
                </span>
                <input
                    className="scrub"
                    type="range"
                    min={0}
                    max={duration - 1}
                    value={Math.min(frame, duration - 1)}
                    onChange={(e) => seek(Number(e.target.value))}
                />
                <button className="icon" onClick={toggleMute} title="静音 M">
                    {muted ? "🔇" : "🔊"}
                </button>
                <button className="icon" onClick={toggleFullscreen} title="全屏 F">
                    ⛶
                </button>
            </div>

            {debug ? (
                <SceneList
                    ranges={ranges}
                    frame={frame}
                    duration={duration}
                    bpm={spec.bpm}
                    offset={spec.offset}
                    current={current}
                    loop={loopScene}
                    onSelect={selectScene}
                    onToggleLoop={toggleLoop}
                />
            ) : null}

            {renderOpen ? (
                <RenderPanel
                    spec={spec}
                    scene={loopRange}
                    onClose={() => setRenderOpen(false)}
                    onBeforeStart={() => playerRef.current?.pause()}
                />
            ) : null}
        </div>
    );
};
