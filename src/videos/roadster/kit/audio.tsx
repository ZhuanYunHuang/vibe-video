import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { useBeat } from "../../../shared";
import { Sub } from "../../../styles/explode";
import { VO_SUBS } from "./subsData";

// 配音总开关：TTS 全量产出并接入后打开（场景里的挂载点已就位）
export const VO_ENABLED = true;

const VoInner: React.FC<{ from: number; file: string; volume: number }> = ({ from, file, volume }) => {
    const { TRANS } = useBeat();
    return (
        <Sequence from={TRANS + from} name={file}>
            <Audio src={staticFile(`roadster/vo/${file}.mp3`)} volume={volume} />
        </Sequence>
    );
};

// 旁白：from 为场景内相对帧（用 useK 换算）；文件须在 public/roadster/vo/<file>.mp3
export const Vo: React.FC<{ from: number; file: string; volume?: number }> = ({ from, file, volume = 1 }) =>
    VO_ENABLED ? <VoInner from={from} file={file} volume={volume} /> : null;

const SfxInner: React.FC<{ from: number; file: string; volume: number }> = ({ from, file, volume }) => {
    const { TRANS } = useBeat();
    return (
        <Sequence from={TRANS + from}>
            <Audio src={staticFile(`roadster/sfx/${file}.wav`)} volume={volume} />
        </Sequence>
    );
};

// 音效：whoosh / vine-boom（来自 public/roadster/sfx/）
export const Sfx: React.FC<{ from: number; file: "whoosh" | "vine-boom"; volume?: number }> = ({ from, file, volume = 0.8 }) => (
    <SfxInner from={from} file={file} volume={volume} />
);

// 旁白字幕：按逐词时间轴分段，与配音逐句对齐；from 须与对应 <Vo> 的 from 一致
export const VoSub: React.FC<{ t: number; from: number; file: string; color?: string }> = ({ t, from, file, color }) => {
    const segs = VO_SUBS[file];
    if (!segs) return null;
    return (
        <>
            {segs.map((s, i) => (
                <Sub key={i} t={t} from={from + Math.round(s.a * 30)} to={from + Math.round(s.b * 30)} color={color}>
                    {s.text}
                </Sub>
            ))}
        </>
    );
};
