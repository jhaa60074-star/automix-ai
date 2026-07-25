import Link from 'next/link';

export default function LegalLayout({ data }) {
  if (!data) return null;
  
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{data.title}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Last Updated: {data.lastUpdated}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {data.sections.map((section, idx) => (
          <section key={idx}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-color)' }}>{section.heading}</h2>
            <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              <p>{section.content}</p>
            </div>
          </section>
        ))}
      </div>

      <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          This is a draft legal document for Phase 1. Must be reviewed by legal professionals before production.
        </p>
        <Link href="/contact" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Contact Support for Questions</Link>
      </div>
    </div>
  );
}
