// 14 句的时间轴：s/e 为绝对秒，取自本地 Whisper 逐字转写后按句对齐。
// 每个 part 再拆成 segs：长句按气口分时段点亮，末尾带 rhyme 的词走韵脚爆破。
export type FxId = "slam" | "split" | "quad" | "stroke" | "crawl" | "chaos" | "stamp" | "shake" | "slash" | "focus" | "chrome";

export type Seg = { text: string; s: number; rhyme?: boolean };
export type Part = { text: string; s: number; segs: Seg[] };
export type LineTheme = "dark" | "red" | "white";

export type Line = {
    i: number;
    s: number;
    e: number;
    text: string;
    parts: Part[];
    fx: FxId;
    layout: "stack" | "quad";
    align: "left" | "center" | "right";
    theme: LineTheme;
    note: string;
};

export const BPM = 87.9;
export const BEAT_SEC = 60 / BPM;
export const TOTAL_BEATS = 64;

// 进鼓点：22.28s 低频冲击（-8.6dB → +46.7dB），落在「我快要」起唱处；之后全片转红白
export const DROP_SEC = 22.3;

const seg = (text: string, s: number, rhyme = false): Seg => ({ text, s, rhyme });
const part = (text: string, s: number, segs: Seg[]): Part => ({ text, s, segs });

export const LINES: Line[] = [
    {
        i: 1,
        s: 0.0,
        e: 2.58,
        text: "逐渐变成了万人敌 能力越大越讨人嫌",
        parts: [part("逐渐变成了万人敌", 0.0, [seg("逐渐变成了", 0.0), seg("万人敌", 0.78, true)]), part("能力越大越讨人嫌", 1.3, [seg("能力越大越", 1.3), seg("讨人嫌", 2.1, true)])],
        fx: "slam",
        layout: "stack",
        align: "center",
        theme: "dark",
        note: "开场砸字，韵脚万人敌/讨人嫌单独爆",
    },
    {
        i: 2,
        s: 2.58,
        e: 5.28,
        text: "想在我头上换人骑 那我天生就没有好人缘",
        parts: [part("想在我头上换人骑", 2.58, [seg("想在我头上", 2.58), seg("换人骑", 3.46, true)]), part("那我天生就没有好人缘", 3.94, [seg("那我天生就没有", 3.94), seg("好人缘", 4.64, true)])],
        fx: "split",
        layout: "stack",
        align: "right",
        theme: "dark",
        note: "右对齐色散，换人骑/好人缘落红块",
    },
    {
        i: 3,
        s: 5.28,
        e: 8.28,
        text: "受到压榨 构造瞎话 暗箱操作 仇恨加大",
        parts: [part("受到压榨", 5.28, [seg("受到压榨", 5.28)]), part("构造瞎话", 6.14, [seg("构造瞎话", 6.14)]), part("暗箱操作", 6.74, [seg("暗箱操作", 6.74)]), part("仇恨加大", 7.36, [seg("仇恨加大", 7.36)])],
        fx: "quad",
        layout: "quad",
        align: "center",
        theme: "dark",
        note: "四格轮播，每两拍换格高亮",
    },
    {
        i: 4,
        s: 8.28,
        e: 10.9,
        text: "But我不在乎 没人能够让我趴下",
        parts: [part("But我不在乎", 8.28, [seg("But", 8.28), seg("我不在乎", 8.5)]), part("没人能够让我趴下", 9.38, [seg("没人能够让我", 9.38), seg("趴下", 10.56, true)])],
        fx: "stroke",
        layout: "stack",
        align: "left",
        theme: "dark",
        note: "空心到填色，趴下落红块",
    },
    {
        i: 5,
        s: 10.9,
        e: 14.2,
        text: "是因为话不说透 差不多就 观望着身边的行尸走肉",
        parts: [
            part("是因为话不说透", 10.9, [seg("是因为话", 10.9), seg("不说透", 11.4, true)]),
            part("差不多就", 12.06, [seg("差不多就", 12.06)]),
            part("观望着身边的行尸走肉", 12.52, [seg("观望着身边的", 12.52), seg("行尸走肉", 13.62, true)]),
        ],
        fx: "crawl",
        layout: "stack",
        align: "left",
        theme: "dark",
        note: "打字机爬出，行尸走肉爆韵",
    },
    {
        i: 6,
        s: 14.2,
        e: 17.18,
        text: "能力不够 成绩如旧 绞尽脑汁也没悟透的flow",
        parts: [part("能力不够", 14.2, [seg("能力不够", 14.2)]), part("成绩如旧", 14.72, [seg("成绩如旧", 14.72)]), part("绞尽脑汁也没悟透的 flow", 15.68, [seg("绞尽脑汁", 15.68), seg("也没悟透的", 16.3), seg(" flow", 16.94, true)])],
        fx: "chaos",
        layout: "stack",
        align: "right",
        theme: "dark",
        note: "散字收拢，flow 爆韵",
    },
    {
        i: 7,
        s: 17.18,
        e: 19.96,
        text: "你不看好我的show 也能震撼你的soul",
        parts: [part("你不看好我的 show", 17.18, [seg("你不看好我的", 17.18), seg(" show", 18.2, true)]), part("也能震撼你的 soul", 18.5, [seg("也能震撼你的", 18.5), seg(" soul", 19.48, true)])],
        fx: "split",
        layout: "stack",
        align: "center",
        theme: "dark",
        note: "show/soul 双押，各自爆一次",
    },
    {
        i: 8,
        s: 19.96,
        e: 22.3,
        text: "和那些只说不做的 Thank you",
        parts: [part("和那些只说不做的", 19.96, [seg("和那些只说不做的", 19.96)]), part("Thank you", 21.18, [seg("Thank you", 21.18)])],
        fx: "stamp",
        layout: "stack",
        align: "center",
        theme: "dark",
        note: "Thank you 留在黑场，进鼓点在下一句",
    },
    {
        i: 9,
        s: 22.3,
        e: 26.54,
        text: "我快要歇斯底里 坚持有什么意义 像猜不透的谜语",
        parts: [
            part("我快要", 22.3, [seg("我快要", 22.3)]),
            part("歇斯底里", 22.84, [seg("歇斯底里", 22.84)]),
            part("坚持有什么意义", 23.8, [seg("坚持", 23.8), seg("有什么意义", 24.2)]),
            part("像猜不透的谜语", 24.96, [seg("像猜不透的", 24.96), seg("谜语", 26.14, true)]),
        ],
        fx: "shake",
        layout: "stack",
        align: "center",
        theme: "red",
        note: "红底四连跳，谜语爆韵",
    },
    {
        i: 10,
        s: 26.54,
        e: 30.04,
        text: "用尽了钱和积蓄 他们都像zombie 满脑子里只有攻击",
        parts: [
            part("用尽了钱和积蓄", 26.54, [seg("用尽了", 26.54), seg("钱和积蓄", 26.96)]),
            part("他们都像 zombie", 27.62, [seg("他们都像", 27.62), seg(" zombie", 28.32, true)]),
            part("满脑子里只有攻击", 28.88, [seg("满脑子里", 28.88), seg("只有攻击", 29.34, true)]),
        ],
        fx: "chaos",
        layout: "stack",
        align: "left",
        theme: "white",
        note: "白底红字，zombie/攻击双爆",
    },
    {
        i: 11,
        s: 30.04,
        e: 33.14,
        text: "这圈子没有兄弟 没人会懂你 只会拿刀捅你",
        parts: [
            part("这圈子没有兄弟", 30.04, [seg("这圈子", 30.04), seg("没有兄弟", 30.54, true)]),
            part("没人会懂你", 31.3, [seg("没人会", 31.3), seg("懂你", 31.74, true)]),
            part("只会拿刀捅你", 32.12, [seg("只会拿刀", 32.12), seg("捅你", 32.74, true)]),
        ],
        fx: "slash",
        layout: "stack",
        align: "right",
        theme: "red",
        note: "红底斜切，三个你字连爆",
    },
    {
        i: 12,
        s: 33.14,
        e: 36.3,
        text: "我已深深的满足 有经历就感触",
        parts: [part("我已深深的满足", 33.14, [seg("我已深深的", 33.14), seg("满足", 33.96, true)]), part("有经历就感触", 34.7, [seg("有经历", 34.7), seg("就感触", 35.46, true)])],
        fx: "focus",
        layout: "stack",
        align: "center",
        theme: "white",
        note: "白底留白，字号收小",
    },
    {
        i: 13,
        s: 36.3,
        e: 39.5,
        text: "Shout to S1 和红花会给他们我的满足",
        parts: [part("Shout to S1", 36.3, [seg("Shout to", 36.3), seg(" S1", 36.58)]), part("和红花会给他们我的满足", 37.02, [seg("和红花会", 37.02), seg("给他们我的", 37.56), seg("满足", 38.48, true)])],
        fx: "chrome",
        layout: "stack",
        align: "center",
        theme: "red",
        note: "红底铬字，致敬段落",
    },
    {
        i: 14,
        s: 39.5,
        e: 43.7,
        text: "敢让你再不敢说 让他们知道今天晚上到底谁对",
        parts: [
            part("敢让你再不敢说", 39.5, [seg("敢让你", 39.5), seg("再不敢说", 39.88, true)]),
            part("让他们知道", 40.64, [seg("让他们", 40.64), seg("知道", 41.2)]),
            part("今天晚上到底谁对", 41.5, [seg("今天晚上", 41.5), seg("到底谁对", 42.16, true)]),
        ],
        fx: "slam",
        layout: "stack",
        align: "center",
        theme: "red",
        note: "红底三连砸，谁对收尾",
    },
];
