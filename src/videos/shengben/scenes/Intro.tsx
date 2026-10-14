import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash, shake, Shockwave, SlamWord, Sparks } from "../kit/Fx";
import { glow, P, useSec } from "../kit/theme";
import { Sign } from "../kit/ui";

const CONTACTS = ["汽修二班 · 阿强", "汽修二班 · 大刘", "大专同学群(48)", "班主任 王老师"];

// 第 1 幕（b0–32）：醒来 → 自我设定 → 重拍①「专」炸裂 → 上岸 → 删同学
export const Intro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const sec = useSec(start);
  const PUNCH = k(8); // 「你不能本升专」的「专」

  const title = pop(t, 0, 12);
  const titleOut = interpolate(t, [sec(2.4), sec(3.2)], [1, 0], CL);
  const wake = t >= sec(0.35);
  const signOn = pop(t, sec(1.0), 12); // 「我考上了大专」
  // △16：「但是呢我现在专升本上岸了」校牌翻成本科
  const flip = prog(t, sec(6.6), 8);
  const deleteFrom = sec(11.3); // 「大专的同学我早就删掉了」
  const phone = pop(t, sec(10.55), 12);

  return (
    <div style={{ position: "absolute", inset: 0, transform: shake(t, [PUNCH]) }}>
      {/* 片名 */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 200,
          color: "#fff",
          WebkitTextStroke: `8px ${P.magenta}`,
          textShadow: glow(P.magenta, 1.6),
          opacity: title * titleOut,
          transform: `scale(${0.6 + title * 0.4})`,
        }}
      >
        升本后醒来
      </div>

      {/* 校牌：大专 → 本科 */}
      <div style={{ opacity: signOn, transform: `translateY(${(1 - signOn) * -60}px)` }}>
        <Sign x={960} y={110} w={760} color={flip > 0.5 ? P.yellow : P.cyan} text={flip > 0.5 ? "某某大学 · 本科" : "某某职业技术学院 · 大专"} />
      </div>

      <Dude
        x={flip > 0 ? 960 - flip * 380 : 960}
        y={980}
        s={1.35}
        mood={!wake ? "sleep" : t >= sec(6.6) ? "happy" : t >= PUNCH ? "angry" : "cool"}
        armR={t >= PUNCH && t < sec(6.4) ? 150 : t >= sec(2.75) && t < PUNCH ? 60 : 0}
        jump={t >= PUNCH ? Math.exp(-(t - PUNCH) / 6) * 80 : 0}
        tilt={!wake ? -8 : 0}
      />

      {/* 手机：删掉大专同学 */}
      {t >= sec(9.8) ? (
        <div
          style={{
            position: "absolute",
            left: 1080,
            top: 330,
            width: 470,
            height: 620,
            borderRadius: 40,
            background: "#0d1430",
            border: `8px solid ${P.ink}`,
            transform: `scale(${phone})`,
            padding: "40px 26px",
            fontFamily: FONT,
          }}
        >
          <div style={{ color: P.sub, fontSize: 30, marginBottom: 20 }}>通讯录</div>
          {CONTACTS.map((c, i) => {
            const d = prog(t, deleteFrom + i * at(start, 1.2), 6);
            return (
              <div key={c} style={{ position: "relative", fontSize: 34, color: "#fff", padding: "18px 10px", borderBottom: `2px solid ${P.line}`, opacity: 1 - d * 0.6 }}>
                {c}
                <div style={{ position: "absolute", left: 0, top: "50%", height: 6, width: `${d * 100}%`, background: P.red }} />
                {d > 0.9 ? <span style={{ position: "absolute", right: 10, color: P.red, fontWeight: 900 }}>已删除</span> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 重拍①：「专」 */}
      <Shockwave t={t} at={PUNCH} color={P.cyan} />
      <Sparks t={t} at={PUNCH} y={480} />
      <SlamWord t={t} at={PUNCH} text="专" color={P.cyan} size={520} until={sec(6.4)} />
      <Flash t={t} at={PUNCH} />
      <Flash t={t} at={sec(6.6)} color={P.yellow} max={0.5} />
    </div>
  );
};
