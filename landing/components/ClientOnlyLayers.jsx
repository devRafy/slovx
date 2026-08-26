'use client';

import dynamic from 'next/dynamic';

// Client-only overlays. Rendering these on the server would cause hydration
// mismatches (Three.js canvas, cursor position, etc.), so we defer them.

const CustomCursor = dynamic(() => import('./ui/CustomCursor'), { ssr: false });

export default function ClientOnlyLayers() {
  return <CustomCursor />;
}
