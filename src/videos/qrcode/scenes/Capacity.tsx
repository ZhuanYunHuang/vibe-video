import React from "react";
import { C, Caption, FONT, hit, MONO, pop, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

const ITEMS = [
  { n: "7,089", unit: "个数字", icon: "🔢", color: C.yellow },
  { n: "4,296", unit: "个字母", icon: "🔤", color: C.cyan },
  { n: "2,953", unit: "字节", icon: "📦", color: C.pink },
];

// 一个二维码能装多少：三张数字卡片逐拍落下
export const Capacity: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const wrapAt = k(8);
  const wrap = pop(t, wrapAt, 12);

  return (
    <>
      <SceneTitle t={t} step="04" title="一个二维码，能装多少信息？" color={C.yellow} />
      <div style={{ position: "absolute", left: 240, top: 260, display: "flex", gap: 60 }}>
        {ITEMS.map((it, i) => {
          const f = k(2 + i * 2);
          const s = pop(t, f, 11);
          return (
            <div
              key={it.unit}
              style={{
                width: 420,
                height: 360,
                borderRadius: 30,
                background: C.panel,
                border: `5px solid ${it.color}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s * (1 + hit(t, f, 5) * 0.12)}) translateY(${(1 - s) * 140}px)`,
                opacity: s,
                boxShadow: `0 0 ${hit(t, f, 6) * 60}px ${it.color}88`,
              }}
            >
              <div style={{ fontSize: 70 }}>{it.icon}</div>
              <div style={{ fontSize: 90, fontWeight: 900, fontFamily: MONO, color: it.color, marginTop: 12 }}>
                {it.n}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: FONT, color: C.text, marginTop: 8 }}>{it.unit}</div>
            </div>
          );
        })}
      </div>

      {t >= wrapAt ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 720,
            textAlign: "center",
            transform: `translateY(${(1 - wrap) * 60}px)`,
            opacity: wrap,
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 800, fontFamily: FONT, color: C.text }}>
            一页 <span style={{ color: C.yellow }}>A4 纸</span> 的文字都装得下
          </div>
          <div style={{ marginTop: 14, fontSize: 30, color: C.dim, fontFamily: FONT }}>
            而且扫一眼就能读出来
          </div>
        </div>
      ) : null}

      <Caption t={t} from={k(12)} text="信息越多，格子越密——但扫起来一样快" />
    </>
  );
};
