import { readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { readdirSync } from "node:fs";
// reuse decoder from scan2 via inline copy
function decodePNG(buf) {
    let pos = 8, w = 0, h = 0, bitDepth = 0, colorType = 0;
    const idat = []; let palette = null;
    while (pos < buf.length) {
        const len = buf.readUInt32BE(pos);
        const type = buf.toString("ascii", pos + 4, pos + 8);
        const data = buf.subarray(pos + 8, pos + 8 + len);
        if (type === "IHDR") { w = data.readUInt32BE(0); h = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; }
        else if (type === "IDAT") idat.push(data);
        else if (type === "PLTE") palette = Buffer.from(data);
        else if (type === "IEND") break;
        pos += 12 + len;
    }
    const raw = inflateSync(Buffer.concat(idat));
    const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
    const stride = w * channels;
    const out = Buffer.alloc(w * h * 3);
    let prev = Buffer.alloc(stride);
    for (let y = 0; y < h; y++) {
        const off = y * (stride + 1);
        const filter = raw[off];
        const line = Buffer.from(raw.subarray(off + 1, off + 1 + stride));
        for (let x = 0; x < stride; x++) {
            const a = x >= channels ? line[x - channels] : 0;
            const b = prev[x];
            const c = x >= channels ? prev[x - channels] : 0;
            let v = line[x];
            switch (filter) {
                case 1: v = (v + a) & 255; break;
                case 2: v = (v + b) & 255; break;
                case 3: v = (v + ((a + b) >> 1)) & 255; break;
                case 4: { const p = a + b - c, pa = Math.abs(p-a), pb = Math.abs(p-b), pc = Math.abs(p-c);
                    v = (v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255; break; }
            }
            line[x] = v;
        }
        prev = line;
        for (let x = 0; x < w; x++) {
            let r, g, b2;
            if (colorType === 2) { r = line[x*3]; g = line[x*3+1]; b2 = line[x*3+2]; }
            else if (colorType === 6) { r = line[x*4]; g = line[x*4+1]; b2 = line[x*4+2]; }
            else if (colorType === 0) { r = g = b2 = line[x]; }
            else { const idx = line[x]; r = palette[idx*3]; g = palette[idx*3+1]; b2 = palette[idx*3+2]; }
            const o = (y * w + x) * 3;
            out[o] = r; out[o+1] = g; out[o+2] = b2;
        }
    }
    return { w, h, data: out };
}
const files = readdirSync(".trae/tmp/frames").sort();
const hits = [];
for (let fi = 0; fi < files.length; fi++) {
    const { w, h, data } = decodePNG(readFileSync(".trae/tmp/frames/" + files[fi]));
    let cnt = 0; let minX=1e9,maxX=-1,minY=1e9,maxY=-1;
    for (let i = 0; i < w * h; i++) {
        const r = data[i*3], g = data[i*3+1], b = data[i*3+2];
        // 任意偏粉/偏紫：红蓝都明显压过绿
        if (r > 120 && b > 90 && r - g > 35 && b - g > 18) {
            cnt++;
            const x = i % w, y = (i / w) | 0;
            if (x<minX)minX=x; if(x>maxX)maxX=x; if(y<minY)minY=y; if(y>maxY)maxY=y;
        }
    }
    if (cnt > 5) hits.push({ t: (fi / 30).toFixed(2), cnt, box: [minX, minY, maxX, maxY] });
}
console.log(hits.length, "frames with pinkish pixels");
console.log(JSON.stringify(hits.slice(0, 40)));
