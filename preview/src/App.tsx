import React, { useEffect, useState } from "react";
import { VIDEOS } from "@src/videos";
import { FPS } from "@src/shared/core/timing";
import { videoDuration } from "@src/shared/Video";
import { PlayerPage } from "./player/PlayerPage";

type Route = { videoId: string | null; debug: boolean };

const readRoute = (): Route => {
    const p = new URLSearchParams(window.location.search);
    return { videoId: p.get("v"), debug: p.get("debug") === "1" };
};

const prettyDuration = (frames: number) => {
    const s = Math.round(frames / FPS);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export const App: React.FC = () => {
    const [route, setRoute] = useState<Route>(readRoute);

    useEffect(() => {
        const onPop = () => setRoute(readRoute());
        window.addEventListener("popstate", onPop);
        return () => window.removeEventListener("popstate", onPop);
    }, []);

    const go = (videoId: string | null, debug = route.debug) => {
        const q = new URLSearchParams();
        if (videoId) q.set("v", videoId);
        if (debug) q.set("debug", "1");
        const url = q.toString() ? `/?${q.toString()}` : "/";
        window.history.pushState(null, "", url);
        setRoute({ videoId, debug });
    };

    const spec = route.videoId ? VIDEOS.find((v) => v.id === route.videoId) : undefined;

    if (spec) {
        return (
            <PlayerPage
                key={spec.id}
                spec={spec}
                debug={route.debug}
                onToggleDebug={() => go(spec.id, !route.debug)}
                onBack={() => go(null)}
                onPick={(id) => go(id, route.debug)}
            />
        );
    }

    return (
        <div className="home">
            <header className="home-head">
                <div>
                    <div className="eyebrow">VIBE VIDEO · PREVIEW</div>
                    <h1>实时预览</h1>
                    <p>改完即看，不渲染。确认后再点「渲染成片」，或直接叫我来跑。</p>
                </div>
                <div className="home-meta">
                    <div>{VIDEOS.length} 支视频</div>
                    <div>127.0.0.1:5180</div>
                </div>
            </header>

            <div className="grid">
                {VIDEOS.map((v) => {
                    const frames = videoDuration(v);
                    const accent = v.bg ?? v.style?.P.bg ?? "#14161B";
                    return (
                        <button key={v.id} className="card" onClick={() => go(v.id)}>
                            <div className="card-swatch" style={{ background: accent }}>
                                <span>{v.id}</span>
                            </div>
                            <div className="card-body">
                                <div className="card-title">{v.id}</div>
                                <div className="card-sub">
                                    {prettyDuration(frames)} · {v.scenes.length} 场 · {v.width}×{v.height}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <footer className="home-foot">
                快捷键：空格播放 · ←/→ 逐帧 · [ ] 切场 · D 调试 · M 静音 · F 全屏
            </footer>
        </div>
    );
};
