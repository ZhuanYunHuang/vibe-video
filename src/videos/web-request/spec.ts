import { C, VideoSpec } from "../../shared";
import { Intro } from "./scenes/Intro";
import { Browser } from "./scenes/Browser";
import { Dns } from "./scenes/Dns";
import { Tcp } from "./scenes/Tcp";
import { Tls } from "./scenes/Tls";
import { Http } from "./scenes/Http";
import { Server } from "./scenes/Server";
import { Render } from "./scenes/Render";
import { Done } from "./scenes/Done";
import { Outro } from "./scenes/Outro";

// 《访问一个网页，背后发生了多少事》
// 节拍参数由 scripts/analyze-beat.mjs 分析 public/web-request/bgm.mp3 得出
export const webRequest: VideoSpec = {
  id: "WebRequest",
  bpm: 112.8,
  offset: 12, // 首拍出现在 0.40s
  totalBeats: 112,
  transFrames: 12,
  tailFrames: 45, // 结尾多留 1.5 秒收尾
  bgm: "web-request/bgm.mp3",
  bg: C.bg,
  width: 1920,
  height: 1080,
  // 场景表：start/end 为拍号，切换点都落在强拍上
  scenes: [
    { start: 0, end: 8, Comp: Intro, trans: "none", bg: C.bg },
    { start: 8, end: 16, Comp: Browser, trans: "zoom", bg: "#0d1430" },
    { start: 16, end: 32, Comp: Dns, trans: "slideLeft", bg: "#120f2e" },
    { start: 32, end: 44, Comp: Tcp, trans: "circle", bg: "#0a1a2a" },
    { start: 44, end: 56, Comp: Tls, trans: "blinds", bg: "#0b1f1a" },
    { start: 56, end: 68, Comp: Http, trans: "diag", bg: "#1f1a0b" },
    { start: 68, end: 80, Comp: Server, trans: "slideUp", bg: "#1f0b1a" },
    { start: 80, end: 92, Comp: Render, trans: "spin", bg: "#1f140b" },
    { start: 92, end: 100, Comp: Done, trans: "glitch", bg: C.bg },
    { start: 100, end: 112, Comp: Outro, trans: "zoom", bg: C.bg },
  ],
};
