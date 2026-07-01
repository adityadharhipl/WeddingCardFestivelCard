// app/api/ai/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { dbConnect } from '@/lib/mongoose';
import User from '@/models/User';
import { getUserSession, getAdminSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    // 1. Authenticate Request
    const adminSession = await getAdminSession();
    const userSession = await getUserSession();

    let isUserApproved = false;
    let currentUserEmail = '';
    let isAdmin = false;

    if (adminSession) {
      isAdmin = true;
      currentUserEmail = adminSession.email;
    } else if (userSession) {
      currentUserEmail = userSession.email;
      const user = await User.findOne({ email: userSession.email });
      if (!user) {
        return NextResponse.json({ error: 'User account not found' }, { status: 404 });
      }
      if (!user.isApproved) {
        return NextResponse.json({ error: 'Your account is pending approval by the Admin! ⏳ Please wait.' }, { status: 403 });
      }

      // Check limits
      const limit = user.isPremiumUser ? 10 : 4;
      if (user.aiGenCount >= limit) {
        return NextResponse.json({
          error: `AI generation limit of ${limit} reached! Please contact the admin to request more.`
        }, { status: 429 });
      }

      // Increment count
      user.aiGenCount = (user.aiGenCount || 0) + 1;
      await user.save();
    }

    // 2. Process generation
    const { eventType, names, date, venue, theme } = await req.json();

    const prompt = `You are a premium luxury card designer. Create an exquisite, professional-grade vector SVG invitation card for:
- Event: ${eventType}
- Celebrant Names: ${names}
- Date & Time: ${date}
- Venue Location: ${venue}
- Design Theme: ${theme}

Guidelines:
1. Return ONLY the raw SVG code, starting with <svg> and ending with </svg>. Do not wrap in markdown, do not write explanations, do not include any backticks.
2. The SVG must be responsive, use width="100%" height="100%" viewBox="0 0 800 1200".
3. Use a luxury dark background (#0b0c10) or matching theme. Use beautiful gradients, thin geometric borders, gold outlines (#D4AF37), and floral decorations.
4. Render all texts using SVG <text> nodes with x="50%" text-anchor="middle" to be perfectly centered.
5. Use different font sizes, weights, and letter-spacing for the header, names, date, and venue to look like a premium designer card.
6. Make sure it looks stunning, elegant, and ready for print.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let svg = response.data.choices[0].message.content.trim();
    
    // Strip markdown wrappers if any
    if (svg.includes('<svg')) {
      const start = svg.indexOf('<svg');
      const end = svg.lastIndexOf('</svg>') + 6;
      svg = svg.substring(start, end);
    }

    return NextResponse.json({ svg });
  } catch (error: any) {
    console.error('Groq AI Error:', error.response?.data || error.message);
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}
