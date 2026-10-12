import React from "react";
import { interpolate } from "remotion";
import { CL, C, Center, FONT, hit, pop, SceneProps, useAt, useT } from "../../../shared";

const STEPS = [
  { icon: "🔎", name: "DNS 解析", color: C.purple },
  { icon: "🤝", name: "TCP 握手", color: C.cyan },
  { icon: "🔒", name: "TLS 加密", color: C.green },
  { icon: "📨", name: "HTTP 请求", color: C.yellow },
  { icon: "⚙️", name: "服务器处理", color: C.pink },
  { icon: "🎨", name: "浏览器渲染", color: C.orange },
];

// 总结：每半拍亮一个步骤卡片，最后收尾标语
export const Outro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const lineAt = k(6);
  const endAt = k(10);
  const fadeOut = interpolate(t, [endAt + 30, endAt + 50], [1, 0], CL);

  return (
    <Center style={{ opacity: fadeOut }}>
      <div style={{ fontSize: 64, fontWeight: 900, marginBottom: 60, transform: `scale(${pop(t, 0)})` }}>回顾一下</div>
      <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
        {STEPS.map((s, i) => {
          const f = k(i * 0.5 + 1);
          const sc = pop(t, f, 10);
          return (
            <React.Fragment key={s.name}>
              <div
                style={{
                  width: 230,
                  height: 230,
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
                <div style={{ fontSize: 80 }}>{s.icon}</div>
                <div style={{ fontSize: 30, fontWeight: 800, marginTop: 10, fontFamily: FONT }}>{s.name}</div>
              </div>
              {i < STEPS.length - 1 ? <div style={{ fontSize: 40, color: C.dim, opacity: sc }}>→</div> : null}
            </React.Fragment>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 80,
          fontSize: 60,
          fontWeight: 900,
          opacity: pop(t, lineAt, 12),
          transform: `translateY(${(1 - pop(t, lineAt, 12)) * 60}px)`,
        }}
      >
        你看到的<span style={{ color: C.yellow }}>“一瞬间”</span>，是无数机器的<span style={{ color: C.cyan }}>接力</span>
      </div>
      <div style={{ marginTop: 30, fontSize: 36, color: C.dim, opacity: pop(t, k(8), 14) }}>下次刷新网页时，想想这场接力赛 🏃</div>
    </Center>
  );
};
