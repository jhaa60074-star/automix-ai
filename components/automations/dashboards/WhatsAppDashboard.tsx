'use client';
import React, { useState } from 'react';
import StatCard from '@/components/automations/StatCard';
import ToggleSwitch from '@/components/automations/ToggleSwitch';
import Button from '@/components/Button';

export default function WhatsAppDashboard({ automation, user }: any) {
  const [isActive, setIsActive] = useState(true);
  const [connected, setConnected] = useState(true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Status Bar */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: connected ? 'var(--success-color, #10b981)' : 'var(--error-color, #ef4444)'
          }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600 }}>{connected ? '+1 (555) 123-4567 (Connected via Activepieces)' : 'Disconnected'}</span>
            {connected && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active Workflows: 3 | Last sync: Just now</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="secondary" onClick={() => setConnected(!connected)}>
            {connected ? 'Disconnect' : 'Connect WhatsApp Business'}
          </Button>
          <ToggleSwitch checked={isActive} onChange={setIsActive} label={isActive ? 'Active' : 'Paused'} />
        </div>
      </div>

      {/* Analytics */}
      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard title="Messages Received" value="4,821" trend="24% vs last week" trendUp={true} />
        <StatCard title="Replies Sent" value="4,650" trend="21% vs last week" trendUp={true} />
        <StatCard title="Leads Captured" value="184" trend="12% vs last week" trendUp={true} />
        <StatCard title="Delivery Rate" value="99.8%" trend="0.1% vs last week" trendUp={true} />
      </div>

      {/* Settings Grid */}
      <div className="grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>AI Configuration</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>AI Auto Reply</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Use AI Engine to answer generic questions</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>FAQ Automation</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Prioritize FAQ extraction from your documents</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Lead Capture Flow</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automatically ask for email/name when intent is detected</p>
              </div>
              <ToggleSwitch checked={false} onChange={() => {}} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Message Templates</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Welcome Message</label>
              <textarea rows={3} defaultValue="Hello! Welcome to our store. How can we help you today?" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)', resize: 'vertical' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Broadcast Preparation</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="Campaign Name" style={{ flexGrow: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)' }} />
                <Button variant="secondary">Draft Broadcast</Button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="primary">Test Automation</Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
