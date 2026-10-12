import React from "react";
import { interpolate } from "remotion";
import { CL, C, Caption, FONT, MONO, pop, prog, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

// 版本 1 → 40：边长 21 → 177 格，容量条同步变长
export const Version: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const growAt = k(3);
  const growDur = 14;
  const p = prog(t, growAt, growDur);
  const side = Math.round(interpolate(p, [0, 1], [21, 177], CL));
  const cells = side * side;
  const v1 = 21 * 21;
  const v40 = 177 * 177;
  const cap = prog(t, growAt + growDur + 2, 8);
  const capAt = k(10);

  const maxPx = 560;
  const px = interpolate(p, [0, 1], [120, maxPx], CL);

  return (
    <>
      <SceneTitle t={t} step="03" title="版本：格子会越变越多" color={C.green} />
      {/* 增长的二维码：只画边框 + 内部点阵密度示意 */}
      <div
        style={{
          position: "absolute",
          left: 300,
          top: 200,
          width: px,
          height: px,
          border: `6px solid ${C.green}`,
          borderRadius: 12,
          opacity: pop(t, k(1), 10),
          transform: `translateY(${(1 - pop(t, k(1), 10)) * 100}px)`,
          background: `${C.green}0d`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", fontFamily: MONO, color: C.green }}>
          <div style={{ fontSize: Math.min(64, px / 6), fontWeight: 900 }}>
            {side}×{side}
          </div>
          <div style={{ fontSize: 26, marginTop: 8, opacity: 0.8 }}>{cells.toLocaleString()} 格</div>
        </div>
      </div>

      {/* 版本标签 V1 / V40 */}
      <div style={{ position: "absolute", left: 300, top: 200 - 46, fontSize: 26, fontWeight: 800, fontFamily: FONT, color: C.dim, opacity: pop(t, k(1), 10) }}>
        版本 1（最小）
      </div>
      {p > 0.85 ? (
        <div style={{ position: "absolute", left: 300 + maxPx - 140, top: 200 - 46, fontSize: 26, fontWeight: 800, fontFamily: FONT, color: C.green, opacity: pop(t, growAt + growDur, 10) }}>
          版本 40（最大）
        </div>
      ) : null}

      {/* 右侧：容量增长条 */}
      <div style={{ position: "absolute", left: 1150, top: 240, width: 420 }}>
        <div style={{ fontSize: 40, fontWeight: 800, fontFamily: FONT, color: C.text, opacity: pop(t, k(2), 10) }}>
          容量变化
        </div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 130, fontSize: 30, fontFamily: MONO, color: C.dim, textAlign: "right" }}>V1</div>
          <div style={{ width: 60, height: 18, borderRadius: 9, background: C.panel, border: `2px solid ${C.line}`, overflow: "hidden" }}>
            <div style={{ width: `${6 * (cap > 0 ? 1 : 0)}%`, height: "100%", background: C.green, borderRadius: 9 }} />
          </div>
          <div style={{ fontSize: 26, fontFamily: MONO, color: C.dim }}>{v1.toLocaleString()} 格</div>
        </div>
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 130, fontSize: 30, fontFamily: MONO, color: C.green, textAlign: "right" }}>V40</div>
          <div style={{ width: 60, height: 18, borderRadius: 9, background: C.panel, border: `2px solid ${C.line}`, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: C.green, borderRadius: 9 }} />
          </div>
          <div style={{ fontSize: 26, fontFamily: MONO, color: C.green, opacity: cap }}>{v40.toLocaleString()} 格</div>
        </div>
        <div style={{ marginTop: 26, fontSize: 30, color: C.dim, fontFamily: FONT, opacity: cap }}>
          大了 <span style={{ color: C.green, fontWeight: 900 }}>约 71 倍</span>
        </div>
      </div>

      <Caption t={t} from={capAt} text="版本越高格子越多，能装的信息也越多" />
    </>
  );
};
