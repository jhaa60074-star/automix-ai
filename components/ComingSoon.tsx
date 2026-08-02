import React from 'react';
import Link from 'next/link';
import Button from '@/components/Button';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

export default function ComingSoon({ 
  title = "Coming Soon", 
  description = "We're working hard to bring you this feature. Check back later!" 
}: ComingSoonProps) {
  return (
    <div className="container" style={{ padding: '6rem 1.5rem', display: 'flex', justifyContent: 'center', textAlign: 'center', minHeight: '60vh', alignItems: 'center' }}>
      <div style={{ maxWidth: '600px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚀</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
          {description}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button href="/" variant="primary">Return Home</Button>
          <Button href="/dashboard" variant="secondary">Go to Dashboard</Button>
        </div>
      </div>
    </div>
  );
}
