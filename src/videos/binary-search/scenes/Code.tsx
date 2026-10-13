import React from "react";
import { interpolate } from "remotion";
import { CL, FONT, MONO, pop, SceneProps, useAt, useT } from "../../../shared";
import { Clawd } from "../kit/Clawd";
import { NUMS, P, TARGET } from "../kit/theme";
import { Bubble, Chapter, Sub, usePulse } from "../kit/ui";

const CODE = [
  "function binarySearch(arr, target) {",
  "  let lo = 0, hi = arr.length - 1;",
  "  while (lo <= hi) {",
  "    const mid = Math.floor((lo + hi) / 2);",
  "    if (arr[mid] === target) return mid;",
  "    if (arr[mid] < target) lo = mid + 1;",
  "    else hi = mid - 1;",
  "  }",
  "  return -1;",
  "}",
];
const KEYWORDS = new Set(["function", "let", "const", "while", "if", "else", "return"]);

// 每行对应的排队比喻
const NOTES: { line: number; text: string }[] = [
  { line: 1, text: "圈出整支队伍" },
  { line: 3, text: "走到正中间" },
  { line: 4, text: "就是你！" },
  { line: 5, text: "太小，去右半边" },
  { line: 6, text: "太大，去左半边" },
  { line: 8, text: "问完都没有" },
];

// 代码真实执行一遍：记录每一步高亮的行和变量
type Step = { line: number; lo: number; hi: number; mid: number | null };
const STEPS = (() => {
  const out: Step[] = [];
  let lo = 0;
  let hi = NUMS.length - 1;
  out.push({ line: 1, lo, hi, mid: null });
  while (lo <= hi) {
    out.push({ line: 2, lo, hi, mid: null });
    const mid = Math.floor((lo + hi) / 2);
    out.push({ line: 3, lo, hi, mid });
    out.push({ line: 4, lo, hi, mid });
    if (NUMS[mid] === TARGET) break;
    if (NUMS[mid] < TARGET) {
      lo = mid + 1;
      out.push({ line: 5, lo, hi, mid });
    } else {
      hi = mid - 1;
      out.push({ line: 6, lo, hi, mid });
    }
  }
  return out;
})();

const LINE_H = 62;
const CODE_TOP = 190;
const CODE_LEFT = 120;

// 简单语法着色
const Highlight: React.FC<{ src: string }> = ({ src }) => (
  <>
    {src.split(/(\b\w+\b)/).map((tok, i) => {
      let color: string = P.paper;
      if (KEYWORDS.has(tok)) color = P.clayLight;
      else if (/^\d+$/.test(tok)) color = P.gold;
      else if (tok === "binarySearch" || tok === "floor") color = "#9CC7EF";
      return (
        <span key={i} style={{ color }}>
          {tok}
        </span>
      );
    })}
  </>
);

// 07 写成代码：逐行打出，再真实跑一遍
export const Code: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const pulse = usePulse(start);

  const lineAt = (i: number) => k(1 + i * 1.5);
  const noteAt = (j: number) => k(18 + j * 2);
  const runFrom = 31;
  const stepAt = (s: number) => k(runFrom + s);
  const runEnd = stepAt(STEPS.length);
  const step = STEPS.reduce((m, _, s) => (t >= stepAt(s) ? s : m), -1);
  const cur = step >= 0 ? STEPS[step] : null;
  const notesFade = interpolate(t, [stepAt(0) - 6, stepAt(0) + 4], [1, 0], CL);
  const panel = pop(t, stepAt(0), 13);
  const ret = pop(t, runEnd, 10);
  const panelS = pop(t, k(1), 14);

  return (
    <>
      <Chapter t={t} no="07" title="写成代码" />

      {/* 代码面板 */}
      <div
        style={{
          position: "absolute",
          left: CODE_LEFT - 30,
          top: CODE_TOP - 40,
          width: 1060,
          height: CODE.length * LINE_H + 70,
          borderRadius: 28,
          background: P.ink,
          boxShadow: "0 24px 0 #1F1E1D22",
          opacity: panelS,
          transform: `translateY(${(1 - panelS) * 60}px)`,
        }}
      />
      {/* 当前执行行高亮 */}
      {cur ? (
        <div
          style={{
            position: "absolute",
            left: CODE_LEFT - 30,
            width: 1060,
            top: CODE_TOP - 10 + cur.line * LINE_H,
            height: LINE_H,
            background: `${P.clay}55`,
            borderLeft: `8px solid ${P.clay}`,
            transform: `scaleY(${1 + Math.exp(-(t - stepAt(step)) / 4) * 0.25})`,
          }}
        />
      ) : null}
      {CODE.map((ln, i) => {
        const a = lineAt(i);
        const chars = Math.floor(interpolate(t, [a, a + Math.round(k(1) * 1.2)], [0, ln.length], CL));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: CODE_LEFT,
              top: CODE_TOP + i * LINE_H,
              fontFamily: MONO,
              fontSize: 31,
              whiteSpace: "pre",
              opacity: t >= a ? 1 : 0,
            }}
          >
            <span style={{ color: "#6F675E", marginRight: 22 }}>{String(i + 1).padStart(2, " ")}</span>
            <Highlight src={ln.slice(0, chars)} />
          </div>
        );
      })}

      {/* 比喻注释 */}
      {NOTES.map((n, j) => {
        const s = pop(t, noteAt(j), 12);
        return (
          <div
            key={n.line}
            style={{
              position: "absolute",
              left: 1200,
              top: CODE_TOP + n.line * LINE_H - 4,
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: Math.min(1, s * 1.4) * notesFade,
              transform: `translateX(${(1 - s) * 50}px)`,
            }}
          >
            <div style={{ width: 40, height: 4, background: P.clay }} />
            <div
              style={{
                padding: "6px 20px",
                borderRadius: 14,
                background: P.paper,
                border: `3px solid ${P.clay}`,
                fontFamily: FONT,
                fontSize: 30,
                fontWeight: 800,
                color: P.ink,
              }}
            >
              {n.text}
            </div>
          </div>
        );
      })}

      {/* 变量面板 */}
      {cur ? (
        <div
          style={{
            position: "absolute",
            left: 1240,
            top: 210,
            width: 560,
            padding: "26px 34px",
            borderRadius: 26,
            background: P.paper,
            border: `4px solid ${P.ink}`,
            opacity: panel,
            transform: `scale(${0.8 + panel * 0.2})`,
            fontFamily: MONO,
            fontSize: 38,
            fontWeight: 800,
            color: P.ink,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 28, color: P.sub, marginBottom: 14 }}>target = 81</div>
          {(
            [
              ["lo", cur.lo, P.sky],
              ["hi", cur.hi, P.rose],
              ["mid", cur.mid, P.clay],
            ] as const
          ).map(([name, val, color]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color }}>{name}</span>
              <span>{val === null ? "—" : val}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, fontSize: 32, color: P.sub }}>
            arr[mid] = <span style={{ color: P.clay }}>{cur.mid === null ? "—" : NUMS[cur.mid]}</span>
          </div>
        </div>
      ) : null}

      {/* 返回结果 */}
      {t >= runEnd ? (
        <div
          style={{
            position: "absolute",
            left: 1240,
            top: 640,
            width: 560,
            textAlign: "center",
            padding: "18px 0",
            borderRadius: 24,
            background: P.clay,
            color: P.paper,
            fontFamily: MONO,
            fontSize: 54,
            fontWeight: 900,
            transform: `scale(${ret})`,
            boxShadow: `0 0 ${pulse * 40}px ${P.clay}`,
          }}
        >
          return 12
        </div>
      ) : null}

      <Clawd
        x={1700}
        y={980}
        u={7}
        mood={t >= runEnd ? "happy" : step >= 0 ? "think" : "normal"}
        squash={pulse * 0.2}
        jump={t >= runEnd ? Math.abs(Math.sin(((t - runEnd) / k(1)) * Math.PI)) * 30 : 0}
        look={-1}
        lookY={-0.5}
        arm={t >= runEnd ? 1 : 0}
      />
      <Bubble t={t} from={k(4)} to={k(15)} x={1640} y={890} text="核心就这几行" size={28} />

      <Sub t={t} from={k(1)} to={k(17)}>
        把排队的过程翻译成代码
      </Sub>
      <Sub t={t} from={k(18)} to={k(30)}>
        每一行，都对应排队时的一个动作
      </Sub>
      <Sub t={t} from={stepAt(0) + 2} to={runEnd - 2}>
        跑一遍：lo、hi 一步步向 81 收拢
      </Sub>
      <Sub t={t} from={runEnd + Math.round(k(2))}>
        循环 4 轮，返回下标 12
      </Sub>
    </>
  );
};
