import React from "react";
import * as THREE from "three";

// —— 程序化 Roadster 车模：侧面轮廓挤出体 + 玻璃座舱 + 轮组 + 灯条（车头朝 +X，原点在两轮之间地面）——

const BODY_W = 1.6;

const bodyGeom = (() => {
    const s = new THREE.Shape();
    s.moveTo(-2.28, 0.24);
    s.lineTo(-2.34, 0.58);
    s.lineTo(-2.12, 0.8);
    s.lineTo(-1.3, 0.9);
    s.lineTo(-0.66, 0.99);
    s.lineTo(0.3, 0.99);
    s.lineTo(1.05, 0.8);
    s.lineTo(1.98, 0.6);
    s.lineTo(2.34, 0.44);
    s.lineTo(2.38, 0.24);
    s.lineTo(2.05, 0.15);
    s.lineTo(-2.0, 0.15);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: BODY_W, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.045, bevelSegments: 2, steps: 1, curveSegments: 12 });
    g.translate(0, 0, -BODY_W / 2);
    return g;
})();

const glassGeom = (() => {
    const s = new THREE.Shape();
    s.moveTo(-1.02, 0.93);
    s.lineTo(-0.72, 1.13);
    s.lineTo(0.0, 1.17);
    s.lineTo(0.55, 1.06);
    s.lineTo(0.98, 0.89);
    s.lineTo(0.88, 0.83);
    s.lineTo(-0.9, 0.84);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.46, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2, steps: 1, curveSegments: 12 });
    g.translate(0, 0, -0.73);
    return g;
})();

export const RoadsterModel: React.FC<{ glow?: number; lights?: number }> = ({ glow = 0, lights = 1 }) => (
    <group>
        <mesh geometry={bodyGeom}>
            <meshStandardMaterial color="#C8102E" metalness={0.72} roughness={0.26} />
        </mesh>
        <mesh geometry={glassGeom}>
            <meshStandardMaterial color="#0B0D11" metalness={0.9} roughness={0.08} />
        </mesh>
        <mesh position={[2.37, 0.5, 0]}>
            <boxGeometry args={[0.05, 0.05, 1.32]} />
            <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={2.2 * lights} />
        </mesh>
        <mesh position={[-2.33, 0.66, 0]}>
            <boxGeometry args={[0.05, 0.05, 1.4]} />
            <meshStandardMaterial color="#FF2038" emissive="#FF2038" emissiveIntensity={1.8 * lights} />
        </mesh>
        <mesh position={[0, 0.145, 0]}>
            <boxGeometry args={[3.9, 0.03, 1.3]} />
            <meshStandardMaterial color="#FF9E2C" emissive="#FF9E2C" emissiveIntensity={2.6 * glow} />
        </mesh>
        {[[-1.42, -0.84], [-1.42, 0.84], [1.42, -0.84], [1.42, 0.84]].map(([wx, wz]) => (
            <group key={`${wx}-${wz}`} position={[wx, 0.4, wz]}>
                <mesh>
                    <torusGeometry args={[0.29, 0.11, 12, 26]} />
                    <meshStandardMaterial color="#17191E" metalness={0.1} roughness={0.9} />
                </mesh>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.19, 0.19, 0.23, 16]} />
                    <meshStandardMaterial color="#8A93A6" metalness={0.9} roughness={0.3} />
                </mesh>
            </group>
        ))}
        <pointLight position={[1.0, 0.1, 0]} intensity={glow * 26} color="#FF9E2C" distance={5} />
        <pointLight position={[-1.0, 0.1, 0]} intensity={glow * 26} color="#FF9E2C" distance={5} />
    </group>
);

// 涵道风扇（轴向朝 +Y：立在托板上）
export const Fan3D: React.FC<{ spin?: number; lit?: number }> = ({ spin = 0, lit = 1 }) => (
    <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
            <torusGeometry args={[0.34, 0.055, 10, 28]} />
            <meshStandardMaterial color="#5F5E5A" metalness={0.6} roughness={0.5} />
        </mesh>
        <group rotation={[0, 0, spin]}>
            {[0, 1, 2, 3, 4].map((i) => (
                <group key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]}>
                    <mesh position={[0.19, 0, 0]} rotation={[0, 0, 0.5]}>
                        <boxGeometry args={[0.22, 0.08, 0.025]} />
                        <meshStandardMaterial color="#AEB6C6" metalness={0.85} roughness={0.3} emissive="#FF9E2C" emissiveIntensity={0.15 * lit} />
                    </mesh>
                </group>
            ))}
        </group>
        <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.09, 12]} />
            <meshStandardMaterial color="#14161B" metalness={0.5} roughness={0.6} />
        </mesh>
    </group>
);
