'use client';

/**
 * Shared shell for long-form legal documents (privacy, terms, cookies).
 * Renders eyebrow + title + meta + intro banner + children (numbered sections).
 * All heavy content lives in the page files.
 */
export default function LegalDoc({ eyebrow, title, updated, appliesTo, intro, children, disclaimer }) {
  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-8 text-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 30% at 50% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
          }}
        />
        <div className="container-narrow max-w-3xl relative z-10">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-white">
            {title}
          </h1>
          <p className="mt-6 text-xs text-white/45 font-mono">
            Last updated: {updated}
            {appliesTo && <> &middot; {appliesTo}</>}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="container-narrow max-w-3xl pb-24">
        {intro && (
          <div className="border-l-2 border-brand-500/40 pl-6 mb-14 text-sm text-white/60 leading-relaxed">
            {intro}
          </div>
        )}
        <div className="space-y-12 text-sm leading-relaxed">
          {children}
        </div>
        {disclaimer && (
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-xs text-white/40 leading-relaxed">{disclaimer}</p>
          </div>
        )}
      </section>
    </main>
  );
}

/**
 * A single numbered section in a legal document. Just gives you a themed heading
 * and lets children flow underneath.
 */
export function LegalSection({ number, title, children }) {
  return (
    <section>
      <h2 className="font-display font-bold text-lg md:text-xl text-white mb-3">
        {number ? `${number}. ${title}` : title}
      </h2>
      <div className="text-white/60 space-y-3">{children}</div>
    </section>
  );
}
