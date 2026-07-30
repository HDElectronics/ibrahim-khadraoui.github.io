import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';

import CircuitBackground from '@/components/CircuitBackground';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ibrahim-khadraoui-portfolio-seven.vercel.app'),
  title: {
    default: 'Ibrahim Khadraoui | AI / ML Systems Engineer',
    template: 'Ibrahim Khadraoui | %s',
  },
  description:
    'Ibrahim Khadraoui is an AI / ML systems engineer working on edge inference and embodied AI — taking research models to production on robots and edge devices.',
  keywords: [
    'ibrahim khadraoui',
    'ai systems engineer',
    'ml systems engineer',
    'edge inference',
    'embodied ai',
    'vision language action',
    'llama.cpp',
    'tensorrt',
    'mlx',
    'robotics engineer',
    'embedded systems engineer',
    'pcb design',
    'hdelectronics',
  ],
  openGraph: {
    type: 'website',
    title: 'Ibrahim Khadraoui | AI / ML Systems Engineer',
    description:
      'Edge inference and embodied AI — taking research models to production on robots and edge devices.',
    url: '/',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ibrahim Khadraoui | AI / ML Systems Engineer',
    description:
      'Edge inference and embodied AI — taking research models to production on robots and edge devices.',
    images: ['/og.png'],
  },
};

const themeScript = `
  (function() {
    try {
      var t = localStorage.getItem('theme');
      document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <CircuitBackground />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}
