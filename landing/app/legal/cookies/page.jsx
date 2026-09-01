import LegalDoc, { LegalSection } from '../../../components/ui/LegalDoc';
import FooterMini from '../../../components/ui/FooterMini';

export const metadata = { title: 'Cookie Policy' };

const COOKIE_TABLE = [
  { cat: 'Strictly Necessary',        purpose: 'Session security, login state, load balancing',                       disable: 'No'  },
  { cat: 'Functional',                purpose: 'Remembering preferences (e.g. selected pricing tier view)',           disable: 'Yes' },
  { cat: 'Analytics',                 purpose: 'Understanding aggregate site usage to improve the website',           disable: 'Yes' },
  { cat: 'Marketing / Conversion',    purpose: 'Measuring campaign performance, attribution for signups',             disable: 'Yes' },
];

export default function CookiesPage() {
  return (
    <>
      <LegalDoc
        eyebrow="WEBSITE TRACKING & COOKIE POLICY"
        title="What we track on SlovX.com, and why."
        updated="August 23, 2026"
        appliesTo="Applies to SlovX.com only (not WhatsApp conversations with Xavier)"
        intro={<>
          This policy explains how SlovX uses cookies and similar tracking technologies on our public website (SlovX.com),
          including our pricing pages and onboarding flow. It is separate from our Privacy Policy, which covers how we
          handle data within the Xavier product itself.
        </>}
        disclaimer="This document is a general-purpose template. Depending on your jurisdiction (e.g. EU/UK ePrivacy rules requiring a cookie-consent banner with granular opt-in), you may need to implement an active consent mechanism on SlovX.com, not just a disclosure page."
      >
        <LegalSection number={1} title="What Are Cookies">
          <p>
            Cookies are small text files stored on your device when you visit a website. They allow a site to recognize
            your browser across visits and are used broadly across the web for functionality, analytics, and marketing
            purposes.
          </p>
        </LegalSection>

        <LegalSection number={2} title="Categories of Cookies We Use">
          <div className="mt-4 overflow-x-auto rounded-lg border border-white/5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ink-800/60">
                  <th className="text-left px-4 py-3 text-[10px] font-mono tracking-wider text-white/40 font-normal">Category</th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono tracking-wider text-white/40 font-normal">Purpose</th>
                  <th className="text-left px-4 py-3 text-[10px] font-mono tracking-wider text-white/40 font-normal">Can be disabled?</th>
                </tr>
              </thead>
              <tbody>
                {COOKIE_TABLE.map((row) => (
                  <tr key={row.cat} className="border-t border-white/5">
                    <td className="px-4 py-3 text-white/85 font-medium">{row.cat}</td>
                    <td className="px-4 py-3 text-white/60">{row.purpose}</td>
                    <td className="px-4 py-3 text-white/60">{row.disable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </LegalSection>

        <LegalSection number={3} title="Conversion & Attribution Tracking">
          <p>
            When you interact with our advertising campaigns (e.g. a social media ad) and later sign up on SlovX.com, we
            may use conversion-tracking technologies to understand which campaigns led to signups. This data is used in
            aggregate for marketing performance analysis and is not used to personalize the content of your WhatsApp
            conversations with Xavier.
          </p>
        </LegalSection>

        <LegalSection number={4} title="Third-Party Cookies">
          <p>
            Some cookies on our website may be set by third-party services we use for analytics or advertising measurement.
            These third parties have their own privacy and cookie policies, which we encourage you to review.
          </p>
        </LegalSection>

        <LegalSection number={5} title="Managing Your Preferences">
          <p>
            You can manage or withdraw consent for non-essential cookies at any time via the cookie preferences control on
            our website, or by adjusting your browser settings to block or delete cookies. Disabling strictly necessary
            cookies may affect core site functionality, such as staying logged into your dashboard.
          </p>
        </LegalSection>

        <LegalSection number={6} title="Do Not Track Signals">
          <p>
            Some browsers offer a "Do Not Track" signal. Because there is no unified industry standard for responding to
            these signals, our website does not currently alter its behavior in response to them; you can still manage
            tracking directly through the cookie preferences control described above.
          </p>
        </LegalSection>

        <LegalSection number={7} title="Changes to This Policy">
          <p>
            We may update this policy periodically to reflect changes in the tracking technologies we use or applicable
            legal requirements. The "Last updated" date at the top of this page reflects the most recent revision.
          </p>
        </LegalSection>

        <LegalSection number={8} title="Contact">
          <p>
            Questions about this policy can be directed to{' '}
            <a href="mailto:privacy@slovx.com" className="text-brand-400 hover:text-brand-300">privacy@slovx.com</a>.
          </p>
        </LegalSection>
      </LegalDoc>
      <FooterMini />
    </>
  );
}
