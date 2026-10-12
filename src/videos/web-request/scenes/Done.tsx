import React from "react";
import { interpolate } from "remotion";
import { CL, C, Caption, Center, FONT, hit, pop, SceneProps, useAt, useT } from "../../../shared";

// 页面加载完成：倒计时式 "3 2 1" + 页面炸开
export const Done: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const nums = ["3", "2", "1"];
  const boomAt = k(3);
  const boom = t >= boomAt;
  const s = pop(t, boomAt, 10);
  const burst = interpolate(t, [boomAt, boomAt + 24], [0, 1], CL);
  const colors = [C.cyan, C.pink, C.yellow, C.green, C.purple, C.orange];

  return (
    <Center>
      {!boom
        ? nums.map((n, i) => {
            const f = k(i);
            const nxt = k(i + 1);
            if (t < f || t >= nxt) return null;
            return (
              <div key={n} style={{ fontSize: 360, fontWeight: 900, color: colors[i], transform: `scale(${1.6 - pop(t, f, 9) * 0.6 + hit(t, f, 3) * 0.2})` }}>
                {n}
              </div>
            );
          })
        : null}
      {boom ? (
        <>
          {/* 彩色碎片放射 */}
          {Array.from({ length: 24 }).map((_, i) => {
            const a = (i / 24) * Math.PI * 2;
            const r = burst * 700;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 960 + Math.cos(a) * r - 14,
                  top: 540 + Math.sin(a) * r - 14,
                  width: 28,
                  height: 28,
                  borderRadius: i % 2 ? 14 : 4,
                  background: colors[i % colors.length],
                  opacity: 1 - burst,
                  transform: `rotate(${burst * 360}deg)`,
                }}
              />
            );
          })}
          <div
            style={{
              width: 1100,
              height: 560,
              borderRadius: 28,
              background: "#f8fafc",
              overflow: "hidden",
              transform: `scale(${s}) rotate(${(1 - s) * -6}deg)`,
              boxShadow: `0 0 ${80 * hit(t, boomAt, 8) + 30}px ${C.cyan}`,
              fontFamily: FONT,
            }}
          >
            <div style={{ height: 70, background: C.cyan, display: "flex", alignItems: "center", padding: "0 30px", fontSize: 30, fontWeight: 900, color: C.bg }}>
              www.example.com
            </div>
            <div style={{ padding: 50, color: C.bg }}>
              <div style={{ fontSize: 72, fontWeight: 900 }}>Hello, Web 👋</div>
              {[0.9, 0.75, 0.6].map((w, i) => (
                <div key={i} style={{ marginTop: 26, height: 26, borderRadius: 13, background: "#cbd5e1", width: `${w * pop(t, boomAt + 6 + i * 4, 14) * 100}%` }} />
              ))}
            </div>
          </div>
        </>
      ) : null}
      {boom ? <Caption t={t} from={k(5)} text="这一切，通常不到 1 秒" color={C.yellow} /> : null}
    </Center>
  );
};
