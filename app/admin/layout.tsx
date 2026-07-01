'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NAV = [
  { href: '/admin', icon: '📊', label: 'Dashboard' },
  { href: '/admin/upload', icon: '⬆️', label: 'Upload Image' },
  { href: '/admin/ai-generator', icon: '🤖', label: 'AI Generator' },
  { href: '/admin/gallery', icon: '🖼️', label: 'Gallery' },
  { href: '/admin/orders', icon: '💰', label: 'Payments & Orders' },
  { href: '/admin/users', icon: '👥', label: 'User Accounts' },
  { href: '/admin/settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Force dark mode for admin layout and verify admin session
  useEffect(() => {
    document.body.className = 'dark';

    if (pathname !== '/admin/login') {
      fetch('/api/auth/me')
        .then(r => r.json())
        .then(data => {
          if (!data.authenticated || data.role !== 'admin') {
            toast.error('Unauthorized! Access restricted to Admin only.');
            router.push('/');
          } else {
            setCheckingAuth(false);
          }
        })
        .catch(() => {
          router.push('/');
        });
    } else {
      setCheckingAuth(false);
    }
  }, [pathname, router]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/login', { method: 'DELETE' });
      toast.success('Logged out');
      router.push('/admin/login');
    } catch {
      toast.error('Logout failed');
    } finally {
      setLoggingOut(false);
    }
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0b0c10', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: 40, height: 40 }} />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0b0c10',
        color: '#ffffff',
        // Inject dark mode variables directly to prevent layout flashing/blinking
        '--bg': '#0b0c10',
        '--fg': '#ffffff',
        '--surface': 'rgba(255, 255, 255, 0.04)',
        '--surface-2': 'rgba(255, 255, 255, 0.08)',
        '--night': '#1a1c23',
        '--ink-soft': 'rgba(255, 255, 255, 0.7)',
        '--border-soft': 'rgba(255, 255, 255, 0.1)',
        '--shadow-soft': '0 30px 80px rgba(0, 0, 0, 0.5)',
      } as React.CSSProperties}
      className="dark"
    >
      {/* ─── Sidebar ──────────────────────────────────────────────── */}
      <nav className="admin-sidebar">
        {/* Brand */}
        <div style={{
          padding: '24px 20px',
          borderBottom: '1px solid var(--border-soft)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, fontSize: 16, color: '#fff',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}>D</div>
            <div>
              <p style={{ fontWeight: 800, fontSize: 16, lineHeight: 1.2 }}>Dwivedi</p>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ padding: '12px 0', flex: 1 }}>
          <p style={{
            fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)',
            padding: '8px 20px', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            Navigation
          </p>
          {NAV.map(item => (
            <a
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border-soft)',
        }}>
          <a href="/" className="sidebar-link" style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>🌐</span>
            View Site
          </a>
          <button
            className="sidebar-link"
            style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <span style={{ fontSize: 16 }}>🚪</span>
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <main className="admin-main" style={{ flex: 1 }}>
        {/* Top bar */}
        <div style={{
          height: 64,
          borderBottom: '1px solid var(--border-soft)',
          display: 'flex', alignItems: 'center',
          padding: '0 32px',
          background: 'var(--night)',
          gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>
              {NAV.find(n => n.href === pathname)?.label || 'Admin'}
            </h2>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
              Dwivedi's Gallery Management
            </p>
          </div>
          <div className="badge badge-accent">Admin</div>
        </div>

        {/* Page content */}
        <div style={{ padding: 32 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
