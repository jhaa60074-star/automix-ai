import Button from '../../components/Button';

export const metadata = {
  title: 'About Us | AutrixGPT',
  description: 'Learn about our mission to make business automation simple and accessible.',
};

export default function AboutPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div className="section-header">
        <h1 className="section-title">About AutrixGPT</h1>
        <p className="section-subtitle">
          We are on a mission to democratize AI and business automation.
        </p>
      </div>

      <div className="card" style={{ padding: '3rem', marginBottom: '3rem', borderTop: '4px solid var(--primary-color)' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Our Mission</h2>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          At AutrixGPT, we believe that advanced AI and powerful business automations shouldn't be restricted to enterprise companies with large engineering teams. Our mission is to build intuitive, scalable, and premium tools that allow any business owner to leverage AI to save time, engage customers, and analyze data effortlessly.
        </p>
      </div>

      <div className="card" style={{ padding: '3rem', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>The Vision</h2>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1.5rem' }}>
          We envision a future where your software works for you proactively. Instead of managing dozens of disconnected apps, AutrixGPT serves as the intelligent central nervous system for your business operations.
        </p>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          Whether it's automatically responding to Instagram comments, summarizing long financial reports, or routing customer queries in WhatsApp, AutrixGPT handles the complexity behind a clean, premium interface.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Ready to transform your business?</h2>
        <Button href="/signup" variant="primary" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>Get Started Free</Button>
      </div>
    </div>
  );
}
