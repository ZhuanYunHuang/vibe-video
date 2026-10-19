import React from "react";
import { FPS, Shockwave, SpeedLines, useBeat, useT } from "../../shared";
import { Fonts } from "./Fonts";
import { GhostLine, Grain, LineSlab, Scanlines, Vignette } from "./frame";
import { LineBoard } from "./line";
import { PAL, textWidth, type Pal, type ThemeId } from "./theme";
import type { Line } from "./types";

// 奇数场残影放右侧，避免每场构图一样
const ghostX = (index: number) => (index % 2 === 0 ? -140 : 820);

// 事件型插画：按绝对秒数触发，layer=back 压在字后，front 盖在字前
export type FxEvent = { at: number; dur: number; layer?: "back" | "front"; render: (p: number, pal: Pal) => React.ReactNode };

// 一场 = 2 句：场内按句硬切；dropSec 到点整屏换色并保持。
// 注意：转场不做逐句闪白（久看刺眼），只在 dropSec 闪一次。
export const LyricStage: React.FC<{
    start: number;
    index: number;
    beats: number;
    isLast?: boolean;
    lines: Line[];
    dropSec: number;
    label?: string;
    palette?: Record<ThemeId, Pal>;
    ghostText?: string;
    frame?: boolean;
    overlay?: (t: number, dropD: number, pal: Pal) => React.ReactNode;
    events?: FxEvent[];
    blowAt?: number;
    shakeAt?: number;
    shakeAts?: { at: number; amp?: number }[];
}> = ({ start, index, beats, isLast, lines, dropSec, label = "PG ONE", palette = PAL, ghostText, frame = false, overlay, events, blowAt, shakeAt, shakeAts }) => {
    const beat = useBeat();
    const t = useT() + beat.TRANS;
    const s0 = beat.bf(start);
    const fromFrame = Math.max(0, s0 - beat.TRANS);
    const toT = (sec: number) => Math.round(sec * FPS) - fromFrame;
    const sceneStartSec = (s0 - beat.OFFSET) / FPS;
    const sceneEndSec = sceneStartSec + (beats * beat.BEAT) / FPS;

    const sceneLines = lines.filter((l) => l.e > sceneStartSec + 0.02 && l.s < sceneEndSec - 0.02);
    if (!sceneLines.length) return null;

    const cur = sceneLines.find((l) => t >= toT(l.s) && t < toT(l.e)) ?? (t < toT(sceneLines[0].s) ? sceneLines[0] : sceneLines[sceneLines.length - 1]);
    const isPost = t >= toT(dropSec);
    const pal = palette[isPost ? cur.theme : "dark"];
    const last = lines[lines.length - 1];
    const endT = toT(last.e);
    const outro = isLast ? Math.min(1, Math.max(0, (t - endT) / 6)) : 0;

    const prev = lines[Math.max(0, cur.i - 2)];
    const autoGhost = cur.i === 1 ? "" : prev.parts.reduce((a, b) => (textWidth(b.text) > textWidth(a.text) ? b : a)).text;
    const ghost = ghostText ?? autoGhost;

    const dropT = toT(dropSec);
    const showDrop = dropSec >= sceneStartSec - 0.02 && dropSec < sceneEndSec - 0.02;
    const dropD = t - dropT;

    const blow = blowAt !== undefined && t >= toT(blowAt) ? Math.min(1, (t - toT(blowAt)) / 8) : 0;
    const blowStyle: React.CSSProperties | undefined = blow
        ? { transform: `translate(${blow * blow * 1500}px, ${-blow * 240}px) rotate(${blow * 9}deg)`, opacity: Math.max(0, 1 - blow * 1.15), filter: `blur(${blow * 4}px)` }
        : undefined;

    const shakeList = shakeAts ?? (shakeAt !== undefined ? [{ at: shakeAt }] : []);
    let sh = 0;
    for (const e of shakeList) {
        const d = t - toT(e.at);
        if (d >= 0 && d < 16) {
            const v = Math.exp(-d / 5.5) * Math.sin(d * 2.4) * (e.amp ?? 1);
            if (Math.abs(v) > Math.abs(sh)) sh = v;
        }
    }
    const shakeAmp = Math.abs(sh);
    const shakeStyle: React.CSSProperties | undefined = shakeAmp > 0.001
        ? { transform: `translate(${sh * 28}px, ${-sh * 16}px) rotate(${sh * 0.7}deg) scale(${1 + 0.035 * shakeAmp})`, transformOrigin: "center" }
        : undefined;

    const layer = (which: "back" | "front") =>
        (events ?? []).map((e, i) => {
            const d = t - (Math.round(e.at * FPS) - s0);
            if (d < 0 || d >= e.dur || (e.layer ?? "back") !== which) return null;
            return <React.Fragment key={`${which}-${i}`}>{e.render(Math.min(1, d / e.dur), pal)}</React.Fragment>;
        });

    return (
        <div style={{ position: "absolute", inset: 0, ...shakeStyle }}>
            <div style={{ position: "absolute", inset: 0, background: palette[sceneLines[0].s >= dropSec ? sceneLines[0].theme : "dark"].bg }} />
            <Fonts />
            {sceneLines.map((l) => (
                <LineSlab key={`slab-${l.i}`} t={t} at={toT(l.s)} color={palette[l.s >= dropSec ? l.theme : "dark"].bg} />
            ))}
            {showDrop ? <LineSlab t={t} at={dropT} color={palette.red.bg} /> : null}

            <GhostLine t={t} text={ghost} size={370} x={ghostX(index)} y={700} rot={index % 2 === 0 ? -6 : -4} opacity={isPost ? 0.09 : 0.055} color={pal.ink} />

            <Scanlines t={t} opacity={pal.scan} />
            <Grain t={t} opacity={pal.grain} />
            <Vignette strength={pal.vig} />

            {layer("back")}

            <div style={{ position: "absolute", inset: 0, ...blowStyle }}>
                <LineBoard t={t} line={cur} s={toT(cur.s)} pal={pal} />
            </div>

            {showDrop && dropD >= 0 && dropD < 20 ? <Shockwave t={t} at={dropT} x={960} y={520} color={`${palette.red.burst}AA`} rings={3} maxRadius={900} dur={20} /> : null}
            {showDrop && dropD >= 0 && dropD < 10 ? <SpeedLines t={t} at={dropT} color={`${palette.red.burst}55`} dur={10} n={16} cx={960} cy={520} inner={380} outer={1300} /> : null}
            {showDrop && dropD >= 0 && dropD < 2 ? (
                <div style={{ position: "absolute", inset: 0, background: palette.red.burst, opacity: dropD === 0 ? 0.55 : 0.2, pointerEvents: "none" }} />
            ) : null}
            {overlay ? overlay(t, dropD, pal) : null}
            {layer("front")}
            {isLast ? <div style={{ position: "absolute", inset: 0, background: palette.red.bg, opacity: outro, pointerEvents: "none" }} /> : null}

            {frame ? (
                <>
                    <div style={{ position: "absolute", inset: 24, border: `1px solid ${pal.ink}2E`, pointerEvents: "none" }} />
                    <div style={{ position: "absolute", inset: 32, border: `1px solid ${pal.ink}1A`, pointerEvents: "none" }} />
                    {[
                        { left: 24, top: 24, borderLeftWidth: 3, borderTopWidth: 3 },
                        { right: 24, top: 24, borderRightWidth: 3, borderTopWidth: 3 },
                        { left: 24, bottom: 24, borderLeftWidth: 3, borderBottomWidth: 3 },
                        { right: 24, bottom: 24, borderRightWidth: 3, borderBottomWidth: 3 },
                    ].map((c, i) => (
                        <div key={i} style={{ position: "absolute", width: 64, height: 64, borderStyle: "solid", borderWidth: 0, borderColor: `${pal.ink}99`, ...c }} />
                    ))}
                </>
            ) : null}

            <div style={{ position: "absolute", left: 60, top: 116, fontFamily: '"Consolas",monospace', fontSize: 19, letterSpacing: 5, color: `${pal.ink}88` }}>
                {`L.${String(cur.i).padStart(2, "0")}`}
            </div>
            <div style={{ position: "absolute", right: 60, top: 120, fontFamily: '"Consolas",monospace', fontSize: 17, letterSpacing: 4, color: `${pal.ink}66` }}>{label}</div>
            <div style={{ position: "absolute", left: 60, bottom: 54, right: 60, height: 2, background: `${pal.ink}22` }}>
                <div style={{ width: `${Math.min(1, Math.max(0, t / (beats * beat.BEAT))) * 100}%`, height: "100%", background: `${pal.accent}CC` }} />
            </div>
        </div>
    );
};
