import React from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// 优设标题黑：单字重标题字体。模块级 Promise 保证多实例只注入一次 @font-face。
let loading: Promise<unknown> | null = null;

const ensureFont = () => {
    if (loading) return loading;
    const style = document.createElement("style");
    style.textContent = `@font-face{font-family:"YouShe";src:url("${staticFile("fonts/YouSheBiaoTiHei.ttf")}") format("truetype");font-weight:400;font-style:normal;font-display:block;}`;
    document.head.appendChild(style);
    loading = Promise.all([document.fonts.load('120px "YouShe"', "万人敌讨人嫌换人骑好人缘"), document.fonts.load('120px "YouShe"', "Thank you 0123 S1")]).catch(() => undefined);
    return loading;
};

export const Fonts: React.FC = () => {
    const [handle] = React.useState(() => delayRender("加载优设标题黑"));
    React.useEffect(() => {
        ensureFont().then(() => continueRender(handle));
    }, [handle]);
    return null;
};
