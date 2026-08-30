// Content for the /platform business showcase page.
// Mirrors the ilovePDF layout: Hero → Trusted → Badges → Platform boxes →
// Stats → Testimonial → Enterprise → Verticals → Partners → Security FAQ → CTA

export const platformHero = {
  eyebrow: 'AI REVENUE AUTOMATION',
  headline: 'Automate inbound revenue pipeline with',
  brand: 'slovX',
  subhead:
    'Efficient, reliable, and secure solutions for all your sales needs — empower your business with seamless agentic integration and qualification tools.',
  cta: 'Get Started',
  ctaHref: 'https://frontend-pi-pearl-81.vercel.app/register',
};

export const platformTrusted = {
  label: 'Trusted by well-known companies',
  logos: ['LOXE', 'Meridian', 'LinkedIn', 'Shopify', 'Veloix', 'Stripe', 'Atlassian', 'HubSpot'],
};

export const platformBadges = {
  eyebrow: 'Top-rated for developer-native interface and autonomous sales tools',
  subtitle:
    'Customers trust slovX as a reliable solution, ideal for managing complex enterprise pipelines seamlessly.',
  items: [
    { platform: 'G2',           label: 'Leader',              sub: 'Enterprise',  stars: 5 },
    { platform: 'Capterra',     label: 'Best Ease of Use',    sub: 'Sales AI',    stars: 5 },
    { platform: 'Product Hunt', label: '#1 Product of Day',   sub: 'Automation',  stars: 5 },
    { platform: 'G2',           label: 'Momentum Leader',     sub: 'Mid-Market',  stars: 5 },
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
  title: 'Transforming revenue pipelines worldwide',
  items: [
    { value: '30M+',  label: 'Tokens processed'            },
    { value: '99.9%', label: 'Latency architecture'        },
    { value: '20K+',  label: 'Conversations synchronized'  },
    { value: '50M',   label: 'Leaks locked automatically'  },
  ],
};

export const platformTestimonial = {
  quote:
    '"slovX has revolutionized our inbound sales execution. The seamless qualification, routing, and closing nodes have saved us countless hours, and the developer-native interface makes it easy for everyone on our team to utilize. We can now handle all our lead pipelines in one engine, improving our conversion velocity significantly. Highly recommend slovX for any enterprise looking to automate their revenue streams!"',
  author: 'Marcus Vance',
  role:   'VP of Global Pipeline Architecture at Veloix',
};

export const platformEnterprise = {
  eyebrow: 'ENTERPRISE',
  title: 'Architected for enterprise',
  tabs: [
    {
      title: 'Optimize conversion velocity',
      bullets: [
        'Orchestrate autonomous agents to eliminate leakage and maximize efficiency',
        'Connect with Google Sheets and Calendar for instant infrastructure scaling',
      ],
    },
    {
      title: 'Optimize pipeline execution',
      bullets: [
        'Extract pipeline analytics from inbound metrics using deterministic math',
        'Automate routing and enhance outcomes with state-driven models',
      ],
    },
    {
      title: 'Enterprise grade data isolation',
      bullets: [
        'Protect records with native AES-256 encryption',
        'Ensure compliance with GDPR, regional policies, and audit standards',
      ],
    },
    {
      title: 'Dedicated computing infrastructure',
      bullets: [
        'Isolated deployment from an expert architect',
        'Custom multi-agent sandboxes for enterprise workflow automation',
      ],
    },
    {
      title: 'Team authentication and role metrics',
      bullets: [
        'Centralize permissions via an interactive dashboard',
        'Deploy assets, configurations, and corporate parameters securely',
      ],
    },
    {
      title: 'Automate pipelines with FastAPI',
      bullets: [
        'Seamless integration with API guides',
        'Automate tasks triggered by execution events',
      ],
    },
  ],
};

export const platformVerticals = {
  eyebrow: 'INDUSTRY VERTICALS',
  title: 'Discover how slovX optimizes revenue pipeline execution for your corporate vertical',
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
  title: 'Your pipelines deserve absolute sovereign protection',
  subtitle: 'Learn how slovX prioritises data privacy and security',
  faqs: [
    {
      q: 'How does slovX block prompt injection and jailbreak attacks?',
      a: 'We deploy a two-layer defense. First, the Dual-Intent Security Firewall Node instantly intercepts inbound payload vectors to block exfiltration signatures. Second, the Structural Input Isolation Layer wraps raw text inside strict XML delimiters, stripping execution rights before data hits the core graph.',
    },
    {
      q: 'Where is conversational data stored, and is it secure?',
      a: 'All multi-agent session trace logs are preserved natively inside your sovereign database using structured Sessions JSONB Context Schemas. At the storage tier, your entire client profiling database and guardrail tracking matrix are natively shielded using continuous AES-256 cryptographic encryption at-rest.',
    },
    {
      q: 'How do you guarantee the AI won\'t hallucinate pricing or terms?',
      a: 'All metrics undergo strict dual validation. The platform runs a Corporate Dictionary Framework that restricts the bot to hardcoded company values. Complex computations bypass the LLM completely, routing to a Deterministic Offline Mathematical Pre-Processor Node that uses exact multi-variable math factors.',
    },
    {
      q: 'How does slovX handle sensitive PII without slowing down live chat?',
      a: 'Outbound chat streams are kept raw and asynchronous to optimize natural sales velocity. However, before records hit database traces or monitoring, an asynchronous Microsoft Presidio PII Masking layer strips names, emails, and credentials safely in the background.',
    },
    {
      q: 'Can the engine execute agreements or send links without human approval?',
      a: 'Never. If a client triggers transaction-heavy requests (like contracts, custom MSAs, or payment gates), our Pre-Execution Pydantic Gating Node fires a hitl_handover = True flag. This immediately freezes outbound text generation and locks the thread for live admin intervention.',
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
