// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import { getAdminSession } from '@/lib/auth';

// Middleware admin check helper
async function checkAdmin() {
  const session = await getAdminSession();
  if (!session || session.role !== 'admin') {
    return false;
  }
  return session;
}

export async function GET() {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    // Return all users except system admins
    const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, isApproved, isPremiumUser, aiGenCount } = await req.json();
    await dbConnect();

    const updateFields: any = {};
    if (isApproved !== undefined) updateFields.isApproved = isApproved;
    if (isPremiumUser !== undefined) updateFields.isPremiumUser = isPremiumUser;
    if (aiGenCount !== undefined) updateFields.aiGenCount = aiGenCount;

    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error('Update user attributes error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
