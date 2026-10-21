// ASCII 能量图：对指定行，画 [est-0.6, est+1.4] 的带内能量 + v7/v8 字位
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const SAMPLE_RATE = 22050, HOP = 128, NFFT = 1024, ENV_FPS = SAMPLE_RATE / HOP;
// decode
const FF = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const dir = mkdtempSync(join(tmpdir(), "powv-"));
const wav = join(dir, "a.wav");
execFileSync(FF, ["-hide_banner","-loglevel","error","-y","-i","public/pow/bgm.mp3","-ac","1","-ar",String(SAMPLE_RATE),"-c:a","pcm_s16le",wav]);
const buf = readFileSync(wav); const ds = buf.indexOf("data") + 8;
const n = (buf.length - ds) >> 1;
const pcm = new Float32Array(n);
for (let i = 0; i < n; i++) pcm[i] = buf.readInt16LE(ds + i*2) / 32768;
// fft
const fft = (re, im) => {
    const nn = re.length;
    for (let i = 1, j = 0; i < nn; i++) { let bit = nn >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit;
        if (i < j) { [re[i],re[j]]=[re[j],re[i]]; [im[i],im[j]]=[im[j],im[i]]; } }
    for (let len = 2; len <= nn; len <<= 1) {
        const ang = (-2*Math.PI)/len, wr = Math.cos(ang), wi = Math.sin(ang);
        for (let i = 0; i < nn; i += len) { let cr = 1, ci = 0;
            for (let k = 0; k < len/2; k++) {
                const ur = re[i+k], ui = im[i+k];
                const vr = re[i+k+len/2]*cr - im[i+k+len/2]*ci;
                const vi = re[i+k+len/2]*ci + im[i+k+len/2]*cr;
                re[i+k]=ur+vr; im[i+k]=ui+vi; re[i+k+len/2]=ur-vr; im[i+k+len/2]=ui-vi;
                const nr = cr*wr - ci*wi; ci = cr*wi + ci*wr; cr = nr; } } }
};
const win = new Float32Array(NFFT);
for (let i = 0; i < NFFT; i++) win[i] = 0.5 - 0.5*Math.cos(2*Math.PI*i/(NFFT-1));
const bins = NFFT/2, binHz = SAMPLE_RATE/NFFT;
const loBin = Math.max(1, Math.round(300/binHz)), hiBin = Math.min(bins-1, Math.round(2800/binHz));
const framesN = Math.floor((n - NFFT)/HOP);
const bandE = new Float32Array(framesN);
const re = new Float32Array(NFFT), im = new Float32Array(NFFT);
for (let f = 0; f < framesN; f++) {
    const off = f*HOP;
    for (let i = 0; i < NFFT; i++) { re[i] = pcm[off+i]*win[i]; im[i] = 0; }
    fft(re, im);
    let e = 0;
    for (let b = loBin; b <= hiBin; b++) { const m = Math.hypot(re[b], im[b]); e += m*m; }
    bandE[f] = Math.log10(1e-9 + e);
}
// build data
const bd = mkdtempSync(join(tmpdir(), "powb-"));
mkdirSync(join(bd, "kit"), { recursive: true });
for (const [f, o] of [["times.ts","times.js"],["lyrics.ts","lyrics.js"]]) {
    const src = readFileSync(join(ROOT, "src/videos/pow/kit", f), "utf8");
    writeFileSync(join(bd, "kit", o), ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
}
const { LYRICS } = require(join(bd, "kit", "lyrics.js"));
const OLD = require(join(bd, "kit", "times.js")).LINE_CHARS;
const NEW = JSON.parse(readFileSync(".trae/tmp/new-chars.json", "utf8"));
const targets = [5, 17, 19, 35].map(i => i - 1);
const chars = " .:-=+*#%@";
for (const k of targets) {
    const l = LYRICS[k];
    const text = l.rows.map(r => r.spans.map(s => s.t).join("")).join(" / ");
    const t0 = OLD[k][0] - 0.6, t1 = t0 + 2.2;
    console.log(`\n=== L${l.i} ${text}`);
    for (let row = 0; row < 3; row++) {
        // 3 rows: each 2.2s wide, 110 cols; split band by percentile rows? 简化：单行能量 + 标记
    }
    const cols = 110;
    let bar = "", m7 = "", m8 = "";
    // 能量归一：用全曲 35%~95% 分位映射到字符
    const srt = Array.from(bandE).sort((a,b)=>a-b);
    const lo = srt[Math.floor(framesN*0.35)], hi = srt[Math.floor(framesN*0.95)];
    const oldSet = OLD[k], newSet = NEW[k];
    for (let c = 0; c < cols; c++) {
        const ta = t0 + (c/cols)*(t1-t0), tb = t0 + ((c+1)/cols)*(t1-t0);
        let m = -99;
        for (let f = Math.round(ta*ENV_FPS); f < Math.round(tb*ENV_FPS); f++) if (bandE[f] > m) m = bandE[f];
        const v = Math.max(0, Math.min(1, (m - lo) / (hi - lo)));
        bar += chars[Math.round(v * (chars.length - 1))];
    }
    const mark = (set, ch) => {
        let s = " ".repeat(cols);
        set.forEach((t, idx) => {
            if (/\s/.test(l.rows.flatMap(r=>r.spans).map(s=>s.t).join("")[idx])) return;
            const c = Math.round(((t - t0) / (t1 - t0)) * cols);
            if (c >= 0 && c < cols) s = s.slice(0, c) + ch + s.slice(c + 1);
        });
        return s;
    };
    console.log("v8 " + mark(newSet, "*"));
    console.log("   " + bar);
    console.log("v7 " + mark(oldSet, "."));
    console.log("   " + Array.from({length: cols}, (_, c) => {
        const t = t0 + (c/cols)*(t1-t0);
        return (Math.round(t*10) % 10 === 0 && Math.round(t*10) % 5 === 0) ? "|" : (Math.round(t*10)%5===0 ? "+" : " ");
    }).join(""));
}
rmSync(dir, { recursive: true, force: true });
