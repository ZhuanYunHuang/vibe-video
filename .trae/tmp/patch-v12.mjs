import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import ts from "typescript";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const bd = mkdtempSync(join(tmpdir(), "powr-"));
mkdirSync(join(bd, "kit"), { recursive: true });
for (const [f, o] of [["times.ts","times.js"],["lyrics.ts","lyrics.js"]]) {
    const src = readFileSync(join(process.cwd(), "src/videos/pow/kit", f), "utf8");
    writeFileSync(join(bd, "kit", o), ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
}
const CUR = require(join(bd, "kit", "times.js")).LINE_CHARS;
const NEW = CUR.map((r) => r.slice());
const r3 = (t) => Math.round(t * 1000) / 1000;
const spread = (row, a, b, s, e) => { const step = (e - s) / (b - a); for (let i = a; i <= b; i++) row[i] = r3(s + (i - a) * step); };

// L05：I 单独出现 @7.43，killed a goat + 抓住他的羊头放我床头 从 7.70 铺到 8.80
NEW[4][0] = 7.43; spread(NEW[4], 1, 24, 7.70, 8.80);
// L38 61.43–63.40
spread(NEW[37], 0, 6, 61.43, 63.40);
// L39 63.41–64.70
spread(NEW[38], 0, 8, 63.41, 64.70);
// L40 64.71–65.30
spread(NEW[39], 0, 10, 64.71, 65.30);

const arrText = NEW.map((row) => "    [" + row.map((t) => t.toFixed(3)).join(", ") + "],").join("\n");
const header = `// 逐字时间表（v12 = v11 + 本轮修订）：
// L05 I 单独出现 7.43，killed a goat／抓住他的羊头放我床头 7.70–8.80（词组渲染时 I 独立成组）；
// L38 61.43–63.40、L39 63.41–64.70、L40 64.71–65.30。L14 感/谢 两枪分离维持 v11。
// 渲染层按词组折叠出现（stage.tsx collapseGroups）。LINE_CHARS[k] = 逐字符绝对秒（帧 = 秒 × 30）。
export const LINE_CHARS: number[][] = [
`;
writeFileSync(join(process.cwd(), "src/videos/pow/kit/times.ts"), header + arrText + "\n];\n");
console.log("L05:", NEW[4].map(t=>t.toFixed(2)).join(" "));
console.log("L38:", NEW[37].map(t=>t.toFixed(2)).join(" "));
console.log("L39:", NEW[38].map(t=>t.toFixed(2)).join(" "));
console.log("L40:", NEW[39].map(t=>t.toFixed(2)).join(" "));
console.log("已写回 times.ts");
