'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function FooterWrapper() {
  const pathname = usePathname();
  
  // Hide footer on specific full-screen workspace routes
  const hideFooterRoutes = ['/chat', '/research', '/file-analysis'];
  const shouldHide = hideFooterRoutes.some(route => pathname?.startsWith(route));

  if (shouldHide) {
    return null;
  }

  return <Footer />;
}
