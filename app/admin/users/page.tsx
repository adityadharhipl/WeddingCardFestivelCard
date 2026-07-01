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
    <div style={{ maxWidth: 1300, margin: '0 auto' }}>

      {/* ── Page Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 36,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'linear-gradient(135deg, var(--accent), #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
              boxShadow: '0 8px 24px rgba(255,45,120,0.25)',
            }}>👥</div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
              Users &amp; AI Limits
            </h1>
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginLeft: 58 }}>
            Approve users, set premium status, and control AI generation limits.
          </p>
        </div>

        {/* Summary badge */}
        <div style={{
          display: 'flex',
          gap: 12,
        }}>
          <div style={{
            padding: '10px 20px',
            borderRadius: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>{users.length}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Total Users</div>
          </div>
          <div style={{
            padding: '10px 20px',
            borderRadius: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#22c55e' }}>{users.filter(u => u.isApproved).length}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Approved</div>
          </div>
          <div style={{
            padding: '10px 20px',
            borderRadius: 12,
            background: 'var(--surface)',
            border: '1px solid var(--border-soft)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b' }}>{users.filter(u => u.isPremiumUser).length}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-soft)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Premium</div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <div className="spinner" style={{ width: 36, height: 36 }} />
        </div>
      ) : users.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 80,
          background: 'var(--surface)',
          borderRadius: 20,
          border: '1px solid var(--border-soft)',
          color: 'var(--ink-soft)'
        }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>👥</div>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--fg)' }}>No users registered yet</p>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)' }}>Standard user accounts will appear here once they register on the public site.</p>
        </div>
      ) : (
        <div className="glass" style={{ overflow: 'hidden', borderRadius: 20 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: 28 }}>Registered Email</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Approval</th>
                  <th>Paid (Premium)</th>
                  <th>AI Limit</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    {/* Email */}
                    <td style={{ paddingLeft: 28 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%',
                          background: `linear-gradient(135deg, ${user.isApproved ? 'var(--accent)' : '#6b7280'}, ${user.isPremiumUser ? '#a855f7' : '#374151'})`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 800, color: '#fff',
                          flexShrink: 0,
                        }}>
                          {user.email[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{user.email}</span>
                      </div>
                    </td>

                    {/* Joined */}
                    <td>
                      <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: 100,
                        background: user.isApproved ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                        color: user.isApproved ? '#22c55e' : '#ef4444',
                        border: `1px solid ${user.isApproved ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: user.isApproved ? '#22c55e' : '#ef4444',
                          display: 'inline-block',
                        }} />
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>

                    {/* Approval toggle */}
                    <td style={{ textAlign: 'center' }}>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={user.isApproved}
                          onChange={() => handleToggleApproval(user._id, user.isApproved)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </td>

                    {/* Premium */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 8,
                          background: user.isPremiumUser ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.05)',
                          color: user.isPremiumUser ? '#a855f7' : 'var(--ink-soft)',
                          border: `1px solid ${user.isPremiumUser ? 'rgba(168,85,247,0.3)' : 'var(--border-soft)'}`,
                          minWidth: 52, textAlign: 'center',
                        }}>
                          {user.isPremiumUser ? '👑 Paid' : '💸 Free'}
                        </span>
                        <label className="toggle">
                          <input
                            type="checkbox"
                            checked={user.isPremiumUser}
                            onChange={() => handleTogglePremium(user._id, user.isPremiumUser)}
                          />
                          <span className="toggle-slider" />
                        </label>
                      </div>
                    </td>

                    {/* AI Limit */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input
                          type="number"
                          defaultValue={user.aiGenCount || 0}
                          onBlur={(e) => handleUpdateAiLimit(user._id, parseInt(e.target.value) || 0)}
                          style={{
                            width: 64,
                            padding: '7px 10px',
                            borderRadius: 10,
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border-soft)',
                            color: 'var(--fg)',
                            fontWeight: 700,
                            textAlign: 'center',
                            fontSize: 14,
                            outline: 'none',
                          }}
                        />
                        <span style={{
                          fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600,
                          background: 'var(--surface)',
                          padding: '5px 10px',
                          borderRadius: 8,
                          border: '1px solid var(--border-soft)',
                          whiteSpace: 'nowrap',
                        }}>
                          / {user.isPremiumUser ? '10' : '4'} Max
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        title="Delete User Account"
                        style={{
                          width: 36, height: 36,
                          borderRadius: 10,
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          color: '#ef4444',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 15,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.2)';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)';
                          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                        }}
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

          {/* Table footer */}
          <div style={{
            padding: '14px 28px',
            borderTop: '1px solid var(--border-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface)',
          }}>
            <span style={{ fontSize: 13, color: 'var(--ink-soft)', fontWeight: 500 }}>
              Showing <strong style={{ color: 'var(--fg)' }}>{users.length}</strong> registered user{users.length !== 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
