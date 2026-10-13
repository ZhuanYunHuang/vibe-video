import React from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { CL, FONT, MONO, hit, pop, useBeat } from "../../../shared";
import { HERO_BEAT, P } from "./theme";

// 本片招牌转场：「导航路线蛇形扫屏」
// 倒数 3-2-1 → 巨型蓝绿导航路线带着箭头蛇形铺满全屏 → 砸出「Dijkstra」→ 路线开走，露出新场景

const L = -300;
const R = 2220;
const ROWS = [180, 540, 900];
const PTS: [number, number][] = [
  [L, ROWS[0]],
  [R, ROWS[0]],
  [R, ROWS[1]],
  [L, ROWS[1]],
  [L, ROWS[2]],
  [R, ROWS[2]],
];
const SEG = PTS.slice(1).map((p, i) => Math.hypot(p[0] - PTS[i][0], p[1] - PTS[i][1]));
const TOTAL = SEG.reduce((a, b) => a + b, 0);
const POINTS = PTS.map((p) => p.join(",")).join(" ");

// 路线上距起点 d 处的坐标与朝向
const along = (d: number) => {
  let rest = Math.max(0, Math.min(TOTAL, d));
  for (let i = 0; i < SEG.length; i++) {
    if (rest <= SEG[i] || i === SEG.length - 1) {
      const [x0, y0] = PTS[i];
      const [x1, y1] = PTS[i + 1];
      const r = SEG[i] === 0 ? 0 : rest / SEG[i];
      return { x: x0 + (x1 - x0) * r, y: y0 + (y1 - y0) * r, a: (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI };
    }
    rest -= SEG[i];
  }
  return { x: R, y: ROWS[2], a: 0 };
};

const easeIn = Easing.bezier(0.55, 0, 0.75, 0.6);
const easeOut = Easing.bezier(0.3, 0.4, 0.4, 1);

// 转场音效：路线开始铺时 whoosh，全屏覆盖那一拍 boom
export const HeroSfx: React.FC = () => {
  const { bf } = useBeat();
  return (
    <>
      <Sequence from={bf(HERO_BEAT - 4)} durationInFrames={40} name="HeroWhoosh">
        <Audio src={staticFile("route-planning/whoosh.wav")} volume={0.9} />
      </Sequence>
      <Sequence from={bf(HERO_BEAT)} durationInFrames={90} name="HeroBoom">
        <Audio src={staticFile("route-planning/vine-boom.wav")} volume={0.55} />
      </Sequence>
    </>
  );
};

export const HeroWipe: React.FC = () => {
  const frame = useCurrentFrame();
  const { bf, BEAT } = useBeat();
  const H = bf(HERO_BEAT);
  const drawFrom = bf(HERO_BEAT - 4);
  const covered = bf(HERO_BEAT - 1); // 早于切场 1 拍铺满，切场被完全遮住
  const outFrom = bf(HERO_BEAT + 2);
  const outTo = bf(HERO_BEAT + 3);
  if (frame < bf(HERO_BEAT - 6) || frame > outTo + 2) return null;

  // 倒数 3-2-1：-6、-5、-4 拍各砸一个数字
  const countIdx = [HERO_BEAT - 6, HERO_BEAT - 5, HERO_BEAT - 4].reduce((m, b, i) => (frame >= bf(b) ? i : m), -1);
  const countAt = countIdx >= 0 ? bf(HERO_BEAT - 6 + countIdx) : 0;
  const banner = interpolate(frame, [bf(HERO_BEAT - 6), bf(HERO_BEAT - 6) + 6, covered, covered + 4], [0, 1, 1, 0], CL);

  // 路线：一拍扫一行（箭头每拍正好撞到屏幕边缘），再从尾部收走
  const rowEnd = (r: number) => SEG.slice(0, r * 2 + 1).reduce((a, b) => a + b, 0) + (r < 2 ? SEG[r * 2 + 1] / 2 : 0);
  const drawn = interpolate(frame, [drawFrom, bf(HERO_BEAT - 3), bf(HERO_BEAT - 2), covered], [0, rowEnd(0), rowEnd(1), TOTAL], {
    ...CL,
    easing: easeIn,
  });
  const gone = interpolate(frame, [outFrom, outTo], [0, 1], { ...CL, easing: easeOut }) * TOTAL;
  const dash = frame < outFrom ? `${drawn} ${TOTAL * 2}` : `0 ${gone} ${TOTAL * 2}`;
  const head = along(drawn);
  const showHead = frame >= drawFrom && frame < covered;

  // 全屏覆盖时的大字：在切场那一拍砸下
  const titleOn = frame >= H && frame < outFrom + 4;
  const ts = pop(frame, H, 9);
  const flash = hit(frame, H, 4);
  const subBeat = Math.floor((frame - H) / (BEAT / 2));

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* 导航播报牌 + 倒数 */}
      {banner > 0 ? (
        <div
          style={{
            position: "absolute",
            right: 60,
            top: 40,
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "18px 30px",
            borderRadius: 30,
            background: P.green,
            color: P.white,
            fontFamily: FONT,
            boxShadow: `0 16px 40px ${P.green}66`,
            opacity: banner,
            transform: `translateY(${(1 - banner) * -60}px)`,
          }}
        >
          <svg width={76} height={76} viewBox="0 0 76 76">
            <path d="M20 66 V34 a12 12 0 0 1 12 -12 H52" fill="none" stroke={P.white} strokeWidth={10} strokeLinecap="round" />
            <path d="M44 8 L62 22 L44 36 Z" fill={P.white} />
          </svg>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, opacity: 0.9 }}>前方路口</div>
            <div style={{ fontSize: 40, fontWeight: 900 }}>换一个思路</div>
          </div>
          {countIdx >= 0 ? (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                background: P.white,
                color: P.green,
                fontFamily: MONO,
                fontSize: 66,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${1 + hit(frame, countAt, 4) * 0.45})`,
              }}
            >
              {3 - countIdx}
            </div>
          ) : null}
        </div>
      ) : null}

      {/* 巨型导航路线 */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="heroGrad" x1={0} y1={0} x2={1920} y2={1080} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={P.blue} />
            <stop offset="100%" stopColor={P.teal} />
          </linearGradient>
          <mask id="heroMask" maskUnits="userSpaceOnUse" x={-400} y={-400} width={2720} height={1880}>
            <polyline points={POINTS} fill="none" stroke="#fff" strokeWidth={400} strokeLinejoin="round" strokeDasharray={dash} />
          </mask>
        </defs>
        <polyline points={POINTS} fill="none" stroke={P.white} strokeWidth={440} strokeLinejoin="round" strokeDasharray={dash} />
        <polyline points={POINTS} fill="none" stroke="url(#heroGrad)" strokeWidth={400} strokeLinejoin="round" strokeDasharray={dash} />
        {/* 车道虚线：只在路线已铺到的地方显示 */}
        <g mask="url(#heroMask)">
          <polyline
            points={POINTS}
            fill="none"
            stroke={P.white}
            strokeOpacity={0.55}
            strokeWidth={16}
            strokeDasharray="80 60"
            strokeDashoffset={-frame * 18}
          />
        </g>
        {/* 导航箭头 */}
        {showHead ? (
          <g transform={`translate(${head.x} ${head.y}) rotate(${head.a})`}>
            <circle r={150} fill={P.white} opacity={0.25} />
            <circle r={110} fill={P.white} />
            <path d="M-46 -54 L62 0 L-46 54 L-22 0 Z" fill={P.blue} />
          </g>
        ) : null}
      </svg>

      {/* 全屏大字 */}
      {titleOn ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", fontFamily: FONT, color: P.white, textAlign: "center" }}>
          <div style={{ transform: `scale(${2.4 - ts * 1.4}) rotate(${(1 - ts) * -8}deg)`, opacity: Math.min(1, ts * 1.6) }}>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: 16, opacity: 0.92 }}>算 法 登 场</div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 230,
                fontWeight: 900,
                lineHeight: 1.05,
                textShadow: `0 16px 0 ${P.ink}33`,
                transform: `scale(${1 + (subBeat >= 1 ? hit(frame, H + (BEAT / 2) * subBeat, 3) * 0.06 : 0)})`,
              }}
            >
              Dijkstra
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{ background: P.white, opacity: flash * 0.85 }} />
    </AbsoluteFill>
  );
};
