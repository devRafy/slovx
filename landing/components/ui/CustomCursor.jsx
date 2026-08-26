'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Custom cursor: a small solid dot that follows the pointer, plus a larger
 * ring that lags behind (spring physics) for a "trailing" feel.
 *
 * Ring expands on interactive elements (a, button, [role=button], input).
 * Uses `mix-blend-mode: difference` on the dot so it inverts through content.
 * Hidden on touch devices (they don't need a cursor).
 *
 * All translation via requestAnimationFrame → transform: translate3d for GPU speed.
 * Zero re-renders during movement.
 */
export default function CustomCursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Skip entirely on touch devices — no cursor to render
    const touch = window.matchMedia('(hover: none)').matches;
    setIsTouch(touch);
    if (touch) return;

    let dotX = -100, dotY = -100;    // dot follows exactly
    let ringX = -100, ringY = -100;  // ring lags behind for spring feel
    let mouseX = -100, mouseY = -100;
    let hovering = false;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) setVisible(true);
    };

    const onOver = (e) => {
      const interactive = e.target.closest('a, button, input, textarea, [role="button"]');
      const nowHovering = !!interactive;
      if (nowHovering !== hovering) {
        hovering = nowHovering;
        if (ringRef.current) {
          ringRef.current.style.width  = hovering ? '48px' : '32px';
          ringRef.current.style.height = hovering ? '48px' : '32px';
          ringRef.current.style.backgroundColor = hovering
            ? 'rgba(99, 102, 241, 0.15)'
            : 'transparent';
          ringRef.current.style.borderColor = hovering
            ? 'rgba(165, 180, 252, 0.8)'
            : 'rgba(255, 255, 255, 0.4)';
        }
      }
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    // rAF loop — dot snaps to pointer, ring eases toward it
    const tick = () => {
      dotX = mouseX;
      dotY = mouseY;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX - 4}px, ${dotY - 4}px, 0)`;
      }
      if (ringRef.current) {
        // Ring is centered on its own size, which changes on hover, so compute half
        const half = ringRef.current.offsetWidth / 2;
        ringRef.current.style.transform = `translate3d(${ringX - half}px, ${ringY - half}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      cancelAnimationFrame(rafId);
    };
  }, [visible]);

  if (isTouch) return null;

  return (
    <>
      {/* Solid dot — snaps to pointer, mix-blend for inversion effect */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          opacity: visible ? 1 : 0,
          mixBlendMode: 'difference',
          transition: 'opacity 200ms',
        }}
        className="pointer-events-none fixed top-0 left-0 z-[9999] w-2 h-2 rounded-full bg-white"
      />
      {/* Ring — trails behind with spring easing */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms, width 200ms ease, height 200ms ease, background-color 200ms ease, border-color 200ms ease',
        }}
        className="pointer-events-none fixed top-0 left-0 z-[9998] w-8 h-8 rounded-full border border-white/40"
      />
    </>
  );
}
