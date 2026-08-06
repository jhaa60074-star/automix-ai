import React from 'react';
import StatCard from '@/components/automations/StatCard';

export const metadata = {
  title: 'Admin Dashboard | AutrixGPT',
  description: 'Admin overview for AutrixGPT',
};

export default function AdminDashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="section-title" style={{ margin: '0 0 0.5rem 0' }}>Platform Overview</h1>
        <p className="section-subtitle" style={{ margin: 0 }}>High-level metrics across all systems.</p>
      </div>

      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard title="Total Users" value="1,248" trend="12% this month" trendUp={true} />
        <StatCard title="Active Users" value="842" trend="8% this month" trendUp={true} />
        <StatCard title="New Signups" value="124" trend="15% this week" trendUp={true} />
        <StatCard title="Total Revenue" value="$14,250" trend="5% this month" trendUp={true} />
      </div>

      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard title="Activepieces Workflows" value="4,102" trend="24% this month" trendUp={true} />
        <StatCard title="Automation Runs" value="89,400" trend="18% this month" trendUp={true} />
        <StatCard title="Failed Workflows" value="142" trend="2% error rate" trendUp={false} />
        <StatCard title="API Costs" value="$842.50" trend="10% this month" trendUp={false} />
      </div>

      <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatCard title="AI Tokens Used" value="14.2M" trend="45% this month" trendUp={true} />
        <StatCard title="Storage Usage" value="124 GB" trend="12% this month" trendUp={true} />
        <StatCard title="Active Call Agents" value="45" trend="New Feature" trendUp={true} />
        <StatCard title="Call Minutes" value="1,240" trend="New Feature" trendUp={true} />
      </div>
    </div>
  );
}
