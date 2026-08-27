'use client';

import { useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import dynamic from 'next/dynamic';

const RobotMascot = dynamic(() => import('./3d/RobotMascot'), { ssr: false });

/**
 * Hero-only 3D robot that tracks the cursor.
 * Lives inside the Hero section's right column — scrolls away naturally when
 * the user moves past the hero (no global fixed overlay).
 */
export default function HeroRobot() {
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mousePos.current = {
        x: (e.clientX / window.innerWidth)  - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      };
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const state = { pos: [0, 0, 0], scale: 1.1, action: 'tracking' };

  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]}  intensity={1.2} color="#a5b4fc" />
        <pointLight position={[-5, 3, 2]} intensity={0.4} color="#4f46e5" />
        <pointLight position={[0, -3, 3]} intensity={0.3} color="#c7d2fe" />
        <Suspense fallback={null}>
          <RobotMascot state={state} mousePos={mousePos} />
          <Sparkles count={50} scale={6} size={2} speed={0.35} color="#a5b4fc" position={[0, 0, 0]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
