import { notFound } from 'next/navigation';
import { legalData } from '../../../data/legal';
import LegalLayout from '../../../components/LegalLayout';

export function generateStaticParams() {
  return Object.keys(legalData).map((slug) => ({
    slug: slug,
  }));
}

export function generateMetadata({ params }) {
  const data = legalData[params.slug];
  if (!data) return { title: 'Not Found' };
  
  return {
    title: `${data.title} | AutrixGPT Legal`,
    description: `AutrixGPT's ${data.title}.`,
  };
}

export default function LegalPage({ params }) {
  const data = legalData[params.slug];
  
  if (!data) {
    notFound();
  }

  return <LegalLayout data={data} />;
}
