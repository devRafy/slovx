import Hero        from '../components/sections/Hero';
import TrustedBy   from '../components/sections/TrustedBy';
import HowItWorks  from '../components/sections/HowItWorks';
import Features    from '../components/sections/Features';
import AiInAction  from '../components/sections/AiInAction';
import Pricing     from '../components/sections/Pricing';
import Faq         from '../components/sections/Faq';
import CtaFooter   from '../components/sections/CtaFooter';

/**
 * Main landing page. Each section is a self-contained client component.
 * Server-rendered where possible for SEO, hydrates for animations.
 */
export default function Page() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <Features />
      <AiInAction />
      <Pricing />
      <Faq />
      <CtaFooter />
    </>
  );
}
