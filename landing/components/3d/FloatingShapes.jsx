'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ambient background — a few wireframe icosahedrons drifting slowly.
 * Feels tech + weightless without being distracting behind content.
 */
function Shape({ position, size, speed, offset }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    meshRef.current.rotation.x = t * 0.3;
    meshRef.current.rotation.y = t * 0.4;
    meshRef.current.position.y = position[1] + Math.sin(t) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[size, 0]} />
      <meshBasicMaterial
        color="#818cf8"
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function Scene() {
  const shapes = useMemo(() => [
    { position: [-4, 1, -2],  size: 0.8, speed: 0.4, offset: 0 },
    { position: [4, -1, -3],  size: 1.2, speed: 0.3, offset: 1.5 },
    { position: [-2, -2, -1], size: 0.5, speed: 0.6, offset: 3 },
    { position: [3, 2, -4],   size: 0.7, speed: 0.35, offset: 4.5 },
    { position: [0, 0, -6],   size: 1.5, speed: 0.2, offset: 2 },
  ], []);

  return (
    <>
      {shapes.map((s, i) => <Shape key={i} {...s} />)}
    </>
  );
}

export default function FloatingShapes() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
