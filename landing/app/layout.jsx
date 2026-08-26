import { Inter, Space_Grotesk } from 'next/font/google';
import ClientOnlyLayers from '../components/ClientOnlyLayers';
import Nav from '../components/Nav';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['500', '700'],
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://slovx.com'),
  title: {
    default:  'Xavier — Your 24/7 AI Sales Closer for WhatsApp',
    template: '%s · Xavier',
  },
  description:
    "The AI that qualifies leads, handles objections, and books meetings on WhatsApp — in 15 languages, while you sleep.",
  keywords: [
    'WhatsApp AI', 'AI sales assistant', 'WhatsApp automation',
    'Meta WhatsApp Business API', 'AI chatbot', 'lead qualification',
  ],
  openGraph: {
    title: 'Xavier — Your 24/7 AI Sales Closer for WhatsApp',
    description:
      "The AI that qualifies leads, handles objections, and books meetings on WhatsApp — in 15 languages.",
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xavier — Your 24/7 AI Sales Closer for WhatsApp',
    description: 'AI that closes deals on WhatsApp. In 15 languages. While you sleep.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="bg-ink-950 text-white antialiased selection:bg-brand-500/40 selection:text-white"
      >
        {/* Client-only overlays (cursor + global robot). Not SSR'd → no hydration mismatch. */}
        <ClientOnlyLayers />
        <Nav />
        {children}
      </body>
    </html>
  );
}
