import Link from 'next/link';
import { pricingPlans } from '../../data/pricing';
import Button from '../../components/Button';

export const metadata = {
  title: 'Pricing | Automik',
  description: 'Choose the right plan for your business automation needs.',
};

export default function PricingPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div className="section-header">
        <h1 className="section-title">Transparent Pricing</h1>
        <p className="section-subtitle">
          Scale your business with an AI automation platform built for growth. No hidden fees.
        </p>
      </div>

      <div className="grid-3" style={{ marginTop: '4rem', alignItems: 'center' }}>
        {pricingPlans.map((plan) => (
          <div key={plan.id} className="card" style={{ 
            border: plan.highlighted ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
            transform: plan.highlighted ? 'scale(1.05)' : 'none',
            zIndex: plan.highlighted ? 10 : 1,
            position: 'relative'
          }}>
            {plan.highlighted && (
              <span style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary-color)', color: 'white', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600' }}>
                Most Popular
              </span>
            )}
            
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{plan.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', minHeight: '3rem' }}>{plan.description}</p>
            
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800' }}>{plan.price}</span>
              <span style={{ color: 'var(--text-secondary)' }}> / {plan.billingPeriod}</span>
            </div>
            
            <Button href={plan.ctaLink} variant={plan.highlighted ? 'primary' : 'secondary'} style={{ width: '100%', marginBottom: '2rem' }}>
              {plan.ctaText}
            </Button>
            
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {plan.features.map((feature, idx) => (
                <li key={idx} style={{ marginBottom: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--primary-color)' }}>✓</span>
                  <span style={{ color: 'var(--text-color)' }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Have questions?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Check out our frequently asked questions.</p>
        <Button href="/faq" variant="secondary">View FAQ</Button>
      </div>
    </div>
  );
}
