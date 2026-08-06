'use client';
import React, { useState, useEffect } from 'react';
import StatCard from '@/components/automations/StatCard';
import ToggleSwitch from '@/components/automations/ToggleSwitch';
import Button from '@/components/Button';

export default function InstagramDashboard({ automation, user }: any) {
  const [isActive, setIsActive] = useState(false);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accountDetails, setAccountDetails] = useState<any>(null);

  useEffect(() => {
    // Check connection status
    fetch('/api/auth/facebook/status')
      .then(res => res.json())
      .then(data => {
        if (data.connected) {
          setConnected(true);
          setAccountDetails(data.account);
          setIsActive(true);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleConnect = () => {
    window.location.href = '/api/auth/facebook';
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect? This will stop all active automations.')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/facebook/disconnect', { method: 'POST' });
      if (res.ok) {
        setConnected(false);
        setAccountDetails(null);
        setIsActive(false);
      }
    } catch (e) {
      console.error('Failed to disconnect');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading connection status...</div>
      </div>
    );
  }

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
            <span style={{ fontWeight: 600 }}>{connected ? 'Connected via Activepieces' : 'Disconnected'}</span>
            {accountDetails?.username && (
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>@{accountDetails.username}</span>
            )}
            {connected && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Active Workflows: 2 | Last sync: Just now</span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {connected ? (
            <Button variant="secondary" onClick={handleDisconnect}>Disconnect</Button>
          ) : (
            <Button variant="primary" onClick={handleConnect}>Connect Instagram</Button>
          )}
          <ToggleSwitch checked={isActive} onChange={setIsActive} label={isActive ? 'Active' : 'Paused'} />
        </div>
      </div>

      {/* Analytics */}
      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard title="Comments Received" value="1,248" trend="12% vs last week" trendUp={true} />
        <StatCard title="Auto DMs Sent" value="842" trend="8% vs last week" trendUp={true} />
        <StatCard title="Links Clicked" value="315" trend="4% vs last week" trendUp={true} />
        <StatCard title="Conversion Rate" value="25.2%" trend="1.2% vs last week" trendUp={false} />
      </div>

      {/* Settings Grid */}
      <div className="grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Trigger Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Comment to DM</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Auto-reply to comments with a DM</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Keyword Trigger</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trigger workflows based on specific words</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Target Keywords (comma separated)</label>
              <input type="text" defaultValue="LINK, INFO, PRICE" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)' }} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>AI Auto Reply Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Smart AI Replies</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Use AI Engine to answer generic questions</p>
              </div>
              <ToggleSwitch checked={false} onChange={() => {}} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Welcome DM Message</label>
              <textarea rows={4} defaultValue="Hi there! Thanks for reaching out. How can I help you today?" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="secondary">Test Workflow</Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
