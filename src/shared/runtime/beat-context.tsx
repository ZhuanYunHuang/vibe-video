import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";
import { Beat } from "../core/types";

// 节拍参数的下发通道：一个 Composition 对应一支视频、对应一份节拍
const BeatCtx = createContext<Beat | null>(null);

export const BeatProvider: React.FC<{ beat: Beat; children: React.ReactNode }> = ({ beat, children }) => (
  <BeatCtx.Provider value={beat}>{children}</BeatCtx.Provider>
);

export const useBeat = (): Beat => {
  const beat = useContext(BeatCtx);
  if (!beat) throw new Error("useBeat 必须在 BeatProvider 内使用");
  return beat;
};

// 场景内时间：0 帧正好落在场景起始拍上（之前 TRANS 帧是入场转场）
export const useT = () => useCurrentFrame() - useBeat().TRANS;

// 返回与旧 at(start, k) 完全同签名的函数，场景内调用点无需改动
export const useAt = () => {
  const beat = useBeat();
  return (start: number, k: number) => beat.bf(start + k) - beat.bf(start);
};
