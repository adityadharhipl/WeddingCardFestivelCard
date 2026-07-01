import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import { getUserSession, getAdminSession } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    // Determine the current session (can be either user or admin)
    const userSession = await getUserSession();
    const adminSession = await getAdminSession();
    const session = userSession || adminSession;

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    await dbConnect();
    
    // Hash the new password
    const hash = await bcrypt.hash(password, 12);
    
    // Find the user by their session email and update the password
    const user = await User.findOneAndUpdate(
      { email: session.email },
      { passwordHash: hash },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found in database' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
