'use client';
import React, { useState } from 'react';
import StatCard from '../StatCard';
import ToggleSwitch from '../ToggleSwitch';
import Button from '../../Button';

export default function GmailDashboard({ automation, user }: any) {
  const [isActive, setIsActive] = useState(false);
  const [connected, setConnected] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Status Bar */}
      <div className="card" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: connected ? 'var(--success-color, #10b981)' : 'var(--error-color, #ef4444)'
          }} />
          <span style={{ fontWeight: 600 }}>{connected ? 'Connected as user@domain.com' : 'Disconnected'}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant={connected ? 'secondary' : 'primary'} onClick={() => setConnected(!connected)}>
            {connected ? 'Manage Account' : 'Connect Gmail'}
          </Button>
          <ToggleSwitch checked={isActive} onChange={setIsActive} label={isActive ? 'Active' : 'Paused'} />
        </div>
      </div>

      {/* Analytics */}
      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard title="Emails Received" value="1,204" trend="10% vs last week" trendUp={true} />
        <StatCard title="Drafts Generated" value="482" trend="15% vs last week" trendUp={true} />
        <StatCard title="Auto Replies" value="120" trend="2% vs last week" trendUp={true} />
        <StatCard title="Attachments Analyzed" value="64" trend="12% vs last week" trendUp={true} />
      </div>

      {/* Settings Grid */}
      <div className="grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Inbox Automation</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>AI Email Summary</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate daily summaries of unread important emails</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Smart Categorization</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auto-label emails into Support, Lead, or Spam</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Attachment Analysis</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Extract text and data from PDFs and spreadsheets</p>
              </div>
              <ToggleSwitch checked={false} onChange={() => {}} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Auto Responders</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Draft Generator</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI writes draft replies for you to review before sending</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Direct Auto Reply</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Send AI responses instantly without review (Use with caution)</p>
              </div>
              <ToggleSwitch checked={false} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="secondary">Test Draft Generator</Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
