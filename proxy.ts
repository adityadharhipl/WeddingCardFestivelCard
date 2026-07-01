// proxy.ts  (Next.js 16 uses "proxy" instead of "middleware")
import { type NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin/* routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('admin_token')?.value;
    if (!token || !verifyToken(token)) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
