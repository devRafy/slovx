import { footer } from '../../lib/content';

// lucide-react dropped brand icons, so brand marks are inline SVGs.
const ICONS = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  ),
};

export default function SocialLinks() {
  return (
    <div className="flex items-center gap-3 mt-5">
      {footer.socials.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`SlovX on ${s.label}`}
          className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white/70 hover:text-white hover:border-brand-500/60 hover:bg-brand-500/10 transition-colors"
        >
          {ICONS[s.label]}
        </a>
      ))}
    </div>
  );
}
