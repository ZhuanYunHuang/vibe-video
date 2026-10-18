import React from "react";
import { clamp01 } from "../../../shared";
import { vignette } from "./theme";

// 暖色卡通布景四件套：夜城 / 家外观 / 客厅 / 时间点阵
// 全部 1920×1080 绝对定位；frame 驱动的呼吸感（窗闪/热气），不依赖节拍。
// 重规划后每个布景都加了「视差分层 + 统一暗角」，让画面有景深（治"平"）。

// 暗角遮罩（所有布景共用）
const Vg: React.FC<{ a?: number; rgb?: string }> = ({ a = 0.34, rgb = "22,32,58" }) => (
  <div style={{ position: "absolute", inset: 0, background: vignette(a, rgb), pointerEvents: "none" }} />
);

// ============ 深蓝夜城 ============
const BUILDINGS: { x: number; w: number; h: number; c: string; far: boolean }[] = [
  { x: -30, w: 210, h: 430, c: "#293858", far: true },
  { x: 200, w: 150, h: 560, c: "#31406B", far: false },
  { x: 370, w: 240, h: 350, c: "#3B4E82", far: true },
  { x: 630, w: 170, h: 610, c: "#2A3A60", far: false },
  { x: 820, w: 220, h: 400, c: "#3B4E82", far: true },
  { x: 1060, w: 160, h: 540, c: "#31406B", far: false },
  { x: 1240, w: 250, h: 380, c: "#293858", far: true },
  { x: 1510, w: 180, h: 580, c: "#3B4E82", far: false },
  { x: 1710, w: 260, h: 430, c: "#31406B", far: true },
];

const SIGNS: { x: number; y: number; text: string; c: string; ph: number }[] = [
  { x: 262, y: 300, text: "便利店", c: "#E8564B", ph: 0 },
  { x: 700, y: 360, text: "居酒屋", c: "#E8742A", ph: 2.1 },
  { x: 1120, y: 300, text: "超市", c: "#4A90D9", ph: 4.2 },
  { x: 1580, y: 340, text: "24H", c: "#58B858", ph: 1.3 },
];

export const NightCity: React.FC<{ t: number; starfield?: boolean; parallax?: number; vig?: number }> = ({
  t,
  starfield = true,
  parallax = 0.5,
  vig = 0.34,
}) => {
  const flick = (ph: number) => (Math.sin(t / 7 + ph * 13.7) > -0.85 ? 1 : 0.4);
  // 视差：远景动得少、近景动得多
  const drift = (phase: number, d: number) => (parallax === 0 ? undefined : { transform: `translateY(${Math.sin(t / 300 + phase) * parallax * d * 14}px)` });

  const building = (b: (typeof BUILDINGS)[number], bi: number) => (
    <div
      key={bi}
      style={{
        position: "absolute",
        left: b.x,
        bottom: 96,
        width: b.w,
        height: b.h,
        background: b.c,
        borderTop: `4px solid rgba(255,255,255,${b.far ? 0.05 : 0.10})`,
        borderRadius: "4px 4px 0 0",
        filter: b.far ? "brightness(0.82)" : undefined,
      }}
    >
      {Array.from({ length: Math.floor(b.h / 74) }).map((_, r) =>
        Array.from({ length: Math.floor(b.w / 56) }).map((__, cIdx) => {
          const on = ((bi * 7 + r * 3 + cIdx * 5) % 11) < 4;
          if (!on) return null;
          const warm = (bi + r + cIdx) % 3 === 0;
          return (
            <div
              key={`${r}-${cIdx}`}
              style={{
                position: "absolute",
                left: 14 + cIdx * 56,
                top: 22 + r * 74,
                width: 24,
                height: 34,
                borderRadius: 3,
                background: warm ? "#FFD98A" : "#9FD8E8",
                opacity: (0.75 + 0.25 * Math.sin(t / 9 + bi + r * 2 + cIdx)) * (b.far ? 0.55 : 1),
              }}
            />
          );
        }),
      )}
    </div>
  );

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #141F40 0%, #1B2C52 55%, #2A3C66 100%)" }} />
      {/* 远景层：星 + 月 */}
      <div style={{ position: "absolute", inset: 0 }} {...drift(0, 0.2)}>
        {starfield
          ? Array.from({ length: 18 }).map((_, i) => {
              const x = (i * 167) % 1860;
              const y = 40 + ((i * 97) % 260);
              const tw = 0.3 + 0.2 * Math.sin(t / 11 + i * 2.4);
              return <div key={i} style={{ position: "absolute", left: x, top: y, width: 4, height: 4, borderRadius: "50%", background: "#E8EEF8", opacity: Math.max(0.12, tw) }} />;
            })
          : null}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={1620} cy={170} r={52} fill="#FFF3D6" />
          <circle cx={1602} cy={158} r={40} fill="#FFF8E4" opacity={0.9} />
        </svg>
      </div>
      {/* 远景楼群 */}
      <div style={{ position: "absolute", inset: 0 }} {...drift(1.1, 0.4)}>
        {BUILDINGS.filter((b) => b.far).map((b, i) => building(b, i))}
      </div>
      {/* 暖色店招（中景） */}
      <div style={{ position: "absolute", inset: 0 }} {...drift(2.2, 0.75)}>
        {SIGNS.map((s, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              writingMode: "vertical-rl",
              fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
              fontWeight: 900,
              fontSize: 42,
              letterSpacing: 10,
              padding: "14px 8px",
              borderRadius: 10,
              background: "#FFF3DC",
              border: `3px solid rgba(42,46,58,0.18)`,
              color: s.c,
              opacity: 0.55 + 0.45 * flick(s.ph),
              boxShadow: "0 4px 0 rgba(16,28,58,0.25)",
            }}
          >
            {s.text}
          </div>
        ))}
      </div>
      {/* 近景楼群 */}
      <div style={{ position: "absolute", inset: 0 }} {...drift(3.3, 1.1)}>
        {BUILDINGS.filter((b) => !b.far).map((b, i) => building(b, i + 100))}
      </div>
      {/* 地面（前景） */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 96, background: "linear-gradient(180deg, #1B2C52 0%, #141F40 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 96, height: 4, background: "rgba(255,243,214,0.22)" }} />
      <Vg a={vig} />
    </div>
  );
};

// ============ 家外观（门口） ============
export const HomeExterior: React.FC<{ t: number; light?: number; parallax?: number; vig?: number }> = ({
  t,
  light = 0,
  parallax = 0.5,
  vig = 0.36,
}) => {
  const doorX = 1290;
  const drift = (phase: number, d: number) => (parallax === 0 ? undefined : { transform: `translateY(${Math.sin(t / 300 + phase) * parallax * d * 14}px)` });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #141F40 0%, #1B2C52 62%, #26365C 100%)" }} />
      {/* 远景：月 + 星 */}
      <div style={{ position: "absolute", inset: 0 }} {...drift(0, 0.2)}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <circle cx={300} cy={150} r={46} fill="#FFF3D6" />
          <circle cx={285} cy={140} r={35} fill="#FFF8E4" opacity={0.9} />
        </svg>
      </div>
      {/* 中景：房子 + 门窗 */}
      <div style={{ position: "absolute", inset: 0 }} {...drift(1.4, 0.8)}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* 房子：暖米墙 + 深蓝顶 */}
          <rect x={820} y={430} width={940} height={520} rx={16} fill="#FFF3E2" />
          <polygon points={`760,452 ${doorX - 210},296 ${doorX + 230},296 1840,452`} fill="#31406B" />
          {/* 屋檐描边 */}
          <polyline points={`776,446 ${doorX - 206},306 ${doorX + 226},306 1824,446`} fill="none" stroke="#2A3A60" strokeWidth={6} strokeLinecap="round" />
          {/* 窗（暖黄光） */}
          {[950, 1560].map((wx, i) => (
            <g key={i}>
              <rect x={wx} y={540} width={130} height={110} rx={10} fill="#FFD98A" opacity={0.92 + 0.08 * Math.sin(t / 8 + i)} />
              <rect x={wx} y={540} width={130} height={110} rx={10} fill="none" stroke="#C98A4B" strokeWidth={5} />
              <line x1={wx + 65} y1={540} x2={wx + 65} y2={650} stroke="#C98A4B" strokeWidth={4} />
            </g>
          ))}
          {/* 门（推开时透暖光） */}
          <rect x={doorX - 90} y={560} width={180} height={390} rx={10} fill="#8A5A3A" />
          <rect x={doorX - 74} y={576} width={148} height={374 * light} rx={8} fill="#FFD98A" opacity={0.35 + light * 0.6} />
          <circle cx={doorX + 52} cy={770} r={9} fill="#F5C542" />
        </svg>
        {/* 门牌「家」 */}
        <div
          style={{
            position: "absolute",
            left: doorX - 150,
            top: 470,
            fontFamily: '"Microsoft YaHei","PingFang SC",sans-serif',
            fontWeight: 900,
            fontSize: 52,
            padding: "10px 40px",
            borderRadius: 14,
            background: "#C98A4B",
            color: "#fff",
            boxShadow: "0 5px 0 rgba(42,46,58,0.18)",
            letterSpacing: 6,
          }}
        >
          家
        </div>
      </div>
      {/* 地面（前景） */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 130, background: "linear-gradient(180deg, #1B2C52, #141F40)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 130, height: 4, background: "rgba(255,243,214,0.18)" }} />
      {/* 门口暖光溢出 */}
      <div
        style={{
          position: "absolute",
          left: doorX - 320,
          top: 520,
          width: 640,
          height: 460,
          background: `radial-gradient(ellipse at 50% 40%, rgba(255,217,138,${0.10 + light * 0.22}) 0%, transparent 68%)`,
        }}
      />
      <Vg a={vig} />
    </div>
  );
};

// ============ 客厅（暖米 + 台灯暖光） ============
export const LivingRoom: React.FC<{ t: number; dishes?: boolean; steam?: boolean; dim?: number; clock?: [number, number]; parallax?: number; vig?: number }> = ({
  t,
  dishes = true,
  steam = true,
  dim = 0,
  clock = [19, 0],
  parallax = 0.4,
  vig = 0.26,
}) => {
  const [hh, mm] = clock;
  const hAng = ((hh % 12) + mm / 60) * 30 - 90;
  const mAng = mm * 6 - 90;
  const drift = (phase: number, d: number) => (parallax === 0 ? undefined : { transform: `translateY(${Math.sin(t / 320 + phase) * parallax * d * 12}px)` });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #FFE9CB 0%, #FFF3E2 52%, #F7E4C4 100%)" }} />
      {/* 背景层：窗 + 全家福 + 挂钟 */}
      <div style={{ position: "absolute", inset: 0 }} {...drift(0, 0.35)}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {/* 窗（夜） */}
          <rect x={1430} y={200} width={330} height={280} rx={14} fill="#1B2C52" />
          <circle cx={1540} cy={280} r={30} fill="#FFF3D6" />
          <rect x={1430} y={200} width={330} height={280} rx={14} fill="none" stroke="#FFFDF6" strokeWidth={8} />
          <line x1={1595} y1={204} x2={1595} y2={476} stroke="#FFFDF6" strokeWidth={6} />
          <line x1={1434} y1={340} x2={1756} y2={340} stroke="#FFFDF6" strokeWidth={6} />
          {/* 全家福（木框） */}
          <rect x={1122} y={202} width={206} height={166} rx={10} fill="#C98A4B" />
          <rect x={1138} y={218} width={174} height={134} rx={6} fill="#FFFDF6" />
          <circle cx={1190} cy={276} r={16} fill="#FFD9B3" />
          <rect x={1176} y={294} width={28} height={36} rx={8} fill="#FF8A3D" />
          <circle cx={1252} cy={276} r={16} fill="#FFD9B3" />
          <rect x={1238} y={294} width={28} height={36} rx={8} fill="#E85D5D" />
          <circle cx={1221} cy={304} r={10} fill="#FFD9B3" />
          <rect x={1213} y={316} width={16} height={18} rx={5} fill="#F5C542" />
          {/* 挂钟（白盘） */}
          <circle cx={250} cy={260} r={74} fill="#FFFDF6" stroke="#D8DEE9" strokeWidth={5} />
          <line x1={250} y1={260} x2={250 + Math.cos((hAng * Math.PI) / 180) * 36} y2={260 + Math.sin((hAng * Math.PI) / 180) * 36} stroke="#2A2E3A" strokeWidth={6} strokeLinecap="round" />
          <line x1={250} y1={260} x2={250 + Math.cos((mAng * Math.PI) / 180) * 56} y2={260 + Math.sin((mAng * Math.PI) / 180) * 56} stroke="#2A2E3A" strokeWidth={4} strokeLinecap="round" />
          <circle cx={250} cy={260} r={6} fill="#E8564B" />
        </svg>
      </div>
      {/* 前景层：吊灯 + 地板 + 饭桌 */}
      <div style={{ position: "absolute", inset: 0 }} {...drift(1.7, 0.85)}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="lampCone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F5A623" stopOpacity={0.26} />
              <stop offset="100%" stopColor="#F5A623" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* 地板 + 踢脚线 */}
          <rect x={0} y={905} width={1920} height={175} fill="#E8B87F" />
          <rect x={0} y={899} width={1920} height={10} fill="#FFFDF6" />
          <line x1={0} y1={905} x2={1920} y2={905} stroke="#D8A96B" strokeWidth={2} />
          {/* 吊灯 */}
          <line x1={620} y1={0} x2={620} y2={140} stroke="#8A5A3A" strokeWidth={5} />
          <path d={`M566 142 L674 142 L620 180 Z`} fill="#F5C542" stroke="#E0A92E" strokeWidth={3} />
          <polygon points={`505,185 735,185 975,899 265,899`} fill="url(#lampCone)" />
          <circle cx={620} cy={186} r={11} fill="#FFF6D8" />
        </svg>
      </div>
      {/* 饭桌 + 碗（内容层，不参与视差以免与人物错位） */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <rect x={330} y={716} width={1260} height={36} rx={10} fill="#C98A4B" />
        <rect x={330} y={716} width={1260} height={36} rx={10} fill="none" stroke="#B0763C" strokeWidth={3} />
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={344 + i * 78} y={720} width={39} height={28} fill={i % 2 ? "#E8564B" : "#FFFDF6"} opacity={0.85} rx={2} />
        ))}
        <rect x={420} y={752} width={26} height={158} fill="#B0763C" />
        <rect x={1474} y={752} width={26} height={158} fill="#B0763C" />
        {dishes
          ? [520, 760, 1000, 1240].map((bx, i) => (
              <g key={i}>
                <ellipse cx={bx} cy={714} rx={58} ry={16} fill="#FFFDF6" stroke="#D8DEE9" strokeWidth={2.5} />
                <ellipse cx={bx} cy={708} rx={44} ry={11} fill={["#FFB65C", "#8FCB6B", "#F58A6E", "#F5C542"][i % 4]} />
                {steam
                  ? [0, 1].map((si) => (
                      <path
                        key={si}
                        d={`M${bx - 16 + si * 32} ${686 - si * 6} q10 -14 0 -26 q-8 -12 2 -22`}
                        stroke="#C9CFDD"
                        strokeWidth={4}
                        fill="none"
                        opacity={0.35 + 0.3 * Math.abs(Math.sin(t / 10 + i * 2 + si))}
                        strokeLinecap="round"
                      />
                    ))
                  : null}
              </g>
            ))
          : null}
      </svg>
      {/* 吊灯暖光晕 */}
      <div style={{ position: "absolute", left: 320, top: 60, width: 600, height: 420, background: `radial-gradient(ellipse at 50% 30%, rgba(245,166,35,0.16) 0%, transparent 65%)` }} />
      {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(42,46,58,${dim})` }} /> : null}
      <Vg a={vig} rgb="120,80,40" />
    </div>
  );
};

// ============ 时间点阵（30 年 × 7 天 = 210 点） ============
// mode="count"     点亮前 lit 比例的点（原行为）
// mode="countdown" 前 lit 比例的点是「已经过去的陪伴」（暗），其余是「还没到来的」（亮）
export const DotGrid: React.FC<{ t: number; lit: number; x?: number; y?: number; gap?: number; mode?: "count" | "countdown" }> = ({
  t,
  lit,
  x = 960,
  y = 712,
  gap = 25,
  mode = "count",
}) => {
  const cols = 7;
  const rows = 30;
  const total = cols * rows;
  const litCount = Math.round(clamp01(lit) * total);
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const i = r * cols + c;
          const cx = x - ((cols - 1) * gap) / 2 + c * gap;
          const cy = y - ((rows - 1) * gap) / 2 + r * gap;
          if (mode === "countdown") {
            const passed = i < litCount;
            return (
              <circle
                key={`${r}-${c}`}
                cx={cx}
                cy={cy}
                r={passed ? 8 : 10}
                fill={passed ? "#C6A876" : "#F5A623"}
                stroke={passed ? "#B08F5E" : "#E0A92E"}
                strokeWidth={passed ? 1.5 : 2.5}
                opacity={passed ? 0.62 : 0.9 + 0.1 * Math.sin(t / 8 + i)}
              />
            );
          }
          const on = i < litCount;
          return (
            <circle
              key={`${r}-${c}`}
              cx={cx}
              cy={cy}
              r={on ? 10 : 8}
              fill={on ? "#F5A623" : "none"}
              stroke={on ? "#E0A92E" : "#C9CFDD"}
              strokeWidth={on ? 2 : 2.4}
              opacity={on ? 0.9 + 0.1 * Math.sin(t / 8 + i) : 0.7}
            />
          );
        }),
      )}
      {/* 年份标尺 */}
      <text x={x - 300} y={y - ((rows - 1) * gap) / 2 + 10} fill="#7C8BA8" fontSize={26} fontWeight={700}>1 年</text>
      <text x={x - 300} y={y + ((rows - 1) * gap) / 2 + 8} fill="#7C8BA8" fontSize={26} fontWeight={700}>30 年</text>
    </svg>
  );
};
