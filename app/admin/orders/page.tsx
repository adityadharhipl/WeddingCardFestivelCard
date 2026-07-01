'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface OrderItem {
  imageId: string;
  title: string;
  price: number;
  imageUrl: string;
}

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  total: number;
  upiRef: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: '#f59e0b20', color: '#f59e0b', label: '⏳ Pending'   },
  confirmed: { bg: '#22c55e20', color: '#22c55e', label: '✅ Confirmed' },
  rejected:  { bg: '#ef444420', color: '#ef4444', label: '❌ Rejected'  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(r => r.json())
      .then(d => setOrders(d.orders || []))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: 'confirmed' | 'rejected') => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Update failed');
      toast.success(`Order ${status}!`);
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    } catch {
      toast.error('Failed to update order');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Orders</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
          {orders.length} total · {orders.filter(o => o.status === 'pending').length} pending
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--ink-soft)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg)', marginBottom: 8 }}>No orders yet</p>
          <p>Orders will appear here when customers checkout.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map((order, idx) => (
            <div
              key={order._id}
              className="glass anim-fade-up"
              style={{
                padding: 20,
                animationDelay: `${idx * 40}ms`,
                animationFillMode: 'both',
              }}
            >
              {/* Order Header */}
              <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 15 }}>{order.customerName}</p>
                    <p style={{ color: 'var(--ink-soft)', fontSize: 13 }}>{order.phone}</p>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 100,
                    background: STATUS_STYLES[order.status].bg,
                    color: STATUS_STYLES[order.status].color,
                    fontSize: 12, fontWeight: 600,
                    border: `1px solid ${STATUS_STYLES[order.status].color}40`,
                  }}>
                    {STATUS_STYLES[order.status].label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: 18 }}>
                    ₹{order.total}
                  </span>
                  <button
                    className="btn-ghost"
                    style={{ fontSize: 12, padding: '6px 14px' }}
                    onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                  >
                    {expanded === order._id ? 'Hide' : 'Details'}
                  </button>
                </div>
              </div>

              {/* UPI Ref */}
              <div style={{
                marginTop: 12,
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface)',
                border: '1px solid var(--border-soft)',
                fontSize: 13,
              }}>
                <span style={{ color: 'var(--ink-soft)' }}>UPI Ref:</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{order.upiRef}</span>
                <span style={{ color: 'var(--ink-soft)', marginLeft: 'auto', fontSize: 12 }}>
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
              </div>

              {/* Expanded details */}
              {expanded === order._id && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Items ({order.items.length})
                  </p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: 10, alignItems: 'center',
                        padding: '8px 12px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border-soft)',
                        borderRadius: 'var(--radius-md)',
                        minWidth: 180,
                      }}>
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                        />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</p>
                          <p style={{ fontSize: 12, color: 'var(--accent)' }}>₹{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {order.status === 'pending' && (
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    onClick={() => updateStatus(order._id, 'confirmed')}
                    disabled={updating === order._id}
                    style={{
                      padding: '9px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: '#22c55e',
                      color: '#fff', fontWeight: 600, fontSize: 13,
                      border: 'none', cursor: 'pointer', transition: 'var(--transition)',
                    }}
                  >
                    {updating === order._id ? '⏳' : '✅ Confirm Payment'}
                  </button>
                  <button
                    onClick={() => updateStatus(order._id, 'rejected')}
                    disabled={updating === order._id}
                    style={{
                      padding: '9px 20px',
                      borderRadius: 'var(--radius-md)',
                      background: '#ef444420',
                      color: '#ef4444',
                      border: '1px solid #ef444440',
                      fontWeight: 600, fontSize: 13,
                      cursor: 'pointer', transition: 'var(--transition)',
                    }}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
