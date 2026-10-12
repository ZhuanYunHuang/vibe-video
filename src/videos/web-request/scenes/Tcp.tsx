import React from "react";
import { interpolate } from "remotion";
import { CL, C, Caption, FONT, hit, MONO, NodeBox, Packet, pop, prog, SceneProps, SceneTitle, useAt, useT, Wire } from "../../../shared";

// TCP 三次握手：每两拍一个包
export const Tcp: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const A: [number, number] = [380, 520];
  const B: [number, number] = [1540, 520];
  const steps = [
    { from: A, to: B, label: "SYN", desc: "在吗？", color: C.cyan, k: 2 },
    { from: B, to: A, label: "SYN + ACK", desc: "在的，你听得到吗？", color: C.pink, k: 4 },
    { from: A, to: B, label: "ACK", desc: "听到了，开聊！", color: C.yellow, k: 6 },
  ];
  const doneAt = k(8);
  const done = t >= doneAt;
  const bridge = interpolate(t, [doneAt, doneAt + 10], [0, 1], CL);

  return (
    <>
      <SceneTitle t={t} step="02" title="TCP 三次握手：先打个招呼" color={C.cyan} />
      <NodeBox x={A[0]} y={A[1]} label="浏览器" icon="💻" color={C.cyan} appear={pop(t, 0)} glow={hit(t, k(4) + 12)} />
      <NodeBox x={B[0]} y={B[1]} label="服务器" sub=":443" icon="🖥️" color={C.pink} appear={pop(t, k(1))} glow={hit(t, k(2) + 12) + hit(t, k(6) + 12)} />
      <Wire from={A} to={B} color={C.line} p={prog(t, k(1), 10)} t={t} />

      {steps.map((s, i) => {
        const f = k(s.k);
        const p = prog(t, f, 12);
        const shown = t >= f;
        return (
          <React.Fragment key={s.label}>
            <Packet from={s.from} to={s.to} p={p} color={s.color} label={s.label} />
            {/* 左侧时序日志 */}
            <div
              style={{
                position: "absolute",
                left: 560,
                top: 700 + i * 70,
                width: 800,
                display: "flex",
                gap: 24,
                alignItems: "center",
                fontFamily: FONT,
                fontSize: 32,
                opacity: shown ? pop(t, f, 14) : 0,
                transform: `translateX(${shown ? (1 - pop(t, f, 14)) * 60 : 60}px)`,
              }}
            >
              <span style={{ fontFamily: MONO, color: s.color, fontWeight: 900, width: 260 }}>
                {i + 1}. {s.label}
              </span>
              <span style={{ color: C.text }}>{s.desc}</span>
            </div>
          </React.Fragment>
        );
      })}

      {/* 连接建立：实线桥 + 印章 */}
      {done ? (
        <>
          <div
            style={{
              position: "absolute",
              left: A[0] + 130,
              top: A[1] - 8,
              height: 16,
              width: (B[0] - A[0] - 260) * bridge,
              borderRadius: 8,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.pink})`,
              boxShadow: `0 0 40px ${C.cyan}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 760,
              top: 330,
              width: 400,
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 60,
              fontWeight: 900,
              color: C.green,
              border: `6px solid ${C.green}`,
              borderRadius: 20,
              padding: "6px 0",
              transform: `rotate(-8deg) scale(${1 + (1 - pop(t, doneAt, 8)) * 1.5})`,
              opacity: pop(t, doneAt, 8),
            }}
          >
            连接建立 ✓
          </div>
        </>
      ) : null}
      <Caption t={t} from={k(9)} text="确认双方都能收、能发，才开始传数据" />
    </>
  );
};
