import React from "react";
import { ChromeText, FPS, StrokeFillText } from "../../shared";
import { MONO, Pal, fitSize, textWidth } from "./theme";
import { ChaosText, CrawlText, FocusText, RhymeText, ShakeText, SlamText, SlashText, SplitText, StampText } from "./textfx";
import type { Line, Seg } from "./types";

// 歌词排版：整行按 segs 分时点亮，已唱压暗、未到隐藏、韵脚常驻色块。
export const rowFont = (text: string) => (/[\u4e00-\u9fff]/.test(text) ? '"YouShe","Microsoft YaHei",sans-serif' : '"YouShe","Bahnschrift","Arial Black",sans-serif');

// 单句特效分发；韵脚由 RhymeText 单独接管
export const renderFx = (line: Line, text: string, t: number, from: number, size: number, color: string, accent: string) => {
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

export const LineBoard: React.FC<{ t: number; line: Line; s: number; pal: Pal }> = ({ t, line, s, pal }) => {
    let activeRow = 0;
    line.parts.forEach((p, i) => {
        if (t >= s + Math.round((p.s - line.s) * FPS)) activeRow = i;
    });

    const widest = line.parts.reduce((a, b) => (textWidth(b.text) > textWidth(a.text) ? b : a));
    const size = fitSize(widest.text, 1440, line.fx === "focus" ? 96 : 172);
    const gap = Math.round(size * 0.18);
    const rowStyle: React.CSSProperties = { display: "flex", justifyContent: line.align === "right" ? "flex-end" : line.align === "center" ? "center" : "flex-start", flexWrap: "nowrap" };

    // 韵脚块：可加「四押」框，可被风吹入
    const chip = (sg: Seg, sf: number, opacity: number, key: React.Key, animate: boolean) => {
        const w = sg.wind ? Math.min(1, Math.max(0, (t - sf) / 8)) : 1;
        const windStyle: React.CSSProperties | undefined =
            sg.wind && w < 1 ? { transform: `translateX(${(1 - w) * 760}px) skewX(${(1 - w) * -22}deg)`, filter: `blur(${(1 - w) * 9}px)` } : undefined;
        const over = Math.max(0, t - sf - 6);
        const wob = sg.impact ? Math.sin(over * 1.7) * Math.exp(-over / 8) : 0;
        const impactStyle: React.CSSProperties | undefined = wob
            ? { transform: `translateY(${-wob * 12}px) scale(${1 + 0.12 * wob})` }
            : undefined;
        const node = (
            <RhymeText t={t} from={animate ? sf : -999} text={sg.text} size={size} color={pal.ink} accent={pal.accent} block={pal.block} blockInk={pal.blockInk} />
        );
        if (!sg.box) {
            return (
                <span key={key} style={{ opacity: opacity * w, ...windStyle, ...impactStyle }}>
                    {node}
                </span>
            );
        }
        return (
            <span key={key} style={{ position: "relative", display: "inline-block", padding: 7, border: `3px solid ${pal.ink}`, opacity: opacity * w, ...windStyle, ...impactStyle }}>
                {node}
                {sg.tag ? (
                    <span
                        style={{
                            position: "absolute",
                            right: -12,
                            top: -30,
                            fontFamily: MONO,
                            fontSize: 16,
                            letterSpacing: 3,
                            color: pal.ink,
                            background: pal.bg,
                            padding: "1px 8px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {sg.tag}
                    </span>
                ) : null}
            </span>
        );
    };

    // 已出现的行始终居中：新行落地时整块向上回中，8 帧缓动
    const total = line.parts.length;
    const rowH = size + gap;
    const rowStart = s + Math.round((line.parts[activeRow].s - line.s) * FPS);
    const pp = activeRow === 0 ? 1 : Math.min(1, Math.max(0, (t - rowStart) / 8));
    const off = ((total - activeRow) * rowH) / 2 + (((total - activeRow - 1) * rowH - (total - activeRow) * rowH) / 2) * (1 - Math.pow(1 - pp, 3));

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
                                    chip(sg, -999, 0.9, k, false)
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
                                            opacity: done ? 0.6 : 1,
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
                                    chip(sg, -999, 0.85, k, false)
                                ) : (
                                    <span key={k} style={{ fontFamily: rowFont(sg.text), fontWeight: 400, fontSize: size, lineHeight: 1, whiteSpace: "pre", color: pal.ink, opacity: 0.68 }}>
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
                            if (sg.rhyme) return chip(sg, sf, 1, k, true);
                            const node = renderFx(line, sg.text, t, sf, size, pal.ink, pal.accent);
                            if (sg.impact) {
                                const over = Math.max(0, t - sf - 6);
                                const w = Math.sin(over * 1.7) * Math.exp(-over / 8);
                                return (
                                    <span key={k} style={{ display: "inline-block", transform: `translate(${w * 14}px, ${-w * 10}px) rotate(${w * 3}deg) scale(${1 + 0.12 * w})` }}>
                                        {node}
                                    </span>
                                );
                            }
                            return <React.Fragment key={k}>{node}</React.Fragment>;
                        })}
                    </div>
                );
            })}
        </div>
    );
};
