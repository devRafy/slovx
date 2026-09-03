import PageHero from '../../components/ui/PageHero';
import PricingTiers from '../../components/ui/PricingTiers';
import PricingComparison from '../../components/ui/PricingComparison';
import PricingFaq from '../../components/sections/PricingFaq';
import FooterMini from '../../components/ui/FooterMini';
import { pricing } from '../../lib/content';

export const metadata = {
  title: 'Pricing — Simple plans. Real ROI.',
  description:
    'Assistant, BDR Suite, and Enterprise plans for Xavier. Every plan pays for itself in the first two closed deals. 14-day free trial, no credit card.',
};

export default function PricingPage() {
  return (
    <main>
      <PageHero
        eyebrow={pricing.eyebrow}
        title={pricing.title}
        subtitle={pricing.subtitle}
      />

      {/* Pricing tiers */}
      <section className="container-narrow py-8 md:py-12">
        <PricingTiers />
        <p className="mt-10 text-center text-sm text-white/40">
          14-day free trial · No credit card · Cancel anytime
        </p>
      </section>

      {/* Feature-by-feature comparison table */}
      <PricingComparison />

      {/* Pricing-specific FAQ */}
      <PricingFaq />

      <FooterMini />
    </main>
  );
}
