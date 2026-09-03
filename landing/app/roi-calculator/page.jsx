import PageHero from '../../components/ui/PageHero';
import RoiCalculatorBody from '../../components/ui/RoiCalculatorBody';
import FooterMini from '../../components/ui/FooterMini';

export const metadata = {
  title: 'ROI Calculator — See what slow replies really cost',
  description: 'Move the sliders to match your business. See the additional revenue and hours you could reclaim by replying to WhatsApp leads in seconds instead of hours.',
};

export default function RoiCalculatorPage() {
  return (
    <main>
      <PageHero
        eyebrow="SEE THE MATH"
        title="What is slow replying actually costing you?"
        subtitle="Move the sliders to match your business. The numbers update instantly using the same conversion-decay model industry research applies to lead response time."
      />

      <section className="container-narrow max-w-6xl py-8 md:py-12">
        <RoiCalculatorBody ctaHref="/pricing" />
      </section>

      {/* How the math works — brief methodology so numbers feel credible */}
      <section className="container-narrow max-w-3xl py-16 md:py-24">
        <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-6">
          How the math works
        </h2>
        <div className="space-y-4 text-white/60 leading-relaxed text-sm md:text-base">
          <p>
            Industry research on lead response time consistently shows that conversion odds drop
            meaningfully with every hour of delay. This calculator models a{' '}
            <strong className="text-white/85">conservative</strong> version of that curve:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>An 8% baseline conversion rate at instant response.</li>
            <li>A ~9% relative drop in conversion odds per hour of delay.</li>
            <li>A hard cap at 75% relative decay — we never model worse than that.</li>
          </ul>
          <p>
            <strong className="text-white/85">Additional revenue</strong> = the extra deals you'd
            recover by responding instantly instead of at your current reply time, multiplied by
            your average deal value.
          </p>
          <p>
            <strong className="text-white/85">Team hours saved</strong> = your weekly manual reply
            time, extrapolated across the month (weekly × 4.33). Xavier handles the qualification,
            screening, and repetitive replies your team is doing now.
          </p>
          <p className="text-xs text-white/40 pt-4 border-t border-white/5">
            Estimates only. Actual results vary by industry, offer, lead quality, and how you set
            up Xavier's Company Configuration.
          </p>
        </div>
      </section>

      <FooterMini />
    </main>
  );
}
