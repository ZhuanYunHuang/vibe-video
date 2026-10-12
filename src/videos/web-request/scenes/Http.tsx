import React from "react";
import { C, Caption, hit, MONO, pop, prog, SceneProps, SceneTitle, useAt, useT } from "../../../shared";

const REQ = ["GET / HTTP/2", "Host: www.example.com", "User-Agent: Chrome", "Accept: text/html", "Cookie: session=…"];
const RES = ["HTTP/2 200 OK", "Content-Type: text/html", "Cache-Control: max-age=600", "", "<!DOCTYPE html>", "<html>…</html>"];

// 报文卡片：每行在指定拍上落下
const Paper: React.FC<{ t: number; x: number; lines: string[]; from: number; per: number; color: string; title: string; enter: number }> = ({
  t,
  x,
  lines,
  from,
  per,
  color,
  title,
  enter,
}) => {
  const s = pop(t, enter, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 230,
        width: 760,
        minHeight: 520,
        borderRadius: 24,
        background: C.panel,
        border: `4px solid ${color}`,
        padding: "26px 36px",
        fontFamily: MONO,
        transform: `translateY(${(1 - s) * 200}px) rotate(${(1 - s) * (x < 900 ? -8 : 8)}deg)`,
        opacity: s,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 900, color, marginBottom: 20 }}>{title}</div>
      {lines.map((l, i) => {
        const f = from + i * per;
        const ls = pop(t, f, 14);
        return (
          <div
            key={i}
            style={{
              fontSize: i === 0 ? 38 : 30,
              fontWeight: i === 0 ? 900 : 400,
              color: i === 0 ? C.text : C.dim,
              height: 56,
              opacity: t >= f ? ls : 0,
              transform: `translateX(${(1 - ls) * 40}px) scale(${i === 0 ? 1 + hit(t, f, 4) * 0.15 : 1})`,
              transformOrigin: "left center",
            }}
          >
            {l}
          </div>
        );
      })}
    </div>
  );
};

// HTTP 请求与响应
export const Http: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const k = (n: number) => at(start, n);
  const halfBeat = Math.round(k(1) / 2);
  const ok = k(7);
  const fly = prog(t, k(5), 12);

  return (
    <>
      <SceneTitle t={t} step="04" title="HTTP：正式点菜" color={C.yellow} />
      <Paper t={t} x={150 - fly * 60} lines={REQ} from={k(1)} per={halfBeat} color={C.cyan} title="➡ 请求 Request" enter={0} />
      <Paper t={t} x={1010} lines={RES} from={k(6)} per={halfBeat} color={C.yellow} title="⬅ 响应 Response" enter={k(5)} />
      {/* 200 OK 大印章 */}
      {t >= ok ? (
        <div
          style={{
            position: "absolute",
            left: 1330,
            top: 160,
            fontFamily: MONO,
            fontSize: 110,
            fontWeight: 900,
            color: C.green,
            textShadow: `0 0 40px ${C.green}`,
            transform: `scale(${1 + (1 - pop(t, ok, 8)) * 2}) rotate(-10deg)`,
            opacity: pop(t, ok, 8),
          }}
        >
          200
        </div>
      ) : null}
      <Caption t={t} from={k(9)} text="请求说清楚要什么，响应带回状态码和内容" />
    </>
  );
};
