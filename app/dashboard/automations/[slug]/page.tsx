import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { automationsData } from '@/data/automations';
import InstagramDashboard from '@/components/automations/dashboards/InstagramDashboard';
import WhatsAppDashboard from '@/components/automations/dashboards/WhatsAppDashboard';
import WebsiteDashboard from '@/components/automations/dashboards/WebsiteDashboard';
import GmailDashboard from '@/components/automations/dashboards/GmailDashboard';
import ShopifyDashboard from '@/components/automations/dashboards/ShopifyDashboard';

export default async function DashboardAutomationPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect(`/login?next=/dashboard/automations/${params.slug}`);
  }

  const automation = automationsData.find(a => a.slug === params.slug);
  if (!automation) {
    notFound();
  }

  // Render specific dashboard based on slug
  const renderDashboard = () => {
    switch (params.slug) {
      case 'instagram':
        return <InstagramDashboard automation={automation} user={user} />;
      case 'whatsapp':
        return <WhatsAppDashboard automation={automation} user={user} />;
      case 'website':
        // Mapping 'website' to 'website' instead of null, assuming we might use a slug 'website' in future. 
        // Wait, is 'website' in automationsData? Let's check later, we'll render a generic or specific.
        return <WebsiteDashboard automation={automation} user={user} />;
      case 'gmail':
        return <GmailDashboard automation={automation} user={user} />;
      case 'shopify':
        return <ShopifyDashboard automation={automation} user={user} />;
      default:
        return (
          <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
            <h2>{automation.title} Dashboard</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Dashboard coming soon in Phase 4B.</p>
          </div>
        );
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '2.5rem' }}>{automation.icon}</div>
        <div>
          <h1 className="section-title" style={{ margin: 0, fontSize: '2rem' }}>{automation.title}</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Configure and monitor your automation workflow</p>
        </div>
      </div>
      
      {renderDashboard()}
    </div>
  );
}
