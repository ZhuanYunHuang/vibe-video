import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, rmSync } from "node:fs";
import ts from "typescript";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require_ = createRequire(import.meta.url);
const bd = mkdtempSync(join(tmpdir(), "powv-"));
mkdirSync(join(bd, "kit"), { recursive: true });
for (const [f, o] of [["times.ts","times.js"],["lyrics.ts","lyrics.js"]]) {
    writeFileSync(join(bd, "kit", o), ts.transpileModule(readFileSync(join(process.cwd(), "src/videos/pow/kit", f), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
}
const { LYRICS } = require_(join(bd, "kit", "lyrics.js"));
const CH = require_(join(bd, "kit", "times.js")).LINE_CHARS;
let bad = 0;
LYRICS.forEach((l, k) => {
    const total = l.rows.reduce((n, r) => n + r.spans.reduce((m, s) => m + Array.from(s.t).length, 0), 0);
    if (!CH[k] || CH[k].length !== total) { bad++; console.log("不匹配: L" + l.i, "歌词字数", total, "时间表条数", CH[k] ? CH[k].length : "无"); }
});
console.log(bad === 0 ? "42 行全部匹配，逐字时间全部生效" : bad + " 行不匹配");
rmSync(bd, { recursive: true, force: true });
