import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import React from 'react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/admin');
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', gap: '2rem', flexDirection: 'column' }}>
      <div style={{ padding: '1rem 0', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        <h2 style={{ fontSize: '1.25rem', margin: 0, paddingRight: '1rem', borderRight: '1px solid var(--border-color)' }}>Admin</h2>
        <Link href="/admin" style={{ color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}>Overview</Link>
        <Link href="/admin/users" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Users</Link>
        <Link href="/admin/automations" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Activepieces</Link>
        <Link href="/admin/ai" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>AI Usage</Link>
      </div>
      <div style={{ flexGrow: 1 }}>
        {children}
      </div>
    </div>
  );
}
