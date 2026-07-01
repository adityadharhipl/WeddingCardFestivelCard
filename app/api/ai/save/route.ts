// app/api/ai/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { dbConnect } from '@/lib/mongoose';
import ImageModel from '@/models/Image';
import { getAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { svg, title, category, price } = await req.json();

    if (!svg || !title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save SVG string as file in public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const filename = `ai-${Date.now()}-${Math.random().toString(36).slice(2)}.svg`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, svg, 'utf-8');

    await dbConnect();
    const image = await ImageModel.create({
      title,
      category,
      imageUrl: `/uploads/${filename}`,
      price: price || 0,
    });

    return NextResponse.json({ success: true, image }, { status: 201 });
  } catch (error) {
    console.error('Save AI Card error:', error);
    return NextResponse.json({ error: 'Failed to save AI card' }, { status: 500 });
  }
}
