import Link from 'next/link';
import Button from '@/components/Button';

export const metadata = {
  title: 'Help Center | AutrixGPT',
  description: 'Support, guides, and documentation for AutrixGPT.',
};

export default function HelpCenterPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
      <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 className="section-title">Help Center</h1>
        <p className="section-subtitle">
          How can we help you today?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💬</div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>AI Support Assistant</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>
            Get instant answers to your questions from our AI support assistant. It's trained on all our documentation and capabilities.
          </p>
          <Button href="/?openChat=true" variant="primary" style={{ width: '100%' }}>Launch AI Assistant</Button>
        </div>

        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📚</div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>
            Browse our comprehensive FAQ for quick answers about billing, account management, and features.
          </p>
          <Button href="/faq" variant="secondary" style={{ width: '100%' }}>View FAQ</Button>
        </div>

        <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📧</div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Contact Human Support</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1, lineHeight: '1.6' }}>
            Need to talk to a real person? Our support team is ready to help you with complex technical issues.
          </p>
          <Button href="/contact" variant="secondary" style={{ width: '100%' }}>Contact Support</Button>
        </div>
      </div>

      <div style={{ padding: '3rem', background: 'var(--background-secondary)', borderRadius: 'var(--border-radius-lg)' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Quick Links</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <Link href="/services" style={{ display: 'block', color: 'var(--text-color)', textDecoration: 'none', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'border-color 0.2s' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Services</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Learn what we offer</span>
          </Link>
          
          <Link href="/automations" style={{ display: 'block', color: 'var(--text-color)', textDecoration: 'none', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'border-color 0.2s' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Automations</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Workflow guides</span>
          </Link>
          
          <Link href="/pricing" style={{ display: 'block', color: 'var(--text-color)', textDecoration: 'none', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'border-color 0.2s' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Billing & Pricing</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your plan</span>
          </Link>
          
          <Link href="/data-deletion" style={{ display: 'block', color: 'var(--text-color)', textDecoration: 'none', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', transition: 'border-color 0.2s' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Data Deletion</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your privacy</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
