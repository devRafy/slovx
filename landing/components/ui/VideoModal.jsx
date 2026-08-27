'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Lightbox video player. Renders when `open` is true, calls `onClose` when
 * the user clicks the backdrop, hits ESC, or clicks the X. Video autoplays
 * on open and pauses when the modal closes.
 */
export default function VideoModal({ open, onClose, src, poster }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (open) {
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in p-4 md:p-8"
    >
      <button
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-brand-500/20 border border-white/10"
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          playsInline
          className="w-full h-full object-cover bg-black"
        />
      </div>
    </div>
  );
}
