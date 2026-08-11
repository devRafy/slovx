import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <LegalHeader />
      <main className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: August 09, 2026</p>

        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-8 text-gray-700 leading-relaxed">
          <Section title="1. Introduction">
            <p>
              Xavier ("we", "our", "the Service") provides an AI-powered WhatsApp sales assistant
              that helps businesses automate customer conversations. This Privacy Policy explains
              what data we collect, how we use it, and the choices you have.
            </p>
            <p>
              By using Xavier, you agree to the collection and use of information in accordance
              with this policy.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p className="font-medium text-gray-900">From businesses using Xavier (subscribers):</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Account details: name, email address, hashed password</li>
              <li>Business configuration: company name, industry, products, pricing, policies, timezone</li>
              <li>WhatsApp Business Account credentials (access tokens are encrypted at rest using AES-256)</li>
              <li>WhatsApp Business phone number and display name</li>
            </ul>

            <p className="font-medium text-gray-900 mt-4">From end customers messaging your business:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>WhatsApp phone number</li>
              <li>Message content sent to your WhatsApp Business number</li>
              <li>Conversation metadata (timestamps, message status, delivery receipts)</li>
              <li>Inferred data: buying intent scores, sentiment, lead qualification status</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Data">
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide the AI sales assistant service — generating context-appropriate replies</li>
              <li>To route messages between end customers and your WhatsApp Business number via Meta's WhatsApp Cloud API</li>
              <li>To surface leads, analytics, and insights in your Xavier dashboard</li>
              <li>To detect safety issues (spam, policy violations) via our guardrail system</li>
              <li>To improve our AI models (only aggregated, anonymized patterns — never individual messages)</li>
              <li>To communicate service updates and respond to support requests</li>
            </ul>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We share data only with the following processors, strictly to provide the Service:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>
                <span className="font-medium">Meta Platforms, Inc.</span> — WhatsApp message delivery
                via the WhatsApp Cloud API. Subject to Meta's own privacy policies.
              </li>
              <li>
                <span className="font-medium">Anthropic PBC</span> — AI text generation via the Claude
                API. Message content is transmitted for processing; Anthropic does not train on this data.
              </li>
              <li>
                <span className="font-medium">Supabase Inc.</span> — encrypted database hosting for
                your account and conversation data.
              </li>
            </ul>
            <p className="mt-2">
              We do not sell your data or the data of your customers to any third party for any reason.
            </p>
          </Section>

          <Section title="5. Data Security">
            <ul className="list-disc pl-6 space-y-1">
              <li>All WhatsApp access tokens are encrypted using AES-256 before storage</li>
              <li>Passwords are hashed with bcrypt (cost factor 12)</li>
              <li>All API traffic is protected via TLS 1.2+ (HTTPS)</li>
              <li>Access to production data is restricted to authorized engineers</li>
              <li>Refresh tokens are rotated on every use</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your account and business data for as long as your Xavier subscription is
              active, plus 30 days after cancellation to allow recovery. Conversation data is retained
              for 12 months by default; you may request earlier deletion via the dashboard or by
              contacting support.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Access all personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your account and all associated data</li>
              <li>Export your data in a machine-readable format</li>
              <li>Withdraw consent by disconnecting your WhatsApp Business number and closing your account</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, email us at the address below.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Xavier is a business tool and is not intended for use by individuals under 18. We do not
              knowingly collect personal information from children.
            </p>
          </Section>

          <Section title="9. International Data Transfers">
            <p>
              Your data may be stored and processed in regions outside your country of residence,
              including servers operated by our sub-processors in the United States and European Union.
              We rely on standard contractual clauses for cross-border transfers.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this policy from time to time. Material changes will be communicated by
              email to your registered address at least 14 days before taking effect.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              Questions about this policy or your data? Reach us at:
            </p>
            <p className="mt-2">
              <span className="font-medium">Email:</span> privacy@slovx.com
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
