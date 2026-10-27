// 与 scripts/make-beat.mjs 同源：90 BPM / 64 小节 @ 4 拍 / F minor
// 分场拍号 = 小节 × 4：0 / 32 / 64 / 128 / 160 / 224 / 256
export const BPM = 90;
export const OFFSET = 0;
export const TOTAL_BEATS = 256;
export const TRANS_FRAMES = 4;
export const TAIL_FRAMES = 45;
export const BARS = 64;

export const INTRO_END = 32; // 0–7 小节：808 + pad
export const BUILD_END = 64; // 8–15 小节：鼓组逐层进场
export const VERSE1_END = 128; // 16–31 小节：RAP 段一
export const HOOK_END = 160; // 32–39 小节：HOOK
export const VERSE2_END = 224; // 40–55 小节：RAP 段二
// 224–256 为 outro

export const SECTIONS = [
    { label: "INTRO", from: 0, to: INTRO_END, note: "808 + pad" },
    { label: "BUILD", from: INTRO_END, to: BUILD_END, note: "鼓组进场" },
    { label: "VERSE 1", from: BUILD_END, to: VERSE1_END, note: "RAP" },
    { label: "HOOK", from: VERSE1_END, to: HOOK_END, note: "拨弦 lead" },
    { label: "VERSE 2", from: HOOK_END, to: VERSE2_END, note: "RAP" },
    { label: "OUTRO", from: VERSE2_END, to: TOTAL_BEATS, note: "收束" },
];

export const CHORDS = [
    { name: "Fm", tones: [53, 56, 60, 63] },
    { name: "D♭", tones: [49, 53, 56, 60] },
    { name: "A♭", tones: [56, 60, 63, 67] },
    { name: "E♭", tones: [51, 55, 58, 62] },
];

// 拨弦动机：[16 分步, 和弦音索引, 八度, 时值]
export const PLUCK_MOTIF = [
    { step: 0, idx: 0, oct: 0, len: 2 },
    { step: 3, idx: 2, oct: 0, len: 2 },
    { step: 6, idx: 1, oct: 0, len: 2 },
    { step: 10, idx: 3, oct: 1, len: 3 },
    { step: 14, idx: 2, oct: 0, len: 1 },
];
