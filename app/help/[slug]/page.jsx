import { notFound } from 'next/navigation';
import { helpData } from '@/data/help';
import Link from 'next/link';

export function generateStaticParams() {
  return helpData.map((cat) => ({
    slug: cat.id,
  }));
}

export function generateMetadata({ params }) {
  const category = helpData.find((c) => c.id === params.slug);
  if (!category) return { title: 'Not Found' };
  
  return {
    title: `${category.title} | AutrixGPT Help`,
    description: category.description,
  };
}

export default function HelpTopicPage({ params }) {
  const category = helpData.find((c) => c.id === params.slug);
  
  if (!category) {
    notFound();
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
      <Link href="/help" style={{ color: 'var(--text-secondary)', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Help Center
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '3rem' }}>{category.icon}</span>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>{category.title}</h1>
      </div>
      
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
        {category.description}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {category.articles.map((article, idx) => (
          <div key={idx} className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-color)' }}>{article.title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>{article.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
