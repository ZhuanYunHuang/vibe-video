import React from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// —— 明亮影棚：白棚 + 浅网格 + 柔和三点光 ——

export const Scene3D: React.FC<{
    children: React.ReactNode;
    fov?: number;
    pos?: [number, number, number];
    bg?: string;
    fog?: [number, number];
}> = ({ children, fov = 38, pos = [5.2, 2.6, 7.4], bg = "#EDF2F9", fog = [26, 64] }) => (
    <div style={{ position: "absolute", inset: 0 }}>
        <ThreeCanvas width={1920} height={1080} camera={{ fov, position: pos, near: 0.1, far: 160 }} style={{ position: "absolute", inset: 0 }}>
            <color attach="background" args={[bg]} />
            <fog attach="fog" args={[bg, fog[0], fog[1]]} />
            <ambientLight intensity={1.15} />
            <directionalLight position={[7, 11, 6]} intensity={1.55} color="#FFF6E8" />
            <directionalLight position={[6, 3, 7]} intensity={1.0} color="#DCE8FF" />
            <directionalLight position={[-6, 5, -7]} intensity={0.8} color="#FFFFFF" />
            {children}
        </ThreeCanvas>
    </div>
);

// 帧驱动运镜：关键帧之间 smoothstep
export const CameraRig: React.FC<{ t: number; keys: { at: number; pos: [number, number, number]; look: [number, number, number] }[] }> = ({ t, keys }) => {
    const { camera } = useThree();
    let i = 0;
    while (i < keys.length - 2 && t >= keys[i + 1].at) i += 1;
    const a = keys[i];
    const b = keys[Math.min(i + 1, keys.length - 1)];
    const raw = b.at <= a.at ? 1 : (t - a.at) / (b.at - a.at);
    const p = Math.min(1, Math.max(0, raw));
    const e = p * p * (3 - 2 * p);
    const mix = (u: [number, number, number], v: [number, number, number]) =>
        new THREE.Vector3(u[0] + (v[0] - u[0]) * e, u[1] + (v[1] - u[1]) * e, u[2] + (v[2] - u[2]) * e);
    const cp = mix(a.pos, b.pos);
    const cl = mix(a.look, b.look);
    camera.position.set(cp.x, cp.y, cp.z);
    camera.lookAt(cl);
    return null;
};

// 浅色网格地面
export const Grid3D: React.FC<{ y?: number }> = ({ y = 0 }) => (
    <>
        <gridHelper args={[70, 35, "#C3CEDF", "#D9E1EC"]} position={[0, y + 0.002, 0]} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y - 0.03, 0]}>
            <planeGeometry args={[70, 70]} />
            <meshStandardMaterial color="#E9EEF6" roughness={0.96} metalness={0.02} />
        </mesh>
    </>
);
