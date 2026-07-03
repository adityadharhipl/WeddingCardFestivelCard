'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { TEMPLATE_STYLES } from '@/lib/templates';

interface Settings {
  isPremium: boolean;
  enableMultiPageCard: boolean;
  googleLogin: boolean;
  upiId: string;
  siteName: string;
  upiName: string;
  defaultNames: string;
  defaultDate: string;
  defaultVenue: string;
  defaultStyle: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    isPremium: false,
    enableMultiPageCard: true,
    googleLogin: false,
    upiId: '',
    siteName: "Dwivedi's",
    upiName: "Dwivedi's Store",
    defaultNames: 'Rahul & Priya',
    defaultDate: 'November 26, 2026 at 7:00 PM',
    defaultVenue: 'Royal Orchid Banquet, New Delhi',
    defaultStyle: 'royal_gold',
  });
  const [loading, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.settings) setSettings(d.settings);
      })
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoadingData(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Settings saved! ✅');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
        <div className="spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Settings</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 32, fontSize: 14 }}>
        Configure your gallery, payment, and generator default values.
      </p>

      {/* Premium Mode Section */}
      <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              ✨ Premium E-commerce Mode
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
              When enabled, your gallery becomes a full e-commerce store — each image shows a price,
              visitors can add to cart, and checkout with UPI payment.
            </p>
          </div>
          <label className="toggle" style={{ flexShrink: 0, marginTop: 4 }}>
            <input
              type="checkbox"
              checked={settings.isPremium}
              onChange={e => setSettings(p => ({ ...p, isPremium: e.target.checked }))}
            />
            <span className="toggle-slider" />
          </label>
        </div>

        {/* Premium status indicator */}
        <div style={{
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: settings.isPremium ? 'var(--accent-glow)' : 'var(--surface)',
          border: `1px solid ${settings.isPremium ? 'var(--accent)' : 'var(--border-soft)'}`,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 20 }}>{settings.isPremium ? '🟢' : '🔴'}</span>
          <div>
            <p style={{ fontWeight: 600, fontSize: 13, color: settings.isPremium ? 'var(--accent)' : 'var(--ink-soft)' }}>
              {settings.isPremium ? 'E-commerce is ACTIVE' : 'E-commerce is DISABLED'}
            </p>
            <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
              {settings.isPremium
                ? 'Add to Cart, Checkout & UPI payment are visible on the public site'
                : 'Gallery is in display-only mode — no prices or cart shown'}
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Page Card Section */}
      <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              📖 Multi-Page Wedding Card
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
              Enable the 4-page wedding card feature on the public site. Allows users to create a multi-page invitation (Cover, Bride/Groom, Events, RSVP).
            </p>
          </div>
          <label className="toggle" style={{ flexShrink: 0, marginTop: 4 }}>
            <input
              type="checkbox"
              checked={settings.enableMultiPageCard}
              onChange={e => setSettings(p => ({ ...p, enableMultiPageCard: e.target.checked }))}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* Google Login Section */}
      <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
              🔐 Google Login
            </h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 13, lineHeight: 1.6 }}>
              Enable Google Login for user authentication.
            </p>
          </div>
          <label className="toggle" style={{ flexShrink: 0, marginTop: 4 }}>
            <input
              type="checkbox"
              checked={settings.googleLogin}
              onChange={e => setSettings(p => ({ ...p, googleLogin: e.target.checked }))}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {/* UPI Payment Settings */}
      <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>💳 UPI Payment Details</h2>
        <p style={{ color: 'var(--ink-soft)', fontSize: 13, marginBottom: 20 }}>
          This UPI ID will be shown to customers during checkout.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">UPI ID *</label>
            <input
              className="input-field"
              placeholder="yourname@paytm / yourname@upi"
              value={settings.upiId}
              onChange={e => setSettings(p => ({ ...p, upiId: e.target.value }))}
            />
            <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 5 }}>
              e.g., 9876543210@paytm or yourstore@oksbi
            </p>
          </div>
          <div>
            <label className="label">Payee Name (shown to customer)</label>
            <input
              className="input-field"
              placeholder="Dwivedi's Store"
              value={settings.upiName}
              onChange={e => setSettings(p => ({ ...p, upiName: e.target.value }))}
            />
          </div>

          {/* UPI Preview */}
          {settings.upiId && (
            <div style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-glow)',
              border: '1px solid var(--accent)',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginBottom: 4 }}>Customer will see:</p>
              <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--accent)' }}>{settings.upiId}</p>
              <p style={{ fontSize: 12, color: 'var(--ink-soft)' }}>{settings.upiName}</p>
            </div>
          )}
        </div>
      </div>

      {/* Site Settings */}
      <div className="glass" style={{ padding: 28, marginBottom: 20 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>🏷️ Site Info</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Site Name</label>
            <input
              className="input-field"
              placeholder="Dwivedi's"
              value={settings.siteName}
              onChange={e => setSettings(p => ({ ...p, siteName: e.target.value }))}
            />
          </div>
        </div>
      </div>

      {/* Generator Default Settings */}
      <div className="glass" style={{ padding: 28, marginBottom: 28 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>🤖 Card Generator Defaults</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Default Names</label>
            <input
              className="input-field"
              placeholder="Rahul & Priya"
              value={settings.defaultNames}
              onChange={e => setSettings(p => ({ ...p, defaultNames: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Default Date & Time</label>
            <input
              className="input-field"
              placeholder="November 26, 2026 at 7:00 PM"
              value={settings.defaultDate}
              onChange={e => setSettings(p => ({ ...p, defaultDate: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Default Venue Address</label>
            <input
              className="input-field"
              placeholder="Royal Orchid Banquet, New Delhi"
              value={settings.defaultVenue}
              onChange={e => setSettings(p => ({ ...p, defaultVenue: e.target.value }))}
            />
          </div>

          <div>
            <label className="label">Default Template Style</label>
            <select
              className="select-field"
              value={settings.defaultStyle}
              onChange={e => setSettings(p => ({ ...p, defaultStyle: e.target.value }))}
            >
              {TEMPLATE_STYLES.map(style => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button
        className="btn-primary"
        style={{ padding: '14px 32px', fontSize: 15 }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? (
          <><div className="spinner" /> Saving...</>
        ) : (
          '💾 Save Settings'
        )}
      </button>
    </div>
  );
}
