'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { TEMPLATE_STYLES, getNormalCardSvg } from '@/lib/templates';

type Category = 'wedding' | 'birthday' | 'anniversary' | 'housewarming';

export default function AdminAiGeneratorPage() {
  const [form, setForm] = useState({
    eventType: 'Wedding Invitation',
    names: 'Aditya & Priya',
    date: 'November 26, 2026 at 7:00 PM',
    venue: 'Royal Orchid Banquet, New Delhi',
    theme: 'Luxury Gold & Black',
    selectedStyle: 'royal_gold',
    price: '0'
  });
  const [svg, setSvg] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  // Call Groq API
  const handleGenerate = async () => {
    setGenerating(true);
    setSvg('');
    const toastId = toast.loading('Grok is designing the vector SVG card...');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSvg(data.svg);
      toast.success('Card layout generated! 🎨', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Generation failed', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  // Generate local vector template instantly (10 options)
  const handleNormalGenerate = () => {
    const normalCardSvg = getNormalCardSvg(form.selectedStyle, form);
    if (!normalCardSvg) {
      toast.error('Selected template style is invalid');
      return;
    }
    setSvg(normalCardSvg);
    toast.success('Instant template card generated successfully! 🎨');
  };

  // Save SVG to gallery database
  const handleSaveToGallery = async () => {
    if (!svg) return;
    setSaving(true);
    const toastId = toast.loading('Saving card to gallery...');
    
    // Map event type to DB category
    let category: Category = 'wedding';
    if (form.eventType.includes('Birthday')) category = 'birthday';
    if (form.eventType.includes('Anniversary')) category = 'anniversary';
    if (form.eventType.includes('Housewarming') || form.eventType.includes('Griha')) category = 'housewarming';

    try {
      const res = await fetch('/api/ai/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg,
          title: `Designed - ${form.names}`,
          category,
          price: parseFloat(form.price || '0'),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success('Card added to public gallery database! 💾', { id: toastId });
    } catch (err: any) {
      toast.error(err.message || 'Failed to save', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>🤖 AI & Template Card Generator</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 32, fontSize: 14 }}>
        Generate custom vector invitation cards using Llama-3 (Groq AI) or select from 10+ gorgeous local templates.
      </p>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {/* Left Form */}
        <div className="glass" style={{ flex: '1 1 380px', padding: 28, height: 'fit-content' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label className="label">Event Category</label>
              <select
                className="select-field"
                value={form.eventType}
                onChange={e => setForm(p => ({ ...p, eventType: e.target.value }))}
              >
                <option>Wedding Invitation</option>
                <option>Birthday Card</option>
                <option>Anniversary Invitation</option>
                <option>Housewarming Invitation</option>
              </select>
            </div>

            <div>
              <label className="label">Celebrant Names</label>
              <input
                className="input-field"
                value={form.names}
                onChange={e => setForm(p => ({ ...p, names: e.target.value }))}
                placeholder="e.g. Aditya & Priya"
              />
            </div>

            <div>
              <label className="label">Date & Time Details</label>
              <input
                className="input-field"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                placeholder="e.g. November 26, 2026 at 7 PM"
              />
            </div>

            <div>
              <label className="label">Venue Location</label>
              <input
                className="input-field"
                value={form.venue}
                onChange={e => setForm(p => ({ ...p, venue: e.target.value }))}
                placeholder="e.g. Royal Orchid Banquet, New Delhi"
              />
            </div>

            <div>
              <label className="label">Template Style (For normal generation)</label>
              <select
                className="select-field"
                value={form.selectedStyle}
                onChange={e => setForm(p => ({ ...p, selectedStyle: e.target.value }))}
              >
                {TEMPLATE_STYLES.map(style => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Design Theme Style (For Grok AI)</label>
              <select
                className="select-field"
                value={form.theme}
                onChange={e => setForm(p => ({ ...p, theme: e.target.value }))}
              >
                <option>Luxury Gold & Black</option>
                <option>Elegant Blush Pink & White</option>
                <option>Deep Navy Blue & Silver</option>
                <option>Minimalist Floral White</option>
              </select>
            </div>

            <div>
              <label className="label">Price (₹) — for Premium Shop</label>
              <input
                className="input-field"
                type="number"
                min="0"
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                placeholder="0"
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '14px', fontSize: 14 }}
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? (
                  <><div className="spinner" /> Designing Vector...</>
                ) : (
                  '🤖 Grok Generate Card'
                )}
              </button>

              <button
                className="btn-ghost"
                style={{ justifyContent: 'center', padding: '14px', fontSize: 14, borderRadius: 100 }}
                onClick={handleNormalGenerate}
              >
                🎨 Generate Normal Card
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div style={{
          flex: '1 1 450px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 520,
          background: 'var(--surface)',
          border: '1px solid var(--border-soft)',
          borderRadius: 24,
          padding: 24,
        }}>
          {generating ? (
            <div style={{ width: '100%', maxWidth: 360, textAlign: 'center' }}>
              <div className="shimmer animate-pulse" style={{ width: '100%', aspectRatio: '2/3', borderRadius: 20, marginBottom: 20 }} />
              <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>Grok is compiling SVG paths...</p>
            </div>
          ) : svg ? (
            <div style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '3/4',
                  border: '1px solid var(--border-soft)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: '#000',
                  marginBottom: 20,
                  boxShadow: 'var(--shadow-soft)',
                }}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <div style={{ display: 'flex', gap: 12, width: '100%' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={handleSaveToGallery}
                  disabled={saving}
                >
                  {saving ? '⏳ Saving...' : '💾 Save to Gallery'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--ink-soft)' }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>🎨</div>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg)', marginBottom: 8 }}>Card Preview</p>
              <p style={{ fontSize: 13 }}>Designs will show up here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
