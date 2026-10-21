import { execFileSync } from "node:child_process";
const FF = "node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe";
const W = 480, H = 270;
const buf = execFileSync(FF, ["-loglevel","error","-i","out/pow/pow.mp4","-f","rawvideo","-pix_fmt","rgb24","-vf",`scale=${W}:${H}`,"-"], {maxBuffer: 1<<30});
const frameLen = W*H*3;
const total = Math.floor(buf.length/frameLen);
console.log("frames:", total, "=", (total/30).toFixed(2)+"s");
let hits = {};
for (let f=0; f<total; f++) {
  let cnt = 0;
  for (let i=f*frameLen; i<(f+1)*frameLen; i+=3) {
    const r=buf[i], g=buf[i+1], b=buf[i+2];
    if (r>170 && b>110 && g<110 && r-g>80 && b-g>40) cnt++;
  }
  if (cnt>30) hits[(f/30).toFixed(2)] = cnt;
}
console.log("pink frames:", JSON.stringify(hits));
