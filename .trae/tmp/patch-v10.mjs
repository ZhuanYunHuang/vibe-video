import { readFileSync, writeFileSync, mkdtempSync, mkdirSync } from "node:fs";
import ts from "typescript";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const bd = mkdtempSync(join(tmpdir(), "powp-"));
mkdirSync(join(bd, "kit"), { recursive: true });
for (const [f, o] of [["times.ts","times.js"],["lyrics.ts","lyrics.js"]]) {
    const src = readFileSync(join(process.cwd(), "src/videos/pow/kit", f), "utf8");
    writeFileSync(join(bd, "kit", o), ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
}
const CUR = require(join(bd, "kit", "times.js")).LINE_CHARS;
const NEW = CUR.map((r) => r.slice());
const r3 = (t) => Math.round(t * 1000) / 1000;
const spread = (row, a, b, s, e) => {
    const step = (e - s) / (b - a);
    for (let i = a; i <= b; i++) row[i] = r3(s + (i - a) * step);
};
const fill = (row, a, b, v) => { for (let i = a; i <= b; i++) row[i] = v; };

// L05 7.43–8.80（用户给 8.83 = L06 起点，压 0.03s 避免末字被换行吞掉）
spread(NEW[4], 0, 24, 7.43, 8.80);
// L06 四段原子：In my @8.83 ｜ killer's mode @9.160(枪) ｜ 你们就 @9.729(枪) ｜ 别想走 @9.961(枪)
fill(NEW[5], 0, 4, 8.83); fill(NEW[5], 5, 18, 9.160); fill(NEW[5], 19, 21, 9.729); fill(NEW[5], 22, 24, 9.961);
// L07 两段：张开口 @11.14(含口枪) ｜ 盯着猎物身上滴的 铺 11.70–12.10 ｜ 油 @12.249(枪)
fill(NEW[6], 0, 2, 11.14); spread(NEW[6], 3, 10, 11.70, 12.10); NEW[6][11] = 12.249;
// L11 咽 @18.768(枪) 下 @19.104(枪) 其余 19.25–19.88
NEW[10][0] = 18.768; NEW[10][1] = 19.104; spread(NEW[10], 2, 9, 19.25, 19.88);

const arrText = NEW.map((row) => "    [" + row.map((t) => t.toFixed(3)).join(", ") + "],").join("\n");
const header = `// 逐字时间表（v10 = v9 手动校对 + 本轮修订）：
// L03 两段（血 3.63 单独亮，其余 4.01 起）、L05 收尾 8.80（用户 8.83 与 L06 起点重叠，压 0.03 保末字可见）、
// L06 四段原子出现并锚枪声瞬态（In my 8.83 / killer's mode 9.160 / 你们就 9.729 / 别想走 9.961）、
// L07 两段（张开口 11.14 / 盯着猎物身上滴的 11.70 起、油 12.249 卡枪声）、L11 咽 18.768 / 下 19.104 卡枪声。
// 渲染层按词组折叠出现（stage.tsx collapseGroups）。LINE_CHARS[k] = 逐字符绝对秒（帧 = 秒 × 30）。
export const LINE_CHARS: number[][] = [
`;
writeFileSync(join(process.cwd(), "src/videos/pow/kit/times.ts"), header + arrText + "\n];\n");
console.log("L05:", NEW[4].map(t=>t.toFixed(2)).join(" "));
console.log("L06:", NEW[5].map(t=>t.toFixed(2)).join(" "));
console.log("L07:", NEW[6].map(t=>t.toFixed(2)).join(" "));
console.log("L11:", NEW[10].map(t=>t.toFixed(2)).join(" "));
console.log("已写回 times.ts");
