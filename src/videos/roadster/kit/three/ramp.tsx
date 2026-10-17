import React from "react";
import { interpolate } from "remotion";
import * as THREE from "three";
import { RoadsterModel } from "./car";

// —— 半管坡道 + 爬坡动画：车沿圆弧内侧缓慢爬升到顶、倒挂悬停 ——

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const R_IN = 6.2;

const makeArcGeom = (rIn: number, rOut: number, width: number) => {
    const shape = new THREE.Shape();
    const a0 = THREE.MathUtils.degToRad(-91);
    const a1 = THREE.MathUtils.degToRad(113);
    shape.absarc(0, 0, rOut, a0, a1, false);
    shape.absarc(0, 0, rIn, a1, a0, true);
    const g = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: false, curveSegments: 48 });
    g.translate(0, 0, -width / 2);
    return g;
};

const rampGeom = makeArcGeom(6.2, 6.95, 4.8);
const wallGeom = makeArcGeom(6.05, 6.95, 0.14);

export const HalfPipeRamp: React.FC = () => (
    <group position={[0, R_IN, 0]}>
        <mesh geometry={rampGeom}>
            <meshStandardMaterial color="#262B36" metalness={0.35} roughness={0.72} />
        </mesh>
        <mesh geometry={wallGeom} position={[0, 0, -2.47]}>
            <meshStandardMaterial color="#2E3440" metalness={0.4} roughness={0.6} />
        </mesh>
        {/* 近侧栏板移除：避免遮挡 +z 机位 */}
        {/* 起跑跑道（与坡道根部地面齐平） */}
        <mesh position={[-7.6, -R_IN - 0.06, 0]}>
            <boxGeometry args={[15.2, 0.12, 4.8]} />
            <meshStandardMaterial color="#20242E" metalness={0.3} roughness={0.8} />
        </mesh>
    </group>
);

// 沿圆弧内侧行驶：φ=0 在地面、φ=180° 完全倒挂；climbTo 之后悬停微摆
export const CarOnRamp: React.FC<{ t: number; climbFrom: number; climbTo: number; lightsAt?: number }> = ({ t, climbFrom, climbTo, lightsAt = 0 }) => {
    const p = interpolate(t, [climbFrom, climbTo], [0, 1], CL);
    const e = p * p * (3 - 2 * p);
    const post = Math.max(0, t - climbTo);
    const sway = post > 0 ? Math.sin(post / 16) * 1.4 * Math.min(1, post / 22) : 0;
    const phi = ((1 + e * 198 + sway) * Math.PI) / 180;
    const pos = new THREE.Vector3(R_IN * Math.sin(phi), R_IN - R_IN * Math.cos(phi), 0);
    const fwd = new THREE.Vector3(Math.cos(phi), Math.sin(phi), 0);
    const up = new THREE.Vector3(-Math.sin(phi), Math.cos(phi), 0);
    const quat = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(fwd, up, new THREE.Vector3(0, 0, 1)));
    const glow = interpolate(t, [climbTo - 16, climbTo + 10], [0, 0.9], CL);
    const lights = t >= lightsAt ? 1 : 0;
    return (
        <group position={pos} quaternion={quat}>
            <RoadsterModel glow={glow} lights={lights} />
        </group>
    );
};
