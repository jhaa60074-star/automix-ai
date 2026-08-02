import { notFound } from 'next/navigation';
import { servicesData } from '@/data/services';
import Button from '@/components/Button';
import Link from 'next/link';

export function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export function generateMetadata({ params }) {
  const service = servicesData.find((s) => s.slug === params.slug);
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: `${service.title} | AutrixGPT Services`,
    description: service.shortDescription,
  };
}

export default function ServiceDetailPage({ params }) {
  const service = servicesData.find((s) => s.slug === params.slug);
  
  if (!service) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <Link href="/services" style={{ color: 'var(--text-secondary)', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Services
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '3rem' }}>{service.icon}</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{service.title}</h1>
      </div>
      
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.8' }}>
        {service.fullDescription}
      </p>

      <div style={{ background: 'var(--background-secondary)', padding: '2rem', borderRadius: 'var(--border-radius-lg)', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>How it works</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{service.howItWorks}</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '4rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Who is it for?</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{service.whoItsFor}</p>
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Common Use Cases</h3>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
            {service.useCases.map((useCase, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{useCase}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
        <Button href={service.ctaLink} style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>{service.ctaText}</Button>
        <Link href={service.helpLink} style={{ color: 'var(--primary-color)', fontWeight: '500' }}>View Documentation</Link>
      </div>
    </div>
  );
}
