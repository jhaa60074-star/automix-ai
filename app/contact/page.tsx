'use client';
import { useState } from 'react';
import Button from '../../components/Button';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    
    // Simulate backend submission for Phase 1
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
      <div className="section-header">
        <h1 className="section-title">Contact Support</h1>
        <p className="section-subtitle">
          Have a question or need assistance? Fill out the form below and our team will get back to you.
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {formStatus === 'success' ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem', color: '#10b981' }}>✓</div>
            <h2 style={{ marginBottom: '1rem' }}>Message Sent!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Thank you for reaching out. We have received your message and will respond shortly.
            </p>
            <Button onClick={() => setFormStatus('idle')} variant="secondary" style={{ marginTop: '2rem' }}>
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="name" style={{ fontWeight: '500' }}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                required 
                style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontWeight: '500' }}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                required 
                style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="category" style={{ fontWeight: '500' }}>Category</label>
              <select 
                id="category" 
                required
                style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)' }}
              >
                <option value="">Select a category...</option>
                <option value="support">General Support</option>
                <option value="billing">Billing & Subscriptions</option>
                <option value="technical">Technical Issue</option>
                <option value="sales">Sales Inquiry</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="message" style={{ fontWeight: '500' }}>Message</label>
              <textarea 
                id="message" 
                rows={5}
                required
                style={{ padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--background-color)', color: 'var(--text-color)', resize: 'vertical' }}
              ></textarea>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              disabled={formStatus === 'loading'}
              style={{ padding: '1rem', marginTop: '1rem' }}
            >
              {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
            </Button>
            
          </form>
        )}
      </div>
    </div>
  );
}
