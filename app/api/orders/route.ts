// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongoose';
import Order from '@/models/Order';
import { getAdminSession } from '@/lib/auth';

// GET – admin list all orders
export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json({ orders });
  } catch (error) {
    console.error('GET orders error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST – create new order from checkout
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, items, total, upiRef } = body;

    if (!customerName || !phone || !items?.length || !total || !upiRef) {
      return NextResponse.json({ error: 'Missing required order fields' }, { status: 400 });
    }

    await dbConnect();
    const order = await Order.create({ customerName, phone, items, total, upiRef });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('POST order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
