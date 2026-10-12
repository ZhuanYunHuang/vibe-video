import React from "react";
import { interpolate } from "remotion";
import { CL, C, Caption, FONT, hit, MONO, NodeBox, Packet, pop, prog, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

const HEX = "0123456789ABCDEF";
// 伪随机密文（确定性，避免每帧闪烁不一致）
const cipher = (seed: number, len: number) => {
  let s = "";
  let x = seed * 9301 + 49297;
  for (let i = 0; i < len; i++) {
    x = (x * 9301 + 49297) % 233280;
    s += HEX[x % 16];
  }
  return s;
};

// TLS 握手：证书校验 → 交换密钥 → 加密通道
export const Tls: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const A: [number, number] = [380, 500];
  const B: [number, number] = [1540, 500];
  const certAt = k(3);
  const checkAt = k(5);
  const keyAt = k(7);
  const lockAt = k(9);
  const locked = t >= lockAt;
  const lockS = pop(t, lockAt, 8);
  const shake = t >= lockAt ? Math.sin(t * 2.2) * hit(t, lockAt, 6) * 20 : 0;

  return (
    <>
      <SceneTitle t={t} step="03" title="TLS 握手：给通话加把锁" color={C.green} />
      <NodeBox x={A[0]} y={A[1]} label="浏览器" icon="💻" color={C.cyan} appear={pop(t, 0)} glow={hit(t, checkAt)} />
      <NodeBox x={B[0]} y={B[1]} label="服务器" icon="🖥️" color={C.pink} appear={pop(t, 0)} glow={hit(t, k(1))} />

      <Packet from={A} to={B} p={prog(t, k(1) - 10, 10)} color={C.cyan} label="Client Hello" />
      <Packet from={B} to={A} p={prog(t, certAt - 12, 12)} color={C.yellow} label="📜 证书" />

      {/* 证书卡片 */}
      {t >= certAt ? (
        <div
          style={{
            position: "absolute",
            left: 640,
            top: 260,
            width: 640,
            padding: 30,
            borderRadius: 24,
            background: "#1c2547",
            border: `4px solid ${C.yellow}`,
            fontFamily: FONT,
            color: C.text,
            fontSize: 30,
            transform: `scale(${pop(t, certAt, 11)}) rotate(${(1 - pop(t, certAt, 11)) * 10}deg)`,
            opacity: 1 - prog(t, keyAt, 8),
          }}
        >
          <div style={{ fontSize: 40, fontWeight: 900, color: C.yellow }}>📜 数字证书</div>
          <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 26, color: C.dim }}>颁发给：www.example.com</div>
          <div style={{ fontFamily: MONO, fontSize: 26, color: C.dim }}>颁发者：受信任的 CA</div>
          <div
            style={{
              marginTop: 16,
              fontSize: 36,
              fontWeight: 900,
              color: C.green,
              opacity: t >= checkAt ? 1 : 0,
              transform: `scale(${1 + hit(t, checkAt, 4) * 0.4})`,
              transformOrigin: "left center",
            }}
          >
            ✓ 校验通过，是真的它
          </div>
        </div>
      ) : null}

      {/* 交换密钥：两把钥匙飞向中间合体 */}
      {t >= keyAt && !locked
        ? [A, B].map((p, i) => {
            const q = prog(t, keyAt, lockAt - keyAt);
            const x = p[0] + (960 - p[0]) * q;
            return (
              <div key={i} style={{ position: "absolute", left: x - 40, top: 460 - Math.sin(q * Math.PI) * 120, fontSize: 80, transform: `rotate(${q * 360 * (i ? -1 : 1)}deg)` }}>
                🔑
              </div>
            );
          })
        : null}

      {locked ? (
        <>
          {/* 加密隧道 */}
          <div
            style={{
              position: "absolute",
              left: A[0] + 130,
              top: 450,
              width: (B[0] - A[0] - 260) * interpolate(t, [lockAt, lockAt + 12], [0, 1], CL),
              height: 100,
              borderRadius: 50,
              border: `5px solid ${C.green}`,
              background: "#4ade8018",
              overflow: "hidden",
              fontFamily: MONO,
              fontSize: 30,
              color: C.green,
              whiteSpace: "nowrap",
              lineHeight: "90px",
            }}
          >
            <span style={{ display: "inline-block", transform: `translateX(${-((t * 6) % 600)}px)` }}>{cipher(3, 90)}</span>
          </div>
          <div style={{ position: "absolute", left: 900 + shake, top: 410, fontSize: 130, transform: `scale(${lockS})` }}>🔒</div>
        </>
      ) : null}
      <Caption t={t} from={k(9)} text="从此传输的内容，路上谁截到都只是乱码" color={C.green} />
    </>
  );
};
