'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Undulating wireframe plane — feels like a topography map morphing over time.
 * Sits at a slight tilt so it recedes into the horizon.
 */
function Wave() {
  const meshRef = useRef();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 40, 40);
    return geo;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const pos = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = Math.sin(x * 0.4 + t) * 0.4 + Math.cos(y * 0.4 + t * 0.7) * 0.4;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2.5, 0, 0]}
      position={[0, -2, 0]}
    >
      <meshBasicMaterial
        color="#4f46e5"
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

export default function WaveGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Wave />
      </Canvas>
    </div>
  );
}
