import React from "react";
import { FONT, MONO, hit, pop, prog, SceneProps, useAt, useT } from "../../../shared";
import { GRAD, P } from "../kit/theme";
import { Card, PhoneFrame } from "../kit/ui";

const DEST = "人民广场";

const ROUTES = [
  { tag: "推荐", time: "13", km: "9.6", light: 4, best: true },
  { tag: "距离短", time: "14", km: "8.2", light: 9, best: false },
  { tag: "大路多", time: "17", km: "11.3", light: 3, best: false },
];

// 手机里的迷你地图路线（屏幕坐标）
const MINI_BEST = "M80 520 C 120 420 200 430 240 360 S 360 260 420 200";
const MINI_SHORT = "M80 520 L 420 200";

// 01 提问：拟真导航界面 → 0.1 秒给出路线 → 它凭什么？
export const AppUI: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);

  // 本幕 16 拍（一个乐句），第 16 拍重拍直接切下一幕
  const phone = pop(t, 0, 14);
  const typeAt = k(1);
  const typed = Math.min(DEST.length, Math.max(0, Math.floor((t - typeAt) / (k(1) * 0.75)) + 1));
  const searchAt = k(4);
  const routeP = prog(t, k(5), k(1.5));
  const cardAt = (i: number) => k(6 + i);
  const pickAt = k(9);
  const pick = hit(t, pickAt, 6);
  const qAt = k(10);
  const q = pop(t, qAt, 11);
  const q2 = pop(t, k(12), 12);
  const capAt = k(13);

  return (
    <>
      <PhoneFrame x={240} y={60} style={{ transform: `translateY(${(1 - phone) * 300}px)`, opacity: phone }}>
        {/* 迷你地图 */}
        <svg width={488} height={928} style={{ position: "absolute", inset: 0 }}>
          <rect width={488} height={928} fill={P.bg} />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 100 + 40} x2={488} y2={i * 100 + 40} stroke={P.road} strokeWidth={12} />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <line key={`v${i}`} x1={i * 110 + 30} y1={0} x2={i * 110 + 30} y2={928} stroke={P.road} strokeWidth={12} />
          ))}
          <path d="M360 0 C 320 200 460 300 420 600" fill="none" stroke={P.water} strokeWidth={40} />
          <path d={MINI_SHORT} fill="none" stroke={P.red} strokeWidth={10} strokeDasharray="18 12" opacity={routeP * 0.7} />
          <path
            d={MINI_BEST}
            fill="none"
            stroke={P.blue}
            strokeWidth={14}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={`${routeP} 1`}
          />
          <circle cx={80} cy={520} r={14} fill={P.blue} stroke={P.white} strokeWidth={5} opacity={routeP > 0 ? 1 : 0} />
          <circle cx={420} cy={200} r={14} fill={P.red} stroke={P.white} strokeWidth={5} opacity={routeP >= 1 ? 1 : 0} />
        </svg>

        {/* 搜索框 */}
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            top: 64,
            height: 76,
            borderRadius: 22,
            background: P.white,
            boxShadow: `0 6px 18px ${P.ink}22`,
            display: "flex",
            alignItems: "center",
            padding: "0 22px",
            gap: 14,
            fontFamily: FONT,
            fontSize: 32,
            transform: `scale(${1 + hit(t, searchAt, 4) * 0.05})`,
          }}
        >
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `4px solid ${P.sub}` }} />
          <span style={{ color: t >= typeAt ? P.ink : P.sub, fontWeight: 700 }}>{t >= typeAt ? DEST.slice(0, typed) : "搜索目的地"}</span>
          {t >= typeAt && t < searchAt ? <span style={{ width: 3, height: 34, background: P.blue, opacity: Math.floor(t / 8) % 2 }} /> : null}
          <div style={{ marginLeft: "auto", padding: "8px 16px", borderRadius: 14, background: GRAD, color: P.white, fontSize: 26, fontWeight: 900 }}>
            路线
          </div>
        </div>

        {/* 路线卡片 */}
        <div style={{ position: "absolute", left: 18, right: 18, bottom: 22, display: "flex", gap: 10 }}>
          {ROUTES.map((r, i) => {
            const s = pop(t, cardAt(i), 12);
            const on = r.best && t >= pickAt;
            return (
              <div
                key={r.tag}
                style={{
                  flex: 1,
                  padding: "16px 10px",
                  borderRadius: 22,
                  background: on ? GRAD : P.white,
                  color: on ? P.white : P.ink,
                  border: `3px solid ${on ? "transparent" : P.line}`,
                  boxShadow: `0 8px 20px ${P.ink}22`,
                  fontFamily: FONT,
                  textAlign: "center",
                  opacity: s,
                  transform: `translateY(${(1 - s) * 200}px) scale(${1 + (on ? pick * 0.12 : 0)})`,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, opacity: 0.85 }}>{r.tag}</div>
                <div style={{ fontFamily: MONO, fontSize: 46, fontWeight: 900, marginTop: 6 }}>
                  {r.time}
                  <span style={{ fontSize: 22 }}>分钟</span>
                </div>
                <div style={{ fontSize: 18, marginTop: 4, opacity: 0.8, whiteSpace: "nowrap" }}>
                  {r.km}km · {r.light}灯
                </div>
              </div>
            );
          })}
        </div>
      </PhoneFrame>

      {/* 右侧：提问 */}
      <div style={{ position: "absolute", left: 900, top: 300, width: 900, fontFamily: FONT }}>
        <div style={{ fontSize: 44, color: P.sub, fontWeight: 700, opacity: pop(t, k(9), 12) }}>
          输入目的地，<span style={{ fontFamily: MONO, color: P.blue, fontWeight: 900 }}>0.1</span> 秒出结果
        </div>
        <div style={{ marginTop: 30, fontSize: 110, fontWeight: 900, color: P.ink, opacity: q, transform: `scale(${0.6 + q * 0.4})`, transformOrigin: "left center" }}>
          它<span style={{ color: P.blue }}>凭什么</span>
          <br />
          选这条<span style={{ color: P.teal }}>？</span>
        </div>
        <div style={{ marginTop: 34, fontSize: 38, color: P.sub, opacity: q2 }}>
          明明「距离短」那条只有 <span style={{ fontFamily: MONO, color: P.red, fontWeight: 900 }}>8.2km</span>
        </div>
        <div style={{ marginTop: 60, opacity: pop(t, capAt, 14) }}>
          <Card style={{ display: "inline-block", fontSize: 36, fontWeight: 700 }}>
            导航选的，往往<span style={{ color: P.blue }}>不是</span>看着最近的那条
          </Card>
        </div>
      </div>
    </>
  );
};
