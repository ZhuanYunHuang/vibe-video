import React from "react";
import { ChromeText, FPS, SceneProps, Shockwave, SpeedLines, StrokeFillText, useBeat, useT } from "../../../shared";
import { PAL, Pal, fitSize, textWidth } from "../kit/theme";
import { CutFlash, GhostLine, Grain, LineSlab, Scanlines, Vignette } from "../kit/frame";
import { ChaosText, CrawlText, FocusText, RhymeText, ShakeText, SlamText, SlashText, SplitText, StampText } from "../kit/fx";
import { DROP_SEC, LINES, Line } from "../kit/lyrics";
import { Fonts } from "../kit/Fonts";

// 与 fx.tsx 同一套字体选择：纯拉丁句走较宽的拉丁字面，中文走标题黑
const rowFont = (text: string) => (/[\u4e00-\u9fff]/.test(text) ? '"YouShe","Microsoft YaHei",sans-serif' : '"YouShe","Bahnschrift","Arial Black",sans-serif');

// 单句特效分发；韵脚由 RhymeText 单独接管
const renderFx = (line: Line, text: string, t: number, from: number, size: number, color: string, accent: string) => {
    const p = { t, from, text, size, color, accent };
    switch (line.fx) {
        case "slam":
            return <SlamText {...p} />;
        case "split":
            return <SplitText {...p} />;
        case "crawl":
            return <CrawlText {...p} />;
        case "chaos":
            return <ChaosText {...p} />;
        case "stamp":
            return <StampText {...p} />;
        case "shake":
            return <ShakeText {...p} />;
        case "slash":
            return <SlashText {...p} />;
        case "focus":
            return <FocusText {...p} />;
        case "stroke":
            return (
                <StrokeFillText
                    t={t}
                    from={from}
                    text={text}
                    strokeColor={accent}
                    fillColor={color}
                    strokeWidth={2}
                    fillDelay={3}
                    fillDur={8}
                    style={{ fontFamily: rowFont(text), fontWeight: 400, fontSize: size, lineHeight: 1, whiteSpace: "pre" }}
                />
            );
        case "chrome":
            return (
                <ChromeText
                    t={t}
                    from={from}
                    text={text}
                    animate
                    gradient="linear-gradient(180deg,#FFFFFF 0%,#F8F2E4 32%,#8A8580 50%,#F8F2E4 68%,#FFFFFF 100%)"
                    glow={`${accent}CC`}
                    style={{ fontFamily: rowFont(text), fontWeight: 400, fontSize: size, lineHeight: 1, whiteSpace: "pre" }}
                />
            );
    }
};

// 一句的排版：整行按 segs 分时段点亮，唱完的压暗、未到的先占位不显示
const LineBoard: React.FC<{ t: number; line: Line; s: number; pal: Pal }> = ({ t, line, s, pal }) => {
    let activeRow = 0;
    line.parts.forEach((p, i) => {
        if (t >= s + Math.round((p.s - line.s) * FPS)) activeRow = i;
    });

    const widest = line.parts.reduce((a, b) => (textWidth(b.text) > textWidth(a.text) ? b : a));
    const size = fitSize(widest.text, 1440, line.fx === "focus" ? 96 : 172);
    const gap = Math.round(size * 0.18);
    const rowStyle: React.CSSProperties = { display: "flex", justifyContent: line.align === "right" ? "flex-end" : line.align === "center" ? "center" : "flex-start", flexWrap: "nowrap" };

    // 已出现的行始终居中：新行落地时整块向上回中，8 帧缓动
    const total = line.parts.length;
    const rowH = size + gap;
    const rowStart = s + Math.round((line.parts[activeRow].s - line.s) * FPS);
    const pp = activeRow === 0 ? 1 : Math.min(1, Math.max(0, (t - rowStart) / 8));
    const off = ((total - activeRow) * rowH) / 2 + ((total - activeRow - 1) * rowH - (total - activeRow) * rowH) / 2 * (1 - Math.pow(1 - pp, 3));

    if (line.layout === "quad") {
        return (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 16, width: 1440, height: 660 }}>
                    {line.parts.map((p, i) => {
                        const isActive = i === activeRow;
                        const done = i < activeRow;
                        return (
                            <div
                                key={i}
                                style={{
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: `2px solid ${isActive ? pal.accent : `${pal.ink}33`}`,
                                    background: isActive ? pal.accent : "transparent",
                                    transform: isActive ? "scale(1.02)" : undefined,
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: rowFont(p.text),
                                        fontWeight: 400,
                                        fontSize: fitSize(p.text, 600, 124),
                                        lineHeight: 1,
                                        letterSpacing: "0.02em",
                                        color: isActive ? pal.bg : done ? pal.ink : "transparent",
                                        WebkitTextStroke: isActive || done ? undefined : `1px ${pal.ink}22`,
                                    }}
                                >
                                    {p.text}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 240px", gap, transform: `translateY(${Math.round(off)}px)` }}>
            {line.parts.map((p, i) => {
                const rowFrom = s + Math.round((p.s - line.s) * FPS);
                const isActive = i === activeRow;
                const done = i < activeRow;

                if (!isActive) {
                    return (
                        <div key={i} style={rowStyle}>
                            {p.segs.map((sg, k) =>
                                done && sg.rhyme ? (
                                    <span key={k} style={{ opacity: 0.9 }}>
                                        <RhymeText t={t} from={-999} text={sg.text} size={size} color={pal.ink} accent={pal.accent} block={pal.block} blockInk={pal.blockInk} />
                                    </span>
                                ) : (
                                    <span
                                        key={k}
                                        style={{
                                            fontFamily: rowFont(sg.text),
                                            fontWeight: 400,
                                            fontSize: size,
                                            lineHeight: 1,
                                            whiteSpace: "pre",
                                            color: done ? pal.ink : "transparent",
                                            opacity: done ? 0.4 : 1,
                                            visibility: done ? undefined : "hidden",
                                        }}
                                    >
                                        {sg.text}
                                    </span>
                                ),
                            )}
                        </div>
                    );
                }

                let activeSeg = 0;
                p.segs.forEach((sg, k) => {
                    if (t >= rowFrom + Math.round((sg.s - p.s) * FPS)) activeSeg = k;
                });

                return (
                    <div key={i} style={rowStyle}>
                        {p.segs.map((sg, k) => {
                            const sf = rowFrom + Math.round((sg.s - p.s) * FPS);
                            if (k < activeSeg) {
                                return sg.rhyme ? (
                                    <span key={k} style={{ opacity: 0.85 }}>
                                        <RhymeText t={t} from={-999} text={sg.text} size={size} color={pal.ink} accent={pal.accent} block={pal.block} blockInk={pal.blockInk} />
                                    </span>
                                ) : (
                                    <span key={k} style={{ fontFamily: rowFont(sg.text), fontWeight: 400, fontSize: size, lineHeight: 1, whiteSpace: "pre", color: pal.ink, opacity: 0.55 }}>
                                        {sg.text}
                                    </span>
                                );
                            }
                            if (k > activeSeg) {
                                return (
                                    <span key={k} style={{ fontFamily: rowFont(sg.text), fontWeight: 400, fontSize: size, lineHeight: 1, whiteSpace: "pre", visibility: "hidden" }}>
                                        {sg.text}
                                    </span>
                                );
                            }
                            return sg.rhyme ? (
                                <RhymeText key={k} t={t} from={sf} text={sg.text} size={size} color={pal.ink} accent={pal.accent} block={pal.block} blockInk={pal.blockInk} />
                            ) : (
                                <React.Fragment key={k}>{renderFx(line, sg.text, t, sf, size, pal.ink, pal.accent)}</React.Fragment>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

// 奇数场残影放右侧，避免每场构图一样
const ghostX = (index: number) => (index % 2 === 0 ? -140 : 820);

// 一场 = 2 句：场内按句硬切；21.18s 进鼓时整屏翻红白并保持
export const VerseScene: React.FC<SceneProps & { index: number; beats: number; isLast?: boolean }> = ({ start, index, beats, isLast }) => {
    const beat = useBeat();
    const t = useT() + beat.TRANS;
    const s0 = beat.bf(start);
    const toT = (sec: number) => Math.round(sec * FPS) - s0;
    const sceneStartSec = (s0 - beat.OFFSET) / FPS;
    const sceneEndSec = sceneStartSec + (beats * beat.BEAT) / FPS;

    const lines = LINES.filter((l) => l.e > sceneStartSec + 0.02 && l.s < sceneEndSec - 0.02);
    if (!lines.length) return null;

    const cur = lines.find((l) => t >= toT(l.s) && t < toT(l.e)) ?? (t < toT(lines[0].s) ? lines[0] : lines[lines.length - 1]);
    const isPost = t >= toT(DROP_SEC);
    const pal = PAL[isPost ? cur.theme : "dark"];
    const endT = toT(LINES[LINES.length - 1].e);
    const outro = isLast ? Math.min(1, Math.max(0, (t - endT) / 6)) : 0;

    const prev = LINES[Math.max(0, cur.i - 2)];
    const ghost = cur.i === 1 ? "" : prev.parts.reduce((a, b) => (textWidth(b.text) > textWidth(a.text) ? b : a)).text;

    const dropT = toT(DROP_SEC);
    const showDrop = DROP_SEC >= sceneStartSec - 0.02 && DROP_SEC < sceneEndSec - 0.02;
    const dropD = t - dropT;

    return (
        <>
            <Fonts />
            {lines.map((l) => (
                <LineSlab key={`slab-${l.i}`} t={t} at={toT(l.s)} color={PAL[l.s >= DROP_SEC ? l.theme : "dark"].bg} />
            ))}
            {showDrop ? <LineSlab t={t} at={dropT} color={PAL.red.bg} /> : null}

            <GhostLine t={t} text={ghost} size={370} x={ghostX(index)} y={700} rot={index % 2 === 0 ? -6 : -4} opacity={isPost ? 0.09 : 0.055} color={pal.ink} />

            <Scanlines t={t} opacity={pal.scan} />
            <Grain t={t} opacity={pal.grain} />
            <Vignette strength={pal.vig} />

            <LineBoard t={t} line={cur} s={toT(cur.s)} pal={pal} />

            {lines.map((l) => (
                <CutFlash key={`flash-${l.i}`} t={t} at={toT(l.s)} color={pal.flash} frames={2} />
            ))}
            {showDrop && dropD >= 0 && dropD < 20 ? <Shockwave t={t} at={dropT} x={960} y={520} color={`${PAL.red.ink}AA`} rings={3} maxRadius={900} dur={20} /> : null}
            {showDrop && dropD >= 0 && dropD < 10 ? <SpeedLines t={t} at={dropT} color={`${PAL.red.ink}55`} dur={10} n={16} cx={960} cy={520} inner={380} outer={1300} /> : null}
            {showDrop && dropD >= 0 && dropD < 3 ? (
                <div style={{ position: "absolute", inset: 0, background: PAL.red.ink, opacity: dropD === 0 ? 0.95 : dropD === 1 ? 0.5 : 0.18, pointerEvents: "none" }} />
            ) : null}
            {isLast ? <div style={{ position: "absolute", inset: 0, background: PAL.red.bg, opacity: outro, pointerEvents: "none" }} /> : null}

            <div style={{ position: "absolute", left: 60, top: 116, fontFamily: '"Consolas",monospace', fontSize: 19, letterSpacing: 5, color: `${pal.ink}88` }}>
                {`L.${String(cur.i).padStart(2, "0")}`}
            </div>
            <div style={{ position: "absolute", right: 60, top: 120, fontFamily: '"Consolas",monospace', fontSize: 17, letterSpacing: 4, color: `${pal.ink}66` }}>毕业 · PG ONE</div>
            <div style={{ position: "absolute", left: 60, bottom: 54, right: 60, height: 2, background: `${pal.ink}22` }}>
                <div style={{ width: `${Math.min(1, Math.max(0, t / (beats * beat.BEAT))) * 100}%`, height: "100%", background: `${pal.accent}CC` }} />
            </div>
        </>
    );
};
