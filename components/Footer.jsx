import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="text-gradient" style={{ fontWeight: '700', fontSize: '1.5rem', display: 'block', marginBottom: '1rem' }}>AUTRIXGPT</span>
            <p style={{ color: 'var(--text-muted)' }}>The complete premium AI SaaS platform for business automation and research.</p>
          </div>
          
          <div className="footer-col">
            <h4>Product</h4>
            <Link href="/services/ai-assistant">AI Assistant</Link>
            <Link href="/services/research-analysis">Research & Analysis</Link>
            <Link href="/services/file-analysis">File Analysis</Link>
            <Link href="/automations">Automations</Link>
            <Link href="/services">Services</Link>
            <Link href="/pricing">Pricing</Link>
          </div>
          
          <div className="footer-col">
            <h4>Automations</h4>
            <Link href="/automations/instagram">Instagram</Link>
            <Link href="/automations/whatsapp">WhatsApp</Link>
            <Link href="/automations/gmail">Gmail</Link>
            <Link href="/automations/telegram">Telegram</Link>
            <Link href="/automations/shopify">Shopify</Link>
            <Link href="/automations/google-sheets">Google Sheets</Link>
          </div>

          <div className="footer-col">
            <h4>Resources</h4>
            <Link href="/?openChat=true">Help Center</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact Support</Link>
            <Link href="/about">About</Link>
            <Link href="/security">Security</Link>
          </div>

          <div className="footer-col">
            <h4>Legal</h4>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms of Service</Link>
            <Link href="/refund-policy">Refund Policy</Link>
            <Link href="/cookie-policy">Cookie Policy</Link>
            <Link href="/data-privacy">Data Privacy</Link>
            <Link href="/acceptable-use">Acceptable Use</Link>
            <Link href="/subprocessors">Subprocessors</Link>
            <Link href="/disclaimer">Disclaimer</Link>
            <Link href="/legal-notices">Legal Notices</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AutrixGPT. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
