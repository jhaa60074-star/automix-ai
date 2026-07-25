import Link from 'next/link';
import { servicesData } from '../../data/services';
import Button from '../../components/Button';

export const metadata = {
  title: 'Services | Automik',
  description: 'Explore our AI Assistant, Research & Analysis, File Analysis, and Automation services.',
};

export default function ServicesPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div className="section-header">
        <h1 className="section-title">Our Services</h1>
        <p className="section-subtitle">
          Discover how Automik can transform your workflows with AI-powered tools and deep integrations.
        </p>
      </div>

      <div className="grid-2" style={{ marginTop: '3rem' }}>
        {servicesData.map((service) => (
          <div key={service.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="card-icon">{service.icon}</div>
            <h2 className="card-title" style={{ fontSize: '1.5rem' }}>{service.title}</h2>
            <p className="card-desc" style={{ flexGrow: 1 }}>{service.shortDescription}</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button href={`/services/${service.slug}`}>Learn More</Button>
              <Link href={service.helpLink} className="card-link" style={{ fontSize: '0.875rem' }}>Help / FAQ</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
