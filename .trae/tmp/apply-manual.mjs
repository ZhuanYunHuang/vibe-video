// 按用户手动时间表重写 LINE_CHARS
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import ts from "typescript";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const bd = mkdtempSync(join(tmpdir(), "powa-"));
mkdirSync(join(bd, "kit"), { recursive: true });
for (const [f, o] of [["times.ts","times.js"],["lyrics.ts","lyrics.js"]]) {
    const src = readFileSync(join(process.cwd(), "src/videos/pow/kit", f), "utf8");
    writeFileSync(join(bd, "kit", o), ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
}
const { LYRICS } = require(join(bd, "kit", "lyrics.js"));
const CUR = require(join(bd, "kit", "times.js")).LINE_CHARS;

// 每行平铺字符
const flat = LYRICS.map((l) => {
    let s = "";
    for (const row of l.rows) for (const sp of row.spans) s += sp.t;
    return Array.from(s);
});
// 手动表：undefined = 保持现状；数组 = 段落 [起始字idx, 结束字idx, 起秒, 止秒]
// 用户在 L03/L10 的第二段里重复引用了边界字（血/最），归属第二段起点，第一段只取前段文字
const MANUAL = {
    0:  [[0,0,0.14,0.14],[1,7,1.00,2.00]],
    1:  [[0,13,2.01,3.62]],
    2:  [[0,0,3.63,3.63],[1,12,4.01,6.05]],
    5:  [[0,4,8.83,9.50],[5,24,9.51,10.00]],
    9:  [[0,4,15.79,17.00],[5,20,17.01,18.50]],
    10: [[0,9,18.51,19.88]],
    11: [[0,13,19.89,22.34]],
    12: [[0,9,22.35,23.35]],   // 用户写 23.56，与 L14 起点 23.357 重叠 0.2s，同行只能显示一行，压到 23.35
    13: [[0,12,23.357,25.50]],
    14: [[0,11,25.51,26.95]],
    15: [[0,25,26.96,28.20]],
    16: [[0,7,28.21,29.85]],
    17: [[0,12,29.86,31.29]],
    18: [[0,20,31.30,32.23]],
    23: [[0,15,38.13,40.20]],
    24: [[0,11,40.21,41.29]],
    28: [[0,11,46.56,48.28]],
    29: [[0,11,48.29,50.09]],
    30: [[0,15,50.10,51.50]],
    31: [[0,9,51.51,53.35]],
    33: [[0,9,54.58,56.37]],
    34: [[0,12,56.38,58.08]],
    35: [[0,11,58.09,59.30]],
    36: [[0,11,59.31,61.42]],
    37: [[0,6,61.43,63.20]],
    38: [[0,8,63.21,64.30]],
    39: [[0,10,64.31,65.30]],
    40: [[0,8,65.31,67.22]],
    41: [[0,10,67.23,68.44]],
};

const isSkip = (ch) => /\s/.test(ch) || ch === "'";
const spread = (chars, a, b, s, e) => {
    const pos = [];
    for (let i = a; i <= b; i++) if (!isSkip(chars[i])) pos.push(i);
    const out = new Array(chars.length).fill(undefined);
    if (pos.length === 1) { out[pos[0]] = s; }
    else {
        const step = (e - s) / (pos.length - 1);
        pos.forEach((idx, i) => { out[idx] = s + i * step; });
    }
    let last = s;
    for (let i = a; i <= b; i++) {
        if (out[i] === undefined) out[i] = i === a ? s : last;
        else last = out[i];
        if (i > a && out[i] < out[i-1]) out[i] = out[i-1]; // 单调兜底
    }
    return out;
};

const NEW = CUR.map((row, k) => row.slice());
for (const [k, segs] of Object.entries(MANUAL)) {
    const chars = flat[k];
    const out = new Array(chars.length).fill(undefined);
    for (const [a, b, s, e] of segs) {
        const part = spread(chars, a, b, s, e);
        for (let i = a; i <= b; i++) out[i] = part[i];
    }
    NEW[k] = out.map((t) => Math.round(t * 1000) / 1000);
}

// 校验：单调 + 卡点字新时间
let ok = true;
NEW.forEach((row, k) => {
    for (let i = 1; i < row.length; i++) if (row[i] < row[i-1] - 1e-9) { ok = false; console.error(`L${k+1} 非单调 @${i}`); }
});
if (!ok) process.exit(1);
const shotChars = [];
LYRICS.forEach((l, k) => {
    let ci = 0;
    for (const row of l.rows) for (const sp of row.spans) {
        const n = Array.from(sp.t).length;
        if (sp.shot) shotChars.push({ line: k, first: ci, word: sp.t });
        ci += n;
    }
});
console.log("卡点字新时间：");
for (const sc of shotChars) console.log(`  L${sc.line+1} "${sc.word}" → ${NEW[sc.line][sc.first].toFixed(3)}`);

// 写回 times.ts
const arrText = NEW.map((row) => "    [" + row.map((t) => t.toFixed(3)).join(", ") + "],").join("\n");
const header = `// 逐字时间表（v9 = 用户手动校对表，2026-10-20）：
// 行级起止与分段由用户听音给出（L01 雪 / L03 血 / L06 In my / L10 我们全队最 单独铺时），行内均匀铺开；
// 12 个枪/炮卡点字跟随本表（SHOTS 已同步），L14 炮声打碎点 shatterAt/impact = 头 25.50。
// LINE_CHARS[k] = LYRICS[k] 按 row/span 顺序拼接后的逐字符绝对秒（帧 = 秒 × 30）。
// 注意：L13 结尾按 L14 起点 23.357 收拢（用户原值 23.56 与下一行重叠，同行无法显示两行）。
export const LINE_CHARS: number[][] = [
`;
writeFileSync(join(process.cwd(), "src/videos/pow/kit/times.ts"), header + arrText + "\n];\n");
console.log("\n已写回 times.ts");

// before → after 摘要
console.log("\n=== 行级 before → after ===");
Object.keys(MANUAL).forEach((k) => {
    const a = CUR[k], b = NEW[k];
    console.log(`L${String(LYRICS[k].i).padStart(2,"0")} ${a[0].toFixed(2)}–${a[a.length-1].toFixed(2)}  →  ${b[0].toFixed(2)}–${b[b.length-1].toFixed(2)}`);
});
