// app/api/images/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { dbConnect } from '@/lib/mongoose';
import ImageModel from '@/models/Image';
import { getAdminSession } from '@/lib/auth';

// GET – fetch images (optionally filtered by category)
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const filter = category ? { category } : {};
    const images = await ImageModel.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('GET images error:', error);
    return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
  }
}

// POST – upload a new image (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const price = parseFloat((formData.get('price') as string) || '0');

    if (!file || !title || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save file to public/uploads
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    await dbConnect();
    const image = await ImageModel.create({
      title,
      category,
      imageUrl: `/uploads/${filename}`,
      price,
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
