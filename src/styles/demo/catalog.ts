import type React from "react";
import type { StyleKit } from "../contract";
import { kit as bauhaus } from "../bauhaus";
import { kit as collage } from "../collage";
import { kit as cyberhud } from "../cyberhud";
import { kit as datainfo } from "../datainfo";
import { kit as explode } from "../explode";
import { kit as flat } from "../flat";
import { kit as hanzi } from "../hanzi";
import { kit as mathviz } from "../mathviz";
import { kit as picturebook } from "../picturebook";
import { kit as pixel } from "../pixel";
import { kit as scale } from "../scale";
import { kit as shadowpuppet } from "../shadowpuppet";
import { kit as synthwave } from "../synthwave";
import { kit as variety } from "../variety";
import { kit as whiteboard } from "../whiteboard";

// 风格目录：name/tag 单一数据源（Gallery 瓦片 + 封面渲染 + 预览索引共用）。
// 顺序 = README 状态总表 = 封面编号 01~15 的依据（注意与 DEMO_SPECS 顺序不同）。
export type StyleCatalogEntry = { id: string; kit: StyleKit; name: string; tag: string };

export const STYLE_CATALOG: StyleCatalogEntry[] = [
    { id: "whiteboard", kit: whiteboard, name: "白板手绘", tag: "马克笔当场画懂" },
    { id: "pixel", kit: pixel, name: "像素风", tag: "8-bit 复古硬核" },
    { id: "flat", kit: flat, name: "扁平 MG", tag: "现代弹性动效" },
    { id: "shadowpuppet", kit: shadowpuppet, name: "皮影戏", tag: "幕布剪影 · 关节动作" },
    { id: "cyberhud", kit: cyberhud, name: "赛博 HUD", tag: "霓虹扫描 · 数据流" },
    { id: "datainfo", kit: datainfo, name: "数据信息图", tag: "等宽大数字讲数据" },
    { id: "collage", kit: collage, name: "拼贴", tag: "撕纸拼贴 · 观点输出" },
    { id: "bauhaus", kit: bauhaus, name: "Bauhaus", tag: "三原色几何构成" },
    { id: "synthwave", kit: synthwave, name: "Synthwave", tag: "80s 落日霓虹" },
    { id: "explode", kit: explode, name: "3D 拆解", tag: "影棚爆炸图 · 分层悬浮" },
    { id: "hanzi", kit: hanzi, name: "汉字演变", tag: "火光铸刻 · 字形演化" },
    { id: "variety", kit: variety, name: "综艺花字", tag: "逐字弹跳 · 粗描边" },
    { id: "picturebook", kit: picturebook, name: "绘本科画", tag: "钢笔线稿 · 蜡笔涂色" },
    { id: "mathviz", kit: mathviz, name: "数学可视化", tag: "干净几何 · 公式浮现" },
    { id: "scale", kit: scale, name: "比例尺对比", tag: "同屏缩放 · 镜头拉远" },
];

// 风格封面组件：用每套自己的 makeCover 生成（风格名 + 一句话定位 + 两位编号），在 Root 注册为 StyleCover-<id> Still
export const STYLE_COVERS: { id: string; Comp: React.FC }[] = STYLE_CATALOG.map((e, i) => ({
    id: `StyleCover-${e.id}`,
    Comp: e.kit.makeCover({ title: e.name, subtitle: e.tag, badge: String(i + 1).padStart(2, "0") }),
}));
