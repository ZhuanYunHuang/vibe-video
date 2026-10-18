import React from "react";
import { interpolate } from "remotion";
import { CL, FONT } from "../../../shared";
import { P } from "./theme";

// 耐心电量条（原片样式）：整体一块白卡（标签 + 电池 + 百分比都在卡内），
// 深浅底场景都清晰；涨/跌飘字带白边；低电红闪 + 回充高光。
// 重规划后作为贯穿全片的母题（≥10 幕 + 封面），新增：
//   mode="bar"  仅电量条（无白卡无标签，用于嵌进场景）
//   mode="log"  白卡，底部多一行「扣电日志」小字
//   cracked     0% 裂纹 + 红光脉动
//   ghost       半透明虚线卡（门外"悄悄回充"的虚影）
export const Battery: React.FC<{
  t: number;
  x: number; // 白卡中心 x
  y: number; // 白卡中心 y
  w?: number; // 白卡总宽
  level: number; // 0~100
  delta?: { v: number; at: number }; // 飘字（-13 / +27），at 为场景内帧
  label?: boolean; // 「耐心电量」小标（卡内第一行）
  charging?: boolean; // 回充态：绿色 + 高光扫过
  mode?: "card" | "bar" | "log";
  cracked?: boolean; // 耗尽裂纹
  ghost?: boolean; // 门外虚影
}> = ({ t, x, y, w = 560, level, delta, label = true, charging = false, mode = "card", cracked = false, ghost = false }) => {
  const barH = w * 0.14; // 电池条高
  const padX = w * 0.035;
  const padY = w * 0.026;
  const showLabel = label && mode !== "bar";
  const labelH = showLabel ? w * 0.052 : 0;
  const logH = mode === "log" ? w * 0.042 : 0;
  const cardH = mode === "bar" ? barH * 1.7 : padY * 2 + labelH + barH + logH;
  const bodyW = w - padX * 2;
  const capW = bodyW * 0.06;
  // 百分比占位：按字号与字符数预留，确保数字始终在白卡内（修「数字溢出 + 黑字不可见」）
  const pctFont = barH * 0.68;
  const pctStr = `${Math.round(level)}%`;
  const pctW = pctFont * 0.64 * pctStr.length;
  const gapX = w * 0.02;
  const trackW = Math.max(w * 0.16, bodyW - capW - pctW - gapX);
  const lv = Math.max(0, Math.min(100, level));
  const col = charging ? P.ok : lv <= 20 ? P.low : lv <= 50 ? P.warn : P.ok;
  // 数字用「加深的状态色」：白卡上清晰可读，且一眼看出电量状态
  const numCol = charging ? "#2E8F4B" : lv <= 20 ? "#D0342C" : lv <= 50 ? "#C08A14" : "#2E8F4B";
  const lowFlick = lv <= 20 && lv > 0 ? 0.72 + 0.28 * Math.abs(Math.sin(t / 3)) : 1;
  const crackPulse = cracked ? 0.62 + 0.38 * Math.abs(Math.sin(t / 2.2)) : 1;
  const fillW = (trackW * lv) / 100;

  const d = delta ? t - delta.at : -1;
  const deltaO = d >= 0 ? interpolate(d, [0, 4, 26, 34], [0, 1, 1, 0], CL) : 0;
  const deltaUp = d >= 0 ? Math.min(d, 30) * 2.2 : 0;

  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - cardH / 2, width: w, height: cardH, opacity: ghost ? 0.82 : 1 }}>
      {/* 白卡 */}
      {mode !== "bar" ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: ghost ? "rgba(255,255,255,0.72)" : "#FFFFFF",
            borderRadius: 16,
            border: ghost ? `3px dashed #CBD8EA` : "2.5px solid #E3D5BC",
            boxShadow: "0 5px 0 rgba(42,46,58,0.10), 0 10px 24px rgba(30,40,70,0.14)",
            opacity: lowFlick,
          }}
        />
      ) : null}
      {/* 标签 */}
      {showLabel ? (
        <div
          style={{
            position: "absolute",
            left: padX,
            top: padY,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: labelH * 0.86,
            letterSpacing: 4,
            color: P.ink,
            lineHeight: 1,
          }}
        >
          耐心电量
        </div>
      ) : null}
      {/* 电池条 + 百分比 */}
      <div
        style={{
          position: "absolute",
          left: mode === "bar" ? 0 : padX,
          top: mode === "bar" ? (cardH - barH) / 2 : padY + labelH,
          display: "flex",
          alignItems: "center",
          gap: w * 0.02,
          opacity: lowFlick * crackPulse,
        }}
      >
        <svg width={trackW + capW} height={barH} style={{ display: "block", overflow: "visible" }}>
          {/* 正极帽 */}
          <rect x={trackW} y={barH * 0.28} width={capW} height={barH * 0.44} rx={3} fill={col} />
          {/* 轨道 */}
          <rect x={0} y={0} width={trackW} height={barH} rx={barH * 0.32} fill="#EDF0F6" stroke="#D8DEE9" strokeWidth={2.5} />
          {/* 填充 */}
          {fillW > 4 ? <rect x={0} y={0} width={fillW} height={barH} rx={barH * 0.32} fill={col} /> : null}
          {/* 回充高光 */}
          {charging && fillW > 8 ? (
            <rect x={((t * 6) % Math.max(1, fillW - w * 0.04))} y={0} width={w * 0.04} height={barH} rx={4} fill="#FFFFFF" opacity={0.55} />
          ) : null}
          {/* 耗尽裂纹 */}
          {cracked ? (
            <g stroke={P.low} strokeWidth={3.2} fill="none" strokeLinecap="round">
              <path d={`M${trackW * 0.12} 2 L${trackW * 0.2} ${barH * 0.5} L${trackW * 0.09} ${barH - 2}`} />
              <path d={`M${trackW * 0.3} 2 L${trackW * 0.24} ${barH * 0.45} L${trackW * 0.36} ${barH - 2}`} />
            </g>
          ) : null}
        </svg>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: pctFont,
            fontVariantNumeric: "tabular-nums",
            color: cracked ? "#D0342C" : numCol,
            whiteSpace: "nowrap",
            lineHeight: 1,
            width: pctW,
            textAlign: "left",
          }}
        >
          {Math.round(lv)}
          <span style={{ fontSize: pctFont * 0.62, color: P.sub }}>%</span>
        </div>
      </div>
      {/* 扣电日志脚注 */}
      {mode === "log" ? (
        <div
          style={{
            position: "absolute",
            left: padX,
            bottom: padY * 0.7,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: logH * 0.74,
            letterSpacing: 3,
            color: P.magenta,
            opacity: 0.85,
            lineHeight: 1,
          }}
        >
          扣电日志 · 每一次都在扣
        </div>
      ) : null}
      {/* 涨跌飘字 */}
      {delta && d >= 0 && deltaO > 0.01 ? (
        <div
          style={{
            position: "absolute",
            left: w * (0.12 + (Math.abs(delta.v) % 3) * 0.22),
            top: -w * 0.045 - deltaUp,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: cardH * 0.42,
            color: delta.v < 0 ? P.magenta : P.ok,
            opacity: deltaO,
            whiteSpace: "nowrap",
            textShadow: "-2px 0 0 #fff, 2px 0 0 #fff, 0 -2px 0 #fff, 0 3px 0 #fff",
          }}
        >
          {delta.v < 0 ? "" : "+"}
          {delta.v}%
        </div>
      ) : null}
    </div>
  );
};
