import React from "react";
import * as THREE from "three";

// iPhone Duo 示意机身：书本式内折，合上 74×156×11.3 的比例。
// 背面：左上角圆角方形双摄（竖直排列 + 闪光灯）、中央苹果标；
// 另一侧外表面：5.4 寸外屏。展开后两块内屏连续。

const L = 1.24;
const H = 2.6;
const T = 0.072;
const R = 0.12;

const roundedShape = (w: number, h: number, r: number) => {
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    return s;
};

const panel = (w: number, h: number, t: number, r: number) => {
    const g = new THREE.ExtrudeGeometry(roundedShape(w, h, r), { depth: t, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2, curveSegments: 10 });
    g.translate(0, 0, -t / 2);
    return g;
};

const plate = (w: number, h: number, r: number) => new THREE.ShapeGeometry(roundedShape(w, h, r), 10);

const BODY = panel(L, H, T, R);
const INNER = plate(L * 1.0, H * 0.955, 0.08);
const BUMP = panel(0.46, 0.48, 0.03, 0.14);
const LENS_A = new THREE.CylinderGeometry(0.085, 0.085, 0.018, 28);
const LENS_RING = new THREE.RingGeometry(0.086, 0.1, 28);
const FLASH = new THREE.CylinderGeometry(0.028, 0.028, 0.012, 18);

const TONES = {
    night: { body: "#2A3446", frame: "#8B96A8", logo: "#C9D2E0", bump: "#232C3C", lens: "#05080D" },
    star: { body: "#E9EBEF", frame: "#C3CAD6", logo: "#9AA1AB", bump: "#DDDFE4", lens: "#05080D" },
};

export const PhoneModel: React.FC<{
    open: number;
    stress?: number;
    hinge?: boolean;
    screen?: boolean;
    tone?: "night" | "star";
}> = ({ open, stress = 0, hinge = true, screen = true, tone = "night" }) => {
    const c = TONES[tone];
    const a = (Math.PI / 2) * (1 - open);
    const gap = 0.066;
    const heat = Math.min(1, stress);
    const stressColor = new THREE.Color("#2A303B").lerp(new THREE.Color("#DC2626"), heat * 0.85);
    const barrel = Math.max(0, 1 - open * 1.05);

    const half = (side: 1 | -1) => (
        <group rotation={[0, side === 1 ? -a : a, 0]} position={[side * gap * (1 - open), 0, 0]}>
            <mesh geometry={BODY} position={[(side * L) / 2, 0, 0]}>
                <meshStandardMaterial color={c.body} metalness={tone === "night" ? 0.35 : 0.2} roughness={0.46} />
            </mesh>

            {/* 内屏 */}
            {screen ? (
                <>
                    <mesh geometry={INNER} position={[(side * L) / 2, 0, T / 2 + 0.014]}>
                        <meshStandardMaterial color="#070B12" metalness={0.08} roughness={0.1} emissive="#16283F" emissiveIntensity={0.85} />
                    </mesh>
                    <group position={[(side * L) / 2, 0, T / 2 + 0.02]}>
                        <mesh position={[0, H * 0.37, 0]}>
                            <planeGeometry args={[L * 0.56, 0.045]} />
                            <meshBasicMaterial color="#3E6699" />
                        </mesh>
                        <mesh position={[-L * 0.16, H * 0.08, 0]}>
                            <planeGeometry args={[L * 0.4, H * 0.26]} />
                            <meshBasicMaterial color="#1E3355" />
                        </mesh>
                        <mesh position={[L * 0.2, -H * 0.22, 0]}>
                            <planeGeometry args={[L * 0.48, H * 0.2]} />
                            <meshBasicMaterial color="#182944" />
                        </mesh>
                        <mesh position={[0, -H * 0.415, 0]}>
                            <planeGeometry args={[L * 0.26, 0.025]} />
                            <meshBasicMaterial color="#FB923C" transparent opacity={0.8} />
                        </mesh>
                    </group>
                </>
            ) : null}

            {/* 背面：双摄 + 苹果标（+X 可见侧） */}
            {side === 1 ? (
                <>
                    <group position={[L * 0.55, H * 0.35, -T / 2 - 0.016]}>
                        <mesh geometry={BUMP}>
                            <meshStandardMaterial color={c.bump} metalness={0.35} roughness={0.4} />
                        </mesh>
                        {[0.105, -0.105].map((y) => (
                            <group key={y} position={[0, y, -0.026]} rotation={[0, Math.PI, 0]}>
                                <mesh geometry={LENS_A} rotation={[Math.PI / 2, 0, 0]}>
                                    <meshStandardMaterial color={c.lens} metalness={0.9} roughness={0.05} />
                                </mesh>
                                <mesh geometry={LENS_RING}>
                                    <meshBasicMaterial color={c.frame} side={THREE.DoubleSide} />
                                </mesh>
                                <mesh position={[0, 0, 0.001]}>
                                    <circleGeometry args={[0.05, 20]} />
                                    <meshBasicMaterial color="#101B2E" />
                                </mesh>
                            </group>
                        ))}
                        <mesh geometry={FLASH} rotation={[Math.PI / 2, 0, 0]} position={[0.155, 0.105, -0.026]}>
                            <meshStandardMaterial color="#F5E6C8" emissive="#F5E6C8" emissiveIntensity={0.35} />
                        </mesh>
                    </group>

                    {/* 苹果标：三颗压扁球 + 一片叶子 */}
                    <group position={[L / 2, -H * 0.03, -T / 2 - 0.004]} rotation={[0, Math.PI, 0]}>
                        <mesh position={[0, -0.01, 0]} scale={[1, 1.02, 0.1]}>
                            <sphereGeometry args={[0.105, 24, 16]} />
                            <meshStandardMaterial color={c.logo} metalness={0.55} roughness={0.35} />
                        </mesh>
                        <mesh position={[-0.065, 0.045, 0]} scale={[1, 1.05, 0.1]}>
                            <sphereGeometry args={[0.078, 24, 16]} />
                            <meshStandardMaterial color={c.logo} metalness={0.55} roughness={0.35} />
                        </mesh>
                        <mesh position={[0.065, 0.045, 0]} scale={[1, 1.05, 0.1]}>
                            <sphereGeometry args={[0.078, 24, 16]} />
                            <meshStandardMaterial color={c.logo} metalness={0.55} roughness={0.35} />
                        </mesh>
                        <mesh position={[0.05, 0.15, 0]} rotation={[0, 0, 0.62]} scale={[0.055, 0.026, 0.01]}>
                            <sphereGeometry args={[1, 16, 12]} />
                            <meshStandardMaterial color={c.logo} metalness={0.55} roughness={0.35} />
                        </mesh>
                    </group>
                </>
            ) : null}

            {/* 外屏：另一侧外表面（-X 可见） */}
            {side === -1 ? (
                <group position={[(side * L) / 2, 0, -T / 2 - 0.014]}>
                    <mesh rotation={[0, Math.PI, 0]}>
                        <planeGeometry args={[L * 0.9, H * 0.86]} />
                        <meshStandardMaterial color="#05080D" metalness={0.05} roughness={0.12} emissive="#12233C" emissiveIntensity={1.1} side={THREE.DoubleSide} />
                    </mesh>
                    <group position={[0, 0, -0.008]} rotation={[0, Math.PI, 0]}>
                        <mesh position={[0, H * 0.36, 0]}>
                            <planeGeometry args={[0.5, 0.06]} />
                            <meshBasicMaterial color="#9FB6D6" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh position={[0, H * 0.28, 0]}>
                            <planeGeometry args={[0.3, 0.022]} />
                            <meshBasicMaterial color="#4A6C96" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh position={[0, H * 0.04, 0]}>
                            <planeGeometry args={[0.72, 0.42]} />
                            <meshBasicMaterial color="#1B3050" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh position={[0, -H * 0.24, 0]}>
                            <planeGeometry args={[0.72, 0.2]} />
                            <meshBasicMaterial color="#16283F" side={THREE.DoubleSide} />
                        </mesh>
                        <mesh position={[0, -H * 0.4, 0]}>
                            <planeGeometry args={[0.2, 0.024]} />
                            <meshBasicMaterial color="#FB923C" side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                </group>
            ) : null}

            {stress > 0.02 ? (
                <mesh position={[0, 0, T / 2 + 0.026]}>
                    <planeGeometry args={[0.05, H * 0.98]} />
                    <meshBasicMaterial color="#FF6A3D" transparent opacity={Math.min(0.9, stress)} />
                </mesh>
            ) : null}
        </group>
    );

    return (
        <group>
            {half(-1)}
            {half(1)}
            {/* 中缝填条：展开时补上两段倒角留下的细缝 */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.03, H * 0.995, T * 0.96]} />
                <meshStandardMaterial color={c.body} metalness={tone === "night" ? 0.35 : 0.2} roughness={0.46} />
            </mesh>
            <mesh position={[0, 0, T / 2 + 0.0135]}>
                <planeGeometry args={[0.034, H * 0.955]} />
                <meshStandardMaterial color="#070B12" metalness={0.08} roughness={0.1} emissive="#16283F" emissiveIntensity={0.85} />
            </mesh>
            {hinge && barrel > 0.02 ? (
                <mesh position={[0, 0, 0.052]}>
                    <cylinderGeometry args={[0.1, 0.1, H * 0.96, 32, 1, false]} />
                    <meshStandardMaterial color={stress > 0.02 ? stressColor : c.frame} metalness={0.55} roughness={0.34} transparent opacity={Math.min(1, barrel * 1.6)} />
                </mesh>
            ) : null}
        </group>
    );
};
