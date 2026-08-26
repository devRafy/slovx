'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Hero 3D scene: a floating "neural mesh" — cloud of particles connected by
 * lines when they get close. Rotates on its own + subtle drift with cursor.
 * All GPU-friendly (single BufferGeometry, no per-frame allocations).
 */

const PARTICLE_COUNT = 200;
const RADIUS = 5;

function Particles({ mousePos }) {
  const pointsRef = useRef();
  const linesRef  = useRef();

  // Generate initial particle positions once (never re-created).
  const [positions, velocities] = useMemo(() => {
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spherical distribution
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = Math.cbrt(Math.random()) * RADIUS;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      // Slow tumble velocity
      velocities[i * 3]     = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    return [positions, velocities];
  }, []);

  // Pre-allocated line geometry (up to 400 lines — plenty for close-neighbor pairs)
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(400 * 6), 3));
    return geo;
  }, []);

  useFrame((state) => {
    // Update particle positions in place
    const posAttr = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posAttr.array[i3]     += velocities[i3];
      posAttr.array[i3 + 1] += velocities[i3 + 1];
      posAttr.array[i3 + 2] += velocities[i3 + 2];

      // Bounce off the sphere boundary
      const x = posAttr.array[i3];
      const y = posAttr.array[i3 + 1];
      const z = posAttr.array[i3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);
      if (dist > RADIUS) {
        velocities[i3]     *= -1;
        velocities[i3 + 1] *= -1;
        velocities[i3 + 2] *= -1;
      }
    }
    posAttr.needsUpdate = true;

    // Rebuild "close neighbor" lines each frame (cheap at 200 particles)
    const linePos = lineGeometry.attributes.position;
    let lineIdx = 0;
    const maxDist = 1.5;

    for (let i = 0; i < PARTICLE_COUNT && lineIdx < 400 * 6; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT && lineIdx < 400 * 6; j++) {
        const dx = posAttr.array[i * 3]     - posAttr.array[j * 3];
        const dy = posAttr.array[i * 3 + 1] - posAttr.array[j * 3 + 1];
        const dz = posAttr.array[i * 3 + 2] - posAttr.array[j * 3 + 2];
        const d  = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < maxDist) {
          linePos.array[lineIdx++] = posAttr.array[i * 3];
          linePos.array[lineIdx++] = posAttr.array[i * 3 + 1];
          linePos.array[lineIdx++] = posAttr.array[i * 3 + 2];
          linePos.array[lineIdx++] = posAttr.array[j * 3];
          linePos.array[lineIdx++] = posAttr.array[j * 3 + 1];
          linePos.array[lineIdx++] = posAttr.array[j * 3 + 2];
        }
      }
    }
    // Zero out remaining vertices so they collapse to origin (invisible)
    while (lineIdx < 400 * 6) {
      linePos.array[lineIdx++] = 0;
    }
    linePos.needsUpdate = true;
    lineGeometry.setDrawRange(0, Math.floor(lineIdx / 6) * 2);

    // Whole scene follows cursor with easing (parallax feel)
    if (pointsRef.current && mousePos.current) {
      const targetRotY = mousePos.current.x * 0.3;
      const targetRotX = -mousePos.current.y * 0.2;
      pointsRef.current.rotation.y += (targetRotY - pointsRef.current.rotation.y) * 0.05;
      pointsRef.current.rotation.x += (targetRotX - pointsRef.current.rotation.x) * 0.05;
      linesRef.current.rotation.y = pointsRef.current.rotation.y;
      linesRef.current.rotation.x = pointsRef.current.rotation.x;
    }

    // Slow autonomous rotation on top of cursor drift
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0015;
      linesRef.current.rotation.y  += 0.0015;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#a5b4fc"
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>
    </>
  );
}

export default function NeuralMesh() {
  const mousePos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top)  / rect.height - 0.5,
    };
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="absolute inset-0 pointer-events-auto"
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#818cf8" />
        <Particles mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
