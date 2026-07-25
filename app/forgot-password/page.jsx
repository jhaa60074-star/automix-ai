import Link from 'next/link';
import Button from '../../components/Button';

export const metadata = {
  title: 'Forgot Password | Automik',
  description: 'Reset your Automik account password.',
};

export default function ForgotPasswordPage() {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enter your email to receive a reset link</p>
        </div>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="you@company.com"
              required
              style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
            />
          </div>

          <Button type="submit" variant="primary" style={{ width: '100%', marginTop: '0.5rem' }}>Send Reset Link</Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <Link href="/login" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>← Back to log in</Link>
        </div>
      </div>
    </div>
  );
}
