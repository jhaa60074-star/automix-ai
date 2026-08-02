export const metadata = {
  title: 'Data Deletion Instructions | AutrixGPT',
  description: 'Instructions on how to delete your data from AutrixGPT.',
};

export default function DataDeletionPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div className="section-header" style={{ textAlign: 'left' }}>
        <h1 className="section-title">Data Deletion Instructions</h1>
        <p className="section-subtitle" style={{ marginLeft: 0 }}>
          Last updated: August 2026
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-color)', lineHeight: '1.6' }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How to delete your data</h2>
          <p>
            AutrixGPT respects your privacy and provides a straightforward way for you to delete all your personal data, including your connected accounts (e.g., Facebook, Instagram), uploaded files, and chat history.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Option 1: Delete via Dashboard (Recommended)</h3>
          <ol style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Log in to your AutrixGPT account.</li>
            <li>Navigate to your <strong>Dashboard</strong>.</li>
            <li>Go to <strong>Settings</strong> or <strong>Account Overview</strong>.</li>
            <li>Click on <strong>Delete Account & Data</strong>.</li>
            <li>Confirm your decision. All your data will be permanently wiped from our servers immediately.</li>
          </ol>
        </section>

        <section>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Option 2: Delete via Email Request</h3>
          <p>
            If you cannot access your account, you can request manual data deletion by contacting our support team:
          </p>
          <ul style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <li>Email us at: <strong>privacy@autrixgpt.com</strong></li>
            <li>Subject line: <strong>Data Deletion Request</strong></li>
            <li>Include the email address associated with your account in the body of the email.</li>
          </ul>
          <p style={{ marginTop: '1rem' }}>
            We will process your request and confirm deletion within 3-5 business days.
          </p>
        </section>

        <section>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>What data is deleted?</h3>
          <ul style={{ marginLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li>Your user profile and authentication credentials.</li>
            <li>All connected social media integrations (e.g., Instagram/Facebook OAuth tokens).</li>
            <li>Uploaded documents, files, and generated research.</li>
            <li>Your entire conversation history with the AI Assistant.</li>
          </ul>
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            Note: Once data is deleted, it cannot be recovered. Any active subscriptions will also be immediately cancelled.
          </p>
        </section>
      </div>
    </div>
  );
}
