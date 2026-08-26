'use client';

import dynamic from 'next/dynamic';

// Both of these touch `window` / DOM APIs and hold refs to canvas/DOM elements.
// Rendering them on the server would produce different HTML than the client
// (Three.js canvas structure, cursor position, etc.) which triggers hydration errors.
// This wrapper defers them to the client only.

const CustomCursor       = dynamic(() => import('./ui/CustomCursor'),   { ssr: false });
const RobotOrchestrator  = dynamic(() => import('./RobotOrchestrator'), { ssr: false });

export default function ClientOnlyLayers() {
  return (
    <>
      <CustomCursor />
      <RobotOrchestrator />
    </>
  );
}
