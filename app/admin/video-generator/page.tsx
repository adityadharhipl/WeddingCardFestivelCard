'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import VideoGenerator from '@/components/VideoGenerator';

export default function AdminVideoGeneratorPage() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<{ email?: string; isApproved?: boolean } | null>(null);

  useEffect(() => {
    // Check admin session
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/profile');
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        if (data.role !== 'admin') throw new Error('Not admin');
        setAdminData(data);
      } catch {
        router.push('/admin/login');
      }
    };
    fetchProfile();
  }, [router]);

  if (!adminData) return <div style={{ padding: 40, color: 'var(--fg)' }}>Loading...</div>;

  return (
    <div style={{ padding: 40, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, color: 'var(--fg)' }}>Video Generator (Admin)</h1>
        <p style={{ color: 'var(--ink-soft)' }}>Create unlimited slideshow videos directly from the admin panel.</p>
      </div>

      <VideoGenerator 
        currentUser={{ isApproved: true, email: adminData.email }} 
        onNeedLogin={() => {}} 
        isAdmin={true} 
      />
    </div>
  );
}
