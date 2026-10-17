import React from "react";
import { explodeOffset } from "./explode";

// 铰链总成：转轴 + 双轨齿条 + 三组凸轮 + 磁体阵列 + 盖板。
// 演示件按厚度轴（Z）分层爆炸，齿条随开合角联动。
export const HingeAssembly: React.FC<{ explode: number; open: number }> = ({ explode, open }) => {
    const y = (v: number) => v;
    const parts: React.ReactNode[] = [];

    // 转轴
    parts.push(
        <mesh key="shaft" position={[0, y(0), 0]}>
            <cylinderGeometry args={[0.055, 0.055, 1.52, 28]} />
            <meshStandardMaterial color="#B9C2D2" metalness={0.5} roughness={0.18} />
        </mesh>,
    );

    // 三条齿条（左中右），齿随开合转
    [-0.3, 0, 0.3].forEach((yy, k) => {
        const base = 0.2 + explodeOffset(explode, k, 3, 0.26);
        [-1, 1].forEach((side) => {
            parts.push(
                <group key={`rack-${k}-${side}`} position={[side * base, yy, 0.02]} rotation={[0, side * open * Math.PI * 0.9, 0]}>
                    <mesh>
                        <boxGeometry args={[0.16, 0.13, 0.1]} />
                        <meshStandardMaterial color="#6E7A8E" metalness={0.45} roughness={0.3} />
                    </mesh>
                    {[0, 1, 2, 3].map((i) => (
                        <mesh key={i} position={[side * 0.085, -0.045 + i * 0.03, 0.055]}>
                            <boxGeometry args={[0.04, 0.018, 0.03]} />
                            <meshStandardMaterial color="#A7B0C0" metalness={0.45} roughness={0.25} />
                        </mesh>
                    ))}
                </group>,
            );
        });
    });

    // 三组凸轮（可变扭矩）
    [-0.44, 0, 0.44].forEach((yy, k) => {
        const z = 0.12 + explodeOffset(explode, k + 3, 9, 0.5);
        parts.push(
            <mesh key={`cam-${k}`} position={[0, yy, z]} rotation={[Math.PI / 2, 0, open * 2.2 + k]}>
                <cylinderGeometry args={[0.075 + k * 0.012, 0.075 + k * 0.012, 0.07, 6]} />
                <meshStandardMaterial color="#C08A46" metalness={0.4} roughness={0.32} />
            </mesh>,
        );
    });

    // 磁体阵列：两排各 4 颗
    [-0.19, 0.19].forEach((xx, row) => {
        [0, 1, 2, 3].forEach((i) => {
            const z = 0.18 + explodeOffset(explode, 6 + row * 4 + i, 14, 0.62);
            parts.push(
                <mesh key={`mag-${row}-${i}`} position={[xx, -0.36 + i * 0.24, z]}>
                    <boxGeometry args={[0.08, 0.08, 0.035]} />
                    <meshStandardMaterial color="#3D4A63" metalness={0.5} roughness={0.2} emissive="#12203A" emissiveIntensity={0.5} />
                </mesh>,
            );
        });
    });

    // 盖板与加强支架
    [-1, 1].forEach((side, k) => {
        const z = 0.24 + explodeOffset(explode, 16 + k, 20, 0.78);
        parts.push(
            <mesh key={`cover-${k}`} position={[side * 0.34, 0, z]} rotation={[0, side * 0.12, 0]}>
                <boxGeometry args={[0.2, 1.34, 0.02]} />
                <meshStandardMaterial color="#8D97A9" metalness={0.92} roughness={0.26} transparent opacity={0.92} />
            </mesh>,
        );
        const z2 = 0.3 + explodeOffset(explode, 18 + k, 22, 0.92);
        parts.push(
            <mesh key={`rib-${k}`} position={[side * 0.42, 0, z2]} rotation={[0, side * 0.12, 0]}>
                <boxGeometry args={[0.04, 1.1, 0.02]} />
                <meshStandardMaterial color="#4A5364" metalness={0.4} roughness={0.4} />
            </mesh>,
        );
    });

    return <group>{parts}</group>;
};
