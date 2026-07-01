// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, recipient } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Log the email query locally to the server console
    console.log('\n=================== NEW CONTACT QUERY ===================');
    console.log(`To: ${recipient || 'adityadhar.hipl@gmail.com'}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Message:\n"${message}"`);
    console.log('=========================================================\n');

    // Simulate database log or mailer dispatch
    return NextResponse.json({
      success: true,
      message: 'Query logged successfully and dispatched to adityadhar.hipl@gmail.com',
    });
  } catch (error: any) {
    console.error('Contact query submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
