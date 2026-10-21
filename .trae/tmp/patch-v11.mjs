import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import ts from "typescript";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const bd = mkdtempSync(join(tmpdir(), "powq-"));
mkdirSync(join(bd, "kit"), { recursive: true });
for (const [f, o] of [["times.ts","times.js"],["lyrics.ts","lyrics.js"]]) {
    const src = readFileSync(join(process.cwd(), "src/videos/pow/kit", f), "utf8");
    writeFileSync(join(bd, "kit", o), ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
}
const CUR = require(join(bd, "kit", "times.js")).LINE_CHARS;
const NEW = CUR.map((r) => r.slice());
const r3 = (t) => Math.round(t * 1000) / 1000;
const spread = (row, a, b, s, e) => { const step = (e - s) / (b - a); for (let i = a; i <= b; i++) row[i] = r3(s + (i - a) * step); };

// L13 22.35–23.50（用户原 23.35 收拢解除，L14 起点后移到 23.51，不再重叠）
spread(NEW[12], 0, 9, 22.35, 23.50);
// L14 23.51–25.50：感 @23.539(枪) 谢 @24.004(枪) 中间 10 字 24.15–25.35 头 25.50(炮) 不动
NEW[13][0] = 23.539; NEW[13][1] = 24.004; spread(NEW[13], 2, 11, 24.15, 25.35); NEW[13][12] = 25.500;
// L31 50.10–51.90
spread(NEW[30], 0, 15, 50.10, 51.90);
// L32 51.91–53.35
spread(NEW[31], 0, 9, 51.91, 53.35);

const arrText = NEW.map((row) => "    [" + row.map((t) => t.toFixed(3)).join(", ") + "],").join("\n");
const header = `// 逐字时间表（v11 = v10 + 本轮修订）：
// L13 22.35–23.50、L14 23.51–25.50（感 23.539 / 谢 24.004 分别卡枪声，中间铺开，头 25.50 炮不动）、
// L31 50.10–51.90、L32 51.91–53.35。渲染层按词组折叠出现（stage.tsx collapseGroups）。
// LINE_CHARS[k] = LYRICS[k] 按 row/span 顺序拼接后的逐字符绝对秒（帧 = 秒 × 30）。
export const LINE_CHARS: number[][] = [
`;
writeFileSync(join(process.cwd(), "src/videos/pow/kit/times.ts"), header + arrText + "\n];\n");
console.log("L13:", NEW[12].map(t=>t.toFixed(2)).join(" "));
console.log("L14:", NEW[13].map(t=>t.toFixed(2)).join(" "));
console.log("L31:", NEW[30].map(t=>t.toFixed(2)).join(" "));
console.log("L32:", NEW[31].map(t=>t.toFixed(2)).join(" "));
console.log("已写回 times.ts");
