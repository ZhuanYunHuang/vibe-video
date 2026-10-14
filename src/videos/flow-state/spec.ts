import { VideoSpec } from "../../shared";
import { Cover } from "./Cover";
import { P } from "./kit/theme";
import { DiveBackdrop, FlowHud } from "./kit/ui";
import { Game } from "./scenes/Game";
import { Exam } from "./scenes/Exam";
import { Drive } from "./scenes/Drive";
import { Common } from "./scenes/Common";
import { Reveal } from "./scenes/Reveal";
import { Channel } from "./scenes/Channel";
import { Traits } from "./scenes/Traits";
import { HowTo } from "./scenes/HowTo";
import { Outro } from "./scenes/Outro";

// 《心流状态》：悬念式结构——三个具体场景冷开场 → 提问 → 揭题「心流」→ 机制 → 信号 → 方法
// 风格：「深潜水流」——深墨绿水底 + 薄荷水光 + 同心涟漪母题（kit/）
// BGM 复用默认 web-request/bgm.mp3：npm run beat 结果 112.8bpm / offset 12 / 可用 361 拍
//
// 大卡点落点表（每 16 拍）：★ 强拍（切场用重转场或幕内爆点）；△ 偏弱（fade 或内容跳变）
//     0 ★ 0.40s   16 ★ 8.91s   32 ★ 17.42s   48 △ 25.93s   64 △ 34.44s
//    80 △ 42.95s  96 △ 51.46s  112 △ 59.97s  128 △ 68.49s  144 △ 77.00s
//   160 △ 85.51s 176 ★ 94.02s  192 ★ 102.53s 208 △ 111.04s 224 ★ 119.55s
//   240 △ 128.06s 256 ★ 136.57s 272 △ 145.08s 288 ★ 153.59s 304 △ 162.10s
//   320 △ 170.61s 336 ★ 179.12s
// 强拍总表（幕内小卡点全部取自这里）：
//   1 2 5 7 8 11 13 14 17 21 37 45 61 62 72 84 100 103 109 110 120 136 157 162 165
//   167 168 169 173 175 179 180 181 183 184 187 195 209 215 216 222 229 233 237 241
//   247 248 258 259 261 273 276 286 290 293 296 308 310 317 321 322 334
//
// 逐 16 拍边界的大卡点安排：
//   16★五杀爆点 / 32★zoom切考试 / 48△杂音消失 / 64△fade / 80△到家 / 96△fade /
//   112△fade / 128△1975+定义 / 144△fade / 160△坐标轴 / 176★焦虑区 / 192★无聊区 /
//   208△小人跳区 / 224★通道画出 / 240△fade / 256★涟漪爆开+特征③ / 272△四卡全亮 /
//   288★diag切 / 304△第三方法连线 / 320△fade / 336★片尾爆开
export const flowState: VideoSpec = {
  id: "FlowState",
  bpm: 112.8,
  offset: 12, // 首拍出现在 0.40s
  totalBeats: 336, // 336 拍 ≈ 178.7s，+tailFrames ≈ 3 分钟
  transFrames: 12,
  tailFrames: 30,
  bgm: "flow-state/bgm.mp3",
  bg: P.bg,
  width: 1920,
  height: 1080,
  Backdrop: DiveBackdrop,
  Hud: FlowHud,
  Cover,
  scenes: [
    { start: 0, end: 32, Comp: Game, trans: "none", bg: P.bg }, // 冷开场：打游戏
    { start: 32, end: 64, Comp: Exam, trans: "zoom", bg: P.abyss }, // ★32
    { start: 64, end: 96, Comp: Drive, trans: "fade", bg: P.bg }, // △64
    { start: 96, end: 112, Comp: Common, trans: "fade", bg: P.abyss }, // △96
    { start: 112, end: 144, Comp: Reveal, trans: "fade", bg: P.bg }, // △112 揭题
    { start: 144, end: 240, Comp: Channel, trans: "fade", bg: P.abyss }, // △144
    { start: 240, end: 288, Comp: Traits, trans: "fade", bg: P.bg }, // △240
    { start: 288, end: 320, Comp: HowTo, trans: "diag", bg: P.abyss }, // ★288
    { start: 320, end: 336, Comp: Outro, trans: "fade", bg: P.bg }, // △320，收在 ★336
  ],
};
