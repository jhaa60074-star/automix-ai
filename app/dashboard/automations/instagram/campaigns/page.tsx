'use client';
import React, { useState } from 'react';
import Button from '@/components/Button';
import ToggleSwitch from '@/components/automations/ToggleSwitch';
import Link from 'next/link';

export default function InstagramCampaignsPage() {
  const [autoComment, setAutoComment] = useState(true);
  const [followGate, setFollowGate] = useState(true);
  const [linkDelivery, setLinkDelivery] = useState(true);
  const [keywordTrigger, setKeywordTrigger] = useState(false);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <Link href="/dashboard/automations/instagram" style={{ color: 'var(--text-secondary)', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Instagram Dashboard
      </Link>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="section-title" style={{ margin: '0 0 0.5rem 0' }}>Instagram Growth Campaigns</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>Configure advanced automation funnels.</p>
        </div>
        <Button variant="primary">Create New Campaign</Button>
      </div>

      <div className="grid-2">
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Core Modules</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Auto Comment Reply</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Automatically reply to comments on specific reels/posts.</p>
              </div>
              <ToggleSwitch checked={autoComment} onChange={setAutoComment} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Follow Gate (Growth)</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Require users to follow you before receiving the resource DM.</p>
              </div>
              <ToggleSwitch checked={followGate} onChange={setFollowGate} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Link Delivery / DM</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Send a private DM with the requested link or resource.</p>
              </div>
              <ToggleSwitch checked={linkDelivery} onChange={setLinkDelivery} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 0.25rem 0' }}>Keyword Trigger</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Only trigger when comment contains specific keyword.</p>
              </div>
              <ToggleSwitch checked={keywordTrigger} onChange={setKeywordTrigger} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Campaign Configuration</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Select Reel/Post ID (Optional)</label>
              <input type="text" placeholder="e.g. CqXZ123456 or leave blank for all" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>DM Template Editor</label>
              <textarea 
                rows={5} 
                defaultValue={"Thanks for your comment!\n\nFollow us first and access your resource here:\n{{dynamic_link}}"} 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)', resize: 'vertical' }} 
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Use {'{{dynamic_link}}'} to insert the link from your Link Library.</p>
            </div>
            
            <div className="grid-2">
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Daily DM Limits</label>
                <input type="number" defaultValue="200" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' }}>Delay Settings (ms)</label>
                <input type="number" defaultValue="5000" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="primary">Save Draft</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
