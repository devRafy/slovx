import Hero        from '../components/sections/Hero';
import TrustedBy   from '../components/sections/TrustedBy';
import HowItWorks  from '../components/sections/HowItWorks';
import Features    from '../components/sections/Features';
import AiInAction  from '../components/sections/AiInAction';
import Security    from '../components/sections/Security';
import Pricing     from '../components/sections/Pricing';
import Faq         from '../components/sections/Faq';
import CtaFooter   from '../components/sections/CtaFooter';

/**
 * Main landing page. Sections use pure CSS for smooth scroll + gradient
 * bridges between backgrounds (see .snap-section rules in globals.css).
 */
export default function Page() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <HowItWorks />
      <Features />
      <AiInAction />
      <Security />
      <Pricing />
      <Faq />
      <CtaFooter />
    </>
  );
}
