import LegalDoc, { LegalSection } from '../../../components/ui/LegalDoc';
import FooterMini from '../../../components/ui/FooterMini';

export const metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <>
      <LegalDoc
        eyebrow="TERMS & CONDITIONS"
        title="The rules of engagement between you and Xavier."
        updated="August 23, 2026"
        appliesTo="Effective for all SlovX accounts"
        intro={<>
          These Terms & Conditions ("Terms") govern access to and use of the SlovX platform and its autonomous AI agent,
          Xavier ("Service"), operated by SlovX ("SlovX," "we," "us," or "our"). By creating an account, starting a trial,
          or otherwise using the Service, you ("Customer," "you") agree to be bound by these Terms. If you do not agree,
          do not use the Service.
        </>}
        disclaimer="This document is a general-purpose template and does not constitute legal advice. Bracketed fields (e.g. jurisdiction, notice periods, contact details) must be completed, and this document should be reviewed by a qualified lawyer familiar with your operating jurisdiction and industry before publication."
      >
        <LegalSection number={1} title="Eligibility & Account Registration">
          <p>
            You must be at least 18 years old and authorized to act on behalf of the business you register to use the
            Service. You are responsible for the accuracy of the information you provide and for maintaining the
            confidentiality of your account credentials, API tokens, and connected WhatsApp Business Account.
          </p>
        </LegalSection>

        <LegalSection number={2} title="Nature of the Service — Automated & AI-Driven">
          <p>
            The Service uses artificial intelligence, including large language models, to generate automated responses,
            qualify leads, and perform actions such as calendar scheduling on your behalf. You acknowledge that:
          </p>
          <ul className="list-disc list-outside ml-5 space-y-2">
            <li>AI-generated output is probabilistic and may occasionally be inaccurate, incomplete, or contextually imperfect, notwithstanding the safeguards described in Section 3.</li>
            <li>You remain responsible for reviewing the configuration you provide (pricing, policies, product details) and for supervising the Service's output as part of your ordinary business practice.</li>
            <li>The Service is a business tool, not a substitute for professional legal, financial, or compliance advice.</li>
          </ul>
        </LegalSection>

        <LegalSection number={3} title="Guardrails & Configuration Boundaries">
          <p>
            Xavier is designed to reference only the pricing, policies, and information you configure in your account
            ("Company Configuration"), and includes automated checks intended to reduce the likelihood of it stating
            pricing or terms outside that configuration. These checks are a risk-reduction measure, not a guarantee of
            error-free output. You agree to review and keep your Company Configuration accurate and current, as outdated
            configuration is a common source of incorrect automated responses.
          </p>
        </LegalSection>

        <LegalSection number={4} title="Third-Party Platforms & Integrations">
          <p>
            The Service integrates with third-party platforms, including but not limited to WhatsApp Business (Meta),
            Google Calendar, Google Sheets, and any CRM systems you connect. Your use of these integrations is also subject
            to each third party's own terms of service and policies. SlovX is not responsible for outages, policy changes,
            rate limits, or account actions taken by these third-party providers. Where a platform (such as Meta) requires
            specific compliance behavior (e.g., messaging window rules, opt-out handling), the Service includes automated
            mechanisms designed to support that compliance, but ultimate responsibility for compliant use of your business
            messaging account remains yours.
          </p>
        </LegalSection>

        <LegalSection number={5} title="Subscription, Fees & Billing">
          <p>
            Subscription fees are billed in advance on a recurring basis (monthly or as otherwise stated at purchase) and
            are based on the plan tier and usage limits selected. Fees are non-refundable except where required by applicable
            law or expressly stated otherwise at the time of purchase. We may change pricing for future billing cycles with
            advance notice as described in Section 14.
          </p>
          <p>
            Payments are processed by Paddle.com Market Limited, acting as our authorized reseller and Merchant of Record.
            This means Paddle is the seller of record for your subscription, handles payment processing, applicable sales
            tax/VAT/GST collection and remittance, and appears as the merchant on your card or bank statement. Your payment
            details are held by Paddle, not by SlovX directly — see our Privacy Policy for how this data is shared. Paddle's
            own terms of service and privacy policy also apply to the payment transaction itself.
          </p>
          <p>
            For any billing question, failed payment, or refund request, contact{' '}
            <a href="mailto:billing@slovx.com" className="text-brand-400 hover:text-brand-300">billing@slovx.com</a> —
            we will coordinate directly with Paddle on your behalf rather than requiring you to resolve it yourself.
          </p>
        </LegalSection>

        <LegalSection number={6} title="Free Trial">
          <p>
            Where offered, a free trial period is provided at SlovX's discretion and may be modified, limited, or
            discontinued at any time without notice. Continued use of the Service after the trial period ends will be
            billed according to the plan selected at signup, unless cancelled prior to the trial's expiration.
          </p>
        </LegalSection>

        <LegalSection number={7} title="Cancellation & Termination">
          <p>
            You may cancel your subscription at any time through your dashboard; cancellation takes effect at the end of
            the current billing cycle unless stated otherwise. SlovX may suspend or terminate access to the Service, with
            or without notice, for conduct that violates these Terms, applicable law, or the policies of any integrated
            third-party platform.
          </p>
        </LegalSection>

        <LegalSection number="7A" title="Refund Policy">
          <p>
            Because payments are processed through our Merchant of Record, Paddle, refund requests are reviewed jointly
            by SlovX and Paddle. To request a refund, contact{' '}
            <a href="mailto:billing@slovx.com" className="text-brand-400 hover:text-brand-300">billing@slovx.com</a> with
            your account email and the reason for your request within 14 days of the charge. Approved refunds are issued
            to the original payment method and may take 5–10 business days to appear, depending on your bank or card provider.
            Partial-period usage, promotional pricing, and Enterprise custom agreements may be subject to different refund
            terms as stated at the time of purchase.
          </p>
        </LegalSection>

        <LegalSection number={8} title="Acceptable Use">
          <p>
            You agree not to use the Service to: send unsolicited messages in violation of applicable messaging or
            anti-spam laws; harass, deceive, or defraud any person; transmit unlawful, infringing, or harmful content;
            attempt to reverse-engineer, disrupt, or gain unauthorized access to the Service's infrastructure; or use the
            Service in a manner that violates the terms of any connected third-party platform.
          </p>
        </LegalSection>

        <LegalSection number={9} title="Data Handling">
          <p>
            Customer and lead data submitted through the Service is processed in order to provide the Service's
            functionality (conversation handling, lead storage, scheduling, and reporting). Data in transit between your
            systems and SlovX's infrastructure is encrypted using industry-standard protocols (HTTPS/TLS). Further detail
            on data handling practices is provided in our separate Privacy Policy, which forms part of these Terms by reference.
          </p>
        </LegalSection>

        <LegalSection number={10} title="Intellectual Property">
          <p>
            SlovX retains all rights, title, and interest in and to the Service, including its underlying software,
            architecture, and branding. You retain all rights to your own business data, content, and Company Configuration
            submitted to the Service. You grant SlovX a limited license to process that data solely for the purpose of
            providing the Service to you.
          </p>
        </LegalSection>

        <LegalSection number={11} title="Disclaimer of Warranties">
          <p className="uppercase text-xs tracking-wide text-white/55">
            The Service is provided "as is" and "as available." To the maximum extent permitted by applicable law, SlovX
            disclaims all warranties of any kind, whether express, implied, or statutory, including warranties of
            merchantability, fitness for a particular purpose, and non-infringement. SlovX does not warrant that the Service
            will be uninterrupted, error-free, or that AI-generated output will be accurate in every instance.
          </p>
        </LegalSection>

        <LegalSection number={12} title="Limitation of Liability">
          <p className="uppercase text-xs tracking-wide text-white/55">
            To the maximum extent permitted by applicable law, SlovX shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits, revenue, data, or business opportunity,
            arising out of or related to your use of the Service, including any reliance on AI-generated output. SlovX's
            total aggregate liability for any claim arising from these Terms shall not exceed the fees paid by you to SlovX
            in the three (3) months preceding the event giving rise to the claim.
          </p>
        </LegalSection>

        <LegalSection number={13} title="Indemnification">
          <p>
            You agree to indemnify and hold SlovX harmless from any claims, damages, liabilities, and expenses (including
            reasonable legal fees) arising from your use of the Service, your Company Configuration content, or your
            violation of these Terms or applicable law.
          </p>
        </LegalSection>

        <LegalSection number={14} title="Changes to These Terms">
          <p>
            We may update these Terms from time to time. Material changes will be communicated via the dashboard or the
            email associated with your account at least 14 days before taking effect. Continued use of the Service after
            changes take effect constitutes acceptance of the revised Terms.
          </p>
        </LegalSection>

        <LegalSection number={15} title="Governing Law">
          <p>
            These Terms are governed by the laws of [INSERT JURISDICTION], without regard to its conflict-of-law principles.
            Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in
            [INSERT JURISDICTION].
          </p>
        </LegalSection>

        <LegalSection number={16} title="Contact">
          <p>
            Questions about these Terms can be directed to{' '}
            <a href="mailto:legal@slovx.com" className="text-brand-400 hover:text-brand-300">legal@slovx.com</a>. For
            billing, payment, or refund issues specifically, contact{' '}
            <a href="mailto:billing@slovx.com" className="text-brand-400 hover:text-brand-300">billing@slovx.com</a>.
          </p>
        </LegalSection>
      </LegalDoc>
      <FooterMini />
    </>
  );
}
