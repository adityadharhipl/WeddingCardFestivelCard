'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface UserItem {
  _id: string;
  email: string;
  role: string;
  isApproved: boolean;
  aiGenCount: number;
  isPremiumUser: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers(data.users || []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleApproval = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isApproved: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(!currentStatus ? 'User Approved! 🟢' : 'User Approval Revoked! 🔴');
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isApproved: !currentStatus } : u));
    } catch {
      toast.error('Failed to update approval status');
    }
  };

  const handleTogglePremium = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isPremiumUser: !currentStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(!currentStatus ? 'User Premium status activated! 👑' : 'User Premium status revoked! 💸');
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isPremiumUser: !currentStatus } : u));
    } catch {
      toast.error('Failed to update premium status');
    }
  };

  const handleUpdateAiLimit = async (userId: string, count: number) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, aiGenCount: count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(`User AI count set to ${count}! ⚙️`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, aiGenCount: count } : u));
    } catch {
      toast.error('Failed to update AI count');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('User deleted successfully! 🗑️');
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch {
      toast.error('Failed to delete user');
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Users &amp; AI Limits Management</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
            Approve users, set paid/premium status, and control AI generation limits.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : users.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 64,
          background: 'var(--surface)',
          borderRadius: 20,
          border: '1px solid var(--border-soft)',
          color: 'var(--ink-soft)'
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
          <p style={{ fontSize: 16, fontWeight: 700 }}>No users registered yet</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>Standard user accounts will appear here once they register on the public site.</p>
        </div>
      ) : (
        <div className="glass" style={{ overflow: 'hidden' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Registered Email</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Paid (Premium)</th>
                <th>AI Generations Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td style={{ fontWeight: 600 }}>{user.email}</td>
                  <td style={{ fontSize: 13, color: 'var(--ink-soft)' }}>
                    {new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 100,
                      background: user.isApproved ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: user.isApproved ? '#22c55e' : '#ef4444'
                    }}>
                      {user.isApproved ? '🟢 Approved' : '🔴 Pending'}
                    </span>
                  </td>
                  <td>
                    <label className="toggle" style={{ transform: 'scale(0.85)' }}>
                      <input
                        type="checkbox"
                        checked={user.isApproved}
                        onChange={() => handleToggleApproval(user._id, user.isApproved)}
                      />
                      <span className="toggle-slider" />
                    </label>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: user.isPremiumUser ? 'var(--accent)' : 'var(--ink-soft)' }}>
                        {user.isPremiumUser ? '👑 Paid' : '💸 Free'}
                      </span>
                      <label className="toggle" style={{ transform: 'scale(0.85)' }}>
                        <input
                          type="checkbox"
                          checked={user.isPremiumUser}
                          onChange={() => handleTogglePremium(user._id, user.isPremiumUser)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        defaultValue={user.aiGenCount || 0}
                        onBlur={(e) => handleUpdateAiLimit(user._id, parseInt(e.target.value) || 0)}
                        style={{
                          width: 70,
                          padding: '6px 10px',
                          borderRadius: 8,
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border-soft)',
                          color: 'var(--fg)',
                          fontWeight: 700,
                          textAlign: 'center'
                        }}
                      />
                      <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                        / {user.isPremiumUser ? '10 Max' : '4 Max'}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-icon"
                      title="Delete User Account"
                      style={{ width: 34, height: 34, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
