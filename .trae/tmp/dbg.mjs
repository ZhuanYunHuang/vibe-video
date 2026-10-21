// 复用 align-pow 的中间产物调试：直接改脚本太重，这里独立小复现
import { readFileSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import ts from "typescript";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const ROOT = "D:/newDownload/project/vibe-video";
const buildDir = mkdtempSync(join(tmpdir(), "powdbg-"));
mkdirSync(join(buildDir, "kit"), { recursive: true });
for (const [f, o] of [["times.ts","times.js"],["lyrics.ts","lyrics.js"]]) {
    const src = readFileSync(join(ROOT, "src/videos/pow/kit", f), "utf8");
    writeFileSync(join(buildDir, "kit", o), ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
}
const { LYRICS, SHOTS } = require(join(buildDir, "kit", "lyrics.js"));
LYRICS.forEach((l, k) => {
    const shots = [];
    for (const row of l.rows) for (const sp of row.spans) if (sp.shot) shots.push(sp.t);
    if (shots.length) console.log(`L${l.i} (idx ${k}) shots:`, shots.join(","));
});
console.log("SHOTS order:", SHOTS.map(s => s.sec).join(","));
