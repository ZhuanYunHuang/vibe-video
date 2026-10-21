// 2-8kHz 谱通量瞬态检测（与原 SHOTS 方法一致），列出指定窗口内的峰
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const SR = 22050, HOP = 128, NFFT = 1024;
const FF = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const dir = mkdtempSync(join(tmpdir(), "powd-"));
const wav = join(dir, "a.wav");
execFileSync(FF, ["-hide_banner","-loglevel","error","-y","-i","public/pow/bgm.mp3","-ac","1","-ar",String(SR),"-c:a","pcm_s16le",wav]);
const buf = readFileSync(wav); const ds = buf.indexOf("data") + 8;
const n = (buf.length - ds) >> 1;
const pcm = new Float32Array(n);
for (let i = 0; i < n; i++) pcm[i] = buf.readInt16LE(ds + i*2) / 32768;
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
const binHz = SR/NFFT, lo = Math.round(2000/binHz), hi = Math.min(NFFT/2-1, Math.round(8000/binHz));
const framesN = Math.floor((n - NFFT)/HOP);
const flux = new Float32Array(framesN);
const re = new Float32Array(NFFT), im = new Float32Array(NFFT);
const prev = new Float32Array(hi+1), cur = new Float32Array(hi+1);
for (let f = 0; f < framesN; f++) {
    const off = f*HOP;
    for (let i = 0; i < NFFT; i++) { re[i] = pcm[off+i]*win[i]; im[i] = 0; }
    fft(re, im);
    let s = 0;
    for (let b = lo; b <= hi; b++) { const m = Math.log(1e-6 + Math.hypot(re[b], im[b])); s += Math.max(0, m - prev[b]); cur[b] = m; }
    flux[f] = s;
    for (let b = lo; b <= hi; b++) prev[b] = cur[b];
}
const EF = SR/HOP;
// 去局部均值
const W = Math.round(EF*0.5);
const on = new Float32Array(framesN);
for (let f = 0; f < framesN; f++) {
    let s = 0, c = 0;
    for (let k = Math.max(0,f-W); k < Math.min(framesN,f+W); k++) { s += flux[k]; c++; }
    on[f] = Math.max(0, flux[f] - s/c);
}
const windows = {
    "L06 [8.83,10.00] (mode/就/走)": [8.83, 10.00],
    "L07 [11.14,12.28] (口/油)": [11.14, 12.28],
    "L14 [23.45,25.30] (感/谢)": [23.45, 25.30],
};
for (const [name, [a, b]] of Object.entries(windows)) {
    const peaks = [];
    for (let f = Math.round(a*EF)+2; f < Math.min(framesN-2, Math.round(b*EF)); f++) {
        if (on[f] >= on[f-1] && on[f] >= on[f+1] && on[f] > 0.5) peaks.push({ t: f/EF, v: on[f] });
    }
    peaks.sort((x,y) => y.v - x.v);
    console.log(`\n${name}  峰(按强度排序, 前8):`);
    for (const p of peaks.slice(0, 8)) console.log(`  ${p.t.toFixed(3)}s  强度 ${p.v.toFixed(2)}`);
}
rmSync(dir, { recursive: true, force: true });
