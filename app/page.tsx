import Link from 'next/link';
import Button from '@/components/Button';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            The Intelligent <span className="text-gradient">Automation Engine</span><br />
            For Your Business
          </h1>
          <p className="hero-subtitle">
            Seamlessly chat with an AI assistant, analyze complex files, research data, and deploy automated workflows across Instagram, WhatsApp, Gmail, and more.
          </p>
          <div className="hero-actions">
            <Button href="/signup" variant="primary" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>Start Now</Button>
            <Button href="/automations" variant="secondary" style={{ padding: '0.875rem 2rem', fontSize: '1.1rem' }}>Explore Automations</Button>
          </div>
          
          <div style={{ marginTop: '4rem', maxWidth: '900px', margin: '4rem auto 0' }}>
            {/* Visual AI Assistant Preview Placeholder */}
            <div className="feature-visual" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ background: 'var(--background-secondary)', padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
              </div>
              <div style={{ padding: '2rem', textAlign: 'left', minHeight: '300px', background: 'var(--card-bg)' }}>
                <div style={{ background: 'var(--background-secondary)', padding: '1rem', borderRadius: '8px', maxWidth: '80%', marginBottom: '1rem' }}>
                  <strong>User:</strong> Can you analyze the Q3 sales report and send a summary to my Slack?
                </div>
                <div style={{ background: 'var(--primary-color)', color: 'white', padding: '1rem', borderRadius: '8px', maxWidth: '80%', marginLeft: 'auto' }}>
                  <strong>AUTRIXGPT AI:</strong> I've analyzed the report. Sales are up 14%. I have prepared the summary. Shall I send it to the #executive channel?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Everything you need to automate</h2>
            <p className="section-subtitle">
              From deep research and file analysis to cross-platform business automations, AUTRIXGPT AI connects the dots.
            </p>
          </div>
          
          <div className="grid-4">
            <div className="card">
              <div className="card-icon">💬</div>
              <h3 className="card-title">AI Assistant</h3>
              <p className="card-desc">Advanced conversational AI for problem-solving and task management.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/?openChat=true" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-icon">🔍</div>
              <h3 className="card-title">Research & Analysis</h3>
              <p className="card-desc">Extract insights from vast amounts of data across multiple connected sources.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/?openChat=true" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-icon">📄</div>
              <h3 className="card-title">File Analysis</h3>
              <p className="card-desc">Instantly analyze PDFs, Excel sheets, CSVs, and documents.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/?openChat=true" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-icon">⚡</div>
              <h3 className="card-title">Business Automations</h3>
              <p className="card-desc">Connect and automate Instagram, WhatsApp, Gmail, Shopify, and more.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/automations" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Deep Dive */}
      <section className="section section-bg-alt">
        <div className="container">
          <div className="feature-layout">
            <div className="feature-content">
              <h2 className="section-title">Your Conversational Co-pilot</h2>
              <p className="section-subtitle" style={{ margin: '0 0 2rem 0' }}>
                Chat naturally with your data. The AUTRIXGPT AI Assistant supports PDF, Excel, CSV, DOCX, and Image uploads. Ask questions, analyze complex data, perform deep research, and generate reports.
              </p>
              <ul style={{ listStyleType: 'none', marginBottom: '2rem' }}>
                <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>✓</span> PDF & Excel Export</li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>✓</span> Direct Google Sheets integration</li>
                <li style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}><span>✓</span> Intelligent data extraction</li>
              </ul>
              <Button href="/?openChat=true">Explore AI Assistant</Button>
            </div>
            <div className="feature-visual" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🤖</div>
              <h3>ChatGPT-Style Interface</h3>
              <p style={{ color: 'var(--text-secondary)' }}>(Frontend Preview only for Phase 1)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Research & File Analysis */}
      <section className="section">
        <div className="container">
          <div className="feature-layout reverse">
            <div className="feature-content">
              <h2 className="section-title">Turn raw files into actionable insights</h2>
              <p className="section-subtitle" style={{ margin: '0 0 2rem 0' }}>
                Upload your files and let AUTRIXGPT AI read, analyze, and interpret them. You just ask the questions, and the AI generates the results.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--background-secondary)', borderRadius: '4px' }}>PDF</span>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--background-secondary)', borderRadius: '4px' }}>Excel</span>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--background-secondary)', borderRadius: '4px' }}>CSV</span>
                <span style={{ padding: '0.5rem 1rem', background: 'var(--background-secondary)', borderRadius: '4px' }}>DOCX</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button href="/?openChat=true">Explore Research</Button>
                <Button href="/?openChat=true" variant="secondary">Learn About File Analysis</Button>
              </div>
            </div>
            <div className="feature-visual" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
              <h4>The Workflow</h4>
              <div style={{ margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link href="/?openChat=true" style={{ padding: '1rem', background: 'var(--background-secondary)', borderRadius: '8px', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'background-color 0.2s', cursor: 'pointer' }}>1. Upload / Connect</Link>
                <Link href="/?openChat=true" style={{ padding: '1rem', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', display: 'block', transition: 'opacity 0.2s', cursor: 'pointer' }}>2. AI Analyzes & Researches</Link>
                <Link href="/?openChat=true" style={{ padding: '1rem', background: 'var(--background-secondary)', borderRadius: '8px', textDecoration: 'none', color: 'inherit', display: 'block', transition: 'background-color 0.2s', cursor: 'pointer' }}>3. Generate & Export Results</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Website Connection (Future Phase) */}
      <section className="section section-bg-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-color)', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem' }}>Coming Soon</span>
          <h2 className="section-title">Connect your Website directly</h2>
          <p className="section-subtitle" style={{ marginBottom: '2rem' }}>
            Soon you will be able to securely connect your website's data source directly to AUTRIXGPT AI. The AI will understand your live data and execute automated actions instantly.
          </p>
          <Button href="/services/website-connection" variant="secondary">Learn About Website Connection</Button>
        </div>
      </section>

      {/* Automations Showcase */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Automations</h2>
            <p className="section-subtitle">
              Connect your favorite platforms and let AUTRIXGPT AI handle the repetitive tasks.
            </p>
          </div>

          <div className="grid-3">
            <div className="card">
              <div className="card-icon">📸</div>
              <h3 className="card-title">Instagram</h3>
              <p className="card-desc">Auto DM replies, Comment-to-DM, keyword triggers, and custom message workflows.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/automations/instagram" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">💬</div>
              <h3 className="card-title">WhatsApp</h3>
              <p className="card-desc">AI customer support replies, product inquiries, and seamless business workflows.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/automations/whatsapp" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">📧</div>
              <h3 className="card-title">Gmail</h3>
              <p className="card-desc">AI-assisted email replies, categorization, smart summaries, and notifications.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/automations/gmail" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">✈️</div>
              <h3 className="card-title">Telegram</h3>
              <p className="card-desc">Advanced bot automation, smart AI replies, and custom channel workflows.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/automations/telegram" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">🛍️</div>
              <h3 className="card-title">Shopify</h3>
              <p className="card-desc">Automate order updates, product workflows, and personalized customer interactions.</p>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <Link href="/automations/shopify" className="btn btn-primary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Start Now</Link>
                <Link href="/help-center" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', flex: 1, textAlign: 'center', fontSize: '0.9rem' }}>Help Center</Link>
              </div>
            </div>
            <div className="card">
              <div className="card-icon">📊</div>
              <h3 className="card-title">Google Workspace</h3>
              <p className="card-desc">Read/write Sheets data, manage Drive files, and automate Calendar scheduling.</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Link href="/automations/google-sheets" className="card-link" style={{ fontSize: '0.875rem' }}>Sheets</Link>
                <Link href="/automations/google-drive" className="card-link" style={{ fontSize: '0.875rem' }}>Drive</Link>
                <Link href="/automations/google-calendar" className="card-link" style={{ fontSize: '0.875rem' }}>Calendar</Link>
              </div>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              * Integrations require user authorization and specific setup steps.
            </p>
            <Button href="/automations">View All Automations</Button>
          </div>
        </div>
      </section>

      {/* Trust & Social Proof (Configurable Placeholders) */}
      <section className="section section-bg-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="section-title">Trusted by growing businesses</h2>
          <p className="section-subtitle">
            Built for scale, security, and simplicity.
          </p>
          
          <div className="trust-metrics">
            <div className="metric">
              <div className="metric-value">Coming Soon</div>
              <div className="metric-label">Active Users</div>
            </div>
            <div className="metric">
              <div className="metric-value">0+</div>
              <div className="metric-label">Messages Processed</div>
            </div>
            <div className="metric">
              <div className="metric-value">0+</div>
              <div className="metric-label">Automations Run</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
