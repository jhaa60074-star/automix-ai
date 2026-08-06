import React from 'react';
import StatCard from '@/components/automations/StatCard';
import Button from '@/components/Button';

export const metadata = {
  title: 'AI Usage | Admin Panel',
  description: 'Monitor AI API usage in AutrixGPT',
};

export default function AdminAIUsagePage() {
  const providers = [
    { name: 'OpenAI', models: 'gpt-4o, gpt-3.5-turbo', requests: '124,500', tokens: '8.4M', cost: '$420.50', status: 'Healthy' },
    { name: 'OpenRouter', models: 'claude-3.5-sonnet, gemini-1.5-pro', requests: '45,200', tokens: '4.2M', cost: '$180.25', status: 'Healthy' },
    { name: 'Ollama (Self-Hosted)', models: 'llama3, mistral', requests: '18,400', tokens: '1.6M', cost: '$0.00', status: 'Warning - High Load' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="section-title" style={{ margin: '0 0 0.5rem 0' }}>AI Usage Dashboard</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Monitor API consumption and estimated costs.</p>
        </div>
        <Button variant="primary">Export Report</Button>
      </div>

      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard title="Total Tokens" value="14.2M" trend="45% vs last month" trendUp={true} />
        <StatCard title="Total Requests" value="188,100" trend="28% vs last month" trendUp={true} />
        <StatCard title="Estimated API Cost" value="$600.75" trend="35% vs last month" trendUp={false} />
        <StatCard title="Total Errors" value="142" trend="0.08% error rate" trendUp={true} />
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Provider Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Provider</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Models Used</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Requests</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Tokens (M)</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Est. Cost</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.models}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.requests}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.tokens}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{p.cost}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem',
                      backgroundColor: p.status === 'Healthy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: p.status === 'Healthy' ? 'var(--success-color)' : '#d97706'
                    }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
