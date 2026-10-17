import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// —— 3D 舞台基座：ThreeCanvas 封装 + 帧驱动运镜 + 网格地面 ——

export const Scene3D: React.FC<{ children: React.ReactNode; fov?: number; pos?: [number, number, number] }> = ({ children, fov = 42, pos = [7, 4.6, 10] }) => (
    <div style={{ position: "absolute", inset: 0 }}>
        <ThreeCanvas width={1920} height={1080} camera={{ fov, position: pos, near: 0.1, far: 220 }} style={{ position: "absolute", inset: 0 }}>
            <color attach="background" args={["#14161B"]} />
            <fog attach="fog" args={["#14161B", 26, 72]} />
            <ambientLight intensity={0.55} />
            <directionalLight position={[9, 15, 7]} intensity={1.8} color="#FFF2DC" />
            <pointLight position={[-10, 8, -7]} intensity={160} color="#6FA8FF" />
            <pointLight position={[4, 6, 10]} intensity={110} color="#FF9E2C" />
            {children}
        </ThreeCanvas>
    </div>
);

// 帧驱动运镜：关键帧之间 smoothstep 插值
export const CameraRig: React.FC<{ t: number; keys: { at: number; pos: [number, number, number]; look: [number, number, number] }[] }> = ({ t, keys }) => {
    const { camera } = useThree();
    let i = 0;
    while (i < keys.length - 2 && t >= keys[i + 1].at) i += 1;
    const a = keys[i];
    const b = keys[Math.min(i + 1, keys.length - 1)];
    const raw = b.at <= a.at ? 1 : (t - a.at) / (b.at - a.at);
    const p = Math.min(1, Math.max(0, raw));
    const e = p * p * (3 - 2 * p);
    const mix = (u: [number, number, number], v: [number, number, number]) => new THREE.Vector3(u[0] + (v[0] - u[0]) * e, u[1] + (v[1] - u[1]) * e, u[2] + (v[2] - u[2]) * e);
    const cp = mix(a.pos, b.pos);
    const cl = mix(a.look, b.look);
    camera.position.set(cp.x, cp.y, cp.z);
    camera.lookAt(cl);
    return null;
};

// 网格地面（石墨底 + 等距网格）
export const Grid3D: React.FC<{ y?: number }> = ({ y = 0 }) => (
    <>
        <gridHelper args={[90, 45, "#3A404E", "#252A34"]} position={[0, y + 0.002, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y - 0.03, 0]}>
            <planeGeometry args={[90, 90]} />
            <meshStandardMaterial color="#101216" roughness={0.95} metalness={0.15} />
        </mesh>
    </>
);
