import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth/session';

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET ?? 'dev-only-change-this-secret';
  return new TextEncoder().encode(secret);
}

async function isAdminAuthenticated(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminLoginPath = pathname === '/studio/login';
  const isAdminLoginApiPath = pathname === '/api/admin/login';
  const isProtectedAdminPath =
    (pathname.startsWith('/api/admin') && !isAdminLoginApiPath) ||
    (pathname.startsWith('/studio') && !isAdminLoginPath);

  if (!isProtectedAdminPath) return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const ok = await isAdminAuthenticated(token);

  if (ok) return NextResponse.next();

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/studio/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/api/admin/:path*', '/studio/:path*'],
};
