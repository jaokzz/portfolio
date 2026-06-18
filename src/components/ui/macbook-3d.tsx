"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ── MacBook geometry ─────────────────────────────────────────
   Tudo em primitivas Three.js — sem modelo externo.
   Escala: ~1 unit ≈ 10 cm  (MacBook Pro 14")
   Base   : 3.0 × 0.12 × 2.0
   Lid    : 3.0 × 2.0  × 0.06
   Pivot do screen: borda traseira da base (z = -1.0)
──────────────────────────────────────────────────────────────── */
function MacBook() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    // tempo absoluto = rotação nunca para nem fica presa em delta zero
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.55;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.09;
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>

      {/* ── BASE ── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.12, 2.0]} />
        <meshPhysicalMaterial
          color="#17172a"
          metalness={0.88}
          roughness={0.18}
          reflectivity={0.9}
        />
      </mesh>

      {/* Área do teclado — reentrância escura */}
      <mesh position={[0, 0.062, -0.08]}>
        <boxGeometry args={[2.55, 0.001, 1.48]} />
        <meshStandardMaterial color="#0c0c1c" roughness={0.97} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, 0.062, 0.64]}>
        <boxGeometry args={[0.78, 0.001, 0.5]} />
        <meshPhysicalMaterial
          color="#13132a"
          metalness={0.12}
          roughness={0.68}
        />
      </mesh>

      {/* ── SCREEN ASSEMBLY ──
          Pivot: [0, 0.06, -1.0] (borda traseira do base)
          rotation.x = 0    → tela vertical (90° do base)
          rotation.x = 0.22 → ~103° do base (angulo típico de uso)
      ── */}
      <group position={[0, 0.06, -1.0]} rotation={[0.22, 0, 0]}>

        {/* Tampa (lid) */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[3.0, 2.0, 0.06]} />
          <meshPhysicalMaterial
            color="#17172a"
            metalness={0.88}
            roughness={0.18}
            reflectivity={0.9}
          />
        </mesh>

        {/* Display — face frontal da tampa */}
        <mesh position={[0, 1.0, 0.032]}>
          <boxGeometry args={[2.72, 1.74, 0.002]} />
          <meshStandardMaterial
            color="#06060f"
            emissive={new THREE.Color("#7c3aed")}
            emissiveIntensity={0.75}
            toneMapped={false}
          />
        </mesh>

        {/* Brilho extra no centro do display — simula reflexo de tela */}
        <mesh position={[0, 1.08, 0.034]}>
          <planeGeometry args={[1.4, 0.9]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive={new THREE.Color("#c084fc")}
            emissiveIntensity={0.2}
            transparent
            opacity={0.08}
            toneMapped={false}
          />
        </mesh>

        {/* Luz pontual na frente do display */}
        <pointLight
          position={[0, 1.0, 0.6]}
          color="#a855f7"
          intensity={1.8}
          distance={3.5}
          decay={2}
        />

        {/* Logo Apple — parte de trás da tampa */}
        <mesh position={[0, 1.0, -0.034]}>
          <circleGeometry args={[0.16, 48]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive={new THREE.Color("#a855f7")}
            emissiveIntensity={2.8}
            toneMapped={false}
          />
        </mesh>

        {/* Anel de glow ao redor do logo */}
        <mesh position={[0, 1.0, -0.035]}>
          <ringGeometry args={[0.16, 0.24, 48]} />
          <meshStandardMaterial
            color="#7c3aed"
            emissive={new THREE.Color("#7c3aed")}
            emissiveIntensity={1.2}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}

/* ── Canvas wrapper ───────────────────────────────────────────── */
export default function MacBook3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Skip Three.js on mobile — too GPU-intensive for phones
  if (window.matchMedia("(max-width: 768px)").matches) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="rounded-2xl border"
          style={{
            width: "220px",
            height: "150px",
            background: "linear-gradient(135deg, #17172a, #0d0d1a)",
            borderColor: "rgba(168,85,247,0.3)",
            boxShadow: "0 0 40px rgba(124,58,237,0.25)",
          }}
        >
          <div className="w-full h-full rounded-2xl flex items-center justify-center"
            style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.2) 0%, transparent 70%)" }}>
            <div className="w-3 h-3 rounded-full" style={{ background: "#a855f7", boxShadow: "0 0 12px #a855f7" }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.2, 6.2], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      {/* Luz ambiente suave */}
      <ambientLight intensity={0.22} />

      {/* Spot principal — branco frio, de cima */}
      <spotLight
        position={[5, 8, 5]}
        intensity={1.6}
        angle={0.35}
        penumbra={0.6}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Fill light roxo da esquerda */}
      <pointLight position={[-4, 3, -2]} color="#c084fc" intensity={0.55} />

      {/* Rim light azul-roxo de trás */}
      <pointLight position={[0, 2, -5]} color="#7c3aed" intensity={0.4} />

      <Suspense fallback={null}>
        <MacBook />

        {/* Sombra roxa no chão */}
        <ContactShadows
          position={[0, -0.62, 0]}
          opacity={0.32}
          scale={9}
          blur={3.5}
          color="#7c3aed"
        />

        {/* Environment map para reflexos realistas */}
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
