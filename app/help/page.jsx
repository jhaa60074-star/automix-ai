import Link from 'next/link';
import { helpData } from '../../data/help';
import Button from '../../components/Button';

export const metadata = {
  title: 'Help Center | Automik',
  description: 'Find answers, guides, and tutorials for Automik.',
};

export default function HelpCenterPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div className="section-header" style={{ marginBottom: '3rem' }}>
        <h1 className="section-title">Help Center</h1>
        <p className="section-subtitle">
          How can we help you today?
        </p>
        
        <div style={{ maxWidth: '600px', margin: '2rem auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search for articles..." 
            style={{ 
              width: '100%', 
              padding: '1rem 1.5rem', 
              borderRadius: '9999px', 
              border: '1px solid var(--border-color)', 
              background: 'var(--background-color)',
              color: 'var(--text-color)',
              fontSize: '1.1rem',
              boxShadow: 'var(--shadow-md)'
            }}
          />
          <button style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
            🔍
          </button>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '4rem' }}>
        {helpData.map((category) => (
          <div key={category.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{category.icon}</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{category.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flexGrow: 1 }}>{category.description}</p>
            <Link href={`/help/${category.id}`} className="card-link">View Articles →</Link>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', background: 'var(--background-secondary)', padding: '3rem', borderRadius: 'var(--border-radius-lg)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Can't find what you're looking for?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Contact our support team directly or use the AI Help Assistant (coming soon).</p>
        <Button href="/contact">Contact Support</Button>
      </div>
    </div>
  );
}
