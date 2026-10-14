import { useAt } from "../../../shared";

// 《心流状态》专属配色：「深潜水流」——深墨绿水底 + 薄荷水光 + 珊瑚暖点缀
export const P = {
  bg: "#041F1B", // 深墨绿黑（整片底色）
  bg2: "#0A352C", // 水光辅助底
  abyss: "#02150F", // 最深处
  mint: "#5FE8C0", // 主强调：水光薄荷
  coral: "#FF9E6E", // 副强调：暖珊瑚（焦虑 / 警示）
  gold: "#FFCE7A", // 点缀：沙金（数字 / 关键词）
  ink: "#EAFBF4", // 主文字：雾白
  sub: "#8FB8AC", // 弱文字：水雾灰绿
  line: "#1B5A4C", // 描边 / 分隔线
  glass: "#0F4A3D99", // 玻璃卡底（半透明水色）
};

// 用「全片绝对拍号」取场景内帧：K(48) 就是第 48 拍，直接对照 spec 里的落点表
export const useK = (start: number) => {
  const at = useAt();
  return (beat: number) => at(start, beat - start);
};

// 文字水光发光
export const glow = (color: string, r = 1) => `0 0 ${8 * r}px ${color}aa, 0 0 ${26 * r}px ${color}55`;
