import React from "react";
import { C, Caption, FONT, MONO, pop, prog, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

// 展示 1 后面 62 个 0，逐拍滚动出来
const buildDigits = (count: number): string[] => {
  const ds = ["1"];
  for (let i = 0; i < 62; i++) ds.push(i < count ? "0" : "");
  return ds;
};

const DIGIT_W = 20;
const DIGIT_GAP = 2;

// 组合数：2^208 ≈ 10^62，天文数字逐位滚动
export const Count: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const rollStart = k(2);
  const rollDur = 20; // 拍
  const progFrames = (k(2 + rollDur) - rollStart) || 1;
  const n0 = Math.floor(prog(t, rollStart, progFrames) * 63);
  const digits = buildDigits(n0);
  const ten62At = k(2 + rollDur + 2);
  const ten62 = pop(t, ten62At, 12);
  const capAt = k(2 + rollDur + 6);

  return (
    <>
      <SceneTitle t={t} step="05" title="组合数：这是一个天文数字" color={C.orange} />
      {/* 2^208 标题 */}
      <div style={{ position: "absolute", left: 220, top: 210, fontSize: 56, fontWeight: 900, fontFamily: MONO, color: C.text, opacity: pop(t, k(1), 10) }}>
        2<sup style={{ fontSize: 34 }}>208</sup>
      </div>

      {/* 滚动数字条 */}
      <div style={{ position: "absolute", left: 220, top: 300, display: "flex" }}>
        {digits.map((d, i) => (
          <div
            key={i}
            style={{
              width: DIGIT_W,
              height: 56,
              borderRadius: 6,
              marginRight: DIGIT_GAP,
              background: i === 0 ? C.orange : C.panel,
              border: `2px solid ${i === 0 ? C.orange : C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONO,
              fontSize: 32,
              fontWeight: 900,
              color: i === 0 ? C.bg : C.text,
              opacity: d === "" ? 0 : pop(t, rollStart + i * 4, 6),
              transform: `translateY(${(1 - pop(t, rollStart + i * 4, 6)) * 30}px)`,
            }}
          />
        ))}
      </div>
      <div style={{ position: "absolute", left: 220, top: 392, fontSize: 26, fontFamily: MONO, color: C.dim, opacity: pop(t, rollStart + 10, 8) }}>
        即 1 后面跟着 {62} 个 0
      </div>

      {/* 10^62 大字 */}
      {t >= ten62At ? (
        <div style={{ position: "absolute", left: 220, top: 470, fontSize: 76, fontWeight: 900, fontFamily: MONO, color: C.orange, transform: `scale(${0.5 + ten62 * 0.5})`, opacity: ten62, textShadow: `0 0 60px ${C.orange}` }}>
          10<sup style={{ fontSize: 44 }}>62</sup>
        </div>
      ) : null}

      {/* 对比：全宇宙原子 ≈ 10^80 */}
      <div
        style={{
          position: "absolute",
          right: 220,
          top: 620,
          width: 500,
          borderRadius: 30,
          background: C.panel,
          border: `4px solid ${C.line}`,
          padding: "36px 40px",
          opacity: pop(t, k(2 + rollDur + 4), 12),
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 800, fontFamily: FONT, color: C.text }}>对比一下</div>
        <div style={{ marginTop: 20, fontSize: 38, fontFamily: MONO, color: C.cyan, fontWeight: 900 }}>
          全宇宙原子数 ≈ 10<sup style={{ fontSize: 26 }}>80</sup>
        </div>
        <div style={{ marginTop: 16, fontSize: 30, fontFamily: FONT, color: C.dim }}>
          和它同一个量级的天文数字
        </div>
      </div>

      <Caption t={t} from={capAt} text="不是几千万，而是 10 的 62 次方——数都数不完" />
    </>
  );
};
