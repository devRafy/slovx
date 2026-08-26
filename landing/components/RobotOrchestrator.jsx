'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import dynamic from 'next/dynamic';

const RobotMascot = dynamic(() => import('./3d/RobotMascot'), { ssr: false });

/**
 * The robot follows the user through the whole scroll journey.
 * It lives inside ONE fixed <Canvas> layered over the page.
 * Which section is currently in view determines the robot's position + behavior.
 *
 * State per section (matches page.jsx section order):
 *   0 Hero       → right side of viewport, tracks cursor
 *   1 TrustedBy  → shrinks to top-right, "scans"
 *   2 HowItWorks → right side, "looks left" toward the steps
 *   3 Features   → left side (opposite the grid), "looks around"
 *   4 AiInAction → left side, "looks right" toward the phone mock
 *   5 Pricing    → top-right small, "celebrates" excitedly
 *   6 FAQ        → right side, "thinks"
 *   7 CTA        → centered, larger, "waves" enthusiastically
 */

// Design principle:
//   • Hero → robot is the star (big, right column of the 2-col hero layout)
//   • All content-heavy sections → robot lives in the TOP-RIGHT corner, small (35%),
//     just peeking — visible enough to feel present, small enough to never cover text/cards
//   • CTA → medium, bottom-right, waving farewell (doesn't fight the Globe backdrop)
//
// Positions are in world coords (camera at z=5, fov 50):
//   x = ±2.8 → viewport edges
//   y = ±1.7 → near top/bottom edges of viewport (leaves ~15% margin)
const TR_CORNER = { pos: [2.8, 1.7, 0], scale: 0.35 };

const SECTION_STATES = [
  // 0 Hero — main character, right side
  { pos: [2.0, 0, 0],    scale: 1.0,  action: 'tracking'      },
  // 1 TrustedBy — top-right corner, scans across logos
  { ...TR_CORNER,        action: 'scanning'                   },
  // 2 HowItWorks — top-right corner, looks left at the 3 steps
  { ...TR_CORNER,        action: 'looking-left'               },
  // 3 Features — top-right (grid extends across viewport, right corner stays clear)
  { ...TR_CORNER,        action: 'scanning'                   },
  // 4 AiInAction — top-right (above the phone mock, empty space there)
  { ...TR_CORNER,        action: 'looking-down'               },
  // 5 Pricing — top-right, excited pulse
  { ...TR_CORNER,        action: 'celebrating'                },
  // 6 FAQ — top-right, contemplative
  { ...TR_CORNER,        action: 'thinking'                   },
  // 7 CTA — bottom-right, medium, waving farewell (Globe stays center-stage behind CTA)
  { pos: [2.5, -1.5, 0], scale: 0.5,  action: 'waving'        },
];

// Inner pages (About, Architecture, Contact) — same corner state, scanning
const CORNER_STATE = { ...TR_CORNER, action: 'scanning' };

const FALLBACK_STATE = SECTION_STATES[0];

export default function RobotOrchestrator() {
  const pathname = usePathname();
  const [sectionIdx, setSectionIdx] = useState(0);
  const [hasSections, setHasSections] = useState(true);  // false on inner pages → use CORNER_STATE
  const [isMobile, setIsMobile] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const ratios = useRef(new Map());

  // Detect mobile — hide robot on small screens (would be too big / distract from content)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track cursor globally so the hero robot's "tracking" action works everywhere
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

  // Watch every .snap-section — figure out which one is most visible.
  // Re-runs on route change so About/Architecture/Contact pages get detected as "no sections".
  useEffect(() => {
    if (isMobile) return;
    // Reset accumulated ratios when we navigate — old refs are stale
    ratios.current = new Map();
    setSectionIdx(0);

    // Delay lets the new page render + hydrate before we query the DOM
    let observer;
    const timeout = setTimeout(() => {
      const sections = document.querySelectorAll('.snap-section');
      if (!sections.length) {
        setHasSections(false);
        return;
      }
      setHasSections(true);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            ratios.current.set(entry.target, entry.intersectionRatio);
          });
          let bestIdx = 0;
          let bestRatio = 0;
          sections.forEach((s, i) => {
            const r = ratios.current.get(s) ?? 0;
            if (r > bestRatio) { bestRatio = r; bestIdx = i; }
          });
          if (bestRatio > 0.3) setSectionIdx(bestIdx);
        },
        { threshold: [0.1, 0.25, 0.5, 0.75, 0.9] },
      );

      sections.forEach((s) => observer.observe(s));
    }, 200);

    return () => {
      clearTimeout(timeout);
      if (observer) observer.disconnect();
    };
  }, [isMobile, pathname]);

  if (isMobile) return null;

  const state = hasSections
    ? (SECTION_STATES[sectionIdx] ?? FALLBACK_STATE)
    : CORNER_STATE;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-20 pointer-events-none"
      style={{
        // Canvas covers the whole viewport but blocks nothing
        contain: 'strict',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]}   intensity={1.2} color="#a5b4fc" />
        <pointLight position={[-5, 3, 2]}  intensity={0.4} color="#4f46e5" />
        <pointLight position={[0, -3, 3]}  intensity={0.3} color="#c7d2fe" />
        <Suspense fallback={null}>
          <RobotMascot state={state} mousePos={mousePos} />
          {/* Sparkles follow the robot around; larger scale so they don't clump */}
          <Sparkles
            count={50}
            scale={8}
            size={2}
            speed={0.35}
            color="#a5b4fc"
            position={state.pos}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
