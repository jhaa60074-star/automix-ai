import Link from 'next/link';
import Button from '../../components/Button';

export const metadata = {
  title: 'Sign Up | Automik',
  description: 'Create your Automik account and start automating.',
};

export default function SignupPage() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create an account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Start automating your business today</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="name" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Full Name</label>
            <input 
              type="text" 
              id="name" 
              placeholder="John Doe"
              style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="you@company.com"
              style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••"
              style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
            />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }}>Create Account</Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          By signing up, you agree to our <Link href="/terms-of-service" style={{ textDecoration: 'underline' }}>Terms of Service</Link> and <Link href="/privacy-policy" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>.
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Log in</Link>
        </div>
      </div>
    </div>
  );
}
