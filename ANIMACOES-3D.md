# Animações 3D com React Three Fiber — Guia de Referência

Técnica usada no portfolio `jaokdev` para criar um MacBook 3D girando 360° sem modelo externo.

---

## Setup (Next.js / React)

```bash
npm install three @react-three/fiber @react-three/drei
npm install --save-dev @types/three
```

No Next.js, sempre importar o componente com `ssr: false` para evitar erro de SSR (Three.js usa APIs do browser):

```tsx
import dynamic from "next/dynamic";
const Meu3D = dynamic(() => import("@/components/ui/meu-3d"), { ssr: false });
```

Ou usar um `mounted` state dentro do próprio componente:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

---

## Estrutura base de um componente 3D

```tsx
"use client";
import { useRef, Suspense, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";

function MeuModelo() {
  const ref = useRef<THREE.Group>(null);

  // useFrame roda a cada frame (60fps) — nunca use setInterval para animações 3D
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.4;  // rotação suave independente de FPS
    // flutuação senoidal no eixo Y
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.75) * 0.07;
  });

  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color="#17172a" metalness={0.88} roughness={0.18} />
      </mesh>
    </group>
  );
}

export default function Cena3D() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 6], fov: 38 }}
      gl={{ alpha: true, antialias: true }}         // alpha: true = fundo transparente
      style={{ background: "transparent", width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.22} />
      <spotLight position={[5, 8, 5]} intensity={1.6} angle={0.35} penumbra={0.6} castShadow />
      <pointLight position={[-4, 3, -2]} color="#c084fc" intensity={0.55} />

      <Suspense fallback={null}>
        <MeuModelo />
        <ContactShadows position={[0, -0.6, 0]} opacity={0.3} scale={8} blur={3} color="#7c3aed" />
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
```

---

## Receita de iluminação para portfolio dark (paleta roxa)

```tsx
<ambientLight intensity={0.22} />

{/* Principal — branco frio, de cima e frente */}
<spotLight position={[5, 8, 5]} intensity={1.6} angle={0.35} penumbra={0.6} color="#ffffff" castShadow />

{/* Fill roxo — da esquerda */}
<pointLight position={[-4, 3, -2]} color="#c084fc" intensity={0.55} />

{/* Rim — de trás, cria profundidade */}
<pointLight position={[0, 2, -5]} color="#7c3aed" intensity={0.4} />

{/* Sombra roxa no chão */}
<ContactShadows position={[0, -0.6, 0]} opacity={0.32} scale={9} blur={3.5} color="#7c3aed" />

{/* Environment map para reflexos realistas no material metálico */}
<Environment preset="city" />
```

---

## Materiais

### Metal escuro (corpo do MacBook, eletrônicos)
```tsx
<meshPhysicalMaterial color="#17172a" metalness={0.88} roughness={0.18} reflectivity={0.9} />
```

### Tela emissiva (display, LED, neon)
```tsx
<meshStandardMaterial
  color="#06060f"
  emissive={new THREE.Color("#7c3aed")}
  emissiveIntensity={0.75}
  toneMapped={false}   // importante: false = brilho vai além de 1.0
/>
```

### Vidro / trackpad
```tsx
<meshPhysicalMaterial color="#13132a" metalness={0.12} roughness={0.68} />
```

---

## Rotação 360° contínua (padrão)

```tsx
useFrame((_, delta) => {
  if (!ref.current) return;
  ref.current.rotation.y += delta * 0.4;  // 0.4 rad/s ≈ ~14 seg por volta completa
});
```

**Por que `delta` e não valor fixo?**
`delta` = tempo desde o último frame em segundos. Usando `delta * velocidade` a rotação é a mesma em 30fps, 60fps ou 144fps.

---

## Câmera recomendada para produto em showcase

```tsx
camera={{ position: [0, 2.2, 6.2], fov: 38 }}
```

- `fov: 38` → perspectiva comprimida, parece mais premium (menos distorção)
- `y: 2.2` → visão levemente de cima, mostra base + tela
- `z: 6.2` → distância confortável

---

## Construindo objetos com primitivas (sem modelo GLTF)

Útil quando não tem modelo 3D disponível ou quer controle total:

```tsx
// Caixa
<boxGeometry args={[largura, altura, profundidade]} />

// Caixa arredondada (drei)
import { RoundedBox } from "@react-three/drei";
<RoundedBox args={[1, 1, 1]} radius={0.08} smoothness={4} />

// Círculo / logo
<circleGeometry args={[raio, segmentos]} />

// Anel de glow
<ringGeometry args={[raioInterno, raioExterno, segmentos]} />

// Plano
<planeGeometry args={[largura, altura]} />
```

---

## Fundo transparente com glow CSS por baixo

O canvas WebGL com `gl={{ alpha: true }}` é transparente. Divs CSS com gradientes ficam visíveis por baixo:

```tsx
<div className="relative w-full h-[400px]">
  {/* Glow CSS fica por baixo do canvas */}
  <div className="absolute inset-0 rounded-3xl" style={{
    background: "radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)"
  }} />

  {/* Canvas por cima — transparente mostra o glow */}
  <div className="absolute inset-0">
    <Cena3D />
  </div>
</div>
```

---

## Carregando modelo GLTF externo (quando disponível)

```tsx
import { useGLTF } from "@react-three/drei";

function Modelo() {
  const { scene } = useGLTF("/models/produto.glb");
  return <primitive object={scene} />;
}

// Pré-carregar para evitar flash
useGLTF.preload("/models/produto.glb");
```

Fontes de modelos gratuitos:
- [Sketchfab](https://sketchfab.com) — filtrar "Free" + "Downloadable"
- [Poly Pizza](https://poly.pizza) — low poly gratuito
- [Market by Pmndrs](https://market.pmnd.rs) — otimizados para R3F

---

## Dependências usadas

```json
"three": "^0.x",
"@react-three/fiber": "^8.x",
"@react-three/drei": "^9.x",
"@types/three": "^0.x"
```

Implementado em: `portfolio/src/components/ui/macbook-3d.tsx`
