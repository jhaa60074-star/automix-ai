"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Button from '@/components/Button'

function InstagramBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get('id')
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [connectionState, setConnectionState] = useState<'LOADING' | 'NOT_CONNECTED' | 'CONNECTED' | 'TOKEN_EXPIRED'>('LOADING')
  
  // Campaign State
  const [name, setName] = useState('New Campaign')
  const [reel, setReel] = useState<any>(null)
  const [keywords, setKeywords] = useState<string[]>(['link'])
  const [template, setTemplate] = useState("Thanks for your comment!\n\nFollow us first and access your free resource here:\n\n{{dynamic_link}}")
  const [followGate, setFollowGate] = useState(false)
  const [delay, setDelay] = useState(0) // seconds
  const [maxDms, setMaxDms] = useState(100)
  
  // UI State
  const [showReelModal, setShowReelModal] = useState(false)
  const [newKeyword, setNewKeyword] = useState('')
  
  // Reel Fetching State
  const [apiReels, setApiReels] = useState<any[]>([])
  const [reelsLoading, setReelsLoading] = useState(false)
  const [reelsError, setReelsError] = useState('')

  // Template State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [templateSavedText, setTemplateSavedText] = useState("Thanks for your comment!\n\nFollow us first and access your free resource here:\n\n{{dynamic_link}}")
  const [savingTemplate, setSavingTemplate] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('instagram_connected_accounts').select('id').eq('user_id', user.id).limit(1)
        if (data && data.length > 0) {
          setConnectionState('CONNECTED')
        } else {
          setConnectionState('NOT_CONNECTED')
          setLoading(false)
          return
        }
      } else {
        setConnectionState('NOT_CONNECTED')
        setLoading(false)
        return
      }

      if (campaignId) {
        await loadCampaign(campaignId)
      } else {
        setLoading(false)
        // Only auto-open if it wasn't triggered by an OAuth callback (to avoid duplicate triggers)
        if (searchParams.get('autoReel') !== 'true') {
          setShowReelModal(true)
        }
      }
    }
    init()
    
    // Automatically open reel selector if redirected from successful OAuth
    if (searchParams.get('autoReel') === 'true') {
      setShowReelModal(true)
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.searchParams.delete('autoReel')
        window.history.replaceState({}, '', url.toString())
      }
    }
  }, [campaignId, searchParams])

  useEffect(() => {
    if (showReelModal && apiReels.length === 0 && !reelsError) {
      fetchReels()
    }
  }, [showReelModal])

  const fetchReels = async () => {
    setReelsLoading(true)
    setReelsError('')
    try {
      const res = await fetch('/api/instagram/reels')
      const data = await res.json()
      if (!res.ok) {
        if (data.status === 'TOKEN_EXPIRED') {
          setConnectionState('TOKEN_EXPIRED')
          setShowReelModal(false)
          return
        }
        if (data.status === 'NOT_CONNECTED') {
          setConnectionState('NOT_CONNECTED')
          setShowReelModal(false)
          return
        }
        throw new Error(data.message || data.error || 'Failed to fetch reels')
      }
      setApiReels(data.reels || [])
    } catch (err: any) {
      setReelsError(err.message)
    } finally {
      setReelsLoading(false)
    }
  }

  const loadCampaign = async (id: string) => {
    setLoading(true)
    const { data: campaign } = await supabase
      .from('instagram_campaigns')
      .select('*, instagram_keywords(keyword), instagram_templates(*)')
      .eq('id', id)
      .single()
      
    if (campaign) {
      setName(campaign.name)
      setReel({ id: campaign.reel_id, thumbnail: campaign.reel_thumbnail })
      setFollowGate(campaign.follow_gate)
      setDelay(campaign.delay_seconds)
      setMaxDms(campaign.max_dms_per_day)
      
      if (campaign.instagram_keywords && campaign.instagram_keywords.length > 0) {
        setKeywords(campaign.instagram_keywords.map((k: any) => k.keyword))
      }
      if (campaign.template_id) {
        setSelectedTemplateId(campaign.template_id)
      }
      if (campaign.instagram_templates && campaign.instagram_templates.content) {
        setTemplate(campaign.instagram_templates.content)
        setTemplateSavedText(campaign.instagram_templates.content)
      }
    }
    setLoading(false)
  }

  const saveTemplateOnly = async () => {
    setSavingTemplate(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      if (selectedTemplateId) {
        const { error } = await supabase.from('instagram_templates')
          .update({ content: template })
          .eq('id', selectedTemplateId)
        if (error) throw error
      } else {
        const { data, error } = await supabase.from('instagram_templates')
          .insert({ user_id: user.id, name: `${name} Template`, content: template })
          .select().single()
        if (error) throw error
        if (data) {
          setSelectedTemplateId(data.id)
          if (campaignId) {
             await supabase.from('instagram_campaigns').update({ template_id: data.id }).eq('id', campaignId)
          }
        }
      }
      setTemplateSavedText(template)
      alert("Template saved!")
    } catch (err: any) {
      alert("Error saving template: " + err.message)
    } finally {
      setSavingTemplate(false)
    }
  }

  const handleSave = async (status = 'draft') => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: accounts } = await supabase
        .from('instagram_connected_accounts')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)

      const accountId = accounts?.[0]?.id

      if (!accountId) {
        alert("Please connect an Instagram account first.")
        setSaving(false)
        return
      }
      
      let finalTemplateId = selectedTemplateId

      // Auto-save template if no template ID is selected
      if (!finalTemplateId) {
        const { data, error } = await supabase.from('instagram_templates')
          .insert({ user_id: user.id, name: `${name} Template`, content: template })
          .select().single()
        if (error) throw error
        if (data) {
          finalTemplateId = data.id
          setSelectedTemplateId(data.id)
          setTemplateSavedText(template)
        }
      } else if (template !== templateSavedText) {
        // Auto update if changed
        await supabase.from('instagram_templates')
          .update({ content: template })
          .eq('id', finalTemplateId)
        setTemplateSavedText(template)
      }

      // Save Campaign
      const campaignData = {
        user_id: user.id,
        instagram_account_id: accountId,
        name,
        reel_id: reel?.id,
        reel_thumbnail: reel?.thumbnail_url || reel?.thumbnail,
        status,
        follow_gate: followGate,
        delay_seconds: delay,
        max_dms_per_day: maxDms,
        template_id: finalTemplateId
      }

      let cData
      if (campaignId) {
        const { data, error } = await supabase
          .from('instagram_campaigns')
          .update(campaignData)
          .eq('id', campaignId)
          .select()
          .single()
        if (error) throw error
        cData = data
      } else {
        const { data, error } = await supabase
          .from('instagram_campaigns')
          .insert(campaignData)
          .select()
          .single()
        if (error) throw error
        cData = data
      }

      // Save Keywords
      await supabase.from('instagram_keywords').delete().eq('campaign_id', cData.id)
      
      const keywordsToInsert = keywords.map(kw => ({
        campaign_id: cData.id,
        keyword: kw
      }))
      
      if (keywordsToInsert.length > 0) {
        await supabase.from('instagram_keywords').insert(keywordsToInsert)
      }

      alert("Campaign saved successfully!")
      router.push('/dashboard/automations/instagram')
      
    } catch (err: any) {
      console.error(err)
      alert("Error saving campaign: " + err.message)
    } finally {
      setSaving(false)
    }
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim().toLowerCase())) {
      setKeywords([...keywords, newKeyword.trim().toLowerCase()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw))
  }

  if (connectionState === 'LOADING' || loading) {
    return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading builder...</div>
  }

  if (connectionState === 'NOT_CONNECTED') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '4rem 2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>📱</span>
          <h2>Connect Instagram Business</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Connect your Instagram Business account to start using comment automation.
          </p>
          <a href="/api/instagram/connect" className="btn btn-primary" style={{ display: 'inline-block' }}>
            Continue with Facebook
          </a>
        </div>
      </div>
    )
  }

  if (connectionState === 'TOKEN_EXPIRED') {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '4rem 2rem' }}>
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⚠️</span>
          <h2>Your Instagram session has expired. Please reconnect.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your access token has expired and could not be automatically refreshed.
          </p>
          <a href="/api/instagram/connect" className="btn btn-primary" style={{ display: 'inline-block' }}>
            Reconnect Instagram
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1000px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button href="/dashboard/automations/instagram" variant="secondary" style={{ padding: '0.5rem' }}>← Back</Button>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              fontSize: '1.5rem', 
              fontWeight: '700',
              color: 'var(--text-primary)',
              outline: 'none',
              borderBottom: '1px dashed var(--border-color)',
              width: '100%',
              maxWidth: '300px'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => handleSave('draft')} disabled={saving}>
            Save Draft
          </Button>
          <Button variant="primary" onClick={() => handleSave('active')} disabled={saving}>
            Activate Automation
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', gridAutoFlow: 'row' }} className="builder-grid">
        
        {/* Step 1: Reel Selection */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#3b82f6', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
            <h3 style={{ margin: 0 }}>Select Reel</h3>
          </div>
          
          {!reel ? (
            <div onClick={() => setShowReelModal(true)} style={{ border: '2px dashed var(--border-color)', borderRadius: '8px', padding: '3rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} className="hover-highlight">
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📱</span>
              <p style={{ color: 'var(--text-secondary)' }}>Click to select a reel from your account</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', background: 'var(--background-secondary)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ width: '80px', height: '120px', borderRadius: '4px', overflow: 'hidden', background: '#000' }}>
                <img src={reel.thumbnail_url || reel.thumbnail} alt="Selected Reel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Reel Selected</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>ID: {reel.id}</p>
                <Button variant="secondary" onClick={() => setShowReelModal(true)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>Change Reel</Button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Keywords */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#3b82f6', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
            <h3 style={{ margin: 0 }}>Trigger Keywords</h3>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Automation runs when a comment contains any of these keywords.</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {keywords.map(kw => (
              <span key={kw} style={{ background: 'var(--background-secondary)', padding: '0.4rem 0.8rem', borderRadius: '2rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {kw}
                <button onClick={() => removeKeyword(kw)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem', padding: 0 }}>&times;</button>
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addKeyword()}
              placeholder="e.g. price, link, detail"
              className="form-input"
              style={{ flex: 1 }}
            />
            <Button variant="secondary" onClick={addKeyword}>Add</Button>
          </div>
        </div>

        {/* Step 3: DM Message Template (Simplified) */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#3b82f6', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
            <h3 style={{ margin: 0 }}>DM Message Template</h3>
          </div>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Supported variables: {' '}
            <span style={{ color: '#10b981' }}>{`{{username}}`}</span>, <span style={{ color: '#3b82f6' }}>{`{{dynamic_link}}`}</span>
          </p>
          
          <textarea 
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="form-input"
            style={{ width: '100%', minHeight: '150px', resize: 'vertical', fontFamily: 'inherit', marginBottom: '1rem' }}
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button variant="secondary" onClick={saveTemplateOnly} disabled={savingTemplate || template === templateSavedText}>
              {savingTemplate ? 'Saving...' : 'Save Template'}
            </Button>
            {template !== templateSavedText && (
              <Button variant="secondary" onClick={() => setTemplate(templateSavedText)}>
                Cancel
              </Button>
            )}
          </div>
        </div>

        {/* Step 4: Follow Gate & Settings */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#3b82f6', color: '#fff', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>4</div>
            <h3 style={{ margin: 0 }}>Advanced Settings</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '1rem', background: 'var(--background-secondary)', borderRadius: '8px' }}>
              <div>
                <span style={{ fontWeight: '600', display: 'block' }}>Follow Gate</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Require user to follow you before receiving the link</span>
              </div>
              <input 
                type="checkbox" 
                checked={followGate}
                onChange={e => setFollowGate(e.target.checked)}
                style={{ width: '20px', height: '20px' }}
              />
            </label>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Delay (Seconds)</label>
              <select className="form-input" style={{ width: '100%' }} value={delay} onChange={e => setDelay(Number(e.target.value))}>
                <option value={0}>Instant</option>
                <option value={30}>30 Seconds</option>
                <option value={60}>1 Minute</option>
                <option value={300}>5 Minutes</option>
                <option value={900}>15 Minutes</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Max DMs per day</label>
              <input 
                type="number" 
                value={maxDms}
                onChange={e => setMaxDms(Number(e.target.value))}
                className="form-input"
                style={{ width: '100%' }}
                min={1}
                max={1000}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Reel Selector Modal */}
      {showReelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0 }}>Select a Reel</h2>
              <button onClick={() => setShowReelModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            </div>
            
            {reelsLoading ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: 'var(--text-secondary)' }}>Fetching reels from Instagram...</p>
              </div>
            ) : reelsError ? (
              <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed #ef4444', borderRadius: '8px' }}>
                <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{reelsError}</p>
                <a href="/api/instagram/connect" className="btn btn-primary" style={{ display: 'inline-block', marginRight: '1rem' }}>Reconnect Instagram</a>
                <Button variant="secondary" onClick={fetchReels}>Retry Fetching</Button>
              </div>
            ) : apiReels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '8px' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>No reels available on this Instagram Business account.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {apiReels.map(r => (
                  <div 
                    key={r.id} 
                    onClick={() => { setReel(r); setShowReelModal(false); }}
                    style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: reel?.id === r.id ? '2px solid #3b82f6' : '2px solid transparent', transition: 'all 0.2s' }}
                  >
                    <div style={{ width: '100%', aspectRatio: '9/16', background: '#111', position: 'relative' }}>
                      <img src={r.thumbnail_url || r.media_url || r.thumbnail} alt="Reel" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0.5rem', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', color: '#fff', fontSize: '0.8rem' }}>
                        {r.caption ? r.caption.substring(0, 20) + '...' : 'Reel ' + r.id}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 768px) {
          .builder-grid { grid-template-columns: 1fr 1fr !important; }
          .builder-grid > div:nth-child(3) { grid-column: span 2; }
          .builder-grid > div:nth-child(4) { grid-column: span 2; }
        }
        .hover-highlight:hover { background: var(--background-secondary); border-color: var(--text-muted) !important; }
      `}} />
    </div>
  )
}

export default function InstagramBuilderPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading builder...</div>}>
      <InstagramBuilderContent />
    </Suspense>
  )
}
