import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LegalHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 09, 2026</p>

        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8 text-gray-700 leading-relaxed">
          <Section title="1. Agreement">
            <p>
              These Terms of Service ("Terms") govern your access to and use of Xavier ("the Service"),
              operated by SlovX ("we", "our"). By creating an account or using the Service, you agree
              to be bound by these Terms.
            </p>
            <p>
              If you are using Xavier on behalf of a company or other legal entity, you represent that
              you have the authority to bind that entity to these Terms.
            </p>
          </Section>

          <Section title="2. Description of the Service">
            <p>
              Xavier is an AI-powered platform that integrates with the WhatsApp Business Platform to
              automate customer conversations for businesses. Features include AI-generated replies,
              lead management, conversation analytics, and safety guardrails.
            </p>
          </Section>

          <Section title="3. Account Registration">
            <ul className="list-disc pl-6 space-y-1">
              <li>You must provide accurate, complete information when creating your account</li>
              <li>You are responsible for maintaining the confidentiality of your credentials</li>
              <li>You are responsible for all activity that occurs under your account</li>
              <li>You must notify us immediately of any unauthorized access</li>
              <li>You must be at least 18 years old and legally capable of entering contracts</li>
            </ul>
          </Section>

          <Section title="4. WhatsApp Business Platform">
            <p>
              To use Xavier, you must connect a WhatsApp Business Account you own or are authorized
              to operate. By doing so, you also agree to comply with:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>The WhatsApp Business Solution Terms</li>
              <li>The WhatsApp Business Messaging Policy</li>
              <li>Meta's Commerce Policies (where applicable)</li>
            </ul>
            <p className="mt-2">
              You are responsible for ensuring all messages sent through your connected number comply
              with these policies. Xavier is not liable for suspensions, restrictions, or bans imposed
              on your WhatsApp Business Account by Meta.
            </p>
          </Section>

          <Section title="5. Acceptable Use">
            <p>You agree NOT to use Xavier to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Send spam, unsolicited marketing, or bulk unsolicited messages</li>
              <li>Distribute illegal, harmful, defamatory, obscene, or fraudulent content</li>
              <li>Impersonate any person, business, or entity</li>
              <li>Engage in phishing, scams, or deceptive practices</li>
              <li>Attempt to reverse-engineer, decompile, or extract source code</li>
              <li>Interfere with, disrupt, or overload the Service's infrastructure</li>
              <li>Circumvent rate limits, security measures, or access controls</li>
              <li>Use the Service to build or train competing AI models</li>
              <li>Violate any applicable law or regulation</li>
            </ul>
            <p className="mt-2">
              We reserve the right to suspend or terminate your account for violations without notice.
            </p>
          </Section>

          <Section title="6. AI-Generated Content">
            <p>
              Xavier uses large language models to generate responses to customer messages. You
              acknowledge that:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>AI outputs may occasionally be inaccurate, incomplete, or inappropriate</li>
              <li>You are responsible for reviewing and configuring Xavier's business context</li>
              <li>You are ultimately responsible for all messages sent from your WhatsApp number</li>
              <li>Xavier includes guardrails to reduce hallucinations, but no system is perfect</li>
            </ul>
          </Section>

          <Section title="7. Subscription and Payment">
            <p>
              Xavier is offered on a subscription basis. Pricing, billing cycles, and payment terms
              are described on our pricing page or in your subscription agreement. Fees are
              non-refundable except as required by law or expressly stated at time of purchase.
            </p>
            <p>
              We may change pricing with 30 days' notice. If you disagree with pricing changes, you
              may cancel before the change takes effect.
            </p>
          </Section>

          <Section title="8. Intellectual Property">
            <p>
              Xavier, including all software, design, logos, and content (excluding your business data
              and customer messages), is the property of SlovX and protected by copyright, trademark,
              and other intellectual property laws.
            </p>
            <p>
              You retain all rights to your business data, customer conversations, and configuration.
              You grant us a limited license to process this data solely to operate the Service.
            </p>
          </Section>

          <Section title="9. Service Availability">
            <p>
              We strive to maintain high availability but do not guarantee that the Service will be
              uninterrupted or error-free. Scheduled maintenance, third-party outages (Meta, Anthropic,
              Supabase), and unforeseen issues may cause disruptions. We are not liable for indirect
              damages resulting from downtime.
            </p>
          </Section>

          <Section title="10. Termination">
            <p>
              You may cancel your account at any time from the dashboard. We may suspend or terminate
              your account for material breach of these Terms, non-payment, or activity that risks the
              Service or other users.
            </p>
            <p>
              Upon termination, we will delete your data within 30 days, unless retention is required
              by law.
            </p>
          </Section>

          <Section title="11. Disclaimer of Warranties">
            <p>
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
              PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </Section>

          <Section title="12. Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SLOVX SHALL NOT BE LIABLE FOR ANY INDIRECT,
              INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR
              GOODWILL. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS
              PRECEDING THE CLAIM.
            </p>
          </Section>

          <Section title="13. Indemnification">
            <p>
              You agree to indemnify and hold SlovX harmless from any claims, damages, or expenses
              arising from your use of the Service, violation of these Terms, or violation of any
              third-party rights, including Meta's WhatsApp Business policies.
            </p>
          </Section>

          <Section title="14. Governing Law">
            <p>
              These Terms are governed by the laws of Islamic Republic of Pakistan, without regard to
              conflict-of-laws principles. Disputes shall be resolved in the courts of Karachi,
              Pakistan.
            </p>
          </Section>

          <Section title="15. Changes to These Terms">
            <p>
              We may update these Terms occasionally. Material changes will be notified by email at
              least 14 days before taking effect. Continued use of the Service after changes take
              effect constitutes acceptance.
            </p>
          </Section>

          <Section title="16. Contact">
            <p>
              For questions about these Terms, contact:
            </p>
            <p className="mt-2">
              <span className="font-medium">Email:</span> legal@slovx.com
              <br />
              <span className="font-medium">Company:</span> SlovX
            </p>
          </Section>
        </div>

        <LegalFooter />
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-2 text-sm">{children}</div>
    </section>
  );
}

function LegalHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Xavier</span>
        </Link>
        <nav className="flex gap-4 text-sm text-gray-600">
          <Link to="/privacy" className="hover:text-brand-600">Privacy</Link>
          <Link to="/terms" className="hover:text-brand-600">Terms</Link>
          <Link to="/login" className="hover:text-brand-600">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}

function LegalFooter() {
  return (
    <footer className="mt-10 text-center text-xs text-gray-400">
      © {new Date().getFullYear()} SlovX. All rights reserved.
    </footer>
  );
}
