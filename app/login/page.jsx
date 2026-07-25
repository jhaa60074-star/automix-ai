import Link from 'next/link';
import Button from '../../components/Button';

export const metadata = {
  title: 'Log In | Automik',
  description: 'Log in to your Automik account.',
};

export default function LoginPage() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Log in to your Automik account</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label htmlFor="password" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
              <Link href="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--primary-color)' }}>Forgot password?</Link>
            </div>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••"
              style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
            />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }}>Log In</Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
          <Link href="/signup" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
