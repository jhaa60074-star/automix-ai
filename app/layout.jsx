import './globals.css';

import React, { Suspense } from 'react';
import Header from '@/components/Header';
import FooterWrapper from '@/components/FooterWrapper';
import FloatingChat from '@/components/FloatingChat';

export const metadata = {
  metadataBase: new URL('https://www.autrixgpt.com'),
  title: {
    default: 'AUTRIXGPT AI',
    template: '%s | AUTRIXGPT AI'
  },
  description: 'AI automation platform for businesses',
  keywords: ['AI Automation', 'Business Automation', 'Instagram Automation', 'WhatsApp AI', 'File Analysis AI', 'AutrixGPT'],
  authors: [{ name: 'AutrixGPT' }],
  creator: 'AutrixGPT',
  publisher: 'AutrixGPT',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'AutrixGPT | The Intelligent Automation Engine',
    description: 'Seamlessly chat with an AI assistant, analyze complex files, research data, and deploy automated workflows.',
    url: 'https://www.autrixgpt.com',
    siteName: 'AutrixGPT',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AutrixGPT - Intelligent Automation Engine',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AutrixGPT | The Intelligent Automation Engine',
    description: 'Seamlessly chat with an AI assistant, analyze complex files, research data, and deploy automated workflows.',
    creator: '@autrixgpt',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://www.autrixgpt.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var storedTheme = localStorage.getItem('theme');
                if (storedTheme === 'dark') {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else if (storedTheme === 'light') {
                  document.documentElement.removeAttribute('data-theme');
                } else {
                  // Default to light as per requirements
                  document.documentElement.removeAttribute('data-theme');
                }
              } catch (err) {}
            })();
          `
        }} />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: 'calc(100vh - 4rem - 300px)' }}>
          {children}
        </main>
        <FooterWrapper />
        <Suspense fallback={null}>
          <FloatingChat />
        </Suspense>
      </body>
    </html>
  );
}
