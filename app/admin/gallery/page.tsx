'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Category = 'all' | 'wedding' | 'birthday' | 'anniversary' | 'housewarming' | 'god' | 'frame' | 'festival';

interface GalleryImage {
  _id: string;
  title: string;
  category: string;
  imageUrl: string;
  price: number;
  createdAt: string;
}

const TABS: { id: Category; label: string; emoji: string }[] = [
  { id: 'all',          label: 'All',          emoji: '📷' },
  { id: 'wedding',      label: 'Wedding',      emoji: '💍' },
  { id: 'birthday',     label: 'Birthday',     emoji: '🎂' },
  { id: 'anniversary',  label: 'Anniversary',  emoji: '🌹' },
  { id: 'housewarming', label: 'Housewarming', emoji: '🏡' },
  { id: 'festival',     label: 'Festival',     emoji: '✨' },
  { id: 'god',          label: 'God Pic',      emoji: '🔱' },
  { id: 'frame',        label: 'Frames',       emoji: '🖼️' },
];

export default function AdminGalleryPage() {
  const [activeTab, setActiveTab] = useState<Category>('all');
  const [images, setImages]       = useState<GalleryImage[]>([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState<string | null>(null);
  
  // Custom confirmation modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const url = activeTab === 'all' ? '/api/images' : `/api/images?category=${activeTab}`;
      const res = await fetch(url);
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, [activeTab]);

  const executeDelete = async (id: string) => {
    setDeleting(id);
    setConfirmDeleteId(null);
    const toastId = toast.loading('Deleting card from gallery...');
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      toast.success('Card template deleted! 🗑️', { id: toastId });
      setImages(prev => prev.filter(i => i._id !== id));
    } catch {
      toast.error('Failed to delete image', { id: toastId });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Gallery</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
            {images.length} image{images.length !== 1 ? 's' : ''} in {activeTab} category
          </p>
        </div>
        <a href="/admin/upload" className="btn-primary" style={{ fontSize: 13 }}>
          ⬆️ Upload New
        </a>
      </div>

      {/* Filter Tabs */}
      <div className="tab-bar" style={{ marginBottom: 28, maxWidth: 480 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ padding: '9px 14px', fontSize: 13 }}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="gallery-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="shimmer" style={{ borderRadius: 'var(--radius-lg)', aspectRatio: '3/4' }} />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📷</div>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg)', marginBottom: 8 }}>
            No images yet
          </p>
          <p style={{ marginBottom: 20 }}>Upload your first image to get started.</p>
          <a href="/admin/upload" className="btn-primary">Upload Image</a>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((img, idx) => (
            <div
              key={img._id}
              className="gallery-card anim-fade-up"
              style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
            >
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0b0c10' }}
                />
                {/* Category badge */}
                <span style={{
                  position: 'absolute', top: 10, left: 10,
                  background: '#0b0c10cc', backdropFilter: 'blur(8px)',
                  border: '1px solid var(--border-soft)',
                  borderRadius: 100, padding: '3px 8px',
                  fontSize: 11, fontWeight: 600, color: 'var(--accent)',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  {img.category}
                </span>
                {/* Delete button overlay */}
                <div style={{
                  position: 'absolute', top: 10, right: 10,
                }}>
                  <button
                    onClick={() => setConfirmDeleteId(img._id)}
                    disabled={deleting === img._id}
                    style={{
                      width: 32, height: 32,
                      borderRadius: '50%',
                      background: '#ef4444d0',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid #ef444460',
                      color: '#fff', fontSize: 14,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'var(--transition)',
                    }}
                    title="Delete image"
                  >
                    {deleting === img._id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{img.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ color: 'var(--ink-soft)', fontSize: 12 }}>
                    {new Date(img.createdAt).toLocaleDateString('en-IN')}
                  </p>
                  {img.price > 0 && (
                    <p style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 14 }}>
                      ₹{img.price}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Custom Delete Confirmation Modal ───────────────────────── */}
      {confirmDeleteId && (
        <div className="modal-backdrop" onClick={() => setConfirmDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 440 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ fontSize: 40, marginBottom: 16, textAlign: 'center' }}>⚠️</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, textAlign: 'center', color: 'var(--fg)' }}>
                Delete Invitation Card?
              </h2>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.5, textAlign: 'center', marginBottom: 24 }}>
                Are you sure you want to delete this template from the public gallery database? This action cannot be undone.
              </p>
              
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: 'center', background: 'var(--surface-2)', padding: 12 }}
                  onClick={() => setConfirmDeleteId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', background: '#ef4444', borderColor: '#ef4444', padding: 12 }}
                  onClick={() => executeDelete(confirmDeleteId)}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
