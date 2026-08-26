'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

/**
 * State-driven robot. Lives inside a global Canvas (see RobotOrchestrator).
 * Accepts a `state` prop describing target position, scale, and action.
 * All transitions are lerped in useFrame → smooth animation between sections.
 *
 * Actions:
 *   • tracking        — head/eyes follow the cursor (default hero behavior)
 *   • looking-left    — head fixed rotated ~30deg to the left
 *   • looking-right   — head fixed rotated ~30deg to the right
 *   • looking-up      — head tilted up (surprised)
 *   • scanning        — head slowly sweeps left-right on its own
 *   • celebrating     — exaggerated bobbing, faster antenna
 *   • thinking        — head tilted, slow-blink, dim antenna
 *   • waving          — bigger bob + brighter antenna
 */

const ACTION_ROTATIONS = {
  'looking-left':  { x: -0.05, y:  0.5  },
  'looking-right': { x: -0.05, y: -0.5  },
  'looking-up':    { x: -0.35, y:  0    },
  'looking-down':  { x:  0.35, y:  0    },
};

export default function RobotMascot({ state, mousePos }) {
  const groupRef        = useRef();
  const headGroupRef    = useRef();  // separate group for head rotation independent of body position
  const leftEyeRef      = useRef();
  const rightEyeRef     = useRef();
  const antennaBulbRef  = useRef();

  const [isBlinking, setIsBlinking] = useState(false);

  // Targets we lerp toward — refreshed whenever `state` prop changes
  const targetPos      = useRef(new THREE.Vector3(...state.pos));
  const targetScale    = useRef(state.scale);
  const currentAction  = useRef(state.action);

  useEffect(() => {
    targetPos.current.set(...state.pos);
    targetScale.current = state.scale;
    currentAction.current = state.action;
  }, [state]);

  // Blink loop — timing depends on action
  useEffect(() => {
    let cancelled = false;
    const scheduleBlink = () => {
      if (cancelled) return;
      // "thinking" blinks slower + more often (contemplative feel)
      const isThinking = currentAction.current === 'thinking';
      const delay = isThinking ? 1800 + Math.random() * 1200 : 3000 + Math.random() * 2500;
      setTimeout(() => {
        if (cancelled) return;
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), isThinking ? 220 : 140);
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
    return () => { cancelled = true; };
  }, []);

  useFrame((frameState, delta) => {
    if (!groupRef.current || !headGroupRef.current) return;

    const action = currentAction.current;
    const elapsed = frameState.clock.elapsedTime;

    // ─── Position + scale lerp (world position of whole robot) ────────
    groupRef.current.position.lerp(targetPos.current, Math.min(delta * 3, 1));
    const curS = groupRef.current.scale.x;
    const newS = curS + (targetScale.current - curS) * Math.min(delta * 3, 1);
    groupRef.current.scale.setScalar(newS);

    // ─── Floating (bob) — intensity varies by action ──────────────────
    let bobSpeed = 1.5;
    let bobAmount = 0.12;
    if (action === 'celebrating' || action === 'waving') {
      bobSpeed = 3;
      bobAmount = 0.25;
    } else if (action === 'thinking') {
      bobSpeed = 1;
      bobAmount = 0.06;
    }
    const bobY = Math.sin(elapsed * bobSpeed) * bobAmount;
    // Apply bob relative to the group's current animated Y (add on top of lerped position)
    groupRef.current.position.y = targetPos.current.y + bobY;

    // ─── Head rotation — action-dependent ─────────────────────────────
    let targetRotX = 0, targetRotY = 0;

    if (action === 'tracking' && mousePos?.current) {
      targetRotY = mousePos.current.x * 0.5;
      targetRotX = mousePos.current.y * 0.3;
    } else if (action === 'scanning') {
      targetRotY = Math.sin(elapsed * 0.5) * 0.4;
      targetRotX = -0.05;
    } else if (ACTION_ROTATIONS[action]) {
      targetRotX = ACTION_ROTATIONS[action].x;
      targetRotY = ACTION_ROTATIONS[action].y;
    } else if (action === 'celebrating') {
      // Head bobbles side-to-side excited
      targetRotY = Math.sin(elapsed * 4) * 0.15;
      targetRotX = -Math.abs(Math.sin(elapsed * 4)) * 0.1;
    } else if (action === 'thinking') {
      targetRotY = 0.25;   // head tilted right (chin scratch feel)
      targetRotX = 0.15;   // slightly down
    } else if (action === 'waving') {
      targetRotY = Math.sin(elapsed * 3) * 0.2;
    }

    headGroupRef.current.rotation.y += (targetRotY - headGroupRef.current.rotation.y) * 0.08;
    headGroupRef.current.rotation.x += (targetRotX - headGroupRef.current.rotation.x) * 0.08;

    // ─── Eye positions — track cursor only in "tracking" action ───────
    if (action === 'tracking' && mousePos?.current) {
      const eyeOffX = mousePos.current.x * 0.08;
      const eyeOffY = -mousePos.current.y * 0.06;
      [leftEyeRef, rightEyeRef].forEach((ref, i) => {
        if (!ref.current) return;
        const baseX = i === 0 ? -0.28 : 0.28;
        ref.current.position.x = baseX + eyeOffX;
        ref.current.position.y = 0.05 + eyeOffY;
      });
    } else {
      // Return eyes to center
      [leftEyeRef, rightEyeRef].forEach((ref, i) => {
        if (!ref.current) return;
        const baseX = i === 0 ? -0.28 : 0.28;
        ref.current.position.x += (baseX - ref.current.position.x) * 0.1;
        ref.current.position.y += (0.05 - ref.current.position.y) * 0.1;
      });
    }

    // Blink = squish eyes vertically
    [leftEyeRef, rightEyeRef].forEach((ref) => {
      if (!ref.current) return;
      ref.current.scale.y = isBlinking ? 0.1 : 1;
    });

    // ─── Antenna pulse — brightness/speed varies by action ────────────
    if (antennaBulbRef.current) {
      let pulseSpeed = 3;
      let pulseMax = 3;
      if (action === 'celebrating' || action === 'waving') {
        pulseSpeed = 6;
        pulseMax = 5;
      } else if (action === 'thinking') {
        pulseSpeed = 1;
        pulseMax = 1.5;
      }
      const t = elapsed * pulseSpeed;
      const pulse = (Math.sin(t) + 1) / 2;
      antennaBulbRef.current.material.emissiveIntensity = 1 + pulse * pulseMax;
      antennaBulbRef.current.scale.setScalar(1 + pulse * 0.2);
    }
  });

  return (
    <group ref={groupRef} position={state.pos} scale={state.scale}>
      <group ref={headGroupRef}>
        {/* Head body */}
        <RoundedBox args={[1.8, 1.6, 1.4]} radius={0.35} smoothness={4}>
          <meshStandardMaterial color="#4f46e5" roughness={0.4} metalness={0.3} />
        </RoundedBox>

        {/* Screen inset */}
        <mesh position={[0, 0, 0.71]}>
          <planeGeometry args={[1.4, 1.1]} />
          <meshBasicMaterial color="#050510" />
        </mesh>
        {/* Screen glow */}
        <mesh position={[0, 0, 0.705]}>
          <planeGeometry args={[1.5, 1.2]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.15} depthWrite={false} />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.28, 0.05, 0.72]}>
          <circleGeometry args={[0.11, 32]} />
          <meshBasicMaterial color="#a5b4fc" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.28, 0.05, 0.72]}>
          <circleGeometry args={[0.11, 32]} />
          <meshBasicMaterial color="#a5b4fc" />
        </mesh>

        {/* Mouth */}
        <mesh position={[0, -0.35, 0.72]}>
          <planeGeometry args={[0.4, 0.04]} />
          <meshBasicMaterial color="#4338ca" />
        </mesh>

        {/* Antenna */}
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
          <meshStandardMaterial color="#3730a3" roughness={0.5} />
        </mesh>
        <mesh ref={antennaBulbRef} position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#c7d2fe" emissive="#818cf8" emissiveIntensity={2} roughness={0.2} />
        </mesh>

        {/* Ears */}
        <RoundedBox args={[0.15, 0.4, 0.4]} radius={0.06} smoothness={3} position={[-0.95, 0, 0]}>
          <meshStandardMaterial color="#4338ca" roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[0.15, 0.4, 0.4]} radius={0.06} smoothness={3} position={[0.95, 0, 0]}>
          <meshStandardMaterial color="#4338ca" roughness={0.5} />
        </RoundedBox>

        {/* Neck */}
        <RoundedBox args={[0.6, 0.3, 0.5]} radius={0.1} smoothness={3} position={[0, -1.05, 0]}>
          <meshStandardMaterial color="#3730a3" roughness={0.5} />
        </RoundedBox>
      </group>
    </group>
  );
}
