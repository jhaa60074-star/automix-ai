'use client';
import React, { useState } from 'react';
import StatCard from '../StatCard';
import ToggleSwitch from '../ToggleSwitch';
import Button from '../../Button';

export default function ShopifyDashboard({ automation, user }: any) {
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
          <span style={{ fontWeight: 600 }}>{connected ? 'Connected to store.myshopify.com' : 'Disconnected'}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Button variant={connected ? 'secondary' : 'primary'} onClick={() => setConnected(!connected)}>
            {connected ? 'Manage App' : 'Connect Shopify'}
          </Button>
          <ToggleSwitch checked={isActive} onChange={setIsActive} label={isActive ? 'Active' : 'Paused'} />
        </div>
      </div>

      {/* Analytics */}
      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <StatCard title="Orders Processed" value="284" trend="12% vs last week" trendUp={true} />
        <StatCard title="Messages Sent" value="842" trend="8% vs last week" trendUp={true} />
        <StatCard title="Recovered Carts" value="38" trend="14% vs last week" trendUp={true} />
        <StatCard title="Revenue Recovered" value="$1,420" trend="5% vs last week" trendUp={true} />
      </div>

      {/* Settings Grid */}
      <div className="grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>E-commerce Automation</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Order Confirmation</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Send WhatsApp/Email receipts automatically</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Shipping Updates</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Notify customers when order status changes</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Abandoned Cart Recovery</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Send reminders to recover lost sales</p>
              </div>
              <ToggleSwitch checked={false} onChange={() => {}} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Customer Support AI</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>AI Order Tracking</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Allow customers to ask AI "Where is my order?"</p>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Product Recommendation</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI suggests products based on chat history</p>
              </div>
              <ToggleSwitch checked={false} onChange={() => {}} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="secondary">Test Support Flow</Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
