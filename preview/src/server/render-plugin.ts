import fs from "node:fs";
import type { IncomingMessage, ServerResponse } from "node:http";
import path from "node:path";
import type { Plugin } from "vite";
import { cancelRender, getJob, getOutputPath, getStatus, killActiveRender, startRender, type RenderMode } from "./render-job";

const MAX_BODY = 64 * 1024;

const json = (res: ServerResponse, code: number, data: unknown) => {
    const body = JSON.stringify(data);
    res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(body);
};

const readJson = (req: IncomingMessage): Promise<Record<string, unknown>> =>
    new Promise((resolve, reject) => {
        let size = 0;
        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => {
            size += chunk.length;
            if (size > MAX_BODY) {
                reject(new Error("请求体过大"));
                req.destroy();
                return;
            }
            chunks.push(chunk);
        });
        req.on("end", () => {
            try {
                const raw = Buffer.concat(chunks).toString("utf8");
                resolve(raw ? (JSON.parse(raw) as Record<string, unknown>) : {});
            } catch {
                reject(new Error("请求体不是合法 JSON"));
            }
        });
        req.on("error", reject);
    });

const serveVideo = (res: ServerResponse, file: string, range: string | undefined) => {
    const stat = fs.statSync(file);
    const total = stat.size;
    const head = {
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
    };
    if (!range) {
        res.writeHead(200, { ...head, "Content-Length": total });
        fs.createReadStream(file).pipe(res);
        return;
    }
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    let start = m?.[1] ? Number(m[1]) : 0;
    let end = m?.[2] ? Number(m[2]) : total - 1;
    if (!Number.isFinite(start) || start < 0) start = 0;
    if (!Number.isFinite(end) || end >= total) end = total - 1;
    if (start > end) {
        res.writeHead(416, { "Content-Range": `bytes */${total}` });
        res.end();
        return;
    }
    res.writeHead(206, {
        ...head,
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Content-Length": end - start + 1,
    });
    fs.createReadStream(file, { start, end }).pipe(res);
};

// 本地渲染接口：只在 dev server 生效，绑定 127.0.0.1
export const renderPlugin = ({ projectRoot }: { projectRoot: string }): Plugin => ({
    name: "vibe-preview-render",
    apply: "serve",
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
            const url = new URL(req.url ?? "/", "http://127.0.0.1");
            if (!url.pathname.startsWith("/api/render")) return next();

            try {
                if (url.pathname === "/api/render" && req.method === "POST") {
                    const body = await readJson(req);
                    const id = String(body.id ?? "");
                    const mode = String(body.mode ?? "full") as RenderMode;
                    if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(id)) return json(res, 400, { error: "非法视频 id" });
                    if (!["full", "test", "scene"].includes(mode)) return json(res, 400, { error: "非法渲染模式" });

                    let frames: [number, number] | undefined;
                    if (Array.isArray(body.frames) && body.frames.length === 2) {
                        const a = Number(body.frames[0]);
                        const b = Number(body.frames[1]);
                        if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < a) return json(res, 400, { error: "非法帧区间" });
                        frames = [a, b];
                    }
                    if (mode === "scene" && !frames) return json(res, 400, { error: "scene 模式需要 frames" });
                    const scale = typeof body.scale === "number" ? Math.min(1, Math.max(0.25, body.scale)) : undefined;

                    const r = startRender({ projectRoot, id, mode, frames, scale });
                    if (!r.ok) return json(res, r.status, { error: r.error, job: r.job });
                    return json(res, 202, { jobId: r.job.jobId, job: r.job });
                }

                if (url.pathname === "/api/render/status" && req.method === "GET") {
                    return json(res, 200, getStatus() ?? { status: "idle" });
                }

                if (url.pathname === "/api/render/cancel" && req.method === "POST") {
                    return json(res, 200, { ok: cancelRender() });
                }

                if (url.pathname === "/api/render/output" && (req.method === "GET" || req.method === "HEAD")) {
                    const jobId = url.searchParams.get("jobId") ?? "";
                    const job = getJob(jobId);
                    const file = getOutputPath(jobId);
                    if (!job || !file || !fs.existsSync(file)) return json(res, 404, { error: "成片不存在" });
                    if (req.method === "HEAD") {
                        const stat = fs.statSync(file);
                        res.writeHead(200, { "Content-Type": "video/mp4", "Content-Length": stat.size, "Accept-Ranges": "bytes" });
                        return res.end();
                    }
                    return serveVideo(res, file, req.headers.range);
                }

                return json(res, 404, { error: "未知接口" });
            } catch (err) {
                return json(res, 500, { error: err instanceof Error ? err.message : String(err) });
            }
        });

        server.httpServer?.once("close", () => {
            killActiveRender();
        });
        process.once("exit", killActiveRender);
    },
});

export const previewPaths = (projectRoot: string) => ({
    outDir: path.join(projectRoot, "out", "preview"),
});
