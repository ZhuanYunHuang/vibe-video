import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, pop, prog, SceneProps, useT } from "../../../shared";
import { glow, P, useK } from "../kit/theme";
import { Chapter, Slam, Stage, Sub, usePulse } from "../kit/ui";

// 坐标系：横轴=技能（你有多会），纵轴=挑战（事有多难）
const O = { x: 560, y: 920 };
const W = 1000;
const H = 720;
const pt = (sx: number, cy: number) => ({ x: O.x + sx * W, y: O.y - cy * H });

// 拍 144~240 心流通道：
//   145 坐标轴画出 / 148·149 轴标签 / 157★ 小人登场
//   176★ 焦虑区砸入（例：新手打高端局 180）/ 192★ 无聊区砸入（例：高手打人机 195）
//   209·215★ 小人在两区来回跳 / △208 界定字幕 / 224★ 心流通道沿对角一次画满 + 水流 dash 流动
//   229·233·237★ 小人沿通道逐拍向上走
export const Channel: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const pulse = usePulse(start);
  const axis = prog(t, K(145), 12);
  const band = prog(t, K(224), 14);

  // 小人位置关键帧：(技能, 挑战)
  const keys = [K(157), K(176), K(180), K(192), K(195), K(209), K(215), K(222), K(224), K(229), K(233), K(237)];
  const sx = [0.18, 0.15, 0.15, 0.8, 0.8, 0.2, 0.75, 0.35, 0.35, 0.5, 0.68, 0.85];
  const cy = [0.2, 0.8, 0.8, 0.15, 0.15, 0.75, 0.2, 0.33, 0.35, 0.52, 0.7, 0.86];
  const me = pt(interpolate(t, keys, sx, CL), interpolate(t, keys, cy, CL));
  const meIn = pop(t, K(157), 10);
  const lastHop = [157, 176, 192, 209, 215, 222, 224, 229, 233, 237].reduce((m, b) => (t >= K(b) ? b : m), 157);

  const tri = (pts: { x: number; y: number }[]) => pts.map((p) => `${p.x},${p.y}`).join(" ");
  const anx = tri([pt(0, 0.22), pt(0, 1), pt(0.78, 1)]);
  const bor = tri([pt(0.22, 0), pt(1, 0), pt(1, 0.78)]);
  const a = pt(0, 0);
  const b = pt(band, band);
  const off = 110;

  return (
    <Stage t={t}>
      <Chapter t={t} step="1" title="什么时候会出现？" />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <polygon points={anx} fill={P.coral} opacity={t >= K(176) ? 0.2 + hit(t, K(176), 6) * 0.4 + 0.04 * Math.sin(t / 26) : 0} />
        <polygon points={bor} fill={P.sub} opacity={t >= K(192) ? 0.18 + hit(t, K(192), 6) * 0.4 + 0.04 * Math.sin(t / 26 + 2) : 0} />
        {band > 0 ? (
          <>
            <polygon
              points={tri([
                { x: a.x, y: a.y - off },
                { x: b.x, y: b.y - off },
                { x: b.x + off * 0.9, y: b.y },
                { x: a.x + off * 0.9, y: a.y },
              ])}
              fill={P.mint}
              opacity={0.32 + hit(t, K(224), 8) * 0.5 + 0.05 * Math.sin(t / 20)}
              style={{ filter: `drop-shadow(0 0 20px ${P.mint})` }}
            />
            {/* 通道内的水流：dash 持续向右上方流动 */}
            <line
              x1={a.x + off * 0.45}
              y1={a.y - off * 0.45}
              x2={b.x + off * 0.45 + 400}
              y2={b.y - off * 0.45 - 400}
              stroke="#ffffff"
              strokeWidth={5}
              strokeDasharray="26 44"
              strokeDashoffset={-Math.max(0, t - K(224)) * 3.2}
              opacity={0.4}
              strokeLinecap="round"
            />
          </>
        ) : null}
        <line x1={O.x} y1={O.y} x2={O.x + W * axis} y2={O.y} stroke={P.ink} strokeWidth={5} />
        <line x1={O.x} y1={O.y} x2={O.x} y2={O.y - H * axis} stroke={P.ink} strokeWidth={5} />
      </svg>
      {[
        { text: "技能（你有多会）→", b: 148, x: O.x + W - 30, y: O.y - 44 },
        { text: "↑ 挑战（事有多难）", b: 149, x: O.x - 60, y: O.y - H - 44 },
      ].map((l) =>
        t >= K(l.b) ? (
          <div key={l.text} style={{ position: "absolute", left: l.x, top: l.y + Math.sin(t / 21 + l.x) * 4, transform: `translate(-50%, -50%) scale(${pop(t, K(l.b), 10)})`, fontFamily: FONT, fontSize: 38, fontWeight: 800, color: P.ink, whiteSpace: "nowrap" }}>
            {l.text}
          </div>
        ) : null,
      )}

      {/* 176★ 焦虑区 */}
      <Slam t={t} from={K(176)} x={pt(0.2, 0.86).x} y={pt(0.2, 0.86).y + Math.sin(t / 23) * 5} size={70} color={P.coral} glowColor={P.coral}>
        😰 焦虑
      </Slam>
      {t >= K(180) ? (
        <div style={{ position: "absolute", left: 120, top: 330, width: 380, fontFamily: FONT, fontSize: 34, color: P.coral, fontWeight: 700, opacity: pop(t, K(180), 12) }}>
          挑战 &gt; 技能
          <div style={{ color: P.sub, fontSize: 30, marginTop: 8 }}>新手直接打高端局</div>
        </div>
      ) : null}
      {/* 192★ 无聊区 */}
      <Slam t={t} from={K(192)} x={pt(0.82, 0.14).x} y={pt(0.82, 0.14).y + Math.cos(t / 25) * 5} size={70} color={P.sub} glowColor={P.sub}>
        🥱 无聊
      </Slam>
      {t >= K(195) ? (
        <div style={{ position: "absolute", left: 1600, top: 640, width: 300, fontFamily: FONT, fontSize: 34, color: P.sub, fontWeight: 700, opacity: pop(t, K(195), 12) }}>
          技能 &gt; 挑战
          <div style={{ fontSize: 30, marginTop: 8 }}>高手天天打人机</div>
        </div>
      ) : null}
      {/* 224★ 心流通道 */}
      <Slam t={t} from={K(224)} x={pt(0.56, 0.5).x + 120} y={pt(0.56, 0.5).y + 40} size={64} color={P.mint} glowColor={P.mint}>
        心流通道
      </Slam>

      {/* 小人：跳跃压弹 + 悬浮 */}
      {t >= K(157) ? (
        <div
          style={{
            position: "absolute",
            left: me.x,
            top: me.y + Math.sin(t / 12) * 4,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: P.gold,
            border: `4px solid ${P.ink}`,
            transform: `translate(-50%, -50%) scale(${meIn * (1 + hit(t, K(lastHop), 4) * 0.35)} ${meIn * (1 - hit(t, K(lastHop), 4) * 0.2)})`,
            boxShadow: glow(P.gold, 0.8 + pulse * 0.6),
          }}
        />
      ) : null}

      <Sub t={t} from={K(157)} to={K(176)} text="把「这件事有多难」和「你有多会」放在一起看" />
      <Sub t={t} from={K(209)} to={K(224)} text="太难会慌，太简单会烦" />
      <Sub t={t} from={K(229)} text="难度刚好够得着：你变强，挑战也跟着升级" color={P.mint} />
    </Stage>
  );
};
