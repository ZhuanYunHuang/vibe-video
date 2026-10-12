import React from "react";
import { interpolate } from "remotion";
import { CL, C, Caption, FONT, hit, MONO, pop, SceneProps, useAt, useT } from "../../../shared";

const URL_TEXT = "https://www.example.com";

// 浏览器地址栏输入网址，最后一拍按下回车
export const Browser: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const win = pop(t, 0, 13);
  const typeEnd = at(start, 5);
  const chars = Math.floor(interpolate(t, [at(start, 1), typeEnd], [0, URL_TEXT.length], CL));
  const enterAt = at(start, 6);
  const press = hit(t, enterAt, 4);
  const pressed = t >= enterAt;
  const ring = interpolate(t, [enterAt, enterAt + 20], [0, 1], CL);
  const cursorOn = Math.floor(t / 8) % 2 === 0 || t < typeEnd;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 260,
          top: 170,
          width: 1400,
          height: 640,
          borderRadius: 28,
          background: C.panel,
          border: `3px solid ${C.line}`,
          boxShadow: "0 40px 120px #0008",
          transform: `translateY(${(1 - win) * 300}px) scale(${0.85 + win * 0.15})`,
          opacity: win,
          overflow: "hidden",
          fontFamily: FONT,
        }}
      >
        <div style={{ height: 80, background: "#1c2547", display: "flex", alignItems: "center", padding: "0 30px", gap: 14 }}>
          {[C.red, C.yellow, C.green].map((c) => (
            <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />
          ))}
          <div
            style={{
              marginLeft: 30,
              flex: 1,
              height: 50,
              borderRadius: 25,
              background: C.bg,
              border: `3px solid ${pressed ? C.cyan : C.line}`,
              display: "flex",
              alignItems: "center",
              padding: "0 26px",
              fontFamily: MONO,
              fontSize: 30,
              color: C.text,
            }}
          >
            <span style={{ color: C.green, marginRight: 12 }}>🔒</span>
            {URL_TEXT.slice(0, chars)}
            <span style={{ opacity: cursorOn ? 1 : 0, color: C.cyan }}>|</span>
          </div>
        </div>
        {/* 空白页面 + 加载条 */}
        <div style={{ position: "relative", height: 560, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", top: 0, left: 0, height: 6, background: C.cyan, width: `${pressed ? ring * 40 : 0}%` }} />
          <div style={{ fontSize: 44, color: C.dim, fontWeight: 700 }}>{pressed ? "加载中…" : "输入网址"}</div>
        </div>
      </div>

      {/* 回车键 */}
      <div
        style={{
          position: "absolute",
          left: 1460,
          top: 740,
          width: 260,
          height: 130,
          borderRadius: 24,
          background: pressed ? C.cyan : "#2a3561",
          color: pressed ? C.bg : C.text,
          border: `4px solid ${C.cyan}`,
          boxShadow: pressed ? `0 4px 0 #0369a1` : `0 14px 0 #0369a1`,
          transform: `translateY(${pressed ? 10 : 0}px) scale(${pop(t, at(start, 4), 10) * (1 - press * 0.1)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 50,
          fontWeight: 900,
          fontFamily: FONT,
        }}
      >
        Enter ⏎
      </div>
      {pressed ? (
        <div
          style={{
            position: "absolute",
            left: 1590 - ring * 400,
            top: 805 - ring * 400,
            width: ring * 800,
            height: ring * 800,
            borderRadius: "50%",
            border: `${8 * (1 - ring)}px solid ${C.cyan}`,
            opacity: 1 - ring,
          }}
        />
      ) : null}
      <Caption t={t} from={at(start, 2)} text="敲下回车的那一刻，一场接力赛开始了" />
    </>
  );
};
