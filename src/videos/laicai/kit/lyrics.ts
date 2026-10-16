// 《专升本 来财》歌词时间轴（绝对秒）。
// 前段（0-74.7s）= shengben 原曲段落，时间由 onset 检测 + 逐句核对得出（与原表有 ±0.5s 级偏移，已按新混音校准）；
// 后段（82.9s 起）= 揽佬《八方来财》，时间由本地 whisper 转写 + 起音点对齐得出（±0.3s）。
// kind: punch = 重拍炸裂字（场景巨字承担，HUD 不重复）；punchline = 全曲笑点；key = 重点突出行（来财 来）。
export type LyricLine = {
    s: number;
    e: number;
    text: string;
    who: "dude" | "lanlao";
    adlib?: string; // 小注记（（我挂）（拜）等）
    kind?: "punch" | "punchline" | "key";
};

// 关键锚点（场景共用，秒）
export const T = {
    lanlaoTag: 2.05, // 「揽佬」tag → 揽佬人物弹出（需求④）
    zhuan: 4.42, // 重拍①「专」（需求①，爆金币）
    kuang: 20.03, // 重拍②「狂」（需求②，爆金币）
    laicaiTease: 24.93, // 「来财 来」重点突出（需求③）
    ai: 27.83, // 重拍③「唉」
    genshin: 49.6, // punchline「学英语我用的原神的英文版」（需求⑥，手机亮屏）
    handoff: 75.3, // shengben 段结束 → 递麦交接（75.3-82.9 间奏）
    verse1: 82.9, // 八方来财 主歌起「我们这的憋佬仔」
    hook: 98.5, // 「来财 来」chant 起
    verse2: 106.3, // 「宗旨利滚利」
    verse3: 114.6, // 「这一把直接合」
    finale: 137.6, // 「若上颁奖台切莫」
} as const;

const D = "dude" as const;
const L = "lanlao" as const;

export const LYRICS: LyricLine[] = [
    // ———— 前段 · 专升本（天选之子） ————
    { s: 0.0, e: 2.4, text: "我 我考上了大专", who: D },
    { s: 2.45, e: 2.95, text: "", who: L, adlib: "揽佬" },
    { s: 2.4, e: 3.7, text: "我能专升本", who: D },
    { s: 3.8, e: 4.35, text: "你不能本升", who: D },
    { s: 4.42, e: 4.9, text: "专", who: D, kind: "punch" },
    { s: 6.2, e: 8.3, text: "但是呢我现在专升本上岸了", who: D },
    { s: 9.6, e: 12.3, text: "大专的同学我早就删掉了", who: D },
    { s: 14.0, e: 16.1, text: "专是专 本是本 我们间隔着墙", who: D },
    { s: 17.4, e: 18.6, text: "告诉你一个字", who: D },
    { s: 19.95, e: 20.4, text: "狂", who: D, kind: "punch" },
    { s: 20.45, e: 22.25, text: "别…别用那种眼神看着我", who: D },
    { s: 22.3, e: 24.4, text: "你叫本科生来 来", who: D },
    { s: 24.45, e: 25.55, text: "来财 来", who: L, kind: "key" },
    { s: 25.55, e: 27.7, text: "本科生看见我第一个字", who: D },
    { s: 27.75, e: 28.15, text: "唉", who: D, kind: "punch" },
    { s: 28.1, e: 29.7, text: "我们呢亲的像兄弟", who: D },
    { s: 29.7, e: 31.5, text: "裤兜的纸巾是一个品牌", who: D },
    { s: 32.5, e: 34.0, text: "你记住本是同根生", who: D },
    { s: 34.1, e: 35.5, text: "专你就给我滚开", who: D },
    { s: 35.9, e: 37.5, text: "其实呢没关系啊", who: D },
    { s: 37.5, e: 39.9, text: "好的本科他不会比专科生差", who: D },
    { s: 41.4, e: 42.6, text: "学好了数理化", who: D },
    { s: 42.7, e: 43.8, text: "走天下都不怕", who: D },
    { s: 44.8, e: 47.4, text: "26个字母现在学其实呢也不晚", who: D },
    { s: 48.2, e: 49.6, text: "告诉你个秘密", who: D },
    { s: 49.6, e: 51.3, text: "学英语我用的原神的英文版", who: D, kind: "punchline" },
    { s: 51.25, e: 52.95, text: "专升本上岸", who: D },
    { s: 53.06, e: 54.5, text: "抱歉我要去下一站", who: D },
    { s: 54.53, e: 56.13, text: "我要去本科生的", who: D },
    { s: 56.57, e: 58.52, text: "图书馆到处的看一看", who: D },
    { s: 58.81, e: 59.75, text: "大专的同学", who: D },
    { s: 59.8, e: 61.0, text: "你现在看见了吗", who: D },
    { s: 61.0, e: 62.7, text: "我专升本上岸了", who: D },
    { s: 63.2, e: 64.8, text: "我专升本是整个", who: D },
    { s: 64.8, e: 66.8, text: "你专升本是半个", who: D },
    { s: 67.9, e: 69.1, text: "撒西不理达纳", who: D },
    { s: 69.7, e: 70.6, text: "汽修二班", who: D },
    { s: 71.7, e: 74.7, text: "我现在可是专升本上岸了呢", who: D },
    // （74.7 - 82.9 间奏：递麦交接）
    // ———— 后段 · 八方来财（揽佬） ————
    { s: 82.9, e: 84.4, text: "我们这的憋佬仔", who: L },
    { s: 84.4, e: 86.3, text: "脖上喜欢挂玉牌", who: L, adlib: "我挂" },
    { s: 86.8, e: 88.3, text: "香炉供台上摆", who: L },
    { s: 88.3, e: 90.2, text: "长大才开白黄牌", who: L },
    { s: 90.7, e: 92.1, text: "虔诚拜三拜", who: L, adlib: "拜" },
    { s: 92.7, e: 94.0, text: "钱包里多几百", who: L, adlib: "揽佬" },
    { s: 94.7, e: 96.0, text: "易的是六合彩", who: L, adlib: "嗯" },
    { s: 96.6, e: 98.0, text: "难的是等河牌", who: L },
    { s: 98.5, e: 100.4, text: "来财 来", who: L, kind: "key" },
    { s: 100.5, e: 102.4, text: "来财 来", who: L, kind: "key" },
    { s: 102.4, e: 104.4, text: "来财 来", who: L, kind: "key" },
    { s: 104.4, e: 106.3, text: "来财 来", who: L, kind: "key" },
    { s: 106.3, e: 107.7, text: "宗旨利滚利", who: L },
    { s: 107.8, e: 109.3, text: "对应好运八方来", who: L },
    { s: 110.2, e: 111.6, text: "散了才能聚", who: L },
    { s: 111.7, e: 113.6, text: "你不出手 说聊斋", who: L, adlib: "揽佬" },
    { s: 114.6, e: 116.1, text: "这一把直接合", who: L },
    { s: 116.3, e: 117.9, text: "因为我花钱交朋友", who: L, adlib: "哼" },
    { s: 118.3, e: 119.9, text: "艺高人胆大", who: L },
    { s: 120.2, e: 121.7, text: "揽佬小盲三条九", who: L },
    { s: 122.2, e: 123.8, text: "回馈一下社会先", who: L },
    { s: 124.1, e: 125.7, text: "摸到那顶皇冠后", who: L, adlib: "后" },
    { s: 126.1, e: 127.7, text: "找你做事人太多", who: L },
    { s: 128.0, e: 129.6, text: "事情两袖清风做", who: L },
    { s: 129.7, e: 131.6, text: "一阴一阳之谓道", who: L },
    { s: 131.6, e: 133.1, text: "紫气东来", who: L },
    { s: 133.7, e: 135.5, text: "明码标价的那些物", who: L },
    { s: 135.5, e: 137.0, text: "非黑即白", who: L },
    { s: 137.6, e: 139.4, text: "若上颁奖台切莫", who: L },
    { s: 139.5, e: 140.9, text: "张灯结彩", who: L, adlib: "结彩" },
    { s: 141.5, e: 142.9, text: "八仙桌的收尾", who: L },
    { s: 142.9, e: 144.3, text: "少不了蕹菜", who: L },
];

// 对当前时刻生效的主歌词行（跳过 punch 与小注记行）
export const activeLine = (sec: number): LyricLine | undefined => LYRICS.find((l) => sec >= l.s && sec < l.e && l.kind !== "punch" && l.text !== "");
