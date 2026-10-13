import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "../../shared";
import { NodeDot, PathLine, Pin, RoadNet, Stage } from "./kit/MapKit";
import { BEST_PATH, END, GRAD, NODES, P, START } from "./kit/theme";
import { MapTexture } from "./kit/ui";

// 封面（静态 Still）：浅色地图 + 路网 + 蓝绿最优路线 + 标题。不使用任何节拍 context
export const Cover: React.FC = () => (
  <AbsoluteFill style={{ background: P.bg, fontFamily: FONT }}>
    <MapTexture opacity={0.7} />
    <Stage style={{ transform: "translate(560px, 180px) scale(0.9)" }}>
      <RoadNet mode="road" traffic={1} />
      <PathLine path={BEST_PATH} p={1} id="cover" width={22} />
      {NODES.map((_, i) => (
        <NodeDot key={i} i={i} r={16} ring={P.blue} />
      ))}
      <Pin x={NODES[START].x} y={NODES[START].y} color={P.blue} s={1.2} />
      <Pin x={NODES[END].x} y={NODES[END].y} color={P.teal} s={1.2} />
    </Stage>
    <div style={{ position: "absolute", left: 110, top: 150 }}>
      <div style={{ display: "inline-block", padding: "10px 26px", borderRadius: 18, background: GRAD, color: P.white, fontSize: 40, fontWeight: 900 }}>
        算法科普
      </div>
      <div style={{ marginTop: 34, fontSize: 130, fontWeight: 900, color: P.ink, lineHeight: 1.15 }}>
        导航怎么规划
        <br />
        <span style={{ background: GRAD, WebkitBackgroundClip: "text", color: "transparent" }}>最优路线</span>
        <span style={{ color: P.teal }}>？</span>
      </div>
      <div style={{ marginTop: 30, fontSize: 48, fontWeight: 700, color: P.sub }}>它到底在后台算了什么？</div>
      <div style={{ marginTop: 40, display: "flex", gap: 18 }}>
        {["Dijkstra", "A*", "最短路径"].map((s) => (
          <div key={s} style={{ padding: "10px 26px", borderRadius: 30, background: P.white, border: `4px solid ${P.teal}`, color: P.teal, fontSize: 36, fontWeight: 900 }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  </AbsoluteFill>
);
