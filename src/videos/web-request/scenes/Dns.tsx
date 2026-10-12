import React from "react";
import { C, Caption, hit, MONO, NodeBox, Packet, pop, prog, SceneProps, SceneTitle, useAt, useT, Wire } from "../../../shared";

// DNS 解析：缓存未命中 → 递归解析器依次问 根 / .com / 权威 → 拿到 IP
export const Dns: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const me: [number, number] = [260, 560];
  const resolver: [number, number] = [760, 560];
  const servers: { pos: [number, number]; label: string; sub: string; icon: string; color: string; ask: number }[] = [
    { pos: [1420, 300], label: "根服务器", sub: ".", icon: "🌐", color: C.purple, ask: 4 },
    { pos: [1600, 560], label: "顶级域", sub: ".com", icon: "🏛️", color: C.orange, ask: 6 },
    { pos: [1420, 820], label: "权威服务器", sub: "example.com", icon: "📒", color: C.green, ask: 8 },
  ];
  const ipAt = k(10);
  const gotIp = t >= k(11);

  return (
    <>
      <SceneTitle t={t} step="01" title="DNS 解析：先查门牌号" color={C.purple} />
      <NodeBox x={me[0]} y={me[1]} label="浏览器" icon="💻" color={C.cyan} appear={pop(t, 0)} glow={hit(t, k(11))} />
      {/* 本地缓存：逐拍检查，未命中 */}
      {["浏览器缓存", "系统 hosts", "路由器缓存"].map((name, i) => {
        const f = k(1) + i * Math.round(k(1) / 2);
        const s = pop(t, f, 12);
        const fade = 1 - prog(t, k(3), 8);
        return (
          <div
            key={name}
            style={{
              position: "absolute",
              left: 150,
              top: 220 + i * 70,
              fontSize: 28,
              fontFamily: MONO,
              color: C.dim,
              opacity: s * fade,
              transform: `translateX(${(1 - s) * -60}px)`,
            }}
          >
            {name} <span style={{ color: C.red, fontWeight: 900 }}>✗ 未命中</span>
          </div>
        );
      })}
      <Wire from={me} to={resolver} color={C.cyan} p={prog(t, k(2), 10)} t={t} />
      <NodeBox x={resolver[0]} y={resolver[1]} label="递归解析器" sub="8.8.8.8" icon="🔎" color={C.yellow} appear={pop(t, k(2))} glow={hit(t, k(3)) + hit(t, ipAt)} w={290} />
      <Packet from={me} to={resolver} p={prog(t, k(2), k(3) - k(2))} color={C.cyan} />

      {servers.map((s) => {
        const askF = k(s.ask);
        const backF = k(s.ask + 1);
        return (
          <React.Fragment key={s.label}>
            <Wire from={resolver} to={s.pos} color={s.color} p={prog(t, askF - 6, 8)} t={t} />
            <NodeBox x={s.pos[0]} y={s.pos[1]} label={s.label} sub={s.sub} icon={s.icon} color={s.color} appear={pop(t, askF - 6)} glow={hit(t, askF)} w={290} />
            <Packet from={resolver} to={s.pos} p={prog(t, askF - 8, 8)} color={s.color} />
            <Packet from={s.pos} to={resolver} p={prog(t, askF + 2, backF - askF - 2)} color={s.color} label={s.ask === 8 ? "93.184.216.34" : "问下一个"} />
          </React.Fragment>
        );
      })}

      <Packet from={resolver} to={me} p={prog(t, ipAt, k(11) - ipAt)} color={C.green} label="IP 到手" />
      {gotIp ? (
        <div
          style={{
            position: "absolute",
            left: 90,
            top: 700,
            fontFamily: MONO,
            fontSize: 40,
            fontWeight: 900,
            color: C.green,
            transform: `scale(${pop(t, k(11), 8)})`,
          }}
        >
          93.184.216.34
        </div>
      ) : null}
      <Caption t={t} from={k(4)} text="域名是给人看的，机器只认 IP 地址" />
    </>
  );
};
