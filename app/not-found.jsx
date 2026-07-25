import Link from 'next/link';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '8rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <h2 style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--primary-color)', margin: '0 0 1rem 0', lineHeight: 1 }}>404</h2>
      <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h3>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', maxWidth: '500px', fontSize: '1.125rem' }}>
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Button href="/" variant="primary" style={{ padding: '0.875rem 2rem' }}>Return Home</Button>
    </div>
  );
}
