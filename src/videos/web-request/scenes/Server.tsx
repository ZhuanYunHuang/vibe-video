import React from "react";
import { C, Caption, hit, NodeBox, Packet, pop, prog, SceneProps, SceneTitle, useAt, useT, Wire } from "../../../shared";

// 服务器端：CDN → 负载均衡 → 应用服务 → 缓存 / 数据库，再原路返回
export const Server: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const nodes: { pos: [number, number]; label: string; sub: string; icon: string; color: string; k: number }[] = [
    { pos: [230, 540], label: "请求", sub: "GET /", icon: "📨", color: C.cyan, k: 0 },
    { pos: [580, 540], label: "CDN", sub: "就近节点", icon: "🛰️", color: C.purple, k: 1 },
    { pos: [930, 540], label: "负载均衡", sub: "Nginx", icon: "⚖️", color: C.orange, k: 2 },
    { pos: [1280, 540], label: "应用服务", sub: "业务逻辑", icon: "⚙️", color: C.pink, k: 3 },
    { pos: [1660, 320], label: "缓存", sub: "Redis", icon: "⚡", color: C.red, k: 4 },
    { pos: [1660, 760], label: "数据库", sub: "MySQL", icon: "🗄️", color: C.green, k: 5 },
  ];
  const app = nodes[3].pos;

  return (
    <>
      <SceneTitle t={t} step="05" title="服务器：后厨忙起来" color={C.pink} />
      {nodes.slice(1).map((n, i) => {
        const prev = i < 3 ? nodes[i].pos : app;
        return <Wire key={n.label} from={prev} to={n.pos} color={n.color} p={prog(t, k(n.k) - 8, 8)} t={t} />;
      })}
      {nodes.map((n, i) => {
        const prev = i === 0 ? n.pos : i < 4 ? nodes[i - 1].pos : app;
        return (
          <React.Fragment key={n.label}>
            <NodeBox x={n.pos[0]} y={n.pos[1]} label={n.label} sub={n.sub} icon={n.icon} color={n.color} appear={pop(t, k(n.k))} glow={hit(t, k(n.k)) + hit(t, k(n.k + 4))} w={260} />
            {i > 0 ? <Packet from={prev} to={n.pos} p={prog(t, k(n.k) - 10, 10)} color={n.color} /> : null}
          </React.Fragment>
        );
      })}
      {/* 回程：数据库 → 应用 → 一路回到请求 */}
      <Packet from={nodes[5].pos} to={app} p={prog(t, k(6), 10)} color={C.green} label="查询结果" />
      <Packet from={app} to={nodes[0].pos} p={prog(t, k(7), k(9) - k(7))} color={C.yellow} label="HTML 出锅" />
      {/* 计时器 */}
      <div style={{ position: "absolute", right: 120, top: 80, fontSize: 40, fontWeight: 900, color: C.yellow, fontFamily: "monospace", opacity: pop(t, k(1)) }}>
        ⏱ {Math.min(48, Math.max(0, Math.round((t / k(9)) * 48)))} ms
      </div>
      <Caption t={t} from={k(7)} text="一次请求，可能穿过十几台机器" />
    </>
  );
};
