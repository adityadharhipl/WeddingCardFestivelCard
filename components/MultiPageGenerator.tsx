'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface MultiPageGeneratorProps {
  currentUser: { isApproved: boolean; email?: string; role?: string } | null;
  onNeedLogin: () => void;
}

export default function MultiPageGenerator({ currentUser, onNeedLogin }: MultiPageGeneratorProps) {
  const [activePage, setActivePage] = useState(1);
  const totalPages = 4;

  const [form, setForm] = useState({
    title: 'Ganesh Ji / Shyam Baba',
    groomName: 'Rahul',
    brideName: 'Priya',
    weddingDate: '26 Nov 2026',
    events: 'Haldi: 24 Nov, Mehendi: 25 Nov',
    venue: 'Royal Orchid Banquet, New Delhi',
    rsvp: 'RSVP: Sharma Family'
  });

  const handleNextPage = () => {
    if (activePage === 1) {
      if (!currentUser?.isApproved && currentUser?.role !== 'admin') {
        toast.error('Pages 2-4 are Premium! Please wait for Admin approval to unlock the full card.');
        // If not logged in, prompt login
        if (!currentUser) onNeedLogin();
        return;
      }
    }
    if (activePage < totalPages) setActivePage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (activePage > 1) setActivePage(p => p - 1);
  };

  const handleDownload = () => {
    if (activePage > 1 && !currentUser?.isApproved && currentUser?.role !== 'admin') {
      toast.error('Premium Account required to download full 4-page booklet.');
      return;
    }
    toast.success('Downloading your card... 💌');
  };

  return (
    <div style={{
      display: 'flex', gap: 40, flexWrap: 'wrap',
      justifyContent: 'center',
      background: 'var(--surface)',
      border: '1px solid var(--border-soft)',
      padding: 40, borderRadius: 24,
      boxShadow: 'var(--shadow-soft)',
    }}>
      {/* Editor Panel */}
      <div style={{ flex: '1 1 400px', maxWidth: 500 }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>📖 Multi-Page Wedding Card</h3>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14, marginBottom: 24 }}>
          Design a beautiful 4-page wedding booklet. Page 1 is free to preview and download!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {activePage === 1 && (
            <div className="anim-fade-in">
              <label className="label">Cover Page Title</label>
              <input className="input-field" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
          )}
          {activePage === 2 && (
            <div className="anim-fade-in">
              <label className="label">Groom Name</label>
              <input className="input-field" value={form.groomName} onChange={e => setForm(p => ({ ...p, groomName: e.target.value }))} />
              <label className="label" style={{ marginTop: 16 }}>Bride Name</label>
              <input className="input-field" value={form.brideName} onChange={e => setForm(p => ({ ...p, brideName: e.target.value }))} />
              <label className="label" style={{ marginTop: 16 }}>Wedding Date</label>
              <input className="input-field" value={form.weddingDate} onChange={e => setForm(p => ({ ...p, weddingDate: e.target.value }))} />
            </div>
          )}
          {activePage === 3 && (
            <div className="anim-fade-in">
              <label className="label">Pre-Wedding Events (Haldi/Mehendi)</label>
              <textarea className="input-field" rows={3} value={form.events} onChange={e => setForm(p => ({ ...p, events: e.target.value }))} />
            </div>
          )}
          {activePage === 4 && (
            <div className="anim-fade-in">
              <label className="label">Venue Details</label>
              <textarea className="input-field" rows={2} value={form.venue} onChange={e => setForm(p => ({ ...p, venue: e.target.value }))} />
              <label className="label" style={{ marginTop: 16 }}>RSVP Details</label>
              <input className="input-field" value={form.rsvp} onChange={e => setForm(p => ({ ...p, rsvp: e.target.value }))} />
            </div>
          )}
        </div>
      </div>

      {/* Preview Panel */}
      <div style={{
        flex: '1 1 450px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'var(--night)', borderRadius: 20, padding: 32,
        border: '1px solid var(--border-soft)'
      }}>
        {/* Pagination Dots */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1, 2, 3, 4].map(pg => (
            <div key={pg} style={{
              width: 12, height: 12, borderRadius: '50%',
              background: activePage === pg ? 'var(--accent)' : 'var(--surface-2)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Card Mockup */}
        <div style={{
          width: '100%', maxWidth: 360, aspectRatio: '9/16',
          background: 'linear-gradient(135deg, #1f1c2c, #928DAB)',
          borderRadius: 16,
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
          position: 'relative',
          padding: 32,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          {activePage === 1 && (
            <div className="anim-fade-in">
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <svg width="60" height="60" viewBox="0 0 100 100">
                  <g transform="translate(50, 45) scale(1.6)" stroke="#FCD34D" strokeWidth="2.5" fill="none" strokeLinecap="round">
                    <path d="M -15 -10 Q 0 -35 15 -10 C 20 0 10 20 0 25 C -10 20 -20 0 -15 -10 Z"/>
                    <path d="M 0 -15 Q -10 -5 -5 10 Q 0 25 10 10"/>
                    <circle cx="-5" cy="-18" r="2" fill="#FCD34D"/>
                    <circle cx="5" cy="-18" r="2" fill="#FCD34D"/>
                    <path d="M -22 -8 Q -30 -10 -25 -20 Q -15 -22 -15 -10"/>
                    <path d="M 22 -8 Q 30 -10 25 -20 Q 15 -22 15 -10"/>
                  </g>
                </svg>
              </div>
              <h2 className="font-display" style={{ color: '#FCD34D', fontSize: 28 }}>{form.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 24, fontStyle: 'italic' }}>Swipe to open</p>
            </div>
          )}
          {activePage === 2 && (
            <div className="anim-fade-in">
              <h3 style={{ color: '#FCD34D', fontSize: 24, marginBottom: 16 }}>Together with their families</h3>
              <h1 className="font-display" style={{ color: '#fff', fontSize: 36, marginBottom: 8 }}>{form.groomName}</h1>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 20 }}>&</span>
              <h1 className="font-display" style={{ color: '#fff', fontSize: 36, marginTop: 8 }}>{form.brideName}</h1>
              <p style={{ color: '#FCD34D', fontSize: 18, marginTop: 24 }}>{form.weddingDate}</p>
            </div>
          )}
          {activePage === 3 && (
            <div className="anim-fade-in">
              <h2 className="font-display" style={{ color: '#FCD34D', fontSize: 28, marginBottom: 24 }}>Celebrations</h2>
              <p style={{ color: '#fff', fontSize: 16, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {form.events}
              </p>
            </div>
          )}
          {activePage === 4 && (
            <div className="anim-fade-in">
              <h2 className="font-display" style={{ color: '#FCD34D', fontSize: 28, marginBottom: 24 }}>Venue</h2>
              <p style={{ color: '#fff', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>{form.venue}</p>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 16 }}>
                <p style={{ color: '#FCD34D', fontSize: 14 }}>{form.rsvp}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: 16, marginTop: 32, width: '100%', maxWidth: 360 }}>
          <button
            className="btn-ghost"
            onClick={handlePrevPage}
            disabled={activePage === 1}
            style={{ flex: 1, padding: '12px' }}
          >
            ← Prev
          </button>
          {activePage < totalPages ? (
            <button
              className="btn-primary"
              onClick={handleNextPage}
              style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
            >
              Next →
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleDownload}
              style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
            >
              📥 Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
