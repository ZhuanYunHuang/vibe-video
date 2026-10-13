import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, SceneProps, useAt, useT } from "../../../shared";
import { GRAD, P } from "../kit/theme";
import { Card, Chapter, Sub } from "../kit/ui";

const TAGS = ["图论", "贪心", "优先队列"];

const TIMELINE = [
  { year: "1956", text: "在咖啡馆 20 分钟想出" },
  { year: "1959", text: "论文正式发表" },
  { year: "1968", text: "A* 算法提出" },
  { year: "今天", text: "每一次导航都在用" },
];

const POINTS = [
  { title: "建模", desc: "地图 → 带权图" },
  { title: "求解", desc: "Dijkstra · A*" },
  { title: "出处", desc: "计算机科学经典算法" },
];

// 07 回到计算机：这其实是"图的最短路径问题"
export const BackToCS: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 本幕 32 拍：第 16 拍重拍砸出三张要点卡
  const titleS = pop(t, k(1), 11);
  const tagAt = (i: number) => k(3 + i);
  const lineP = interpolate(t, [k(6), k(14)], [0, 1], CL);
  const dotAt = (i: number) => k(6 + i * 2.5);
  const cardAt = (i: number) => k(16 + i * 2);
  const capAt = k(26);

  return (
    <>
      <Chapter t={t} step="07" title="回到计算机" />

      <div style={{ position: "absolute", left: 0, right: 0, top: 170, textAlign: "center", fontFamily: FONT, opacity: titleS, transform: `scale(${0.7 + titleS * 0.3})` }}>
        <div style={{ fontSize: 96, fontWeight: 900, color: P.ink }}>
          图的<span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>最短路径</span>问题
        </div>
        <div style={{ fontFamily: MONO, fontSize: 36, color: P.sub, marginTop: 6, letterSpacing: 4 }}>Shortest Path Problem</div>
      </div>

      <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", gap: 20 }}>
        {TAGS.map((tag, i) => {
          const s = pop(t, tagAt(i), 12);
          return (
            <div key={tag} style={{ padding: "8px 26px", borderRadius: 30, background: P.white, border: `3px solid ${P.teal}`, color: P.teal, fontFamily: FONT, fontSize: 32, fontWeight: 900, opacity: s, transform: `scale(${s})` }}>
              # {tag}
            </div>
          );
        })}
      </div>

      {/* 时间轴 */}
      <div style={{ position: "absolute", left: 200, top: 500, width: 1520, height: 6, borderRadius: 3, background: P.line }}>
        <div style={{ width: `${lineP * 100}%`, height: "100%", borderRadius: 3, background: GRAD }} />
      </div>
      {TIMELINE.map((e, i) => {
        const s = pop(t, dotAt(i), 12);
        const x = 200 + (i / (TIMELINE.length - 1)) * 1520;
        return (
          <div key={e.year} style={{ position: "absolute", left: x - 160, top: 482, width: 320, textAlign: "center", fontFamily: FONT, opacity: s }}>
            <div style={{ width: 42, height: 42, margin: "0 auto", borderRadius: "50%", background: P.white, border: `6px solid ${i === 3 ? P.teal : P.blue}`, transform: `scale(${s})` }} />
            <div style={{ fontFamily: MONO, fontSize: 40, fontWeight: 900, color: i === 3 ? P.teal : P.blue, marginTop: 10 }}>{e.year}</div>
            <div style={{ fontSize: 26, color: P.sub, marginTop: 4 }}>{e.text}</div>
          </div>
        );
      })}

      {/* 三张要点卡 */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", gap: 36 }}>
        {POINTS.map((p, i) => {
          const s = pop(t, cardAt(i), 12);
          return (
            <Card key={p.title} style={{ width: 380, padding: "20px 28px", opacity: s, transform: `translateY(${(1 - s) * 100}px)` }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: P.blue }}>{p.title}</div>
              <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6 }}>{p.desc}</div>
            </Card>
          );
        })}
      </div>

      <Sub t={t} from={capAt} text="绕了一圈，它其实是计算机科学里的一道老题目" />
    </>
  );
};
