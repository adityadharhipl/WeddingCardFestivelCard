// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import { getUserSession, getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    
    // Check user session
    const userSession = await getUserSession();
    if (userSession) {
      const user = await User.findOne({ email: userSession.email });
      if (user) {
        return NextResponse.json({
          authenticated: true,
          email: user.email,
          role: user.role,
          isApproved: user.isApproved,
          aiGenCount: user.aiGenCount || 0,
          isPremiumUser: user.isPremiumUser || false,
        });
      }
    }

    // Check admin session fallback
    const adminSession = await getAdminSession();
    if (adminSession) {
      const admin = await User.findOne({ email: adminSession.email });
      if (admin) {
        return NextResponse.json({
          authenticated: true,
          email: admin.email,
          role: admin.role,
          isApproved: true, // Admins are always approved
          aiGenCount: admin.aiGenCount || 0,
          isPremiumUser: true, // Admins are always premium
        });
      }
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Fetch current session error:', error);
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
