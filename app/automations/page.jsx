import Link from 'next/link';
import { automationsData } from '../../data/automations';
import Button from '../../components/Button';

export const metadata = {
  title: 'Automations | AutrixGPT',
  description: 'Explore our integrations and automations for Instagram, WhatsApp, Gmail, Shopify, and more.',
};

export default function AutomationsPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div className="section-header">
        <h1 className="section-title">Automations Directory</h1>
        <p className="section-subtitle">
          Connect your favorite platforms and let AutrixGPT handle the repetitive tasks seamlessly.
        </p>
      </div>

      <div className="grid-3" style={{ marginTop: '3rem' }}>
        {automationsData.map((automation) => (
          <div key={automation.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div className="card-icon" style={{ margin: 0 }}>{automation.icon}</div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'var(--background-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                {automation.category}
              </span>
            </div>
            
            <h3 className="card-title">{automation.title}</h3>
            <p className="card-desc" style={{ flexGrow: 1, fontSize: '0.95rem' }}>{automation.shortDescription}</p>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href={`/automations/${automation.slug}`} className="card-link">View Details →</Link>
              {automation.status === 'Setup Required' && (
                <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '500' }}>Setup Required</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
