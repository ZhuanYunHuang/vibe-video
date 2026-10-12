import React from "react";
import { interpolate } from "remotion";
import { CL, Center, SceneProps, useAt, useT } from "../../../shared";

// 最小场景示例：结尾
export const Outro: React.FC<SceneProps> = ({ start }) => {
  const t = useT();
  const at = useAt();
  const lineAt = at(start, 2);

  return (
    <Center>
      <div style={{ fontSize: 76, fontWeight: 900, opacity: interpolate(t, [lineAt, lineAt + 12], [0, 1], CL) }}>结尾语</div>
    </Center>
  );
};
