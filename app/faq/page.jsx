'use client';
import { useState } from 'react';
import { faqData } from '../../data/faq';
import Button from '../../components/Button';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...faqData.map(group => group.category)];
  
  const filteredData = activeCategory === 'All' 
    ? faqData 
    : faqData.filter(group => group.category === activeCategory);

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div className="section-header">
        <h1 className="section-title">Frequently Asked Questions</h1>
        <p className="section-subtitle">
          Find answers to common questions about Automik, billing, and automations.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '3rem', justifyContent: 'center' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              border: '1px solid var(--border-color)',
              background: activeCategory === cat ? 'var(--primary-color)' : 'var(--background-secondary)',
              color: activeCategory === cat ? 'white' : 'var(--text-color)',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {filteredData.map((group, idx) => (
          <div key={idx}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-color)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              {group.category}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {group.items.map((item, itemIdx) => (
                <div key={itemIdx} className="card" style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: '0.75rem' }}>{item.question}</h3>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '4rem', padding: '3rem', background: 'var(--background-secondary)', borderRadius: 'var(--border-radius-lg)' }}>
        <h3 style={{ marginBottom: '1rem' }}>Still need help?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Our support team is always ready to assist you.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button href="/contact" variant="primary">Contact Support</Button>
          <Button href="/help" variant="secondary">Visit Help Center</Button>
        </div>
      </div>
    </div>
  );
}
