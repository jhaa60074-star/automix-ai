import React from 'react';
import Button from '@/components/Button';

export const metadata = {
  title: 'Activepieces Management | Admin Panel',
  description: 'Manage active workflows in AutrixGPT',
};

export default function AdminAutomationsPage() {
  const workflows = [
    { id: 'wf-1', name: 'Instagram Comment to DM', service: 'Instagram', trigger: 'New Comment', status: 'active', lastRun: '2 mins ago', success: 1205, failure: 2 },
    { id: 'wf-2', name: 'WhatsApp Lead Capture', service: 'WhatsApp', trigger: 'New Message', status: 'active', lastRun: '15 mins ago', success: 840, failure: 0 },
    { id: 'wf-3', name: 'Shopify Abandoned Cart', service: 'Shopify', trigger: 'Cart Abandoned', status: 'inactive', lastRun: '2 days ago', success: 156, failure: 12 },
    { id: 'wf-4', name: 'Gmail Support Auto-Label', service: 'Gmail', trigger: 'New Email', status: 'error', lastRun: '1 hour ago', success: 4230, failure: 45 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="section-title" style={{ margin: '0 0 0.5rem 0' }}>Activepieces Workflows</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Global overview of automation engine status.</p>
        </div>
        <Button variant="primary">Sync Engine</Button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Workflow Name</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Service</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Trigger Type</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Last Run</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Success / Fail</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((wf) => (
              <tr key={wf.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{wf.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{wf.service}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{wf.trigger}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', color: '#fff',
                    backgroundColor: wf.status === 'active' ? 'var(--success-color)' : wf.status === 'error' ? 'var(--error-color)' : 'var(--text-muted)'
                  }}>
                    {wf.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{wf.lastRun}</td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--success-color)' }}>{wf.success}</span> / <span style={{ color: wf.failure > 0 ? 'var(--error-color)' : 'inherit' }}>{wf.failure}</span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>View Logs</Button>
                  <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Manage</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
