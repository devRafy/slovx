// Content for the /platform business showcase page.
// Mirrors the ilovePDF layout: Hero → Trusted → Badges → Platform boxes →
// Stats → Testimonial → Enterprise → Verticals → Partners → Security FAQ → CTA

export const platformHero = {
  eyebrow: 'AI REVENUE AUTOMATION',
  headline: 'Automate your inbound revenue pipeline with',
  brand: 'slovX',
  subhead:
    'A developer-friendly agentic platform that helps you qualify leads, route conversations, and book meetings — so your team can focus on closing.',
  cta: 'Get Started',
  ctaHref: 'https://frontend-pi-pearl-81.vercel.app/register',
};

export const platformTrusted = {
  label: 'Early teams building on slovX',
  logos: ['LOXE', 'Meridian', 'LinkedIn', 'Shopify', 'Veloix', 'Stripe', 'Atlassian', 'HubSpot'],
};

export const platformBadges = {
  eyebrow: 'Built for developer-native workflows and autonomous sales',
  subtitle:
    'Purpose-built for teams that want an agentic platform they can actually reason about — clear routing, honest guardrails, real logs.',
  items: [
    { platform: 'Focus',    label: 'Enterprise Ready',   sub: 'Multi-tenant',  stars: 5 },
    { platform: 'Focus',    label: 'Easy to Adopt',      sub: 'Onboarding',    stars: 5 },
    { platform: 'Focus',    label: 'Fast to Ship',       sub: 'Automation',    stars: 5 },
    { platform: 'Focus',    label: 'Built for Scale',    sub: 'Mid-Market',    stars: 5 },
  ],
};

export const platformBoxes = {
  eyebrow: 'ALL-IN-ONE PLATFORM',
  title: 'Your all-in-one platform for your pipeline needs',
  items: [
    {
      icon: 'GitBranch',
      title: 'One platform to close easily',
      subtitle: 'Route and Enrich',
      bullets: [
        { label: 'Route and Enrich', body: 'Route conversations to and from various agentic nodes (Brain, Audit, Closer) and enrich profiles without losing quality.' },
        { label: 'Track and Gate',   body: 'Add logging, analytics, traces, and watermarks. Merge, queue, and concatenate threads to tailor interactions to your needs.' },
        { label: 'Handover Gating', body: 'Sign logs digitally and request human validation from others, streamlining your approval processes.' },
      ],
    },
    {
      icon: 'TrendingUp',
      title: 'Reshaping profitability for your Business',
      subtitle: 'Easy to use, anywhere',
      bullets: [
        { label: 'Easy to use',   body: 'Navigate effortlessly through a clean, intuitive interface designed for simplicity. Work from any device — desktop, tablet, or mobile.' },
        { label: 'Integrations',  body: 'Connect with WhatsApp, Google Sheets, Google Calendar, and more to keep your pipeline in sync across every tool.' },
      ],
    },
    {
      icon: 'Paintbrush',
      title: 'Custom Interface',
      subtitle: 'Custom Interface Lab Kit',
      bullets: [
        { label: 'Brand Kit',   body: 'Enhance the agentic experience with custom branding baked into your pipeline requests.' },
        { label: 'Templates',   body: 'Develop custom frameworks for scripts, configurations, and parameters to maintain a professional, unified appearance.' },
      ],
    },
    {
      icon: 'ShieldCheck',
      title: 'Stay secure',
      subtitle: 'Security Stay secure',
      bullets: [
        { label: 'Xavier Defense Matrix', body: 'Protect pipelines with advanced security — Structural Input Isolation, Dual-Intent Firewalls, and AES-256 data encryption.' },
        { label: 'Compliance',            body: 'Meet industry standards and regulations with features designed to support asynchronous PII masking requirements.' },
      ],
    },
  ],
  features: [
    { icon: 'Cpu',        label: 'Advanced Pipeline Architecture', body: 'Directly engineer logic and behavioral rules within agentic systems.' },
    { icon: 'Zap',        label: 'High-Throughput Scaling',        body: 'Process complex threads in bulk with Python core.' },
    { icon: 'Network',    label: 'Orchestrated Nodes',             body: 'Speed up conversion velocity by connecting multiple cognitive models together.' },
    { icon: 'Webhook',    label: 'Autonomous Engagement API',       body: 'Automate qualifying and high-ticket gating directly through a robust API.' },
  ],
};

export const platformStats = {
  title: 'What slovX is designed to help you do',
  items: [
    { value: '24/7',   label: 'Always-on inbound coverage'   },
    { value: 'Sub-sec', label: 'FAQ answer cache lookups'    },
    { value: '15+',    label: 'Languages handled natively'   },
    { value: 'AES-256', label: 'Encryption at rest'          },
  ],
};

export const platformTestimonial = {
  quote:
    '"We went into it wanting fewer missed inbound conversations. slovX gave us a way to qualify leads and hand the right ones to our team without them dropping through the cracks."',
  author: 'Marcus Vance',
  role:   'Pilot customer · SaaS operations',
  note:   'Pilot customer feedback',
};

export const platformEnterprise = {
  eyebrow: 'ENTERPRISE',
  title: 'Built with enterprise needs in mind',
  tabs: [
    {
      title: 'Improve conversion velocity',
      bullets: [
        'Coordinate multiple agents to reduce leakage and keep leads warm',
        'Connect Google Sheets and Calendar to sync your existing workflow',
      ],
    },
    {
      title: 'Instrument pipeline execution',
      bullets: [
        'Track pipeline analytics from inbound metrics with structured logs',
        'Route conversations with state-driven flows you can inspect',
      ],
    },
    {
      title: 'Enterprise-grade data isolation',
      bullets: [
        'Encrypt records at rest with AES-256',
        'Support for GDPR, regional policies, and audit-ready logging',
      ],
    },
    {
      title: 'Dedicated infrastructure options',
      bullets: [
        'Isolated deployment with hands-on architecture support',
        'Custom multi-agent sandboxes for tailored enterprise workflows',
      ],
    },
    {
      title: 'Team access and role controls',
      bullets: [
        'Centralize permissions via an interactive dashboard',
        'Assign roles per team member — admin, agent, or read-only',
      ],
    },
    {
      title: 'Automate with the FastAPI backbone',
      bullets: [
        'Integrate via a documented REST API',
        'Trigger downstream tasks from webhook events',
      ],
    },
  ],
};

export const platformVerticals = {
  eyebrow: 'INDUSTRY VERTICALS',
  title: 'How teams in different industries use slovX',
  tabs: [
    {
      label: 'Human Resources',
      title: 'Onboarding Automation',
      items: [
        { label: 'Pipeline Tracking', body: 'HR teams often handle a high volume of candidates — resumes, applications, and profile logs. slovX allows easy screening, profiling, and routing of data, streamlining pipeline tracking.' },
        { label: 'Calendar Syncing',  body: 'The scheduling feature simplifies the interview process by enabling quick and secure booking of candidate appointments and other HR-related meetings.' },
      ],
    },
    {
      label: 'Legal',
      title: 'Interception and Audit',
      items: [
        { label: 'Firewall and Screening', body: 'Partners frequently work with sensitive information. slovX\'s firewall tools help securely intercept inbound data, while the audit feature assists in identifying discrepancies between legal pipeline phases.' },
        { label: 'PII and Trace Logging',  body: 'Legal professionals can use PII masking to convert raw interactions into secure text, facilitating easier tracing and searching within large volumes of legal transactions.' },
      ],
    },
    {
      label: 'Finance',
      title: 'Logic and Analytics',
      items: [
        { label: 'Mathematical Pre-Processing', body: 'Financial analysts often need to validate revenue reports and metrics between incoming text and state engines. The pre-processor module ensures conversions are locked in a deterministic and accessible format.' },
        { label: 'Security and Encryption',     body: 'The masking feature ensures sensitive ledger information remains confidential, and the shielding architecture facilitates secure tracking of financial transactions.' },
      ],
    },
    {
      label: 'Real Estate',
      title: 'Lead Retention and Pipeline Control',
      items: [
        { label: 'Autonomous Closing', body: 'Agency owners can expedite booking for listings and agreements with the autonomous engine. Routing, profiling, and qualifying threads helps manage buyer interactions efficiently.' },
        { label: 'Lead Protection',    body: 'Overrides securely isolate personal communication from agents before sharing tracking data with agency executives, ensuring compliance with retention regulations.' },
      ],
    },
    {
      label: 'Sales',
      title: 'Pipeline and Deal Acceleration',
      items: [
        { label: 'Autonomous Closing',  body: 'The closer node accelerates deal-winning by enabling automated negotiation of sales contracts and proposals. Lead profiling and tracking layers make it easy to tailor target metrics to client needs.' },
        { label: 'Thread Organization', body: 'Queueing and concatenating notifications allows sales teams to compile comprehensive database logs or break large interactions into manageable dashboard sections.' },
      ],
    },
    {
      label: 'Healthcare',
      title: 'Patient Data Security and Auditing',
      items: [
        { label: 'Automated Aggregation',    body: 'Healthcare professionals handle vast amounts of patient data. slovX enables easy aggregation, filtering, and organizing to maintain accurate, up-to-date records.' },
        { label: 'Data Security & Compliance', body: 'slovX\'s firewall tools help securely intercept sensitive patient information from documents before sharing, supporting data privacy aligned with international healthcare regulations.' },
      ],
    },
  ],
};

export const platformPartners = {
  eyebrow: 'INTEGRATIONS',
  title: 'Our technology partners',
  items: [
    { icon: 'Sheet',     name: 'Google Workspace Integration', body: 'Execute rows and append directly inside Google Sheets module, making it easy to synchronize your lead profile tracking within your Google Workspace.' },
    { icon: 'Calendar',  name: 'Google Calendar Core',         body: 'Automated appointment confirmation sequences directly into active Calendar blocks, ensuring corporate working boundary parameters are always synced across devices.' },
    { icon: 'MessageCircle', name: 'Meta WhatsApp Gateway',   body: 'Connect with official Meta Webhook standard API endpoints, handling structural inbound payloads and outbound transactional data streams securely under two seconds.' },
    { icon: 'Mic',       name: 'OpenAI Whisper Transcriber',   body: 'Automate media file processing pipelines by extracting inbound user audio records directly through native audio translation endpoints without manual intervention.' },
  ],
};

export const platformSecurity = {
  eyebrow: 'SECURITY',
  title: 'Serious about protecting your pipeline',
  subtitle: 'How slovX approaches data privacy, isolation, and AI safety.',
  faqs: [
    {
      q: 'How does slovX defend against prompt injection and jailbreak attempts?',
      a: 'We use a two-layer approach. First, a Dual-Intent Security Firewall screens inbound payloads for adversarial patterns before they reach the reasoning layer. Second, a Structural Input Isolation layer wraps raw user text inside XML delimiters so it can\'t be spliced into system prompts. No layer is bulletproof — but this materially reduces the surface for known attack patterns.',
    },
    {
      q: 'Where is conversational data stored, and how is it secured?',
      a: 'Session logs are stored in PostgreSQL using structured JSONB context schemas. At rest, your data is encrypted with AES-256 via managed KMS. In transit, everything runs over TLS 1.3. Data is logically isolated per tenant so business A cannot access business B\'s records.',
    },
    {
      q: 'How do you reduce the risk of the AI stating wrong pricing or terms?',
      a: 'The agent is grounded in a Corporate Dictionary you configure — the pricing, policies, and product facts it\'s allowed to reference. Numerical computations bypass the LLM entirely and route through a deterministic pre-processor. This significantly reduces hallucinated numbers, though we still recommend supervising output as with any AI system.',
    },
    {
      q: 'How does slovX handle sensitive PII without slowing down conversations?',
      a: 'Live chat replies stream unmodified for speed. In parallel, an asynchronous PII masking layer (Microsoft Presidio) scrubs names, emails, and credentials before records land in downstream logs or monitoring tools.',
    },
    {
      q: 'Can the agent take high-risk actions without human approval?',
      a: 'No. Transaction-heavy requests (contracts, custom MSAs, payment links) trip a human-in-the-loop gate that freezes outbound generation and opens a handover to your team. You control which action classes require review.',
    },
  ],
};

export const platformCta = {
  title: 'Start with slovX today',
  items: [
    { label: 'Free Trial',  href: 'https://frontend-pi-pearl-81.vercel.app/register', primary: true  },
    { label: 'Book a Demo', href: '/contact',                                          primary: false },
  ],
};
