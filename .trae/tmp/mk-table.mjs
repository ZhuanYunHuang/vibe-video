import { readFileSync, mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import ts from "typescript";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const bd = mkdtempSync(join(tmpdir(), "powt-"));
mkdirSync(join(bd, "kit"), { recursive: true });
for (const [f, o] of [["times.ts","times.js"],["lyrics.ts","lyrics.js"]]) {
    const src = readFileSync(join(process.cwd(), "src/videos/pow/kit", f), "utf8");
    writeFileSync(join(bd, "kit", o), ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText);
}
const { LYRICS } = require(join(bd, "kit", "lyrics.js"));
const CH = require(join(bd, "kit", "times.js")).LINE_CHARS;
const fmt = (t) => t.toFixed(2);
let file = "POW 逐字时间表（v8，当前成片使用中）\n帧率30，秒=绝对时间。改动时告诉我：行号 + 哪个字 + 目标秒（或“整体+0.2s”）。\n\n";
let chat = "";
LYRICS.forEach((l, k) => {
    const t = CH[k];
    const text = l.rows.map(r => r.spans.map(s => s.t).join("")).join(" ／ ");
    // 标注 shot 字
    let ci = 0;
    const marks = [];
    for (const row of l.rows) for (const sp of row.spans) {
        const n = Array.from(sp.t).length;
        if (sp.shot) marks.push(...Array.from({length: n}, (_, i) => ci + i));
        ci += n;
    }
    const perChar = t.map((sec, i) => {
        const ch = Array.from(l.rows.map(r => r.spans.map(s => s.t).join("")).join(""))[i];
        return marks.includes(i) ? `【${ch}${fmt(sec)}】` : `${ch}${fmt(sec)}`;
    }).join(" ");
    const line = `L${String(l.i).padStart(2, "0")} ${fmt(t[0])}–${fmt(t[t.length - 1])}  ${text}`;
    chat += line + "\n";
    file += line + "\n    " + perChar + "\n";
});
writeFileSync(".trae/pow-times.txt", file);
console.log(chat);
