// 《嘻哈魂》杨和苏 verse（37.7s）逐句时间轴。
// 时间来源：本地 Whisper 逐字转写（word timestamps）实测秒数，再用 82 BPM 的拍网格校正。
//   BPM 82（60/82 = 0.7317s/拍），首拍 0.05s；但 spec 用 offset=0，故「帧 = 秒 × 30、拍号 = 秒 × 1.3667」。
//   大卡点落点（16 拍）：0△ / 16△ / 32△ / 48△（本曲 4 小节边界抬升仅 0.52，不靠换场做重卡，改用逐句硬切 + 卡点震动）
//   实测锚点（秒）：L1 0.48 / L9 8.36 / L14 14.62（深灰→中灰）/ L26 24.10 / L27 25.30（中灰→浅灰白场）/ L38 36.40（收官）

export const BPM = 82;
export const OFFSET = 0;
export const TOTAL_BEATS = 51;
export const TRANS_FRAMES = 1;
export const TAIL_FRAMES = 24;
export const LABEL = "嘻哈魂 · 杨和苏";

// 三段灰阶的场景边界（拍号；帧 = bf(拍) = 拍 × 21.95）
export const DEEP_START = 0; // 0.00s
export const MID_START = 20; // 14.63s（L14 起，深灰→中灰）
export const LIGHT_START = 34.58; // 25.30s（L27 起，中灰→浅灰白场）
// 分场按「秒」切（更稳，不受行号变动影响）
export const MID_SEC = 14.62; // L14 起唱秒
export const LIGHT_SEC = 25.3; // L27 起唱秒

const beatSec = 60 / BPM;
// 深灰场：每 2 拍一次卡点震动（拍 1,3,…,19），强拍 11 加重
export const DEEP_SHAKES: { sec: number; amp: number }[] = Array.from({ length: 10 }, (_, i) => 1 + i * 2).map((b) => ({
    sec: b * beatSec,
    amp: b === 11 ? 1.6 : b % 4 === 3 ? 1.15 : 0.9,
}));
// 中灰场：按 Whisper 实测起唱秒对齐的逐句落点卡点（16.9 / 18.3 为节拍分析实测强拍）
export const MID_SHAKES: { sec: number; amp: number }[] = [
    { sec: 16.9, amp: 1.2 },
    { sec: 17.68, amp: 1.3 },
    { sec: 18.3, amp: 1.5 },
    { sec: 18.8, amp: 1.25 },
    { sec: 19.36, amp: 1.3 },
    { sec: 19.92, amp: 1.3 },
    { sec: 21.2, amp: 1.35 },
    { sec: 22.28, amp: 1.25 },
    { sec: 23.6, amp: 1.35 },
];

// 一个字 = 一个 span；pop = 整体弹出（重点词 / 韵脚块），否则逐字显示
export type Span = { t: string; pop?: boolean };
// outline 透明描边｜word 逐词｜letter 逐字母｜stairs 爬楼梯+皇冠｜apart 后段飞出
// slideIn 逐字从左滑入｜slideOut 同时出现再逐字向左滑出｜sink 向下聚拢退场｜expand 从下往上扩张进场
// pierce 斜向穿透｜split 被穿透时左右分开（让出中间给穿透词）
export type RowFx = "outline" | "word" | "letter" | "stairs" | "apart" | "slideIn" | "slideOut" | "sink" | "expand" | "pierce" | "split";
export type Row = { spans: Span[]; slam?: boolean; at?: number; fx?: RowFx; popZoom?: number; pair?: number; dur?: number };
export type LyricLine = {
    i: number;
    s: number; // 起唱秒
    rows: Row[];
    wave?: boolean; // 波浪震动
    size?: number; // 覆盖自动字号（独立一幕的大字用）
    impact?: number; // 该秒触发强烈卡点（冲击波 + 强震）
    note: string;
};

const one = (t: string, extra?: Partial<Row>): Row => ({ spans: [{ t }], at: undefined, ...extra });

export const LYRICS: LyricLine[] = [
    // ---------------- A 深灰场（L1–L13）----------------
    // L1 拆两拍：「Bow down to the」逐词出现；「KeyNG」单独一幕、逐字母出场
    { i: 1, s: 0.48, rows: [{ spans: [{ t: "Bow down to the" }], at: 0.48, fx: "word" }], note: "逐词出场" },
    { i: 1, s: 1.88, rows: [{ spans: [{ t: "KeyNG" }], at: 1.88, fx: "letter" }], size: 300, note: "单独一幕：KeyNG 逐字母出场" },
    { i: 2, s: 2.88, rows: [one("代表 WalkingDead", { at: 2.88 })], note: "" },
    // L3+L4 一幕两行：逐字从左边滑入（按卡点错峰）
    {
        i: 3,
        s: 4.02,
        rows: [
            { spans: [{ t: "带我兄弟" }], at: 4.02, fx: "slideIn" },
            { spans: [{ t: "冲进这游戏" }], at: 4.62, fx: "slideIn" },
        ],
        note: "一幕两行：逐字从左滑入",
    },
    // L5+L6 一幕两行：同时出现，随后逐字向左边滑出（与上句左右相反）
    {
        i: 5,
        s: 5.5,
        rows: [
            { spans: [{ t: "拿走我们" }], at: 5.5, dur: 1.5, fx: "slideOut" },
            { spans: [{ t: "早应该拿走的" }], at: 5.5, dur: 1.5, fx: "slideOut" },
        ],
        note: "一幕两行：同时出现 + 逐字向左滑出",
    },
    // L7 向下聚拢退场 → L8 从下往上扩张进场（上下相反的对称对）
    { i: 7, s: 7.02, rows: [{ spans: [{ t: "把钱和名誉" }], at: 7.02, fx: "sink" }], note: "向下聚拢退场" },
    { i: 8, s: 7.8, rows: [{ spans: [{ t: "装进兜里" }], at: 7.8, fx: "expand" }], note: "从下往上扩张进场" },
    { i: 9, s: 8.36, rows: [{ spans: [{ t: "You know the name" }, { t: "KeyNG", pop: true }], at: 8.36 }], note: "重点：KeyNG" },
    { i: 10, s: 10.02, rows: [one("求你们别再放口气", { at: 10.02 })], note: "" },
    { i: 11, s: 11.18, rows: [{ spans: [{ t: "用战斗力" }], at: 11.18, dur: 0.75, fx: "split" }, { spans: [{ t: "穿透你" }], at: 11.73, fx: "pierce" }], note: "先出「用战斗力」，「穿透你」从左下斜着往右上穿透它（穿过瞬间把「用战斗力」分开，避免字压字）" },
    { i: 12, s: 12.3, rows: [one("Now 喘口气", { at: 12.3, fx: "outline" })], note: "悄悄音：透明字 + 灰描边" },
    { i: 13, s: 13.72, rows: [{ spans: [{ t: "Listen to me" }], slam: true, at: 13.72 }], size: 220, impact: 13.72, note: "强调：大字砸入 + 卡点" },

    // ---------------- B 中灰场（L14–L26）----------------
    // L14–L16 是全段 punchline：强烈卡点转场（冲击波 + 强震）+ 逐句砸入
    { i: 14, s: 14.62, rows: [{ spans: [{ t: "他们一看到我就紧张" }], slam: true, at: 14.62 }], impact: 14.62, note: "punchline 起点：强烈卡点转场 + 震动" },
    { i: 15, s: 15.66, rows: [{ spans: [{ t: "就像女孩子" }], slam: true, at: 15.66 }], impact: 15.66, note: "punchline 连击" },
    { i: 16, s: 16.08, rows: [{ spans: [{ t: "看到了新郎官" }], slam: true, at: 16.08 }], impact: 16.08, note: "punchline 收尾重击" },
    { i: 17, s: 17.18, rows: [one("他们有苦", { at: 17.18 })], note: "" },
    { i: 18, s: 17.74, rows: [one("说不出的样子", { at: 17.74 })], note: "" },
    { i: 19, s: 18.34, rows: [one("多无助", { at: 18.34, fx: "outline" })], note: "outline：无助的虚" },
    { i: 20, s: 18.78, rows: [one("但在嘴上面", { at: 18.78 })], note: "" },
    { i: 21, s: 19.36, rows: [{ spans: [{ t: "又经常" }, { t: "酸", pop: true }], at: 19.36 }], note: "实测起唱 19.36s" },
    { i: 22, s: 19.92, rows: [{ spans: [{ t: "别来跟我" }, { t: "碰", pop: true }], slam: true, at: 19.92 }], wave: true, note: "实测起唱 19.92s；卡点重句：碰（波浪震动）" },
    { i: 23, s: 21.2, rows: [{ spans: [{ t: "我怕你" }, { t: "痛", pop: true }], slam: true, at: 21.2 }], note: "实测起唱 21.2s；痛" },
    { i: 24, s: 22.28, rows: [one("带我兄弟向上冲锋", { at: 22.28 })], note: "" },
    { i: 25, s: 23.6, rows: [one("往死里弄", { at: 23.6 })], note: "实测起唱 23.6s" },
    { i: 26, s: 24.1, rows: [{ spans: [{ t: "Vroom Vroom" }], slam: true, at: 24.1 }], size: 230, impact: 24.1, note: "强调：大字 + 引擎震动（冲击波）" },

    // ---------------- C 浅灰场（L27–L38）----------------
    {
        i: 27,
        s: 25.3,
        // 爬楼梯：左下→右上逐字升高，「宝座」两字同组同时出现并持平，头顶皇冠
        rows: [{ spans: [{ t: "登上冠军的宝座" }], at: 25.3, fx: "stairs", pair: 5 }],
        note: "爬楼梯逐字 + 宝座持平 + 皇冠",
    },
    { i: 28, s: 27.74, rows: [one("这个位置不好坐", { at: 27.74 })], note: "" },
    { i: 29, s: 28.92, rows: [one("但你们实在是", { at: 28.92 })], note: "" },
    {
        i: 30,
        s: 29.75,
        // 先出「和我差得」，再出「太远了」，随后「太远了」向外飞走 → 表示差得太远
        rows: [{ spans: [{ t: "和我差得" }, { t: "太远了" }], at: 29.75, fx: "apart" }],
        note: "分隔：太远了飞走",
    },
    { i: 31, s: 30.66, rows: [one("我先走了", { at: 30.66 })], note: "" },
    { i: 32, s: 31.5, rows: [one("来不及说再见了", { at: 31.5 })], note: "" },
    { i: 33, s: 32.04, rows: [one("What", { at: 32.04, slam: true })], note: "单字砸入" },
    // L34+L35 / L36+L37 各成一幕两行，先后逐句出现
    {
        i: 34,
        s: 33.54,
        rows: [
            { spans: [{ t: "没有东风" }], at: 33.54 },
            { spans: [{ t: "没有" }, { t: "luck", pop: true }], at: 34.2 },
        ],
        note: "一幕两行：先后逐句出现",
    },
    {
        i: 36,
        s: 34.94,
        rows: [
            { spans: [{ t: "只有执着" }], at: 34.94 },
            { spans: [{ t: "只有" }, { t: "love", pop: true }], at: 35.55 },
        ],
        note: "一幕两行：先后逐句出现",
    },
    { i: 38, s: 36.4, rows: [one("老子才是", { at: 36.4 })], note: "先出「老子才是」" },
    // RapStar 单独一幕：大字砸入 + 冲击波强震，随后定格收尾
    {
        i: 39,
        s: 37.2,
        rows: [{ spans: [{ t: "RapStar" }], slam: true, at: 37.2 }],
        size: 300,
        impact: 37.2,
        note: "RapStar 单独一幕强调（大字 + 冲击波 + 强震）后定格收尾",
    },
];
