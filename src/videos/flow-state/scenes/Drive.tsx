import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, MONO, pop, SceneProps, useT } from "../../../shared";
import { glow, P, useK } from "../kit/theme";
import { Burst, Icon, MomentTag, Ripple, Slam, Stage, Sub, usePulse } from "../kit/ui";

// 拍 64~96 开车（瞬间 3/3）：
//   65 上车 / 68-78 公路线画出（虚线持续流动）+ 70-76 转弯·变道·红绿灯·让行逐个点亮
//   △80 跳变「到家」+ 粒子 + 里程定格 / 84★ 问号连击 / 88「完全想不起来」
export const Drive: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const pulse = usePulse(start);
  const road = "M 200 820 C 520 820, 520 520, 860 520 S 1200 260, 1500 300 S 1760 520, 1740 700";
  const len = 2200;
  const drawn = interpolate(t, [K(68), K(80)], [0, 1], CL);
  const events = [
    { text: "转弯", b: 70, x: 560, y: 640 },
    { text: "变道", b: 72, x: 980, y: 460 },
    { text: "红绿灯", b: 74, x: 1320, y: 250 },
    { text: "让行", b: 76, x: 1640, y: 450 },
  ];
  const home = t >= K(80);
  const km = Math.round(interpolate(t, [K(68), K(80)], [0, 23], CL));

  return (
    <Stage t={t}>
      <MomentTag t={t} no="3 / 3" />
      <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={road} stroke={P.line} strokeWidth={56} fill="none" strokeLinecap="round" opacity={pop(t, K(65), 14)} />
        <path
          d={road}
          stroke={P.mint}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - drawn)}
          style={{ filter: `drop-shadow(0 0 10px ${P.mint})` }}
        />
        {/* 中央虚线持续向前流动（画完后的"车流感"） */}
        <path
          d={road}
          stroke="#ffffff"
          strokeWidth={3}
          fill="none"
          strokeDasharray="26 52"
          strokeDashoffset={-t * 2.6}
          opacity={drawn * 0.3}
        />
      </svg>
      {events.map((e) =>
        t >= K(e.b) ? (
          <div
            key={e.text}
            style={{
              position: "absolute",
              left: e.x,
              top: e.y + Math.sin(t / 16 + e.x) * 5,
              transform: `translate(-50%, -50%) scale(${pop(t, K(e.b), 10) * (1 + hit(t, K(e.b), 3) * 0.3)})`,
              opacity: home ? 0.35 : 1,
              fontFamily: FONT,
              fontSize: 40,
              fontWeight: 800,
              color: P.ink,
              background: P.glass,
              border: `2px solid ${P.mint}`,
              padding: "6px 22px",
              borderRadius: 30,
            }}
          >
            ✓ {e.text}
          </div>
        ) : null,
      )}
      <Ripple t={t} x={260} y={540} froms={[K(65), K(68), K(72), K(76)]} r0={110} gap={50} bright={home ? 0.4 : 0.9} />
      {!home && t >= K(65) ? (
        <>
          {/* 行驶速度线 */}
          {[0, 1, 2].map((i) => {
            const lx = 420 - ((t * 7 + i * 34) % 110);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: lx,
                  top: 470 + i * 62,
                  width: 64,
                  height: 6,
                  borderRadius: 3,
                  background: P.mint,
                  opacity: 0.4 * (1 - (420 - lx) / 110),
                  boxShadow: `0 0 8px ${P.mint}`,
                }}
              />
            );
          })}
        </>
      ) : null}
      <Icon t={t} from={K(65)} x={260} y={540} emoji="🚗" size={140} />
      {t >= K(68) ? (
        <div style={{ position: "absolute", left: 140, top: 300, fontFamily: MONO, fontSize: 44, fontWeight: 900, color: P.sub, transform: `scale(${1 + pulse * 0.04})` }}>
          已行驶 <span style={{ color: P.mint }}>{km}</span> km
        </div>
      ) : null}

      {/* △80：到家 */}
      <Burst t={t} from={K(80)} x={1740} y={730} spread={220} size={12} colors={[P.gold, "#fff"]} />
      <Icon t={t} from={K(80)} x={1740} y={760} emoji="🏠" size={150} />
      <Slam t={t} from={K(80)} x={1240} y={760} size={96} color={P.gold} glowColor={P.gold}>
        咦？到家了
      </Slam>
      {[84, 86].map((b, i) =>
        t >= K(b) ? (
          <div
            key={b}
            style={{
              position: "absolute",
              left: 1500 + i * 110,
              top: 560 + Math.sin(t / 9 + i * 2) * 10,
              fontFamily: FONT,
              fontSize: 120,
              fontWeight: 900,
              color: P.coral,
              textShadow: glow(P.coral),
              transform: `scale(${pop(t, K(b), 8) * (1 + pulse * 0.05)}) rotate(${(i ? 1 : -1) * hit(t, K(b), 5) * 20}deg)`,
            }}
          >
            ？
          </div>
        ) : null,
      )}
      {t >= K(88) ? (
        <div style={{ position: "absolute", left: 1240, top: 560, transform: "translate(-50%, -50%)", fontFamily: FONT, fontSize: 44, fontWeight: 800, color: P.sub, opacity: pop(t, K(88), 12) }}>
          可我全程没出一次错
        </div>
      ) : null}

      <Sub t={t} from={K(70)} to={K(80)} text="看路、换挡、打方向，全程自动驾驶模式" />
      <Sub t={t} from={K(80)} to={K(88)} text="这一路是怎么开回来的？" />
      <Sub t={t} from={K(88)} text="想不起来，但一点都没出错" color={P.gold} />
    </Stage>
  );
};
