import React from "react";
import { interpolate } from "remotion";
import { CL, C, Caption, FONT, MONO, pop, prog, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

// 数学对比：全部扫一遍要 10^51 年，宇宙年龄才 1.38×10^10 年
export const MathScene: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const yearsAt = k(2);
  const yearsP = prog(t, yearsAt, 12);
  const uniAt = k(8);
  const uniP = prog(t, uniAt, 12);
  const ratioAt = k(14);
  const ratio = pop(t, ratioAt, 14);
  const conAt = k(20);
  const con = pop(t, conAt, 16);
  const capAt = k(28);
  // 结论出现时，算式区淡出让位
  const calcFade = t < conAt ? 1 : interpolate(t, [conAt, conAt + 10], [1, 0.12], CL);

  return (
    <>
      <SceneTitle t={t} step="07" title="要多少年才能扫完？" color={C.green} />
      {/* 算式与对比条整体淡出让位 */}
      <div style={{ opacity: calcFade }}>
      {/* 算式：10^62 ÷ 10^11 = 10^51 */}
      <div style={{ position: "absolute", left: 280, top: 220, display: "flex", alignItems: "center", gap: 30, opacity: pop(t, k(1), 10) }}>
        <div style={{ fontFamily: MONO, fontSize: 72, fontWeight: 900, color: C.orange }}>10<sup style={{ fontSize: 40 }}>62</sup></div>
        <div style={{ fontSize: 72, color: C.dim }}>÷</div>
        <div style={{ fontFamily: MONO, fontSize: 72, fontWeight: 900, color: C.pink }}>10<sup style={{ fontSize: 40 }}>11</sup></div>
        <div style={{ fontSize: 72, color: C.dim }}>=</div>
        <div style={{ fontFamily: MONO, fontSize: 72, fontWeight: 900, color: C.yellow, opacity: pop(t, yearsAt, 10) }}>10<sup style={{ fontSize: 40 }}>51</sup></div>
      </div>
      <div style={{ position: "absolute", left: 280, top: 360, fontSize: 34, fontFamily: FONT, color: C.dim, opacity: pop(t, yearsAt, 8) }}>
        每 1 秒扫一个，全部扫一遍要 10⁵¹ 年
      </div>
      </div>{/* calcFade 容器结束 */}

      {/* 对比条：宇宙年龄 vs 需要的时间 */}
      <div style={{ position: "absolute", left: 280, top: 520, width: 1360 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 180, fontSize: 34, fontFamily: MONO, color: C.cyan, textAlign: "right" }}>宇宙年龄</div>
          <div style={{ width: 420, height: 34, borderRadius: 17, background: C.panel, border: `3px solid ${C.line}`, overflow: "hidden", transform: `translateX(${(1 - uniP) * -80}px)`, opacity: uniP }}>
            <div style={{ width: `${Math.min(100, uniP * 100)}%`, height: "100%", background: C.cyan, borderRadius: 17 }} />
          </div>
          <div style={{ fontSize: 30, fontFamily: MONO, color: C.cyan, opacity: uniP }}>138 亿年</div>
        </div>
        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 180, fontSize: 34, fontFamily: MONO, color: C.yellow, textAlign: "right" }}>扫完全部</div>
          <div style={{ width: 420, height: 34, borderRadius: 17, background: C.panel, border: `3px solid ${C.line}`, overflow: "hidden", transform: `translateX(${(1 - yearsP) * -80}px)`, opacity: yearsP }}>
            <div style={{ width: "100%", height: "100%", background: `repeating-linear-gradient(90deg, ${C.yellow}, ${C.yellow} 10px, ${C.pink} 10px, ${C.pink} 20px)`, borderRadius: 17 }} />
          </div>
          <div style={{ fontSize: 30, fontFamily: MONO, color: C.yellow, opacity: yearsP }}>10⁵¹ 年</div>
        </div>
        <div style={{ marginTop: 20, fontSize: 30, fontFamily: FONT, color: C.dim, opacity: ratio }}>
          是宇宙年龄的 <span style={{ color: C.yellow, fontWeight: 900 }}>10 的 41 次方</span> 倍
        </div>
      </div>

      {/* 结论 */}
      {t >= conAt ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 250,
            textAlign: "center",
            transform: `scale(${0.4 + con * 0.6}) rotate(${(1 - con) * -6}deg)`,
            opacity: con,
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontSize: 120,
              fontWeight: 900,
              fontFamily: FONT,
              color: C.green,
              textShadow: `0 0 80px ${C.green}`,
            }}
          >
            根本用不完！
          </span>
          <div style={{ marginTop: 14, fontSize: 36, color: C.dim, fontFamily: FONT }}>
            就算把二维码用到宇宙毁灭，也只是九牛一毛
          </div>
        </div>
      ) : null}

      <Caption t={t} from={capAt} text="数学告诉我们：可以放心大胆地扫" />
    </>
  );
};
