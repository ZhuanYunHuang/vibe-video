import React from "react";
import { FONT, LyricStage, type Pal } from "../../styles/lyricmv";
import type { SceneDef, SceneProps } from "../../shared";
import { DROP_SEC, LABEL, LINES } from "./kit/lyrics";
import { THRONE } from "./kit/throne";
import { ART_EVENTS } from "./art";

// 每场两句，场景切点对齐句首；第 9 场包含 28.96s 的「Say what」进鼓点。
const PLAN: { start: number; end: number }[] = [
    { start: 0, end: 7.67 }, // 1-2
    { start: 7.67, end: 19.5 }, // 3-4
    { start: 19.5, end: 29.423 }, // 5-6
    { start: 29.423, end: 35.447 }, // 7-8
    { start: 35.447, end: 42.163 }, // 9-10
    { start: 42.163, end: 46.323 }, // 11-12
    { start: 46.323, end: 52.173 }, // 13-14
    { start: 52.173, end: 58.673 }, // 15-16
    { start: 58.673, end: 68.51 }, // 17-18（进鼓）
    { start: 68.51, end: 79.76 }, // 19-20
    { start: 79.76, end: 87.61 }, // 21-22
    { start: 87.61, end: 100 }, // 23-24
];

// 进鼓问号：砸进来 → 停留 1.5s → 淡出，压在画面右侧不挡字
const question = (t: number, dropD: number, pal: Pal) => {
    if (dropD < 0 || dropD > 54) return null;
    const p = Math.min(1, dropD / 9);
    const over = Math.max(0, dropD - 9);
    const wob = Math.sin(over * 1.7) * Math.exp(-over / 8);
    const scale = (1.9 - 0.9 * p) * (1 + 0.13 * wob);
    const fade = dropD > 44 ? Math.max(0, 1 - (dropD - 44) / 10) : 1;
    return (
        <div
            style={{
                position: "absolute",
                right: 40,
                top: 236,
                width: 430,
                textAlign: "center",
                fontFamily: FONT,
                fontSize: 470,
                lineHeight: 0.9,
                color: pal.ink,
                opacity: Math.min(1, (dropD + 2) / 4) * fade,
                transform: `translateY(${wob * -14}px) rotate(${-7 + 4.5 * wob}deg) scale(${scale})`,
                transformOrigin: "center",
            }}
        >
            ?
        </div>
    );
};

const makeScene = (index: number, beats: number, isLast: boolean): React.FC<SceneProps> => {
    const Comp: React.FC<SceneProps> = ({ start }) => (
        <LyricStage
            start={start}
            index={index}
            beats={beats}
            isLast={isLast}
            lines={LINES}
            dropSec={DROP_SEC}
            label={LABEL}
            palette={THRONE}
            ghostText=""
            frame
            overlay={question}
            events={ART_EVENTS}
            blowAt={index === 0 ? 3.24 : undefined}
            shakeAts={[
                { at: DROP_SEC, amp: 1 },
                { at: 32.78, amp: 0.55 },
                { at: 36.46, amp: 0.55 },
                { at: 40.12, amp: 0.55 },
                { at: 43.88, amp: 0.55 },
            ]}
        />
    );
    Comp.displayName = `Wangwei${String(index + 1).padStart(2, "0")}`;
    return Comp;
};

export const WANGWEI_SCENES: SceneDef[] = PLAN.map((p, i) => ({
    start: p.start,
    end: p.end,
    Comp: makeScene(i, p.end - p.start, i === PLAN.length - 1),
    trans: "none",
    bg: "#070604",
}));
