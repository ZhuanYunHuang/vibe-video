import React from "react";
import { useCurrentFrame } from "remotion";
import { P } from "./theme";

// 暖色卡通角色三件套：Worker（主角）/ Mom（妈妈）/ Extra（路人同事）
// 统一 viewBox 0 0 200 400，脚底定位 (x, y)，s 为缩放；肤色圆脸 + 实色衣服 + 腮红

export type Mood = "smile" | "warm" | "tired" | "burst" | "guilty" | "sad" | "worry" | "shock" | "neutral";

const INK = "#2A2E3A";
const MOUTH = P.mouth;
const BLUSH = "rgba(232,86,75,0.35)";

// ============ 眼睛/嘴（按心情切换） ============
const eyesFor = (mood: Mood, lx: number, ey: number): React.ReactNode => {
  switch (mood) {
    case "smile":
    case "warm":
      return (
        <g stroke={INK} strokeWidth={5.5} fill="none" strokeLinecap="round">
          <path d={`M70 ${ey + 4} Q80 ${ey - 9} 90 ${ey + 4}`} />
          <path d={`M110 ${ey + 4} Q120 ${ey - 9} 130 ${ey + 4}`} />
        </g>
      );
    case "tired":
    case "guilty":
      return (
        <g stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round">
          <path d={`M68 ${ey + 2} Q80 ${ey + 8} 92 ${ey + 2}`} />
          <path d={`M108 ${ey + 2} Q120 ${ey + 8} 132 ${ey + 2}`} />
          <path d={`M66 ${ey - 15} L90 ${ey - 9} M134 ${ey - 15} L110 ${ey - 9}`} strokeWidth={4} />
        </g>
      );
    case "burst":
      return (
        <g>
          <ellipse cx={80 + lx} cy={ey + 2} rx={6.5} ry={8} fill={INK} />
          <ellipse cx={120 + lx} cy={ey + 2} rx={6.5} ry={8} fill={INK} />
          <path d={`M62 ${ey - 19} L92 ${ey - 7} M138 ${ey - 19} L108 ${ey - 7}`} stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "sad":
      return (
        <g>
          <ellipse cx={80 + lx} cy={ey + 2} rx={6} ry={8} fill={INK} />
          <ellipse cx={120 + lx} cy={ey + 2} rx={6} ry={8} fill={INK} />
          <path d={`M66 ${ey - 14} L90 ${ey - 8} M134 ${ey - 14} L110 ${ey - 8}`} stroke={INK} strokeWidth={4} fill="none" />
          <path d={`M124 ${ey + 12} q-4 13 0 19 q4 -6 0 -19`} fill="#9FD8E8" />
        </g>
      );
    case "worry":
      return (
        <g>
          <circle cx={80 + lx} cy={ey} r={8} fill={INK} />
          <circle cx={120 + lx} cy={ey} r={8} fill={INK} />
          <circle cx={83 + lx} cy={ey - 3} r={2.6} fill="#fff" />
          <circle cx={123 + lx} cy={ey - 3} r={2.6} fill="#fff" />
          <path d={`M66 ${ey - 20} L92 ${ey - 13} M134 ${ey - 20} L108 ${ey - 13}`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
      );
    case "shock":
      return (
        <g>
          <circle cx={80 + lx} cy={ey} r={13} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={120 + lx} cy={ey} r={13} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={80 + lx} cy={ey} r={5.5} fill={INK} />
          <circle cx={120 + lx} cy={ey} r={5.5} fill={INK} />
        </g>
      );
    case "neutral":
    default:
      return (
        <g fill={INK}>
          <circle cx={80 + lx} cy={ey} r={6} />
          <circle cx={120 + lx} cy={ey} r={6} />
        </g>
      );
  }
};

const mouthFor = (mood: Mood, my: number): React.ReactNode => {
  switch (mood) {
    case "smile":
      return <path d={`M84 ${my} Q100 ${my + 16} 116 ${my}`} stroke={MOUTH} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
    case "warm":
      return <path d={`M80 ${my - 2} Q100 ${my + 22} 120 ${my - 2} Z`} fill={MOUTH} />;
    case "tired":
    case "guilty":
      return <path d={`M86 ${my + 6} L114 ${my + 6}`} stroke={MOUTH} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
    case "burst":
      return (
        <g>
          <rect x={82} y={my} width={36} height={15} rx={5} fill={MOUTH} />
          <path d={`M88 ${my + 6} L96 ${my + 2} M104 ${my + 6} L112 ${my + 2}`} stroke="#fff" strokeWidth={2.4} />
        </g>
      );
    case "sad":
      return <path d={`M86 ${my + 8} Q100 ${my - 4} 114 ${my + 8}`} stroke={MOUTH} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
    case "worry":
      return <ellipse cx={100} cy={my + 3} rx={7} ry={9} fill={MOUTH} />;
    case "shock":
      return <ellipse cx={100} cy={my + 4} rx={10} ry={13} fill={MOUTH} />;
    case "neutral":
    default:
      return <path d={`M88 ${my + 2} L112 ${my + 2}`} stroke={MOUTH} strokeWidth={5.5} fill="none" strokeLinecap="round" />;
  }
};

// 腮红
const blush = (ey: number) => (
  <g fill={BLUSH}>
    <ellipse cx={64} cy={ey + 14} rx={9} ry={5.5} />
    <ellipse cx={136} cy={ey + 14} rx={9} ry={5.5} />
  </g>
);

// ============ 侧面（侧身行进）视图零件 ============
// 同一坐标系：脚底 y=400，默认朝右（外层 flip 后朝左）。
// 走路 = 髋部为轴的两段式腿（大腿 + 小腿带屈膝）+ 反向摆臂，读起来才是"侧身走路"。
const HIP_X = 98;
const HIP_Y = 258;
const SH_X = 98;
const SH_Y = 172;

const profLeg = (phase: number, pants: string, shoe: string, trim: string) => {
  const thigh = Math.sin(phase) * 28;
  const knee = Math.max(0, -Math.sin(phase + 0.9)) * 46;
  return (
    <g>
      <g transform={`rotate(${thigh} ${HIP_X} ${HIP_Y})`}>
        <rect x={HIP_X - 15} y={HIP_Y} width={30} height={66} rx={14} fill={pants} />
        <g transform={`rotate(${knee} ${HIP_X} ${HIP_Y + 64})`}>
          <rect x={HIP_X - 13} y={HIP_Y + 60} width={26} height={62} rx={12} fill={pants} />
          {/* 脚尖朝行进方向 */}
          <path
            d={`M${HIP_X - 14} ${HIP_Y + 112} h44 q10 0 10 12 q0 10 -10 10 h-44 q-10 0 -10 -11 q0 -11 10 -11 z`}
            fill={shoe}
            stroke={trim}
            strokeWidth={2}
          />
        </g>
      </g>
    </g>
  );
};

const profArm = (phase: number, sleeve: string, skin: string, back: boolean) => {
  const up = -Math.sin(phase) * 27;
  const fore = Math.max(0, Math.sin(phase)) * 28;
  return (
    <g opacity={back ? 0.78 : 1}>
      <g transform={`rotate(${up} ${SH_X} ${SH_Y})`}>
        <rect x={SH_X - 13} y={SH_Y} width={26} height={62} rx={13} fill={sleeve} />
        <g transform={`rotate(${fore} ${SH_X} ${SH_Y + 60})`}>
          <rect x={SH_X - 12} y={SH_Y + 58} width={24} height={52} rx={12} fill={sleeve} />
          <circle cx={SH_X} cy={SH_Y + 112} r={13} fill={skin} />
        </g>
      </g>
    </g>
  );
};

// 侧脸：单眼 + 眉 + 鼻 + 嘴（按心情切换，让"开心→不开心"在侧身时也读得出来）
const profEye = (mood: Mood) => {
  switch (mood) {
    case "smile":
    case "warm":
      return <path d="M108 108 Q118 95 128 108" stroke={INK} strokeWidth={5.2} fill="none" strokeLinecap="round" />;
    case "tired":
    case "guilty":
      return (
        <g>
          <circle cx={118} cy={107} r={5} fill={INK} />
          <path d="M106 95 L130 100" stroke={INK} strokeWidth={4.6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "sad":
      return (
        <g>
          <circle cx={118} cy={107} r={5} fill={INK} />
          <path d="M105 93 L130 99" stroke={INK} strokeWidth={4.4} fill="none" strokeLinecap="round" />
          <path d="M127 118 q-3 11 0 17 q3 -6 0 -17" fill="#9FD8E8" />
        </g>
      );
    case "burst":
      return (
        <g>
          <ellipse cx={118} cy={107} rx={6} ry={8} fill={INK} />
          <path d="M104 92 L128 101" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case "worry":
      return (
        <g>
          <circle cx={118} cy={105} r={7} fill={INK} />
          <circle cx={120} cy={102} r={2.4} fill="#fff" />
          <path d="M106 92 L128 99" stroke={INK} strokeWidth={4.4} fill="none" strokeLinecap="round" />
        </g>
      );
    case "shock":
      return (
        <g>
          <circle cx={118} cy={105} r={12} fill="#fff" stroke={INK} strokeWidth={2} />
          <circle cx={118} cy={105} r={5} fill={INK} />
        </g>
      );
    default:
      return <circle cx={118} cy={107} r={5.4} fill={INK} />;
  }
};

const profMouth = (mood: Mood) => {
  switch (mood) {
    case "smile":
      return <path d="M114 133 Q126 143 138 131" stroke={MOUTH} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case "warm":
      return <path d="M112 130 Q126 149 140 128 Z" fill={MOUTH} />;
    case "burst":
      return (
        <g>
          <rect x={112} y={130} width={30} height={14} rx={5} fill={MOUTH} />
          <path d="M118 135 L126 131 M132 135 L140 131" stroke="#fff" strokeWidth={2.2} />
        </g>
      );
    case "sad":
      return <path d="M114 137 Q126 127 138 137" stroke={MOUTH} strokeWidth={5} fill="none" strokeLinecap="round" />;
    case "worry":
      return <ellipse cx={124} cy={134} rx={6} ry={8} fill={MOUTH} />;
    case "shock":
      return <ellipse cx={124} cy={134} rx={9} ry={12} fill={MOUTH} />;
    default:
      return <path d="M114 132 L136 132" stroke={MOUTH} strokeWidth={5} strokeLinecap="round" />;
  }
};

// 侧面头：后脑 + 耳 + 鼻 + 刘海（style 0 短发 / 1 侧分 / 2 发髻）
const profHead = (hair: string, skin: string, mood: Mood, style: 0 | 1 | 2) => (
  <g>
    <circle cx={100} cy={108} r={49} fill={skin} />
    <ellipse cx={80} cy={118} rx={8.5} ry={10.5} fill={skin} />
    <path d="M78 112 q6 6 0 13" stroke="#E8C7A6" strokeWidth={2.2} fill="none" strokeLinecap="round" />
    <path d="M143 103 q11 9 3.5 17 q-8 -4 -3.5 -17 z" fill={skin} stroke="#E0BE9C" strokeWidth={2} strokeLinejoin="round" />
    {style === 2 ? (
      <>
        <path d="M52 114 Q46 40 104 44 Q150 50 148 102 Q136 76 108 68 Q76 62 60 90 Q54 98 52 114 Z" fill={hair} />
        <circle cx={100} cy={30} r={20} fill={hair} />
      </>
    ) : style === 1 ? (
      <path d="M54 118 Q46 38 108 44 Q154 50 148 108 Q142 80 116 70 Q84 62 64 94 Q56 104 54 118 Z" fill={hair} />
    ) : (
      <path d="M52 116 Q46 40 104 44 Q150 48 148 106 Q138 74 108 66 Q78 60 62 94 Q54 102 52 116 Z" fill={hair} />
    )}
    {profEye(mood)}
    {profMouth(mood)}
    <ellipse cx={132} cy={121} rx={9} ry={5.5} fill={BLUSH} />
  </g>
);

type CommonProps = {
  x: number;
  y: number;
  s?: number;
  mood?: Mood;
  armL?: number;
  armR?: number;
  tilt?: number;
  breathe?: number;
  dim?: number;
  opacity?: number;
  flip?: boolean;
  look?: number;
  pose?: "stand" | "walk" | "cover"; // 站/走/双手捂脸
  photo?: boolean; // 抱一张全家福
  view?: "front" | "side"; // front=正面朝镜头；side=侧身行进（走路用）
};

// 全家福相框（抱在胸前）
const PhotoFrame: React.FC<{ cx?: number; cy?: number; s?: number }> = ({ cx = 100, cy = 300, s = 1 }) => (
  <g transform={`translate(${cx - 46 * s} ${cy - 38 * s}) scale(${s})`}>
    <rect x={0} y={0} width={92} height={76} rx={8} fill="#C98A4B" />
    <rect x={7} y={7} width={78} height={62} rx={5} fill="#FFFDF6" />
    <circle cx={26} cy={30} r={9} fill="#FFD9B3" />
    <rect x={18} y={40} width={16} height={20} rx={4} fill="#FF8A3D" />
    <circle cx={52} cy={30} r={9} fill="#FFD9B3" />
    <rect x={44} y={40} width={16} height={20} rx={4} fill="#E85D5D" />
    <circle cx={66} cy={42} r={6} fill="#FFD9B3" />
    <rect x={60} y={50} width={9} height={10} rx={3} fill="#F5C542" />
  </g>
);

const wrap = (opts: { x: number; y: number; s: number; tilt: number; dim: number; opacity: number; flip: boolean; bob: number }) => ({
  position: "absolute" as const,
  left: opts.x - 100 * opts.s,
  top: opts.y - 400 * opts.s + opts.bob,
  width: 200 * opts.s,
  height: 400 * opts.s,
  opacity: opts.opacity,
  transform: `rotate(${opts.tilt}deg) scaleX(${opts.flip ? -1 : 1})`,
  transformOrigin: "50% 100%",
  filter:
    opts.dim > 0
      ? `grayscale(${opts.dim}) brightness(${1 - opts.dim * 0.4})`
      : "drop-shadow(0 6px 0 rgba(42,46,58,0.08))",
});

const arm = (side: -1 | 1, deg: number, top: number, fill: string) => {
  const sx = 100 + side * 46;
  return (
    <g transform={`rotate(${side * -deg} ${sx} ${top + 14})`}>
      <rect x={sx - 12} y={top + 6} width={24} height={92} rx={12} fill={fill} />
      <circle cx={sx} cy={top + 104} r={14} fill={P.skin} />
    </g>
  );
};

// ============ 主角：橙色卫衣打工人 ============
export const Worker: React.FC<CommonProps & { mask?: boolean }> = ({
  x,
  y,
  s = 1,
  mood = "neutral",
  armL = 0,
  armR = 0,
  tilt = 0,
  breathe = 0,
  dim = 0,
  opacity = 1,
  flip = false,
  look = 0,
  mask = false,
  pose = "stand",
  photo = false,
  view = "front",
}) => {
  const frame = useCurrentFrame();
  const wob = (frame / 46) * Math.PI * 2; // 步频：一步周期 ≈46 帧
  const swing = pose === "walk" ? Math.sin(wob) * 24 : 0; // 前后腿交叉摆幅（度）
  const strideBob = pose === "walk" ? Math.abs(Math.sin(wob)) * 4 - 2 : 0; // 走路上下弹
  const wArm = pose === "walk" ? swing * 0.7 : 0; // 双臂反向摆
  const bob = (breathe > 0 ? Math.sin(frame / 18) * breathe * 4 : 0) + strideBob;
  const legH = 120;
  const top = 400 - legH - 120;
  const headY = top - 58;
  const lx = look * 6;
  const ey = headY + 6;
  const my = headY + 34;
  const guiltyTilt = mood === "guilty" ? 6 : 0;
  const poseTilt = pose === "cover" ? 9 : pose === "walk" ? 2 : 0;

  // 侧身行进视图：两段式腿摆动 + 反向摆臂 + 侧脸（走路不再"正面劈叉"）
  if (view === "side") {
    const phase = pose === "walk" ? wob : 0.5;
    const lean = pose === "walk" ? 3 : pose === "cover" ? 6 : 0;
    return (
      <div style={wrap({ x, y, s, tilt: tilt + poseTilt, dim, opacity, flip, bob })}>
        <svg viewBox="0 0 200 400" width={200 * s} height={400 * s} style={{ overflow: "visible", display: "block" }}>
          <ellipse cx={100} cy={404} rx={54} ry={10} fill="#1A2238" opacity={0.22} />
          <g transform={`rotate(${lean} ${HIP_X} ${HIP_Y})`}>
            {profLeg(phase + Math.PI, "#3F4F82", "#E9EEF7", "#C9D4E8")}
            {profLeg(phase, "#4C5E96", "#F4F6FA", "#D8DEE9")}
            {/* 侧身躯干（橙卫衣） */}
            <path d="M68 160 Q98 146 128 160 L134 266 Q98 276 62 266 Z" fill={P.orange} />
            <path d="M68 160 L90 154 L100 196 L110 154 L128 160 L128 266 Q98 274 68 266 Z" fill="#E8742A" opacity={0.4} />
            <path d="M90 154 L100 196 L110 154" fill="#FFF6E8" stroke="#E3C9A8" strokeWidth={2.2} strokeLinejoin="round" />
            <rect x={92} y={218} width={30} height={30} rx={9} fill="none" stroke="#E8742A" strokeWidth={3.2} />
            {profArm(phase + Math.PI, P.orange, P.skin, true)}
            {profArm(phase, P.orange, P.skin, false)}
            {profHead("#2A2D3A", P.skin, mood, 0)}
            {mask ? (
              <g transform="rotate(-6 106 110)">
                <rect x={58} y={60} width={96} height={100} rx={18} fill="#fff" stroke="#E3D5BC" strokeWidth={3} />
                <path d="M76 104 Q84 90 92 104" stroke={P.orange} strokeWidth={5.4} fill="none" strokeLinecap="round" />
                <path d="M104 104 Q112 90 120 104" stroke={P.orange} strokeWidth={5.4} fill="none" strokeLinecap="round" />
                <path d="M78 128 Q100 150 122 128" stroke={P.orange} strokeWidth={6} fill="none" strokeLinecap="round" />
              </g>
            ) : null}
            {photo ? <PhotoFrame cx={100} cy={216} s={0.86} /> : null}
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div style={wrap({ x, y, s, tilt: tilt + guiltyTilt + poseTilt, dim, opacity, flip, bob })}>
      <svg viewBox="0 0 200 400" width={200 * s} height={400 * s} style={{ overflow: "visible", display: "block" }}>
        <ellipse cx={100} cy={404} rx={68} ry={11} fill="#1A2238" opacity={0.22} />
        {/* 腿：walk 时两腿绕髋部反向摆动、真正交叉迈步 */}
        {pose === "walk" ? (
          <>
            <g transform={`rotate(${-swing} 100 280)`}>
              <rect x={70} y={280} width={30} height={legH - 14} rx={9} fill="#3F4F82" />
              <rect x={62} y={280 + legH - 16} width={48} height={15} rx={7} fill="#E9EEF7" stroke="#C9D4E8" strokeWidth={2} />
            </g>
            <g transform={`rotate(${swing} 100 280)`}>
              <rect x={70} y={280} width={30} height={legH - 14} rx={9} fill="#4C5E96" />
              <rect x={62} y={280 + legH - 16} width={48} height={15} rx={7} fill="#F4F6FA" stroke="#D8DEE9" strokeWidth={2} />
            </g>
          </>
        ) : (
          <>
            <rect x={66} y={280} width={30} height={legH - 12} rx={8} fill="#4C5E96" />
            <rect x={104} y={280} width={30} height={legH - 12} rx={8} fill="#4C5E96" />
            <rect x={58} y={386} width={42} height={14} rx={7} fill="#F4F6FA" stroke="#D8DEE9" strokeWidth={2} />
            <rect x={100} y={386} width={42} height={14} rx={7} fill="#F4F6FA" stroke="#D8DEE9" strokeWidth={2} />
          </>
        )}
        {/* 双臂：cover 时改为「双手捂脸」 */}
        {pose === "cover" ? (
          <g>
            <rect x={45} y={headY + 10} width={26} height={90} rx={13} fill={P.orange} transform={`rotate(-17 58 ${headY + 100})`} />
            <rect x={129} y={headY + 10} width={26} height={90} rx={13} fill={P.orange} transform={`rotate(17 142 ${headY + 100})`} />
            <circle cx={82} cy={headY + 12} r={15} fill={P.skin} />
            <circle cx={118} cy={headY + 12} r={15} fill={P.skin} />
          </g>
        ) : (
          <>
            {arm(-1, armL + wArm, top, P.orange)}
            {arm(1, armR + wArm, top, P.orange)}
          </>
        )}
        {/* 身体（橙卫衣 + 口袋） */}
        <rect x={54} y={top} width={92} height={128} rx={20} fill={P.orange} />
        <path d={`M78 ${top} Q100 ${top + 26} 122 ${top}`} fill="none" stroke="#E8742A" strokeWidth={4} />
        <rect x={78} y={top + 78} width={44} height={34} rx={10} fill="none" stroke="#E8742A" strokeWidth={3.4} />
        {/* 头（肤色） */}
        <circle cx={100} cy={headY} r={60} fill={P.skin} />
        {/* 头发（黑，清爽刘海） */}
        <path
          d={`M38 ${headY + 22} Q34 ${headY - 72} 100 ${headY - 68} Q168 ${headY - 72} 162 ${headY + 22} Q156 ${headY - 10} 140 ${headY - 22} Q134 ${headY - 4} 118 ${headY - 22} Q112 ${headY - 2} 96 ${headY - 20} Q88 ${headY - 2} 72 ${headY - 16} Q60 ${headY - 6} 48 ${headY + 6} Z`}
          fill="#2A2D3A"
        />
        {!mask ? (
          <>
            {eyesFor(mood, lx, ey)}
            {mouthFor(mood, my)}
            {blush(ey)}
          </>
        ) : (
          <g>
            {/* 笑脸面具 */}
            <rect x={62} y={headY - 34} width={76} height={82} rx={18} fill="#fff" stroke="#E3D5BC" strokeWidth={3} />
            <path d={`M76 ${headY + 2} Q80 ${headY - 8} 84 ${headY + 2}`} stroke={P.orange} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d={`M116 ${headY + 2} Q120 ${headY - 8} 124 ${headY + 2}`} stroke={P.orange} strokeWidth={5} fill="none" strokeLinecap="round" />
            <path d={`M74 ${headY + 22} Q100 ${headY + 42} 126 ${headY + 22}`} stroke={P.orange} strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>
        )}
        {photo ? <PhotoFrame cx={100} cy={top + 80} /> : null}
      </svg>
    </div>
  );
};

// ============ 妈妈：灰发髻 + 红毛衣 ============
export const Mom: React.FC<CommonProps & { dish?: boolean }> = ({
  x,
  y,
  s = 1,
  mood = "warm",
  armL = 0,
  armR = 0,
  tilt = 0,
  breathe = 0,
  dim = 0,
  opacity = 1,
  flip = false,
  look = 0,
  dish = false,
  photo = false,
}) => {
  const frame = useCurrentFrame();
  const bob = breathe > 0 ? Math.sin(frame / 20 + 1) * breathe * 3 : 0;
  const legH = 108;
  const top = 400 - legH - 116;
  const headY = top - 54;
  const lx = look * 5;
  const ey = headY + 6;
  const my = headY + 34;

  return (
    <div style={wrap({ x, y, s, tilt, dim, opacity, flip, bob })}>
      <svg viewBox="0 0 200 400" width={200 * s} height={400 * s} style={{ overflow: "visible", display: "block" }}>
        <ellipse cx={100} cy={404} rx={64} ry={10} fill="#1A2238" opacity={0.22} />
        {/* 腿 + 鞋 */}
        <rect x={68} y={400 - legH} width={26} height={legH - 10} rx={8} fill="#6B4A3A" />
        <rect x={106} y={400 - legH} width={26} height={legH - 10} rx={8} fill="#6B4A3A" />
        <rect x={60} y={388} width={40} height={13} rx={6} fill="#8A5A3A" />
        <rect x={100} y={388} width={40} height={13} rx={6} fill="#8A5A3A" />
        {arm(-1, armL, top, P.warmRed)}
        {arm(1, armR, top, P.warmRed)}
        {/* 身体（红毛衣 + 米白围裙） */}
        <rect x={56} y={top} width={88} height={132} rx={22} fill={P.warmRed} />
        <path d={`M74 ${top + 34} L126 ${top + 34} L134 ${top + 128} L66 ${top + 128} Z`} fill="#FFF6E8" />
        {/* 头（肤色） */}
        <circle cx={100} cy={headY} r={56} fill={P.skin} />
        {/* 灰白发髻 */}
        <circle cx={100} cy={headY - 62} r={22} fill="#DDE3EE" />
        <path
          d={`M42 ${headY + 16} Q40 ${headY - 64} 100 ${headY - 58} Q160 ${headY - 64} 158 ${headY + 16} Q140 ${headY - 18} 100 ${headY - 24} Q60 ${headY - 18} 42 ${headY + 16} Z`}
          fill="#DDE3EE"
        />
        {eyesFor(mood, lx, ey)}
        {mouthFor(mood, my)}
        {blush(ey)}
        {/* 手里的白瓷碗 */}
        {dish ? (
          <g transform={`rotate(${-armL} 54 ${top + 14})`}>
            <path d={`M-16 ${top + 96} a20 10 0 0 0 40 0 l-3 12 a14 7 0 0 1 -34 0 Z`} fill="#fff" stroke="#D8DEE9" strokeWidth={2.4} transform="translate(54 -20)" />
            <path d={`M-6 ${top + 66} q6 -8 0 -16 M4 ${top + 68} q6 -8 0 -16`} stroke="#C9D4E8" strokeWidth={3} fill="none" opacity={0.6 + 0.3 * Math.sin(frame / 9)} transform="translate(48 -6)" />
          </g>
        ) : null}
        {photo ? <PhotoFrame cx={100} cy={top + 84} s={0.92} /> : null}
      </svg>
    </div>
  );
};

// ============ 路人同事：三款发型 / 服装 / 配饰，精致度与主角对齐 ============
const EXTRA_LOOKS: Record<string, { top: string; deep: string; bag: string; hair: string; style: 0 | 1 | 2 }> = {
  blue: { top: "#5B8FD9", deep: "#3F6BB4", bag: "#E8742A", hair: "#2A2D3A", style: 0 },
  purple: { top: "#9B7BD9", deep: "#7558B6", bag: "#F5C542", hair: "#4A3226", style: 1 },
  teal: { top: "#4AB8A8", deep: "#2E8E82", bag: "#E8564B", hair: "#1F2233", style: 2 },
  green: { top: "#6FAF5B", deep: "#518A42", bag: "#5B8FD9", hair: "#2A2D3A", style: 0 },
};

export const Extra: React.FC<CommonProps & { hue?: keyof typeof EXTRA_LOOKS }> = ({
  x,
  y,
  s = 1,
  mood = "neutral",
  armL = 0,
  armR = 0,
  tilt = 0,
  breathe = 0,
  dim = 0,
  opacity = 1,
  flip = false,
  hue = "blue",
  pose = "stand",
  view = "front",
}) => {
  const frame = useCurrentFrame();
  const look = EXTRA_LOOKS[hue] ?? EXTRA_LOOKS.blue;
  const c = look.top;
  const deep = look.deep;
  const wob = (frame / 46) * Math.PI * 2;
  const swing = pose === "walk" ? Math.sin(wob) * 22 : 0;
  const strideBob = pose === "walk" ? Math.abs(Math.sin(wob)) * 4 - 2 : 0;
  const wArm = pose === "walk" ? swing * 0.7 : 0;
  const bob = (breathe > 0 ? Math.sin(frame / 22 + x) * breathe * 3 : 0) + strideBob;
  const top = 164;
  const headY = 104;

  // 侧身行进视图：与主角同一套侧身零件，配饰画在身后
  if (view === "side") {
    const phase = pose === "walk" ? wob : 0.5;
    const lean = pose === "walk" ? 3 : 0;
    return (
      <div style={wrap({ x, y, s, tilt, dim, opacity, flip, bob })}>
        <svg viewBox="0 0 200 400" width={200 * s} height={400 * s} style={{ overflow: "visible", display: "block" }}>
          <ellipse cx={100} cy={404} rx={52} ry={10} fill="#1A2238" opacity={0.2} />
          <g transform={`rotate(${lean} ${HIP_X} ${HIP_Y})`}>
            {look.style === 0 ? <rect x={50} y={174} width={36} height={74} rx={13} fill={look.bag} /> : null}
            {look.style === 1 ? (
              <g>
                <path d="M96 166 L62 210" stroke={look.bag} strokeWidth={7} strokeLinecap="round" />
                <rect x={40} y={204} width={44} height={38} rx={9} fill={look.bag} />
              </g>
            ) : null}
            {look.style === 2 ? <rect x={52} y={186} width={30} height={62} rx={11} fill={look.bag} /> : null}
            {profLeg(phase + Math.PI, "#3F4F82", "#E9EEF7", "#C9D4E8")}
            {profLeg(phase, "#4C5E96", "#F4F6FA", "#D8DEE9")}
            <path d="M68 160 Q98 146 128 160 L134 266 Q98 276 62 266 Z" fill={c} />
            <path d="M68 160 L90 154 L100 196 L110 154 L128 160 L128 266 Q98 274 68 266 Z" fill={deep} opacity={0.42} />
            <path d="M90 154 L100 196 L110 154" fill="#FFFDF6" stroke="#D8DEE9" strokeWidth={2.2} strokeLinejoin="round" />
            {look.style === 0 ? <rect x={74} y={164} width={12} height={72} rx={5} fill={look.bag} opacity={0.95} /> : null}
            {profArm(phase + Math.PI, c, P.skin, true)}
            {profArm(phase, c, P.skin, false)}
            {profHead(look.hair, P.skin, mood, look.style)}
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div style={wrap({ x, y, s, tilt, dim, opacity, flip, bob })}>
      <svg viewBox="0 0 200 400" width={200 * s} height={400 * s} style={{ overflow: "visible", display: "block" }}>
        <ellipse cx={100} cy={404} rx={62} ry={10} fill="#1A2238" opacity={0.2} />

        {/* 裤 + 鞋（walk 时两腿反向交叉迈步） */}
        {pose === "walk" ? (
          <>
            <g transform={`rotate(${-swing} 100 282)`}>
              <rect x={72} y={282} width={28} height={102} rx={9} fill="#3F4F82" />
              <rect x={64} y={382} width={46} height={15} rx={7} fill="#E9EEF7" stroke="#C9D4E8" strokeWidth={2} />
            </g>
            <g transform={`rotate(${swing} 100 282)`}>
              <rect x={72} y={282} width={28} height={102} rx={9} fill="#4C5E96" />
              <rect x={64} y={382} width={46} height={15} rx={7} fill="#F4F6FA" stroke="#D8DEE9" strokeWidth={2} />
            </g>
          </>
        ) : (
          <>
            <rect x={70} y={282} width={28} height={102} rx={9} fill="#4C5E96" />
            <rect x={102} y={282} width={28} height={102} rx={9} fill="#4C5E96" />
            <rect x={62} y={382} width={44} height={15} rx={7} fill="#F4F6FA" stroke="#D8DEE9" strokeWidth={2} />
            <rect x={94} y={382} width={44} height={15} rx={7} fill="#F4F6FA" stroke="#D8DEE9" strokeWidth={2} />
          </>
        )}

        {/* 手臂（袖 + 手） */}
        {arm(-1, armL + wArm, top, c)}
        {arm(1, armR + wArm, top, c)}

        {/* 躯干：内衬衫 + 开襟外套 + 领口 + 下摆 */}
        <path d="M56 164 Q100 148 144 164 L148 292 Q100 302 52 292 Z" fill={c} />
        <path d="M56 164 L86 158 L100 196 L114 158 L144 164 L140 292 Q100 300 60 292 Z" fill={deep} opacity={0.5} />
        <path d="M86 158 L100 196 L114 158" fill="#FFFDF6" stroke="#D8DEE9" strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M52 292 Q100 300 148 292" fill="none" stroke={deep} strokeWidth={4} />

        {/* 配饰：双肩包 / 单肩挎包 / 咖啡杯 */}
        {look.style === 0 ? (
          <g>
            <rect x={72} y={166} width={12} height={70} rx={5} fill={look.bag} opacity={0.9} />
            <rect x={116} y={166} width={12} height={70} rx={5} fill={look.bag} opacity={0.9} />
          </g>
        ) : look.style === 1 ? (
          <g>
            <path d="M120 168 L158 206" stroke={look.bag} strokeWidth={7} strokeLinecap="round" />
            <rect x={142} y={204} width={44} height={38} rx={9} fill={look.bag} />
            <rect x={142} y={204} width={44} height={10} rx={5} fill="#00000022" />
          </g>
        ) : (
          <g>
            <rect x={148} y={212} width={32} height={38} rx={8} fill="#FFFDF6" stroke={look.bag} strokeWidth={4} />
            <rect x={148} y={212} width={32} height={10} rx={5} fill={look.bag} />
          </g>
        )}

        {/* 头 */}
        <circle cx={100} cy={headY} r={52} fill={P.skin} />
        {/* 三款发型 */}
        {look.style === 0 ? (
          <path d={`M50 112 Q48 40 100 44 Q152 40 150 112 Q132 76 100 70 Q68 76 50 112 Z`} fill={look.hair} />
        ) : look.style === 1 ? (
          <path d={`M50 118 Q46 38 106 42 Q156 46 150 108 Q148 80 118 66 Q86 56 62 84 Q54 94 50 118 Z`} fill={look.hair} />
        ) : (
          <>
            <path d={`M50 118 Q48 38 100 42 Q152 38 150 118 Q130 76 96 66 Q66 76 50 118 Z`} fill={look.hair} />
            <circle cx={100} cy={40} r={19} fill={look.hair} />
          </>
        )}

        {eyesFor(mood, 0, headY + 6)}
        {mouthFor(mood, headY + 34)}
        {blush(headY + 6)}
      </svg>
    </div>
  );
};
