'use client';

import { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Interactive 3D globe:
 *  - Solid indigo sphere with a slightly larger wireframe overlay for stylized depth
 *  - Additive atmosphere shell → soft glow around the horizon
 *  - Pulsing "city" markers positioned at real-ish lat/long of major cities
 *  - Bezier arcs continuously animated between random city pairs — feels like message flow
 *  - Drag-to-rotate via OrbitControls (no zoom/pan → prevents mess)
 *  - Auto-rotates when not being touched
 */

// Real-ish cities for the message-flow visual. Lat/lng → 3D position on unit sphere.
const CITIES = [
  { name: 'Dubai',       lat: 25.2,  lng: 55.3  },
  { name: 'Karachi',     lat: 24.9,  lng: 67.0  },
  { name: 'London',      lat: 51.5,  lng: -0.1  },
  { name: 'New York',    lat: 40.7,  lng: -74.0 },
  { name: 'São Paulo',   lat: -23.5, lng: -46.6 },
  { name: 'Riyadh',      lat: 24.7,  lng: 46.7  },
  { name: 'Singapore',   lat: 1.35,  lng: 103.8 },
  { name: 'Tokyo',       lat: 35.7,  lng: 139.7 },
  { name: 'Berlin',      lat: 52.5,  lng: 13.4  },
  { name: 'Cape Town',   lat: -33.9, lng: 18.4  },
  { name: 'Sydney',      lat: -33.9, lng: 151.2 },
  { name: 'Mumbai',      lat: 19.1,  lng: 72.9  },
];

const RADIUS = 2;

// Convert lat/lng (degrees) to a Vector3 on a sphere of given radius
function latLngToVec3(lat, lng, r = RADIUS) {
  const phi   = (90 - lat)  * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

// A pulsing dot at a fixed sphere-surface position
function CityMarker({ position }) {
  const outerRef = useRef();

  useFrame((state) => {
    if (!outerRef.current) return;
    // Pulse scale + opacity, sinusoidal, staggered by position.x seed
    const t = state.clock.elapsedTime * 2 + position.x * 5;
    const pulse = (Math.sin(t) + 1) / 2; // 0..1
    outerRef.current.scale.setScalar(1 + pulse * 1.5);
    outerRef.current.material.opacity = 0.4 - pulse * 0.3;
  });

  return (
    <group position={position}>
      {/* Bright core */}
      <mesh>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#e0e7ff" />
      </mesh>
      {/* Pulsing outer halo */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  );
}

// Animated arc between two cities. Solid line + a "traveling dot" sphere that
// walks along the curve continuously — feels like a message packet flying.
function MessageArc({ from, to, offset = 0 }) {
  const dotRef = useRef();

  const { curve, geometry } = useMemo(() => {
    // Midpoint pulled outward for the arc's bow
    const mid = from.clone().add(to).multiplyScalar(0.5).normalize().multiplyScalar(RADIUS * 1.5);
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    const points = curve.getPoints(50);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return { curve, geometry: geo };
  }, [from, to]);

  useFrame((state) => {
    if (!dotRef.current) return;
    // Walk t from 0..1 along the curve, loop with offset per arc
    const t = ((state.clock.elapsedTime * 0.4 + offset) % 1);
    const pos = curve.getPoint(t);
    dotRef.current.position.copy(pos);
    // Fade in at start, fade out at end
    const fade = Math.sin(t * Math.PI); // 0..1..0
    dotRef.current.material.opacity = fade;
  });

  return (
    <>
      <line geometry={geometry}>
        <lineBasicMaterial color="#a5b4fc" transparent opacity={0.25} />
      </line>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshBasicMaterial color="#e0e7ff" transparent opacity={1} depthWrite={false} />
      </mesh>
    </>
  );
}

function GlobeMesh() {
  const groupRef = useRef();
  const [autoRotate, setAutoRotate] = useState(true);

  // Precompute city positions once
  const cityPositions = useMemo(() => CITIES.map((c) => latLngToVec3(c.lat, c.lng, RADIUS + 0.001)), []);

  // Random pairs for arcs — recompute occasionally would be cool but static is fine visually
  const arcs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < 8; i++) {
      const a = Math.floor(Math.random() * CITIES.length);
      let b = Math.floor(Math.random() * CITIES.length);
      while (b === a) b = Math.floor(Math.random() * CITIES.length);
      pairs.push({ from: cityPositions[a], to: cityPositions[b], offset: Math.random() * 5 });
    }
    return pairs;
  }, [cityPositions]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Solid dark sphere = the "planet" body */}
      <mesh>
        <sphereGeometry args={[RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#0a0a2e"
          emissive="#1e1b4b"
          emissiveIntensity={0.4}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Wireframe overlay — grid-like detail */}
      <mesh>
        <sphereGeometry args={[RADIUS + 0.002, 32, 24]} />
        <meshBasicMaterial color="#4f46e5" wireframe transparent opacity={0.2} />
      </mesh>

      {/* Atmosphere glow — larger shell, back-facing, additive */}
      <mesh scale={1.15}>
        <sphereGeometry args={[RADIUS, 32, 32]} />
        <meshBasicMaterial
          color="#818cf8"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* City markers */}
      {cityPositions.map((pos, i) => <CityMarker key={i} position={pos} />)}

      {/* Message arcs */}
      {arcs.map((arc, i) => <MessageArc key={i} {...arc} />)}
    </group>
  );
}

export default function Globe() {
  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#818cf8" />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color="#4f46e5" />
        <Suspense fallback={null}>
          <GlobeMesh />
        </Suspense>
        {/* Drag to rotate — no zoom/pan so users can't mess it up */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
