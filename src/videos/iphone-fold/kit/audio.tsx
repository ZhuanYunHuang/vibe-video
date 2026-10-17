import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { useBeat } from "../../../shared";
import { Sub } from "./bright";
import { VO } from "./voData";

// 配音总开关：音频在 public/iphone-fold/vo/，由 edge-tts 生成
export const VO_ENABLED = true;
export const SFX_ENABLED = false;

// 字幕：与配音共用同一份时长数据，起拍对齐、按实际音频长度退场
export const Subs: React.FC<{ t: number; K: (b: number) => number }> = ({ t, K }) => (
    <>
        {VO.map((s) => (
            <Sub key={s.file} t={t} from={K(s.beat)} to={K(s.beat) + Math.round(s.dur * 30)}>
                {s.text}
            </Sub>
        ))}
    </>
);

const VoInner: React.FC<{ from: number; file: string; volume: number }> = ({ from, file, volume }) => {
    const { TRANS } = useBeat();
    return (
        <Sequence from={TRANS + from} name={file}>
            <Audio src={staticFile(`iphone-fold/vo/${file}.mp3`)} volume={volume} />
        </Sequence>
    );
};

// 旁白：from 为场景内相对帧（用 K 换算）
export const Vo: React.FC<{ from: number; file: string; volume?: number }> = ({ from, file, volume = 1.25 }) =>
    VO_ENABLED ? <VoInner from={from} file={file} volume={volume} /> : null;

const SfxInner: React.FC<{ from: number; file: string; volume: number }> = ({ from, file, volume }) => {
    const { TRANS } = useBeat();
    return (
        <Sequence from={TRANS + from}>
            <Audio src={staticFile(`iphone-fold/sfx/${file}.wav`)} volume={volume} />
        </Sequence>
    );
};

export const Sfx: React.FC<{ from: number; file: "whoosh" | "vine-boom"; volume?: number }> = ({ from, file, volume = 0.7 }) =>
    SFX_ENABLED ? <SfxInner from={from} file={file} volume={volume} /> : null;
