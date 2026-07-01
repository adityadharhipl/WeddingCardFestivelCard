// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import { signToken } from '@/lib/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@dwivedi.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    await dbConnect();

    // Seed default admin if no users exist
    const count = await User.countDocuments();
    if (count === 0) {
      const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
      await User.create({ email: ADMIN_EMAIL, passwordHash: hash, role: 'admin' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ email: user.email, role: user.role });

    const response = NextResponse.json({ success: true, role: user.role, isApproved: user.isApproved });
    
    if (user.role === 'admin') {
      response.cookies.set('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    } else {
      response.cookies.set('user_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_token');
  response.cookies.delete('user_token');
  return response;
}
