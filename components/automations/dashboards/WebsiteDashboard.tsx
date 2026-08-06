'use client';
import React, { useState } from 'react';
import StatCard from '@/components/automations/StatCard';
import ToggleSwitch from '@/components/automations/ToggleSwitch';
import Button from '@/components/Button';

export default function WebsiteDashboard({ automation, user }: any) {
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
            <span style={{ fontWeight: 600 }}>{connected ? 'Widget Active on example.com (via Activepieces)' : 'Disconnected'}</span>
            {connected && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active Workflows: 2 | Last sync: Just now</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant="secondary" onClick={() => setConnected(!connected)}>
            {connected ? 'Disconnect' : 'Connect Website'}
          </Button>
          <ToggleSwitch checked={isActive} onChange={setIsActive} label={isActive ? 'Active' : 'Paused'} />
        </div>
      </div>

      {/* Analytics */}
      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard title="AI Chats Started" value="1,402" trend="15% vs last week" trendUp={true} />
        <StatCard title="Forms Submitted" value="384" trend="5% vs last week" trendUp={true} />
        <StatCard title="Leads Generated" value="315" trend="8% vs last week" trendUp={true} />
        <StatCard title="Button Clicks" value="2,144" trend="2% vs last week" trendUp={true} />
      </div>

      {/* Settings Grid */}
      <div className="grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Widget Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>AI Chat Widget</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enable the interactive AI chat bubble on your site</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Form Automation</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automatically capture inputs from HTML forms</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>WhatsApp Trigger</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Show a 'Chat on WhatsApp' button instead of web chat</p>
              </div>
              <ToggleSwitch checked={false} onChange={() => {}} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Installation</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Paste this HTML Script into the <code>&lt;head&gt;</code> tag of your WordPress, Webflow, Shopify, or custom HTML site.
            </p>
            
            <div style={{ position: 'relative' }}>
              <textarea 
                readOnly 
                rows={4} 
                defaultValue={`<script src="https://autrixgpt.com/widget.js" data-id="${user?.id || 'demo'}"></script>`} 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: '#1e1e1e', color: '#d4d4d4', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'none' }} 
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Incoming Webhook (Advanced)</label>
              <input type="text" readOnly defaultValue={`https://autrixgpt.com/api/automation/webhook/website?source=custom`} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)', fontSize: '0.85rem' }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
