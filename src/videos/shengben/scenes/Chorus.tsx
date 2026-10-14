import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { Dude } from "../kit/Dude";
import { Flash, PunchlineBadge, shake, Shockwave, Sparks, SpeedLines } from "../kit/Fx";
import { P, useSec } from "../kit/theme";
import { Neon, Sign } from "../kit/ui";

// 副歌（复用两次）：秘密 → 原神英文版 punchline → 上岸 → 去下一站 → 本科图书馆 → 给大专同学看
// variant=1：第一遍（b96–128）；variant=2：终副歌（b240–272，无 punchline，改为录取通知书）
export const makeChorus = (variant: 1 | 2): React.FC<SceneProps> => {
  const C: React.FC<SceneProps> = ({ start }) => {
    const t = useT();
    const at = useAt();
    const k = (n: number) => at(start, n);
    const sec = useSec(start);
    // 时间点均取自原视频字幕出现时刻（见 kit/lyrics.ts）
    const pl = sec(49.55); // punchline「学英语我用的原神的英文版」
    const plEnd = sec(51.0);
    const shore = variant === 1 ? sec(51.05) : sec(121.2); // 专升本上岸
    const station = variant === 1 ? sec(53.0) : sec(123.2); // 抱歉我要去下一站
    const library = variant === 1 ? sec(54.95) : sec(125.2); // 我要去本科生的图书馆
    const show = variant === 1 ? sec(58.75) : sec(129.1); // 大专的同学
    const landed = variant === 1 ? sec(61.05) : sec(131.2); // 我专升本上岸了
    const waitAt = sec(118.85); // 终副歌：「我在等录取通知」

    // punchline：画面推近 + 静帧（主角定格）
    const zoom = variant === 1 ? interpolate(t, [pl, pl + 4, plEnd, plEnd + 6], [1, 1.18, 1.18, 1], CL) : 1;
    const frozen = variant === 1 && t >= pl && t < plEnd;
    const tt = frozen ? pl : t;

    // 列车：去下一站
    const train = prog(t, station, at(start, 3));
    const lib = pop(t, library, 12);
    const libOut = interpolate(t, [show - 6, show], [1, 0], CL);
    const showS = pop(t, show, 11);
    const landS = t >= landed;

    return (
      <div style={{ position: "absolute", inset: 0, transform: `${shake(t, [shore, landed], 22)} scale(${zoom})` }}>
        {/* 秘密 / 游戏：主角拿着手柄 */}
        {t < station ? (
          <>
            <Dude x={760} y={980} s={1.25} mood={frozen ? "smug" : tt >= shore ? "happy" : "cool"} armL={60} armR={variant === 1 && tt >= pl ? 110 : 60} glasses={frozen} />
            {variant === 1 ? (
              <div
                style={{
                  position: "absolute",
                  left: 1120,
                  top: 280,
                  width: 620,
                  height: 380,
                  borderRadius: 24,
                  background: "#111832",
                  border: `8px solid ${P.ink}`,
                  boxShadow: `0 0 40px ${P.cyan}88`,
                  transform: `scale(${pop(t, k(2), 12)})`,
                  overflow: "hidden",
                  fontFamily: FONT,
                }}
              >
                <div style={{ height: "100%", background: "linear-gradient(160deg,#3a5bd9,#9a6bff 60%,#ffcf6e)", padding: 30 }}>
                  <div style={{ fontSize: 30, color: "#fff", opacity: 0.85 }}>Language · English</div>
                  <div style={{ fontSize: 78, fontWeight: 900, color: "#fff", marginTop: 40, textShadow: "0 4px 0 #0005" }}>GENSHIN</div>
                  <div style={{ fontSize: 40, color: "#fff", marginTop: 10 }}>"Paimon: Let's go!"</div>
                  <div style={{ position: "absolute", left: 30, bottom: 26, fontSize: 28, color: P.yellow, fontWeight: 900 }}>[EN] 学习中… 词汇 +999</div>
                </div>
              </div>
            ) : (
              <div style={{ position: "absolute", left: 1150, top: 260 }}>
                {/* 终副歌：等录取通知 */}
                <div
                  style={{
                    width: 560,
                    height: 380,
                    borderRadius: 18,
                    background: "#c8102e",
                    border: `8px solid ${P.yellow}`,
                    boxShadow: `0 0 50px ${P.yellow}`,
                    transform: `scale(${pop(t, waitAt, 12)}) rotate(-4deg)`,
                    fontFamily: FONT,
                    color: P.yellow,
                    textAlign: "center",
                    paddingTop: 60,
                  }}
                >
                  <div style={{ fontSize: 90, fontWeight: 900 }}>录取通知书</div>
                  <div style={{ fontSize: 40, marginTop: 30, color: "#fff" }}>专升本 · 本科</div>
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* 专升本上岸 霓虹大牌 */}
        {t >= shore && t < station + at(start, 3) ? (
          <Neon text="专升本上岸" x={960} y={180} size={150} color={P.yellow} on={Math.min(1, (t - shore) / 4)} />
        ) : null}

        {/* 列车：去下一站 */}
        {t >= station && t < library + 4 ? (
          <div style={{ position: "absolute", inset: 0 }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 820, height: 10, background: P.line }} />
            <div
              style={{
                position: "absolute",
                left: -900 + train * 2900,
                top: 520,
                width: 900,
                height: 300,
                borderRadius: "40px 120px 20px 20px",
                background: `linear-gradient(180deg, ${P.cyan}, #0b5a7a)`,
                boxShadow: `0 0 50px ${P.cyan}`,
                fontFamily: FONT,
                color: "#fff",
                fontSize: 60,
                fontWeight: 900,
                padding: "40px 60px",
              }}
            >
              下一站 · 本科 →
              <div style={{ position: "absolute", right: 80, top: 30, fontSize: 120 }}>🧑‍🎓</div>
            </div>
          </div>
        ) : null}

        {/* 本科图书馆 */}
        {t >= library ? (
          <div style={{ position: "absolute", inset: 0, opacity: lib * libOut }}>
            <Sign x={960} y={110} w={720} text="本科图书馆" color={P.yellow} />
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 160 + i * 280,
                  top: 300,
                  width: 220,
                  height: 560,
                  borderRadius: 10,
                  background: `repeating-linear-gradient(0deg, #2a2238 0 90px, ${P.line} 90px 100px)`,
                  border: `3px solid ${P.magenta}66`,
                }}
              >
                {Array.from({ length: 5 }).map((__, r) => (
                  <div key={r} style={{ display: "flex", gap: 6, padding: "14px 12px 0", height: 100 }}>
                    {Array.from({ length: 6 }).map((___, c) => (
                      <div key={c} style={{ flex: 1, height: 72, borderRadius: 3, background: [P.cyan, P.magenta, P.yellow, P.green][(i + r + c) % 4], opacity: 0.75 }} />
                    ))}
                  </div>
                ))}
              </div>
            ))}
            <Dude x={300 + prog(t, library, at(start, 7)) * 1300} y={980} s={0.95} mood="happy" look={Math.sin(t / 6)} />
          </div>
        ) : null}

        {/* 给大专同学看：手机举起 */}
        {t >= show ? (
          <div style={{ position: "absolute", inset: 0 }}>
            <Dude x={620} y={980} s={1.3} mood={landS ? "laugh" : "smug"} armR={140} jump={landS ? Math.abs(Math.sin((t - landed) / 5)) * 40 : 0} />
            <div
              style={{
                position: "absolute",
                left: 960,
                top: 200,
                width: 700,
                height: 520,
                borderRadius: 30,
                background: "#0d1430",
                border: `8px solid ${P.ink}`,
                transform: `scale(${showS}) rotate(4deg)`,
                fontFamily: FONT,
                padding: 30,
              }}
            >
              <div style={{ color: P.sub, fontSize: 30 }}>朋友圈 · 刚刚</div>
              <div style={{ color: "#fff", fontSize: 50, fontWeight: 900, marginTop: 20 }}>大专的同学，你现在看见了吗？</div>
              <div
                style={{
                  marginTop: 30,
                  height: 220,
                  borderRadius: 16,
                  background: landS ? P.yellow : "#1c2550",
                  color: "#111",
                  fontSize: 80,
                  fontWeight: 900,
                  textAlign: "center",
                  lineHeight: "220px",
                }}
              >
                {landS ? "上岸了！🎉" : "…"}
              </div>
            </div>
          </div>
        ) : null}

        {/* punchline 特效 */}
        {variant === 1 ? (
          <>
            <SpeedLines t={t} at={pl} color={P.yellow} dur={20} />
            <PunchlineBadge t={t} at={pl} until={plEnd} />
            <Flash t={t} at={pl} color={P.yellow} max={0.6} />
          </>
        ) : null}
        <Shockwave t={t} at={shore} color={P.yellow} />
        <Sparks t={t} at={landed} y={420} n={50} power={1.4} />
        <Flash t={t} at={landed} color={P.yellow} max={0.5} />
      </div>
    );
  };
  C.displayName = variant === 1 ? "Chorus" : "FinalChorus";
  return C;
};

export const Chorus = makeChorus(1);
export const FinalChorus = makeChorus(2);
