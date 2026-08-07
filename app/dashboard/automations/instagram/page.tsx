import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/Button'

export const metadata = {
  title: 'Instagram Automations | AutrixGPT',
  description: 'Manage your Instagram automations and campaigns',
}

export default async function InstagramAutomationsPage() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch connected account
  const { data: accounts } = await supabase
    .from('instagram_connected_accounts')
    .select('*')
    .eq('user_id', user.id)
    .limit(1)

  const account = accounts && accounts.length > 0 ? accounts[0] : null

  // Fetch campaigns if account exists
  let campaigns: any[] = []
  if (account) {
    const { data: fetchedCampaigns } = await supabase
      .from('instagram_campaigns')
      .select('*, instagram_analytics(*)')
      .eq('instagram_account_id', account.id)
      .order('created_at', { ascending: false })
    
    if (fetchedCampaigns) {
      campaigns = fetchedCampaigns
    }
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">Instagram Automations</h1>
          <p className="section-subtitle" style={{ marginLeft: 0 }}>
            Automate comments and DMs to grow your audience.
          </p>
        </div>
        {account && (
          <Button href="/dashboard/automations/instagram/builder" variant="primary">
            + New Automation
          </Button>
        )}
      </div>

      {!account ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
          <h3>Connect your Instagram</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            To start building automations, connect your professional Instagram account linked to a Facebook Page.
          </p>
          <a href="/api/instagram/connect" className="btn btn-primary" style={{ display: 'inline-block', width: '100%', maxWidth: '300px' }}>
            Connect with Facebook
          </a>
        </div>
      ) : (
        <>
          <div className="card" style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--background-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', overflow: 'hidden' }}>
              {account.profile_picture_url ? (
                <img src={account.profile_picture_url} alt={account.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                '👤'
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.25rem' }}>@{account.username}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                Connected to Facebook Page: {account.facebook_page_name || 'Unknown'}
              </p>
              <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '0.8rem', fontWeight: '500' }}>
                Active Connection
              </span>
            </div>
            <div>
              <form action="/api/instagram/disconnect" method="POST">
                <Button variant="secondary">Disconnect</Button>
              </form>
            </div>
          </div>

          <h3 style={{ marginBottom: '1.5rem' }}>Your Campaigns</h3>
          
          {campaigns.length === 0 ? (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: 0.5 }}>🚀</div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't created any campaigns yet.</p>
              <Button href="/dashboard/automations/instagram/builder" variant="secondary">
                Create your first automation
              </Button>
            </div>
          ) : (
            <div className="grid-3">
              {campaigns.map(campaign => (
                <div key={campaign.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h4 style={{ fontWeight: '600' }}>{campaign.name}</h4>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontWeight: '600', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '4px',
                      background: campaign.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'var(--background-secondary)',
                      color: campaign.status === 'active' ? '#10b981' : 'var(--text-muted)'
                    }}>
                      {campaign.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {campaign.reel_thumbnail && (
                    <div style={{ width: '100%', height: '120px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', background: '#111' }}>
                      <img src={campaign.reel_thumbnail} alt="Reel" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{campaign.instagram_analytics?.[0]?.comments_detected || 0}</strong><br />
                      <span style={{ fontSize: '0.8rem' }}>Comments</span>
                    </div>
                    <div>
                      <strong style={{ color: 'var(--text-primary)' }}>{campaign.instagram_analytics?.[0]?.dms_sent || 0}</strong><br />
                      <span style={{ fontSize: '0.8rem' }}>DMs</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                    <Button href={`/dashboard/automations/instagram/builder?id=${campaign.id}`} variant="secondary" style={{ flex: 1, textAlign: 'center', padding: '0.5rem' }}>
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
