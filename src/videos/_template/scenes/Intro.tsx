import React from "react";
import { interpolate } from "remotion";
import { CL, Caption, Center, SceneProps, useAt, useT } from "../../../shared";

// 最小场景示例：演示 useT / useAt / Caption 的用法
export const Intro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  // at(start, k) 返回场景内第 k 拍对应的帧（k 可为小数，如 1.5 表示半拍）
  const firstBeat = at(start, 0);
  const lineAt = at(start, 4);
  const p = interpolate(t, [firstBeat, firstBeat + 20], [0, 1], CL);

  return (
    <Center>
      <div style={{ fontSize: 120, fontWeight: 900, letterSpacing: 8, transform: `scale(${0.8 + p * 0.2})`, opacity: p }}>
        你的标题
      </div>
      <Caption t={t} from={lineAt} text="副标题或说明文字" />
    </Center>
  );
};
