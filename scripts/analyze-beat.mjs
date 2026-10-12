// BGM 节拍分析：输出 BPM、首拍相位、强起音点，并生成可直接粘贴进 spec.ts 的片段
// 用法：npm run beat -- public/web-request/bgm.mp3
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SAMPLE_RATE = 22050;
const HOP = 128;
const FPS = 30;

const audioPath = process.argv[2];
if (!audioPath) {
  console.error("用法：npm run beat -- <音频路径>");
  console.error("示例：npm run beat -- public/web-request/bgm.mp3");
  process.exit(1);
}
if (!existsSync(audioPath)) {
  console.error(`找不到文件：${resolve(audioPath)}`);
  process.exit(1);
}

// 定位 ffmpeg：优先用 Remotion 自带的解复用器二进制，避免依赖 npx 解析
const findFfmpeg = () => {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..", "node_modules", "@remotion");
  const exeName = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  if (existsSync(root)) {
    for (const dir of readdirSync(root)) {
      if (!dir.startsWith("compositor-")) continue;
      const candidate = join(root, dir, exeName);
      if (existsSync(candidate)) return candidate;
    }
  }
  // 回退到 PATH 上的 ffmpeg
  return "ffmpeg";
};

// 转成单声道 22050Hz WAV 供 Node 读取
const workDir = mkdtempSync(join(tmpdir(), "beat-"));
const wavPath = join(workDir, "audio.wav");
try {
  execFileSync(
    findFfmpeg(),
    ["-hide_banner", "-loglevel", "error", "-y", "-i", audioPath, "-ac", "1", "-ar", String(SAMPLE_RATE), "-c:a", "pcm_s16le", wavPath],
    { stdio: ["ignore", "ignore", "inherit"] },
  );
} catch {
  console.error("音频解码失败，请确认路径可读且为 ffmpeg 支持的格式");
  rmSync(workDir, { recursive: true, force: true });
  process.exit(1);
}

const buf = readFileSync(wavPath);
const dataStart = buf.indexOf("data") + 8;
const sampleCount = (buf.length - dataStart) >> 1;

// 帧能量包络
const fpsEnv = SAMPLE_RATE / HOP;
const frames = Math.floor(sampleCount / HOP);
const env = new Float32Array(frames);
for (let f = 0; f < frames; f++) {
  let s = 0;
  for (let i = 0; i < HOP; i++) {
    const v = buf.readInt16LE(dataStart + (f * HOP + i) * 2) / 32768;
    s += v * v;
  }
  env[f] = Math.log(1e-6 + s);
}

// 起音强度：正向能量差，去掉局部均值
const raw = new Float32Array(frames);
for (let f = 1; f < frames; f++) raw[f] = Math.max(0, env[f] - env[f - 1]);
const onset = new Float32Array(frames);
const W = Math.round(fpsEnv * 0.5);
for (let f = 0; f < frames; f++) {
  let s = 0;
  let c = 0;
  for (let k = Math.max(0, f - W); k < Math.min(frames, f + W); k++) {
    s += raw[k];
    c++;
  }
  onset[f] = Math.max(0, raw[f] - s / c);
}
const val = (t) => {
  const f = t * fpsEnv;
  const a = Math.floor(f);
  return Math.max(onset[a] || 0, onset[a + 1] || 0, onset[a - 1] || 0);
};

// 梳状滤波打分：扫描 BPM 与相位，取平均起音强度最高的组合
const res = [];
for (let bpm = 60; bpm <= 180; bpm += 0.05) {
  const p = 60 / bpm;
  let best = 0;
  let bestPh = 0;
  for (let ph = 0; ph < p; ph += 0.005) {
    let s = 0;
    let c = 0;
    for (let t = ph; t < 160; t += p) {
      s += val(t);
      c++;
    }
    s /= c;
    if (s > best) {
      best = s;
      bestPh = ph;
    }
  }
  res.push({ bpm: +bpm.toFixed(2), score: best, ph: +bestPh.toFixed(3) });
}
res.sort((a, b) => b.score - a.score);

const beatFrames = res[0] ? (60 / res[0].bpm) * FPS : 0;
const offsetFrames = res[0] ? Math.round(res[0].ph * FPS) : 0;

console.log("\n=== BPM 候选（Top 5）===");
for (const r of res.slice(0, 5)) {
  console.log(`  ${String(r.bpm).padStart(7)} BPM   首拍 ${r.ph.toFixed(3)}s   得分 ${r.score.toFixed(3)}`);
}

console.log("\n=== 推荐值 ===");
const maxSec = sampleCount / SAMPLE_RATE;
console.log(`  音频时长      ${maxSec.toFixed(1)}s`);
console.log(`  BPM           ${res[0].bpm}`);
console.log(`  首拍相位      ${res[0].ph.toFixed(3)}s`);
console.log(`  每拍帧数      ${beatFrames.toFixed(2)} 帧 (${FPS}fps)`);
console.log(`  可用拍数      ${Math.floor((maxSec - res[0].ph) / (60 / res[0].bpm))}`);

console.log("\n=== 可直接粘贴进 spec.ts ===");
console.log(`  bpm: ${res[0].bpm},`);
console.log(`  offset: ${offsetFrames}, // 首拍出现在 ${res[0].ph.toFixed(2)}s`);
console.log(`  totalBeats: ${Math.floor((maxSec - res[0].ph) / (60 / res[0].bpm))},`);

// 强起音点：用于核对小节边界（每 4 拍或 8 拍应落在强起音上）
const peaks = [];
for (let f = 2; f < frames - 2; f++) {
  if (onset[f] > 1.2 && onset[f] >= onset[f - 1] && onset[f] >= onset[f + 1]) {
    peaks.push((f / fpsEnv).toFixed(2));
  }
}
console.log(`\n=== 强起音点（前 75s，共 ${peaks.length} 个）===`);
console.log("  " + peaks.filter((t) => +t < 75).join(" "));

rmSync(workDir, { recursive: true, force: true });
console.log("\n完成。\n");
