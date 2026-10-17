import { useCallback, useEffect, useRef, useState } from "react";

export type RenderMode = "full" | "test" | "scene";

export type JobStatus = {
    jobId?: string;
    id?: string;
    mode?: RenderMode;
    status: "idle" | "bundling" | "rendering" | "encoding" | "done" | "error" | "canceled";
    stageLabel?: string;
    progress?: number;
    renderedFrames?: number;
    totalFrames?: number;
    etaSeconds?: number | null;
    output?: string | null;
    error?: string | null;
    logTail?: string[];
    startedAt?: number;
    finishedAt?: number | null;
};

const BUSY = ["bundling", "rendering", "encoding"];

export const useRenderJob = () => {
    const [job, setJob] = useState<JobStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const timer = useRef(0);

    const stopPolling = useCallback(() => {
        window.clearTimeout(timer.current);
        timer.current = 0;
    }, []);

    const poll = useCallback(() => {
        const tick = async () => {
            try {
                const res = await fetch("/api/render/status", { cache: "no-store" });
                const data = (await res.json()) as JobStatus;
                setJob(data);
                if (BUSY.includes(data.status)) {
                    timer.current = window.setTimeout(tick, 900);
                } else {
                    setBusy(false);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
                setBusy(false);
            }
        };
        void tick();
    }, []);

    const start = useCallback(
        async (opts: { id: string; mode: RenderMode; frames?: [number, number]; scale?: number }) => {
            setError(null);
            try {
                const res = await fetch("/api/render", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(opts),
                });
                const data = (await res.json()) as { jobId?: string; job?: JobStatus; error?: string };
                if (!res.ok) {
                    if (res.status === 409 && data.job) {
                        setJob(data.job);
                        setBusy(true);
                        setError(data.error ?? "已有渲染任务");
                        poll();
                        return;
                    }
                    setError(data.error ?? `请求失败 ${res.status}`);
                    return;
                }
                setBusy(true);
                if (data.job) setJob(data.job);
                poll();
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            }
        },
        [poll],
    );

    const cancel = useCallback(async () => {
        try {
            await fetch("/api/render/cancel", { method: "POST" });
            poll();
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        }
    }, [poll]);

    useEffect(() => stopPolling, [stopPolling]);

    return { job, error, busy, start, cancel };
};
