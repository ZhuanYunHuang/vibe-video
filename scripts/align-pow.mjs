// POW 逐字强制对齐 v8：谱通量起音检测 + 动态规划逐字吸附
// 用法：node scripts/align-pow.mjs [--dry]
//   --dry  只打印对比结果，不写回 src/videos/pow/kit/times.ts
// 思路：
//   ① ffmpeg 解码 public/pow/bgm.mp3 → 22050Hz 单声道 WAV
//   ② STFT（NFFT 1024 / hop 128 → 172 帧/秒）取 300–2800Hz 人声带谱通量，去均值整流成起音包络
//   ③ 以 times.ts v7 的逐字时间为先验，每个字在窗口内用 DP 吸附到最强起音：
//      行首/行尾锚定先验强（前半段 Whisper 锚点可信），后半段（≥50s，原推演区）放宽窗口、减弱先验
//   ④ 12 个枪/炮卡点字硬性钉回 SHOTS 秒数（字出现的瞬间 = 枪/炮声）
//   ⑤ 空格/标点不参与 DP，取前一字符的时间
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DRY = process.argv.includes("--dry");
const SAMPLE_RATE = 22050;
const HOP = 128;
const NFFT = 1024;
const ENV_FPS = SAMPLE_RATE / HOP; // ≈172.27

// ---------- ① ffmpeg 解码 ----------
const findFfmpeg = () => {
    const root = join(ROOT, "node_modules", "@remotion");
    const exeName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
    if (existsSync(root)) {
        for (const dir of readdirSync(root)) {
            if (!dir.startsWith("compositor-")) continue;
            const candidate = join(root, dir, exeName);
            if (existsSync(candidate)) return candidate;
        }
    }
    return "ffmpeg";
};
const workDir = mkdtempSync(join(tmpdir(), "pow-align-"));
const wavPath = join(workDir, "audio.wav");
execFileSync(findFfmpeg(), ["-hide_banner", "-loglevel", "error", "-y", "-i", join(ROOT, "public/pow/bgm.mp3"), "-ac", "1", "-ar", String(SAMPLE_RATE), "-c:a", "pcm_s16le", wavPath]);
const buf = readFileSync(wavPath);
const dataStart = buf.indexOf("data") + 8;
const sampleCount = (buf.length - dataStart) >> 1;
const pcm = new Float32Array(sampleCount);
for (let i = 0; i < sampleCount; i++) pcm[i] = buf.readInt16LE(dataStart + i * 2) / 32768;
console.log(`音频 ${sampleCount / SAMPLE_RATE} s / ${SAMPLE_RATE} Hz`);

// ---------- ② STFT + 谱通量 ----------
// 迭代基-2 FFT
const fft = (re, im) => {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
        let bit = n >> 1;
        for (; j & bit; bit >>= 1) j ^= bit;
        j ^= bit;
        if (i < j) {
            [re[i], re[j]] = [re[j], re[i]];
            [im[i], im[j]] = [im[j], im[i]];
        }
    }
    for (let len = 2; len <= n; len <<= 1) {
        const ang = (-2 * Math.PI) / len;
        const wr = Math.cos(ang), wi = Math.sin(ang);
        for (let i = 0; i < n; i += len) {
            let cr = 1, ci = 0;
            for (let k = 0; k < len / 2; k++) {
                const ur = re[i + k], ui = im[i + k];
                const vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci;
                const vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
                re[i + k] = ur + vr; im[i + k] = ui + vi;
                re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
                const nr = cr * wr - ci * wi;
                ci = cr * wi + ci * wr; cr = nr;
            }
        }
    }
};

const win = new Float32Array(NFFT);
for (let i = 0; i < NFFT; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (NFFT - 1));
const bins = NFFT / 2;
const binHz = SAMPLE_RATE / NFFT;
const loBin = Math.max(1, Math.round(300 / binHz));   // 人声带 300–2800Hz
const hiBin = Math.min(bins - 1, Math.round(2800 / binHz));
const framesN = Math.floor((sampleCount - NFFT) / HOP);
const magPrev = new Float32Array(hiBin + 1);
const magCur = new Float32Array(hiBin + 1);
const re = new Float32Array(NFFT), im = new Float32Array(NFFT);
const flux = new Float32Array(framesN);
const bandE = new Float32Array(framesN);
for (let f = 0; f < framesN; f++) {
    const off = f * HOP;
    for (let i = 0; i < NFFT; i++) { re[i] = pcm[off + i] * win[i]; im[i] = 0; }
    fft(re, im);
    let e = 0;
    for (let b = loBin; b <= hiBin; b++) {
        const m = Math.hypot(re[b], im[b]);
        magCur[b] = Math.log(1e-6 + m);
        e += m * m;
    }
    bandE[f] = e;
    let s = 0;
    for (let b = loBin; b <= hiBin; b++) { const d = magCur[b] - magPrev[b]; if (d > 0) s += d; }
    flux[f] = s;
    for (let b = loBin; b <= hiBin; b++) magPrev[b] = magCur[b];
}
// 去局部均值（1s 窗）+ 整流
const W = Math.round(ENV_FPS * 0.5);
const onset = new Float32Array(framesN);
for (let f = 0; f < framesN; f++) {
    let s = 0, c = 0;
    for (let k = Math.max(0, f - W); k < Math.min(framesN, f + W); k++) { s += flux[k]; c++; }
    onset[f] = Math.max(0, flux[f] - s / c);
}
// onsetScore(t)：[t-0.03, t+0.07] 内最强起音，按全曲 92 分位归一到 0–1
const sorted = Array.from(onset).sort((a, b) => a - b);
const q92 = sorted[Math.floor(framesN * 0.92)] || 1;
const scoreAt = (t) => {
    const a = Math.max(0, Math.round((t - 0.03) * ENV_FPS));
    const b = Math.min(framesN - 1, Math.round((t + 0.07) * ENV_FPS));
    let m = 0;
    for (let k = a; k <= b; k++) if (onset[k] > m) m = onset[k];
    return Math.min(1, m / q92);
};
// 人声活跃度 voc(t)：带内能量滑动最大（0.15s）→ dB → 90 分位归一到 0–1
// 用途：区分「人声在唱」与「只有鼓点」——鼓点瞬态后带内能量回落，人声会持续
const runMax = new Float32Array(framesN);
{
    const R = Math.round(ENV_FPS * 0.15);
    for (let f = 0; f < framesN; f++) {
        let m = 0;
        for (let k = Math.max(0, f - R); k <= Math.min(framesN - 1, f + R); k++) if (bandE[k] > m) m = bandE[k];
        runMax[f] = Math.log10(1e-9 + m);
    }
    const srt = Array.from(runMax).sort((a, b) => a - b);
    const q90 = srt[Math.floor(framesN * 0.9)] || 1;
    const floor = srt[Math.floor(framesN * 0.35)] || 0;
    for (let f = 0; f < framesN; f++) runMax[f] = Math.min(1, Math.max(0, (runMax[f] - floor) / (q90 - floor || 1)));
}
const vocAt = (t) => {
    // 取 [t, t+0.25] 的均值：人声会持续（均值高），鼓点瞬态后立即安静（均值低）
    const a = Math.min(framesN - 1, Math.max(0, Math.round(t * ENV_FPS)));
    const b = Math.min(framesN - 1, a + Math.round(0.25 * ENV_FPS));
    let s = 0;
    for (let k = a; k <= b; k++) s += runMax[k];
    return s / (b - a + 1);
};

// ---------- ③ 歌词数据（TS 转译后加载） ----------
const buildDir = join(workDir, "build");
mkdirSync(join(buildDir, "kit"), { recursive: true });
const compile = (file, out) => {
    const src = readFileSync(join(ROOT, "src/videos/pow/kit", file), "utf8");
    const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
    writeFileSync(join(buildDir, "kit", out), js);
};
compile("times.ts", "times.js");
compile("lyrics.ts", "lyrics.js");
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { LYRICS, SHOTS } = require(join(buildDir, "kit", "lyrics.js"));
const LINE_CHARS_OLD = require(join(buildDir, "kit", "times.js")).LINE_CHARS;

// 每行的字符序列（与 lyrics.ts 拼接规则一致）+ shot span 区间（多字词如 mode 整体占 1 发枪）
const lines = LYRICS.map((l) => {
    const chars = [];
    const shotSpans = []; // {start, len}
    for (const row of l.rows) for (const sp of row.spans) {
        const start = chars.length;
        for (const ch of Array.from(sp.t)) chars.push(ch);
        if (sp.shot) shotSpans.push({ start, len: chars.length - start });
    }
    return { i: l.i, chars, shotSpans };
});
const okOld = LINE_CHARS_OLD.length === lines.length && lines.every((ln, k) => LINE_CHARS_OLD[k] && LINE_CHARS_OLD[k].length === ln.chars.length);
if (!okOld) {
    console.error("v7 LINE_CHARS 与歌词字符数不一致，无法作为先验");
    process.exit(1);
}

// ---------- ④ DP 对齐 ----------
// 候选：先验 ±win 秒，步长 1 env 帧
// 发射代价 = -3×起音分 + anchorW×min(|t-先验|, cap)
// 转移代价：行内 dt 过小/过大惩罚 + 偏离 0.17s 的软代价；行间允许更长间隙
const transInLine = (dt) => {
    if (dt < 0.04) return 8 + (0.04 - dt) * 100;
    if (dt < 0.07) return 2.5;
    if (dt > 0.55) return 2.5 + (dt - 0.55) * 8;
    return 1.2 * Math.abs(Math.log(dt / 0.17));
};
const transAcrossLine = (dt) => {
    if (dt < 0.06) return 8;
    if (dt > 2.8) return 1e6;
    return dt > 1.2 ? (dt - 1.2) * 0.8 : 0;
};

// 展平成全局字符序列（跳过空格，记录行边界）；shot span 的字符带 pin（= 对应 SHOTS 秒，DP 硬约束）
const shotTotal = lines.reduce((n, ln) => n + ln.shotSpans.length, 0);
if (shotTotal !== SHOTS.length) {
    console.error(`shot span 数 ${shotTotal} ≠ SHOTS 数 ${SHOTS.length}`);
    process.exit(1);
}
const items = [];
let shotCursor = 0;
lines.forEach((ln, k) => {
    const old = LINE_CHARS_OLD[k];
    const estStart = old[0];
    const back = estStart >= 50; // 后半段为推演区，放宽
    const pinOf = new Map(); // charIdx -> SHOTS 秒
    for (const sp of ln.shotSpans) {
        const sec = SHOTS[shotCursor++].sec;
        for (let d = 0; d < sp.len; d++) pinOf.set(sp.start + d, sec);
    }
    ln.chars.forEach((ch, idx) => {
        const isSpace = /\s/.test(ch) || ch === "'";
        const isLineStart = idx === 0 || (items.length > 0 && items[items.length - 1].line !== k);
        const isLineEnd = idx === ln.chars.length - 1;
        let anchor = 6, win = 0.35; // anchor = Δ² 的二次权重
        // 前半段行首/行尾有 Whisper 锚点（v7 可信），只允许微调；后半段（推演区）放宽，让起音+人声证据决定
        if (isLineStart) { anchor = back ? 12 : 120; win = back ? 0.4 : 0.12; }
        else if (isLineEnd) { anchor = back ? 8 : 60; win = back ? 0.4 : 0.15; }
        else if (!back) { win = 0.3; }
        items.push({ line: k, idx, est: old[idx], isSpace, anchor, win, pin: pinOf.get(idx) });
    });
});

const sungItems = items.filter((it) => !it.isSpace);
const N = sungItems.length;
// DP：shot 字候选只剩 pin 那一个时间（硬约束）；同一 shot span 内相邻 pin 字之间免折叠惩罚
const cand = sungItems.map((it) => {
    if (it.pin !== undefined) return [it.pin];
    const out = [];
    for (let f = Math.max(0, Math.round((it.est - it.win) * ENV_FPS)); f <= Math.min(framesN - 1, Math.round((it.est + it.win) * ENV_FPS)); f++) out.push(f / ENV_FPS);
    return out;
});
const emit2 = [];
for (let n = 0; n < N; n++) {
    const it = sungItems[n];
    if (it.pin !== undefined) { emit2.push([0]); continue; }
    // 发射代价 = -3×起音分 + 2.5×(1-人声活跃度) + anchor×Δ²（行首/行尾锚定，二次型防拖拽）
    emit2.push(cand[n].map((t) => {
        const d = t - it.est;
        return -3 * scoreAt(t) + 2.5 * (1 - vocAt(t)) + it.anchor * Math.min(d * d, 0.49);
    }));
}
const dp = [];
const bk = [];
dp.push(emit2[0].slice());
bk.push(new Array(cand[0].length).fill(-1));
for (let n = 1; n < N; n++) {
    const cur = new Array(cand[n].length).fill(Infinity);
    const b = new Array(cand[n].length).fill(-1);
    const prev = dp[n - 1];
    const sameLine = sungItems[n].line === sungItems[n - 1].line;
    const bothPinnedSame = sungItems[n].pin !== undefined && sungItems[n].pin === sungItems[n - 1].pin;
    for (let j = 0; j < cand[n].length; j++) {
        const tj = cand[n][j];
        let best = Infinity, bi = -1;
        for (let p = 0; p < cand[n - 1].length; p++) {
            const dt = tj - cand[n - 1][p];
            if (dt < 0 && !bothPinnedSame) continue; // 不允许倒序；dt=0（同秒挤住）重罚但仍可达
            let c = prev[p];
            if (!bothPinnedSame) c += dt === 0 ? 12 : sameLine ? transInLine(dt) : transAcrossLine(dt);
            if (c < best) { best = c; bi = p; }
        }
        cur[j] = best + emit2[n][j];
        b[j] = bi;
    }
    dp.push(cur);
    bk.push(b);
}
// 回溯
let bestEnd = 0;
for (let j = 1; j < cand[N - 1].length; j++) if (dp[N - 1][j] < dp[N - 1][bestEnd]) bestEnd = j;
const path = new Array(N);
{
    let j = bestEnd;
    for (let n = N - 1; n >= 0; n--) { path[n] = cand[n][j]; j = bk[n][j]; if (j < 0 && n > 0) { console.error("回溯断裂", n); break; } }
}
// shot span 内多字取同一秒后，保行内单调（安全网）
for (let n = 1; n < N; n++) {
    if (sungItems[n].line === sungItems[n - 1].line && path[n] < path[n - 1] + 0.004 && sungItems[n].pin === undefined) {
        path[n] = path[n - 1] + 0.004;
    }
}

if (process.env.DBG) {
    for (let k = 9; k <= 13; k++) {
        const row = sungItems.map((it, n) => ({ it, n })).filter(({ it }) => it.line === k).map(({ it, n }) => `${it.idx}:${path[n].toFixed(2)}`).join(" ");
        console.log(`L${k + 1} post-snap:`, row);
    }
}
const sungTimes = path.slice();

// 组装 LINE_CHARS：空格 = 前一字符时间
const newChars = lines.map(() => []);
{
    let n = 0;
    let last = 0;
    items.forEach((it, idx) => {
        if (!it.isSpace) { last = sungTimes[n++]; }
        (newChars[it.line] ||= [])[it.idx] = it.isSpace ? last : last;
    });
}

// ---------- ⑤ 对比 + 写回 ----------
if (process.env.DUMP) writeFileSync(join(ROOT, ".trae/tmp/new-chars.json"), JSON.stringify(newChars));
console.log("\n=== v7 → v8 每行起点位移 ===");
let sumAbs = 0, sumHits = 0, sumChars = 0, maxShift = 0;
lines.forEach((ln, k) => {
    const oldS = LINE_CHARS_OLD[k][0], newS = newChars[k][0];
    const d = newS - oldS;
    sumAbs += Math.abs(d);
    if (Math.abs(d) > Math.abs(maxShift)) maxShift = d;
    let hits = 0, tot = 0;
    newChars[k].forEach((t, idx) => {
        if (/\s/.test(ln.chars[idx])) return;
        tot++;
        if (scoreAt(t) > 0.35) hits++;
    });
    sumHits += hits; sumChars += tot;
    console.log(`L${String(ln.i).padStart(2)} ${oldS.toFixed(2)}→${newS.toFixed(2)}  Δ${(d >= 0 ? "+" : "") + d.toFixed(2)}s  起音命中 ${hits}/${tot}`);
});
console.log(`\n平均行首位移 ${((sumAbs / lines.length) * 1000).toFixed(0)}ms，最大 ${maxShift.toFixed(2)}s`);
console.log(`逐字起音命中率(±60ms>0.35)：${((sumHits / sumChars) * 100).toFixed(1)}%`);

if (!DRY) {
    const arrText = newChars.map((row) => "    [" + row.map((t) => t.toFixed(3)).join(", ") + "],").join("\n");
    const header = `// 逐字实测时间表（离线强制对齐 v8）：
// 谱通量起音检测（300–2800Hz 人声带，STFT 1024/128）+ 动态规划逐字吸附到最强起音；
// 行首/行尾锚定先验（前半段 Whisper 锚点强锚、后半段放宽），12 个枪/炮卡点字硬钉 SHOTS 秒数；
// 空格取前一字符时间。LINE_CHARS[k] = LYRICS[k] 按 row/span 顺序拼接后的逐字符绝对秒（帧 = 秒 × 30）。
// 重跑：node scripts/align-pow.mjs（--dry 只看对比）
export const LINE_CHARS: number[][] = [
`;
    writeFileSync(join(ROOT, "src/videos/pow/kit/times.ts"), header + arrText + "\n];\n");
    console.log("\n已写回 src/videos/pow/kit/times.ts");
}
rmSync(workDir, { recursive: true, force: true });
