import React from "react";
import { useCurrentFrame } from "remotion";
import type { SceneDef, SceneProps } from "../../shared";
import { pop, prog, useAt, useBeat, useT } from "../../shared";
import {
    BarRuler,
    BigTitle,
    Chip,
    FONT,
    MelodyBars,
    MONO,
    PLUCK_MOTIF,
    SECTIONS,
    SceneLabel,
    Stat,
    StepGrid,
    T,
    Tag,
    TOTAL_BEATS,
    Waveform,
} from "./kit";
import type { GridRow } from "./kit";

const useNow = (start: number) => {
    const t = useT();
    const f = useCurrentFrame();
    const beat = useBeat();
    return { t, f, pulse: beat.beatPulse(f), beatInScene: Math.max(0, t) / beat.BEAT };
};

// 占位歌词行：每 4 小节出现一行
const LyricSlots: React.FC<{ start: number; t: number; bar: number }> = ({ start, t, bar }) => {
    const at = useAt();
    const chunk = Math.floor(bar / 4) % 4;
    return (
        <>
            {Array.from({ length: 4 }, (_, i) => {
                const p = pop(t, at(start, i * 16), 14);
                return (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            left: 96,
                            top: 594 + i * 62,
                            display: "flex",
                            alignItems: "center",
                            gap: 22,
                            opacity: p * (i === chunk ? 1 : 0.5),
                            transform: `translateX(${(1 - p) * 26}px)`,
                        }}
                    >
                        <span style={{ fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: T.accent }}>{String(i + 1).padStart(2, "0")}</span>
                        <span style={{ width: 96, height: 2, background: T.accent, opacity: 0.75 }} />
                        <span style={{ fontFamily: FONT, fontSize: 34, letterSpacing: 4, color: T.ink }}>〔 待填歌词 〕</span>
                        <span style={{ width: 66, height: 22, background: T.warm, opacity: 0.85 }} />
                    </div>
                );
            })}
        </>
    );
};

// ---------------- 00 INTRO（0–7 小节） ----------------
const Intro: React.FC<SceneProps> = ({ start }) => {
    const { t, pulse } = useNow(start);
    const at = useAt();
    const rise = prog(t, 2, 24);

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <SceneLabel t={t} step="L.00" title="INTRO" />
            <Tag text="DARK ELECTRONIC / 90 BPM" left={96} top={150} />
            <div style={{ position: "absolute", left: 94, top: 190, fontFamily: FONT, fontSize: 54, letterSpacing: 6, color: T.ink }}>暗黑电子</div>

            <BigTitle t={t} from={at(start, 0)} x={960} y={462} size={330}>
                TRAP
            </BigTitle>

            <div style={{ position: "absolute", left: 0, right: 0, top: 664, textAlign: "center", fontFamily: MONO, fontSize: 20, letterSpacing: 7, color: `${T.ink}AA`, opacity: rise }}>
                808 · FM PLUCK · SIDECHAIN PAD
            </div>

            <div style={{ position: "absolute", left: 0, right: 0, top: 736, display: "flex", justifyContent: "center", gap: 96, opacity: rise }}>
                <Stat label="TEMPO" value="90 BPM" align="center" />
                <Stat label="KEY" value="F MINOR" align="center" />
                <Stat label="LENGTH" value="64 BARS" align="center" />
            </div>

            <div style={{ position: "absolute", left: 300, top: 884, opacity: 0.85 }}>
                <Waveform t={t} pulse={pulse} width={1320} height={72} />
            </div>

            <div style={{ position: "absolute", left: 96, top: 986, fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: `${T.ink}55` }}>
                INTRO 8 小节 · 只有 808 与 PAD
            </div>
        </div>
    );
};

// ---------------- 01 BUILD（8–15 小节） ----------------
const Build: React.FC<SceneProps> = ({ start }) => {
    const { t, beatInScene } = useNow(start);
    const rows: GridRow[] = [
        { label: "KICK", steps: [0, 6, 10], color: T.ink, on: true },
        { label: "808", steps: [0, 6, 10], color: T.accent, on: true },
        { label: "CLAP", steps: [4, 12], color: T.warm, on: beatInScene >= 8 },
        { label: "HAT", steps: [0, 2, 4, 6, 8, 10, 12, 14], color: `${T.ink}99`, on: beatInScene >= 16 },
        { label: "RIM", steps: [15], color: `${T.accent}99`, on: beatInScene >= 24 },
    ];
    const layers = rows.filter((r) => r.on !== false).length;

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <SceneLabel t={t} step="L.01" title="LAYERS IN" />
            <Tag text="BUILD / 8 BARS" left={96} top={150} />
            <div style={{ position: "absolute", left: 96, top: 190, fontFamily: FONT, fontSize: 52, letterSpacing: 6, color: T.ink }}>鼓组逐层进场</div>
            <div style={{ position: "absolute", left: 96, top: 262, fontFamily: MONO, fontSize: 18, letterSpacing: 4, color: `${T.ink}77` }}>
                每 4 拍进一层 · 21.3–42.7s
            </div>

            <StepGrid beat={beatInScene} rows={rows} left={96} top={350} cell={88} labelW={150} />

            <div style={{ position: "absolute", left: 96, top: 852, display: "flex", gap: 18 }}>
                <Chip>KICK / 48Hz</Chip>
                <Chip bg={T.warm}>808 / F1</Chip>
                <Chip bg="rgba(255,255,255,0.08)" color={T.ink}>{`LAYER ${layers}/5`}</Chip>
            </div>
            <div style={{ position: "absolute", left: 96, top: 918, fontFamily: MONO, fontSize: 16, letterSpacing: 3, color: `${T.ink}55` }}>
                BUILD 结束后进入 16 小节 RAP 段
            </div>
        </div>
    );
};

// ---------------- 02 VERSE 1（16–31 小节） ----------------
const Verse1: React.FC<SceneProps> = ({ start }) => {
    const { t, pulse, beatInScene } = useNow(start);
    const at = useAt();
    const bar = Math.floor(beatInScene / 4);
    const blink = 0.55 + 0.45 * Math.abs(Math.sin(t / 13));

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <SceneLabel t={t} step="L.02" title="VERSE 1" />
            <Tag text="16 BARS / VOCAL SLOT" left={96} top={150} />
            <BigTitle t={t} from={at(start, 0)} x={580} y={300} size={210}>
                VERSE 1
            </BigTitle>

            <div style={{ position: "absolute", left: 1060, top: 262, opacity: blink }}>
                <Chip>VOCAL SLOT · 待录</Chip>
            </div>
            <div style={{ position: "absolute", left: 1060, top: 318, fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: `${T.ink}77` }}>
                808 克制 · PAD 侧链让位
            </div>

            <BarRuler activeBar={bar} left={96} top={452} width={1728} />
            <LyricSlots start={start} t={t} bar={bar} />

            <div style={{ position: "absolute", left: 96, top: 862, fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: `${T.ink}77` }}>
                42.7–85.3s · 这段只有伴奏，人声直接叠上来
            </div>
            <div style={{ position: "absolute", left: 96, top: 916, opacity: 0.65 }}>
                <Waveform t={t} seed={11} pulse={pulse * 0.5} width={1728} height={56} />
            </div>
        </div>
    );
};

// ---------------- 03 HOOK（32–39 小节） ----------------
const Hook: React.FC<SceneProps> = ({ start }) => {
    const { t, beatInScene } = useNow(start);
    const at = useAt();
    const inBar = Math.floor((beatInScene % 4) * 4);
    const items = [
        { label: "PLUCK LEAD", at: 0 },
        { label: "808 SLIDE", at: 4 },
        { label: "FULL DRUMS", at: 8 },
    ];

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <SceneLabel t={t} step="L.03" title="HOOK" />
            <Tag text="PLUCK LEAD / 8 BARS" left={96} top={150} />

            <BigTitle t={t} from={at(start, 0)} x={960} y={330} size={300}>
                HOOK
            </BigTitle>

            <div style={{ position: "absolute", left: 0, right: 0, top: 596, display: "flex", justifyContent: "center", gap: 20 }}>
                {items.map((it) => {
                    const p = pop(t, at(start, it.at), 13);
                    return (
                        <span
                            key={it.label}
                            style={{
                                padding: "9px 18px",
                                border: `1px solid ${T.accent}`,
                                color: T.accent,
                                fontFamily: MONO,
                                fontSize: 17,
                                letterSpacing: 3,
                                opacity: p,
                                transform: `translateY(${(1 - p) * 16}px)`,
                            }}
                        >
                            {it.label}
                        </span>
                    );
                })}
            </div>

            <MelodyBars steps={PLUCK_MOTIF} active={inBar} left={330} top={682} width={1260} height={168} />

            <div style={{ position: "absolute", left: 0, right: 0, top: 904, textAlign: "center", fontFamily: MONO, fontSize: 16, letterSpacing: 4, color: `${T.ink}77` }}>
                85.3–106.7s · 拨弦旋律 + 全编制鼓组
            </div>
        </div>
    );
};

// ---------------- 04 VERSE 2（40–55 小节） ----------------
const Verse2: React.FC<SceneProps> = ({ start }) => {
    const { t, pulse, beatInScene } = useNow(start);
    const at = useAt();
    const bar = Math.floor(beatInScene / 4);
    const blink = 0.55 + 0.45 * Math.abs(Math.sin(t / 13));

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <SceneLabel t={t} step="L.04" title="VERSE 2" />
            <Tag text="16 BARS / VOCAL SLOT" left={96} top={150} />
            <BigTitle t={t} from={at(start, 0)} x={580} y={300} size={210}>
                VERSE 2
            </BigTitle>

            <div style={{ position: "absolute", left: 1060, top: 262, opacity: blink }}>
                <Chip>VOCAL SLOT · 待录</Chip>
            </div>
            <div style={{ position: "absolute", left: 1060, top: 318, fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: `${T.ink}77` }}>
                808 滑音 · 后半段留白
            </div>

            <BarRuler activeBar={bar} left={96} top={452} width={1728} />
            <LyricSlots start={start} t={t} bar={bar} />

            <div style={{ position: "absolute", left: 96, top: 862, fontFamily: MONO, fontSize: 17, letterSpacing: 3, color: `${T.ink}77` }}>
                106.7–149.3s · 第二段人声空间
            </div>
            <div style={{ position: "absolute", left: 96, top: 916, opacity: 0.65 }}>
                <Waveform t={t} seed={17} pulse={pulse * 0.5} width={1728} height={56} />
            </div>
        </div>
    );
};

// ---------------- 05 OUTRO（56–63 小节） ----------------
const Outro: React.FC<SceneProps> = ({ start }) => {
    const { t, pulse } = useNow(start);
    const at = useAt();
    const rise = prog(t, at(start, 0), 26);

    return (
        <div style={{ position: "absolute", inset: 0 }}>
            <SceneLabel t={t} step="L.05" title="OUTRO" />
            <Tag text="TRACK READY / MASTER" left={96} top={150} />
            <BigTitle t={t} from={at(start, 0)} x={960} y={322} size={150}>
                TRACK READY
            </BigTitle>

            <div style={{ position: "absolute", left: 0, right: 0, top: 486, display: "flex", justifyContent: "center", gap: 82, opacity: rise }}>
                <Stat label="TEMPO" value="90 BPM" align="center" />
                <Stat label="KEY" value="F MINOR" align="center" />
                <Stat label="BARS" value="64" align="center" />
                <Stat label="LENGTH" value="2:52" align="center" />
                <Stat label="KIT" value="808 / PLUCK / PAD" align="center" />
            </div>

            <div style={{ position: "absolute", left: 96, top: 640, width: 1728, height: 46, opacity: rise }}>
                {SECTIONS.map((s) => {
                    const w = ((s.to - s.from) / TOTAL_BEATS) * 1728;
                    const x = (s.from / TOTAL_BEATS) * 1728;
                    const hot = s.label.startsWith("VERSE");
                    return (
                        <div
                            key={s.label}
                            style={{
                                position: "absolute",
                                left: x + 2,
                                width: Math.max(2, w - 4),
                                top: 0,
                                height: hot ? 54 : 40,
                                background: hot ? T.warm : "rgba(255,255,255,0.07)",
                                borderTop: `2px solid ${hot ? T.ink : `${T.accent}88`}`,
                            }}
                        >
                            <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: 2, color: hot ? T.bg : `${T.ink}99`, padding: "4px 6px" }}>{s.label}</div>
                        </div>
                    );
                })}
            </div>

            <div style={{ position: "absolute", left: 96, top: 772, fontFamily: FONT, fontSize: 32, letterSpacing: 3, color: T.ink, opacity: rise }}>
                RAP 段：42.7–85.3s / 106.7–149.3s
            </div>

            <div style={{ position: "absolute", left: 300, top: 846, opacity: 0.7 }}>
                <Waveform t={t} seed={19} pulse={pulse * 0.4} width={1320} height={62} />
            </div>

            <div style={{ position: "absolute", left: 96, top: 952, fontFamily: MONO, fontSize: 16, letterSpacing: 4, color: `${T.ink}55`, opacity: rise }}>
                public/trap-beat/bgm.mp3 · 90 BPM · F MINOR · 64 BARS
            </div>
        </div>
    );
};

export const TRAP_SCENES: SceneDef[] = [
    { start: 0, end: 32, Comp: Intro, trans: "none", bg: T.bg },
    { start: 32, end: 64, Comp: Build, trans: "none", bg: T.panel },
    { start: 64, end: 128, Comp: Verse1, trans: "none", bg: T.bg },
    { start: 128, end: 160, Comp: Hook, trans: "none", bg: T.deep },
    { start: 160, end: 224, Comp: Verse2, trans: "none", bg: T.panel },
    { start: 224, end: 256, Comp: Outro, trans: "none", bg: T.bg },
];
