'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Cinematic hero centerpiece:
 *  - Big glowing torus knot (feels organic, morphs subtly via MeshDistortMaterial)
 *  - Three orbiting spheres at different radii + speeds
 *  - Ambient sparkles behind (adds depth without noise)
 *  - Entire scene rotates toward cursor (parallax)
 *  - Click anywhere on canvas → pulse animation
 */

function CenterKnot({ pulseTrigger }) {
  const meshRef = useRef();
  const [scale, setScale] = useState(1);

  // Pulse animation — grows then eases back
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    // Slow autonomous rotation
    meshRef.current.rotation.y += delta * 0.3;
    meshRef.current.rotation.x += delta * 0.1;
    // Ease scale back to 1 after a pulse
    setScale((prev) => prev + (1 - prev) * delta * 3);
    meshRef.current.scale.setScalar(scale);
  });

  // Trigger scale-up when parent bumps pulseTrigger
  useFrame(() => {
    if (pulseTrigger.current > 0) {
      setScale(1.25);
      pulseTrigger.current = 0;
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      <MeshDistortMaterial
        color="#4f46e5"
        emissive="#4f46e5"
        emissiveIntensity={0.5}
        distort={0.35}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}

function Orbiter({ radius, speed, size, color, offset }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    meshRef.current.position.x = Math.cos(t) * radius;
    meshRef.current.position.z = Math.sin(t) * radius;
    meshRef.current.position.y = Math.sin(t * 1.3) * (radius * 0.3);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.2}
        roughness={0.3}
      />
    </mesh>
  );
}

function Scene({ mousePos, pulseTrigger }) {
  const groupRef = useRef();

  useFrame(() => {
    if (!groupRef.current || !mousePos.current) return;
    // Ease group rotation toward cursor position — subtle parallax
    const targetX = mousePos.current.y * 0.3;
    const targetY = mousePos.current.x * 0.5;
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.05;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <CenterKnot pulseTrigger={pulseTrigger} />
      </Float>
      <Orbiter radius={2.5} speed={0.8}  size={0.15} color="#a5b4fc" offset={0} />
      <Orbiter radius={3.2} speed={0.5}  size={0.2}  color="#818cf8" offset={2} />
      <Orbiter radius={2}   speed={-1}   size={0.12} color="#c7d2fe" offset={4} />
      <Sparkles count={80} scale={6} size={2} speed={0.3} color="#a5b4fc" />
    </group>
  );
}

export default function HeroScene() {
  const containerRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const pulseTrigger = useRef(0);

  // Track cursor globally (window-level) so parallax works even when hovering
  // sibling text/buttons that would otherwise block the mousemove event.
  useEffect(() => {
    const onMove = (e) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Only track when cursor is within our container's bounds (hero section)
      if (
        e.clientX < rect.left  || e.clientX > rect.right ||
        e.clientY < rect.top   || e.clientY > rect.bottom
      ) return;
      mousePos.current = {
        x: (e.clientX - rect.left) / rect.width  - 0.5,
        y: (e.clientY - rect.top)  / rect.height - 0.5,
      };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const handleClick = () => {
    // Signal the CenterKnot to pulse. Only fires on canvas clicks (buttons stop propagation).
    pulseTrigger.current = 1;
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="absolute inset-0"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#818cf8" />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4f46e5" />
        <Suspense fallback={null}>
          <Scene mousePos={mousePos} pulseTrigger={pulseTrigger} />
        </Suspense>
      </Canvas>
    </div>
  );
}
