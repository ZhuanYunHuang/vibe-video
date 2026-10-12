import React from "react";
import { C, Caption, FONT, MONO, pop, prog, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

// 全球每年消耗 ~10^11（一千亿）个二维码，对比总组合数（10^62）
export const Consume: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const totalAt = k(1);
  const totalP = prog(t, totalAt, 12);
  const yearAt = k(5);
  const yearP = prog(t, yearAt, 12);
  const cmpAt = k(12);
  const cmp = pop(t, cmpAt, 12);
  const capAt = k(15);

  return (
    <>
      <SceneTitle t={t} step="06" title="人类每年用掉多少？" color={C.pink} />
      {/* 二维码总组合数：10^62 */}
      <div style={{ position: "absolute", left: 280, top: 230, width: 620 }}>
        <div style={{ fontSize: 34, fontWeight: 700, fontFamily: FONT, color: C.dim, opacity: pop(t, totalAt, 8) }}>
          可能的二维码组合数
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: MONO,
            fontSize: 110,
            fontWeight: 900,
            color: C.orange,
            transform: `translateY(${(1 - totalP) * 60}px)`,
            opacity: totalP,
            textShadow: `0 0 40px ${C.orange}66`,
          }}
        >
          10<sup style={{ fontSize: 60 }}>62</sup>
        </div>
      </div>

      {/* 全球年消耗：10^11 */}
      <div style={{ position: "absolute", left: 280, top: 520, width: 620 }}>
        <div style={{ fontSize: 34, fontWeight: 700, fontFamily: FONT, color: C.dim, opacity: pop(t, yearAt, 8) }}>
          全人类每年扫码次数
        </div>
        <div
          style={{
            marginTop: 20,
            fontFamily: MONO,
            fontSize: 110,
            fontWeight: 900,
            color: C.pink,
            transform: `translateY(${(1 - yearP) * 60}px)`,
            opacity: yearP,
            textShadow: `0 0 40px ${C.pink}66`,
          }}
        >
          10<sup style={{ fontSize: 60 }}>11</sup>
        </div>
      </div>

      {/* 差距对比条 */}
      <div style={{ position: "absolute", right: 240, top: 360, width: 520 }}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            fontFamily: FONT,
            color: C.text,
            opacity: cmp,
            transform: `scale(${cmp})`,
          }}
        >
          差了多少个量级？
        </div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 90, fontSize: 30, fontFamily: MONO, color: C.pink, textAlign: "right" }}>1 年</div>
          <div style={{ flex: 1, height: 22, borderRadius: 11, background: C.panel, border: `2px solid ${C.line}`, overflow: "hidden" }}>
            <div style={{ width: "0.2%", height: "100%", background: C.pink }} />
          </div>
          <div style={{ width: 110, fontSize: 26, fontFamily: MONO, color: C.dim }}>10¹¹</div>
        </div>
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 90, fontSize: 30, fontFamily: MONO, color: C.orange, textAlign: "right" }}>总量</div>
          <div style={{ flex: 1, height: 22, borderRadius: 11, background: C.panel, border: `2px solid ${C.line}`, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: C.orange }} />
          </div>
          <div style={{ width: 110, fontSize: 26, fontFamily: MONO, color: C.dim }}>10⁶²</div>
        </div>
        <div style={{ marginTop: 24, fontSize: 32, fontFamily: FONT, color: C.dim, opacity: pop(t, cmpAt + 6, 10) }}>
          一年扫掉的，只是总数的 <span style={{ color: C.pink, fontWeight: 900 }}>51 个 0</span> 之后的小尾巴
        </div>
      </div>

      <Caption t={t} from={capAt} text="全人类加起来，一年也只消耗了它的一丁点" />
    </>
  );
};
