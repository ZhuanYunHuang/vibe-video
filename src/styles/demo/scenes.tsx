import React from "react";
import { SceneProps, useT } from "../../shared";
import type { StyleKit } from "../contract";

// 三幕示范脚本：同一段文案分别用不同风格包渲染，验证「换 kit 即换风格」的契约可用性。
// 每一幕通过闭包注入 kit，内部只使用契约组件，不 import 任何具体风格。

// 第一幕 · 开场：章节 + 大字标题 + 字幕 + 角章
export const makeTitleScene = (kit: StyleKit): React.FC<SceneProps> => {
    const Comp: React.FC<SceneProps> = ({ start }) => {
        const t = useT();
        const K = kit.useK(start);
        return (
            <kit.Stage t={t}>
                <kit.Chapter t={t} step="样" title="同一段脚本" />
                <kit.Slam t={t} from={K(2)} x={960} y={480} size={120}>
                    风格演示
                </kit.Slam>
                <kit.Sub t={t} from={K(1)} to={K(8)}>
                    换一套组件包，换一种气质
                </kit.Sub>
                <kit.Stamp t={t} from={K(6)} x={1660} y={230} text="三连" size={108} rot={-6} />
            </kit.Stage>
        );
    };
    Comp.displayName = `DemoTitle-${kit.id}`;
    return Comp;
};

// 第二幕 · 卡片：两张纸卡 + 红笔式标注 + 字幕
export const makeCardScene = (kit: StyleKit): React.FC<SceneProps> => {
    const Comp: React.FC<SceneProps> = ({ start }) => {
        const t = useT();
        const K = kit.useK(start);
        return (
            <kit.Stage t={t}>
                <kit.Card t={t} x={620} y={520} w={640} h={340} appear={t >= K(9) ? 1 : 0}>
                    <div style={{ fontFamily: kit.fonts.FONT, fontSize: 52, fontWeight: 700, color: kit.P.ink }}>同一段文案</div>
                    <div style={{ fontFamily: kit.fonts.FONT, fontSize: 32, color: kit.P.inkSub, marginTop: 18 }}>场景代码一行不改</div>
                </kit.Card>
                <kit.Card t={t} x={1320} y={520} w={640} h={340} appear={t >= K(11) ? 1 : 0} lit={0.4}>
                    <div style={{ fontFamily: kit.fonts.FONT, fontSize: 52, fontWeight: 700, color: kit.P.ink }}>换一行 import</div>
                    <div style={{ fontFamily: kit.fonts.FONT, fontSize: 32, color: kit.P.inkSub, marginTop: 18 }}>气质立刻不同</div>
                </kit.Card>
                <kit.Mark t={t} from={K(13)} x={620} y={520} w={700} h={400} note="就这" />
                <kit.Mark t={t} from={K(14)} x={1320} y={700} w={460} h={30} underline />
                <kit.Sub t={t} from={K(9)} to={K(16)}>
                    组件契约：同名同签名，跨风格复用
                </kit.Sub>
            </kit.Stage>
        );
    };
    Comp.displayName = `DemoCard-${kit.id}`;
    return Comp;
};

// 第三幕 · 大字 + 粒子 + 重拍卡点
export const makeImpactScene = (kit: StyleKit): React.FC<SceneProps> => {
    const Comp: React.FC<SceneProps> = ({ start }) => {
        const t = useT();
        const K = kit.useK(start);
        return (
            <kit.Stage t={t}>
                <kit.Kicks t={t} K={K} beats={[16]}>
                    <kit.Slam t={t} from={K(17)} x={960} y={470} size={96}>
                        kit / index.ts
                    </kit.Slam>
                    <kit.Slam t={t} from={K(19)} x={960} y={620} size={64} color={kit.P.accent}>
                        一行 re-export，切换整套风格
                    </kit.Slam>
                    <kit.Particles t={t} from={K(17)} x={960} y={470} spread={330} />
                    <kit.Sub t={t} from={K(16)} to={K(24)}>
                        whiteboard · pixel · flat —— 任你挑
                    </kit.Sub>
                </kit.Kicks>
            </kit.Stage>
        );
    };
    Comp.displayName = `DemoImpact-${kit.id}`;
    return Comp;
};
