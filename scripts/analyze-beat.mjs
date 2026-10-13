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

// 逐拍重拍强度：低频（底鼓）增量 + 整体起音增量
const lowEnv = new Float32Array(frames);
let lp = 0;
for (let f = 0; f < frames; f++) {
  let s = 0;
  for (let i = 0; i < HOP; i++) {
    const v = buf.readInt16LE(dataStart + (f * HOP + i) * 2) / 32768;
    lp += 0.03 * (v - lp);
    s += lp * lp;
  }
  lowEnv[f] = Math.log(1e-6 + s);
}
const lowOn = new Float32Array(frames);
for (let f = 1; f < frames; f++) lowOn[f] = Math.max(0, lowEnv[f] - lowEnv[f - 1]);
const peakOn = (arr, t) => {
  const f = t * fpsEnv;
  const a = Math.floor(f);
  return Math.max(arr[a] || 0, arr[a + 1] || 0, arr[a - 1] || 0);
};

// 4/4 拍：1 小节 = 4 拍，大卡点单位 = 4 小节 = 16 拍
const BAR = 4;
const UNIT = 16;
const period = 60 / res[0].bpm;
const phase = res[0].ph;

// 逐拍重拍强度 + 重拍结构（period 可传半拍，用于修正半速识别）
const analyzeStructure = (period, phase) => {
  const usableBeats = Math.floor((maxSec - phase) / period);
  const beatStat = [];
  for (let b = 0; b <= usableBeats; b++) {
    const t0 = phase + b * period;
    beatStat.push({ b, t: t0, accent: peakOn(lowOn, t0) + peakOn(onset, t0) });
  }
  // 重拍阈值用 80 分位，避免个别爆点把均值拉飞
  const sorted = beatStat.map((s) => s.accent).sort((a, b) => a - b);
  const q = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
  const strongT = q(0.8);
  const isStrong = (s) => s.accent >= strongT;
  const all = beatStat.reduce((a, s) => a + s.accent, 0) / beatStat.length;

  // 大卡点单位的"抬升"：单位边界拍平均强度 / 全局平均强度（>1 说明确实更重）
  const liftOf = (L) => {
    const bounds = beatStat.filter((s) => s.b % L === 0);
    if (!bounds.length || !all) return 0;
    return bounds.reduce((a, s) => a + s.accent, 0) / bounds.length / all;
  };
  return { beatStat, strongT, isStrong, lift: liftOf(UNIT), meanAccent: all };
};

// 半速误判检测：BPM 识别常见"八度错误"（把 141 听成 70.5）。
// 判据：Top5 候选里若存在约等于 best 两倍的候选、且得分不低（≥85%），则实际拍速取两倍值。
const top5 = res.slice(0, 5);
const dup = top5.find((c) => Math.abs(c.bpm / res[0].bpm - 2) < 0.02 && c.score >= res[0].score * 0.85);
const guessedHalf = !!dup;
const effBpm = guessedHalf ? dup.bpm : res[0].bpm;
const beatSec = 60 / effBpm;

// 按实际拍速重新数拍（相位不变：首个重拍仍在拍 0）
const slow = analyzeStructure(period, phase);
const chosen = guessedHalf ? analyzeStructure(period / 2, phase) : slow;

console.log("\n=== 重拍结构（4/4 拍，大卡点单位 = 4 小节 = 16 拍）===");
console.log(`  重拍判定阈值  ${chosen.strongT.toFixed(3)}（逐拍重拍强度的 80 分位）`);
console.log(`  16 拍边界的抬升  ${chosen.lift.toFixed(2)}（边界拍平均强度 / 全局平均强度，>1 即更重）`);

if (guessedHalf) {
  console.log(`\n  ⚠ 检测到半速误判：Top5 里 ${dup.bpm} BPM 约等于 ${res[0].bpm} × 2（得分 ${dup.score.toFixed(3)}）。`);
  console.log(`     已按实际 BPM ${effBpm.toFixed(1)} 计算（每拍 ${beatSec.toFixed(3)}s）。`);
  console.log(`     写 spec 时请把 bpm 填 ${effBpm.toFixed(1)}、offset 用上面"推荐值"里的帧数。`);
} else {
  console.log(`  检测 BPM ${effBpm.toFixed(1)} 可信（Top5 中无 2 倍关系的候选）。`);
}

const unitSec = UNIT * beatSec;
console.log(`\n=== 大卡点落点：每 ${UNIT} 拍 = 4 小节 ≈ ${unitSec.toFixed(2)}s 一个 ===`);
console.log("  ★ = 该拍确实偏重（可直接切场）；△ = 该拍偏弱（只做内容跳变，别硬切）");
const unitLines = [];
for (const s of chosen.beatStat) {
  if (s.b % UNIT !== 0) continue;
  if (s.t > maxSec - beatSec) break;
  unitLines.push(`  ${String(s.b).padStart(3)} 拍  ${s.t.toFixed(2).padStart(6)}s  ${chosen.isStrong(s) ? "★" : "△"}  强度 ${s.accent.toFixed(2)}`);
}
console.log(unitLines.join("\n"));
console.log(`  共 ${unitLines.length} 个大卡点，覆盖到片尾`);

// 强拍总表：所有达到阈值的拍（标注是否为 4 小节边界），供手工微调
const strongBeats = chosen.beatStat.filter(chosen.isStrong);
console.log(`\n=== 强拍总表（共 ${strongBeats.length} 个；◆ = 同时是 4 小节边界）===`);
const chunks = [];
for (let i = 0; i < strongBeats.length; i += 8) {
  chunks.push(
    "  " + strongBeats.slice(i, i + 8).map((s) => `${s.b % UNIT === 0 ? "◆" : " "}${s.b}@${s.t.toFixed(1)}s`).join("  "),
  );
}
console.log(chunks.join("\n"));

console.log("\n=== 卡点排布建议 ===");
console.log(`  1. 大卡点（每 4 小节 = ${UNIT} 拍）：落在上面每个 ★ —— 要么切场转场，要么做一次强烈的内容跳变；`);
console.log(`     标 △ 的边界偏弱，别在那里硬切场，用内容跳变（数字跳变 / 元素砸入）顶住即可；`);
console.log(`  2. 小卡点：乐句内部按需卡在 4 的倍数拍上（元素出场、数字砸入、逐帧累加），`);
console.log(`     优先选"强拍总表"里的拍；`);
console.log("  3. 两个大卡点之间（约 6.8s）不要出现「画面在干等下一个转场」的空档，用内容跳变填满；");
console.log("  4. 不要给整幅画面加每拍抖动，只让内容元素跟拍（否则观感会晕）。");
console.log("  5. 场景 start/end 都取 16 的倍数拍，就能保证切场天然落在 4 小节边界上。");

rmSync(workDir, { recursive: true, force: true });
console.log("\n完成。\n");
