'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setEmail(data.email);
          setRole(data.role);
        }
      })
      .finally(() => setInitLoading(false));
  }, []);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password');
      
      toast.success('Password updated successfully! 🔒');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initLoading) {
    return <div className="spinner" style={{ width: 40, height: 40, margin: '100px auto' }} />;
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div className="card" style={{ padding: 32, marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
          👤 My Profile
        </h2>
        <p style={{ color: 'var(--ink-soft)', marginBottom: 24, fontSize: 14 }}>
          Manage your account settings and update your security credentials.
        </p>

        <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Registered Email</p>
            <p style={{ fontSize: 16, fontWeight: 600 }}>{email}</p>
          </div>
          <div className="badge badge-accent" style={{ textTransform: 'capitalize' }}>
            Role: {role}
          </div>
        </div>

        <form onSubmit={handlePasswordUpdate}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Update Password</h3>
          <div style={{ display: 'grid', gap: 16, marginBottom: 24 }}>
            <div>
              <label className="label">New Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Updating Security...' : '🔒 Save New Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
