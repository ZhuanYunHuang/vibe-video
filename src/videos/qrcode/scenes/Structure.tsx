import React from "react";
import { C, Caption, FONT, hit, pop, prog, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

const SIDE = 22; // 二维码边长（格数）
const CELL = 26;
const OFFSET = 60;

// 用确定性伪随机生成"看起来像二维码"的黑白点阵（3 个定位角固定）
const makeGrid = (): boolean[][] => {
  const g: boolean[][] = [];
  let seed = 42;
  for (let r = 0; r < SIDE; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < SIDE; c++) {
      seed = (seed * 1103515245 + 12345) % 2147483648;
      row.push(seed % 2 === 0);
    }
    g.push(row);
  }
  return g;
};
const GRID = makeGrid();

// 定位角：左上/右上/左下 三个 7×7 方框
const isLocator = (r: number, c: number) =>
  (r < 7 && c < 7) || (r < 7 && c >= SIDE - 7) || (r >= SIDE - 7 && c < 7);

const locatorBox = (cx: number, cy: number, color: string, s: number) => (
  <div
    style={{
      position: "absolute",
      left: cx - 7 * CELL * s * 0.5,
      top: cy - 7 * CELL * s * 0.5,
      width: 7 * CELL * s,
      height: 7 * CELL * s,
      border: `${4 * s}px solid ${color}`,
      borderRadius: 8,
      transform: `scale(${s})`,
      opacity: s,
    }}
  />
);

// 二维码结构：三个定位角 + 数据区
export const Structure: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const total = 22 * CELL + OFFSET * 2;
  const left = (1920 - total) / 2;
  const top = 180;
  const cy = top + total / 2;

  const showData = t >= k(6);
  const dataP = prog(t, k(6), 8);
  const capAt = k(10);

  // 三个定位角逐个点亮
  const corners = [
    { c: [left + OFFSET + 3 * CELL, top + OFFSET + 3 * CELL], i: 0 },
    { c: [left + total - OFFSET - 3 * CELL, top + OFFSET + 3 * CELL], i: 1 },
    { c: [left + OFFSET + 3 * CELL, top + total - OFFSET - 3 * CELL], i: 2 },
  ];

  return (
    <>
      <SceneTitle t={t} step="02" title="三个定位角，一眼找到方向" color={C.purple} />
      {/* 网格 */}
      <div
        style={{
          position: "absolute",
          left,
          top,
          display: "grid",
          gridTemplateColumns: `repeat(${SIDE}, ${CELL}px)`,
          gap: 2,
          opacity: pop(t, k(1), 10),
          transform: `translateY(${(1 - pop(t, k(1), 10)) * 120}px)`,
        }}
      >
        {GRID.map((row, r) =>
          row.map((dark, c) => {
            const inLoc = isLocator(r, c);
            return (
              <div
                key={`${r}-${c}`}
                style={{
                  width: CELL,
                  height: CELL,
                  borderRadius: 3,
                  background: inLoc ? "#fff" : dark ? "#fff" : "transparent",
                  border: "1px solid #2a3561",
                }}
              />
            );
          }),
        )}
      </div>

      {/* 数据区着色遮罩（拍 6 起） */}
      {showData ? (
        <div
          style={{
            position: "absolute",
            left: left + 7 * CELL,
            top: top + 7 * CELL,
            width: (SIDE - 14) * CELL + 8,
            height: (SIDE - 14) * CELL + 8,
            borderRadius: 10,
            background: `${C.cyan}22`,
            border: `3px solid ${C.cyan}`,
            boxShadow: `0 0 ${30 * dataP}px ${C.cyan}66`,
            opacity: dataP,
          }}
        />
      ) : null}

      {/* 定位角高亮框 */}
      {corners.map(({ c, i }) => {
        const s = pop(t, k(2 + i * 1.5), 10);
        const hl = hit(t, k(2 + i * 1.5), 5);
        return (
          <React.Fragment key={i}>
            {locatorBox(c[0], c[1], C.yellow, s)}
            {t >= k(2 + i * 1.5) ? (
              <div
                style={{
                  position: "absolute",
                  left: c[0] + 40,
                  top: c[1] - 20,
                  fontSize: 30,
                  fontWeight: 800,
                  fontFamily: FONT,
                  color: C.yellow,
                  opacity: s * (0.6 + hl * 0.4),
                }}
              >
                {i === 0 ? "定位角 ①" : i === 1 ? "定位角 ②" : "定位角 ③"}
              </div>
            ) : null}
          </React.Fragment>
        );
      })}

      {/* 数据区说明 */}
      {t >= k(7) ? (
        <div
          style={{
            position: "absolute",
            left: left + total + 40,
            top: cy - 30,
            fontSize: 34,
            fontFamily: FONT,
            color: C.cyan,
            fontWeight: 700,
            opacity: pop(t, k(7), 10),
          }}
        >
          这些格子里<br />装的才是数据
        </div>
      ) : null}

      <Caption t={t} from={capAt} text="先找三个角定方向，剩下的格子解码数据" />
    </>
  );
};
