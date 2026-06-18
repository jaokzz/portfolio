"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

function MacBookModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/macbook_pro_2021.glb");

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.15;
  });

  return (
    <group ref={groupRef} scale={8}>
      <primitive object={scene} />
      {/* Luz pontual roxo na frente — ilumina tela e teclado */}
      <pointLight position={[0, 2, 3]} color="#a855f7" intensity={1.2} distance={8} decay={2} />
    </group>
  );
}

useGLTF.preload("/macbook_pro_2021.glb");

export default function MacBook3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2.5, 8], fov: 38 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.35} />
      <spotLight
        position={[5, 8, 5]}
        intensity={1.8}
        angle={0.35}
        penumbra={0.6}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 3, -2]} color="#c084fc" intensity={0.5} />
      <pointLight position={[0, 2, -5]} color="#7c3aed" intensity={0.4} />

      <Suspense fallback={null}>
        <MacBookModel />
        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.35}
          scale={10}
          blur={3.5}
          color="#7c3aed"
        />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
