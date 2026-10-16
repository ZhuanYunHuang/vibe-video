// 《为了短视频》歌词时间轴（绝对秒）。
// 时间来源：175BPM / 首拍 0 帧的节拍网格 + 源视频内烧录字幕逐帧核对。
// 硬结论：每句歌词恰好 8 拍 = 2.7429s；主歌 1 基准 19.00s、主歌 2 基准 91.00s，两段独立验证误差 <0.2s。
export type LyricLine = {
    s: number; // 起始秒
    e: number; // 结束秒
    text: string;
    part: Hook | "v1" | "v2";
    kind?: "key"; // 重点行（HUD 加亮）
};

export type Hook = "h1" | "h2" | "h3";

// 每句时长（8 拍 @175BPM）
export const STEP = 2.7429;
// 主歌基准
export const V1_BASE = 19.0;
export const V2_BASE = 91.0;

// 关键锚点（场景卡点共用，秒）
export const T = {
    drumIn: 16.46, // 鼓组进入（拍 48）
    hook1L2: 10.0,
    hook1L3: 18.0,
    verse1: V1_BASE, // 「线上真得把人三观都给格式化」
    hook2: 71.32, // 副歌再现（鼓组撤离）
    judge: 87.77, // 审判模式启动 / 换色点（拍 256）
    verse2: V2_BASE, // 「造谣就应该枪毙」
    hook3: 137.15,
    outro: 160.0,
} as const;

const HOOK_TEXT = ["（为了短视频，没有什么不能做", "为了流量，没有什么不能做", "噢 ~ 噢~ 噢 )"];

const V1_TEXT = [
    "线上真得把人三观都给格式化",
    "线下假得像个蓝车牌的特斯拉",
    "为了短视频，没有什么不能做",
    "为了赞，为了评论，还有什么不能说",
    "请你二创吧，模仿我，分享我吧，收藏我",
    "问问金木水土，包这四位哥们都想火",
    "越反智越上热搜，比脏有谁能脏得过",
    "为拿到流量密码，给自己上了抽象的锁",
    "装傻比大坝和水电站，还更能引流",
    "像雅鲁藏布江，大家都想变成“顶流”",
    "用过期电子榨菜，制造的是焦点",
    "珠穆朗玛都得仰视，那些道德制高点",
    "线上再到线下，把人编码，兵不厌诈",
    "情绪是种货币，挑拨对立，像个电闸",
    "博尔特最多是 city walk，可算法 run the world，我的家人们",
    "礼物别刷得抠，我的家人们",
    "流量不是普通蛋糕，它是碗辣馄饨",
    "想吃这口饭，确保你胃比通天塔更深",
];

const V2_TEXT = [
    "造谣就应该枪毙",
    "煽动就应该鞭刑",
    "诱导就应该赔米",
    "营销号应该被活埋",
    "矩阵号都得加个税",
    "狗仔队等着被追尾",
    "搞水军包杨威",
    "为了短视频狐狸成精",
    "每次刷到条囹会硬",
    "为了短视频寻找复活币",
    "为了短视频社会倒退三叠纪",
    "那盘古要知道都懒得开天地",
    "开出一帮在网上拉稀",
    "你要感谢字节创造的就业机会",
    "让你赚到不属于你的钱",
    "还有新浪给你创造了一片草原",
    "发言",
];

// 逐句起止：段内按 STEP 均匀推进；每句结束 = 下一句起始（末句可用 endAt 单独覆盖，源视频实测有的末句会拖长）
const build = (texts: string[], base: number, part: LyricLine["part"], endAt?: number, keys: number[] = []): LyricLine[] =>
    texts.map((text, i) => ({
        s: +(base + i * STEP).toFixed(2),
        e: +(i === texts.length - 1 && endAt !== undefined ? endAt : base + (i + 1) * STEP).toFixed(2),
        text,
        part,
        ...(keys.includes(i) ? { kind: "key" as const } : {}),
    }));

// 副歌：三句分别占 7.8s / 8.0s / 1.0s（钩子句都拖得很长，由字幕帧实测）
const hooks = (part: Hook, base: number, l2: number, l3: number, end: number): LyricLine[] => [
    { s: base, e: l2, text: HOOK_TEXT[0], part },
    { s: l2, e: l3, text: HOOK_TEXT[1], part },
    { s: l3, e: end, text: HOOK_TEXT[2], part },
];

export const LYRICS: LyricLine[] = [
    ...hooks("h1", 2.2, 10.0, 18.0, V1_BASE),
    ...build(V1_TEXT, V1_BASE, "v1", 68.4, [0, 9, 14]),
    ...hooks("h2", T.hook2, 78.8, 88.2, V2_BASE),
    ...build(V2_TEXT, V2_BASE, "v2", 139.0, [0, 16]),
    ...hooks("h3", T.hook3, 147.2, 154.8, T.outro),
];

// 当前时刻的整句歌词（无歌词的间奏/尾奏返回 undefined）
export const activeLine = (sec: number): LyricLine | undefined => LYRICS.find((l) => sec >= l.s && sec < l.e);

// 取某段第 n 句（1 起）的起始秒，场景卡点用
export const at = (part: LyricLine["part"], n: number): number => {
    const list = LYRICS.filter((l) => l.part === part);
    const line = list[n - 1];
    return line ? line.s : 0;
};
