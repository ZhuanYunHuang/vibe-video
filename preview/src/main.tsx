import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./ui.css";

// 像素字体先就位，避免预览首帧跳字
const boot = async () => {
    const style = document.createElement("style");
    style.textContent = [
        `@font-face { font-family: "FusionPixel"; src: url("/fonts/fusion-pixel-12px-monospaced-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+2000-206F; }`,
        `@font-face { font-family: "FusionPixel"; src: url("/fonts/fusion-pixel-12px-monospaced-zh_hans.woff2") format("woff2"); }`,
    ].join("\n");
    document.head.appendChild(style);
    try {
        await Promise.all([document.fonts.load('36px "FusionPixel"', "像素测试"), document.fonts.load('72px "FusionPixel"', "像素测试")]);
    } catch {
        // 字体缺失就用系统字体，不阻塞预览
    }
    createRoot(document.getElementById("root")!).render(<App />);
};

void boot();
