import React from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// 加载 FusionPixel 像素字体（简体子集 + 拉丁子集，OFL 授权，字体文件在 public/fonts/）。
// 挂进 Backdrop/封面/展示页即可全片生效；字体缺失时自动回退系统字体、不阻塞渲染。
export const PixelFontLoader: React.FC = () => {
    const [handle] = React.useState(() => delayRender("加载像素字体"));
    React.useEffect(() => {
        const style = document.createElement("style");
        style.textContent = [
            `@font-face { font-family: "FusionPixel"; src: url("${staticFile("fonts/fusion-pixel-12px-monospaced-latin.woff2")}") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }`,
            `@font-face { font-family: "FusionPixel"; src: url("${staticFile("fonts/fusion-pixel-12px-monospaced-zh_hans.woff2")}") format("woff2"); }`,
        ].join("\n");
        document.head.appendChild(style);
        const sample = "像素测试0123456789ABC";
        Promise.all([document.fonts.load('36px "FusionPixel"', sample), document.fonts.load('72px "FusionPixel"', sample)])
            .then(() => continueRender(handle))
            .catch(() => continueRender(handle));
    }, [handle]);
    return null;
};
