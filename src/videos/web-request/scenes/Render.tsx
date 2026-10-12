import React from "react";
import { interpolate } from "remotion";
import { CL, C, Caption, FONT, hit, MONO, pop, prog, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

// DOM 树节点（相对坐标）
const TREE: { x: number; y: number; label: string; parent: number }[] = [
  { x: 0, y: 0, label: "html", parent: -1 },
  { x: -150, y: 110, label: "head", parent: 0 },
  { x: 150, y: 110, label: "body", parent: 0 },
  { x: -220, y: 220, label: "title", parent: 1 },
  { x: -80, y: 220, label: "link", parent: 1 },
  { x: 70, y: 220, label: "h1", parent: 2 },
  { x: 230, y: 220, label: "div", parent: 2 },
];

const PIPE = [
  { name: "解析 HTML", color: C.cyan },
  { name: "DOM + CSSOM", color: C.purple },
  { name: "布局 Layout", color: C.orange },
  { name: "绘制 Paint", color: C.pink },
  { name: "合成 Composite", color: C.green },
];

// 浏览器渲染流水线：每两拍点亮一个阶段
export const Render: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const stageAt = (i: number) => k(i * 2);
  const stage = PIPE.reduce((acc, _, i) => (t >= stageAt(i) ? i : acc), 0);

  return (
    <>
      <SceneTitle t={t} step="06" title="渲染：把代码变成画面" color={C.orange} />
      {/* 顶部流水线 */}
      <div style={{ position: "absolute", top: 210, left: 110, right: 110, display: "flex", gap: 20 }}>
        {PIPE.map((p, i) => {
          const on = t >= stageAt(i);
          return (
            <div
              key={p.name}
              style={{
                flex: 1,
                height: 90,
                borderRadius: 18,
                background: on ? p.color : C.panel,
                color: on ? C.bg : C.dim,
                border: `3px solid ${p.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 32,
                transform: `scale(${1 + hit(t, stageAt(i), 4) * 0.12}) translateY(${(1 - pop(t, i * 3)) * -80}px)`,
                opacity: pop(t, i * 3),
              }}
            >
              {p.name}
            </div>
          );
        })}
      </div>

      {/* 舞台区域，根据阶段切换内容 */}
      <div style={{ position: "absolute", left: 160, top: 360, width: 1600, height: 560 }}>
        {stage === 0 ? (
          <div style={{ fontFamily: MONO, fontSize: 34, color: C.cyan, lineHeight: 1.6, paddingLeft: 400 }}>
            {["<html>", "  <head><link href=style.css></head>", "  <body>", "    <h1>Hello</h1>", "  </body>", "</html>"].map((l, i) => (
              <div key={i} style={{ whiteSpace: "pre", opacity: interpolate(t, [i * 4, i * 4 + 4], [0, 1], CL) }}>
                {l}
              </div>
            ))}
          </div>
        ) : null}
        {stage === 1 ? (
          <svg width={1600} height={560}>
            {TREE.map((n, i) => {
              const s = pop(t, stageAt(1) + i * 3, 12);
              const p = n.parent >= 0 ? TREE[n.parent] : null;
              return (
                <g key={n.label} transform={`translate(800 ${80})`} opacity={s}>
                  {p ? <line x1={p.x * 1.6} y1={p.y * 1.5} x2={n.x * 1.6 * s + p.x * 1.6 * (1 - s)} y2={n.y * 1.5} stroke={C.purple} strokeWidth={4} /> : null}
                  <rect x={n.x * 1.6 - 70} y={n.y * 1.5 - 30} width={140} height={60} rx={14} fill={C.panel} stroke={C.purple} strokeWidth={4} />
                  <text x={n.x * 1.6} y={n.y * 1.5 + 11} textAnchor="middle" fill={C.text} fontSize={30} fontFamily="monospace">
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : null}
        {stage === 2 ? (
          // 布局：线框盒子逐个定位
          <div style={{ position: "relative", width: 900, height: 520, margin: "0 auto", border: `3px dashed ${C.orange}`, borderRadius: 12 }}>
            {[
              { l: 20, tp: 20, w: 860, h: 80 },
              { l: 20, tp: 120, w: 560, h: 380 },
              { l: 600, tp: 120, w: 280, h: 180 },
              { l: 600, tp: 320, w: 280, h: 180 },
            ].map((b, i) => {
              const s = pop(t, stageAt(2) + i * 4, 12);
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: b.l,
                    top: b.tp,
                    width: b.w * s,
                    height: b.h,
                    border: `3px solid ${C.orange}`,
                    borderRadius: 10,
                    fontFamily: MONO,
                    fontSize: 22,
                    color: C.orange,
                    padding: 8,
                    overflow: "hidden",
                  }}
                >
                  {Math.round(b.w)}×{b.h}
                </div>
              );
            })}
          </div>
        ) : null}
        {stage >= 3 ? <PaintedPage t={t} paintAt={stageAt(3)} compAt={stageAt(4)} /> : null}
      </div>
      <Caption t={t} from={k(1)} text="解析 → 建树 → 算位置 → 上色 → 合成，一帧画面诞生" />
    </>
  );
};

// 绘制 + 合成：色块刷入，合成阶段图层分离再合并
const PaintedPage: React.FC<{ t: number; paintAt: number; compAt: number }> = ({ t, paintAt, compAt }) => {
  const brush = prog(t, paintAt, 20);
  const comp = t >= compAt;
  const split = comp ? Math.sin(prog(t, compAt, 24) * Math.PI) : 0;
  const layers = [
    { l: 20, tp: 20, w: 860, h: 80, c: C.cyan },
    { l: 20, tp: 120, w: 560, h: 380, c: C.purple },
    { l: 600, tp: 120, w: 280, h: 180, c: C.pink },
    { l: 600, tp: 320, w: 280, h: 180, c: C.yellow },
  ];
  return (
    <div style={{ position: "relative", width: 900, height: 520, margin: "0 auto", background: "#f8fafc", borderRadius: 12, clipPath: `inset(0 ${(1 - brush) * 100}% 0 0)` }}>
      {layers.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.l,
            top: b.tp,
            width: b.w,
            height: b.h,
            borderRadius: 10,
            background: b.c,
            transform: `translate(${split * (i - 1.5) * 60}px, ${split * (i - 1.5) * -40}px)`,
            boxShadow: split > 0.05 ? "0 20px 40px #0006" : undefined,
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 50, top: 38, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: C.bg }}>Hello, Web</div>
    </div>
  );
};
