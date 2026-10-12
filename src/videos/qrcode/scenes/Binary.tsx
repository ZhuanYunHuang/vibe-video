import React from "react";
import { C, Caption, FONT, MONO, pop, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

// 字母 A 的 5×7 点阵：1 = 黑格，0 = 白格
const GRID = [
  [0, 1, 1, 1, 0],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
];

const CELL = 56;
const ROWS = GRID.length;
const COLS = GRID[0].length;

// 单个格子：出现时轻微弹出
const Cell: React.FC<{ dark: boolean; on: number; size: number }> = ({ dark, on, size }) => {
  const s = pop(on, 0, 8);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: dark ? "#fff" : "#0b1020",
        border: "2px solid #2a3561",
        opacity: s,
        transform: `scale(${0.5 + s * 0.5})`,
      }}
    />
  );
};

// 二进制原理：白 0 黑 1，逐格点亮拼出字母 A
export const Binary: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  // 每行从 k(1 + i) 拍开始扫
  const rowStart = (i: number) => at(start, 1 + i * 1.5);
  const cellStep = Math.round(at(start, 1) / 5);
  // 某格是否亮起：行开始后，格子在行内逐个点亮
  const cellOn = (r: number, c: number) => t >= rowStart(r) + c * cellStep;
  const labelAt = at(start, 12);
  const lettersAt = at(start, 15);

  return (
    <>
      <SceneTitle t={t} step="01" title="白 0 黑 1：方格里住着二进制" color={C.cyan} />
      <div style={{ position: "absolute", left: 320, top: 150 }}>
        <div style={{ display: "flex", gap: 14 }}>
          {GRID.map((row, r) => (
            <React.Fragment key={r}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {row.map((v, c) => (
                  <Cell key={c} dark={v === 1} on={cellOn(r, c) ? 1 : 0} size={CELL} />
                ))}
              </div>
              {r < ROWS - 1 ? (
                <div
                  style={{
                    alignSelf: "center",
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    background: C.line,
                    opacity: t >= rowStart(r) + COLS * cellStep ? 0.5 : 0,
                  }}
                />
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 行二进制码 */}
      <div style={{ position: "absolute", left: 320, top: 150 + ROWS * (CELL + 14) + 20 }}>
        {GRID.map((row, r) => (
          <div key={r} style={{ fontFamily: MONO, fontSize: 26, color: C.dim, marginBottom: 10, opacity: pop(t, rowStart(r) + COLS * cellStep, 8) }}>
            {row.join("")}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 980,
          top: 300,
          width: 520,
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 800, fontFamily: FONT, color: C.text, opacity: pop(t, labelAt, 10) }}>
          <span style={{ color: C.yellow }}>黑 = 1</span>　白 = 0
        </div>
        <div style={{ marginTop: 30, fontSize: 34, color: C.dim, fontFamily: FONT, opacity: pop(t, labelAt + 6, 10) }}>
          7×5 个格子，就能拼出一个字母
        </div>
        {t >= lettersAt ? (
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ fontSize: 34, color: C.dim, fontFamily: MONO }}>01000001</div>
            <div style={{ fontSize: 26, color: C.dim }}>=</div>
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: 24,
                background: C.panel,
                border: `4px solid ${C.cyan}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 70,
                fontWeight: 900,
                color: C.cyan,
                transform: `scale(${pop(t, lettersAt, 10)})`,
              }}
            >
              A
            </div>
          </div>
        ) : null}
      </div>

      <Caption t={t} from={at(start, 18)} text="所有文字、网址、声音，在机器眼里都是 0 和 1" />
    </>
  );
};
