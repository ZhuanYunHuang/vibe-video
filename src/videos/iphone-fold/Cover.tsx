import React from "react";
import { Img, staticFile } from "remotion";
import { FONT, MONO } from "../../styles/explode/theme";

// 封面：主图取自成片开场帧（背面 3/4：竖排双摄 + 苹果标），
// 版面为「左侧标题 + 右侧产品图卡」。
export const Cover: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 62% 18%, #FFFFFF 0%, #F2F6FC 48%, #E4EBF5 100%)", fontFamily: FONT, overflow: "hidden" }}>
        <div
            style={{
                position: "absolute",
                left: "-10%",
                right: "-10%",
                top: "10%",
                bottom: "-20%",
                backgroundImage: "repeating-linear-gradient(60deg, #D7DDE888 0 1px, transparent 1px 96px), repeating-linear-gradient(-60deg, #D7DDE888 0 1px, transparent 1px 96px)",
                opacity: 0.55,
                maskImage: "linear-gradient(180deg, transparent 12%, #000 55%)",
                WebkitMaskImage: "linear-gradient(180deg, transparent 12%, #000 55%)",
            }}
        />
        <div style={{ position: "absolute", right: -120, top: -160, width: 1000, height: 820, background: "radial-gradient(50% 50% at 50% 50%, #FDBA742E, transparent 70%)" }} />

        <div style={{ position: "absolute", left: 118, top: 208 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid #F9731666", borderRadius: 6, padding: "7px 14px", color: "#C2410C", fontFamily: MONO, fontSize: 20, letterSpacing: 3 }}>3D TEARDOWN · 折叠原理</div>
            <div style={{ fontSize: 96, fontWeight: 900, color: "#121722", letterSpacing: 1, lineHeight: 1.08, marginTop: 26 }}>iPhone Duo</div>
            <div style={{ fontSize: 96, fontWeight: 900, color: "#F97316", letterSpacing: 1, lineHeight: 1.08 }}>是怎么折叠的？</div>
            <div style={{ width: 132, height: 7, background: "#121722", marginTop: 34 }} />
            <div style={{ fontSize: 30, color: "#5A6474", marginTop: 26, letterSpacing: 1 }}>5.2 / 11.3 mm ｜ 十层材料，一条折痕</div>
            <div style={{ fontSize: 22, color: "#8A94A6", marginTop: 12, letterSpacing: 1 }}>3 分钟，把一台折叠屏拆开看</div>
        </div>

        <div style={{ position: "absolute", left: 986, top: 92 }}>
            <Img
                src={staticFile("iphone-fold/cover-phone.png")}
                style={{ width: 800, height: 897, objectFit: "contain", filter: "drop-shadow(0 30px 56px rgba(15,23,42,0.24))" }}
            />
        </div>

    </div>
);
