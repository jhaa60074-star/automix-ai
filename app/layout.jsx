import './globals.css';

import React, { Suspense } from 'react';
import Header from '../components/Header';
import FooterWrapper from '../components/FooterWrapper';
import FloatingChat from '../components/FloatingChat';

export const metadata = {
  title: 'AutrixGPT - AI SaaS Platform',
  description: 'AI assistance, research, file analysis, and business automation platform.',
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
        <React.Suspense fallback={null}>
          <FloatingChat />
        </React.Suspense>
      </body>
    </html>
  );
}
