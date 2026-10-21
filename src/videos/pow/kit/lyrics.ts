// 《POW》歌词 MV（71.7s）逐句时间轴。
// 拍速：`npm run beat` 报 61.6 BPM 属弱周期误报；底鼓包络自相关实测 BPM ≈ 102.3（0.5865s/拍），首拍 ≈ 0.227s。
//   16 拍大卡点：0.23 / 9.61 / 19.0 / 28.4 / 37.7 / 47.1 / 56.5 / 65.9s。
// 逐句时间来源（两步法，本机跨平台可用）：
//   ① 本地 Whisper（@huggingface/transformers v4 + Xenova/whisper-base，分窗段级转写）给出 0–48s 的分句锚点
//      （chunk 边界实测：4.34 / 7.50 / 10.22 / 13.00 / 16.00 / 17.70 / 20.70 / 22.20 / 24.50 / 26.14 / 27.00 / 28.00 /
//        31.00（"I'm back to beginning"）/ 32.40（"一开始"）/ 33.24 / 36.0 / 38.0 / 39.4 / 42.0 / 43.48（"Taste"）/ 44.0 / 45.36 / 46.2 / 47.4 / 48.2）；
//   ② 20 世纪后半段（48–72s）转写不可靠，按 16 拍大卡点 + 语速（≈1.9s/行）推演。
//   ⚠ 逐句秒数为「实测锚点 + 推演」的估计值，需在预览页逐句校对（只改本文件的 s 即可）。
// spec 用 offset=0 ⇒ 帧 = 秒 × 30、拍号 = 秒 × 1.705（全部时间数据用秒表达）。
import { LINE_CHARS } from "./times";

export const BPM = 102.3;
export const OFFSET = 0;
export const TOTAL_BEATS = 122; // 71.55s，覆盖全曲
export const TRANS_FRAMES = 12; // 0.4s：让 glitch 转场可见
export const TAIL_FRAMES = 24;
export const LABEL = "POW";

// 一个字 = 一个 span；pop = 重点词（绿块反色整体弹出）；shot = 枪声卡点字；outline = 该段用描边
export type Span = { t: string; pop?: boolean; shot?: boolean; outline?: boolean };
// word 逐词｜letter 逐字母｜slideIn 逐字左滑入｜sink 向下聚拢退场｜expand 从下往上扩张进场
// pierce 斜向穿透（绿）｜split 被穿透时左右分开｜diag 两段分离（左上 / 右下）
export type RowFx = "word" | "letter" | "slideIn" | "sink" | "expand" | "pierce" | "split" | "diag" | "outline";
export type Row = {
    spans: Span[];
    slam?: boolean;
    at?: number;
    fx?: RowFx;
    popZoom?: number; // 收官：该秒起本行原地放大铺满
    green?: boolean; // letter 行整行用强调色
    dur?: number;
    shatterAt?: number; // 炮声：该秒起整行被打碎
};
export type LyricLine = {
    i: number;
    s: number; // 起唱秒
    rows: Row[];
    wave?: boolean;
    size?: number;
    impact?: number; // 该秒触发强烈卡点（冲击波 + 强震）
    note: string;
    chars?: number[]; // 逐字实测秒数（按 row/span 顺序拼接），来自 times.ts
    chunks?: [number, number][]; // 原子词组（按 row/span 顺序拼接后的字符下标，含头尾）：组内所有字同帧出现
    bounds?: [number, number][]; // 分词边界：词组不跨界（未指定 chunks 的范围按词组折叠时用）
};
export type Shot = { sec: number; kind: "gun" | "cannon"; x: number; y: number };

export const LYRICS: LyricLine[] = [
    // ---------------- A 枪墙场（L1–L14）：十字准星 + 逐发弹孔 ----------------
    { i: 1, s: 0.30, rows: [{ spans: [{ t: "雪飘落在我的" }, { t: "枪口", pop: true }], at: 0.30 }], note: "准星入场；枪口", bounds: [[0, 0], [1, 7]] },
    { i: 2, s: 1.95, rows: [{ spans: [{ t: "狙击手就位" }], slam: true, at: 1.95 }, { spans: [{ t: "敌人一个都不能放走" }], slam: true, at: 3.10 }], impact: 2.12, note: "准星收缩锁定；强卡点" },
    { i: 3, s: 4.60, rows: [{ spans: [{ t: "血腥味越闻越上头" }], at: 4.60 }, { spans: [{ t: "展开追击" }], at: 5.35, fx: "slideIn" }], note: "展开追击：逐字左滑入", bounds: [[0, 0], [1, 12]] },
    { i: 4, s: 6.25, rows: [{ spans: [{ t: "韵脚是我手里牵的" }, { t: "狼狗", pop: true }], at: 6.25 }], note: "狼狗" },
    { i: 5, s: 7.45, rows: [{ spans: [{ t: "I killed a goat" }], at: 7.45, fx: "word" }, { spans: [{ t: "抓住他的" }, { t: "羊头", pop: true }, { t: "放我床头" }], at: 8.05 }], note: "第一行逐词" },
    // L6/L7：5 发枪声各在墙上打出一个弹孔
    { i: 6, s: 8.70, rows: [{ spans: [{ t: "In my killer's " }, { t: "mode", shot: true }], at: 8.70, fx: "word" }, { spans: [{ t: "你们" }, { t: "就", shot: true }, { t: "别想" }, { t: "走", shot: true }], at: 9.90 }], note: "① 三发弹孔（mode / 就 / 走）", chunks: [[0, 4], [5, 18], [19, 21], [22, 24]] },
    { i: 7, s: 11.20, rows: [{ spans: [{ t: "张开" }, { t: "口", shot: true }, { t: "盯着猎物身上滴的" }, { t: "油", shot: true }], at: 11.20 }], note: "① 再打两个弹孔（口 / 油）", chunks: [[0, 2]] },
    { i: 8, s: 13.05, rows: [{ spans: [{ t: "巅峰特遣队一出现" }], slam: true, at: 13.05 }, { spans: [{ t: "你们毫无疑问" }], slam: true, at: 13.80 }], note: "整句砸入" },
    { i: 9, s: 14.85, rows: [{ spans: [{ t: "变成我们" }, { t: "点缀", pop: true }], at: 14.85 }], note: "点缀" },
    { i: 10, s: 15.90, rows: [{ spans: [{ t: "我们全队最权威的技术" }], at: 15.90 }, { spans: [{ t: "配", shot: true }, { t: "上了前卫的 " }, { t: "flow", pop: true }], at: 16.45 }], note: "② 弹孔（配）；flow" },
    { i: 11, s: 17.60, rows: [{ spans: [{ t: "咽", shot: true }, { t: "下", shot: true }, { t: "还残留着烟味的酒" }], at: 17.60 }], note: "② 两个弹孔（咽 / 下）" },
    { i: 12, s: 19.55, rows: [{ spans: [{ t: "自己做蛋糕不如抢来的" }, { t: "甜", shot: true }, { t: "味可口" }], at: 19.55 }], note: "② 弹孔（甜）" },
    { i: 13, s: 21.60, rows: [{ spans: [{ t: "我们太强没法" }, { t: "谦卑", outline: true }, { t: "地走" }], at: 21.60 }], note: "谦卑：描边" },
    // L14：感 / 谢 两发弹孔；末字「头」= 炮声 → 整行打碎 + 打穿墙 + 转场
    { i: 14, s: 23.20, rows: [{ spans: [{ t: "感", shot: true }, { t: "谢", shot: true }, { t: "那些前赴后继来垫背的" }, { t: "头", shot: true }], at: 23.20, shatterAt: 25.50 }], impact: 25.50, note: "② 炮声：打碎整行 + 打穿墙" },

    // ---------------- B Reset 场（L15–L26）----------------
    { i: 15, s: 24.70, rows: [{ spans: [{ t: "做得太好是 " }, { t: "my bad", pop: true }], at: 24.70 }], note: "my bad" },
    { i: 16, s: 26.05, rows: [{ spans: [{ t: "你们讨厌但是我" }], at: 26.05 }, { spans: [{ t: "Like that like that" }], at: 26.45, fx: "letter", green: true }], note: "逐字母 + 绿字" },
    { i: 17, s: 27.15, rows: [{ spans: [{ t: "法老夸我说" }, { t: "吊的来" }], at: 27.15, fx: "diag" }], note: "③ 两段分离（左上 / 右下）" },
    { i: 18, s: 28.25, rows: [{ spans: [{ t: "谢老板听完了要说我" }, { t: "帅惨帅惨", pop: true }], at: 28.25 }], wave: true, note: "波浪震动" },
    { i: 19, s: 31.05, rows: [{ spans: [{ t: "I'm back to beginning" }], at: 31.05, fx: "letter" }], note: "逐字母（Whisper 锚点 31.0s）" },
    { i: 20, s: 32.45, rows: [{ spans: [{ t: "一开始就注定赢" }], at: 32.45, fx: "expand" }], note: "从下往上扩张进场" },
    { i: 21, s: 33.35, rows: [{ spans: [{ t: "不听不听他们说的" }], at: 33.35 }, { spans: [{ t: "所以孤零零" }], at: 34.00, fx: "sink" }], note: "孤零零：向下聚拢退场" },
    { i: 22, s: 34.75, rows: [{ spans: [{ t: "肃清附近" }], at: 34.75, fx: "split", dur: 1.2 }, { spans: [{ t: "所有反对声音" }], at: 35.35, fx: "pierce" }], impact: 35.35, note: "绿字斜穿 + 横扫 + 强卡点" },
    { i: 23, s: 36.05, rows: [{ spans: [{ t: "我是你们哭着走不出的" }], at: 36.05 }, { spans: [{ t: "那片" }, { t: "寂静岭", outline: true }], at: 37.00 }], note: "寂静岭：描边" },
    { i: 24, s: 38.10, rows: [{ spans: [{ t: "聆听我们进军浩浩荡荡" }], at: 38.10 }, { spans: [{ t: "你没搞好状况" }], at: 38.75 }], wave: true, note: "波浪震动" },
    { i: 25, s: 39.50, rows: [{ spans: [{ t: "兄弟你们最好早早" }, { t: "让让位置", pop: true }], at: 39.50 }], note: "让让位置" },
    { i: 26, s: 42.10, rows: [{ spans: [{ t: "让我得到我所窥视的" }], at: 42.10 }, { spans: [{ t: "美食的 taste" }], at: 42.95, fx: "letter" }], note: "逐字母（Whisper 锚点 Taste 43.5s）" },

    // ---------------- C Acid 场（L27–L31）：鼓点进场的荧光绿反色场 ----------------
    { i: 27, s: 44.10, rows: [{ spans: [{ t: "心狠又手辣我做事的方式" }], slam: true, at: 44.10 }], impact: 44.10, note: "④ 鼓点进场：强过渡 + 强卡点" },
    { i: 28, s: 45.55, rows: [{ spans: [{ t: "都别过来惹老子" }, { t: "烧了你房子", pop: true }], at: 45.55 }], note: "烧了你房子" },
    { i: 29, s: 46.65, rows: [{ spans: [{ t: "这无害的外表是" }, { t: "迷惑的装饰", outline: true }], at: 46.65 }], note: "迷惑的装饰：描边" },
    { i: 30, s: 47.55, rows: [{ spans: [{ t: "别对我指手画脚你" }, { t: "什么档次", pop: true }], slam: true, at: 47.55 }], note: "砸入" },
    { i: 31, s: 48.45, rows: [{ spans: [{ t: "像李宁拿着火炬" }], at: 48.45 }, { spans: [{ t: "back in08" }], at: 49.15, fx: "letter" }], note: "逐字母" },

    // ---------------- D Flurry 场（L32–L34）：快嘴三连 ----------------
    { i: 32, s: 52.60, rows: [{ spans: [{ t: "被我搅浑哪个敢来趟水" }], slam: true, at: 52.60 }], impact: 51.91, note: "砸入 + 强卡点" },
    { i: 33, s: 53.65, rows: [{ spans: [{ t: "想赢我们我告诉你 " }, { t: "no way", pop: true }], slam: true, at: 53.65 }], note: "no way" },
    { i: 34, s: 54.70, rows: [{ spans: [{ t: "谁敢多说一句来人掌嘴" }], slam: true, at: 54.70 }], impact: 54.70, note: "横扫 + 强卡点" },

    // ---------------- E Hero 场（L35–L38）----------------
    { i: 35, s: 55.65, rows: [{ spans: [{ t: "我像是张飞" }], at: 55.65 }, { spans: [{ t: "一夫当关" }, { t: "万夫莫开", pop: true }], slam: true, at: 56.35 }], note: "砸入" },
    { i: 36, s: 57.40, rows: [{ spans: [{ t: "不想你们狼狈妈" }, { t: "老鼠在过街", pop: true }], at: 57.40 }], note: "老鼠在过街" },
    { i: 37, s: 59.00, rows: [{ spans: [{ t: "我们坐在巅峰眼中" }, { t: "只有天空", pop: true }], at: 59.00 }], wave: true, note: "波浪震动" },
    { i: 38, s: 60.60, rows: [{ spans: [{ t: "我来送你们" }, { t: "泼该", pop: true }], slam: true, at: 60.60 }], impact: 61.43, note: "准星回场 + 砸入" },

    // ---------------- F Finale 场（L39–L42）：收官 ----------------
    { i: 39, s: 61.80, rows: [{ spans: [{ t: "刻板印象我来" }, { t: "颠覆", pop: true }, { t: "它" }], slam: true, at: 61.80 }], note: "砸入" },
    { i: 40, s: 63.40, rows: [{ spans: [{ t: "靠的不是努力这是" }, { t: "天赋", pop: true }, { t: "哈" }], slam: true, at: 63.40 }], note: "砸入" },
    { i: 41, s: 65.00, rows: [{ spans: [{ t: "碰嘛" }, { t: "断送", pop: true }, { t: "你的前途哈" }], slam: true, at: 65.00 }], note: "砸入" },
    { i: 42, s: 66.60, rows: [{ spans: [{ t: "你想看我淘汰" }], at: 66.60 }, { spans: [{ t: "老子偏不噶" }], at: 67.60, popZoom: 68.15 }], note: "收官：原地放大铺满 → POW!! 定格" },
];

// 逐字实测时间表（离线强制对齐产出，见 times.ts）：写入每行起唱秒与逐字秒数
LYRICS.forEach((l, k) => {
    const t = LINE_CHARS[k];
    if (!t || !t.length) return;
    const total = l.rows.reduce((n, r) => n + r.spans.reduce((m, s) => m + Array.from(s.t).length, 0), 0);
    if (t.length !== total) return;
    l.s = t[0];
    l.chars = t;
});

// 音效卡点（用户点名的 11 发枪 + 1 发炮）：秒数 = 卡点字的出场时间（字出现的瞬间 = 枪/炮声）
// mode/就/走/口/油/咽/下 为 2-8kHz 谱通量实测瞬态；其余跟随 v9 手动校对表
export const SHOTS: Shot[] = [
    { sec: 9.160, kind: "gun", x: 0.14, y: 0.22 }, // mode
    { sec: 9.729, kind: "gun", x: 0.83, y: 0.17 }, // 就
    { sec: 9.961, kind: "gun", x: 0.27, y: 0.8 }, // 走
    { sec: 11.140, kind: "gun", x: 0.68, y: 0.84 }, // 口
    { sec: 12.249, kind: "gun", x: 0.09, y: 0.52 }, // 油
    { sec: 17.542, kind: "gun", x: 0.91, y: 0.45 }, // 配
    { sec: 18.768, kind: "gun", x: 0.35, y: 0.12 }, // 咽
    { sec: 19.104, kind: "gun", x: 0.62, y: 0.13 }, // 下
    { sec: 21.775, kind: "gun", x: 0.2, y: 0.88 }, // 甜
    { sec: 23.539, kind: "gun", x: 0.55, y: 0.86 }, // 感
    { sec: 24.004, kind: "gun", x: 0.88, y: 0.72 }, // 谢
    { sec: 25.500, kind: "cannon", x: 0.5, y: 0.5 }, // 头（炮）：打穿墙 + 字碎 → 转场
];

// 场边界（秒）：以各段首句的（实测对齐后的）起唱秒为准
const lineAt = (i: number) => LYRICS.find((l) => l.i === i)?.s ?? 0;
const shotSec = (idx: number) => SHOTS[idx]?.sec ?? 0;

export const SNIPER_SEC = 0;
export const RESET_SEC = lineAt(15);
export const ACID_SEC = lineAt(27);
export const FLURRY_SEC = lineAt(32);
export const HERO_SEC = lineAt(35);
export const FINALE_SEC = lineAt(39);

const beatOf = (sec: number) => (sec * BPM) / 60;
// 场景边界拍号：一般取该段首句起唱秒（转场结束时正好落在这句上）；
// B 场例外：切场推后到「炮声 + 0.05s」（v9 手动表里 L15 起唱紧跟炮声，缓冲收小避免吞掉 L15 起唱）
export const RESET_BEAT = beatOf(Math.max(RESET_SEC, shotSec(11) + 0.05));
export const ACID_BEAT = beatOf(ACID_SEC);
export const FLURRY_BEAT = beatOf(FLURRY_SEC);
export const HERO_BEAT = beatOf(HERO_SEC);
export const FINALE_BEAT = beatOf(FINALE_SEC);

// 逐句起唱秒作为卡点震动（重句略强）
export const SHAKES = LYRICS.map((l) => ({ sec: l.s, amp: l.rows.some((r) => r.slam) ? 1.35 : 0.95 }));

export const CROSSHAIR_ATS = [lineAt(1), lineAt(2), lineAt(38)];
export const SWEEP_ATS = [lineAt(22), lineAt(34)];
export const STAMP_SEC = lineAt(42) + 3.0;
