'use client';

import { useEffect, useState } from 'react';

interface Stats {
  totalImages: number;
  weddingCount: number;
  birthdayCount: number;
  anniversaryCount: number;
  totalOrders: number;
  pendingOrders: number;
  isPremium: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/images').then(r => r.json()),
      fetch('/api/images?category=wedding').then(r => r.json()),
      fetch('/api/images?category=birthday').then(r => r.json()),
      fetch('/api/images?category=anniversary').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/settings').then(r => r.json()),
    ]).then(([all, wed, bday, ann, orders, settings]) => {
      setStats({
        totalImages:      all.images?.length || 0,
        weddingCount:     wed.images?.length || 0,
        birthdayCount:    bday.images?.length || 0,
        anniversaryCount: ann.images?.length || 0,
        totalOrders:      orders.orders?.length || 0,
        pendingOrders:    orders.orders?.filter((o: any) => o.status === 'pending').length || 0,
        isPremium:        settings.settings?.isPremium || false,
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = [
    { label: 'Total Images',    value: stats?.totalImages,      icon: '🖼️',  color: '#a855f7' },
    { label: 'Wedding',         value: stats?.weddingCount,     icon: '💍',  color: '#ff2d78' },
    { label: 'Birthday',        value: stats?.birthdayCount,    icon: '🎂',  color: '#f59e0b' },
    { label: 'Anniversary',     value: stats?.anniversaryCount, icon: '🌹',  color: '#22c55e' },
    { label: 'Total Orders',    value: stats?.totalOrders,      icon: '📦',  color: '#3b82f6' },
    { label: 'Pending Orders',  value: stats?.pendingOrders,    icon: '⏳',  color: '#f59e0b' },
  ];

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #ff2d7820 0%, #a855f715 100%)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
            Welcome back 👋
          </h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
            Manage your gallery, images, and orders from here.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className={`badge ${stats?.isPremium ? 'badge-success' : 'badge-warning'}`}>
            {stats?.isPremium ? '✨ Premium Active' : '⚠️ Premium Off'}
          </div>
          <a href="/admin/settings" className="btn-primary" style={{ fontSize: 13 }}>
            Manage Settings
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 40,
      }}>
        {STAT_CARDS.map((card, i) => (
          <div
            key={i}
            className="stat-card anim-fade-up"
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>{card.icon}</div>
            <div style={{
              fontSize: 36, fontWeight: 800, color: card.color,
              lineHeight: 1, marginBottom: 6,
            }}>
              {loading ? '—' : (card.value ?? 0)}
            </div>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, fontWeight: 500 }}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="/admin/upload" className="btn-primary">⬆️ Upload Image</a>
          <a href="/admin/gallery" className="btn-ghost">🖼️ View Gallery</a>
          <a href="/admin/orders" className="btn-ghost">📦 View Orders</a>
          <a href="/admin/settings" className="btn-ghost">⚙️ Settings</a>
        </div>
      </div>
    </div>
  );
}
