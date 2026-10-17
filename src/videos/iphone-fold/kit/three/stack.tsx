import React from "react";

// 十层堆叠：展开时沿 Y 轴升起，可整体绕轴旋转；高亮层用外扩亮板标出。
const LAYERS = [
    "#C08A46", // 纳米纹理盖层
    "#5C86C4", // UTG
    "#3E4E6B", // OCA
    "#39465F", // 触控
    "#2E3A52", // OLED
    "#2A3448", // 基板
    "#3B4A66", // OCA
    "#4A5568", // 支撑板
    "#6E7A8E", // 铰链托平
    "#7C8698", // 中框
];

export const LayerStack3D: React.FC<{ explode: number; orbit?: number; active?: number }> = ({ explode, orbit = 0, active = -1 }) => {
    const gap = 0.082 * explode;
    return (
        <group rotation={[0.06, orbit, 0]}>
            {LAYERS.map((color, i) => {
                const y = ((LAYERS.length - 1) / 2 - i) * gap;
                const isActive = i === active;
                const w = 1.82 - i * 0.012;
                return (
                    <group key={i} position={[0, y, 0]}>
                        <mesh>
                            <boxGeometry args={[w, 0.022, 2.42]} />
                            <meshStandardMaterial color={color} metalness={0.62} roughness={i === 0 ? 0.26 : 0.42} emissive={isActive ? color : "#000000"} emissiveIntensity={isActive ? 0.5 : 0} />
                        </mesh>
                        {isActive ? (
                            <mesh position={[0, -0.002, 0]}>
                                <boxGeometry args={[w + 0.06, 0.008, 2.48]} />
                                <meshBasicMaterial color="#FFC670" transparent opacity={0.24} />
                            </mesh>
                        ) : null}
                    </group>
                );
            })}
        </group>
    );
};
