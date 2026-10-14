import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, pop, prog, SceneProps, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash, shake, Shockwave, SlamWord } from "../kit/Fx";
import { glow, P, useSec } from "../kit/theme";
import { Bubble } from "../kit/ui";

// 第 7 幕（b160–192）：毕业证 → 成人本科 → 不可能 → △176 惊醒（本后醒来）→ 我有一点疼 → 才不管呢
export const Crack: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const sec = useSec(start);

  const cert = pop(t, sec(77.6), 11); // 你看看你毕业证呢
  const stamp = sec(79.65); // 成人本科
  const no1 = sec(81.95); // 不 这不可能
  const no2 = sec(83.95); // 这不可能！
  const wake = sec(85.95); // 我在本后醒来（≈ △176）
  const hurt = sec(87.8); // 我有一点疼
  const careless = sec(92.45); // 专升本什么的 我才不管呢
  const crack = prog(t, no2, 6);
  const dream = t < wake;
  const darken = interpolate(t, [wake - 4, wake], [0, 1], CL);

  return (
    <div style={{ position: "absolute", inset: 0, transform: shake(t, [stamp, no1, no2, wake], 30) }}>
      {dream ? (
        <>
          {/* 毕业证 */}
          <div
            style={{
              position: "absolute",
              left: 1000,
              top: 230,
              width: 640,
              height: 460,
              borderRadius: 20,
              background: "#7a1022",
              border: `8px solid ${P.yellow}`,
              transform: `scale(${cert}) rotate(4deg)`,
              textAlign: "center",
              fontFamily: FONT,
              color: P.yellow,
              paddingTop: 60,
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 84, fontWeight: 900 }}>毕业证书</div>
            <div style={{ fontSize: 40, color: "#fff", marginTop: 30 }}>学历：本科</div>
            {t >= stamp ? (
              <div
                style={{
                  position: "absolute",
                  left: 120,
                  top: 220,
                  padding: "10px 30px",
                  border: `10px solid ${P.red}`,
                  color: P.red,
                  fontSize: 90,
                  fontWeight: 900,
                  transform: `rotate(-14deg) scale(${interpolate(t, [stamp, stamp + 4], [2.5, 1], CL)})`,
                  background: "#fff3",
                }}
              >
                成人本科
              </div>
            ) : null}
            {/* 裂纹 */}
            <svg width={640} height={460} style={{ position: "absolute", left: 0, top: 0, opacity: crack }}>
              <path d="M320 0 L290 120 L350 200 L280 300 L330 460 M290 120 L180 160 M350 200 L480 230" stroke="#fff" strokeWidth={8} fill="none" />
            </svg>
          </div>
          <Dude x={600} y={1000} s={1.3} mood={t >= no1 ? "shock" : "cool"} armL={t >= no1 ? 150 : 0} armR={t >= no1 ? 150 : 0} tilt={t >= no2 ? Math.sin(t / 2) * 4 : 0} />
          <Bubble t={t} from={sec(79.6)} until={stamp} x={600} y={420} text="你看看你毕业证呢？" color="#fff" />
          <SlamWord t={t} at={no1} text="不！" color={P.red} size={300} x={560} y={260} until={no2 - 2} />
          <SlamWord t={t} at={no2} text="这不可能！" color={P.red} size={210} y={180} until={wake - 4} rotate={-4} />
          <div style={{ position: "absolute", inset: 0, background: "#000", opacity: darken }} />
        </>
      ) : (
        <>
          {/* 醒来：卧室，原来是梦 */}
          <div style={{ position: "absolute", left: 360, top: 780, width: 1200, height: 160, borderRadius: 30, background: "#2a2f55", boxShadow: `0 0 0 6px ${P.line}` }} />
          <div style={{ position: "absolute", left: 360, top: 720, width: 300, height: 90, borderRadius: 40, background: "#e8ecff" }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 130,
              textAlign: "center",
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 120,
              color: "#fff",
              WebkitTextStroke: `5px ${P.cyan}`,
              textShadow: glow(P.cyan, 1.2),
              transform: `scale(${pop(t, wake, 10)})`,
            }}
          >
            {t >= careless ? "专升本？才不管呢" : "我在「本后」醒来"}
          </div>
          <Dude
            x={960}
            y={t >= careless ? 1000 : 820}
            s={1.2}
            mood={t >= careless ? "smug" : t >= hurt ? "sad" : "shock"}
            armR={t >= hurt && t < careless ? 160 : 0}
            armL={t >= careless ? 40 : 0}
            squat={t >= hurt && t < careless ? 0.5 : 0}
            tilt={t < hurt ? -10 : 0}
          />
          {t >= hurt && t < careless
            ? [0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: 1030 + i * 40,
                    top: 420 - i * 30 - ((t - hurt) % 20),
                    fontSize: 70,
                    color: P.yellow,
                    opacity: 0.8,
                    fontWeight: 900,
                  }}
                >
                  ✦
                </div>
              ))
            : null}
          <Bubble t={t} from={hurt} until={careless} x={1300} y={430} text="我有一点疼…" color="#cfe6ff" />
          <Flash t={t} at={wake} max={0.9} />
          <Shockwave t={t} at={wake} color={P.cyan} rings={2} />
        </>
      )}
      <Flash t={t} at={stamp} color={P.red} max={0.5} />
      <Flash t={t} at={no2} color={P.red} max={0.6} />
    </div>
  );
};
