// app/api/images/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { unlink } from 'fs/promises';
import path from 'path';
import { dbConnect } from '@/lib/mongoose';
import ImageModel from '@/models/Image';
import { getAdminSession } from '@/lib/auth';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const image = await ImageModel.findById(id);
    if (!image) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // Try to delete physical file
    try {
      const filePath = path.join(process.cwd(), 'public', image.imageUrl);
      await unlink(filePath);
    } catch {
      // File may not exist; continue
    }

    await ImageModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
