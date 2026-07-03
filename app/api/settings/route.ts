// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Settings from '@/models/Settings';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        isPremium: false,
        enableMultiPageCard: true,
        upiId: '',
        siteName: "Dwivedi's Enterprise",
        upiName: 'Dwivedi Store',
        defaultNames: 'Rahul & Priya',
        defaultDate: 'November 26, 2026 at 7:00 PM',
        defaultVenue: 'Royal Orchid Banquet, New Delhi',
        defaultStyle: 'royal_gold',
      });
    }
    return NextResponse.json({ settings });
  } catch (error) {
    console.error('GET settings error:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('PUT settings error:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
