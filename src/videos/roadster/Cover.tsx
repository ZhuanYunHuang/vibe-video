import React from "react";
import { Img, staticFile } from "remotion";
import { FONT, MONO, P } from "../../styles/explode";

// 封面 v2：「特斯拉 Roadster 是怎么倒挂的？」——倒挂的车 + 马斯克插画（静态、无节拍依赖）
export const Cover: React.FC = () => (
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(95% 75% at 50% 0%, #262B36 0%, ${P.bg} 58%, #0B0D11 100%)`, fontFamily: FONT, overflow: "hidden" }}>
        {/* 等距网格 + 顶部主光 */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `repeating-linear-gradient(60deg, ${P.line}44 0 1px, transparent 1px 90px), repeating-linear-gradient(-60deg, ${P.line}44 0 1px, transparent 1px 90px)`, opacity: 0.35 }} />
        <div style={{ position: "absolute", left: "50%", top: -260, width: 1320, height: 800, marginLeft: -660, background: `radial-gradient(50% 55% at 50% 42%, ${P.accentLight}30, transparent 70%)` }} />

        {/* 天花板横梁 */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 62, height: 34, background: "linear-gradient(180deg, #3A404E, #262B36)", borderBottom: "2px solid #00000066" }} />

        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
            {/* 倒挂的车（车头朝右，倒置悬挂） */}
            <g transform="translate(800 448) scale(1.56, -1.56)">
                <path d="M6 150 L6 116 Q16 98 66 88 L172 62 Q226 28 308 24 L430 30 Q546 44 620 92 L640 116 L640 150 Z" fill="#C8102E" stroke="#7A0A1D" strokeWidth="2" />
                <path d="M70 86 L172 60 Q226 26 308 22 L430 28" stroke="#FF7A85" strokeWidth="3" fill="none" opacity="0.55" />
                <path d="M244 60 L332 32 L412 36 L268 66 Z" fill="#0B0D11" />
                <path d="M258 58 L322 38 L360 40 L300 60 Z" fill="#E8EDF6" opacity="0.14" />
                {[150, 505].map((wx) => (
                    <g key={wx}>
                        <circle cx={wx} cy={168} r={42} fill="#101216" stroke="#3A404E" strokeWidth="6" />
                        <circle cx={wx} cy={168} r={27} fill="none" stroke="#5F5E5A" strokeWidth="4" />
                        <circle cx={wx} cy={168} r={13} fill="#8A93A6" />
                    </g>
                ))}
                {/* 车底吸附辉光（倒挂后朝上） */}
                <rect x="60" y="207" width="520" height="9" rx="4" fill={P.accent} opacity="0.95" />
                <ellipse cx="320" cy="212" rx="300" ry="15" fill={P.accent} opacity="0.28" />
            </g>
            {/* 天花板吸附光圈 */}
            <ellipse cx="1260" cy="112" rx="430" ry="24" fill={P.accent} opacity="0.12" />
            <ellipse cx="1260" cy="112" rx="300" ry="16" fill={P.accent} opacity="0.18" />
            <ellipse cx="1260" cy="112" rx="170" ry="10" fill={P.accent} opacity="0.3" />
            {/* 大气压托举箭头（指向车） */}
            {[880, 1060, 1240].map((ax) => (
                <g key={ax}>
                    <line x1={ax} y1="545" x2={ax} y2="478" stroke={P.gold} strokeWidth="9" strokeLinecap="round" />
                    <polygon points={`${ax - 17},478 ${ax + 17},478 ${ax},447`} fill={P.gold} />
                </g>
            ))}
            <text x="990" y="500" fill={P.gold} fontFamily={MONO} fontSize="28" letterSpacing="2">大气压</text>
        </svg>

        {/* 马斯克（实拍抠像） */}
        <Img
            src={staticFile("roadster/cover-musk.png")}
            style={{
                position: "absolute",
                left: 1165,
                top: 423,
                width: 600,
                height: 577,
                objectFit: "contain",
                objectPosition: "center bottom",
                WebkitMaskImage: "linear-gradient(180deg, #000 74%, transparent 100%)",
                maskImage: "linear-gradient(180deg, #000 74%, transparent 100%)",
            }}
        />

        {/* 标题区（左） */}
        <div style={{ position: "absolute", left: 116, top: 196 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <svg width="62" height="62" viewBox="0 0 100 100">
                    <path d="M22 32 Q50 18 78 32 L78 43 Q50 32 22 43 Z" fill="#E31937" />
                    <path d="M43 41 L57 41 L53.5 88 L46.5 88 Z" fill="#E31937" />
                </svg>
                <div style={{ fontFamily: MONO, fontSize: 44, color: P.accent, letterSpacing: 6 }}>特斯拉 Roadster</div>
            </div>
            <div style={{ position: "relative", height: 150 }}>
                <span style={{ position: "absolute", left: 0, top: 12, fontSize: 92, fontWeight: 900, color: "#07090D", letterSpacing: 6, whiteSpace: "nowrap" }}>是怎么倒挂的？</span>
                <span style={{ position: "absolute", left: 0, top: 6, fontSize: 92, fontWeight: 900, color: P.accentDeep, letterSpacing: 6, whiteSpace: "nowrap" }}>是怎么倒挂的？</span>
                <span style={{ position: "relative", fontSize: 92, fontWeight: 900, letterSpacing: 6, whiteSpace: "nowrap", backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, #D7DEE9 42%, ${P.extra?.metal} 72%, #7E8798 100%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>是怎么倒挂的？</span>
            </div>
            <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ fontFamily: MONO, fontSize: 30, color: P.inkSub, letterSpacing: 3 }}>负压吸附 · 2 × 车重 · 峰值 4700 kg+</div>
                <div style={{ fontFamily: MONO, fontSize: 30, color: P.inkSub, letterSpacing: 3 }}>没有磁铁 · 没有胶水 · 全靠大气压差</div>
            </div>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, bottom: 44, textAlign: "center", fontFamily: MONO, fontSize: 24, color: P.inkSub, letterSpacing: 10 }}>3D 拆解 · EXPLODE</div>
    </div>
);
