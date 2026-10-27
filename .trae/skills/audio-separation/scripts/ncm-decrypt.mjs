// 网易云 .ncm 解密 → 标准音频（mp3/flac）
// 用法: node ncm-decrypt.mjs <input.ncm> <output>  （输出扩展名按实际格式自行给对）
import fs from "node:fs";
import crypto from "node:crypto";

const CORE_KEY = Buffer.from("hzHRAmso5kInbaxW", "ascii");
const META_KEY = Buffer.from([
  0x23, 0x31, 0x34, 0x6c, 0x6a, 0x6b, 0x5f, 0x21, 0x5c, 0x5d, 0x26, 0x30, 0x55, 0x3c, 0x27, 0x28,
]);

const inPath = process.argv[2];
const outPath = process.argv[3];
if (!inPath || !outPath) {
  console.error("用法: node ncm-decrypt.mjs <input.ncm> <output.ext>");
  process.exit(1);
}

const buf = fs.readFileSync(inPath);
if (buf.subarray(0, 8).toString("ascii") !== "CTENFDAM") throw new Error("不是 NCM 文件");

function aesEcbDecrypt(data, key, unpad) {
  const d = crypto.createDecipheriv("aes-128-ecb", key, null);
  d.setAutoPadding(false);
  let out = Buffer.concat([d.update(data), d.final()]);
  if (unpad) {
    const pad = out[out.length - 1];
    if (pad > 0 && pad <= 16 && pad <= out.length) out = out.subarray(0, out.length - pad);
  }
  return out;
}

function xorBytes(src, v) {
  const o = Buffer.alloc(src.length);
  for (let i = 0; i < src.length; i++) o[i] = src[i] ^ v;
  return o;
}

let off = 10; // 8 magic + 2 gap
const keyLen = buf.readUInt32LE(off);
off += 4;
const keyCipher = buf.subarray(off, off + keyLen);
off += keyLen;
const metaLen = buf.readUInt32LE(off);
off += 4;
const metaCipher = buf.subarray(off, off + metaLen);
off += metaLen;
off += 4; // crc
off += 5; // gap
const imgSize = buf.readUInt32LE(off);
off += 4 + imgSize;
const audioStart = off;

// 1) 密钥：XOR 0x64 → AES-128-ECB 解密（去掉 PKCS7 填充） → 掐掉 "neteasecloudmusic"
const keyPlain = aesEcbDecrypt(xorBytes(keyCipher, 0x64), CORE_KEY, true);
const key = keyPlain.subarray(17);

// 2) 元数据（可选，仅用于打印）
try {
  const raw = xorBytes(metaCipher, 0x63).toString("ascii").slice(22);
  const metaPlain = aesEcbDecrypt(Buffer.from(raw, "base64"), META_KEY, false).toString("utf8");
  const s = metaPlain.slice(6);
  const json = JSON.parse(s.slice(s.indexOf("{"), s.lastIndexOf("}") + 1));
  console.log(`曲目: ${json.musicName} - ${json.artist?.map((a) => a[0]).join("/")}  格式=${json.format}  时长=${(json.duration / 1000).toFixed(2)}s`);
} catch (e) {
  console.log("元数据解析跳过:", e.message);
}

// 3) 由密钥生成 256 字节交换盒
function buildKeyBox(k) {
  const box = new Uint8Array(256);
  for (let i = 0; i < 256; i++) box[i] = i;
  let c = 0;
  let last = 0;
  let ko = 0;
  for (let i = 0; i < 256; i++) {
    const swap = box[i];
    c = (swap + last + k[ko]) & 0xff;
    ko = (ko + 1) % k.length;
    box[i] = box[c];
    box[c] = swap;
    last = c;
  }
  return box;
}

// 4) 音频流密钥流（循环 256 字节）
const box = buildKeyBox(key);
const ks = new Uint8Array(256);
for (let i = 0; i < 256; i++) {
  const j = (i + 1) & 0xff;
  ks[i] = box[(box[j] + box[(box[j] + j) & 0xff]) & 0xff];
}

const enc = buf.subarray(audioStart);
const out = Buffer.alloc(enc.length);
for (let i = 0; i < enc.length; i++) out[i] = enc[i] ^ ks[i % 256];

const head3 = out.subarray(0, 3).toString("ascii");
const isMp3 = head3 === "ID3" || (out[0] === 0xff && (out[1] & 0xe0) === 0xe0);
const isFlac = out.subarray(0, 4).toString("ascii") === "fLaC";
if (!isMp3 && !isFlac) throw new Error(`解密结果不是合法音频（头部 ${out.subarray(0, 4).toString("hex")}）`);

fs.writeFileSync(outPath, out);
console.log(`已写出 ${outPath}  ${out.length} bytes  格式=${isFlac ? "FLAC" : "MP3"}`);
