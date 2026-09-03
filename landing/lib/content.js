// Single source of truth for all landing page copy.
// Easier to iterate on tone/wording without hunting through JSX.

export const nav = {
  links: [
    { label: 'Home',         href: '/' },
    { label: 'Businesses',   href: '/businesses' },
    { label: 'Services',     href: '/services' },
    { label: 'About us',     href: '/about' },
    { label: 'Architecture', href: '/architecture' },
    { label: 'ROI',          href: '/roi-calculator' },
    { label: 'Pricing',      href: '/pricing' },
    { label: 'Contact Us',   href: '/contact' },
  ],
  ctaSignIn: 'Sign in',
  ctaStart:  'Start free trial',
};

export const hero = {
  eyebrow: 'AI SALES ON WHATSAPP',
  headlineLine1: 'Your 24/7 AI closer',
  headlineLine2: 'for WhatsApp.',
  subhead:
    "Xavier qualifies leads, handles objections, and books meetings — in 15 languages, on the world's most-used chat app. While you sleep.",
  ctaPrimary:   'Start free trial',
  ctaSecondary: 'See it in action',
  stat1: { value: '3.2s',   label: 'Avg. reply time' },
  stat2: { value: '87%',    label: 'Qualification rate' },
  stat3: { value: '24/7',   label: 'Always on' },
};

export const trustedBy = {
  title: 'Powering conversations for teams at',
  // Placeholder brand names — swap for real customer logos when you have them
  logos: [
    'ATLAS AI', 'NORTHWIND', 'SUMMIT', 'FRAME.IO',
    'PILOT LABS', 'MERIDIAN', 'CIPHER', 'HALO CO.',
  ],
};

export const howItWorks = {
  eyebrow: 'HOW IT WORKS',
  title: 'From cold DM to booked call in one thread.',
  subtitle:
    'No new apps for your customers. They message your WhatsApp Business number. Xavier does the rest.',
  steps: [
    {
      number: '01',
      title:  'Customer messages your WhatsApp',
      body:   'Any number, any language. Xavier detects intent within the first two messages and matches your tone.',
    },
    {
      number: '02',
      title:  'AI qualifies + handles objections',
      body:   'Built on your product catalog, FAQs, and pricing — with anti-hallucination guardrails so it never invents facts.',
    },
    {
      number: '03',
      title:  'Warm lead lands in your dashboard',
      body:   'Full conversation, sentiment score, buying intent, and next best action. Take over anytime with one tap.',
    },
  ],
};

export const features = {
  eyebrow: 'CAPABILITIES',
  title:   'Every part of the sales conversation, on autopilot.',
  subtitle: 'Not a chatbot script. A closing agent with real product knowledge.',
  items: [
    {
      icon: 'Globe',
      title: 'Native in 15 languages',
      body:  'Detects the customer\'s language and replies in it — including Arabic (RTL), Chinese, and Turkish. Not translated. Native.',
    },
    {
      icon: 'Shield',
      title: 'Zero hallucinations',
      body:  'Anti-hallucination guardrail catches invented prices, promises, or terms and hands off before damage is done.',
    },
    {
      icon: 'Brain',
      title: 'Sentiment + intent scoring',
      body:  'Every conversation is scored 0–10 for sentiment and buying intent. Prioritize your pipeline by hotness.',
    },
    {
      icon: 'Zap',
      title: 'Official Meta WhatsApp API',
      body:  'Not an unofficial bridge. Real Meta Cloud API. Verified sender, no risk of bans, full compliance built in.',
    },
    {
      icon: 'Pause',
      title: 'Pause anytime',
      body:  'Full control. Take over any conversation manually, or pause the entire bot with one switch when you want.',
    },
    {
      icon: 'Users',
      title: 'Human handoff',
      body:  'One tap and the AI steps aside. Your team steps in mid-conversation, no context loss for the customer.',
    },
  ],
};

export const aiInAction = {
  eyebrow: 'AI IN ACTION',
  title:   'Watch Xavier qualify a lead in real time.',
  subtitle:
    'Real conversation, real timing. This is a live scenario — Xavier detects budget, timeline, and intent within 4 exchanges.',
  chat: [
    { role: 'customer', text: 'Hi, saw your ad. How much is the enterprise plan?', delay: 400,  time: '9:41 AM' },
    { role: 'ai',       text: 'Hey! Happy to walk you through it. Quick question first — roughly how many customer conversations does your team handle a month?', delay: 1200, time: '9:41 AM' },
    { role: 'customer', text: 'Around 2,000. Growing fast.',              delay: 1400, time: '9:42 AM' },
    { role: 'ai',       text: 'Got it. At 2k/month you\'re a great fit for BDR Suite ($1,499/mo, up to 1,000 high-ticket convos + overage). Enterprise makes sense if you\'re past 3k. Want me to send a quick side-by-side?', delay: 1600, time: '9:42 AM' },
    { role: 'customer', text: 'Yes please. Also — how fast can we go live?', delay: 1200, time: '9:43 AM' },
    { role: 'ai',       text: 'Under 15 minutes once your WhatsApp Business number is connected. I\'ll drop our onboarding link + comparison table. When\'s a good time this week for a 20-min demo?', delay: 1600, time: '9:43 AM' },
  ],
  // Post-demo interactive replies. First matching pattern wins; fallback used
  // if nothing matches. Keeps the mock feeling alive without a real backend.
  cannedReplies: [
    { match: 'price|cost|pricing|plan|how much', text: "Sure! Starter is $299/mo, BDR Suite $1,499/mo, and Enterprise is custom. Roughly how many conversations a month are you handling?" },
    { match: 'demo|schedule|meeting|call|book',  text: "Happy to book one — I have 20-min slots open this week. What day works best for you?" },
    { match: 'language|translate|multilingual',  text: "Xavier speaks 15 languages natively — Spanish, Arabic, Hindi, Portuguese, French, Mandarin and more. Which do your customers use most?" },
    { match: 'whatsapp|meta|api|number',         text: "We run on the official Meta WhatsApp Business API. Once your number is verified we go live in under 15 minutes." },
    { match: 'integrat|crm|hubspot|salesforce|pipedrive', text: "Native integrations with HubSpot, Salesforce, and Pipedrive out of the box — plus a webhook for anything else." },
    { match: 'secure|security|gdpr|soc|compli',  text: "SOC 2 Type II, GDPR-ready, AES-256 at rest, and full ReAct reasoning logs. Full breakdown lives on our /architecture page." },
    { match: 'trial|free|try|start',             text: "14-day trial, no card required. Want me to drop the signup link right here?" },
    { match: 'hi|hello|hey|yo',                  text: "Hi! I'm Xavier — your 24/7 sales AI. What are you trying to close today?" },
    { match: 'thank|thanks|cool|great|awesome',  text: "Glad that helps! Anything else you want me to dig into — pricing, integrations, or the security architecture?" },
  ],
  fallbackReply: "Great question — let me flag that for a human teammate. In the meantime, want me to book a quick 20-min demo where we can walk through the specifics?",
};

export const security = {
  eyebrow: 'TRUST & SECURITY',
  title:   'Hardened Cognitive Architecture',
  subtitle: "Built for teams that can't afford a single pipeline leak.",
  items: [
    { icon: 'ShieldCheck', title: 'Dual-Intent Interception Firewall',
      body: 'Every inbound message is screened for adversarial intent before it ever reaches the reasoning layer.' },
    { icon: 'Braces',      title: 'Structural XML Input Isolation',
      body: 'User input is parsed and quarantined in typed containers — never spliced into system prompts.' },
    { icon: 'ScrollText',  title: 'Deterministic ReAct Reasoning Logs',
      body: 'Every decision traceable step-by-step. Reproducible audits, no black-box replies.' },
    { icon: 'BadgeCheck',  title: 'SOC 2 Type II & GDPR Infrastructure',
      body: 'Continuously audited controls, EU data residency, and DPA-ready processing.' },
    { icon: 'Scale',       title: 'California SB 1001 Disclosure Filter',
      body: 'Automated bot-identity disclosure so every jurisdiction stays compliant, always.' },
    { icon: 'EyeOff',      title: 'Asynchronous PII Masking Engine',
      body: 'Personally identifiable data is redacted at ingestion — before any model ever sees it.' },
    { icon: 'Lock',        title: 'Data At-Rest Cryptography (AES-256)',
      body: 'All conversation stores encrypted with rotated keys and hardware-backed KMS.' },
  ],
  cta: { label: 'Visit our Trust & Security Center', href: '/architecture' },
};

export const pricing = {
  eyebrow: 'PRICING',
  title:   'Simple pricing. Real ROI.',
  subtitle: 'Every plan pays for itself in the first two closed deals. No credit card for trial.',
  tiers: [
    {
      name:  'Assistant',
      price: 549,
      cadence: '/ month',
      pitch: 'For boutique brands testing AI on their WhatsApp inbound.',
      limit: '300 inbound leads / month',
      overage: '$0.50 / extra lead',
      features: [
        '24/7 smart screening agent',
        'Anti-hallucination guardrails',
        'Multi-language auto-reply',
        'Smart message-burst queue',
        'Meta-compliant + STOP handling',
        'Pause bot switch',
      ],
      ctaLabel: 'Start free trial',
      ctaVariant: 'primary',
    },
    {
      name:  'BDR Suite',
      price: 1499,
      cadence: '/ month',
      pitch: 'For scale-ups and clinics ready to fully outsource inbound qualification.',
      limit: '1,000 high-ticket conversations / month',
      overage: '$0.35 / extra conversation',
      badge: 'MOST POPULAR',
      features: [
        'Everything in Assistant, plus:',
        '2-agent closer combo',
        'Hands-free calendar booking',
        'Live Google Sheets sync',
        'Instant FAQ answer cache',
        'Audio voice-note transcription',
      ],
      ctaLabel: 'Start free trial',
      ctaVariant: 'primary',
      featured: true,
    },
    {
      name:  'Enterprise',
      price: 3500,
      cadence: '/ month · starting',
      pitch: 'For agencies and luxury brands running the whole show through Xavier.',
      limit: '3,000 deep B2B pipelines / month',
      overage: '$0.25 / extra conversation',
      features: [
        'Everything in BDR, plus:',
        '3-agent full combo + sentiment audit',
        '"Whale catcher" lead enrichment',
        'Dynamic tone shifting',
        'Global cultural adapter (Khaleeji, EU)',
        'CRM sync (HubSpot / Salesforce / Pipedrive)',
        'Team access controls (RBAC)',
      ],
      ctaLabel: 'Book a demo',
      ctaVariant: 'secondary',
    },
  ],
};

export const pricingFaq = {
  eyebrow: 'PRICING FAQ',
  title:   'Everything about plans, limits, and billing.',
  items: [
    {
      q: 'What counts as a "lead" or "conversation" toward my monthly limit?',
      a: 'A conversation is a unique lead within a rolling 30-day window — not per message. Every reply to that same lead in that window is free. If they message you again 31 days later, that opens a new conversation.',
    },
    {
      q: 'What happens if I go over my monthly conversation limit?',
      a: "We won't cut Xavier off mid-close. Overages are billed at $0.50/lead on Assistant, $0.35 on BDR Suite, and $0.25 on Enterprise. You'll get an email as you approach your cap so you can upgrade if it makes more sense.",
    },
    {
      q: 'Is there a free trial? Do I need a credit card?',
      a: '14 days free on any plan. No credit card required to start — you can add it later. Cancel anytime from your dashboard with one click.',
    },
    {
      q: 'Which plan should I pick for my business?',
      a: 'Assistant ($549/mo) fits boutique brands testing AI on their inbound. BDR Suite ($1,499/mo) is the sweet spot for scale-ups and clinics running qualification at ~1,000 conversations/mo. Enterprise ($3,500+/mo) is for agencies, luxury brands, and B2B teams needing custom limits, RBAC, and CRM sync.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'Credit and debit cards worldwide, processed via Paddle (our Merchant of Record — they handle billing, tax, and refunds). Enterprise accounts can pay by bank transfer, ACH, or annual invoice.',
    },
    {
      q: 'Are prices in USD? What about VAT, GST, or sales tax?',
      a: 'All plans are listed in USD. Paddle automatically calculates and adds VAT, GST, or sales tax based on your billing country — it appears clearly on your invoice, no surprises.',
    },
    {
      q: 'Can I upgrade or downgrade my plan later?',
      a: 'Yes, anytime. Upgrades take effect immediately with pro-rated billing. Downgrades apply at the start of your next billing cycle so you keep the plan you paid for.',
    },
    {
      q: 'Do you charge per seat or per user?',
      a: 'No per-seat pricing. Every plan includes unlimited team seats. Enterprise adds role-based access control (RBAC) so you can restrict who can pause the bot, export leads, or edit configuration.',
    },
    {
      q: 'Do you offer refunds?',
      a: 'EU and UK customers are covered by the 14-day statutory refund window — email billing@slovx.com and we\'ll process it. Outside those regions we review case-by-case; if Xavier didn\'t do what we promised, we\'ll make it right.',
    },
    {
      q: 'Are there discounts for annual billing, non-profits, or open-source?',
      a: 'Annual billing gets 2 months free (~17% off) on Assistant and BDR Suite. Non-profit, educational, and open-source projects — reach out; we\'re flexible when the mission is right.',
    },
    {
      q: 'Do I need my own WhatsApp Business number?',
      a: 'Yes — Xavier connects to your existing (or new) Meta WhatsApp Business API number. We\'ll walk you through the Meta verification during onboarding; it usually takes under 15 minutes end-to-end.',
    },
    {
      q: 'What if I need higher limits than Enterprise offers?',
      a: 'We do custom deals for high-volume brands running >10,000 conversations/mo. Contact sales@slovx.com — we\'ll spec a dedicated instance with your own throughput, SLA, and success manager.',
    },
  ],
};

export const faq = {
  eyebrow: 'FAQ',
  title:   'The questions everyone asks before signing up.',
  items: [
    {
      q: 'Will Xavier replace my entire sales team?',
      a: "No. Xavier handles the repetitive, time-consuming tasks (screening, answering basic questions, and scheduling) so your team can focus exclusively on serious, ready-to-close leads. It doesn't replace your team — it saves their valuable time.",
    },
    {
      q: 'What if Xavier gives a customer the wrong price or incorrect information?',
      a: 'This cannot happen. Xavier operates on a locked pricing system — it can only quote the exact prices and terms that you have provided to it. If something is not on that list, it stops automatically and tells the customer, "I will confirm and get back to you" — it never guesses.',
    },
    {
      q: 'Can my WhatsApp number get banned because of this?',
      a: 'No, not if it is used correctly. Xavier strictly follows Meta\'s official guidelines — such as the mandatory 24-hour messaging window and stopping immediately if a customer says "STOP". These compliance rules are already built-in.',
    },
    {
      q: 'How much time or technical knowledge is required for setup?',
      a: 'You do not need to write code or learn anything technical. Just provide your business information (products, pricing, and FAQs) — we handle the entire setup for you. Connecting your WhatsApp Business account is done in a few simple steps.',
    },
    {
      q: 'What if a customer asks a difficult or sensitive question that Xavier cannot handle?',
      a: 'Xavier instantly recognizes when a conversation goes beyond its capacity. In these situations, it automatically pauses that specific conversation, sends an urgent alert to your team, and politely tells the customer that a human agent will step in shortly.',
    },
    {
      q: 'What happens if a customer messages at night or during holidays?',
      a: "Xavier stays active 24/7. If you are asleep and a complex query hits the bot, it won't keep the customer waiting. It safely fields the questions and automatically proposes an open meeting slot on your calendar for the next day, giving you a full update in the morning.",
    },
    {
      q: 'Is my business data safe?',
      a: 'Yes. All connection pipelines are heavily encrypted, and Xavier does not unnecessarily store processed conversation data — it only retains what you explicitly need for proper lead-tracking and CRM audits.',
    },
    {
      q: 'What if I want to jump into a conversation and talk to a customer manually?',
      a: 'You can click the "Pause" button on your dashboard at any time to instantly freeze Xavier for that specific chat and reply directly from your screen. Xavier will not interfere in that conversation until you resume it.',
    },
    {
      q: 'What if a customer speaks in Roman Urdu, Arabic, or any other global language?',
      a: "Xavier automatically detects the customer's incoming language and slang style in real-time, responding perfectly in the exact same language — whether it is English, Roman Urdu, deep Gulf dialects, or any other global tongue. You do not need any external translation setups.",
    },
    {
      q: 'Can I cancel my plan if I change my mind later?',
      a: 'Absolutely. You can cancel your subscription at any time with a single click from your billing page — there are no lock-in contracts. You can also start a 7-day free trial right now with zero credit card commitment.',
    },
    {
      q: 'What happens if I reach my monthly message limit?',
      a: "Each plan includes a set number of conversations per month. If you're close to your limit, you'll see it in your dashboard beforehand. If you do reach it, Xavier automatically lets the customer know a team member will follow up, rather than silently going quiet.",
    },
    {
      q: 'Does Xavier connect to my existing CRM?',
      a: 'Yes — on our Enterprise plan, Xavier automatically syncs qualified leads and closed deals directly to HubSpot, Salesforce, or Pipedrive, so your sales data stays in one place without manual entry.',
    },
    {
      q: 'Can more than one person on my team use Xavier?',
      a: 'Yes, on our Enterprise plan. You can add team members with different access levels — admins can manage settings and export data, while agents can view conversations and take over chats when needed.',
    },
    {
      q: 'Can Xavier understand voice messages?',
      a: 'Yes — if a customer sends a WhatsApp voice note, Xavier automatically transcribes it and responds appropriately, just like a text message.',
    },
  ],
};

export const cta = {
  eyebrow: 'READY?',
  title:   'Stop losing leads to slow replies.',
  subtitle:
    "Every unanswered WhatsApp is a competitor's win. Get Xavier live in 15 minutes — free for the first 20 conversations.",
  emailPlaceholder: 'you@company.com',
  ctaPrimary: 'Start free trial',
  smallPrint: 'No credit card. Cancel anytime.',
};

export const footer = {
  tagline: 'The AI that closes deals on WhatsApp — so you can sleep at night.',
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Features',    href: '#features' },
        { label: 'How it works', href: '#how' },
        { label: 'Pricing',     href: '#pricing' },
        { label: 'FAQ',         href: '#faq' },
      ],
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Businesses',   href: '/businesses'      },
        { label: 'Services',     href: '/services'        },
        { label: 'ROI Calculator', href: '/roi-calculator' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About',   href: '/about'   },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '#'        },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Legal Hub',        href: '/legal'          },
        { label: 'Privacy Policy',   href: '/legal/privacy'  },
        { label: 'Terms & Conditions', href: '/legal/terms'  },
        { label: 'Cookie Policy',    href: '/legal/cookies'  },
        { label: 'Trust & Security', href: '/trust'          },
      ],
    },
  ],
  copyright: '© 2026 SlovX. All rights reserved.',
};
