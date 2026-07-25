import { notFound } from 'next/navigation';
import { automationsData } from '../../../data/automations';
import Button from '../../../components/Button';
import Link from 'next/link';

export function generateStaticParams() {
  return automationsData.map((automation) => ({
    slug: automation.slug,
  }));
}

export function generateMetadata({ params }) {
  const automation = automationsData.find((a) => a.slug === params.slug);
  if (!automation) return { title: 'Automation Not Found' };
  
  return {
    title: `${automation.title} | Automik Automations`,
    description: automation.shortDescription,
  };
}

export default function AutomationDetailPage({ params }) {
  const automation = automationsData.find((a) => a.slug === params.slug);
  
  if (!automation) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <Link href="/automations" style={{ color: 'var(--text-secondary)', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Automations
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '3rem' }}>{automation.icon}</span>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }}>{automation.title}</h1>
          <span style={{ color: 'var(--text-muted)' }}>Category: {automation.category}</span>
        </div>
      </div>
      
      <div style={{ display: 'inline-block', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', padding: '0.5rem 1rem', borderRadius: '4px', fontWeight: '600', marginBottom: '2rem' }}>
        Status: {automation.status}
      </div>

      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: '1.8' }}>
        {automation.description}
      </p>

      <div style={{ background: 'var(--background-secondary)', padding: '2rem', borderRadius: 'var(--border-radius-lg)', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>How it works</h3>
        <p style={{ color: 'var(--text-secondary)' }}>{automation.howItWorks}</p>
        
        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Setup Preview</h4>
          <div style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', opacity: 0.8 }}>
             <p style={{ margin: 0, color: 'var(--text-muted)', textAlign: 'center' }}>Connect your {automation.title.split(' ')[0]} account to see available triggers and actions.</p>
             <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                <Button disabled variant="secondary">Connect Account</Button>
             </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '4rem' }}>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Who is it for?</h3>
          <p style={{ color: 'var(--text-secondary)' }}>{automation.whoItsFor}</p>
        </div>
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Use Cases</h3>
          <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
            {automation.useCases.map((useCase, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem' }}>{useCase}</li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
        <Button href="/login" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>Get Started</Button>
        <Link href={automation.helpLink} style={{ color: 'var(--primary-color)', fontWeight: '500' }}>View Setup Guide</Link>
      </div>
    </div>
  );
}
