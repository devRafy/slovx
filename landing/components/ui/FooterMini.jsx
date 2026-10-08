import Link from 'next/link';
import { footer } from '../../lib/content';
import SocialLinks from './SocialLinks';

/**
 * Lightweight footer for inner pages (About, Architecture, Contact).
 * Same content structure as the homepage footer but without the massive CTA section above it.
 * Kept as its own component so inner pages don't drag in the giant CtaFooter that includes a Globe canvas.
 */
export default function FooterMini() {
  return (
    <footer className="relative border-t border-white/5 bg-ink-950/80 mt-24">
      <div className="container-narrow py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10">
          {/* Brand block */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4" aria-label="SlovX home">
              <img src="/logo-light.png" alt="SlovX" width="74" height="48" className="h-12 w-auto" />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {footer.tagline}
            </p>
            <SocialLinks />
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">{footer.copyright}</p>
          <p className="text-xs text-white/40">
            Built with <span className="text-brand-400">Xavier</span> · Powered by Meta Cloud API
          </p>
        </div>
      </div>
    </footer>
  );
}
