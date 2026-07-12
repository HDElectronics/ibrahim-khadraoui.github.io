import type { Metadata } from 'next';

import Layout from '@/components/Layout';

import '@/styles/globals.css';
import '@/styles/themes.css';

export const metadata: Metadata = {
  title: {
    default: 'Ibrahim Khadraoui | Portfolio',
    template: 'Ibrahim Khadraoui | %s',
  },
  description:
    'Ibrahim Khadraoui is an embedded systems engineer designing custom PCBs and microcontroller-based hardware.',
  keywords: [
    'ibrahim khadraoui',
    'ibrahim',
    'khadraoui',
    'embedded systems engineer',
    'pcb design portfolio',
    'atmega328p',
    'stm32',
    'kicad',
    'hdelectronics',
    'vscode-portfolio',
  ],
  openGraph: {
    title: "Ibrahim Khadraoui's Portfolio",
    description:
      'An embedded systems engineer designing custom PCBs and microcontroller-based hardware.',
    images: ['https://imgur.com/JXJ9mpO.gif'],
    url: 'https://vscode-portfolio.vercel.app',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

const themeScript = `
  (function() {
    const theme = localStorage.getItem('theme');
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
