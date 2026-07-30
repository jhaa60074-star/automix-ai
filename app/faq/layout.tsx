import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | AutrixGPT',
  description: 'Frequently Asked Questions',
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
