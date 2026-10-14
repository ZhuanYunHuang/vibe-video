import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, hit, MONO, pop, prog, SceneProps, useT } from "../../../shared";
import { glow, P, useK } from "../kit/theme";
import { Burst, MomentTag, Ripple, Slam, Stage, Sub, usePulse } from "../kit/ui";

const KEYS = ["Q", "W", "E", "R"];

// 拍 0~32 打游戏（冷开场，直接给具体画面，不剧透主题）：
//   0 钩子+游戏面板 / 2 血条 / 3 蓝条 / 5 小地图+准星 / 7·8 技能键位 / 11 比分跳「+1」/ 13 「双杀!+2」
//   ★16 五杀爆点（白闪+粒子+涟漪+金色大字+「×5」）/ 17 比分反超 / 18-21 连招逐键发光（21 强拍收）
//   24 字幕 / 26 时钟入 / 28-31 时针狂转+天黑 / 30「3 小时」砸入
export const Game: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const K = useK(start);
  const pulse = usePulse(start);
  const panelIn = pop(t, K(0), 12);
  const score = t >= K(17) ? "13 : 12" : t >= K(11) ? "12 : 12" : "12 : 11";
  const scoreHit = hit(t, K(11), 4) + hit(t, K(17), 4);
  const penta = t >= K(16);
  const dusk = interpolate(t, [K(28), K(32)], [0, 0.38], CL);
  const spin = interpolate(t, [K(28), K(31)], [0, 1440], CL);
  const clockIn = pop(t, K(26), 12);
  const flash = penta ? hit(t, K(16), 3) * 0.55 : 0;

  // 漂浮的战斗结算小字：+1 / +2 / ×5
  const floats = [
    { text: "+1", b: 11, x: 1130, y: 330 },
    { text: "+2", b: 13, x: 1230, y: 300 },
    { text: "×5", b: 16, x: 1080, y: 380, big: true },
  ];

  return (
    <Stage t={t}>
      {/* 冷开场钩子 */}
      {[
        { text: "这三个瞬间，", b: 0, x: 640, color: P.ink },
        { text: "你肯定经历过", b: 2, x: 1240, color: P.mint },
      ].map((h) =>
        t >= K(h.b) ? (
          <div
            key={h.b}
            style={{
              position: "absolute",
              left: h.x,
              top: 100,
              transform: `translate(-50%, -50%) scale(${pop(t, K(h.b), 10)}) translateY(${Math.sin(t / 18 + h.x) * 5}px)`,
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 900,
              color: h.color,
              textShadow: h.color === P.mint ? glow(P.mint, 0.5) : undefined,
            }}
          >
            {h.text}
          </div>
        ) : null,
      )}
      <MomentTag t={t} no="1 / 3" />

      <Ripple t={t} x={960} y={510} froms={[K(16), K(18), K(21)]} r0={320} gap={90} bright={0.8} />
      <Burst t={t} from={K(16)} x={960} y={480} spread={340} size={14} />

      {/* 游戏画面面板 */}
      <div
        style={{
          position: "absolute",
          left: 440,
          top: 200,
          width: 1040,
          height: 620,
          borderRadius: 26,
          background: "#05271F",
          border: `3px solid ${P.line}`,
          boxShadow: `0 0 ${50 + flash * 120}px ${P.mint}44, inset 0 0 60px #00000088`,
          opacity: panelIn,
          transform: `scale(${panelIn * (1 + hit(t, K(16), 5) * 0.015)}) rotate(${hit(t, K(16), 4) * (t % 2 === 0 ? 0.5 : -0.5)}deg)`,
          overflow: "hidden",
        }}
      >
        {/* 血条 / 蓝条 */}
        <div style={{ position: "absolute", left: 60, top: 50, width: 300 }}>
          <div style={{ height: 22, borderRadius: 11, background: "#3a0d12", overflow: "hidden", border: `2px solid ${P.line}` }}>
            <div style={{ width: `${prog(t, K(2), 14) * 96}%`, height: "100%", background: `linear-gradient(90deg, #35d07a, #7dffb0)`, boxShadow: `0 0 ${12 + pulse * 14}px #35d07a88` }} />
          </div>
          <div style={{ height: 14, marginTop: 10, borderRadius: 7, background: "#0d1a3a", overflow: "hidden", border: `2px solid ${P.line}` }}>
            <div style={{ width: `${prog(t, K(3), 14) * 80}%`, height: "100%", background: "#3f7dff" }} />
          </div>
          <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 26, color: P.sub }}>
            LV.<span style={{ color: P.gold, fontWeight: 900 }}>{t >= K(16) ? 15 : 14}</span>
          </div>
        </div>
        {/* 小地图 */}
        <div style={{ position: "absolute", right: 50, top: 50, width: 180, height: 120, borderRadius: 12, background: "#041b15", border: `2px solid ${P.line}`, opacity: prog(t, K(5), 12) }}>
          {[
            { x: 40, y: 30, c: P.mint },
            { x: 120, y: 60, c: P.mint },
            { x: 90, y: 90, c: P.coral },
          ].map((d, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: d.x + Math.sin(t / 14 + i * 2) * 16,
                top: d.y + Math.cos(t / 17 + i) * 12,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: d.c,
                boxShadow: `0 0 8px ${d.c}`,
                opacity: 0.6 + 0.4 * Math.sin(t / 5 + i * 2),
              }}
            />
          ))}
        </div>
        {/* 比分：随节拍呼吸脉冲 */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 46,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 64,
            fontWeight: 900,
            color: P.ink,
            transform: `scale(${(1 + scoreHit * 0.22) * (1 + pulse * 0.05)})`,
          }}
        >
          <span style={{ color: P.mint, textShadow: glow(P.mint, 0.4 + pulse * 0.6) }}>{score}</span>
        </div>
        {/* 中央准星 */}
        <div style={{ position: "absolute", left: 508 + Math.sin(t / 9) * 26, top: 298 + Math.cos(t / 11) * 20, color: `${P.ink}55`, fontSize: 44, fontFamily: MONO }}>+</div>
        {/* 技能键位 */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", justifyContent: "center", gap: 24 }}>
          {KEYS.map((key, i) => {
            const inAt = K(7) + i * 0.5;
            const comboAt = K(18) + i;
            const active = t >= comboAt && t < comboAt + 12;
            return (
              <div
                key={key}
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 16,
                  background: active ? P.mint : "#0a2e26",
                  border: `3px solid ${active ? P.gold : P.line}`,
                  color: active ? P.abyss : P.sub,
                  fontFamily: MONO,
                  fontSize: 44,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pop(t, inAt, 10),
                  transform: `translateY(${Math.sin(t / 20 + i * 1.7) * 4}px) scale(${(active ? 1.14 + hit(t, comboAt, 3) * 0.1 : 1 + pulse * 0.04) * (0.8 + 0.2 * pop(t, inAt, 10))})`,
                  boxShadow: active ? `0 0 ${28 + hit(t, comboAt, 3) * 40}px ${P.mint}` : undefined,
                }}
              >
                {key}
              </div>
            );
          })}
        </div>
        {/* 击杀提示 */}
        {t >= K(13) && !penta ? (
          <div style={{ position: "absolute", right: 60, top: 210, fontFamily: FONT, fontSize: 40, fontWeight: 900, color: P.coral, opacity: pop(t, K(13), 10), transform: `rotate(${Math.sin(t / 7) * 3}deg)` }}>
            双杀！
          </div>
        ) : null}
        {/* 五杀金光大字 */}
        {penta ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 240,
              textAlign: "center",
              fontFamily: FONT,
              fontSize: 110,
              fontWeight: 900,
              color: P.gold,
              textShadow: glow(P.gold, 2 + Math.sin(t / 8) * 0.5),
              transform: `scale(${pop(t, K(16), 9) * (1 + hit(t, K(16), 4) * 0.12 + pulse * 0.03)}) rotate(-3deg)`,
            }}
          >
            五 杀 ！
          </div>
        ) : null}
      </div>
      {/* 五杀白闪 + 漂浮结算小字 */}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash, pointerEvents: "none" }} />
      {floats.map((f) => {
        if (t < K(f.b) || t > K(f.b) + 40) return null;
        const rise = ((t - K(f.b)) / 40) * 90;
        return (
          <div
            key={f.text}
            style={{
              position: "absolute",
              left: f.x,
              top: f.y - rise,
              transform: `translate(-50%, -50%) scale(${pop(t, K(f.b), 8)})`,
              opacity: 1 - (t - K(f.b)) / 40,
              fontFamily: MONO,
              fontSize: f.big ? 90 : 56,
              fontWeight: 900,
              color: P.gold,
              textShadow: glow(P.gold),
            }}
          >
            {f.text}
          </div>
        );
      })}

      {/* 右侧：时钟 + 3小时 */}
      {t >= K(26) ? (
        <div style={{ position: "absolute", left: 1600 - 150, top: 400 - 150, opacity: clockIn, transform: `scale(${clockIn}) rotate(${Math.sin(t / 6) * (t < K(28) ? 1.2 : 0)}deg)` }}>
          <div style={{ width: 300, height: 300, borderRadius: "50%", border: `6px solid ${P.sub}`, position: "relative" }}>
            {[0, 90, 180, 270].map((a) => (
              <div key={a} style={{ position: "absolute", left: 146, top: 12, width: 6, height: 20, background: P.sub, transformOrigin: "3px 138px", transform: `rotate(${a}deg)` }} />
            ))}
            <div style={{ position: "absolute", left: 146, top: 54, width: 8, height: 100, borderRadius: 4, background: P.mint, transformOrigin: "4px 96px", transform: `rotate(${spin}deg)`, boxShadow: `0 0 12px ${P.mint}` }} />
            <div style={{ position: "absolute", left: 145, top: 90, width: 10, height: 62, borderRadius: 5, background: P.ink, transformOrigin: "5px 60px", transform: `rotate(${spin / 12}deg)` }} />
          </div>
        </div>
      ) : null}
      {t >= K(29) ? (
        <div style={{ position: "absolute", left: 1600, top: 640, transform: "translate(-50%, -50%)", fontFamily: FONT, fontSize: 46, fontWeight: 800, color: P.ink, opacity: pop(t, K(29), 10) }}>
          一抬头——
        </div>
      ) : null}
      <Slam t={t} from={K(30)} x={1600} y={780} size={116} color={P.gold} glowColor={P.gold}>
        3 小时
      </Slam>

      <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dusk }} />
      <Sub t={t} from={K(5)} to={K(16)} text="「赢了这局就睡。」" />
      <Sub t={t} from={K(16)} to={K(24)} text="手替脑子在玩，根本停不下来" />
      <Sub t={t} from={K(24)} to={K(29)} text="状态好的时候，怎么打怎么有" />
    </Stage>
  );
};
