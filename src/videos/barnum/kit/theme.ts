import { useAt } from "../../../shared";

// 《算命，为什么这么准？》专属配色：「宣纸朱砂·古籍批注风」
// 米黄陈年宣纸底 + 墨色文字 + 朱砂印章/红笔批注 + 泥金点缀 + 花青副色
export const P = {
    xuan: "#F4EBD9", // 宣纸底：米黄陈年宣纸（浅档 scene bg / spec.bg）
    chen: "#E7DBC2", // 陈纸：做旧深一档（深档 scene bg，与 xuan 轮换出章节节奏）
    card: "#FBF5E8", // 纸卡面：引文卡 / 字幕条 / 牌面 / 手机屏
    ink: "#2E2A24", // 墨色：主文字 / 线描 / 章框
    inkLight: "#756A5B", // 淡墨：次要文字 / 副标题
    fiber: "#D9CBAE", // 纸筋线：肌理纤维 / 分隔线
    cinnabar: "#C0392B", // 朱砂：印章边 / 红笔圈注 / 强调
    cinnabarDeep: "#8E2A20", // 深朱砂：进度条深端
    sealPaste: "#A93428", // 印泥：印章填充主色（红底白文）
    gold: "#B9975B", // 泥金：关键词 / 星点
    huaqing: "#4A6B7C", // 花青：副色（星盘 / 牌背花纹等冷色线描）
};

// 标题 / 古籍感字体（渲染机为 Windows 本机 Chrome，自带楷体；Mac 兜底 STKaiti）
export const KAI = '"STKaiti", "Kaiti SC", "KaiTi", "SimSun", serif';

// 用「全片绝对拍号」取场景内帧：K(48) 就是第 48 拍，直接对照 spec 里的落点表
export const useK = (start: number) => {
    const at = useAt();
    return (beat: number) => at(start, beat - start);
};
