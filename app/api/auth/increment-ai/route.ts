// app/api/auth/increment-ai/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import { getUserSession } from '@/lib/auth';

export async function POST() {
  try {
    await dbConnect();
    
    const userSession = await getUserSession();
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ email: userSession.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Increment count
    user.aiGenCount = (user.aiGenCount || 0) + 1;
    await user.save();

    return NextResponse.json({
      success: true,
      aiGenCount: user.aiGenCount,
    });
  } catch (error) {
    console.error('Increment AI count error:', error);
    return NextResponse.json({ error: 'Failed to increment AI count' }, { status: 500 });
  }
}
