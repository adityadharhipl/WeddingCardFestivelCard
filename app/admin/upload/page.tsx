'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';

type Category = 'wedding' | 'birthday' | 'anniversary' | 'housewarming' | 'god' | 'frame' | 'festival';

const CATEGORIES: { value: Category; label: string; emoji: string }[] = [
  { value: 'wedding',      label: 'Wedding',      emoji: '💍' },
  { value: 'birthday',     label: 'Birthday',     emoji: '🎂' },
  { value: 'anniversary',  label: 'Anniversary',  emoji: '🌹' },
  { value: 'housewarming', label: 'Housewarming', emoji: '🏡' },
  { value: 'festival',     label: 'Festival',     emoji: '✨' },
  { value: 'god',          label: 'Bhagwan Ji (God Pic)', emoji: '🔱' },
  { value: 'frame',        label: 'Decorative Frame',     emoji: '🖼️' },
];

export default function AdminUploadPage() {
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [form, setForm]         = useState({ title: '', category: 'wedding' as Category, price: '' });
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) { toast.error('Please select an image'); return; }
    if (!form.title.trim()) { toast.error('Please enter a title'); return; }
    if (!form.category) { toast.error('Please select a category'); return; }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('price', form.price || '0');

      const res = await fetch('/api/images', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      toast.success('Image uploaded successfully! 🎉');
      setFile(null);
      setPreview(null);
      setForm({ title: '', category: 'wedding', price: '' });
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6 }}>Upload Image</h1>
      <p style={{ color: 'var(--ink-soft)', marginBottom: 32, fontSize: 14 }}>
        Upload invitation images that will appear on your public gallery.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Drop Zone */}
        <div
          className={`upload-zone ${dragging ? 'drag-over' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div style={{ position: 'relative' }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  maxHeight: 280, borderRadius: 'var(--radius-md)',
                  objectFit: 'contain', margin: '0 auto',
                }}
              />
              <div style={{ marginTop: 12, color: 'var(--ink-soft)', fontSize: 13 }}>
                {file?.name} ({(file!.size / 1024 / 1024).toFixed(2)} MB)
              </div>
              <p style={{ color: 'var(--accent)', fontSize: 13, marginTop: 4 }}>
                Click to change image
              </p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📁</div>
              <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>
                Drag & drop an image here
              </p>
              <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>
                or click to browse · JPG, PNG, WEBP supported
              </p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
        </div>

        {/* Form fields */}
        <div className="glass" style={{ padding: 28 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Title */}
            <div>
              <label className="label">Design Title *</label>
              <input
                className="input-field"
                placeholder="e.g. Royal Gold Wedding Invitation"
                value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              />
            </div>

            {/* Category */}
            <div>
              <label className="label">Category *</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, category: cat.value }))}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${form.category === cat.value ? 'var(--accent)' : 'var(--border-soft)'}`,
                      background: form.category === cat.value ? 'var(--accent-glow)' : 'var(--surface)',
                      color: form.category === cat.value ? 'var(--accent)' : 'var(--ink-soft)',
                      fontWeight: 600,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: 20, marginBottom: 4 }}>{cat.emoji}</div>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="label">Price (₹) — leave 0 for free / display only</label>
              <input
                className="input-field"
                type="number"
                min="0"
                placeholder="0"
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
              />
              <p style={{ fontSize: 11, color: 'var(--ink-soft)', marginTop: 5 }}>
                Price is shown when Premium mode is enabled in Settings.
              </p>
            </div>

            <button
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '14px', fontSize: 15 }}
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <><div className="spinner" /> Uploading...</>
              ) : (
                '⬆️ Upload to Gallery'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
