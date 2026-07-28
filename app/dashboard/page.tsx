import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'
import Button from '../../components/Button'

export const metadata = {
  title: 'Dashboard | Automik',
  description: 'Your Automik Dashboard',
}

export default async function DashboardPage() {
  const supabase = createClient()
  
  // Protect the route
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch the user's profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="container" style={{ padding: '4rem 1.5rem' }}>
      <div className="section-header" style={{ marginBottom: '3rem', textAlign: 'left' }}>
        <h1 className="section-title">Dashboard</h1>
        <p className="section-subtitle" style={{ marginLeft: 0 }}>
          Welcome back, {profile?.full_name || user.email}!
        </p>
      </div>

      <div className="grid-3">
        <div className="card" style={{ padding: '2rem' }}>
          <div className="card-icon" style={{ fontSize: '2rem' }}>💬</div>
          <h3>AI Assistant</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Chat with your data securely.</p>
          <Button href="/services/ai-assistant" variant="secondary" style={{ width: '100%' }}>Launch App</Button>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div className="card-icon" style={{ fontSize: '2rem' }}>📄</div>
          <h3>File Analysis</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Upload PDFs, Excel, CSVs.</p>
          <Button href="/services/file-analysis" variant="secondary" style={{ width: '100%' }}>Launch App</Button>
        </div>

        <div className="card" style={{ padding: '2rem' }}>
          <div className="card-icon" style={{ fontSize: '2rem' }}>⚡</div>
          <h3>My Automations</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Manage active workflows.</p>
          <Button href="/automations" variant="secondary" style={{ width: '100%' }}>Manage</Button>
        </div>
      </div>
      
      <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--background-secondary)', borderRadius: 'var(--border-radius-lg)' }}>
        <h3>Account Overview</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Email: {user.email}</p>
        <p style={{ color: 'var(--text-secondary)' }}>User ID: {user.id}</p>
      </div>
    </div>
  )
}
