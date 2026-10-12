import React from "react";
import { interpolate } from "remotion";
import { CL, C, Center, FONT, hit, pop, SceneProps, useAt, useT } from "../../../shared";

const STEPS = [
  { icon: "⬛", name: "黑白格子", color: C.cyan },
  { icon: "🔍", name: "天文数量", color: C.orange },
  { icon: "🧮", name: "数学结论", color: C.green },
];

// 总结：三张卡片 + 收尾标语 + 淡出
export const Outro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const lineAt = k(12);
  const endAt = k(28);
  const fadeOut = interpolate(t, [endAt + 20, endAt + 40], [1, 0], CL);

  return (
    <Center style={{ opacity: fadeOut }}>
      <div style={{ fontSize: 64, fontWeight: 900, marginBottom: 60, transform: `scale(${pop(t, 0)})` }}>回顾一下</div>
      <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
        {STEPS.map((s, i) => {
          const f = k(2 + i * 2);
          const sc = pop(t, f, 10);
          return (
            <React.Fragment key={s.name}>
              <div
                style={{
                  width: 260,
                  height: 260,
                  borderRadius: 30,
                  background: C.panel,
                  border: `5px solid ${s.color}`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${sc * (1 + hit(t, f, 4) * 0.15)}) translateY(${(1 - sc) * 100}px)`,
                  opacity: sc,
                  boxShadow: t >= lineAt ? `0 0 ${30 + 30 * hit(t, lineAt + i * 3, 6)}px ${s.color}88` : "none",
                }}
              >
                <div style={{ fontSize: 88 }}>{s.icon}</div>
                <div style={{ fontSize: 32, fontWeight: 800, marginTop: 10, fontFamily: FONT }}>{s.name}</div>
              </div>
              {i < STEPS.length - 1 ? <div style={{ fontSize: 44, color: C.dim, opacity: sc }}>→</div> : null}
            </React.Fragment>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 90,
          fontSize: 64,
          fontWeight: 900,
          opacity: pop(t, lineAt, 12),
          transform: `translateY(${(1 - pop(t, lineAt, 12)) * 60}px)`,
        }}
      >
        二维码<span style={{ color: C.green}}>用不完</span>，放心扫
      </div>
      <div style={{ marginTop: 30, fontSize: 36, color: C.dim, opacity: pop(t, k(18), 14) }}>
        下一次扫码时，记得背后有个 10⁶² 的世界 ✨
      </div>
    </Center>
  );
};
