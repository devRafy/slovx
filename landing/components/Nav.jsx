'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, Menu, X } from 'lucide-react';
import { nav } from '../lib/content';

/**
 * Fixed top nav. Backdrop starts transparent, gains blur + border on scroll.
 * Mobile: hamburger → full-screen drawer.
 * Uses Next Link for real navigation between /about, /architecture, /contact.
 * Hash links (/#pricing) are handled by native browser + Next router.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while mobile drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Auto-close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Highlight current-route link — guard against usePathname returning null during SSR
  const isActive = (href) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Plain <header> with a CSS keyframe entry animation.
          Avoiding framer-motion here so server + client render identical HTML → no hydration mismatch. */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 animate-nav-in ${
          scrolled
            ? 'bg-ink-950/70 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <div className="container-narrow flex items-center justify-between h-16">
          {/* Logo → home */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/60 transition-shadow">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">Xavier</span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    active ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://frontend-pi-pearl-81.vercel.app/login"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {nav.ctaSignIn}
            </a>
            <a
              href="https://frontend-pi-pearl-81.vercel.app/register"
              className="text-sm px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium transition-colors shadow-lg shadow-brand-500/25"
            >
              {nav.ctaStart}
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2 text-white/80 hover:text-white"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer — plain div w/ CSS fade to avoid hydration edge cases */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden bg-ink-950/95 backdrop-blur-xl pt-24 px-6 animate-fade-in">
          <nav className="flex flex-col gap-6 text-lg">
            {nav.links.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors ${active ? 'text-white' : 'text-white/70 hover:text-white'}`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-3">
              <a
                href="https://frontend-pi-pearl-81.vercel.app/login"
                className="text-white/70 hover:text-white transition-colors"
              >
                {nav.ctaSignIn}
              </a>
              <a
                href="https://frontend-pi-pearl-81.vercel.app/register"
                className="text-center px-4 py-3 rounded-lg bg-brand-600 text-white font-medium"
              >
                {nav.ctaStart}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
