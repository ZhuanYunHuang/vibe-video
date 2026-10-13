import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, hit, pop, SceneProps, useAt, useT } from "../../../shared";
import { NodeDot, PathLine, RoadNet, Stage } from "../kit/MapKit";
import { ALL_PATHS, NODES, P, pathCost } from "../kit/theme";
import { Card, Chapter, Sub } from "../kit/ui";

const GROWTH = [
  { n: "11", paths: String(ALL_PATHS.length) },
  { n: "100", paths: "10¹⁸+" },
  { n: "1000万", paths: "比宇宙原子还多" },
];

// 04 笨办法：把每条路都试一遍 → 组合爆炸
export const Exhaustive: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 本幕 48 拍（3 个乐句）
  // 乐句 1：越换越快地把全部路径过一遍，第 16 拍重拍定格在 78 条
  // 乐句 2：规模逐级放大，第 32 拍重拍盖上「算不完！」
  // 乐句 3 末尾：招牌转场倒数（HeroWipe）
  const runFrom = k(2);
  const runTo = k(16);
  const ease = interpolate(t, [runFrom, runTo], [0, 1], CL) ** 2.2;
  const idx = t < runFrom ? -1 : Math.min(ALL_PATHS.length - 1, Math.floor(ease * ALL_PATHS.length));
  const cur = idx >= 0 ? ALL_PATHS[idx] : null;
  const count = idx + 1;
  const growAt = (i: number) => k(20 + i * 4);
  const banAt = k(32);
  const ban = pop(t, banAt, 9);
  const capAt = k(34);

  return (
    <>
      <Chapter t={t} step="04" title="笨办法：每条路都试一遍？" />
      <Stage>
        <RoadNet mode="graph" />
        {cur ? <PathLine key={idx} path={cur} p={1} color={P.amber} width={12} id="ex" /> : null}
        {NODES.map((_, i) => (
          <NodeDot key={i} i={i} ring={P.blue} r={18} />
        ))}
      </Stage>

      <div style={{ position: "absolute", left: 1360, top: 220, width: 500, fontFamily: FONT }}>
        <Card accent={P.amber}>
          <div style={{ fontSize: 30, color: P.sub, fontWeight: 700 }}>已经试了</div>
          <div style={{ fontFamily: MONO, fontSize: 110, fontWeight: 900, color: P.amber, transform: `scale(${1 + hit(t, runTo, 6) * 0.3})`, transformOrigin: "left center" }}>
            {Math.max(0, count)}
            <span style={{ fontSize: 36, color: P.sub }}> 条</span>
          </div>
          <div style={{ fontSize: 26, color: P.sub, fontFamily: MONO, height: 34 }}>{cur ? `这条：${pathCost(cur)} 分钟` : ""}</div>
        </Card>
        <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
          {GROWTH.map((g, i) => {
            const s = pop(t, growAt(i), 12);
            return (
              <div
                key={g.n}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 22px",
                  borderRadius: 18,
                  background: P.white,
                  border: `3px solid ${i === 2 ? P.red : P.line}`,
                  opacity: s,
                  transform: `translateX(${(1 - s) * 100}px)`,
                }}
              >
                <span style={{ fontSize: 28, color: P.sub }}>
                  <b style={{ fontFamily: MONO, color: P.ink }}>{g.n}</b> 个路口
                </span>
                <span style={{ fontSize: i === 2 ? 28 : 34, fontFamily: MONO, fontWeight: 900, color: i === 2 ? P.red : P.ink }}>{g.paths}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 红色禁令 */}
      {t >= banAt ? (
        <div
          style={{
            position: "absolute",
            left: 380,
            top: 380,
            padding: "20px 60px",
            border: `12px solid ${P.red}`,
            borderRadius: 30,
            color: P.red,
            background: `${P.white}e6`,
            fontFamily: FONT,
            fontSize: 120,
            fontWeight: 900,
            transform: `rotate(-10deg) scale(${2.2 - ban * 1.2})`,
            opacity: Math.min(1, ban * 1.5),
          }}
        >
          算不完！
        </div>
      ) : null}

      <Sub t={t} from={capAt} text="路口一多，路线组合就爆炸——穷举根本算不完" />
    </>
  );
};
