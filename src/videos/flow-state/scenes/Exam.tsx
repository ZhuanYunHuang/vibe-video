import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, MONO, pop, prog, SceneProps, useT } from "../../../shared";
import { glow, P, useK } from "../kit/theme";
import { Burst, GlassCard, MomentTag, Ripple, Slam, Stage, Sub, usePulse } from "../kit/ui";

// 拍 32~64 考试（瞬间 2/3）：
//   33 开考铃+卷子 / 34-36 周围杂音 / 37-47 逐题打勾（37·39·41·43·45·47）
//   △48 跳变「最后一题写完」+ 粒子 + 倒计时 48→56 / 61 收卷铃（强拍）/ 62 字幕（强拍）
export const Exam: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const pulse = usePulse(start);
  const rows = [37, 39, 41, 43, 45, 47];
  const noises = [
    { text: "咳嗽声", b: 34, x: 1350, y: 320 },
    { text: "翻卷子声", b: 35, x: 1590, y: 450 },
    { text: "监考的脚步", b: 36, x: 1380, y: 590 },
  ];
  const silence = prog(t, K(45), 10);
  const done = t >= K(48);
  const paperIn = pop(t, K(33), 12);
  const remain = Math.max(0, Math.round(interpolate(t, [K(48), K(56)], [120, 0], CL)));

  return (
    <Stage t={t}>
      <MomentTag t={t} no="2 / 3" />
      <Ripple t={t} x={620} y={560} froms={[K(37), K(41), K(45), K(48)]} r0={360} gap={60} bright={0.6} />
      <GlassCard x={620} y={570} w={560} h={680} appear={paperIn} lit={hit(t, K(48), 10)}>
        <div style={{ fontSize: 40, fontWeight: 900, marginBottom: 26, letterSpacing: 6 }}>期 末 考 试</div>
        {rows.map((b, i) => {
          const ok = t >= K(b);
          const s = pop(t, K(b), 9);
          return (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 22, width: 420, height: 72 }}>
              <div style={{ fontFamily: MONO, fontSize: 30, color: P.sub, width: 40 }}>{i + 1}.</div>
              <div style={{ flex: 1, height: 10, borderRadius: 5, background: P.line, overflow: "hidden" }}>
                <div style={{ width: `${prog(t, K(b) - 14, 14) * 100}%`, height: "100%", background: P.mint }} />
              </div>
              <div
                style={{
                  width: 50,
                  fontSize: 44,
                  fontWeight: 900,
                  color: done ? P.gold : P.mint,
                  transform: `scale(${ok ? s * (1 + hit(t, K(b), 3) * 0.4) : 0}) rotate(${Math.sin((t - K(b)) / 4) * 8}deg)`,
                }}
              >
                ✓
              </div>
            </div>
          );
        })}
      </GlassCard>
      {/* 笔尖：持续书写摆动 */}
      {t >= K(37) ? (
        <div
          style={{
            position: "absolute",
            left: 950 + Math.sin(t / 3) * 10,
            top: 180 + Math.cos(t / 2.6) * 12,
            fontSize: 120,
            transform: `rotate(${14 + Math.sin(t / 2.2) * 16 * (done ? 0 : 1)}deg)`,
            opacity: pop(t, K(37), 12),
          }}
        >
          ✏️
        </div>
      ) : null}

      {/* 右侧：杂音，45 拍一起"静音"，未静音时持续晃动 */}
      {noises.map((n) =>
        t >= K(n.b) ? (
          <div
            key={n.text}
            style={{
              position: "absolute",
              left: n.x + Math.sin(t / 3.4 + n.y) * 8 * (1 - silence),
              top: n.y,
              transform: `translate(-50%, -50%) scale(${pop(t, K(n.b), 10) * (1 - silence * 0.4)})`,
              opacity: 1 - silence,
              filter: `blur(${silence * 10}px)`,
              fontFamily: FONT,
              fontSize: 44,
              fontWeight: 800,
              color: P.coral,
            }}
          >
            🔊 {n.text}
          </div>
        ) : null,
      )}
      {t >= K(45) && !done ? (
        <div style={{ position: "absolute", left: 1450, top: 470, transform: `translate(-50%, -50%) scale(${1 + pulse * 0.04})`, fontFamily: FONT, fontSize: 64, fontWeight: 900, color: P.sub, opacity: silence }}>
          🔇 世界安静了
        </div>
      ) : null}

      {/* △48：最后一题写完 + 粒子 */}
      <Burst t={t} from={K(48)} x={1450} y={430} spread={260} size={12} colors={[P.gold, "#fff", P.mint]} />
      <Slam t={t} from={K(48)} x={1450} y={430} size={84} color={P.gold} glowColor={P.gold}>
        最后一题，写完了
      </Slam>
      {done ? (
        <div
          style={{
            position: "absolute",
            left: 1450,
            top: 590,
            transform: `translate(-50%, -50%) scale(${1 + pulse * 0.05})`,
            fontFamily: MONO,
            fontSize: 56,
            fontWeight: 900,
            color: remain === 0 ? P.coral : P.ink,
            textShadow: remain === 0 ? glow(P.coral, 1 + hit(t, K(61), 5)) : undefined,
          }}
        >
          剩余 {String(Math.floor(remain / 60)).padStart(2, "0")}:{String(remain % 60).padStart(2, "0")}
        </div>
      ) : null}
      {t >= K(61) ? (
        <div style={{ position: "absolute", left: 1640, top: 700, fontSize: 120, transform: `scale(${pop(t, K(61), 8)}) rotate(${Math.sin((t - K(61)) / 1.5) * 20 * hit(t, K(61), 14)}deg)` }}>🔔</div>
      ) : null}

      <Sub t={t} from={K(37)} to={K(48)} text="笔尖停不下来，一题接一题" />
      <Sub t={t} from={K(48)} to={K(61)} text="一抬头：还剩最后两分钟" />
      <Sub t={t} from={K(62)} text="两个小时，像只过了二十分钟" color={P.gold} />
    </Stage>
  );
};
