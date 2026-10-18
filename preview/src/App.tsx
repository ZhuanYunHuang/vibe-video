import React, { useEffect, useState } from "react";
import { FPS } from "@src/shared/core/timing";
import { ALL_ITEMS, MOTION_ITEM, STYLE_ITEMS, VIDEO_ITEMS, type PreviewItem } from "./data/items";
import { PlayerPage } from "./player/PlayerPage";

type Route = { videoId: string | null; debug: boolean; frame?: number };

const readRoute = (): Route => {
    const p = new URLSearchParams(window.location.search);
    const f = Number(p.get("f"));
    return { videoId: p.get("v"), debug: p.get("debug") === "1", frame: p.get("f") !== null && Number.isFinite(f) ? f : undefined };
};

const prettyDuration = (frames: number) => {
    const s = Math.round(frames / FPS);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const Card: React.FC<{ item: PreviewItem; onOpen: () => void }> = ({ item, onOpen }) => (
    <button className="card" onClick={onOpen}>
        <div className="card-swatch" style={{ background: item.accent }}>
            <span>{item.kind === "video" ? item.id : item.kind === "motion" ? "MOTION" : "STYLE"}</span>
        </div>
        <div className="card-body">
            <div className="card-title">{item.title}</div>
            <div className="card-sub">
                {prettyDuration(item.durationInFrames)} · {item.subtitle}
            </div>
        </div>
    </button>
);

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
        if (route.frame !== undefined) q.set("f", String(route.frame));
        const url = q.toString() ? `/?${q.toString()}` : "/";
        window.history.pushState(null, "", url);
        setRoute({ videoId, debug, frame: videoId ? undefined : route.frame });
    };

    const item = route.videoId ? ALL_ITEMS.find((v) => v.id === route.videoId) : undefined;

    if (item) {
        return <PlayerPage key={item.id} item={item} all={ALL_ITEMS} debug={route.debug} startFrame={route.frame} onToggleDebug={() => go(item.id, !route.debug)} onBack={() => go(null)} onPick={(id) => go(id, route.debug)} />;
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
                    <div>{ALL_ITEMS.length} 个可播条目</div>
                    <div>
                        {VIDEO_ITEMS.length} 业务 · {STYLE_ITEMS.length} 风格 · 1 动效
                    </div>
                    <div>127.0.0.1:5180</div>
                </div>
            </header>

            <div className="section-head">
                <h2>业务视频</h2>
                <span>{VIDEO_ITEMS.length}</span>
            </div>
            <div className="grid">
                {VIDEO_ITEMS.map((v) => (
                    <Card key={v.id} item={v} onOpen={() => go(v.id)} />
                ))}
            </div>

            <div className="section-head">
                <h2>特效 Demo</h2>
                <span>{STYLE_ITEMS.length + 1}</span>
            </div>
            <div className="grid">
                <Card item={MOTION_ITEM} onOpen={() => go(MOTION_ITEM.id)} />
                {STYLE_ITEMS.map((v) => (
                    <Card key={v.id} item={v} onOpen={() => go(v.id)} />
                ))}
            </div>

            <footer className="home-foot">快捷键：空格播放 · ←/→ 逐帧 · [ ] 切场 · D 调试 · M 静音 · F 全屏</footer>
        </div>
    );
};
