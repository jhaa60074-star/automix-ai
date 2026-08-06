import React from 'react';
import Button from '@/components/Button';

export const metadata = {
  title: 'User Management | Admin Panel',
  description: 'Manage users in AutrixGPT',
};

export default function AdminUsersPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="section-title" style={{ margin: '0 0 0.5rem 0' }}>User Management</h1>
          <p className="section-subtitle" style={{ margin: 0 }}>View and manage registered users.</p>
        </div>
        <Button variant="primary">Export CSV</Button>
      </div>

      <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search by name, email or ID..." style={{ flexGrow: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)' }} />
        <select style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)' }}>
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Users</option>
        </select>
        <select style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--background-primary)', color: 'var(--text-primary)' }}>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>User</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Role</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Joined</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500 }}>Test User {i}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>user{i}@example.com</span>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{i === 1 ? 'Admin' : 'User'}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', backgroundColor: i === 3 ? 'var(--error-color)' : 'var(--success-color)', color: '#fff' }}>
                    {i === 3 ? 'Suspended' : 'Active'}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Oct 12, 2024</td>
                <td style={{ padding: '1rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Profile</Button>
                  <Button variant="secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>{i === 3 ? 'Activate' : 'Suspend'}</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
