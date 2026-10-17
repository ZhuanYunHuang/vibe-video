export type Stage = "idle" | "bundling" | "rendering" | "encoding" | "done" | "error" | "canceled";

const ANSI = /\x1b\[[0-?]*[ -/]*[@-~]/g;

export const stripAnsi = (s: string) => s.replace(ANSI, "");

export type ProgressEvent = {
    stage: Stage;
    bundlingPct?: number;
    rendered?: number;
    total?: number;
    etaSeconds?: number | null;
    encoded?: number;
    encodeTotal?: number;
};

const parseEta = (raw: string): number | null => {
    const m = raw.match(/(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)/);
    if (!m) return null;
    return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
};

// Remotion CLI 在非 TTY 下按整行输出，这里逐行解析
export const parseProgressLine = (line: string): ProgressEvent | null => {
    const l = stripAnsi(line).trim();
    if (!l) return null;

    let m = l.match(/Bundling(?:\s+code)?\s+(\d+)%/);
    if (m) return { stage: "bundling", bundlingPct: Number(m[1]) };
    if (/Bundled code/.test(l)) return { stage: "bundling", bundlingPct: 100 };

    m = l.match(/Rendered\s+(\d+)\s*\/\s*(\d+)(?:,\s*time remaining:\s*([0-9hms ]+))?/);
    if (m) {
        return {
            stage: "rendering",
            rendered: Number(m[1]),
            total: Number(m[2]),
            etaSeconds: m[3] ? parseEta(m[3]) : null,
        };
    }

    m = l.match(/Encoded\s+(\d+)\s*\/\s*(\d+)/);
    if (m) return { stage: "encoding", encoded: Number(m[1]), encodeTotal: Number(m[2]) };

    return null;
};
