// 《我的》GALI 片段（40.6s）逐句时间轴。
// 时间来源：本地 Whisper 逐字转写（word timestamps）实测秒数，再用 142.1 BPM 的拍网格校正。
// 关键实测锚点（秒）：
//   Hook：0.44 起唱，每句 2 拍（0.845s）→ L1..L8 = 0.44/1.28/2.13/2.97/3.82/4.66/5.51/6.35
//   黄→黑硬切：L9「白色的瓶子」= 7.60s；进鼓点：L11「把我的名字」= 11.02s
//   收尾黄场：L26「That's my」= 36.00s（与开场同 2 拍节奏）
//   注：spec 的 bpm=142.1、offset=0，故「拍号 = 秒 × 2.3683」，帧 = 秒 × 30。

export const BPM = 142.1;
export const OFFSET = 0;
export const TOTAL_BEATS = 96;
export const TRANS_FRAMES = 1;
export const TAIL_FRAMES = 6;
export const LABEL = "我的 · GALI";

// 场景起始拍（帧 = 秒 × 30 = 拍号 × 12.667）
export const HOOK_START = 0; // 0.00s
export const VERSE_START = 18; // 7.60s（黄→黑硬切）
export const OUTRO_START = 85.262; // 36.00s（回归黄场）

// 黄场重拍卡点震动：音乐重拍在 0.775 + 2k×0.4222（每 2 拍一次，小节首拍加重）
const beatSec = 60 / BPM;
export const HOOK_SHAKES: { sec: number; amp: number }[] = Array.from({ length: 9 }, (_, i) => 0.775 + i * 2 * beatSec)
    .filter((s) => s < 7.62)
    .map((sec, i) => ({ sec, amp: i % 2 === 0 ? 1.35 : 0.85 }));
export const OUTRO_SHAKES: { sec: number; amp: number }[] = [
    { sec: 36.0, amp: 1.6 },
    { sec: 36.42, amp: 0.8 },
    { sec: 36.84, amp: 1.2 },
    { sec: 37.27, amp: 0.75 },
    { sec: 37.69, amp: 1.2 },
    { sec: 38.11, amp: 0.75 },
    { sec: 38.53, amp: 1.35 },
    { sec: 38.95, amp: 0.8 },
];

// 一个字 = 一个 span；pop = 整体弹出（韵脚块 / 重点词），否则逐字显示
export type Span = { t: string; pop?: boolean };
// 行特效：rainbow 逐字彩虹 / outline 透明字描边 / stack 逐词从下往上堆叠
export type RowFx = "rainbow" | "outline" | "stack";
export type Row = { spans: Span[]; slam?: boolean; at?: number; fx?: RowFx; popZoom?: number };
export type LyricLine = {
    i: number;
    s: number; // 起唱秒
    rows: Row[];
    hookKey?: string; // 黄场句式标记
    wave?: boolean; // 波浪震动（进鼓重点句）
    bowling?: { scatterAt: number }; // 保龄球幕：末行从下往上冲，scatterAt 秒把上方三行打散
    note: string;
};

const my = (key: string): LyricLine["rows"] => [
    { spans: [{ t: "That's my" }], slam: true },
    { spans: [{ t: key }], slam: true },
];
const allMine = (): Row => ({ spans: [{ t: "全都是" }, { t: "我的", pop: true }], slam: true });

export const LYRICS: LyricLine[] = [
    // ---------------- A 开场 Hook（黄场，L1–L8，每句 2 拍）----------------
    { i: 1, s: 0.44, rows: my("chains"), hookKey: "chains", note: "开场砸字，重拍卡点震动" },
    { i: 2, s: 1.28, rows: my("fame"), hookKey: "fame", note: "" },
    { i: 3, s: 2.13, rows: my("gang"), hookKey: "gang", note: "" },
    { i: 4, s: 2.97, rows: [allMine()], note: "「我的」反色块" },
    { i: 5, s: 3.82, rows: my("love"), hookKey: "love", note: "" },
    { i: 6, s: 4.66, rows: my("boy"), hookKey: "boy", note: "" },
    { i: 7, s: 5.51, rows: my("money"), hookKey: "money", note: "" },
    { i: 8, s: 6.35, rows: [allMine()], note: "" },

    // ---------------- B 主歌（黑场，L9–L25，逐字 + 拆行）----------------
    { i: 9, s: 7.6, rows: [{ spans: [{ t: "白色的瓶子在角落里面堆一堆" }], at: 7.6 }], note: "黄→黑硬切，起逐字" },
    {
        i: 10,
        s: 9.2,
        // 保龄球幕：三行从上到下排成球瓶，「保龄球」从下往上冲上来撞散
        rows: [
            { spans: [{ t: "把他们全" }], at: 9.2 },
            { spans: [{ t: "部击落" }], at: 9.55 },
            { spans: [{ t: "像打" }], at: 9.9 },
            { spans: [{ t: "保龄球", pop: true }], at: 10.05 },
        ],
        bowling: { scatterAt: 10.26 },
        note: "单独一幕：三行球瓶 + 保龄球从下往上打散",
    },
    {
        i: 11,
        s: 11.02,
        rows: [
            { spans: [{ t: "把我的名字", pop: true }], slam: true, at: 11.02 },
            { spans: [{ t: "挂 Hall of fame 的墙壁" }], at: 11.7 },
        ],
        wave: true,
        note: "进鼓点（11.02s）：整句砸入 + 波浪震动",
    },
    { i: 12, s: 12.48, rows: [{ spans: [{ t: "但传奇的结局我还没赢够" }], at: 12.48 }], note: "" },
    { i: 13, s: 13.44, rows: [{ spans: [{ t: "拿我的笔拿我的笔" }], at: 13.44 }], note: "吸附到拍 30（13.44s）" },
    { i: 14, s: 14.29, rows: [{ spans: [{ t: "填上不一样的油彩" }], at: 14.29, fx: "rainbow" }], note: "吸附到拍 32（14.29s）；彩虹字" },
    { i: 15, s: 15.8, rows: [{ spans: [{ t: "That I've been told" }], at: 15.8 }], note: "" },
    { i: 16, s: 17.82, rows: [{ spans: [{ t: "How about the cream" }], at: 17.82 }], note: "" },
    { i: 17, s: 18.44, rows: [{ spans: [{ t: "How about the cream" }], at: 18.44 }], note: "" },
    {
        i: 18,
        s: 19.28,
        // 悄悄音：透明字 + 主题黄描边
        rows: [
            { spans: [{ t: "擦了擦嘴 没有弄脏" }], at: 19.28, fx: "outline" },
            { spans: [{ t: "我白的领口" }], at: 20.35, fx: "outline" },
        ],
        note: "悄悄音：透明填充 + 黄描边",
    },
    {
        i: 19,
        s: 21.52,
        rows: [
            { spans: [{ t: "全都是" }, { t: "我的", pop: true }], at: 21.52 },
            { spans: [{ t: "Got Margiela tabi" }], at: 22.3 },
        ],
        note: "",
    },
    { i: 20, s: 22.82, rows: [{ spans: [{ t: "Got J. Watanabe lets bag it up" }], at: 22.82 }], note: "" },
    {
        i: 21,
        s: 24.92,
        rows: [
            { spans: [{ t: "全都是" }, { t: "我的", pop: true }], at: 24.92 },
            { spans: [{ t: "Got ERD jacket" }], at: 25.5 },
        ],
        note: "",
    },
    {
        i: 22,
        s: 26.22,
        rows: [
            { spans: [{ t: "我像在堆乐高" }], at: 26.22 },
            { spans: [{ t: "We stack it up" }], at: 27.1, fx: "stack" },
        ],
        note: "We stack it up 逐词从下往上堆",
    },
    {
        i: 23,
        s: 28.52,
        rows: [
            { spans: [{ t: "想定 GALI 的位置" }], at: 28.52 },
            { spans: [{ t: "但看不清坐标" }], at: 29.4 },
            { spans: [{ t: "都拿起了" }, { t: "望远镜", pop: true }], at: 30.1 },
        ],
        note: "三押①：望远镜",
    },
    { i: 24, s: 30.6, rows: [{ spans: [{ t: "59 Fifity 我" }, { t: "帽檐底", pop: true }], at: 31.0 }], note: "三押②：帽檐底" },
    {
        i: 25,
        s: 32.98,
        rows: [
            { spans: [{ t: "全明星 BENZO" }], at: 32.98 },
            { spans: [{ t: "跟" }, { t: "毛衍七", pop: true }], at: 33.95, popZoom: 34.7 },
        ],
        note: "三押③：毛衍七；34.7s 起该词原地放大铺满画面后硬切黄场",
    },

    // ---------------- C 收尾 Hook（黄场，L26–L29，与开场同 2 拍节奏）----------------
    { i: 26, s: 36.0, rows: [{ spans: [{ t: "That's my" }], slam: true }], hookKey: "That's my", note: "回归黄场，同开场节奏" },
    { i: 27, s: 36.84, rows: [{ spans: [{ t: "That's my" }], slam: true }], hookKey: "That's my", note: "" },
    { i: 28, s: 37.69, rows: [{ spans: [{ t: "That's my" }], slam: true }], hookKey: "That's my", note: "" },
    { i: 29, s: 38.53, rows: [{ spans: [{ t: "That's my" }], slam: true }], hookKey: "That's my", note: "" },
];
