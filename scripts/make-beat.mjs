// 纯代码合成「暗黑电子 trap」：808 / 鼓组 / FM 拨弦旋律 / 低通 pad
// 用法：npm run make-beat
// 输出：public/trap-beat/bgm.mp3
//
// 这一版不再模仿真实乐器（弦乐 / 小号 / 管钟），全部使用电子音色，
// 让合成器本身成为风格的一部分：150 BPM / F minor / 64 小节。
// 结构：intro 8 → build 8 → verse1 16 → hook 8 → verse2 16 → outro 8
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "trap-beat");

const SR = 44100;
const BPM = 90;
const BEAT = 60 / BPM;
const STEP = BEAT / 4;
const BAR = BEAT * 4;
const BARS = 64;
const TAIL = 1.5;
const DUR = BARS * BAR + TAIL;
const N = Math.ceil(DUR * SR);
const TAU = Math.PI * 2;

const midiHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

let rng = 20261101;
const rnd = () => {
  rng = (rng * 1664525 + 1013904223) >>> 0;
  return rng / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const saw = (x) => 2 * ((x / TAU) % 1) - 1;

const addTone = (buf, t, len, gen, gain = 1) => {
  const i0 = Math.max(0, Math.round(t * SR));
  const n = Math.min(buf.length - i0, Math.round(len * SR));
  for (let i = 0; i < n; i++) buf[i0 + i] += gen(i / SR) * gain;
};

// ---------------- 分轨 ----------------
const makeBus = () => new Float32Array(N);
const kickBus = makeBus();
const snareBus = makeBus();
const hatBus = makeBus();
const rimBus = makeBus();
const bassBus = makeBus();
const pluckBus = makeBus();
const padBus = makeBus();
const stabBus = makeBus();
const fxBus = makeBus();
const vinylBus = makeBus();

// ---------------- 音色 ----------------
// 底鼓：150→48Hz，短促、留出 808 的低频
const kickHit = (t, vel = 1) => {
  addTone(kickBus, t, 0.45, (tt) => {
    const ph = TAU * (48 * tt + 170 * 0.028 * (1 - Math.exp(-tt / 0.028)));
    const env = Math.min(1, tt / 0.0015) * Math.exp(-tt / 0.22);
    const click = tt < 0.004 ? noise() * 0.5 * (1 - tt / 0.004) : 0;
    return Math.tanh(1.7 * (Math.sin(ph) * env + click)) * 0.95 * vel;
  });
};

// 808：正弦 + 二/三次谐波，支持音高滑行（trap 的 808 slide）
const bassHit = (t, midi, dur, vel = 1, glideTo = null) => {
  const f0 = midiHz(midi);
  const f1 = glideTo === null ? f0 : midiHz(glideTo);
  let phase = 0;
  const dt = 1 / SR;
  addTone(bassBus, t, dur + 0.06, (tt) => {
    const gp = glideTo === null ? 0 : Math.min(1, Math.max(0, (tt - dur * 0.45) / (dur * 0.55)));
    const f = f0 * Math.pow(f1 / f0, gp) * (1 + 0.55 * Math.exp(-tt / 0.05));
    phase += TAU * f * dt;
    const attack = Math.min(1, tt / 0.004);
    const rel = dur - tt;
    const env = attack * (rel < 0.06 ? Math.max(0, rel / 0.06) : 1) * Math.exp(-tt / 2.6);
    const x = Math.sin(phase) + 0.28 * Math.sin(2 * phase) + 0.09 * Math.sin(3 * phase);
    const click = tt < 0.005 ? noise() * 0.3 * (1 - tt / 0.005) : 0;
    return Math.tanh(3.2 * (x * env + click)) * 0.95 * vel;
  });
};

// FM 拨弦：暗黑 trap 的主旋律音色，无颤音、自带电子质感
const pluckHit = (t, midi, vel = 1, oct = 0) => {
  const f = midiHz(midi + oct);
  addTone(pluckBus, t, 1.2, (tt) => {
    const modEnv = Math.exp(-tt / 0.1);
    const mod = Math.sin(TAU * f * 2 * tt + 0.6) * 2.4 * modEnv;
    const car = Math.sin(TAU * f * tt + mod);
    const sub = Math.sin(TAU * (f / 2) * tt) * 0.16;
    const env = Math.min(1, tt / 0.002) * Math.exp(-tt / 0.42);
    return (car + sub) * env * 0.5 * vel;
  });
};

// 失真铜管式合成 stab：给暗黑氛围加攻击性（电子音色，不模仿真实铜管）
const stabHit = (t, midis, dur = 0.24, vel = 1) => {
  for (const m of midis) {
    const f = midiHz(m);
    let lp = 0;
    addTone(stabBus, t, dur, (tt) => {
      let s = 0;
      for (const d of [0.996, 1, 1.004]) s += saw(TAU * f * d * tt);
      s /= 3;
      lp += 0.12 * (s - lp);
      const env = Math.min(1, tt / 0.008) * Math.exp(-tt / 0.18);
      return Math.tanh(2.8 * lp * env) * 0.32 * vel;
    });
  }
};

// pad：失谐锯齿 + 两级低通，慢起慢收；混音时做 sidechain 让位给 808
const padHit = (t, midis, dur) => {
  for (const m of midis) {
    const f = midiHz(m);
    let l1 = 0;
    let l2 = 0;
    addTone(padBus, t, dur + 0.3, (tt) => {
      let s = 0;
      for (const d of [0.997, 1, 1.003]) s += saw(TAU * f * d * tt);
      s /= 3;
      l1 += 0.07 * (s - l1);
      l2 += 0.07 * (l1 - l2);
      const env = Math.min(1, tt / 0.7) * Math.min(1, Math.max(0, (dur + 0.3 - tt) / 0.6));
      return l2 * env * 0.12;
    });
  }
};

const snareHit = (t, vel = 1) => {
  let lp = 0;
  addTone(snareBus, t, 0.28, (tt) => {
    const n = noise();
    lp += 0.28 * (n - lp);
    const hp = n - lp;
    const body = Math.sin(TAU * 230 * tt) * Math.exp(-tt / 0.05);
    return (hp * Math.exp(-tt / 0.085) * 0.9 + hp * Math.exp(-tt / 0.22) * 0.18 + body * 0.45) * vel;
  });
};

const clapHit = (t, vel = 1) => {
  let lp = 0;
  addTone(snareBus, t, 0.3, (tt) => {
    const n = noise();
    lp += 0.2 * (n - lp);
    const hp = n - lp;
    let burst = 0;
    for (const d of [0, 0.011, 0.022]) if (tt >= d) burst += Math.exp(-(tt - d) / 0.011);
    return hp * (burst * 0.85 + Math.exp(-tt / 0.15) * 0.3) * 0.52 * vel;
  });
};

const hatHit = (t, open = false, vel = 1) => {
  let lp = 0;
  const len = open ? 0.45 : 0.07;
  addTone(hatBus, t, len, (tt) => {
    const n = noise();
    lp += 0.3 * (n - lp);
    const hp = n - lp;
    const metal = Math.sin(TAU * 7350 * tt + 1.3) + 0.6 * Math.sin(TAU * 5210 * tt);
    const env = Math.min(1, tt / 0.001) * Math.exp(-tt / (open ? 0.18 : 0.028));
    return (hp * 0.85 + metal * 0.2) * env * 0.8 * vel;
  });
};

// 短促的 rim / perc，用来补 groove
const rimHit = (t, vel = 1) => {
  addTone(rimBus, t, 0.09, (tt) => {
    const env = Math.min(1, tt / 0.001) * Math.exp(-tt / 0.018);
    return (Math.sin(TAU * 1850 * tt) * 0.5 + noise() * 0.5) * env * 0.35 * vel;
  });
};

const riser = (t, dur = BAR) => {
  addTone(fxBus, t, dur, (tt) => {
    const p = Math.min(1, tt / dur);
    return noise() * 0.28 * Math.pow(p, 2.6) + Math.sin(TAU * (180 + 1200 * p) * tt) * 0.1 * p;
  });
};

const impact = (t) => {
  addTone(fxBus, t, 2.2, (tt) => {
    const ph = TAU * (36 * tt + 70 * 0.15 * (1 - Math.exp(-tt / 0.15)));
    return Math.tanh(1.3 * (Math.sin(ph) * Math.exp(-tt / 0.8) * 0.75 + noise() * Math.exp(-tt / 0.2) * 0.25));
  });
};

const crash = (t) => {
  let lp = 0;
  addTone(fxBus, t, 2, (tt) => {
    const n = noise();
    lp += 0.12 * (n - lp);
    return (n - lp) * Math.exp(-tt / 0.6) * 0.28;
  });
};

for (let i = 0; i < N; i++) vinylBus[i] = (rnd() * 2 - 1) * 0.5;
for (let i = 0; i < N; i += 1) {
  if (rnd() < 0.0003) vinylBus[i] += (rnd() * 2 - 1) * 3;
}

// ---------------- 和声与旋律 ----------------
const PROG = [
  { root: 29, tones: [53, 56, 60, 63] }, // Fm
  { root: 37, tones: [49, 53, 56, 60] }, // D♭
  { root: 32, tones: [56, 60, 63, 67] }, // A♭
  { root: 39, tones: [51, 55, 58, 62] }, // E♭
];

const sectionOf = (bar) => {
  if (bar < 8) return "intro";
  if (bar < 16) return "build";
  if (bar < 32) return "verse1";
  if (bar < 40) return "hook";
  if (bar < 56) return "verse2";
  return "outro";
};

// 拨弦动机：[16 分步, 和弦音索引, 八度, 时值(16 分)]
const PLUCK = [
  [0, 0, 0, 2],
  [3, 2, 0, 2],
  [6, 1, 0, 2],
  [10, 3, 1, 3],
  [14, 2, 0, 1],
];

// 暗黑 Riff：固定节奏骨架，音高跟随当前和弦（不和声冲突）
const RIFF_STEPS = [0, 2, 3, 4, 8, 10, 12];
const RIFF_DEG = [0, 0, 2, 3, 1, 3, 2];
const RIFF_LOW = [0, 4, 8, 12, 14]; // 低音 ped 点

// ---------------- 编曲 ----------------
const kicks = [];
for (let bar = 0; bar < BARS; bar++) {
  const t0 = bar * BAR;
  const sec = sectionOf(bar);
  const chord = PROG[bar % 4];

  // pad：全曲铺底（intro 也靠它撑住）
  padHit(t0, [chord.root + 12, chord.tones[1], chord.tones[2]], BAR * 1.05);

  // 暗黑 Riff：hook 段铺满，build / verse 只露半句
  if (sec === "hook") {
    RIFF_STEPS.forEach((step, i) => {
      const midi = chord.tones[RIFF_DEG[i]] + 12;
      stabHit(t0 + step * STEP, [midi, midi + 12], 0.2, 0.85);
    });
    for (const step of RIFF_LOW) stabHit(t0 + step * STEP, [chord.root + 12], 0.14, 0.45);
  } else if ((sec === "build" && bar % 4 === 2) || (sec === "verse1" && bar % 8 === 4)) {
    RIFF_STEPS.slice(0, 4).forEach((step, i) => {
      const midi = chord.tones[RIFF_DEG[i]] + 12;
      stabHit(t0 + step * STEP, [midi], 0.16, 0.5);
    });
  }

  // 808
  if (sec === "intro") {
    if (bar % 2 === 0) {
      bassHit(t0, chord.root, BAR * 1.6, 0.95);
      kicks.push(t0);
    }
  } else if (sec === "outro") {
    if (bar <= 60 && bar % 2 === 0) bassHit(t0, chord.root, BAR * 0.9, 0.9);
  } else if (sec === "hook") {
    bassHit(t0, chord.root, BAR * 0.5, 1, chord.root + 7);
    bassHit(t0 + 6 * STEP, chord.root, BAR * 0.22, 0.85);
    bassHit(t0 + 10 * STEP, chord.root, BAR * 0.34, 1, bar % 8 === 7 ? chord.root - 5 : null);
  } else if (sec === "verse1" || sec === "build") {
    bassHit(t0, chord.root, BAR * 0.46, 1);
    bassHit(t0 + 6 * STEP, chord.root, BAR * 0.2, 0.85);
    bassHit(t0 + 10 * STEP, chord.root, BAR * 0.34, 0.95);
  } else {
    // verse2：更松，留空间
    bassHit(t0, chord.root, BAR * 0.5, 1);
    bassHit(t0 + 10 * STEP, chord.root, BAR * 0.36, 0.95);
  }

  // 鼓组
  if (sec !== "intro") {
    if (sec === "outro") {
      if (bar < 60) {
        for (const s of [0, 10]) {
          kickHit(t0 + s * STEP, 0.75);
          kicks.push(t0 + s * STEP);
        }
        snareHit(t0 + 12 * STEP, 0.5);
        clapHit(t0 + 12 * STEP, 0.4);
        for (const s of [0, 4, 8, 12]) hatHit(t0 + s * STEP, false, 0.26);
      }
    } else if (sec === "verse1" || sec === "verse2") {
      for (const s of [0, 6, 10]) {
        kickHit(t0 + s * STEP, s === 0 ? 0.9 : 0.8);
        kicks.push(t0 + s * STEP);
      }
      snareHit(t0 + 4 * STEP, 0.9);
      clapHit(t0 + 4 * STEP, 0.95);
      snareHit(t0 + 12 * STEP, 0.85);
      clapHit(t0 + 12 * STEP, 0.9);
      for (const s of [0, 2, 4, 6, 8, 10, 12, 14]) hatHit(t0 + s * STEP, false, 0.36);
      for (const s of [3, 7, 11, 15]) hatHit(t0 + s * STEP, false, 0.15);
      if (bar % 4 === 3) rimHit(t0 + 15 * STEP, 0.8);
    } else if (sec === "hook") {
      for (const s of [0, 6, 10, 14]) {
        kickHit(t0 + s * STEP, s === 14 ? 0.7 : 1);
        kicks.push(t0 + s * STEP);
      }
      snareHit(t0 + 4 * STEP, 0.95);
      clapHit(t0 + 4 * STEP, 1);
      snareHit(t0 + 12 * STEP, 0.9);
      clapHit(t0 + 12 * STEP, 0.95);
      for (let s = 0; s < 16; s++) hatHit(t0 + s * STEP, false, s % 2 === 0 ? 0.46 : 0.28);
      if (bar % 2 === 0) hatHit(t0 + 14 * STEP, true, 0.45);
      if (bar % 4 === 3) for (let k = 0; k < 6; k++) hatHit(t0 + 3 * BEAT + (k * BEAT) / 6, false, 0.28 + k * 0.03);
    } else {
      // build
      for (const s of [0, 6, 10]) {
        kickHit(t0 + s * STEP, 0.95);
        kicks.push(t0 + s * STEP);
      }
      snareHit(t0 + 4 * STEP, 0.9);
      clapHit(t0 + 4 * STEP, 0.95);
      snareHit(t0 + 12 * STEP, 0.85);
      clapHit(t0 + 12 * STEP, 0.9);
      for (const s of [0, 2, 4, 6, 8, 10, 12, 14]) hatHit(t0 + s * STEP, false, 0.4);
      for (const s of [5, 11]) hatHit(t0 + s * STEP, false, 0.18);
    }
  }

  // 拨弦旋律：intro 后半进入；verse 只在前半出现，后半留给人声
  const pluckOn =
    (sec === "intro" && bar >= 2) ||
    sec === "build" ||
    (sec === "verse1" && bar < 24) ||
    sec === "hook" ||
    (sec === "verse2" && bar < 48) ||
    (sec === "outro" && bar <= 58);
  if (pluckOn) {
    for (const [step, idx, oct, len] of PLUCK) {
      const midi = chord.tones[idx % chord.tones.length] + 12 + oct * 12;
      pluckHit(t0 + step * STEP, midi, sec === "hook" ? 0.85 : 0.8, 0);
      if (len <= 0) continue;
    }
  }
}

// 段首冲击 / 过渡
for (const bar of [8, 32, 40]) impact(bar * BAR);
crash(8 * BAR);
crash(32 * BAR);
riser(7 * BAR, BAR);
riser(31 * BAR, BAR);

// ---------------- sidechain：pad / pluck 给 808 让位 ----------------
const duck = new Float32Array(N).fill(1);
for (const t of kicks) {
  const i0 = Math.round(t * SR);
  const n = Math.round(0.26 * SR);
  for (let i = 0; i < n && i0 + i < N; i++) {
    const v = 1 - 0.5 * Math.exp(-(i / SR) / 0.06);
    if (v < duck[i0 + i]) duck[i0 + i] = v;
  }
}

// ---------------- 拨弦延迟（1/8 拍 ping-pong） ----------------
const echo = new Float32Array(N);
const ECHO = Math.round((BEAT / 2) * SR);
for (let i = ECHO; i < N; i++) echo[i] = pluckBus[i - ECHO] * 0.32 + echo[i - ECHO] * 0.22;

// ---------------- 混音 ----------------
const left = new Float32Array(N);
const right = new Float32Array(N);
const HAAS = Math.round(0.009 * SR);

for (let i = 0; i < N; i++) {
  const b = bassBus[i] * 0.44;
  const k = kickBus[i] * 0.52;
  const s = snareBus[i] * 0.7;
  const h = hatBus[i] * 0.4;
  const r = rimBus[i] * 0.28;
  const dg = duck[i];
  const p = pluckBus[i] * 0.68 * (0.82 + 0.18 * dg);
  const pDelay = i >= HAAS ? pluckBus[i - HAAS] * 0.42 : 0;
  const pad = padBus[i] * 0.44 * dg;
  const sb = stabBus[i] * 0.5;
  const e = echo[i] * 0.38;
  const fx = fxBus[i] * 0.4;
  const v = vinylBus[i] * 0.03;

  left[i] = b + k + s + h * 0.9 + r * 0.8 + p * 0.95 + pDelay + pad + sb * 0.9 + e * 0.7 + fx + v;
  right[i] = b + k + s + h * 1.05 + r + p + pDelay * 0.7 + pad + sb + e + fx + v;
}

// 母带
let peak = 0;
for (let i = 0; i < N; i++) {
  left[i] = Math.tanh(left[i] * 1.05);
  right[i] = Math.tanh(right[i] * 1.05);
  const a = Math.max(Math.abs(left[i]), Math.abs(right[i]));
  if (a > peak) peak = a;
}
const gain = 0.9 / (peak || 1);
const fadeIn = Math.round(0.03 * SR);
const fadeOut = Math.round(1.2 * SR);
for (let i = 0; i < N; i++) {
  let g = gain;
  if (i < fadeIn) g *= i / fadeIn;
  if (i > N - fadeOut) g *= (N - i) / fadeOut;
  left[i] *= g;
  right[i] *= g;
}

// ---------------- 写 WAV / MP3 ----------------
const writeWav = (path) => {
  const bytes = 44 + N * 4;
  const buf = Buffer.alloc(bytes);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(bytes - 8, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(left[i] * 32767))), 44 + i * 4);
    buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(right[i] * 32767))), 46 + i * 4);
  }
  writeFileSync(path, buf);
};

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

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
const wavPath = join(OUT_DIR, "bgm.wav");
const mp3Path = join(OUT_DIR, "bgm.mp3");
writeWav(wavPath);
execFileSync(findFfmpeg(), ["-hide_banner", "-loglevel", "error", "-y", "-i", wavPath, "-codec:a", "libmp3lame", "-b:a", "192k", mp3Path], {
  stdio: ["ignore", "ignore", "inherit"],
});
rmSync(wavPath, { force: true });

console.log("\n=== 暗黑电子 trap 完成 ===");
console.log(`  BPM          ${BPM}`);
console.log(`  调性         F minor · Fm–D♭–A♭–E♭`);
console.log(`  时长         ${DUR.toFixed(2)}s（${BARS} 小节）`);
console.log("  编制         808 / 鼓组 / FM 拨弦 / 低通 pad / 1-8 拍延迟");
console.log("  结构         intro 8 → build 8 → verse1 16 → hook 8 → verse2 16 → outro 8");
console.log(`  输出         ${mp3Path}\n`);
