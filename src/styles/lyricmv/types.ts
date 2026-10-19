// 歌词行数据结构：一句 = 若干 part（行），每个 part 再拆 segs（分时点亮的词组）。
export type FxId = "slam" | "split" | "quad" | "stroke" | "crawl" | "chaos" | "stamp" | "shake" | "slash" | "focus" | "chrome";

export type Seg = {
    text: string;
    s: number;
    rhyme?: boolean;
    wind?: boolean; // 被风吹入
    box?: boolean; // 外面加押韵框
    tag?: string; // 框上的小标签（如「四押」）
    impact?: boolean; // 落地后回弹震动
};

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
