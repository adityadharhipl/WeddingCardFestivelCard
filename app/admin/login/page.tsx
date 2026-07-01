'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.className = 'dark';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      toast.success('Welcome back! 👋');
      // Refresh first so cookie is registered, then navigate
      router.refresh();
      setTimeout(() => {
        router.push(data.role === 'admin' ? '/admin' : '/admin/ai-generator');
      }, 100);
    } catch (err: any) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* Background glows */}
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px var(--accent-glow)',
            fontWeight: 900, fontSize: 28, color: '#fff',
            margin: '0 auto 16px',
            animation: 'pulse-glow 3s infinite',
          }}>D</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Admin Panel</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>Sign in to manage your gallery</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="glass"
          style={{ padding: '36px 32px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="label">Email Address</label>
              <input
                className="input-field"
                type="email"
                placeholder="admin@Dwivedi's.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                justifyContent: 'center',
                padding: '14px',
                fontSize: 15,
                marginTop: 4,
              }}
            >
              {loading ? (
                <><div className="spinner" /> Signing in...</>
              ) : (
                '🔐 Sign In'
              )}
            </button>
          </div>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
            ← Back to gallery
          </a>
        </div>
      </div>
    </div>
  );
}
