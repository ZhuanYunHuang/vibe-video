import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { parseProgressLine, stripAnsi, type Stage } from "./progress";

export type RenderMode = "full" | "test" | "scene";

export type JobSnapshot = {
    jobId: string;
    id: string;
    mode: RenderMode;
    status: Stage;
    stageLabel: string;
    progress: number;
    renderedFrames: number;
    totalFrames: number;
    etaSeconds: number | null;
    output: string | null;
    error: string | null;
    logTail: string[];
    startedAt: number;
    finishedAt: number | null;
};

type Job = JobSnapshot & {
    outputAbs: string | null;
    canceled: boolean;
    encodeStart: number | null;
};

const STAGE_RANK: Record<string, number> = { idle: -1, bundling: 0, rendering: 1, encoding: 2, done: 3, error: 3, canceled: 3 };
const STAGE_LABEL: Record<string, string> = {
    idle: "待机",
    bundling: "打包代码",
    rendering: "渲染帧",
    encoding: "编码",
    done: "完成",
    error: "失败",
    canceled: "已取消",
};

let active: Job | null = null;
let child: ChildProcess | null = null;
const finished = new Map<string, Job>();

const snapshot = (job: Job): JobSnapshot => ({
    jobId: job.jobId,
    id: job.id,
    mode: job.mode,
    status: job.status,
    stageLabel: job.stageLabel,
    progress: Math.round(job.progress * 10) / 10,
    renderedFrames: job.renderedFrames,
    totalFrames: job.totalFrames,
    etaSeconds: job.etaSeconds,
    output: job.output,
    error: job.error,
    logTail: job.logTail.slice(-16),
    startedAt: job.startedAt,
    finishedAt: job.finishedAt,
});

export const getStatus = (): JobSnapshot | null => (active ? snapshot(active) : null);
export const getOutputPath = (jobId: string): string | null => {
    const job = active?.jobId === jobId ? active : finished.get(jobId);
    return job && job.status === "done" ? job.outputAbs : null;
};
export const getJob = (jobId: string): JobSnapshot | null => {
    if (active?.jobId === jobId) return snapshot(active);
    const old = finished.get(jobId);
    return old ? snapshot(old) : null;
};

const isBusy = (job: Job | null) => !!job && ["bundling", "rendering", "encoding"].includes(job.status);

const stamp = () => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
};

export const startRender = (opts: {
    projectRoot: string;
    id: string;
    mode: RenderMode;
    frames?: [number, number];
    scale?: number;
}): { ok: true; job: JobSnapshot } | { ok: false; status: number; error: string; job: JobSnapshot | null } => {
    if (isBusy(active) && active) {
        return { ok: false, status: 409, error: "已有渲染任务在跑", job: snapshot(active) };
    }

    const { projectRoot, id, mode } = opts;
    const outDir = path.join(projectRoot, "out", "preview");
    fs.mkdirSync(outDir, { recursive: true });
    const fileName = `${id.replace(/[^A-Za-z0-9_-]/g, "")}-${mode}-${stamp()}.mp4`;
    const outputAbs = path.join(outDir, fileName);

    const job: Job = {
        jobId: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
        id,
        mode,
        status: "bundling",
        stageLabel: STAGE_LABEL.bundling,
        progress: 0,
        renderedFrames: 0,
        totalFrames: 0,
        etaSeconds: null,
        output: null,
        error: null,
        logTail: [],
        startedAt: Date.now(),
        finishedAt: null,
        outputAbs,
        canceled: false,
        encodeStart: null,
    };

    const cli = path.join(projectRoot, "node_modules", "@remotion", "cli", "remotion-cli.js");
    const args = [cli, "render", id, outputAbs];
    if (mode === "test") {
        const [a, b] = opts.frames ?? [0, 89];
        args.push(`--frames=${a}-${b}`, `--scale=${opts.scale ?? 0.5}`);
    }
    if (mode === "scene") {
        const [a, b] = opts.frames ?? [0, 89];
        args.push(`--frames=${a}-${b}`);
    }

    job.logTail.push(`$ remotion render ${id} ${fileName}${mode === "full" ? "" : ` --frames=${(opts.frames ?? [0, 89]).join("-")}`}`);

    try {
        child = spawn(process.execPath, args, {
            cwd: projectRoot,
            shell: false,
            windowsHide: true,
            stdio: ["ignore", "pipe", "pipe"],
            env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
        });
    } catch (err) {
        job.status = "error";
        job.error = String(err);
        job.finishedAt = Date.now();
        active = job;
        return { ok: false, status: 500, error: String(err), job: snapshot(job) };
    }

    if (!child || !child.stdout || !child.stderr) {
        job.status = "error";
        job.error = "无法启动 Remotion 进程";
        job.finishedAt = Date.now();
        active = job;
        return { ok: false, status: 500, error: job.error, job: snapshot(job) };
    }

    const handleLine = (raw: string) => {
        const line = stripAnsi(raw).trim();
        if (!line) return;
        if (/Rendered|Encoded|Bundling|Error|error|失败|Cannot|Cannot find/i.test(line)) {
            job.logTail.push(line.slice(0, 240));
            if (job.logTail.length > 60) job.logTail.shift();
        }
        const ev = parseProgressLine(line);
        if (!ev) return;
        if (STAGE_RANK[ev.stage] < STAGE_RANK[job.status]) return;

        if (ev.stage === "bundling" && typeof ev.bundlingPct === "number") {
            job.status = "bundling";
            job.stageLabel = STAGE_LABEL.bundling;
            job.progress = Math.max(job.progress, ev.bundlingPct * 0.1);
            return;
        }
        if (ev.stage === "rendering" && ev.total) {
            job.status = "rendering";
            job.stageLabel = STAGE_LABEL.rendering;
            job.renderedFrames = ev.rendered ?? 0;
            job.totalFrames = ev.total;
            job.etaSeconds = ev.etaSeconds ?? null;
            job.progress = Math.max(job.progress, 10 + (78 * job.renderedFrames) / job.totalFrames);
            return;
        }
        if (ev.stage === "encoding" && ev.encodeTotal) {
            const encoded = ev.encoded ?? 0;
            if (job.encodeStart === null) job.encodeStart = Date.now();
            job.status = "encoding";
            job.stageLabel = STAGE_LABEL.encoding;
            job.progress = Math.max(job.progress, 88 + (12 * encoded) / ev.encodeTotal);
            const elapsed = (Date.now() - (job.encodeStart ?? Date.now())) / 1000;
            job.etaSeconds = encoded > 8 ? Math.round((elapsed / encoded) * (ev.encodeTotal - encoded)) : null;
        }
    };

    const attach = (stream: NodeJS.ReadableStream) => {
        let buf = "";
        stream.on("data", (chunk: Buffer) => {
            buf += chunk.toString("utf8");
            const parts = buf.split(/\r\n|\n|\r/);
            buf = parts.pop() ?? "";
            parts.forEach(handleLine);
        });
        stream.on("end", () => {
            if (buf) handleLine(buf);
            buf = "";
        });
    };
    attach(child.stdout);
    attach(child.stderr);

    child.on("close", (code) => {
        const exists = job.outputAbs ? fs.existsSync(job.outputAbs) : false;
        if (job.canceled) {
            job.status = "canceled";
            job.stageLabel = STAGE_LABEL.canceled;
            if (exists) fs.rmSync(job.outputAbs!, { force: true });
        } else if (code === 0 && exists) {
            job.status = "done";
            job.stageLabel = STAGE_LABEL.done;
            job.progress = 100;
            job.etaSeconds = 0;
            job.output = path.relative(projectRoot, job.outputAbs!).replace(/\\/g, "/");
        } else {
            job.status = "error";
            job.stageLabel = STAGE_LABEL.error;
            job.error = `渲染进程退出码 ${code}${exists ? "" : "，未生成文件"}`;
        }
        job.finishedAt = Date.now();
        child = null;
    });

    if (active) finished.set(active.jobId, active);
    active = job;
    return { ok: true, job: snapshot(job) };
};

export const cancelRender = (): boolean => {
    if (!active || !child || !isBusy(active)) return false;
    active.canceled = true;
    const pid = child.pid;
    if (!pid) return false;
    if (process.platform === "win32") {
        spawn(path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "taskkill.exe"), ["/PID", String(pid), "/T", "/F"], {
            windowsHide: true,
            stdio: "ignore",
        });
    } else {
        child.kill("SIGINT");
        setTimeout(() => child?.kill("SIGKILL"), 3000);
    }
    return true;
};

export const killActiveRender = () => {
    if (child && active && isBusy(active)) {
        active.canceled = true;
        const pid = child.pid;
        if (pid && process.platform === "win32") {
            spawn(path.join(process.env.SystemRoot ?? "C:\\Windows", "System32", "taskkill.exe"), ["/PID", String(pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
        } else if (pid) {
            child.kill("SIGKILL");
        }
    }
};
